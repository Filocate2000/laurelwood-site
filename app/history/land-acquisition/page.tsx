import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { landAcquisitionContent as c } from "@/content/land-acquisition";
import { photo, heroFor, type Photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "The land acquisition history of Laurelwood: from the Fryman heirs to Chapman College to Home Savings and Loan, the 1958 development of West Laurelwood, and the Spanish street-name legacy of the Dona streets.";

export const metadata: Metadata = {
  title: "Land Acquisition History",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/history/land-acquisition") },
  openGraph: {
    title: "Land Acquisition History",
    description: DESCRIPTION,
    url: absoluteUrl("/history/land-acquisition"),
  },
};

/** Height-pinned canon plate that floats right in prose (desktop) and collapses
 *  to a centered block (mobile). Caption held to the image width. `h` MUST be a
 *  literal class at the call site (e.g. "md:h-[18rem]") for Tailwind JIT. */
function FloatPlate({ photo: p, h, caption }: { photo: Photo; h: string; caption?: string }) {
  return (
    <>
      <figure className="hidden md:block md:float-right md:ml-10 mb-6 w-fit max-w-full bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
        <Image
          src={p.src}
          alt={p.alt}
          width={p.width}
          height={p.height}
          sizes="(min-width: 768px) 24rem, 100vw"
          className={`block h-auto ${h} w-auto`}
        />
        {caption && (
          <figcaption className="mt-2 w-0 min-w-full text-center text-sm italic text-slate-500 leading-relaxed">
            {caption}
          </figcaption>
        )}
      </figure>
      <figure className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
        <Image
          src={p.src}
          alt={p.alt}
          width={p.width}
          height={p.height}
          sizes="100vw"
          className="block w-full h-auto"
        />
        {caption && (
          <figcaption className="mt-2 text-center text-sm italic text-slate-500 leading-relaxed">
            {caption}
          </figcaption>
        )}
      </figure>
    </>
  );
}

/** Centered canon plate for a flex-wrap gallery row, caption centered below. */
function GalleryPlate({ photo: p, caption }: { photo: Photo; caption?: string }) {
  return (
    <figure className="mx-auto w-full md:w-[40rem] bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
      <Image
        src={p.src}
        alt={p.alt}
        width={p.width}
        height={p.height}
        sizes="(min-width: 768px) 40rem, 100vw"
        className="block w-full h-auto"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm italic text-slate-500 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default function LandAcquisitionHistoryPage() {
  const hero = heroFor("land-acquisition");
  const fryman = photo("harry-c-fryman-portrait");
  const entranceSign = photo("laurelwood-entrance-sign");
  const donaSign = photo("dona-maria-street-sign");

  return (
    <>
      {/* Hero band */}
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        title={c.hero.title}
        objectPosition="center 45%"
      />

      {/* 2. Development of West Laurelwood (1958) (NAVY): Fryman portrait floats
          right beside the two paragraphs, with its long caption. */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-500 mb-4">{c.west.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.west.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            {fryman && <FloatPlate photo={fryman} h="md:h-[14rem]" caption={c.west.frymanCaption} />}
            {c.west.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* 3. Expansion to East Laurelwood (1960) (WHITE): one paragraph, text only. */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-600 mb-4">{c.east.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.east.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            <p className="mb-0">{c.east.body}</p>
          </div>
        </div>
      </section>

      {/* 4. Laurelwood Today (NAVY): one paragraph, then a centered flex-wrap row
          of two scenic plates (West / East). */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.today.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            <p className="mb-0">{c.today.body}</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 md:gap-8 items-start">
            {entranceSign && (
              <GalleryPlate photo={entranceSign} caption={c.today.captionWest} />
            )}
            {/* GAP: the "East Laurelwood" night street-view plate
                (PXL_20240907_052615751_NIGHT.jpg) is ABSENT from source-photos;
                plate omitted. Its caption would be c.today.captionEast. */}
          </div>
        </div>
      </section>

      {/* 5. Preserving Cultural Legacy Through Iconic Street Names (WHITE): two
          paragraphs; the Dona Maria street sign floats right (reused). */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.streetNames.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            {donaSign && <FloatPlate photo={donaSign} h="md:h-[7rem]" />}
            {c.streetNames.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* 6. For Home Buyers (NAVY): two paragraphs; the buyers' home photo would
          float right, but it is ABSENT from source-photos (see GAP comment). */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.buyers.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            {/* GAP: the buyers' mid-century home photo (Lauelwood Buyers.jpg, note
                the Wix filename typo) is ABSENT from source-photos; the ~md:h-[14rem]
                right float is omitted until the file is provided. */}
            {c.buyers.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* 7. For Homeowners (WHITE): three paragraphs, text only. "By registering"
          renders as plain text (no link) per Jack's decision flag. */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.homeowners.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            {c.homeowners.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Laurelwood: A Place to Call Home (NAVY): two paragraphs, text only. */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.closing.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            {c.closing.body.map((t, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Closing CTA (WHITE) — alternation lands on white after the navy closing band. */}
      <ContactCTA tone="white" width="full" />
    </>
  );
}
