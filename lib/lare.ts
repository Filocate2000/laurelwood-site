import { createClient } from "@supabase/supabase-js";

/**
 * Read-only port of misraje-site/lib/lare.ts. laurelwood-site reads the SAME
 * lare_reports rows under the SAME brokerage_id so it displays identical content
 * and the complete existing archive immediately. This file performs NO writes:
 * no ingest route, no Lambda, no service/admin key. Reads use the public anon
 * key (RLS allows anon SELECT on lare_reports).
 */

/**
 * Misraje brokerage ID, used as the tenant filter for every report query.
 * Matches NEXT_PUBLIC_MISRAJE_BROKERAGE_ID env var; hardcoded fallback ensures
 * pages render even if the env var is unset (defensive default). This is the
 * EXACT same brokerage_id misraje-site filters by, so both sites surface the
 * same reports.
 */
const MISRAJE_BROKERAGE_ID =
  process.env.NEXT_PUBLIC_MISRAJE_BROKERAGE_ID ??
  "4796aec0-1843-4a30-80ba-871a994604b1";

/**
 * Public anon Supabase client for reading published reports. RLS policy on
 * lare_reports allows anon SELECT. Server-side only (not exposed to client).
 * Uses the shared NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env
 * vars (same Supabase project as misraje-site).
 */
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/**
 * Wix's CMS editor inserted <p>&nbsp;</p> as visual spacers between sections.
 * These create excessive whitespace because our CSS already provides
 * element-level margins. This strips them at read time so the cleanup applies
 * to both backfilled rows AND future Lambda-ingested rows that mirror the Wix
 * HTML shape. Pattern matches <p> tags containing only whitespace, &nbsp;
 * entities, or <br> tags in any combination.
 */
function stripSpacerParagraphs(html: string): string {
  if (!html) return html;
  return html.replace(/<p[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "");
}

/**
 * Pulls the text from the first <h2> in the HTML and returns it as a plain
 * string with inner tags stripped. Used for the archive-page hero title so
 * each article displays its specific headline ("Strong Job Gains Support
 * Stability...") rather than the generic "The LARE Report.". Returns null
 * if no <h2> is found.
 */
function extractHeadline(html: string): string | null {
  if (!html) return null;
  const match = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (!match) return null;
  // Strip any inner tags (e.g. <strong>, <em>) and decode &nbsp;/&amp;/&quot;
  return match[1]
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim() || null;
}

/**
 * Removes the first <h2> (and its content) from the HTML. Used on archive
 * pages so the headline isn't shown twice: once in the hero (via extractHeadline)
 * and once at the top of the report body. Landing-page rendering keeps the
 * full HTML intact since the landing hero uses the generic "The LARE Report."
 * title and the body should still lead with the article's <h2>.
 */
function stripFirstH2(html: string): string {
  if (!html) return html;
  return html.replace(/<h2[^>]*>[\s\S]*?<\/h2>\s*/i, "");
}

/**
 * Wix-authored reports lead with a "Last Update: <date>" paragraph that
 * duplicates the dateline we render separately via the publish_date column.
 * Strip it at read time so we have a single source of truth for the date.
 * Pattern is tolerant: matches with or without <strong> wrapping, with any
 * date format, with optional leading whitespace or &nbsp;.
 */
function stripLastUpdate(html: string): string {
  if (!html) return html;
  return html.replace(/<p[^>]*>(?:\s|&nbsp;)*(?:<strong>)?\s*Last Update:[\s\S]*?<\/p>\s*/i, "");
}

/**
 * Strips the Wix-flavored signature <div> block from html_content. The
 * Lambda's OpenAI prompt still emits this block for the Wix sites (which need
 * it baked in), but these pages render signatures via the <SignatureBlock />
 * React component. Without stripping, signatures would appear twice on every
 * report. Matches the opening div by its distinctive flex+align-items inline
 * style and walks to the matching closing tag. Also strips trailing spacer
 * paragraphs above the signature so we don't leave a gap.
 */
function stripSignatureBlock(html: string): string {
  if (!html) return html;
  const openMatch = html.match(/<div style="display:flex;align-items:flex-start;[^"]*">/i);
  if (!openMatch) return html;
  const start = openMatch.index ?? -1;
  if (start < 0) return html;

  // Walk character-by-character tracking div depth to find matching </div>
  let depth = 0;
  let i = start;
  while (i < html.length) {
    if (html.substring(i, i + 4).toLowerCase() === "<div") {
      depth += 1;
      const closeBracket = html.indexOf(">", i);
      if (closeBracket === -1) break;
      i = closeBracket + 1;
    } else if (html.substring(i, i + 6).toLowerCase() === "</div>") {
      depth -= 1;
      i += 6;
      if (depth === 0) {
        // Also strip trailing whitespace and Wix spacer paragraphs above
        const before = html.substring(0, start).replace(/(?:<p>(?:\s|&nbsp;)*<\/p>\s*)+$/, "").trimEnd();
        const after = html.substring(i).trimStart();
        return (before + after).trim();
      }
    } else {
      i += 1;
    }
  }
  return html;
}

export type LareReport = {
  id: string;
  brokerage_id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  html_content: string;
  meta_description: string | null;
  publish_date: string;
  is_latest: boolean;
  s3_key: string | null;
  ai_model: string | null;
  /**
   * Derived at read time: the first <h2> text from html_content, used as the
   * article-specific headline on archive pages (e.g., "Strong Job Gains Support
   * Stability Amid Middle East Conflict"). Null if the HTML has no <h2>, in
   * which case callers should fall back to the generic title. NOT a database
   * column, populated by extractHeadline() in getLareReportBySlug.
   */
  headline: string | null;
};

/**
 * Fetches the single most recent published report for the Misraje brokerage.
 * Uses the is_latest=true flag (set by the ingest endpoint) for cheap lookup.
 * Returns null if no reports exist yet, so the page can render an empty state.
 */
export async function getLatestLareReport(): Promise<LareReport | null> {
  const supabase = publicClient();

  const { data, error } = await supabase
    .from("lare_reports")
    .select("id, brokerage_id, slug, title, excerpt, html_content, meta_description, publish_date, is_latest, s3_key, ai_model")
    .eq("brokerage_id", MISRAJE_BROKERAGE_ID)
    .eq("is_latest", true)
    .maybeSingle();

  if (error) {
    console.error("getLatestLareReport error:", error);
    return null;
  }

  if (!data) return null;
  const row = data as LareReport;
  const cleanHtml = stripSignatureBlock(stripLastUpdate(stripSpacerParagraphs(row.html_content)));
  return {
    ...row,
    html_content: cleanHtml,
    headline: extractHeadline(cleanHtml),
  };
}

/**
 * Fetches a single report by slug for the archive route /lare-report/[slug].
 * Returns null if not found so the dynamic route can call notFound().
 */
export async function getLareReportBySlug(slug: string): Promise<LareReport | null> {
  const supabase = publicClient();

  const { data, error } = await supabase
    .from("lare_reports")
    .select("id, brokerage_id, slug, title, excerpt, html_content, meta_description, publish_date, is_latest, s3_key, ai_model")
    .eq("brokerage_id", MISRAJE_BROKERAGE_ID)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getLareReportBySlug error:", error);
    return null;
  }

  if (!data) return null;
  const row = data as LareReport;
  const cleanHtml = stripSignatureBlock(stripLastUpdate(stripSpacerParagraphs(row.html_content)));
  const headline = extractHeadline(cleanHtml);
  return {
    ...row,
    html_content: stripFirstH2(cleanHtml),
    headline,
  };
}

/**
 * Lightweight list of recent reports for sidebar/archive UI. Returns only the
 * fields needed for display (no html_content, which can be ~10KB per row).
 * Default limit of 12 covers roughly 3 months of weekly reports.
 */
export type LareReportSummary = Pick<LareReport, "id" | "slug" | "title" | "excerpt" | "publish_date" | "headline">;

export async function getRecentLareReports(limit: number = 12): Promise<LareReportSummary[]> {
  const supabase = publicClient();

  // Include html_content so we can extract a per-row headline for sidebar
  // display. Without it, every archive entry would read "The LARE Report",
  // giving readers no signal about content. The ~72KB cost (12 rows x ~6KB)
  // is acceptable for a server-rendered sidebar.
  const { data, error } = await supabase
    .from("lare_reports")
    .select("id, slug, title, excerpt, publish_date, html_content")
    .eq("brokerage_id", MISRAJE_BROKERAGE_ID)
    .order("publish_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentLareReports error:", error);
    return [];
  }

  // Map rows to summaries, deriving the headline from the HTML at read time.
  // Falls back to the generic title if extraction fails (rare edge case).
  return ((data as (LareReport & { html_content: string })[]) ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    publish_date: row.publish_date,
    headline: extractHeadline(stripSignatureBlock(stripLastUpdate(stripSpacerParagraphs(row.html_content)))),
  }));
}

/**
 * Slim slug + publish_date list for every published report, for the sitemap.
 * Unlike getRecentLareReports this does NOT pull html_content, so it stays
 * cheap across the full archive.
 */
export async function getAllLareReportSlugs(): Promise<
  { slug: string; publish_date: string }[]
> {
  const supabase = publicClient();

  const { data, error } = await supabase
    .from("lare_reports")
    .select("slug, publish_date")
    .eq("brokerage_id", MISRAJE_BROKERAGE_ID)
    .order("publish_date", { ascending: false });

  if (error) {
    console.error("getAllLareReportSlugs error:", error);
    return [];
  }

  return (data as { slug: string; publish_date: string }[]) ?? [];
}

/**
 * Format a Postgres timestamptz as a clean Pacific-time date string for display.
 * Example: "May 22, 2026". Used in report headers and archive lists.
 */
export function formatReportDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
