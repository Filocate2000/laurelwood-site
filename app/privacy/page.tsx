import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-config";
import PrivacyContent from "./PrivacyContent";

const DESCRIPTION =
  "How Misraje Real Estate Partners collects, uses, and protects information for visitors to the Laurelwood Estates website.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
