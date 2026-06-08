import type { Metadata } from "next";
import { MarketReport } from "@/components/sections/MarketReport";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Active listings, pending sales, and recent sales for East Laurelwood.";

export const metadata: Metadata = {
  title: "East Laurelwood Market Overview",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/marketreport") },
};

export default function MarketReportPage() {
  return <MarketReport neighborhood="East Laurelwood" />;
}
