import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { FloatFigure } from "@/components/FloatFigure";
import {
  neighborhoodWatchContent as c,
  type LinkedLine,
  type Bullet,
} from "@/content/neighborhood-watch";
import { photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "The Laurelwood neighborhood watch: safety guidelines, the LAPD senior lead officer, and how to report suspicious activity.";

export const metadata: Metadata = {
  title: "Neighborhood Watch",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/homeowners/neighborhood-watch") },
  openGraph: { title: "Neighborhood Watch", description: DESCRIPTION, url: absoluteUrl("/homeowners/neighborhood-watch") },
};

/** A verbatim line with one internal link, on a navy band (gold-500 link). */
function LinkedParagraph({ line }: { line: LinkedLine }) {
  return (
    <p>
      {line.pre}
      <Link
        href={line.href}
        className="text-gold-500 underline underline-offset-2 hover:text-gold-400 transition-colors"
      >
        {line.linkText}
      </Link>
      {line.post}
    </p>
  );
}

/** Canon gold-accent bullet list with semibold lead-ins. */
function GuidelineList({ bullets, tone }: { bullets: Bullet[]; tone: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ul className="space-y-4">
      {bullets.map((b) => (
        <li
          key={b.lead}
          className={`flex gap-3 text-lg leading-relaxed ${
            dark ? "text-ink-100" : "text-navy-950/75"
          }`}
        >
          <span
            className={`mt-2.5 h-px w-6 flex-shrink-0 ${dark ? "bg-gold-500" : "bg-gold-600"}`}
            aria-hidden="true"
          />
          <span>
            <span className={`font-display font-semibold ${dark ? "text-white" : "text-navy-950"}`}>
              {b.lead}
            </span>{" "}
            {b.rest}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function NeighborhoodWatchPage() {
  const hero = photo("neighborhood-watch-hero");
  const sign = photo("neighborhood-watch-sign");
  return (
    <>
      {/* 1. HERO: shared PageHero over the Laurelwood vista. object-position
          biases down (center 70%) so the hillside neighborhood, not just the
          sky, stays in frame. */}
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        objectPosition="center 70%"
        eyebrow="Homeowners"
        title={c.pageTitle}
      />

      {/* 2. NAVY: Police and Local Authorities Contacts */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.police.heading}
          </h2>
          <span className="gold-rule mb-8" />

          {/* Prominent 911 callout (mirrors the emergency-contacts banner). */}
          <div className="border border-gold-500/40 bg-navy-900 p-6 md:p-8 mb-10">
            <p
              className="font-display font-light text-white leading-snug"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
            >
              For any emergencies, always dial{" "}
              <a
                href="tel:911"
                className="font-medium text-gold-500 hover:text-gold-400 transition-colors"
              >
                911
              </a>{" "}
              immediately.
            </p>
          </div>

          <div className="space-y-5 text-lg md:text-xl text-ink-100 leading-relaxed">
            <p>{c.police.nonEmergencySubhead}</p>
            <p>{c.police.officerParagraph}</p>
            <LinkedParagraph line={c.police.communityNewsLine} />
          </div>
        </div>
      </section>

      {/* 3. WHITE: Officer contact card (with photo-gap placeholder) */}
      <section className="bg-white py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <div className="max-w-xl border border-navy-950/12 bg-white p-6 md:p-8 flex flex-col sm:flex-row gap-6">
            {/* PHOTO GAP: Officer Smith's photo (Wix IMG_20171004_204318) is not in
                source-photos. Clearly-marked placeholder slot until Jack supplies it. */}
            <div className="w-full sm:w-32 h-40 sm:h-40 flex-shrink-0 border border-navy-950/15 bg-navy-950/[0.04] grid place-items-center text-center">
              <span className="text-navy-950/40 text-[10px] uppercase tracking-[0.18em] leading-relaxed px-3">
                Officer photo
                <br />
                to come
              </span>
            </div>
            <div>
              <h3 className="font-display text-xl text-navy-950">{c.officer.name}</h3>
              {c.officer.department.map((d) => (
                <p key={d} className="text-sm text-navy-950/55">
                  {d}
                </p>
              ))}
              <p className="mt-3 text-navy-950/80">
                <a
                  href={`tel:+1${c.officer.phone.replace(/\D/g, "")}`}
                  className="text-gold-600 hover:text-gold-700 transition-colors"
                >
                  {c.officer.phone}
                </a>
              </p>
              <p className="mt-1">
                <a
                  href={`mailto:${c.officer.email}`}
                  className="text-sm break-all text-gold-600 hover:text-gold-700 transition-colors"
                >
                  {c.officer.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NAVY: Neighborhood Watch Guidelines. The watch-sign photo floats
          right here (canon gold plate, ~16rem tall) to illustrate the rules. */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.guidelines.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            {sign && (
              <FloatFigure photo={sign} float="right" width="" maxImgH={256} caption="" />
            )}
            <p className="mb-8">{c.guidelines.intro}</p>
            <GuidelineList bullets={c.guidelines.bullets} tone="dark" />
            <p className="mt-8">{c.guidelines.closing}</p>
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* 5. WHITE: Patrol Services and Neighborhood Presence */}
      <section className="bg-white py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.patrol.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="space-y-5 text-lg md:text-xl text-navy-950/75 leading-relaxed mb-8">
            {c.patrol.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <GuidelineList bullets={c.patrol.bullets} tone="light" />
          <p className="text-lg md:text-xl text-navy-950/75 leading-relaxed mt-8">
            {c.patrol.closing}
          </p>
        </div>
      </section>

      {/* 6. NAVY: Stay Informed */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.stayInformed.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="space-y-5 text-lg md:text-xl text-ink-100 leading-relaxed">
            <LinkedParagraph line={c.stayInformed.paragraph1} />
            <p>{c.stayInformed.paragraph2}</p>
          </div>
        </div>
      </section>

      {/* 7. WHITE: closing CTA (alternation: after navy Stay Informed). */}
      <ContactCTA />
    </>
  );
}
