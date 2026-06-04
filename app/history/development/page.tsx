import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { FramedArtifact } from "@/components/FramedArtifact";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { freewaySection } from "@/content/history-extra";
import { photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Laurelwood from 1958 to today: architect David Freedman's vision, the original model homes, and how the neighborhood's homes have evolved while keeping their mid-century character.";

export const metadata: Metadata = {
  title: "Development History",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/history/development") },
  openGraph: { title: "Development History", description: DESCRIPTION, url: absoluteUrl("/history/development") },
};

export default function DevelopmentHistoryPage() {
  const body = loadDoc("development-history");
  return (
    <>
      <PageHero
        eyebrow="History"
        title="Development History"
        subtitle="Laurelwood from 1958 to today, a timeless blend of country and city living."
      />
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <Prose variant="light">{body}</Prose>
        </div>
      </section>

      {/* Proposed Laurel Canyon Freeway: study map + route shields */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial">
          <div className="max-w-4xl mb-12">
            <p className="eyebrow text-gold-500 mb-4">{freewaySection.eyebrow}</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
              {freewaySection.heading}
            </h2>
            <span className="gold-rule mb-8" />
            <div className="space-y-5 text-lg text-ink-100 leading-relaxed">
              {freewaySection.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12 items-start">
            {photo(freewaySection.freewayMap) && (
              <FramedArtifact
                photo={photo(freewaySection.freewayMap)!}
                tone="onNavy"
                variant="document"
                href={photo(freewaySection.freewayMap)!.src}
                center={false}
              />
            )}
            <div className="flex flex-row lg:flex-col gap-8 lg:pt-4 items-start">
              {freewaySection.shields.map((id) => {
                const p = photo(id);
                return p ? (
                  <FramedArtifact key={id} photo={p} tone="onNavy" variant="shield" center={false} />
                ) : null;
              })}
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
