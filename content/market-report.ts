// content/market-report.ts
// Chrome for the two neighborhood market overviews, /report (West) and
// /marketreport (East). The listings and commentary come from Supabase via
// lib/market/getMarketData.ts; only the page furniture lives here.
//
// Lifted 2026-08-27: both pages hardcoded a DESCRIPTION naming the neighborhood.
//
// IMPORTANT: `neighborhood` is NOT display copy. It is the data key matched
// against laurelwood_listings.neighborhood, so it must equal one of
// ALLOWED_NEIGHBORHOODS in lib/market/getMarketData.ts. Renaming it for style
// would silently empty the page.
//
// NO em dashes.

export type MarketReportPage = {
  /** Data key. Must match laurelwood_listings.neighborhood exactly. */
  neighborhood: string;
  title: string;
  description: string;
};

export const westMarketReport: MarketReportPage = {
  neighborhood: "West Laurelwood",
  title: "West Laurelwood Market Overview",
  description:
    "Active listings, pending sales, and recent sales for West Laurelwood.",
};

export const eastMarketReport: MarketReportPage = {
  neighborhood: "East Laurelwood",
  title: "East Laurelwood Market Overview",
  description:
    "Active listings, pending sales, and recent sales for East Laurelwood.",
};
