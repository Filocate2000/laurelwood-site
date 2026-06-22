import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { AgentJsonLd } from "@/components/seo/JsonLd";
import { loadDoc } from "@/lib/content";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Meet Karen and Jack Misraje, the mother-and-son partnership behind Misraje Real Estate Partners, specializing in Laurelwood Estates and Studio City luxury real estate.";

export const metadata: Metadata = {
  title: "Meet the Partners",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/meet-the-partners") },
  openGraph: { title: "Meet the Partners", description: DESCRIPTION, url: absoluteUrl("/meet-the-partners") },
};

export default function MeetThePartnersPage() {
  const partners = loadDoc("misraje-partners");

  return (
    <>
      {siteConfig.agents.map((a) => (
        <AgentJsonLd key={a.slug} slug={a.slug} />
      ))}

      <PageHero
        eyebrow="The Partners"
        title="Meet the Partners"
        subtitle="Two principals, one practice, on the streets of Laurelwood."
      />

      {/* Partnership intro */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <Prose variant="light">{partners}</Prose>
        </div>
      </section>

      {/* Partner bios, anchored for the /meet-the-partners#karen and #jack links */}
      {siteConfig.agents.map((a, i) => {
        const bio = loadDoc(`${a.slug}-misraje`);
        const light = i % 2 === 1;
        return (
          <section
            key={a.slug}
            id={a.slug}
            className={`scroll-mt-24 py-20 md:py-28 ${light ? "bg-white" : "bg-navy-950"}`}
          >
            <div className="editorial">
              <div className="flex flex-col sm:flex-row items-start gap-8 mb-10">
                {a.photo && (
                  <div
                    className="relative w-[160px] h-[200px] flex-shrink-0 overflow-hidden border-2 border-gold-500"
                    style={{ borderRadius: "2px" }}
                  >
                    <Image
                      src={a.photo}
                      alt={`${a.firstName} ${a.lastName}`}
                      fill
                      sizes="160px"
                      className="object-cover"
                      style={{ objectPosition: "center 25%" }}
                    />
                  </div>
                )}
                <div>
                  <h2
                    className={`font-display font-light text-3xl ${
                      light ? "text-navy-950" : "text-white"
                    }`}
                  >
                    {a.firstName} {a.lastName}
                  </h2>
                  <p className={`text-sm mt-1 ${light ? "text-navy-950/60" : "text-ink-300"}`}>
                    {a.title} · CalRE# {a.calRE}
                    {a.nmls ? ` · NMLS# ${a.nmls}` : ""}
                  </p>
                </div>
              </div>
              <Prose variant={light ? "light" : "dark"}>{bio}</Prose>
            </div>
          </section>
        );
      })}

      <ContactCTA />
    </>
  );
}
