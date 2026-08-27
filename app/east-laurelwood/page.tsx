import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { FreewayMapFigure } from "@/components/FreewayMapFigure";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { NeighborhoodJsonLd } from "@/components/seo/JsonLd";
import { eastContent as c } from "@/content/east";
import { photo, heroFor, type Photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "East Laurelwood: a hillside retreat east of Laurel Canyon developed through the 1960s, known as The Bel Air of the Valley for its custom homes and panoramic views.";

export const metadata: Metadata = {
  title: "East Laurelwood",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/east-laurelwood") },
  openGraph: { title: "East Laurelwood", description: DESCRIPTION, url: absoluteUrl("/east-laurelwood") },
};

/**
 * Height-pinned floated figure (the west-laurelwood ad pattern, not a shared
 * component): a cream plate with the gold border, image height pinned via `h`
 * (e.g. "md:h-[22rem]") and width auto so the whole image shows uncropped. On
 * md+ it floats; below md the float collapses to a centered full-width block.
 * `h` MUST be passed as a literal string at the call site so Tailwind JIT emits
 * the arbitrary class.
 */
function PinnedFigure({
  photo: p,
  float,
  h,
  caption,
}: {
  photo: Photo;
  float: "left" | "right";
  h: string;
  caption?: string;
}) {
  const floatCls = float === "left" ? "md:float-left md:mr-10" : "md:float-right md:ml-10";
  // Desktop plate shrink-wraps a height-pinned image, so the caption must be held
  // to the image width (w-0 min-w-full) or it widens the plate. The mobile image
  // is w-full, so its caption is already the plate/image width.
  const capDesktop = "mt-2 w-0 min-w-full text-center text-sm italic text-slate-500 leading-relaxed";
  const capMobile = "mt-2 text-center text-sm italic text-slate-500 leading-relaxed";
  return (
    <>
      {/* desktop: floated, height-pinned */}
      <figure
        className={`hidden md:block ${floatCls} mb-6 w-fit max-w-full bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm`}
      >
        <Image
          src={p.src}
          alt={p.alt}
          width={p.width}
          height={p.height}
          sizes="(min-width: 768px) 30vw, 100vw"
          className={`mx-auto block ${h} w-auto h-auto`}
        />
        {caption && <figcaption className={capDesktop}>{caption}</figcaption>}
      </figure>
      {/* mobile: centered block */}
      <figure className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
        <Image
          src={p.src}
          alt={p.alt}
          width={p.width}
          height={p.height}
          sizes="100vw"
          className="block w-full h-auto"
        />
        {caption && <figcaption className={capMobile}>{caption}</figcaption>}
      </figure>
    </>
  );
}

export default function EastLaurelwoodPage() {
  const hero = heroFor("east-laurelwood");
  const gateway = photo("gateway-homes-billboard");
  const realty = photo("april-13-1966-east-laurelwood-ad");
  const kids = photo("neighborhood-children");
  const bus = photo("school-bus");
  const natures = photo("aug-23-1964-laurelwood-ad");
  const freeCar = photo("aug-16-1964-free-car-ad");
  const freewayMap = photo("route-170-freeway-study-map-1970");
  const homeContemporary = photo("east-laurelwood-contemporary-home");
  const homeTraditional = photo("east-laurelwood-traditional-home");
  const homeMidcentury = photo("east-laurelwood-midcentury-home");
  const homeHillside = photo("east-laurelwood-hillside-home");
  const homeModern = photo("east-laurelwood-modern-home");

  return (
    <>
      <NeighborhoodJsonLd name="East Laurelwood" description={DESCRIPTION} path="/east-laurelwood" />

      {/* Hero band */}
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
        objectPosition="center 55%"
      />

      {/* 2. Introduction (NAVY): text only */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.intro.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            {c.intro.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Vision (WHITE): Gateway billboard floats right beside the opening,
          Realty listing ad floats right beside the later paragraphs */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.vision.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            {gateway && <PinnedFigure photo={gateway} float="right" h="md:h-[22rem]" />}
            <p className="mb-5">{c.vision.body[0]}</p>
            <p className="mb-5">{c.vision.body[1]}</p>
            <div className="clear-both" />
            {realty && (
              <PinnedFigure
                photo={realty}
                float="right"
                h="md:h-[18rem]"
                caption={c.vision.realtyCaption}
              />
            )}
            <p className="mb-5">{c.vision.body[2]}</p>
            <p className="mb-5">{c.vision.body[3]}</p>
            <p className="mb-5">{c.vision.body[4]}</p>
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* 4. Growth & Expansion (NAVY): kids-waiting floats right beside the
          opening, kids-on-bus floats right beside the later paragraphs */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.growth.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            {kids && (
              <PinnedFigure photo={kids} float="right" h="md:h-[13rem]" caption={c.growth.kidsCaption} />
            )}
            <p className="mb-5">{c.growth.body[0]}</p>
            <p className="mb-5">{c.growth.body[1]}</p>
            <div className="clear-both" />
            {bus && (
              <PinnedFigure photo={bus} float="right" h="md:h-[13rem]" caption={c.growth.busCaption} />
            )}
            <p className="mb-5">{c.growth.body[2]}</p>
            <p className="mb-5">{c.growth.body[3]}</p>
            <p className="mb-5">{c.growth.body[4]}</p>
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Real Estate Ads (WHITE): free-car ad floats right beside "Initially,
          lots..."; Nature's Penthouse ad floats left beside "The ads highlighted
          the range of luxury features...". GAP: the Louise Rogers and 9 NEW HOMES
          ads named for a centered row are the SAME two scans already floated here
          (Aug 23 = Nature's Penthouse + Louise Rogers; Aug 16 = free-car + 9 NEW
          HOMES), so no distinct images exist, so the centered row is omitted pending
          separate crops from Jack. Captions stay dark-muted on the cream plates. */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.ads.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            <p className="mb-5">{c.ads.body[0]}</p>
            {freeCar && (
              <>
                {/* desktop: float right at NATURAL size. The plate shrink-wraps
                    the clipping (w-fit, no width class); the caption is constrained
                    to the image width via w-0 min-w-full so it never widens the
                    plate. Height is pinned to the clipping's own 474px because
                    w-auto/h-auto alone collapses under Next/Image's responsive
                    srcset inside a shrink-to-fit float; width then resolves to
                    natural. (Natural 474px < the 34rem overflow cap, and it clears
                    the section text at 1440px, so no max-h cap is applied.) */}
                <figure className="hidden md:block md:float-right md:ml-10 mb-6 w-fit max-w-full bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
                  <Image
                    src={freeCar.src}
                    alt={freeCar.alt}
                    width={freeCar.width}
                    height={freeCar.height}
                    sizes="175px"
                    className="block h-auto md:h-[474px] w-auto"
                  />
                  <figcaption className="mt-2 w-0 min-w-full text-center text-sm italic text-slate-500 leading-relaxed">
                    {c.ads.freeCarCaption}
                  </figcaption>
                </figure>
                {/* mobile: centered block, scaled to fit phone widths (h-[20rem]) */}
                <figure className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
                  <Image
                    src={freeCar.src}
                    alt={freeCar.alt}
                    width={freeCar.width}
                    height={freeCar.height}
                    sizes="175px"
                    className="mx-auto block h-[20rem] w-auto max-w-full"
                  />
                  <figcaption className="mt-2 w-0 min-w-full text-center text-sm italic text-slate-500 leading-relaxed">
                    {c.ads.freeCarCaption}
                  </figcaption>
                </figure>
              </>
            )}
            <p className="mb-5">{c.ads.body[1]}</p>
            {natures && (
              <>
                {/* desktop: float left at natural size, same shrink-wrap treatment */}
                <figure className="hidden md:block md:float-left md:mr-10 mb-6 w-fit max-w-full bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
                  <Image
                    src={natures.src}
                    alt={natures.alt}
                    width={natures.width}
                    height={natures.height}
                    sizes="369px"
                    className="block h-auto md:h-[474px] w-auto"
                  />
                  <figcaption className="mt-2 w-0 min-w-full text-center text-sm italic text-slate-500 leading-relaxed">
                    {c.ads.naturesCaption}
                  </figcaption>
                </figure>
                {/* mobile: centered block, scaled to fit phone widths (h-[20rem]) */}
                <figure className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
                  <Image
                    src={natures.src}
                    alt={natures.alt}
                    width={natures.width}
                    height={natures.height}
                    sizes="369px"
                    className="mx-auto block h-[20rem] w-auto max-w-full"
                  />
                  <figcaption className="mt-2 w-0 min-w-full text-center text-sm italic text-slate-500 leading-relaxed">
                    {c.ads.naturesCaption}
                  </figcaption>
                </figure>
              </>
            )}
            <p className="mb-5">{c.ads.body[2]}</p>
            <p className="mb-5">{c.ads.body[3]}</p>
            <p className="mb-5">{c.ads.body[4]}</p>
            <p className="mb-5">{c.ads.body[5]}</p>
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Preservation & Modern Day (NAVY): first modern home floats RIGHT beside
          "One of the most striking features..." (body[1]); second floats LEFT
          beside "However, the area hasn't been frozen in time..." (body[2]). Both
          stay active so the later paragraphs flow between them; cleared at the end. */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.preservation.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            <p className="mb-5">{c.preservation.body[0]}</p>
            {homeContemporary && (
              <PinnedFigure photo={homeContemporary} float="right" h="md:h-[15rem]" caption={homeContemporary.caption} />
            )}
            <p className="mb-5">{c.preservation.body[1]}</p>
            {homeTraditional && (
              <PinnedFigure photo={homeTraditional} float="left" h="md:h-[15rem]" caption={homeTraditional.caption} />
            )}
            <p className="mb-5">{c.preservation.body[2]}</p>
            <p className="mb-5">{c.preservation.body[3]}</p>
            <p className="mb-5">{c.preservation.body[4]}</p>
            <p className="mb-5">{c.preservation.body[5]}</p>
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Laurel Canyon Freeway Controversy (WHITE): 1969 study map floats right
          (~44%) beside the narrative; CA-170 / TO / CA-90 shield row centered
          below the prose (same component/classes as west, no plate on shields). */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.freeway.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            {freewayMap && (
              <FreewayMapFigure map={freewayMap} caption={c.freeway.mapCaption} />
            )}
            {c.freeway.body.map((t, i) => (
              <p key={i} className="mb-5">
                {t}
              </p>
            ))}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* East Laurelwood Today (NAVY): three modern home photos float alternating
          RIGHT / LEFT / RIGHT beside paragraphs 2, 3 and 4 (body[1..3]); all stay
          active so the prose flows between them, cleared at the end. Captions sit
          on the cream plates, so they keep the dark-muted color. */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.today.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            <p className="mb-5">{c.today.body[0]}</p>
            {homeHillside && (
              <PinnedFigure photo={homeHillside} float="right" h="md:h-[15rem]" caption={homeHillside.caption} />
            )}
            <p className="mb-5">{c.today.body[1]}</p>
            {homeMidcentury && (
              <PinnedFigure photo={homeMidcentury} float="left" h="md:h-[15rem]" caption={homeMidcentury.caption} />
            )}
            <p className="mb-5">{c.today.body[2]}</p>
            {homeModern && (
              <PinnedFigure photo={homeModern} float="right" h="md:h-[15rem]" caption={homeModern.caption} />
            )}
            <p className="mb-5">{c.today.body[3]}</p>
            <p className="mb-5">{c.today.body[4]}</p>
            <p className="mb-5">{c.today.body[5]}</p>
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Embrace the Lifestyle (WHITE): text only, 5 paragraphs. The duplicate
          "real estate ads window" paragraph stays omitted (kept once in Ads). */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.embrace.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            {c.embrace.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA (NAVY), keeps the navy/white alternation, identical to west */}
      <ContactCTA tone="navy" width="full" />
    </>
  );
}
