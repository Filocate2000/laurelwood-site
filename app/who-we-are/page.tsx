import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Misraje Real Estate Partners, the practice of Karen and Jack Misraje, representing buyers and sellers in Laurelwood Estates and Studio City. The #1 Two-Member Team in Coldwell Banker Global Luxury.";

export const metadata: Metadata = {
  title: "Who We Are",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/who-we-are") },
  openGraph: { title: "Who We Are", description: DESCRIPTION, url: absoluteUrl("/who-we-are") },
};

export default function WhoWeArePage() {
  const body = loadDoc("who-we-are");
  const hero = photo("laurelwood-scenic-1");
  return (
    <>
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        scrim="dark"
        eyebrow="The Firm"
        title="Who We Are"
        subtitle="A two-principal practice rooted in the hills above Studio City."
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
