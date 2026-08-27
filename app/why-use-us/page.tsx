import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";
import { whyUseUsContent, type PracticeSection } from "@/content/why-use-us";

const c = whyUseUsContent;

export const metadata: Metadata = {
  title: c.title,
  description: c.metaDescription,
  alternates: { canonical: absoluteUrl("/why-use-us") },
  openGraph: {
    title: c.title,
    description: c.metaDescription,
    url: absoluteUrl("/why-use-us"),
  },
};

/** Eyebrow + serif heading + prose. The shared inner of every band below. */
function Prose({ section }: { section: PracticeSection }) {
  return (
    <>
      <p
        className="text-[11px] font-medium text-gold-500 mb-4"
        style={{ letterSpacing: "0.18em" }}
      >
        {section.eyebrow}
      </p>
      <h2
        className="font-serif text-3xl md:text-4xl font-normal text-navy-950 mb-8"
        style={{ letterSpacing: "-0.01em" }}
      >
        {section.heading}
      </h2>
      <div className="space-y-5 text-base text-stone-700 leading-relaxed">
        {section.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </>
  );
}

/** Gold-framed photo plate. */
function Plate({
  section,
  className,
}: {
  section: PracticeSection;
  className: string;
}) {
  if (!section.image) return null;
  return (
    <div
      className={`relative aspect-[4/5] overflow-hidden ${className} border-2 border-gold-500`}
      style={{ borderRadius: "2px" }}
    >
      <Image
        src={section.image.src}
        alt={section.image.alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

export default function WhyUseUsPage() {
  const hero = photo(c.heroPhotoId);
  return (
    <>
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        scrim="dark"
        eyebrow={c.eyebrow}
        title={c.title}
        subtitle={c.subtitle}
      />

      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <div className="space-y-20 md:space-y-28">

            {/* FOR SELLERS: image left, text right */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <Plate section={c.sellers} className="order-1 md:order-1" />
              <div className="order-2 md:order-2">
                <Prose section={c.sellers} />
              </div>
            </div>

            {/* FOR BUYERS: text only, constrained for readability */}
            <div className="max-w-3xl">
              <Prose section={c.buyers} />
            </div>

            {/* NEGOTIATION AND CLOSING: text left, image right (alternating) */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <div className="order-2 md:order-1">
                <Prose section={c.negotiation} />
              </div>
              <Plate section={c.negotiation} className="order-1 md:order-2" />
            </div>

          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
