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
  const film = VIDEOS[c.period.film.videoKey as keyof typeof VIDEOS];

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
        <div className="editorial max-w-3xl">
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
          <p className="text-lg text-ink-100 leading-relaxed max-w-3xl mb-12">
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
          <p className="text-lg text-navy-950/75 leading-relaxed max-w-3xl mb-12">
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

      {/* Doña band (navy): the street-sign banner on a cream plate */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial">
          <div className="max-w-3xl mb-10">
            <p className="eyebrow text-gold-500 mb-4">{c.dona.eyebrow}</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
              {c.dona.heading}
            </h2>
            <span className="gold-rule mb-8" />
            <p className="text-lg text-ink-100 leading-relaxed">{c.dona.body}</p>
          </div>
          {photo(c.dona.sign) && (
            <FramedArtifact photo={photo(c.dona.sign)!} tone="onNavy" variant="banner" />
          )}
          <div className="mt-10">
            <Link
              href={c.dona.href}
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-white hover:text-gold-500 transition-colors"
            >
              {c.dona.cta} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Period-life band (white): kids + bus, plus the Disorderly Orderly clip */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <div className="max-w-3xl mb-12">
            <p className="eyebrow text-gold-600 mb-4">{c.period.eyebrow}</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
              {c.period.heading}
            </h2>
            <span className="gold-rule-dark mb-8" />
            <p className="text-lg text-navy-950/75 leading-relaxed">{c.period.body}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-12 items-start mb-16">
            {c.period.photos.map((id) => {
              const p = photo(id);
              return p ? <FramedArtifact key={id} photo={p} tone="onWhite" variant="photo" /> : null;
            })}
          </div>

          {film && (
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center border-t border-navy-950/10 pt-16">
              <div>
                <p className="eyebrow text-gold-600 mb-4">{c.period.film.eyebrow}</p>
                <p className="text-lg text-navy-950/75 leading-relaxed">{c.period.film.body}</p>
              </div>
              <SelfHostedVideo src={film.src} caption={film.caption} tone="onWhite" />
            </div>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
