import { createPublicServerClient } from "@/lib/supabase/server";

/**
 * Misraje brokerage ID, the tenant filter for every query. Mirrors lib/blog.ts:
 * read from env with a hardcoded fallback so pages still render if unset.
 */
const MISRAJE_BROKERAGE_ID =
  process.env.NEXT_PUBLIC_MISRAJE_BROKERAGE_ID ??
  "852d9bdd-4293-42e1-8833-f35273dc08e7";

/**
 * Site key in past_transaction_site (same convention as blog_post_site). Pass
 * an explicit key when a future site (laurelwood/fryman) needs its own list.
 */
export const MISRAJE_SITE_KEY = "misraje";

export type PastTransaction = {
  id: string;
  address: string;
  unit: string | null;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  beds: number | null;
  baths: number | null;
  livingSqft: number | null;
  lotSqft: number | null;
  photoUrl: string | null;
  featured: boolean;
  soldDate: string | null;
  transactionType: "Sale" | "Lease" | null;
  brokerRole: "Listing" | "Selling" | "Both" | null;
  displayOrder: number | null;
};

type Row = {
  id: string;
  address: string;
  unit: string | null;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  beds: number | null;
  baths: number | null;
  living_sqft: number | null;
  lot_sqft: number | null;
  photo_url: string | null;
  featured: boolean;
  sold_date: string | null;
  transaction_type: string | null;
  broker_role: string | null;
  display_order: number | null;
};

// NOTE: sold_price / list_price are deliberately NOT selected here, they are
// internal-only and must never reach the public client.
const FIELDS =
  "id, address, unit, city, state, latitude, longitude, beds, baths, " +
  "living_sqft, lot_sqft, photo_url, featured, sold_date, " +
  "transaction_type, broker_role, display_order, " +
  "past_transaction_site!inner ( site_key )";

function mapRow(r: Row): PastTransaction {
  return {
    id: r.id,
    address: r.address,
    unit: r.unit,
    city: r.city,
    state: r.state,
    latitude: r.latitude,
    longitude: r.longitude,
    beds: r.beds,
    baths: r.baths,
    livingSqft: r.living_sqft,
    lotSqft: r.lot_sqft,
    photoUrl: r.photo_url,
    featured: r.featured,
    soldDate: r.sold_date,
    transactionType:
      r.transaction_type === "Sale" || r.transaction_type === "Lease"
        ? r.transaction_type
        : null,
    brokerRole:
      r.broker_role === "Listing" ||
      r.broker_role === "Selling" ||
      r.broker_role === "Both"
        ? r.broker_role
        : null,
    displayOrder: r.display_order,
  };
}

/**
 * All published, non-deleted past transactions on the given site. The site
 * filter is enforced by !inner-joining past_transaction_site and filtering its
 * site_key (same shape as getPublishedPosts in lib/blog.ts). The page derives
 * the map pins (rows with coordinates) and the tiles (rows with specs) from
 * this single list, so it is one round-trip.
 */
export async function getPastTransactions(
  siteKey: string = MISRAJE_SITE_KEY
): Promise<PastTransaction[]> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("past_transaction")
    .select(FIELDS)
    .eq("brokerage_id", MISRAJE_BROKERAGE_ID)
    .eq("published", true)
    .is("deleted_at", null)
    .eq("past_transaction_site.site_key", siteKey)
    // Canonical order set in the admin. living_sqft is only a deterministic
    // tiebreak for the (rare) rows with no display_order, which sort last.
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("living_sqft", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("getPastTransactions error:", error);
    return [];
  }

  return ((data as unknown as Row[]) ?? []).map(mapRow);
}

/**
 * Count of published, non-deleted transactions per city for the given site,
 * grouped case-insensitively. Uses the SAME anon read path / filters as
 * getPastTransactions (brokerage + published + deleted_at IS NULL + the
 * past_transaction_site!inner join on site_key). Returns a Map keyed by the
 * lowercased, trimmed city name so callers can look up by any casing.
 */
export async function getTransactionCountsByCity(
  siteKey: string = MISRAJE_SITE_KEY
): Promise<Map<string, number>> {
  const supabase = createPublicServerClient();

  const { data, error } = await supabase
    .from("past_transaction")
    .select("city, past_transaction_site!inner ( site_key )")
    .eq("brokerage_id", MISRAJE_BROKERAGE_ID)
    .eq("published", true)
    .is("deleted_at", null)
    .eq("past_transaction_site.site_key", siteKey);

  if (error) {
    console.error("getTransactionCountsByCity error:", error);
    return new Map();
  }

  const counts = new Map<string, number>();
  for (const r of (data as unknown as { city: string | null }[]) ?? []) {
    const key = (r.city ?? "").trim().toLowerCase();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}
