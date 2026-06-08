// app/api/listings/route.ts
// Returns the market-report data for one Laurelwood neighborhood. Reads the
// laurelwood_listings table with the service-role key (mirroring the Supabase
// connection pattern in app/api/commute-cities/route.ts), buckets the rows
// server-side (Active / Under Contract / Sold windows) with simple per-bucket
// stats, and caches the raw rows per neighborhood in memory for ~1 hour. Unlike
// commute-cities there is no local fallback, so any DB error returns 500.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Row shape for laurelwood_listings. The query selects all columns; the fields
// typed here are the ones this route reads. The index signature carries the rest
// through untyped so the full row is returned to callers.
type Listing = {
  neighborhood: string;
  status_label: string; // 'Active' | 'Under Contract' | 'Sold' | 'Canceled'
  change_date: string | null;
  sale_price: number | null;
  current_price: number | null;
  list_price: number | null;
  lp_per_sqft: number | null;
  dom: number | null;
  [column: string]: unknown;
};

type BucketStats = {
  count: number;
  avgPrice: number | null;
  avgPpsf: number | null;
  avgDom: number | null;
};

const ALLOWED_NEIGHBORHOODS = ["West Laurelwood", "East Laurelwood"];

const DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_TTL_MS = 60 * 60 * 1000; // ~1 hour
const cache = new Map<string, { at: number; rows: Listing[] }>();

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

/** Read the neighborhood's rows (service-role), caching them for ~1 hour. */
async function loadListings(neighborhood: string): Promise<Listing[]> {
  const now = Date.now();
  const cached = cache.get(neighborhood);
  if (cached && now - cached.at < CACHE_TTL_MS) {
    return cached.rows;
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
  cache.set(neighborhood, { at: now, rows });
  return rows;
}

/** Bucket the rows and assemble the response payload. Canceled rows fall into
 *  no bucket (the buckets are keyed to specific statuses). */
function buildReport(neighborhood: string, rows: Listing[]) {
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
    buckets: {
      active,
      underContract,
      soldLast90Days,
      soldLast12Months,
      soldAll,
    },
    stats: {
      active: statsFor(active, false),
      underContract: statsFor(underContract, false),
      soldLast90Days: statsFor(soldLast90Days, true),
      soldLast12Months: statsFor(soldLast12Months, true),
    },
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const neighborhood = searchParams.get("neighborhood");

  if (!neighborhood || !ALLOWED_NEIGHBORHOODS.includes(neighborhood)) {
    return NextResponse.json(
      {
        error: `Invalid or missing "neighborhood". Expected one of: ${ALLOWED_NEIGHBORHOODS.join(
          ", "
        )}.`,
      },
      { status: 400 }
    );
  }

  try {
    const rows = await loadListings(neighborhood);
    return NextResponse.json(buildReport(neighborhood, rows));
  } catch (err) {
    console.error("listings read error:", err);
    return NextResponse.json(
      { error: "Listings are temporarily unavailable." },
      { status: 500 }
    );
  }
}
