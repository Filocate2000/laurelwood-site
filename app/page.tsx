import Link from "next/link";
import type { ReactNode } from "react";
import { Hero } from "@/components/sections/Hero";
import { CommuteWidget } from "@/components/sections/CommuteWidget";
import { LaurelwoodMap } from "@/components/sections/LaurelwoodMap";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { FloatFigure } from "@/components/FloatFigure";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { homeContent } from "@/content/home";
import { photo } from "@/lib/photos";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  description:
    `${siteConfig.name}: the hyperlocal guide to West Laurelwood, East Laurelwood, and the Doña streets of ${siteConfig.tagline}, presented by ${siteConfig.legalName}.`,
};

// "West Laurelwood" / "East Laurelwood" are linked to their pages where they
// appear in the history section's first two paragraphs. Links the FIRST mention
// of each phrase within a paragraph (so paragraphs 1 and 2 each get one of each).
const NEIGHBORHOOD_LINKS: { phrase: string; href: string }[] = [
  { phrase: "West Laurelwood", href: "/west-laurelwood" },
  { phrase: "East Laurelwood", href: "/east-laurelwood" },
];

function linkifyNeighborhoods(text: string): ReactNode[] {
  const used = new Set<string>();
  const nodes: ReactNode[] = [];
  let rest = text;
  let k = 0;
  while (rest.length > 0) {
    let best: { idx: number; phrase: string; href: string } | null = null;
    for (const { phrase, href } of NEIGHBORHOOD_LINKS) {
      if (used.has(phrase)) continue;
      const idx = rest.indexOf(phrase);
      if (idx !== -1 && (best === null || idx < best.idx)) best = { idx, phrase, href };
    }
    if (!best) {
      nodes.push(rest);
      break;
    }
    if (best.idx > 0) nodes.push(rest.slice(0, best.idx));
    nodes.push(
      <Link
        key={`lw-${k++}`}
        href={best.href}
        className="text-gold-600 underline underline-offset-2 decoration-gold-600/40 hover:text-gold-500 transition-colors"
      >
        {best.phrase}
      </Link>
    );
    used.add(best.phrase);
    rest = rest.slice(best.idx + best.phrase.length);
  }
  return nodes;
}

export default function HomePage() {
  const c = homeContent;

  // Section 3 photos: three unused modern neighborhood shots from the scenic set
  // (the home Hero uses laurelwood-vista, so these stay clear of it).
  const histPhotoA = photo("laurelwood-scenic-1");
  const histPhotoB = photo("laurelwood-scenic-2");
  const histPhotoC = photo("laurelwood-scenic-4");

  // Neighborhood-teaser photos (below the map). No night/dusk street view is
  // processed in the photo set, so West uses the one unused scenic shot; East
  // uses an unused daytime home shot. Both avoid photos already on the homepage.
  const westTeaserPhoto = photo("laurelwood-scenic-3");
  const eastTeaserPhoto = photo("east-laurelwood-traditional-home");

  // Shared inline-link + CTA-button treatments for the white teaser band.
  const teaserLink =
    "text-gold-600 underline underline-offset-2 decoration-gold-600/40 hover:text-gold-500 transition-colors";
  const teaserCta =
    "inline-flex items-center justify-center px-10 py-4 text-[12px] uppercase text-white bg-navy-950 hover:bg-gold-600 transition-colors duration-300";

  return (
    <>
      <Hero />

      {/* 1. Welcome (WHITE) */}
      <section className="bg-white py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-600 mb-4">{c.welcome.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl lg:text-5xl text-navy-950 mb-6 leading-tight">
            {c.welcome.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <p className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            {c.welcome.body}
          </p>
        </div>
      </section>

      {/* 2. Commute widget (NAVY), keeps its native navy theme, moved up. */}
      <CommuteWidget />

      {/* 3. A Neighborhood of History, Charm, and Community (WHITE).
          Three canon gold plates: first floats right beside the opening
          paragraphs, second floats left further down, third sits in a centered
          row below (the text runs short at wide widths, per the section spec).
          Height-capped floats keep the plates from extending below the prose. */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="w-full px-6 md:px-16">
          <h2 className="font-display font-light text-3xl md:text-4xl lg:text-5xl text-navy-950 mb-5">
            {c.history.heading}
          </h2>
          <span className="gold-rule-dark mb-8" />
          <div className="text-lg md:text-xl text-navy-950/75 leading-relaxed">
            {histPhotoA && (
              <FloatFigure photo={histPhotoA} float="right" width="" maxImgH={260} />
            )}
            <p className="mb-5">{linkifyNeighborhoods(c.history.body[0])}</p>
            <p className="mb-5">{linkifyNeighborhoods(c.history.body[1])}</p>
            {histPhotoB && (
              <FloatFigure photo={histPhotoB} float="left" width="" maxImgH={260} />
            )}
            <p className="mb-5">{linkifyNeighborhoods(c.history.body[2])}</p>
            <p className="mb-0">{linkifyNeighborhoods(c.history.body[3])}</p>
            <div className="clear-both" />
          </div>
          {histPhotoC && (
            <div className="mt-12 flex justify-center">
              <FloatFigure photo={histPhotoC} float={false} maxImgH={420} />
            </div>
          )}
        </div>
      </section>

      {/* 4. West and East Laurelwood map (NAVY) */}
      <LaurelwoodMap />

      {/* 5. Neighborhood teasers (WHITE, directly below the navy map). Two split
          blocks: text left (~58%), canon plate right, vertically centered; mobile
          stacks text -> button -> photo. Copy verbatim from the Wix homepage.
          This WHITE band re-parities everything beneath it, so the sections below
          are re-alternated. */}
      <section className="bg-white py-20 md:py-28">
        <div className="w-full px-6 md:px-16 space-y-16 md:space-y-24">
          {/* BLOCK 1 - West Laurelwood */}
          <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
            <div className="md:col-span-8">
              <p className="eyebrow text-gold-600 mb-4">West Laurelwood</p>
              <h3 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
                Historic Mid-Century Modern Architecture
              </h3>
              <span className="gold-rule-dark mb-8" />
              <p className="text-lg text-navy-950/75 leading-relaxed mb-8">
                <Link href="/west-laurelwood" className={teaserLink}>
                  West Laurelwood
                </Link>
                , developed in 1958, is known for its historic mid-century homes, which line
                iconic streets like Doña Dorotea Dr. and Doña Mema Pl. These homes offer a
                timeless appeal, seamlessly blending vintage architecture with modern
                conveniences. Living in{" "}
                <Link href="/west-laurelwood" className={teaserLink}>
                  West Laurelwood
                </Link>{" "}
                means enjoying both the charm of mid-century design and the vibrant community
                of Studio City.
              </p>
              <Link
                href="/west-laurelwood"
                className={teaserCta}
                style={{ letterSpacing: "0.25em" }}
              >
                Discover West Laurelwood
              </Link>
            </div>
            {westTeaserPhoto && (
              <div className="md:col-span-4">
                <FloatFigure photo={westTeaserPhoto} float={false} caption="" className="w-full" />
              </div>
            )}
          </div>

          {/* BLOCK 2 - East Laurelwood */}
          <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
            <div className="md:col-span-8">
              <p className="eyebrow text-gold-600 mb-4">East Laurelwood</p>
              <h3 className="font-display font-light text-3xl md:text-4xl text-navy-950 mb-5">
                Mid-Century Modern Architecture, Phase Two
              </h3>
              <span className="gold-rule-dark mb-8" />
              <p className="text-lg text-navy-950/75 leading-relaxed mb-8">
                <Link href="/east-laurelwood" className={teaserLink}>
                  East Laurelwood
                </Link>
                , developed in 1960, is celebrated for its scenic views, spacious properties,
                and a family-friendly atmosphere. Streets like Doña Emilia Dr. and Doña Sofia
                Dr. offer a peaceful retreat with direct access to Fryman Canyon and nearby
                trails, perfect for families and outdoor enthusiasts alike. The community here
                enjoys both privacy and proximity to Studio City’s urban amenities.
              </p>
              <Link
                href="/east-laurelwood"
                className={teaserCta}
                style={{ letterSpacing: "0.25em" }}
              >
                Explore East Laurelwood
              </Link>
            </div>
            {eastTeaserPhoto && (
              <div className="md:col-span-4">
                <FloatFigure photo={eastTeaserPhoto} float={false} caption="" className="w-full" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Doña streets band (NAVY, with optional video if its subject matches) */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <p className="eyebrow text-gold-500 mb-4">{c.dona.eyebrow}</p>
          <h2 className="font-display font-light text-3xl md:text-4xl text-white mb-5">
            {c.dona.title}
          </h2>
          <span className="gold-rule mb-8" />
          <p className="text-lg text-ink-100 leading-relaxed mb-8">{c.dona.body}</p>
          <Link
            href={c.dona.href}
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-white hover:text-gold-500 transition-colors"
          >
            {c.dona.cta}
            <span aria-hidden="true">&rarr;</span>
          </Link>

          {c.video && (
            <div className="mt-12 max-w-4xl">
              <YouTubeEmbed id={c.video.id} title={c.video.title} />
            </div>
          )}
        </div>
      </section>

      {/* Why Misraje (WHITE) */}
      <section className="bg-white py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <div className="mb-16 max-w-4xl">
            <p className="eyebrow text-gold-600 mb-4">{c.why.eyebrow}</p>
            <h2 className="font-display font-light text-3xl md:text-4xl lg:text-5xl text-navy-950 leading-[1.1]">
              {c.why.heading}
            </h2>
            <span className="gold-rule-dark mt-8" />
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {c.why.points.map((p, i) => (
              <div key={p.title} className="group">
                <div
                  className="text-gold-600 font-display text-sm mb-4"
                  style={{ letterSpacing: "0.25em" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display font-light text-2xl text-navy-950 mb-4 group-hover:text-gold-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-navy-950/70 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (NAVY) */}
      <TestimonialsSection testimonials={c.testimonials} tone="navy" />

      {/* Contact CTA (WHITE) */}
      <ContactCTA />
    </>
  );
}
