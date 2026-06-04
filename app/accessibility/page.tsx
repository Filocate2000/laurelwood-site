import type { Metadata } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility statement for Misraje Real Estate Partners.",
  alternates: { canonical: absoluteUrl("/accessibility") },
};

export default function AccessibilityPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="editorial max-w-prose">
        <p className="eyebrow text-gold-500 mb-4">Commitment</p>
        <h1 className="font-display font-light text-display text-white mb-6">
          Accessibility Statement
        </h1>
        <span className="gold-rule mb-10" />
        <p className="text-ink-100 text-lg leading-relaxed">{siteConfig.legal.accessibility}</p>
      </div>
    </div>
  );
}
