import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-config";
import { privacyContent } from "@/content/privacy";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: privacyContent.title,
  description: privacyContent.metaDescription,
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
