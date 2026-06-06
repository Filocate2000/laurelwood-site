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
}: {
  photo: Photo;
  widthClass: string;
  caption?: string | readonly string[];
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
        <figcaption className="mt-2 text-center text-sm italic text-slate-500 leading-relaxed">
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

/**
 * A floorplan-strip canon plate with the two-line label set INSIDE the image at
 * the bottom-right (gold, over a soft dark corner scrim + text-shadow so it stays
 * legible on the pale blueprint). Under ~480px the corner gets cramped, so the
 * label drops to a centered gold caption below the image instead.
 */
function FloorplanPlate({
  photo: p,
  label,
}: {
  photo: Photo;
  label: { title: string; subtitle: string };
}) {
  const shadow = { textShadow: "0 1px 3px rgba(0,0,0,0.55)" };
  return (
    <figure className="mx-auto w-full bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
      <div className="relative">
        <Image
          src={p.src}
          alt={p.alt}
          width={p.width}
          height={p.height}
          sizes="(min-width: 768px) 48rem, 100vw"
          className="block w-full h-auto"
        />
        <div className="hidden min-[480px]:block pointer-events-none absolute inset-0">
          <div className="absolute right-0 bottom-0 h-1/2 w-2/3 bg-gradient-to-tl from-black/45 via-black/15 to-transparent" />
          <div className="absolute right-4 bottom-3 text-right leading-tight">
            <span className="block font-semibold text-base text-gold-400" style={shadow}>
              {label.title}
            </span>
            <span className="block text-sm text-gold-400" style={shadow}>
              {label.subtitle}
            </span>
          </div>
        </div>
      </div>
      <figcaption className="min-[480px]:hidden mt-2 text-center leading-tight">
        <span className="block font-semibold text-base text-gold-600">{label.title}</span>
        <span className="block text-sm text-gold-600">{label.subtitle}</span>
      </figcaption>
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

  return (
    <>
      {/* Hero band */}
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        title={c.hero.title}
        subtitle={c.hero.subtitle}
        objectPosition="center 50%"
      />

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
            <div className="grid grid-cols-1 md:grid-cols-[repeat(2,minmax(0,34rem))] justify-center gap-x-8 gap-y-8 items-center">
              {strips.map((s, i) => [
                s ? (
                  <FloorplanPlate key={`s${i}`} photo={s} label={c.floorplanLabels[i]} />
                ) : null,
                exteriorPlans[i] ? (
                  <Plate
                    key={`e${i}`}
                    photo={exteriorPlans[i]}
                    widthClass="w-full"
                    caption={c.exterior.plans[i]}
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
