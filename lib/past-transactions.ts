import { createPublicServerClientOrNull } from "@/lib/supabase/server";
import { resolveBrokerageId } from "@/lib/brokerage";

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
 * All published, non-deleted past transactions on the given site. The key is a
 * REQUIRED argument on purpose: it used to default to "misraje", so this site
 * served the firm's book while siteConfig.siteKey said "laurelwood" and nobody
 * could tell from the call site. Callers pass siteConfig.pastTransactionsSiteKey.
 * The site
 * filter is enforced by !inner-joining past_transaction_site and filtering its
 * site_key (same shape as getPublishedPosts in lib/blog.ts). The page derives
 * the map pins (rows with coordinates) and the tiles (rows with specs) from
 * this single list, so it is one round-trip.
 */
export async function getPastTransactions(
  siteKey: string
): Promise<PastTransaction[]> {
  const supabase = createPublicServerClientOrNull();
  if (!supabase) return [];
  const brokerageId = await resolveBrokerageId();

  const { data, error } = await supabase
    .from("past_transaction")
    .select(FIELDS)
    .eq("brokerage_id", brokerageId)
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
