import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { CommuteWidget } from "@/components/sections/CommuteWidget";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { homeContent } from "@/content/home";

export const metadata = {
  description:
    "Laurelwood Estates: the hyperlocal guide to West Laurelwood, East Laurelwood, and the Doña streets of Studio City, presented by Misraje Real Estate Partners.",
};

export default function HomePage() {
  const c = homeContent;

  return (
    <>
      <Hero />

      {/* Intro band (navy) */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-4xl">
          <p className="eyebrow text-gold-500 mb-4">{c.intro.eyebrow}</p>
          <h2 className="font-display font-light text-display text-white mb-6 leading-tight">
            {c.intro.heading}
          </h2>
          <span className="gold-rule mb-8" />
          <div className="space-y-5 text-lg text-ink-100 leading-relaxed">
            {c.intro.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* West / East split bands (alternating navy / white) */}
      {c.neighborhoods.map((n, i) => {
        const light = i % 2 === 0; // West on white, East on navy
        return (
          <section
            key={n.key}
            className={light ? "bg-white py-20 md:py-28" : "bg-navy-900 py-20 md:py-28"}
          >
            <div className="editorial max-w-4xl">
              <p className={`eyebrow mb-4 ${light ? "text-gold-600" : "text-gold-500"}`}>
                {n.eyebrow}
              </p>
              <h2
                className={`font-display font-light text-3xl md:text-4xl mb-5 ${
                  light ? "text-navy-950" : "text-white"
                }`}
              >
                {n.title}
              </h2>
              <span className={`${light ? "gold-rule-dark" : "gold-rule"} mb-8`} />
              <p
                className={`text-lg leading-relaxed mb-8 ${
                  light ? "text-navy-950/75" : "text-ink-100"
                }`}
              >
                {n.body}
              </p>
              <Link
                href={n.href}
                className={`inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] transition-colors ${
                  light
                    ? "text-navy-950 hover:text-gold-600"
                    : "text-white hover:text-gold-500"
                }`}
              >
                Explore {n.title}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </section>
        );
      })}

      {/* Doña streets band (navy, with optional video if its subject matches) */}
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="editorial max-w-4xl">
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

      {/* Why Misraje (white) */}
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
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

      {/* Commute times (navy) */}
      <CommuteWidget />

      {/* Testimonials (white) */}
      <TestimonialsSection testimonials={c.testimonials} />

      {/* Contact CTA (white) */}
      <ContactCTA />
    </>
  );
}
