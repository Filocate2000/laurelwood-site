import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { FramedArtifact } from "@/components/FramedArtifact";
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

      {/* Vision band (white) */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-600 mb-4">{c.vision.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.vision.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="space-y-5 text-lg text-navy-950/75 leading-relaxed">
            {c.vision.body.map((t, i) => (
              <Para key={i} text={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Growth band (navy): the school story + the two period photos */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial">
          <div className="max-w-4xl">
            <p className="eyebrow text-gold-500 mb-4">{c.growth.eyebrow}</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
              {c.growth.heading}
            </h2>
            <span className="gold-rule mb-8" />
            <div className="space-y-5 text-lg text-ink-100 leading-relaxed">
              {c.growth.bodyBefore.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-12 items-start my-14">
            {c.growth.photos.map((p) => {
              const ph = photo(p.id);
              return ph ? (
                <FramedArtifact key={p.id} photo={ph} tone="onNavy" variant="photo" caption={p.caption} />
              ) : null;
            })}
          </div>

          <div className="max-w-4xl space-y-5 text-lg text-ink-100 leading-relaxed">
            {c.growth.bodyAfter.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Real Estate Ads band (white): East's archive, with the Bel-Air ad */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <div className="max-w-4xl mb-12">
            <p className="eyebrow text-gold-600 mb-4">{c.ads.eyebrow}</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
              {c.ads.heading}
            </h2>
            <span className="gold-rule-dark mb-8" />
          </div>
          <div className="grid lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-start">
            <div className="space-y-5 text-lg text-navy-950/75 leading-relaxed">
              {c.ads.body.map((t, i) => (
                <Para key={i} text={t} />
              ))}
            </div>
            {ad && (
              <div className="lg:pt-2">
                <FramedArtifact photo={ad} tone="onWhite" variant="ad" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* East Laurelwood Today band (navy) */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-500 mb-4">{c.today.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.today.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="space-y-5 text-lg text-ink-100 leading-relaxed">
            {c.today.body.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Embrace the Lifestyle band, rendered as the CTA (white) */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial text-center max-w-4xl">
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
