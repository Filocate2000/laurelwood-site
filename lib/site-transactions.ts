// lib/site-transactions.ts
//
// Per-site Past Transactions data. Intentionally EMPTY for now: the Past
// Transactions page ships as a shell (route + nav/footer link + presentational
// list) with no data wired. The sibling sites deliberately do NOT connect to the
// shared Supabase backend, so this static array is the single data source.
//
// To populate later: add curated, neighborhood-specific entries (in or near
// Laurelwood) so this site's list stays distinct from the other neighborhood
// sites. Until then, the page renders a graceful "in progress" state.

export type SiteTransaction = {
  id: string;
  address: string;
  unit: string | null;
  city: string;
  state: string | null;
  beds: number | null;
  baths: number | null;
  livingSqft: number | null;
  photoUrl: string | null;
  soldDate: string | null;
  transactionType: "Sale" | "Lease" | null;
};

export const SITE_TRANSACTIONS: SiteTransaction[] = [];
