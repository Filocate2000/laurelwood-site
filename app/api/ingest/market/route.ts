import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY as string;
const INGEST_SHARED_SECRET = process.env.INGEST_SHARED_SECRET ?? "";
const GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY ?? "";

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

export async function GET() {
  return NextResponse.json({ ok: true, service: "ingest/market", status: "alive" });
}
