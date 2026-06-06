import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { AgentJsonLd } from "@/components/seo/JsonLd";
import { loadDoc } from "@/lib/content";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Misraje Real Estate Partners, founded by Karen and Jack Misraje, a mother-and-son team specializing in Laurelwood, the Doña streets, and Studio City luxury real estate.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: { title: "About", description: DESCRIPTION, url: absoluteUrl("/about") },
};

function Monogram({ initials }: { initials: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border border-gold-600/50 bg-navy-950 font-serif text-2xl text-gold-500"
    >
      {initials}
    </div>
  );
}

export default function AboutPage() {
  const partners = loadDoc("misraje-partners");

  return (
    <>
      {siteConfig.agents.map((a) => (
        <AgentJsonLd key={a.slug} slug={a.slug} />
      ))}

      <PageHero
        eyebrow="Who We Are"
        title="About Misraje"
        subtitle="A mother-and-son partnership that lives where it works."
      />

      {/* Partnership intro */}
      <section className="bg-white py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <Prose variant="light">{partners}</Prose>
        </div>
      </section>

      {/* Agent bios, anchored for the /about#karen and /about#jack links */}
      {siteConfig.agents.map((a, i) => {
        const bio = loadDoc(`${a.slug}-misraje`);
        const light = i % 2 === 1;
        return (
          <section
            key={a.slug}
            id={a.slug}
            className={`scroll-mt-24 py-20 md:py-28 ${light ? "bg-white" : "bg-navy-950"}`}
          >
            <div className="w-full px-6 md:px-16">
              <div className="flex items-center gap-5 mb-8">
                <Monogram initials={`${a.firstName[0]}${a.lastName[0]}`} />
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
