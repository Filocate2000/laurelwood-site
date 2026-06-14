import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY as string;
const INGEST_SHARED_SECRET = process.env.INGEST_SHARED_SECRET ?? "";
const GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY ?? "";

// --- comp-audit assignment integration ---------------------------------------
// Base URL used to build the deep link returned to the PACE reviewer. Set this
// in laurelwood-site's Vercel env to the domain where the assignment queue is
// viewed (the app that renders /brokerage/assignments). If unset, the route
// still creates the assignment; assignment_url just comes back empty and the
// reviewer email omits the button until you set it.
const APP_BASE_URL = process.env.APP_BASE_URL ?? "";
const MISRAJE_BROKERAGE_ID =
  process.env.MISRAJE_BROKERAGE_ID ?? "852d9bdd-4293-42e1-8833-f35273dc08e7";
// -----------------------------------------------------------------------------

type AnyRow = Record<string, unknown>;

function secretMatches(supplied: string | null): boolean {
  if (!INGEST_SHARED_SECRET || !supplied) return false;
  const a = Buffer.from(supplied);
  const b = Buffer.from(INGEST_SHARED_SECRET);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function put(obj: AnyRow, key: string, val: unknown): void {
  if (val === null || val === undefined) return;
  if (typeof val === "string" && val.trim() === "") return;
  obj[key] = val;
}

function toInt(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Math.trunc(Number(String(v).replace(/[, ]/g, "")));
  return Number.isFinite(n) ? n : null;
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[$,%\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function toIsoDate(v: unknown): string | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return null;
}

function splitAddress(addr: string): { number: string | null; name: string | null } {
  const s = (addr || "").trim();
  const m = s.match(/^(\d+[A-Za-z]?)\s+(.+)$/);
  if (m) return { number: m[1], name: m[2].trim() };
  return { number: null, name: s || null };
}

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!GEOCODING_API_KEY) return null;
  try {
    const q = encodeURIComponent(`${address}, Studio City, CA`);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${q}&key=${GEOCODING_API_KEY}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const resp = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!resp.ok) return null;
    const data = (await resp.json()) as {
      status?: string;
      results?: Array<{ geometry?: { location?: { lat?: number; lng?: number } } }>;
    };
    if (data.status !== "OK" || !data.results || data.results.length === 0) return null;
    const loc = data.results[0]?.geometry?.location;
    if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") return null;
    return { lat: loc.lat, lng: loc.lng };
  } catch {
    return null;
  }
}

const AGENT_FIELDS: Array<[string, string]> = [
  ["sellersAgent1", "seller_agent1"],
  ["sellersAgent1Email", "seller_agent1_email"],
  ["sellersAgent1Phone", "seller_agent1_phone"],
  ["sellersAgent1Company", "seller_agent1_company"],
  ["sellersAgent2", "seller_agent2"],
  ["sellersAgent2Email", "seller_agent2_email"],
  ["sellersAgent2Phone", "seller_agent2_phone"],
  ["sellersAgent2Company", "seller_agent2_company"],
  ["buyersAgent1", "buyer_agent1"],
  ["buyersAgent1Email", "buyer_agent1_email"],
  ["buyersAgent1Phone", "buyer_agent1_phone"],
  ["buyersAgent1Company", "buyer_agent1_company"],
  ["buyersAgent2", "buyer_agent2"],
  ["buyersAgent2Email", "buyer_agent2_email"],
  ["buyersAgent2Phone", "buyer_agent2_phone"],
  ["buyersAgent2Company", "buyer_agent2_company"],
];

function buildListingRow(l: AnyRow, fallbackHood: string): AnyRow {
  const row: AnyRow = {};
  const loc = String(l.location ?? "").trim();
  const hood = loc && loc !== "Unknown" ? loc : fallbackHood;
  put(row, "neighborhood", hood);
  put(row, "mls_number", String(l.mlsNumber ?? "").trim() || null);
  const addr = String(l.address ?? "").trim();
  put(row, "address_formatted", addr || null);
  const sp = splitAddress(addr);
  put(row, "street_number", sp.number);
  put(row, "street_name", sp.name);
  put(row, "city", String(l.city ?? "").trim() || null);
  put(row, "bedrooms", toInt(l.br));
  put(row, "bathrooms", toNum(l.baths));
  put(row, "sqft", toInt(l.sqFt));
  put(row, "lot_size", toInt(l.lotSz));
  put(row, "year_built", toInt(l.yb));
  put(row, "pool", String(l.pool ?? "").trim() || null);
  put(row, "dom", toInt(l.dom));
  put(row, "change_type", String(l.changeType ?? "").trim() || null);
  put(row, "status_label", String(l.statusLabel ?? "").trim() || null);
  put(row, "change_date", toIsoDate(l.changeDate));
  put(row, "list_price", toNum(l.lp));
  put(row, "current_price", toNum(l.currentPrice ?? l.lp));
  put(row, "sale_price", toNum(l.salePrice ?? l.sp));
  put(row, "lp_per_sqft", toNum(l.lpSqFt));
  put(row, "sp_lp_ratio", toNum(l.spLpRatio));
  put(row, "description", String(l.description ?? "").trim() || null);
  for (const [src, dst] of AGENT_FIELDS) {
    put(row, dst, String(l[src] ?? "").trim() || null);
  }
  row.updated_at = new Date().toISOString();
  return row;
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

async function upsertListing(row: AnyRow): Promise<{ ok: boolean; error?: string }> {
  try {
    if (row.mls_number) {
      const { error } = await supabase
        .from("laurelwood_listings")
        .upsert(row, { onConflict: "mls_number" });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }
    const { data: existing } = await supabase
      .from("laurelwood_listings")
      .select("id")
      .eq("neighborhood", row.neighborhood as string)
      .eq("address_formatted", (row.address_formatted as string) ?? "")
      .is("mls_number", null)
      .limit(1)
      .maybeSingle();
    if (existing && (existing as { id: number }).id) {
      const { error } = await supabase
        .from("laurelwood_listings")
        .update(row)
        .eq("id", (existing as { id: number }).id);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }
    const { error } = await supabase.from("laurelwood_listings").insert(row);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function handleListings(body: AnyRow) {
  const listings = Array.isArray(body.listings) ? (body.listings as AnyRow[]) : [];
  const fallbackHood = String(body.neighborhood ?? "");
  let geocoded = 0;

  const rows = await Promise.all(
    listings.map(async (l) => {
      const row = buildListingRow(l, fallbackHood);
      const addr = row.address_formatted;
      if (addr && GEOCODING_API_KEY) {
        const geo = await geocode(String(addr));
        if (geo) {
          row.latitude = geo.lat;
          row.longitude = geo.lng;
          geocoded += 1;
        }
      }
      return row;
    })
  );

  const results = await Promise.all(rows.map((r) => upsertListing(r)));
  const upserted = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);

  return NextResponse.json({
    ok: true,
    mode: "listings",
    received: listings.length,
    upserted,
    failed: failed.length,
    geocoded,
    errors: failed.slice(0, 10).map((f) => f.error),
  });
}

async function handleCommentary(body: AnyRow) {
  const row: AnyRow = {};
  put(row, "neighborhood", String(body.neighborhood ?? "").trim() || null);
  put(row, "report_subject", body.reportSubject);
  put(row, "listing_count", toInt(body.listingCount));
  put(row, "avg_price", toNum(body.avgPrice));
  put(row, "avg_ppsf", toNum(body.avgPpsf));
  put(row, "market_snapshot", body.marketSnapshot);
  put(row, "active_listings_analysis", body.activeListingsAnalysis);
  put(row, "under_contract_analysis", body.underContractAnalysis);
  put(row, "recent_sales_analysis", body.recentSalesAnalysis);
  put(row, "detailed_analysis", body.detailedAnalysis);
  const nowIso = new Date().toISOString();
  row.report_date = nowIso;
  row.updated_at = nowIso;

  if (!row.neighborhood) {
    return NextResponse.json(
      { ok: false, error: "commentary payload missing neighborhood" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("laurelwood_commentary")
    .upsert(row, { onConflict: "neighborhood" });

  if (error) {
    return NextResponse.json({ ok: false, mode: "commentary", error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, mode: "commentary", neighborhood: row.neighborhood });
}

// ============================================================================
// comp_audit_concern  -  PACE comp-audit -> assignment (Phase A)
// Inserts a `review` assignment into the shared `assignment` table for each
// surfaced comp concern. Idempotent on metadata.concern_key (ignoring soft-
// deleted rows). property_id / action_plan_item_id / assigned_by_user_id left
// NULL. Reuses the module `supabase` client and the x-ingest-secret auth above.
// ============================================================================

const PRIORITY_BY_CONCERN: Record<string, "urgent" | "high" | "normal" | "low"> = {
  high: "urgent",
  medium: "high",
  low: "normal",
  none: "low",
};

function buildConcernDescription(c: AnyRow): string {
  const lines: string[] = [];
  const headline = String(c.headline ?? "").trim();
  const reportSays = String(c.report_says ?? "").trim();
  const why = String(c.why ?? "").trim();
  const whatToConfirm = String(c.what_to_confirm ?? "").trim();
  const setAside = Array.isArray(c.set_aside) ? (c.set_aside as AnyRow[]) : [];

  if (headline) lines.push(headline);
  if (reportSays) lines.push(`What the report says: ${reportSays}`);
  if (why) lines.push(`Why it matters: ${why}`);
  if (whatToConfirm) lines.push(`Confirm: ${whatToConfirm}`);
  if (setAside.length) {
    lines.push("Other sales worth knowing about:");
    for (const s of setAside.slice(0, 4)) {
      const ppsf = toNum(s.ppsf);
      const price = ppsf !== null ? `$${Math.round(ppsf)}/sq ft` : "price n/a";
      const note = String(s.note ?? "").trim();
      lines.push(`- ${String(s.address ?? "").trim()} at ${price}${note ? ` (${note})` : ""}`);
    }
  }
  return lines.join("\n").trim();
}

function buildAssignmentUrl(id: string): string {
  const base = (APP_BASE_URL || "").replace(/\/+$/, "");
  // Confirm this path matches where a single assignment is opened in the app.
  return base ? `${base}/brokerage/assignments/${id}` : "";
}

async function handleCompAuditConcern(body: AnyRow) {
  const c = (body.concern ?? {}) as AnyRow;
  const concernKey = String(c.concern_key ?? "").trim();
  const subjectAddress = String(c.subject_address ?? "").trim();
  const neighborhood = String(body.neighborhood ?? "").trim();
  const brokerageId = String(body.brokerage_id ?? MISRAJE_BROKERAGE_ID).trim();

  if (!concernKey) {
    return NextResponse.json(
      { ok: false, error: "comp_audit_concern missing concern.concern_key" },
      { status: 400 }
    );
  }
  if (!subjectAddress) {
    return NextResponse.json(
      { ok: false, error: "comp_audit_concern missing concern.subject_address" },
      { status: 400 }
    );
  }

  // idempotency: re-fired audits map to the same concern_key. Ignore soft-
  // deleted rows so a deleted one can be recreated.
  try {
    const { data: existing, error: selErr } = await supabase
      .from("assignment")
      .select("id")
      .eq("brokerage_id", brokerageId)
      .eq("metadata->>concern_key", concernKey)
      .is("deleted_at", null)
      .limit(1)
      .maybeSingle();

    if (!selErr && existing && (existing as { id: string }).id) {
      const id = (existing as { id: string }).id;
      return NextResponse.json({
        ok: true,
        mode: "comp_audit_concern",
        created: false,
        assignment_id: id,
        assignment_url: buildAssignmentUrl(id),
      });
    }
  } catch {
    // non-fatal: fall through to insert (a rare duplicate beats dropping it)
  }

  const concernLevel = String(c.concern_level ?? "low");
  const priority = PRIORITY_BY_CONCERN[concernLevel] ?? "normal";

  const metadata: AnyRow = {
    source: "comp_audit",
    concern_key: concernKey,
    neighborhood,
    subject_address: subjectAddress,
    bucket: c.bucket ?? null,
    concern_level: concernLevel,
    operative_comp: c.operative_comp ?? null,
    set_aside: Array.isArray(c.set_aside) ? c.set_aside : [],
    audit_s3_key: c.audit_s3_key ?? null,
    audit_generated_at: c.audit_generated_at ?? null,
    // Phase 2: narrative, rich property cards, and which comps the concern
    // references (the page auto-expands those descriptions). Stored as-is.
    concern: {
      headline: c.headline ?? null,
      report_says: c.report_says ?? null,
      why: c.why ?? null,
      what_to_confirm: c.what_to_confirm ?? null,
    },
    properties: c.properties ?? null,
    references: Array.isArray(c.references) ? c.references : [],
  };

  const row: AnyRow = {
    brokerage_id: brokerageId,
    assignment_kind: "review",
    title: `${neighborhood} - ${subjectAddress}`.slice(0, 200),
    description: buildConcernDescription(c),
    priority,
    status: "open",
    metadata,
  };
  put(row, "assigned_to_user_id", body.assignee_user_id);

  const { data: inserted, error: insErr } = await supabase
    .from("assignment")
    .insert(row)
    .select("id")
    .single();

  if (insErr) {
    return NextResponse.json(
      { ok: false, mode: "comp_audit_concern", error: insErr.message },
      { status: 500 }
    );
  }

  const id = (inserted as { id: string }).id;
  return NextResponse.json({
    ok: true,
    mode: "comp_audit_concern",
    created: true,
    assignment_id: id,
    assignment_url: buildAssignmentUrl(id),
  });
}

// ============================================================================
// Regeneration loop: run snapshots + standing instructions
//
// Two tables, written/read ONLY through these modes (the Lambda never touches
// Supabase directly). The route expects these columns:
//   commentary_run_snapshot(neighborhood text, stats jsonb, listings jsonb,
//                           report_date timestamptz default now())
//   commentary_instruction(neighborhood text, section text null,
//                          instruction text, created_by text null,
//                          active boolean default true,
//                          created_at timestamptz default now())
// Auth is the same x-ingest-secret used everywhere else (POST enforces it before
// dispatch; the GET handlers re-check it themselves). "Instructions replace,
// never stack" is enforced in handleSaveInstruction: a save retires prior active
// rows for the SAME (neighborhood, section) scope before inserting the new one.
// ============================================================================

async function handleSaveRunSnapshot(body: AnyRow) {
  const neighborhood = String(body.neighborhood ?? "").trim();
  if (!neighborhood) {
    return NextResponse.json(
      { ok: false, mode: "save_run_snapshot", error: "missing neighborhood" },
      { status: 400 }
    );
  }
  const stats =
    body.stats && typeof body.stats === "object" ? body.stats : {};
  const listings =
    body.listings && typeof body.listings === "object" ? body.listings : {};

  const { data, error } = await supabase
    .from("commentary_run_snapshot")
    .insert({ neighborhood, stats, listings })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, mode: "save_run_snapshot", error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json({
    ok: true,
    mode: "save_run_snapshot",
    neighborhood,
    snapshot_id: (data as { id: string }).id,
  });
}

async function handleGetRunSnapshot(
  req: NextRequest,
  searchParams: URLSearchParams
) {
  const supplied = req.headers.get("x-ingest-secret");
  if (!secretMatches(supplied)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const neighborhood = (searchParams.get("neighborhood") ?? "").trim();
  if (!neighborhood) {
    return NextResponse.json(
      { ok: false, mode: "get_run_snapshot", error: "missing neighborhood" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("commentary_run_snapshot")
    .select("stats,listings,report_date")
    .eq("neighborhood", neighborhood)
    .order("report_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, mode: "get_run_snapshot", error: error.message },
      { status: 500 }
    );
  }
  if (!data) {
    return NextResponse.json({
      ok: true,
      mode: "get_run_snapshot",
      neighborhood,
      snapshot: null,
    });
  }
  const row = data as AnyRow;
  return NextResponse.json({
    ok: true,
    mode: "get_run_snapshot",
    neighborhood,
    snapshot: {
      stats: row.stats ?? {},
      listings: row.listings ?? {},
      report_date: row.report_date ?? null,
    },
  });
}

async function handleSaveInstruction(body: AnyRow) {
  const neighborhood = String(body.neighborhood ?? "").trim();
  const instruction = String(body.instruction ?? "").trim();
  const sectionRaw = String(body.section ?? "").trim();
  const section = sectionRaw ? sectionRaw : null;
  const createdByRaw = String(body.created_by ?? "").trim();
  const createdBy = createdByRaw ? createdByRaw : null;

  if (!neighborhood) {
    return NextResponse.json(
      { ok: false, mode: "save_instruction", error: "missing neighborhood" },
      { status: 400 }
    );
  }
  if (!instruction) {
    return NextResponse.json(
      { ok: false, mode: "save_instruction", error: "missing instruction" },
      { status: 400 }
    );
  }

  // Replace, never stack: retire prior active rows for the SAME scope
  // (neighborhood + section). A whole-report instruction (section null) only
  // retires prior whole-report rows; a section-scoped one only retires that
  // section's rows. PostgREST needs .is() for null and .eq() for a value.
  let retire = supabase
    .from("commentary_instruction")
    .update({ active: false })
    .eq("neighborhood", neighborhood)
    .eq("active", true);
  retire =
    section === null ? retire.is("section", null) : retire.eq("section", section);
  const { error: retireErr } = await retire;
  if (retireErr) {
    return NextResponse.json(
      { ok: false, mode: "save_instruction", error: retireErr.message },
      { status: 500 }
    );
  }

  const insertRow: AnyRow = {
    neighborhood,
    section,
    instruction,
    active: true,
  };
  put(insertRow, "created_by", createdBy);

  const { data, error } = await supabase
    .from("commentary_instruction")
    .insert(insertRow)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, mode: "save_instruction", error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json({
    ok: true,
    mode: "save_instruction",
    neighborhood,
    section,
    instruction_id: (data as { id: string }).id,
  });
}

async function handleGetInstructions(
  req: NextRequest,
  searchParams: URLSearchParams
) {
  const supplied = req.headers.get("x-ingest-secret");
  if (!secretMatches(supplied)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const neighborhood = (searchParams.get("neighborhood") ?? "").trim();
  if (!neighborhood) {
    return NextResponse.json(
      { ok: false, mode: "get_instructions", error: "missing neighborhood" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("commentary_instruction")
    .select("section,instruction")
    .eq("neighborhood", neighborhood)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { ok: false, mode: "get_instructions", error: error.message },
      { status: 500 }
    );
  }
  const instructions = ((data ?? []) as AnyRow[]).map((r) => ({
    section: (r.section ?? null) as string | null,
    instruction: String(r.instruction ?? ""),
  }));
  return NextResponse.json({
    ok: true,
    mode: "get_instructions",
    neighborhood,
    instructions,
  });
}

export async function POST(req: NextRequest) {
  try {
    const supplied = req.headers.get("x-ingest-secret");
    if (!secretMatches(supplied)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    let body: AnyRow;
    try {
      body = (await req.json()) as AnyRow;
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    // comp-audit concern -> assignment (checked first, explicit mode field)
    if (body.mode === "comp_audit_concern") {
      return await handleCompAuditConcern(body);
    }

    // Regeneration loop writes (explicit mode field). The default POST (no
    // mode) stays the commentary write, so the comp-audit and commentary
    // paths below are untouched.
    if (body.mode === "save_run_snapshot") {
      return await handleSaveRunSnapshot(body);
    }
    if (body.mode === "save_instruction") {
      return await handleSaveInstruction(body);
    }

    if (Array.isArray(body.listings)) {
      return await handleListings(body);
    }
    if (
      body.marketSnapshot !== undefined ||
      body.activeListingsAnalysis !== undefined ||
      body.recentSalesAnalysis !== undefined
    ) {
      return await handleCommentary(body);
    }

    return NextResponse.json(
      { ok: false, error: "Unrecognized payload: expected a listings array or commentary fields" },
      { status: 400 }
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode");

  // Regeneration loop reads.
  if (mode === "get_run_snapshot") {
    return handleGetRunSnapshot(req, searchParams);
  }
  if (mode === "get_instructions") {
    return handleGetInstructions(req, searchParams);
  }

  // Phase B: rulings read - resolved comp-audit concerns for the learning loop.
  if (mode === "comp_audit_rulings") {
    return handleCompAuditRulings(req, searchParams);
  }

  // Health check (unchanged behavior when no mode is supplied).
  if (mode !== "solds") {
    return NextResponse.json({ ok: true, service: "ingest/market", status: "alive" });
  }

  // Archive-solds read: returns trailing 12-month and 90-day Sold rows for a
  // neighborhood, shaped for the commentary Lambda. Auth via x-ingest-secret.
  const supplied = req.headers.get("x-ingest-secret");
  if (!secretMatches(supplied)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const neighborhood = (searchParams.get("neighborhood") ?? "").trim();
  if (!neighborhood) {
    return NextResponse.json(
      { ok: false, error: "missing neighborhood" },
      { status: 400 }
    );
  }

  const today = new Date();
  const cutoff365 = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const cutoff90 = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  try {
    const { data, error } = await supabase
      .from("laurelwood_listings")
      .select(
        "mls_number,address_formatted,street_name,city,bedrooms,bathrooms,sqft,lot_size,year_built,pool,dom,status_label,change_type,change_date,list_price,current_price,sale_price,lp_per_sqft,sp_lp_ratio,description"
      )
      .eq("neighborhood", neighborhood)
      .eq("status_label", "Sold")
      .gte("change_date", cutoff365)
      .order("change_date", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, mode: "solds", error: error.message },
        { status: 500 }
      );
    }

    // Map DB columns back into the camelCase listing shape the commentary
    // Lambda consumes. ppsf computed from sale_price / sqft when both present.
    const shape = (r: AnyRow) => {
      const sqft = toNum(r.sqft);
      const sale = toNum(r.sale_price);
      const ppsf = sqft && sale && sqft > 0 ? Math.round(sale / sqft) : null;
      return {
        mlsNumber: r.mls_number ?? null,
        address: r.address_formatted ?? null,
        street: r.street_name ?? null,
        city: r.city ?? null,
        statusLabel: r.status_label ?? "Sold",
        changeType: r.change_type ?? "S",
        changeDate: r.change_date ?? null,
        close_date: r.change_date ?? null,
        br: r.bedrooms ?? null,
        baths: r.bathrooms ?? null,
        sqFt: sqft,
        lotSz: r.lot_size ?? null,
        yb: r.year_built ?? null,
        pool: r.pool ?? null,
        dom: r.dom ?? null,
        lp: toNum(r.list_price),
        currentPrice: toNum(r.current_price),
        salePrice: sale,
        sp: sale,
        lpSqFt: toNum(r.lp_per_sqft),
        ppsf,
        spLpRatio: toNum(r.sp_lp_ratio),
        description: r.description ?? null,
      };
    };

    const rows = (data ?? []) as AnyRow[];
    const sold12 = rows.map(shape);
    const sold90 = rows
      .filter((r) => {
        const d = String(r.change_date ?? "");
        return d && d >= cutoff90;
      })
      .map(shape);

    return NextResponse.json({
      ok: true,
      mode: "solds",
      neighborhood,
      sold_last_90_days: sold90,
      sold_last_12_months: sold12,
      counts: { sold_90: sold90.length, sold_12: sold12.length },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, mode: "solds", error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Phase B: rulings read.
//
// Returns the comp-audit concerns the team has already RESOLVED (status done or
// cancelled) for a neighborhood + brokerage, within a recency window. The
// reviewer (feedback.js) turns these into downrank/suppress rulings so repeat
// reports stop re-nagging about a property you already handled. Read-only;
// reuses the module `supabase` client and the x-ingest-secret auth.
//
// v1 returns status-based facts plus any `dismissal_reason` found in metadata
// (null today); when the detail page starts writing a reason, v2 consumes it
// here with no endpoint change.
async function handleCompAuditRulings(
  req: NextRequest,
  searchParams: URLSearchParams
) {
  const supplied = req.headers.get("x-ingest-secret");
  if (!secretMatches(supplied)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const neighborhood = (searchParams.get("neighborhood") ?? "").trim();
  if (!neighborhood) {
    return NextResponse.json(
      { ok: false, mode: "comp_audit_rulings", error: "missing neighborhood" },
      { status: 400 }
    );
  }
  const brokerageId = (searchParams.get("brokerage_id") ?? "").trim();
  const windowDays = Number(searchParams.get("window_days")) || 45;
  const cutoffMs = Date.now() - windowDays * 24 * 60 * 60 * 1000;

  try {
    let q = supabase
      .from("assignment")
      .select("metadata,status,completed_at,updated_at")
      .filter("metadata->>source", "eq", "comp_audit")
      .filter("metadata->>neighborhood", "eq", neighborhood)
      .in("status", ["done", "cancelled"])
      .is("deleted_at", null);
    if (brokerageId) q = q.eq("brokerage_id", brokerageId);

    const { data, error } = await q;
    if (error) {
      return NextResponse.json(
        { ok: false, mode: "comp_audit_rulings", error: error.message },
        { status: 500 }
      );
    }

    const resolved = ((data ?? []) as AnyRow[])
      .map((r) => {
        const meta = (r.metadata ?? {}) as AnyRow;
        const resolvedAt = (r.completed_at ?? r.updated_at ?? null) as string | null;
        return {
          subject_address: (meta.subject_address ?? null) as string | null,
          status: (r.status ?? null) as string | null,
          dismissal_reason: (meta.dismissal_reason ?? null) as string | null,
          resolved_at: resolvedAt,
        };
      })
      .filter((r) => {
        if (!r.subject_address) return false;
        if (!r.resolved_at) return true; // keep if we cannot date it
        const t = Date.parse(r.resolved_at);
        return Number.isNaN(t) ? true : t >= cutoffMs;
      });

    return NextResponse.json({
      ok: true,
      mode: "comp_audit_rulings",
      neighborhood,
      window_days: windowDays,
      resolved,
      count: resolved.length,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        mode: "comp_audit_rulings",
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    );
  }
}