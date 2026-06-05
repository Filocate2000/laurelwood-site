import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { FloatFigure } from "@/components/FloatFigure";
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

  const realtyAd = photo(c.archival.ads[0]); // Laurelwood Realty listing ad (tall, narrow)
  const motherInLaw = photo(c.archival.ads[1]); // Cannell & Chaffin mother-in-law (wide)
  const sensations = photo(c.archival.ads[2]); // Cannell & Chaffin sensations
  const billboard = photo(c.origins.billboard);
  const renderings = photo(c.origins.renderings);
  const tract = photo(c.origins.tractMap);
  const freewayMap = photo(c.freewayDefeat.map);
  const sign = photo(c.dona.sign);

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

      {/* Birth band (white): full-width measure; three small floated figures,
          one float at a time. The tract map is rendered twice with responsive
          visibility (the only pure-float way to both wrap p1+p2 on desktop AND
          keep p1 before the map on mobile, since floats cannot reorder per
          breakpoint without flex/grid). */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-600 mb-4">{c.intro.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.intro.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />

          <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            {/* Figure A (tract) desktop copy: floats right. Both A and B stay
                active; paragraphs 1-3 flow through the middle channel. */}
            {tract && (
              <figure className="hidden md:block md:float-right md:w-[20%] md:ml-10 mb-6 bg-[#f6f3ec] p-3 shadow-sm">
                <Image
                  src={tract.src}
                  alt={tract.alt}
                  width={tract.width}
                  height={tract.height}
                  sizes="20vw"
                  className="block w-full h-auto"
                />
                <figcaption className="mt-2 text-sm italic text-slate-500 leading-relaxed">
                  {c.intro.tractCaption}
                </figcaption>
              </figure>
            )}

            <p className="mb-6">{c.intro.body[0]}</p>

            {/* Figure A (tract) mobile copy: centered block after p1 */}
            {tract && (
              <figure className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] p-3 shadow-sm">
                <Image
                  src={tract.src}
                  alt={tract.alt}
                  width={tract.width}
                  height={tract.height}
                  sizes="100vw"
                  className="block w-full h-auto"
                />
                <figcaption className="mt-2 text-sm italic text-slate-500 leading-relaxed">
                  {c.intro.tractCaption}
                </figcaption>
              </figure>
            )}

            {/* Figure B (billboard) desktop copy: floats left, opposite the
                tract (no clear-both, so both floats overlap). */}
            {billboard && (
              <figure className="hidden md:block md:float-left md:w-[24%] md:mr-10 mb-6 bg-[#f6f3ec] p-3 shadow-sm">
                <Image
                  src={billboard.src}
                  alt={billboard.alt}
                  width={billboard.width}
                  height={billboard.height}
                  sizes="24vw"
                  className="block w-full h-auto"
                />
                <figcaption className="mt-2 text-sm italic text-slate-500 leading-relaxed">
                  {c.intro.billboardCaption}
                </figcaption>
              </figure>
            )}

            <p className="mb-6">{c.intro.body[1]}</p>

            {/* Figure B (billboard) mobile copy: centered block after p2 */}
            {billboard && (
              <figure className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] p-3 shadow-sm">
                <Image
                  src={billboard.src}
                  alt={billboard.alt}
                  width={billboard.width}
                  height={billboard.height}
                  sizes="100vw"
                  className="block w-full h-auto"
                />
                <figcaption className="mt-2 text-sm italic text-slate-500 leading-relaxed">
                  {c.intro.billboardCaption}
                </figcaption>
              </figure>
            )}

            <p className="mb-6">{c.intro.body[2]}</p>

            <div className="clear-both" />

            {/* Figure C (Plan 4B/4C elevations, wide): floats right, wrapped by
                the brochure copy + features list */}
            {renderings && (
              <figure className="md:float-right md:w-[38%] md:ml-10 mb-6 w-fit max-w-full mx-auto md:mx-0 bg-[#f6f3ec] p-3 shadow-sm">
                <Image
                  src={renderings.src}
                  alt={renderings.alt}
                  width={renderings.width}
                  height={renderings.height}
                  sizes="(min-width: 768px) 38vw, 100vw"
                  className="block w-full h-auto"
                />
                <figcaption className="mt-2 text-sm italic text-slate-500 leading-relaxed">
                  {c.intro.elevationsCaption}
                </figcaption>
              </figure>
            )}

            <p className="mb-6">{c.intro.brochureIntro}</p>
            <ul className="list-disc pl-5 mb-6 space-y-2 marker:text-gold-600">
              {c.intro.brochureFeatures.map((f, i) => {
                const idx = f.indexOf(": ");
                const term = f.slice(0, idx + 1);
                const rest = f.slice(idx + 1);
                return (
                  <li key={i}>
                    <strong className="font-semibold text-navy-950">{term}</strong>
                    {rest}
                  </li>
                );
              })}
            </ul>

            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Archive band (navy): one floated ad + a centered row of the rest */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-500 mb-4">{c.archival.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.archival.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg text-ink-100 leading-relaxed">
            {motherInLaw && <FloatFigure photo={motherInLaw} float="right" width="md:w-[42%]" />}
            <p>{c.archival.intro}</p>
            <div className="clear-both" />
            <div className="flex flex-wrap justify-center items-start gap-8 mt-12">
              {realtyAd && <FloatFigure photo={realtyAd} float={false} className="w-full sm:max-w-[230px]" />}
              {sensations && <FloatFigure photo={sensations} float={false} className="w-full sm:max-w-sm" />}
            </div>
          </div>
        </div>
      </section>

      {/* Origins band (white): float billboard, row the renderings + tract map */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-600 mb-4">{c.origins.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.origins.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg text-navy-950/75 leading-relaxed">
            {billboard && <FloatFigure photo={billboard} float="left" width="md:w-[38%]" />}
            <p>{c.origins.intro}</p>
            <div className="clear-both" />
            <div className="flex flex-wrap justify-center items-start gap-8 mt-12">
              {renderings && <FloatFigure photo={renderings} float={false} className="w-full sm:max-w-md" />}
              {tract && (
                <FloatFigure photo={tract} float={false} href={tract.src} className="w-full sm:max-w-[260px]" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Growth band (navy): text only */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
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

      {/* On the Big Screen band (white): clip floats right, copy wraps */}
      {film && (
        <section className="bg-white py-20 md:py-28 overflow-hidden">
          <div className="editorial max-w-4xl">
            <p className="eyebrow text-gold-600 mb-4">{c.film.eyebrow}</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
              {c.film.heading}
            </h2>
            <span className="gold-rule-dark mb-8" />
            <div className="text-lg text-navy-950/75 leading-relaxed">
              <div className="w-full md:w-[44%] my-6 md:my-2 mx-auto md:mx-0 md:float-right md:ml-8">
                <SelfHostedVideo src={film.src} caption={c.film.caption} tone="onWhite" />
              </div>
              {c.film.body.map((t, i) => (
                <p key={i} className="mb-5 last:mb-0">
                  {t}
                </p>
              ))}
              <div className="clear-both" />
            </div>
          </div>
        </section>
      )}

      {/* 1971 Freeway Defeat band (navy): study map floats right, shields under its caption */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
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
                float="right"
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
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Wilacre Park band (white): text only */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
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
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
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

      {/* Doña band (white): Cultural Legacy, sign floats right, copy wraps */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-600 mb-4">{c.dona.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.dona.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg text-navy-950/75 leading-relaxed">
            {sign && <FloatFigure photo={sign} float="right" width="md:w-[44%]" />}
            <p>{c.dona.body}</p>
            <div className="clear-both" />
            <div className="mt-8">
              <Link
                href={c.dona.href}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-navy-950 hover:text-gold-600 transition-colors"
              >
                {c.dona.cta} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* West Laurelwood Today band (navy): text only */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
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
