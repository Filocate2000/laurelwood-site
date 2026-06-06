import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Buying in Laurelwood: what to know about this competitive Studio City market, from inventory and pricing to the local edge Misraje Real Estate Partners brings buyers.";

export const metadata: Metadata = {
  title: "Buying in Laurelwood",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/buying") },
  openGraph: { title: "Buying in Laurelwood", description: DESCRIPTION, url: absoluteUrl("/buying") },
};

export default function BuyingPage() {
  const body = loadDoc("buying-in-laurelwood");
  return (
    <>
      <PageHero
        eyebrow="Experience Laurelwood"
        title="Buying in Laurelwood"
        subtitle="What you need to know about a competitive, sought-after market."
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
