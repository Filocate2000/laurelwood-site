import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { freewaySection } from "@/content/history-extra";
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

      {/* Proposed Laurel Canyon Freeway: brief copy + link. The framed study
          map and the CA-170/CA-90 shields now live primarily on /west-laurelwood
          (1971 Freeway Defeat band). */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-4xl">
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
          <div className="mt-8">
            <Link
              href="/west-laurelwood"
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-white hover:text-gold-500 transition-colors"
            >
              See the study map and the full story on West Laurelwood{" "}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
