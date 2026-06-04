import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { FramedArtifact } from "@/components/FramedArtifact";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { tractSection } from "@/content/history-extra";
import { photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "The land acquisition history of Laurelwood: from the Fryman heirs to Chapman College to Home Savings & Loan, and the Spanish street-name legacy of the Doña streets.";

export const metadata: Metadata = {
  title: "Land Acquisition History",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/history/land-acquisition") },
  openGraph: {
    title: "Land Acquisition History",
    description: DESCRIPTION,
    url: absoluteUrl("/history/land-acquisition"),
  },
};

export default function LandAcquisitionHistoryPage() {
  const body = loadDoc("land-acquisition-history");
  return (
    <>
      <PageHero
        eyebrow="History"
        title="Land Acquisition History"
        subtitle="Acquiring Laurelwood, a mid-century development above the San Fernando Valley."
      />
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <Prose variant="light">{body}</Prose>
        </div>
      </section>

      {/* The recorded subdivision document */}
      {photo(tractSection.tractMap) && (
        <section className="bg-navy-950 py-20 md:py-28">
          <div className="editorial grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <p className="eyebrow text-gold-500 mb-4">Document</p>
              <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
                {tractSection.heading}
              </h2>
              <span className="gold-rule mb-8" />
              <p className="text-lg text-ink-100 leading-relaxed">{tractSection.body}</p>
            </div>
            <FramedArtifact photo={photo(tractSection.tractMap)!} tone="onNavy" />
          </div>
        </section>
      )}

      <ContactCTA />
    </>
  );
}
