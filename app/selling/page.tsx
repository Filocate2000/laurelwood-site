import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  `Selling in Laurelwood: how ${siteConfig.legalName} positions and markets homes in this Studio City neighborhood for the strongest possible result.`;

export const metadata: Metadata = {
  title: "Selling in Laurelwood",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/selling") },
  openGraph: { title: "Selling in Laurelwood", description: DESCRIPTION, url: absoluteUrl("/selling") },
};

export default function SellingPage() {
  const body = loadDoc("selling-in-laurelwood");
  return (
    <>
      <PageHero
        eyebrow="Experience Laurelwood"
        title="Selling in Laurelwood"
        subtitle="A strategy built around the neighborhood's specific buyers."
      />
      <section className="bg-white py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <Prose variant="light">{body}</Prose>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
