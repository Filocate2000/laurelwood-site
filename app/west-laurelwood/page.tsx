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

  const billboard = photo(c.origins.billboard);
  const renderings = photo(c.origins.renderings);
  const tract = photo(c.origins.tractMap);
  const freewayMap = photo(c.freewayDefeat.map);
  const sign = photo(c.dona.sign);
  const kidsWaiting = photo("neighborhood-children"); // growth band: floats right, top of the stack
  const kidsOnBus = photo("school-bus"); // growth band: floats right, stacks under the first

  // Desktop display height of the Tract No. 24676 document (Figure A). The
  // width follows the aspect ratio. Tune the 26rem here. (Tailwind needs the
  // literal class, so keep md:h-[...] inline in this string.)
  const TRACT_IMG_CLASS = "block h-auto md:h-[26rem] w-auto";

  // Desktop display height of the two stacked growth-band photos. The width
  // follows the aspect ratio. Step this down (12rem, 11rem) if the stacked pair
  // ever runs below the last paragraph. (Keep the literal md:h-[...] class here.)
  const GROWTH_IMG_CLASS = "block h-auto md:h-[13rem] w-auto";

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

      {/* Birth band (NAVY): full-width measure; three small floated figures.
          The tract map is rendered twice with responsive visibility (the only
          pure-float way to wrap p1+p2 on desktop AND keep p1 before the map on
          mobile, since floats cannot reorder per breakpoint without flex/grid).
          The captions sit on the cream plates, so they stay dark. */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-500 mb-4">{c.intro.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.intro.heading}
          </h2>
          <span className="gold-rule mb-8" />

          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            {/* Figure A (tract) desktop copy: floats right. Both A and B stay
                active; paragraphs 1-3 flow through the middle channel. */}
            {tract && (
              <figure className="hidden md:block md:float-right md:ml-[100px] mb-6 w-fit max-w-full bg-[#f6f3ec] p-3 shadow-sm">
                <Image
                  src={tract.src}
                  alt={tract.alt}
                  width={tract.width}
                  height={tract.height}
                  sizes="320px"
                  className={TRACT_IMG_CLASS}
                />
                {/* w-0 + min-w-full makes the caption fill the image width and
                    wrap, without widening the shrink-to-fit plate past the image
                    (plain max-w-full cannot constrain a w-fit figure). */}
                <figcaption className="mt-2 w-0 min-w-full text-sm italic text-slate-500 leading-relaxed">
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

            {/* Figure C (Plan 4B/4C elevations) ONLY, in a centered wrapper that
                rises into the middle channel between the still-active floats. */}
            <div className="flow-root w-fit mx-auto max-w-[31rem]">
              {renderings && (
                <figure className="mb-6 bg-[#f6f3ec] p-3 shadow-sm">
                  <Image
                    src={renderings.src}
                    alt={renderings.alt}
                    width={renderings.width}
                    height={renderings.height}
                    sizes="(min-width: 768px) 31rem, 100vw"
                    className="block w-full h-auto"
                  />
                  <figcaption className="mt-2 text-sm italic text-slate-500 leading-relaxed">
                    {c.intro.elevationsCaption}
                  </figcaption>
                </figure>
              )}
            </div>

            <div className="clear-both" />

            {/* Brochure copy + feature list: full page width, after the floats,
                directly on the band (no background of their own). */}
            <p className="mb-6">{c.intro.brochureIntro}</p>
            <ul className="list-disc pl-5 space-y-3 marker:text-gold-500">
              {c.intro.brochureFeatures.map((f, i) => {
                const idx = f.indexOf(": ");
                const term = f.slice(0, idx + 1);
                const rest = f.slice(idx + 1);
                return (
                  <li key={i}>
                    <strong className="font-semibold text-white">{term}</strong>
                    {rest}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* On the Big Screen band (WHITE): the ONLY content in this band. The two
          paragraphs run full width; the clip is centered below them. */}
      {film && (
        <section className="bg-white py-20 md:py-28">
          <div className="w-full px-6 md:px-16">
            <p className="eyebrow text-gold-600 mb-4">{c.film.eyebrow}</p>
            <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
              {c.film.heading}
            </h2>
            <span className="gold-rule-dark mb-8" />
            <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
              {c.film.body.map((t, i) => (
                <p key={i} className="mb-6 last:mb-0">
                  {t}
                </p>
              ))}
            </div>
            <div className="mt-10 mx-auto w-full max-w-[42rem]">
              <SelfHostedVideo src={film.src} caption={c.film.caption} tone="onWhite" />
            </div>
          </div>
        </section>
      )}

      {/* Growth band (NAVY): the two kids/bus photos float right and stack;
          the two paragraphs wrap to their left. Heights are pinned (not widths)
          so the stacked pair stays within the text block and never runs below
          the last paragraph. On mobile the floats drop to centered blocks
          between the paragraphs, in reading order. Captions sit on the cream
          plates, so they keep the dark muted color (text-slate-500). */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-500 mb-4">{c.growth.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.growth.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg text-ink-100 leading-relaxed">
            {/* Figure 1 (kids waiting) desktop: floats right at the top. */}
            {kidsWaiting && (
              <figure className="hidden md:block md:float-right md:ml-10 mb-6 w-fit max-w-full bg-[#f6f3ec] p-3 shadow-sm">
                <Image
                  src={kidsWaiting.src}
                  alt={kidsWaiting.alt}
                  width={kidsWaiting.width}
                  height={kidsWaiting.height}
                  sizes="320px"
                  className={GROWTH_IMG_CLASS}
                />
                {/* w-0 + min-w-full holds the caption to the image width without
                    widening the shrink-to-fit plate past the photo. */}
                <figcaption className="mt-2 w-0 min-w-full text-sm italic text-slate-500 leading-snug">
                  {kidsWaiting.caption}
                </figcaption>
              </figure>
            )}

            <p className="mb-5">{c.growth.body[0]}</p>

            {/* Figure 1 mobile: centered block after the first paragraph. */}
            {kidsWaiting && (
              <figure className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] p-3 shadow-sm">
                <Image
                  src={kidsWaiting.src}
                  alt={kidsWaiting.alt}
                  width={kidsWaiting.width}
                  height={kidsWaiting.height}
                  sizes="100vw"
                  className="block w-full h-auto"
                />
                <figcaption className="mt-2 text-sm italic text-slate-500 leading-snug">
                  {kidsWaiting.caption}
                </figcaption>
              </figure>
            )}

            {/* Figure 2 (kids on the bus) desktop: floats right, stacks under
                Figure 1 (placed mid-text so it rises beside the prose). */}
            {kidsOnBus && (
              <figure className="hidden md:block md:float-right md:ml-10 mb-6 w-fit max-w-full bg-[#f6f3ec] p-3 shadow-sm">
                <Image
                  src={kidsOnBus.src}
                  alt={kidsOnBus.alt}
                  width={kidsOnBus.width}
                  height={kidsOnBus.height}
                  sizes="320px"
                  className={GROWTH_IMG_CLASS}
                />
                <figcaption className="mt-2 w-0 min-w-full text-sm italic text-slate-500 leading-snug">
                  {kidsOnBus.caption}
                </figcaption>
              </figure>
            )}

            <p className="mb-5 last:mb-0">{c.growth.body[1]}</p>

            {/* Figure 2 mobile: centered block after the second paragraph. */}
            {kidsOnBus && (
              <figure className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] p-3 shadow-sm">
                <Image
                  src={kidsOnBus.src}
                  alt={kidsOnBus.alt}
                  width={kidsOnBus.width}
                  height={kidsOnBus.height}
                  sizes="100vw"
                  className="block w-full h-auto"
                />
                <figcaption className="mt-2 text-sm italic text-slate-500 leading-snug">
                  {kidsOnBus.caption}
                </figcaption>
              </figure>
            )}

            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* 1971 Freeway Defeat band (WHITE): study map floats right, shields under its caption */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-600 mb-4">{c.freewayDefeat.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.freewayDefeat.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg text-navy-950/75 leading-relaxed">
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

      {/* Wilacre Park band (NAVY): text only */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-500 mb-4">{c.preservation.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.preservation.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg text-ink-100 leading-relaxed">
            {c.preservation.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Fryman Road Extension band (WHITE): text only */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-600 mb-4">{c.frymanRoad.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.frymanRoad.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg text-navy-950/75 leading-relaxed">
            {c.frymanRoad.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Doña band (NAVY): Cultural Legacy, sign floats right, copy wraps */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-500 mb-4">{c.dona.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.dona.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg text-ink-100 leading-relaxed">
            {sign && <FloatFigure photo={sign} float="right" width="md:w-[44%]" />}
            <p>{c.dona.body}</p>
            <div className="clear-both" />
            <div className="mt-8">
              <Link
                href={c.dona.href}
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-white hover:text-gold-500 transition-colors"
              >
                {c.dona.cta} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* West Laurelwood Today band (WHITE): text only */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-600 mb-4">{c.today.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.today.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg text-navy-950/75 leading-relaxed">
            {c.today.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA band (NAVY) to keep the page alternation */}
      <ContactCTA tone="navy" width="full" />
    </>
  );
}
