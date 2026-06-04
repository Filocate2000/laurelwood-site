import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { NeighborhoodJsonLd } from "@/components/seo/JsonLd";
import { loadDoc } from "@/lib/content";
import { heroFor } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "East Laurelwood: a hillside retreat east of Laurel Canyon developed through the 1960s, known as The Bel Air of the Valley for its custom homes and panoramic views.";

export const metadata: Metadata = {
  title: "East Laurelwood",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/east-laurelwood") },
  openGraph: { title: "East Laurelwood", description: DESCRIPTION, url: absoluteUrl("/east-laurelwood") },
};

export default function EastLaurelwoodPage() {
  const body = loadDoc("east-laurelwood");
  const hero = heroFor("east-laurelwood");
  return (
    <>
      <NeighborhoodJsonLd name="East Laurelwood" description={DESCRIPTION} path="/east-laurelwood" />
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        eyebrow="Neighborhood"
        title="East Laurelwood"
        subtitle="The Bel Air of the Valley, on the east side of Laurel Canyon."
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
