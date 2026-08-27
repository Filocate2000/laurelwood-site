import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";
import { whoWeAreContent, type ImageRef } from "@/content/who-we-are";

const c = whoWeAreContent;

export const metadata: Metadata = {
  title: c.title,
  description: c.metaDescription,
  alternates: { canonical: absoluteUrl("/who-we-are") },
  openGraph: {
    title: c.title,
    description: c.metaDescription,
    url: absoluteUrl("/who-we-are"),
  },
};

/** Gold-framed portrait plate used beside the prose in the two split bands. */
function Plate({ image, className }: { image: ImageRef; className: string }) {
  return (
    <div
      className={`relative aspect-[4/5] overflow-hidden ${className} border-2 border-gold-500`}
      style={{ borderRadius: "2px" }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-serif text-3xl md:text-4xl font-normal text-navy-950 mb-8"
      style={{ letterSpacing: "-0.01em" }}
    >
      {children}
    </h2>
  );
}

function Body({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-5 text-base text-stone-700 leading-relaxed">
      {paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

export default function WhoWeArePage() {
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
          <div className="max-w-4xl mx-auto space-y-16 md:space-y-20">

            {/* Opening: lead prose, no heading */}
            <div className="space-y-5 text-lg text-stone-700 leading-relaxed">
              {c.opening.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {/* Off-market access, image beside text (image left) */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <Plate image={c.offMarket.image} className="order-1 md:order-1" />
              <div className="order-2 md:order-2">
                <Heading>{c.offMarket.heading}</Heading>
                <Body paragraphs={c.offMarket.body} />
              </div>
            </div>

            {/* How a listing is marketed, image beside text (image right, alternating) */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              <div className="order-2 md:order-1">
                <Heading>{c.marketing.heading}</Heading>
                <Body paragraphs={c.marketing.body} />
              </div>
              <Plate image={c.marketing.image} className="order-1 md:order-2" />
            </div>

            {/* The partnership */}
            <div>
              <Heading>{c.partnership.heading}</Heading>
              <div className="space-y-5 text-base text-stone-700 leading-relaxed">
                <p>
                  {c.partnership.paragraph.pre}
                  <Link
                    href={c.partnership.paragraph.href}
                    className="text-navy-950 hover:text-gold-500 underline underline-offset-4 transition-colors"
                  >
                    {c.partnership.paragraph.linkText}
                  </Link>
                  {c.partnership.paragraph.post}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
