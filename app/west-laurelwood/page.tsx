import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { FloatFigure } from "@/components/FloatFigure";
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

  const ad0 = photo(c.archival.ads[0]); // Laurelwood Realty listing ad (tall, narrow)
  const ad1 = photo(c.archival.ads[1]); // Cannell & Chaffin mother-in-law (wide)
  const ad2 = photo(c.archival.ads[2]); // Cannell & Chaffin sensations
  const billboard = photo(c.origins.billboard);
  const renderings = photo(c.origins.renderings);
  const tract = photo(c.origins.tractMap);
  const freewayMap = photo(c.freewayDefeat.map);

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

      {/* Birth band (white): text only, capped measure */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial max-w-3xl">
          <p className="eyebrow text-gold-600 mb-4">{c.intro.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.intro.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg text-navy-950/75 leading-relaxed">
            {c.intro.body.map((p, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Archive band (navy): ads float inside the prose, shrink-wrapped plates */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-500 mb-4">{c.archival.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.archival.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg text-ink-100 leading-relaxed">
            {ad1 && (
              <FloatFigure photo={ad1} side="left" tone="onNavy" fit="fill" width="md:w-[44%]" />
            )}
            {ad0 && (
              <FloatFigure
                photo={ad0}
                side="right"
                tone="onNavy"
                fit="hug"
                width="md:w-auto md:max-w-[190px]"
                maxH={360}
              />
            )}
            <p className="mb-5">{c.archival.intro}</p>
            {ad2 && (
              <FloatFigure
                photo={ad2}
                side="right"
                tone="onNavy"
                fit="hug"
                width="md:w-auto md:max-w-[240px]"
                maxH={260}
              />
            )}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Origins band (white): billboard + renderings + tract, floated */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-600 mb-4">{c.origins.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.origins.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg text-navy-950/75 leading-relaxed">
            {billboard && (
              <FloatFigure photo={billboard} side="left" tone="onWhite" fit="fill" width="md:w-[38%]" />
            )}
            <p className="mb-5">{c.origins.intro}</p>
            {renderings && (
              <FloatFigure photo={renderings} side="right" tone="onWhite" fit="fill" width="md:w-[40%]" />
            )}
            {tract && (
              <FloatFigure
                photo={tract}
                side="left"
                tone="onWhite"
                fit="fill"
                width="md:w-[30%]"
                href={tract.src}
              />
            )}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Growth band (navy): text only */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-3xl">
          <p className="eyebrow text-gold-500 mb-4">{c.growth.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.growth.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg text-ink-100 leading-relaxed">
            {c.growth.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* On the Big Screen band (white): the clip floats, copy wraps */}
      {film && (
        <section className="bg-white py-20 md:py-28">
          <div className="editorial max-w-4xl">
            <p className="eyebrow text-gold-600 mb-4">{c.film.eyebrow}</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
              {c.film.heading}
            </h2>
            <span className="gold-rule-dark mb-8" />
            <div className="text-lg text-navy-950/75 leading-relaxed">
              <div className="w-full my-6 md:my-2 md:float-right md:ml-8 md:w-[44%]">
                <SelfHostedVideo src={film.src} caption={c.film.caption} tone="onWhite" />
              </div>
              {c.film.body.map((t, i) => (
                <p key={i} className="mb-5">
                  {t}
                </p>
              ))}
              <div className="clear-both" />
            </div>
          </div>
        </section>
      )}

      {/* 1971 Freeway Defeat band (navy): study map floats, shields under caption */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-500 mb-4">{c.freewayDefeat.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.freewayDefeat.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg text-ink-100 leading-relaxed">
            {freewayMap && (
              <FloatFigure
                photo={freewayMap}
                side="left"
                tone="onNavy"
                fit="fill"
                width="md:w-[44%]"
                href={freewayMap.src}
                caption={c.freewayDefeat.mapCaption}
              >
                <div className="mt-3 flex items-center gap-4">
                  {c.freewayDefeat.shields.map((id) => {
                    const s = photo(id);
                    return s ? (
                      <Image
                        key={id}
                        src={s.src}
                        alt={s.alt}
                        width={s.width}
                        height={s.height}
                        className="h-auto w-[100px]"
                      />
                    ) : null;
                  })}
                </div>
              </FloatFigure>
            )}
            {c.freewayDefeat.body.map((t, i) => (
              <p key={i} className="mb-5">
                {t}
              </p>
            ))}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Wilacre Park band (white): text only */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial max-w-3xl">
          <p className="eyebrow text-gold-600 mb-4">{c.preservation.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.preservation.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg text-navy-950/75 leading-relaxed">
            {c.preservation.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Fryman Road Extension band (navy): text only */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-3xl">
          <p className="eyebrow text-gold-500 mb-4">{c.frymanRoad.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.frymanRoad.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg text-ink-100 leading-relaxed">
            {c.frymanRoad.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Doña band (white): Cultural Legacy in Street Names, full-width sign banner */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <div className="max-w-3xl mb-10">
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

      {/* West Laurelwood Today band (navy): text only */}
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

      <ContactCTA />
    </>
  );
}
