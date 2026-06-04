import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
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
      <ContactCTA />
    </>
  );
}
