import type { Metadata } from "next";
import { MarketReport } from "@/components/sections/MarketReport";
import { getMarketData, type MarketData } from "@/lib/market/getMarketData";
import { absoluteUrl } from "@/lib/site-config";

const NEIGHBORHOOD = "West Laurelwood";
const DESCRIPTION =
  "Active listings, pending sales, and recent sales for West Laurelwood.";

export const metadata: Metadata = {
  title: "West Laurelwood Market Overview",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/report") },
  openGraph: {
    title: "West Laurelwood Market Overview",
    description: DESCRIPTION,
    url: absoluteUrl("/report"),
  },
};

// Render at request time so the market data is in the server HTML (crawlable),
// not baked at build (which would also need DB creds at build time).
export const dynamic = "force-dynamic";

export default async function ReportPage() {
  // Fetch server-side via the shared module (same source as /api/listings). On a
  // Supabase failure, render the page shell gracefully instead of crashing.
  let data: MarketData | null = null;
  try {
    data = await getMarketData(NEIGHBORHOOD);
  } catch (err) {
    console.error("report page data error:", err);
  }
  return <MarketReport neighborhood={NEIGHBORHOOD} data={data} />;
}
