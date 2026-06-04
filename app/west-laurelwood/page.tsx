import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { FramedArtifact } from "@/components/FramedArtifact";
import { SelfHostedVideo } from "@/components/SelfHostedVideo";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { NeighborhoodJsonLd } from "@/components/seo/JsonLd";
import { westContent as c } from "@/content/west";
import { photo, heroFor, VIDEOS } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "West Laurelwood: 290 mid-century homes developed in 1958 on Tract No. 24676 in the Studio City hills, with the Doña streets and the open spaces of Fryman Canyon.";

export const metadata: Metadata = {
  title: "West Laurelwood",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/west-laurelwood") },
  openGraph: { title: "West Laurelwood", description: DESCRIPTION, url: absoluteUrl("/west-laurelwood") },
};

export default function WestLaurelwoodPage() {
  const hero = heroFor("west-laurelwood");
  const film = VIDEOS[c.film.videoKey as keyof typeof VIDEOS];

  return (
    <>
      <NeighborhoodJsonLd name="West Laurelwood" description={DESCRIPTION} path="/west-laurelwood" />

      {/* Hero band */}
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
        objectPosition="center 60%"
      />

      {/* Intro band (white) */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-600 mb-4">{c.intro.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.intro.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="space-y-5 text-lg text-navy-950/75 leading-relaxed">
            {c.intro.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Archival band (navy): framed newspaper ads, 2-up */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial">
          <p className="eyebrow text-gold-500 mb-4">{c.archival.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.archival.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <p className="text-lg text-ink-100 leading-relaxed max-w-4xl mb-12">
            {c.archival.intro}
          </p>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-14 items-end">
            {c.archival.ads.map((id) => {
              const p = photo(id);
              return p ? <FramedArtifact key={id} photo={p} tone="onNavy" variant="ad" /> : null;
            })}
          </div>
        </div>
      </section>

      {/* Origins band (white): billboard + renderings + recorded map */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <p className="eyebrow text-gold-600 mb-4">{c.origins.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.origins.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <p className="text-lg text-navy-950/75 leading-relaxed max-w-4xl mb-12">
            {c.origins.intro}
          </p>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-14 items-start">
            {photo(c.origins.billboard) && (
              <FramedArtifact photo={photo(c.origins.billboard)!} tone="onWhite" variant="photo" />
            )}
            <div className="flex flex-col gap-14">
              {photo(c.origins.renderings) && (
                <FramedArtifact photo={photo(c.origins.renderings)!} tone="onWhite" variant="photo" />
              )}
              {photo(c.origins.tractMap) && (
                <FramedArtifact
                  photo={photo(c.origins.tractMap)!}
                  tone="onWhite"
                  variant="document"
                  href={photo(c.origins.tractMap)!.src}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Growth band (navy): 1960s-1970s, prose only (kids/bus photos on East) */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-500 mb-4">{c.growth.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.growth.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="space-y-5 text-lg text-ink-100 leading-relaxed">
            {c.growth.body.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>
      </section>

      {/* On the Big Screen band (white): the Disorderly Orderly clip */}
      {film && (
        <section className="bg-white py-20 md:py-28">
          <div className="editorial grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-xl">
              <p className="eyebrow text-gold-600 mb-4">{c.film.eyebrow}</p>
              <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
                {c.film.heading}
              </h2>
              <span className="gold-rule-dark mb-8" />
              <div className="space-y-5 text-lg text-navy-950/75 leading-relaxed">
                {c.film.body.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            </div>
            <SelfHostedVideo src={film.src} caption={c.film.caption} tone="onWhite" />
          </div>
        </section>
      )}

      {/* 1971 Freeway Defeat band (navy): study map + route shields (West owns this) */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial">
          <div className="max-w-4xl">
            <p className="eyebrow text-gold-500 mb-4">{c.freewayDefeat.eyebrow}</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
              {c.freewayDefeat.heading}
            </h2>
            <span className="gold-rule mb-8" />
            <div className="space-y-5 text-lg text-ink-100 leading-relaxed">
              {c.freewayDefeat.body.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          </div>
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12 items-start mt-14">
            {photo(c.freewayDefeat.map) && (
              <FramedArtifact
                photo={photo(c.freewayDefeat.map)!}
                tone="onNavy"
                variant="document"
                href={photo(c.freewayDefeat.map)!.src}
                caption={c.freewayDefeat.mapCaption}
                center={false}
              />
            )}
            <div className="flex flex-row lg:flex-col gap-8 items-start lg:pt-4">
              {c.freewayDefeat.shields.map((id) => {
                const p = photo(id);
                return p ? (
                  <FramedArtifact key={id} photo={p} tone="onNavy" variant="shield" center={false} />
                ) : null;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Wilacre Park band (white) */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-600 mb-4">{c.preservation.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.preservation.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="space-y-5 text-lg text-navy-950/75 leading-relaxed">
            {c.preservation.body.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Fryman Road Extension band (navy), immediately after Wilacre */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-500 mb-4">{c.frymanRoad.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.frymanRoad.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="space-y-5 text-lg text-ink-100 leading-relaxed">
            {c.frymanRoad.body.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Doña band (white): Cultural Legacy in Street Names, sign banner */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <div className="max-w-4xl mb-10">
            <p className="eyebrow text-gold-600 mb-4">{c.dona.eyebrow}</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
              {c.dona.heading}
            </h2>
            <span className="gold-rule-dark mb-8" />
            <p className="text-lg text-navy-950/75 leading-relaxed">{c.dona.body}</p>
          </div>
          {photo(c.dona.sign) && (
            <FramedArtifact photo={photo(c.dona.sign)!} tone="onWhite" variant="banner" />
          )}
          <div className="mt-10">
            <Link
              href={c.dona.href}
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-navy-950 hover:text-gold-600 transition-colors"
            >
              {c.dona.cta} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* West Laurelwood Today closing band (navy) */}
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

      <ContactCTA />
    </>
  );
}
