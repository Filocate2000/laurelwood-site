import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { NeighborhoodJsonLd } from "@/components/seo/JsonLd";
import { donaContent } from "@/content/dona";
import { heroFor, photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "The Doña streets of Laurelwood: the Spanish-named streets, including Doña Emilia, Doña Rosa, and Doña Pegita, at the cultural heart of this Studio City neighborhood.";

export const metadata: Metadata = {
  title: "The Doña Streets",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/dona-streets") },
  openGraph: { title: "The Doña Streets", description: DESCRIPTION, url: absoluteUrl("/dona-streets") },
};

export default function DonaStreetsPage() {
  const c = donaContent;
  // Hero: the processed aerial of the neighborhood. object-position biases the
  // desktop crop downward so the foreground streets/homes stay in frame (the
  // middle of the frame is the wooded canyon).
  const hero = heroFor("dona-streets");
  // The Doña Maria street sign now illustrates the "What Doña Means" section.
  const sign = photo("dona-maria-street-sign");
  return (
    <>
      <NeighborhoodJsonLd name="The Doña Streets, Laurelwood" description={DESCRIPTION} path="/dona-streets" />
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        objectPosition="center 75%"
        eyebrow={c.eyebrow}
        title={c.title}
        subtitle={c.subtitle}
      />

      {/* Opening section (WHITE) */}
      <section className="bg-white py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <div className="space-y-5 text-lg md:text-xl text-navy-950/75 leading-relaxed">
            {c.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <p className="text-navy-950/75 text-lg leading-relaxed mt-12">{c.closing}</p>
        </div>
      </section>

      {/* What Doña Means (NAVY). The Doña Maria sign floats right as a canon
          plate, illustrating the honorific discussion. */}
      <section className="bg-navy-950 py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.whatDonaMeans.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="text-lg md:text-xl text-ink-100 leading-relaxed">
            {sign && (
              <>
                {/* Desktop: height-pinned canon plate, floated right. */}
                <figure className="hidden md:block md:float-right md:ml-10 mb-6 w-fit max-w-full bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
                  <Image
                    src={sign.src}
                    alt={sign.alt}
                    width={sign.width}
                    height={sign.height}
                    sizes="(min-width: 768px) 51rem, 100vw"
                    className="block h-auto md:h-[14rem] w-auto"
                  />
                  {sign.caption && (
                    <figcaption className="mt-2 w-0 min-w-full text-center text-sm italic text-slate-500 leading-relaxed">
                      {sign.caption}
                    </figcaption>
                  )}
                </figure>
                {/* Mobile: centered full-width plate above the prose. */}
                <figure className="md:hidden my-6 w-fit max-w-full mx-auto bg-[#f6f3ec] border border-gold-500/50 p-3 shadow-sm">
                  <Image
                    src={sign.src}
                    alt={sign.alt}
                    width={sign.width}
                    height={sign.height}
                    sizes="100vw"
                    className="block w-full h-auto"
                  />
                  {sign.caption && (
                    <figcaption className="mt-2 text-center text-sm italic text-slate-500 leading-relaxed">
                      {sign.caption}
                    </figcaption>
                  )}
                </figure>
              </>
            )}
            {c.whatDonaMeans.body.map((p, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {p}
              </p>
            ))}
            <div className="clear-both" />
          </div>
        </div>
      </section>

      {/* The Names, Street by Street (WHITE) */}
      <section className="bg-white py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
            {c.glossary.heading}
          </h2>
          <span className="gold-rule-dark mb-10" />
          <div className="space-y-12">
            {[
              { label: "West Laurelwood", list: c.glossary.west },
              { label: "East Laurelwood", list: c.glossary.east },
            ].map(({ label, list }) => (
              <div key={label}>
                <h3 className="font-display font-light text-2xl text-navy-950 mb-6">
                  {label}
                </h3>
                <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
                  {list.map((entry) => (
                    <li
                      key={entry.name}
                      className="flex gap-3 border-b border-navy-950/10 pb-3"
                    >
                      <span
                        className="mt-2.5 h-px w-6 bg-gold-600 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-navy-950/75 text-lg leading-relaxed">
                        <span className="font-display font-semibold text-navy-950">
                          {entry.name}
                        </span>
                        : {entry.meaning}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA recolored navy to keep band alternation after the new white section. */}
      <ContactCTA tone="navy" />
    </>
  );
}
