import type { Metadata } from "next";
import { MarketReport } from "@/components/sections/MarketReport";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Active listings, pending sales, and recent sales for West Laurelwood.";

export const metadata: Metadata = {
  title: "West Laurelwood Market Overview",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/report") },
};

export default function ReportPage() {
  return <MarketReport neighborhood="West Laurelwood" />;
}
