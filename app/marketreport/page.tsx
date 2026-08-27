import type { Metadata } from "next";
import { MarketReport } from "@/components/sections/MarketReport";
import { getMarketData, type MarketData } from "@/lib/market/getMarketData";
import { absoluteUrl } from "@/lib/site-config";
import { eastMarketReport as page } from "@/content/market-report";


export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: absoluteUrl("/marketreport") },
  openGraph: {
    title: page.title,
    description: page.description,
    url: absoluteUrl("/marketreport"),
  },
};

// Render at request time so the market data is in the server HTML (crawlable),
// not baked at build (which would also need DB creds at build time).
export const dynamic = "force-dynamic";

export default async function MarketReportPage() {
  // Fetch server-side via the shared module (same source as /api/listings). On a
  // Supabase failure, render the page shell gracefully instead of crashing.
  let data: MarketData | null = null;
  try {
    data = await getMarketData(page.neighborhood);
  } catch (err) {
    console.error("market report page data error:", err);
  }
  return <MarketReport neighborhood={page.neighborhood} data={data} />;
}
