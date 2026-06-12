// lib/market/getMarketData.ts
//
// THE single source of truth for the neighborhood market report. Reads the
// laurelwood_listings + laurelwood_commentary tables with the service-role key
// (same Supabase pattern as app/api/commute-cities/route.ts), buckets the rows
// (Active / Under Contract / Sold windows), aggregates calendar-quarter
// analytics, and returns one typed payload. Both the /api/listings route AND the
// server-rendered report pages import getMarketData(), so the numbers can't
// drift. Server-only: imports @supabase/supabase-js and reads env. Do NOT import
// this from a client component (use `import type` for the types if needed).

import { createClient } from "@supabase/supabase-js";

// Full listing row (select * from laurelwood_listings). The fields typed here are
// the ones the report reads/renders; the index signature carries the rest.
export type Listing = {
  neighborhood: string;
  status_label: string | null; // 'Active' | 'Under Contract' | 'Sold' | 'Canceled'
  change_date: string | null;
  address_formatted: string | null;
  street_name: string | null;
  street_number: string | number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  lot_size: number | null;
  year_built: number | null;
  pool: boolean | string | null;
  dom: number | null;
  list_price: number | null;
  current_price: number | null;
  sale_price: number | null;
  lp_per_sqft: number | null;
  sp_lp_ratio: number | null;
  description: string | null;
  [column: string]: unknown;
};

export type BucketStats = {
  count: number;
  avgPrice: number | null;
  avgPpsf: number | null;
  avgDom: number | null;
};

// Stored neighborhood commentary (laurelwood_commentary), returned verbatim
// including its embedded speaker labels.
export type Commentary = {
  market_snapshot: string | null;
  active_listings_analysis: string | null;
  under_contract_analysis: string | null;
  recent_sales_analysis: string | null;
  detailed_analysis: string | null;
};

export type QuarterAnalytics = {
  quarter: string; // "Q1 2026"
  sold_count: number;
  avg_sale_price: number | null;
  median_sale_price: number | null;
  sold_avg_ppsf: number | null; // computed sale_price / sqft, NOT lp_per_sqft
  avg_dom: number | null;
  highest_sale: number | null;
  active_avg_ppsf: number | null; // list_price / sqft over active in-quarter
};

export type QuarterSummary = {
  quarter: string;
  avg_sale_price: number | null;
  sold_ppsf: number | null;
  avg_dom: number | null;
  highest_sale: number | null;
};

export type Quarterly = {
  byQuarter: QuarterAnalytics[];
  comparison: {
    current: QuarterSummary | null;
    previous: QuarterSummary | null;
    change: {
      avg_sale_price_pct: number | null;
      sold_ppsf_pct: number | null;
      avg_dom_days_diff: number | null;
      highest_sale_pct: number | null;
    } | null;
  };
};

export type MarketData = {
  neighborhood: string;
  buckets: {
    active: Listing[];
    underContract: Listing[];
    soldLast90Days: Listing[];
    soldLast12Months: Listing[];
    soldAll: Listing[];
  };
  stats: {
    active: BucketStats;
    underContract: BucketStats;
    soldLast90Days: BucketStats;
    soldLast12Months: BucketStats;
  };
  quarterly: Quarterly;
  commentary: Commentary | null;
};

export const ALLOWED_NEIGHBORHOODS = ["West Laurelwood", "East Laurelwood"];

const DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_TTL_MS = 60 * 60 * 1000; // ~1 hour
const cache = new Map<
  string,
  { at: number; rows: Listing[]; commentary: Commentary | null }
>();

/** Coerce a DB value to a finite number, or null. */
function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/** Average of the numeric values (nulls dropped), rounded; null if none. */
function avg(values: Array<number | null>, decimals = 0): number | null {
  const nums = values.filter((v): v is number => v !== null);
  if (nums.length === 0) return null;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const f = 10 ** decimals;
  return Math.round(mean * f) / f;
}

/** Epoch ms for a row's change_date, or NaN if absent/unparseable. */
function changeMs(r: Listing): number {
  return r.change_date ? new Date(r.change_date).getTime() : NaN;
}

/**
 * Per-bucket stats. Sold buckets average sale_price; live buckets (Active /
 * Under Contract) average current_price, falling back to list_price. avgPpsf
 * only counts lp_per_sqft values > 0.
 */
function statsFor(rows: Listing[], sold: boolean): BucketStats {
  const priceOf = (r: Listing): number | null =>
    sold ? num(r.sale_price) : num(r.current_price) ?? num(r.list_price);

  return {
    count: rows.length,
    avgPrice: avg(rows.map(priceOf)),
    avgPpsf: avg(
      rows.map((r) => num(r.lp_per_sqft)).filter((v) => v !== null && v > 0),
      2
    ),
    avgDom: avg(rows.map((r) => num(r.dom))),
  };
}

/** Read the neighborhood's listings + commentary (service-role), sharing one
 *  cache entry for ~1 hour. The commentary row is optional: a missing row -> null,
 *  and a commentary read error is logged but does not fail the listings. */
async function loadNeighborhood(
  neighborhood: string
): Promise<{ rows: Listing[]; commentary: Commentary | null }> {
  const now = Date.now();
  const cached = cache.get(neighborhood);
  if (cached && now - cached.at < CACHE_TTL_MS) {
    return { rows: cached.rows, commentary: cached.commentary };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Supabase credentials are not configured");
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("laurelwood_listings")
    .select("*")
    .eq("neighborhood", neighborhood)
    .order("change_date", { ascending: false });

  if (error) throw error;
  const rows = (data ?? []) as Listing[];

  // Commentary: stored verbatim; select only the four prose columns.
  let commentary: Commentary | null = null;
  const { data: cRow, error: cErr } = await supabase
    .from("laurelwood_commentary")
    .select(
      "market_snapshot, active_listings_analysis, under_contract_analysis, recent_sales_analysis, detailed_analysis"
    )
    .eq("neighborhood", neighborhood)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cErr) {
    console.error("commentary read error:", cErr);
  } else if (cRow) {
    commentary = {
      market_snapshot: (cRow.market_snapshot as string | null) ?? null,
      active_listings_analysis:
        (cRow.active_listings_analysis as string | null) ?? null,
      under_contract_analysis:
        (cRow.under_contract_analysis as string | null) ?? null,
      recent_sales_analysis:
        (cRow.recent_sales_analysis as string | null) ?? null,
      detailed_analysis: (cRow.detailed_analysis as string | null) ?? null,
    };
  }

  cache.set(neighborhood, { at: now, rows, commentary });
  return { rows, commentary };
}

// --- Quarterly analytics ---------------------------------------------------

/** Calendar-quarter key for a row's change_date (UTC, so date-only strings
 *  don't drift across the year boundary). null if the date is missing. */
function quarterOf(r: Listing): { key: string; sortIdx: number } | null {
  const t = changeMs(r);
  if (Number.isNaN(t)) return null;
  const d = new Date(t);
  const year = d.getUTCFullYear();
  const q = Math.floor(d.getUTCMonth() / 3) + 1; // Q1..Q4
  return { key: `Q${q} ${year}`, sortIdx: year * 4 + (q - 1) };
}

/** Raw mean (no rounding); null if empty. */
function meanRaw(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Median; null if empty. */
function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Round to a whole number, preserving null. */
function roundOrNull(v: number | null): number | null {
  return v == null ? null : Math.round(v);
}

/** Percent change (current - previous) / previous * 100, 1 decimal; null if
 *  either side is missing or previous is zero. */
function pctChange(cur: number | null, prev: number | null): number | null {
  if (cur == null || prev == null || prev === 0) return null;
  return Math.round(((cur - prev) / prev) * 1000) / 10;
}

/** Build the quarterly block from sold + active rows for the neighborhood. Only
 *  quarters with >= 1 sold listing are emitted; active rows contribute only
 *  active_avg_ppsf to a quarter that already has sold data. */
function buildQuarterly(soldAll: Listing[], active: Listing[]): Quarterly {
  const groups = new Map<
    string,
    { sortIdx: number; sold: Listing[]; active: Listing[] }
  >();

  for (const r of soldAll) {
    const q = quarterOf(r);
    if (!q) continue;
    let g = groups.get(q.key);
    if (!g) {
      g = { sortIdx: q.sortIdx, sold: [], active: [] };
      groups.set(q.key, g);
    }
    g.sold.push(r);
  }
  // Active rows only matter for quarters that already have sold data.
  for (const r of active) {
    const q = quarterOf(r);
    if (!q) continue;
    const g = groups.get(q.key);
    if (g) g.active.push(r);
  }

  const ordered = [...groups.entries()].sort((a, b) => a[1].sortIdx - b[1].sortIdx);
  const byQuarter: QuarterAnalytics[] = ordered.map(([key, g]) => {
    const salePrices = g.sold
      .map((r) => num(r.sale_price))
      .filter((v): v is number => v !== null);
    const soldPpsf = g.sold
      .map((r) => {
        const sp = num(r.sale_price);
        const sf = num(r.sqft);
        return sp !== null && sf !== null && sp > 0 && sf > 0 ? sp / sf : null;
      })
      .filter((v): v is number => v !== null);
    const doms = g.sold
      .map((r) => num(r.dom))
      .filter((v): v is number => v !== null);
    const activePpsf = g.active
      .map((r) => {
        const lp = num(r.list_price);
        const sf = num(r.sqft);
        return lp !== null && sf !== null && lp > 0 && sf > 0 ? lp / sf : null;
      })
      .filter((v): v is number => v !== null);

    return {
      quarter: key,
      sold_count: g.sold.length,
      avg_sale_price: roundOrNull(meanRaw(salePrices)),
      median_sale_price: roundOrNull(median(salePrices)),
      sold_avg_ppsf: roundOrNull(meanRaw(soldPpsf)),
      avg_dom: roundOrNull(meanRaw(doms)),
      highest_sale: salePrices.length ? Math.round(Math.max(...salePrices)) : null,
      active_avg_ppsf: roundOrNull(meanRaw(activePpsf)),
    };
  });

  // Comparison: the two most recent quarters with sold data (all emitted
  // quarters have sold data by construction).
  const summarize = (q: QuarterAnalytics): QuarterSummary => ({
    quarter: q.quarter,
    avg_sale_price: q.avg_sale_price,
    sold_ppsf: q.sold_avg_ppsf,
    avg_dom: q.avg_dom,
    highest_sale: q.highest_sale,
  });

  const last = byQuarter[byQuarter.length - 1] ?? null;
  const prev = byQuarter[byQuarter.length - 2] ?? null;

  if (!last) {
    return { byQuarter, comparison: { current: null, previous: null, change: null } };
  }
  if (!prev) {
    return {
      byQuarter,
      comparison: { current: summarize(last), previous: null, change: null },
    };
  }
  const c = summarize(last);
  const p = summarize(prev);
  return {
    byQuarter,
    comparison: {
      current: c,
      previous: p,
      change: {
        avg_sale_price_pct: pctChange(c.avg_sale_price, p.avg_sale_price),
        sold_ppsf_pct: pctChange(c.sold_ppsf, p.sold_ppsf),
        avg_dom_days_diff:
          c.avg_dom != null && p.avg_dom != null ? c.avg_dom - p.avg_dom : null,
        highest_sale_pct: pctChange(c.highest_sale, p.highest_sale),
      },
    },
  };
}

/** Bucket the rows and assemble the report payload. Canceled rows fall into no
 *  bucket (the buckets are keyed to specific statuses). */
function buildReport(
  neighborhood: string,
  rows: Listing[],
  commentary: Commentary | null
): MarketData {
  const now = Date.now();
  const cutoff90 = now - 90 * DAY_MS;
  const cutoff365 = now - 365 * DAY_MS;

  const active = rows.filter((r) => r.status_label === "Active");
  const underContract = rows.filter((r) => r.status_label === "Under Contract");
  const soldAll = rows.filter((r) => r.status_label === "Sold");
  const soldLast90Days = soldAll.filter((r) => {
    const t = changeMs(r);
    return !Number.isNaN(t) && t >= cutoff90;
  });
  const soldLast12Months = soldAll.filter((r) => {
    const t = changeMs(r);
    return !Number.isNaN(t) && t >= cutoff365;
  });

  return {
    neighborhood,
    buckets: { active, underContract, soldLast90Days, soldLast12Months, soldAll },
    stats: {
      active: statsFor(active, false),
      underContract: statsFor(underContract, false),
      soldLast90Days: statsFor(soldLast90Days, true),
      soldLast12Months: statsFor(soldLast12Months, true),
    },
    quarterly: buildQuarterly(soldAll, active),
    commentary,
  };
}

/** Public entry point: full market report for one neighborhood. Throws on a
 *  Supabase/listings error or missing credentials (callers decide how to handle:
 *  the API route returns 500; the pages render a graceful shell). */
export async function getMarketData(neighborhood: string): Promise<MarketData> {
  const { rows, commentary } = await loadNeighborhood(neighborhood);
  return buildReport(neighborhood, rows, commentary);
}
