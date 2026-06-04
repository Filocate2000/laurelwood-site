import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { NeighborhoodJsonLd } from "@/components/seo/JsonLd";
import { donaContent } from "@/content/dona";
import { heroFor } from "@/lib/photos";
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
  const hero = heroFor("dona-streets");
  return (
    <>
      <NeighborhoodJsonLd name="The Doña Streets, Laurelwood" description={DESCRIPTION} path="/dona-streets" />
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        eyebrow={c.eyebrow}
        title={c.title}
        subtitle={c.subtitle}
      />
      <section className="bg-white py-20 md:py-28">
        <div className="editorial max-w-prose">
          <div className="editorial-prose editorial-prose-light">
            {c.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-12">
            <p className="eyebrow text-gold-600 mb-5">The Doña Streets</p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {c.streets.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-3 text-navy-950 text-lg border-b border-navy-950/10 pb-3"
                >
                  <span className="h-px w-6 bg-gold-600 flex-shrink-0" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="text-navy-950/60 text-sm mt-4">
              Streets named in the neighborhood&apos;s source history. The community may
              include additional Doña streets.
            </p>
          </div>

          <p className="text-navy-950/75 text-lg leading-relaxed mt-12 max-w-prose">{c.closing}</p>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
