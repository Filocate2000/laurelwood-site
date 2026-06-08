import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { devHistoryContent as c } from "@/content/dev-history";
import { photo, heroFor, type Photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "The development history of Laurelwood: architect David Freedman's 1958 town-and-country vision, the original brochure floorplans, and how the homes have evolved into the 21st century.";

export const metadata: Metadata = {
  title: "Development History",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/development-history") },
  openGraph: {
    title: "Development History",
    description: DESCRIPTION,
    url: absoluteUrl("/development-history"),
  },
};

/**
 * A centered canon plate (w-fit cream mat, p-3, gold border) for the galleries.
 * `widthClass` sizes the plate (e.g. "w-full max-w-[60rem]" stacked, or
 * "w-full md:w-[40rem]" in a flex-wrap row). The image fills the plate, so the
 * cream margin is the p-3 padding only. Optional caption (string or lines)
 * renders centered beneath the image, at the image width.
 */
function Plate({
  photo: p,
  widthClass,
  caption,
  captionTone = "muted",
}: {
  photo: Photo;
  widthClass: string;
  caption?: string | readonly string[];
  /** "muted" = italic slate (galleries); "gold" = gold label (plan rows). */
  captionTone?: "muted" | "gold";
}) {
  return (
    <figure
      className={`mx-auto ${widthClass} bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm`}
    >
      <Image
        src={p.src}
        alt={p.alt}
        width={p.width}
        height={p.height}
        sizes="(min-width: 768px) 60rem, 100vw"
        className="block w-full h-auto"
      />
      {caption && (
        <figcaption
          className={`mt-2 text-center text-sm leading-relaxed ${
            captionTone === "gold" ? "text-gold-600" : "italic text-slate-500"
          }`}
        >
          {Array.isArray(caption)
            ? caption.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))
            : caption}
        </figcaption>
      )}
    </figure>
  );
}

export default function DevelopmentHistoryPage() {
  const hero = heroFor("development-history");
  const strips = [1, 2, 3, 4].map((n) => photo(`laurelwood-floorplan-strip-${n}`));
  const scenics = [1, 2, 3, 4].map((n) => photo(`laurelwood-scenic-${n}`));
  const accent = photo("laurelwood-floorplan-strip-1");
  const exteriorPlans = [1, 2, 3, 4].map((n) => photo(`laurelwood-exterior-plan-${n}`));
  const interior = photo("laurelwood-interior-rendering");
  const fryman = photo("harry-c-fryman");

  return (
    <>
      {/* Hero band */}
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        title={c.hero.title}
        titleClassName="uppercase"
        subtitle={c.hero.subtitle}
        objectPosition="center 50%"
      />

      {/* Two figures who shaped Laurelwood (WHITE): intro distinguishing Harry C.
          Fryman (developer/landowner) from David Freedman (architect), with the
          Fryman portrait floated as a cream plate. Inserted between the image hero
          and the navy Dream band, so the band run alternates WHITE -> NAVY ->
          WHITE -> NAVY -> WHITE(CTA), no two adjacent same-color bands. Padding
          is tighter than the full canon bands (py-12 md:py-16) so this short
          intro hugs its paragraph + plate instead of leaving a tall empty gap. */}
      <section className="bg-white py-12 md:py-16 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          {/* Heading styled to match "The Laurelwood Dream in 1958" below, in the
              white-band variant (navy text + gold-rule-dark) already used by the
              21st Century band on this page. */}
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.figures.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            {fryman && (
              <>
                {/* desktop: cream plate floats right beside the prose; image LEFT,
                    caption RIGHT, side by side and vertically centered (shorter,
                    wider plate). Image pinned to ~14rem tall, uncropped. */}
                <figure className="hidden md:block md:float-right md:ml-10 mb-6 w-fit max-w-full bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Image
                      src={fryman.src}
                      alt={fryman.alt}
                      width={fryman.width}
                      height={fryman.height}
                      sizes="(min-width: 768px) 22rem, 100vw"
                      className="block h-auto md:h-[14rem] w-auto shrink-0"
                    />
                    <figcaption className="w-[18rem] text-sm italic text-slate-500 leading-relaxed">
                      {c.figures.caption}
                    </figcaption>
                  </div>
                </figure>
                {/* mobile: centered block above the prose */}
                <figure className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
                  <Image
                    src={fryman.src}
                    alt={fryman.alt}
                    width={fryman.width}
                    height={fryman.height}
                    sizes="100vw"
                    className="block w-full h-auto"
                  />
                  <figcaption className="mt-2 text-center text-sm italic text-slate-500 leading-relaxed">
                    {c.figures.caption}
                  </figcaption>
                </figure>
              </>
            )}
            <p className="mb-0">{c.figures.body}</p>
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* The Laurelwood Dream in 1958 (NAVY): vision, brochure passage with the
          gold-dot feature list (west Birth-band treatment), decorators paragraph. */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.dream.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            <p className="mb-6">{c.dream.vision}</p>
            <p className="mb-6">{c.dream.brochureIntro}</p>
            <ul className="list-disc pl-5 space-y-3 marker:text-gold-500 mb-6">
              {c.dream.features.map((f, i) => {
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
            <p className="mb-0">{c.dream.decorators}</p>
            {/* Floorplan/rendering area: staging caption centered above, then a
                two-column paired grid — row N = floorplan-strip-N (left, the
                gold-labeled montage) + exterior plan N (right, the "plan number
                N" plate). Equal column widths, tops aligned (items-start). */}
            <p className="mt-10 mb-10 text-lg md:text-xl text-ink-100 leading-relaxed">
              {c.dream.stagingCaption}
            </p>
            {/* Two 34rem columns centered together as a pair (justify-center) with
                a normal gap, and items-center so the shorter right (floor-plan)
                plate is vertically centered against the taller left (styles) plate
                in each row. */}
            <div className="grid grid-cols-1 md:grid-cols-[repeat(2,minmax(0,34rem))] justify-center gap-x-8 gap-y-10 items-center">
              {strips.map((s, i) => [
                // LEFT: the three exterior-style renderings (gold caption).
                s ? (
                  <Plate
                    key={`s${i}`}
                    photo={s}
                    widthClass="w-full"
                    caption={c.exterior.styles[i]}
                    captionTone="gold"
                  />
                ) : null,
                // RIGHT: the floor-plan blueprint offered (gold caption).
                exteriorPlans[i] ? (
                  <Plate
                    key={`e${i}`}
                    photo={exteriorPlans[i]}
                    widthClass="w-full"
                    caption={c.exterior.plans[i]}
                    captionTone="gold"
                  />
                ) : null,
              ])}
            </div>
          </div>
        </div>
      </section>

      {/* Laurelwood in the 21st Century (WHITE): three paragraphs, then the four
          scenic photos (merged up from the deleted Scenic gallery band). */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.century21.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            {c.century21.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
          {/* Scenic photos merged into this band, directly below the third
              paragraph: centered flex-wrap row, two per row, West/East captions.
              Captions are dark-muted on the cream plates, matching the white band. */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 md:gap-8 items-start">
            {scenics.map((s, i) =>
              s ? (
                <Plate
                  key={i}
                  photo={s}
                  widthClass="w-full md:w-[40rem]"
                  caption={c.scenic.captions[i]}
                />
              ) : null
            )}
          </div>
        </div>
      </section>

      {/* A Timeless Transformation (NAVY): intro paragraphs (with the small Multi
          Home Plan 1 accent floating right) + Interior Rendering float, the
          comparison entries, and the closing paragraph. Recolored to NAVY after
          the Scenic band was merged into the 21st Century band above. */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.transformation.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            {accent && (
              <>
                {/* desktop: small accent floats right beside the intro paragraphs */}
                <figure className="hidden md:block md:float-right md:ml-10 mb-6 w-fit max-w-full bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
                  <Image
                    src={accent.src}
                    alt={accent.alt}
                    width={accent.width}
                    height={accent.height}
                    sizes="(min-width: 768px) 16rem, 100vw"
                    className="block h-auto md:h-[10rem] w-auto"
                  />
                </figure>
                {/* mobile: centered block before the intro */}
                <figure className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
                  <Image
                    src={accent.src}
                    alt={accent.alt}
                    width={accent.width}
                    height={accent.height}
                    sizes="100vw"
                    className="block w-full h-auto"
                  />
                </figure>
              </>
            )}
            {c.transformation.intro.map((t, i) => (
              <p key={i} className="mb-6">
                {t}
              </p>
            ))}
            <div className="clear-both" />
            <p className="mb-8">{c.transformation.evolved}</p>
            {c.transformation.comparisons.map((cmp, i) => {
              const entry = (
                <div key={`cmp${i}`} className="mb-8">
                  <h3 className="font-display font-light text-xl md:text-2xl text-gold-500 mb-3">
                    {cmp.subhead}
                  </h3>
                  <p className="mb-3">
                    <strong className="font-semibold text-white">1958:</strong>
                    {cmp.then1958.replace(/^1958:/, "")}
                  </p>
                  <p className="mb-0">
                    <strong className="font-semibold text-white">Today:</strong>
                    {cmp.today.replace(/^Today:/, "")}
                  </p>
                </div>
              );
              // Interior Rendering canon plate floats right beside the final
              // (Aesthetic Features) entry + closing paragraph, ~14rem tall.
              if (i === 4 && interior) {
                return [
                  <figure
                    key="int-d"
                    className="hidden md:block md:float-right md:ml-10 mb-6 w-fit max-w-full bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm"
                  >
                    <Image
                      src={interior.src}
                      alt={interior.alt}
                      width={interior.width}
                      height={interior.height}
                      sizes="(min-width: 768px) 18rem, 100vw"
                      className="block h-auto md:h-[14rem] w-auto"
                    />
                    <figcaption className="mt-2 w-0 min-w-full text-center text-sm italic text-slate-500 leading-relaxed">
                      {c.exterior.interiorRendering.map((line, j) => (
                        <span key={j} className="block">
                          {line}
                        </span>
                      ))}
                    </figcaption>
                  </figure>,
                  <figure
                    key="int-m"
                    className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm"
                  >
                    <Image
                      src={interior.src}
                      alt={interior.alt}
                      width={interior.width}
                      height={interior.height}
                      sizes="100vw"
                      className="mx-auto block h-[14rem] w-auto max-w-full"
                    />
                    <figcaption className="mt-2 w-0 min-w-full text-center text-sm italic text-slate-500 leading-relaxed">
                      {c.exterior.interiorRendering.map((line, j) => (
                        <span key={j} className="block">
                          {line}
                        </span>
                      ))}
                    </figcaption>
                  </figure>,
                  entry,
                ];
              }
              return entry;
            })}
            <p className="mb-0">{c.transformation.closing}</p>
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* Closing CTA (WHITE) — alternation lands on white after the navy
          Then-and-Now band (the Scenic band was merged up into the 21st Century band). */}
      <ContactCTA tone="white" width="full" />
    </>
  );
}
