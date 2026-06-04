import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { FloatFigure } from "@/components/FloatFigure";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { NeighborhoodJsonLd } from "@/components/seo/JsonLd";
import { eastContent as c } from "@/content/east";
import { photo, heroFor } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "East Laurelwood: a hillside retreat east of Laurel Canyon developed through the 1960s, known as The Bel Air of the Valley for its custom homes and panoramic views.";

export const metadata: Metadata = {
  title: "East Laurelwood",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/east-laurelwood") },
  openGraph: { title: "East Laurelwood", description: DESCRIPTION, url: absoluteUrl("/east-laurelwood") },
};

// Render a paragraph, linking the {{devhistory}} token to /history/development.
function Para({ text, className }: { text: string; className?: string }) {
  const parts = text.split("{{devhistory}}");
  return (
    <p className={className}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <Link href="/history/development" className="text-gold-600 hover:text-gold-500 underline">
              Development History
            </Link>
          )}
        </Fragment>
      ))}
    </p>
  );
}

export default function EastLaurelwoodPage() {
  const hero = heroFor("east-laurelwood");
  const ad = photo(c.ads.ad);
  const kids = photo(c.growth.photos[0].id);
  const bus = photo(c.growth.photos[1].id);

  return (
    <>
      <NeighborhoodJsonLd name="East Laurelwood" description={DESCRIPTION} path="/east-laurelwood" />

      {/* Hero band */}
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
      />

      {/* Vision band (white): text only, capped measure */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial max-w-3xl">
          <p className="eyebrow text-gold-600 mb-4">{c.vision.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.vision.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg text-navy-950/75 leading-relaxed">
            {c.vision.body.map((t, i) => (
              <Para key={i} text={t} className="mb-5 last:mb-0" />
            ))}
          </div>
        </div>
      </section>

      {/* Growth band (navy): the two period photos float, the school story wraps */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-500 mb-4">{c.growth.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.growth.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg text-ink-100 leading-relaxed">
            {kids && (
              <FloatFigure
                photo={kids}
                side="right"
                tone="onNavy"
                fit="fill"
                width="md:w-[40%]"
                caption={c.growth.photos[0].caption}
              />
            )}
            <p className="mb-5">{c.growth.bodyBefore[0]}</p>
            <p className="mb-5">{c.growth.bodyBefore[1]}</p>
            {bus && (
              <FloatFigure
                photo={bus}
                side="left"
                tone="onNavy"
                fit="fill"
                width="md:w-[40%]"
                caption={c.growth.photos[1].caption}
              />
            )}
            <p className="mb-5">{c.growth.bodyBefore[2]}</p>
            <p className="mb-5">{c.growth.bodyBefore[3]}</p>
            {c.growth.bodyAfter.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Real Estate Ads band (white): the Bel-Air ad floats, copy wraps */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-600 mb-4">{c.ads.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.ads.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg text-navy-950/75 leading-relaxed">
            {ad && (
              <FloatFigure photo={ad} side="right" tone="onWhite" fit="fill" width="md:w-[38%]" />
            )}
            {c.ads.body.map((t, i) => (
              <Para key={i} text={t} className="mb-5" />
            ))}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* East Laurelwood Today band (navy): text only */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-3xl">
          <p className="eyebrow text-gold-500 mb-4">{c.today.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.today.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg text-ink-100 leading-relaxed">
            {c.today.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Embrace the Lifestyle band, rendered as the CTA (white) */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial text-center max-w-3xl">
          <p className="eyebrow text-gold-600 mb-6">{c.cta.eyebrow}</p>
          <h2 className="font-display font-light text-4xl md:text-5xl text-navy-950 leading-tight mb-8">
            {c.cta.heading}
          </h2>
          <span className="gold-rule-dark mx-auto mb-10" />
          <div className="space-y-5 text-navy-950/70 text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            {c.cta.body.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          <Link
            href={c.cta.href}
            className="inline-flex items-center justify-center bg-navy-950 hover:bg-gold-600 px-10 py-4 text-[12px] uppercase text-white transition-colors duration-300"
            style={{ letterSpacing: "0.25em" }}
          >
            {c.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
