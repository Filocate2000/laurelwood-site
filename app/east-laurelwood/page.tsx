import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { FramedArtifact } from "@/components/FramedArtifact";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { NeighborhoodJsonLd } from "@/components/seo/JsonLd";
import { loadDoc } from "@/lib/content";
import { heroFor, photo } from "@/lib/photos";
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

      {/* The freeway that would have cut through East Laurelwood */}
      {photo("route-170-freeway-study-map-1970") && (
        <section className="bg-navy-950 py-20 md:py-28">
          <div className="editorial grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <p className="eyebrow text-gold-500 mb-4">Preservation</p>
              <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
                The freeway that never came.
              </h2>
              <span className="gold-rule mb-8" />
              <p className="text-lg text-ink-100 leading-relaxed">
                The proposed Laurel Canyon Freeway would have cut through the Santa
                Monica Mountains and key areas of East and West Laurelwood. Residents
                unified in opposition, and the route was removed from the state&apos;s
                plans in 1971.
              </p>
            </div>
            <FramedArtifact
              photo={photo("route-170-freeway-study-map-1970")!}
              tone="onNavy"
              variant="document"
              href={photo("route-170-freeway-study-map-1970")!.src}
            />
          </div>
        </section>
      )}

      <ContactCTA />
    </>
  );
}
