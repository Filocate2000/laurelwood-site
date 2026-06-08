import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Resources for Laurelwood homeowners: the neighborhood watch, community news, and a full list of emergency and local contacts.";

export const metadata: Metadata = {
  title: "Homeowners",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/homeowners") },
  openGraph: { title: "Homeowners", description: DESCRIPTION, url: absoluteUrl("/homeowners") },
};

const SUBPAGES = [
  {
    href: "/homeowners/neighborhood-watch",
    title: "Neighborhood Watch",
    body: "Safety guidelines, the LAPD liaison, and how residents keep Laurelwood an engaged, watchful community.",
  },
  {
    href: "/homeowners/community-news",
    title: "Community News",
    body: "Updates on safety, local government, and real estate for Laurelwood and the Doña streets.",
  },
  {
    href: "/homeowners/emergency-contacts",
    title: "Emergency Contacts",
    body: "Fire stations, police, utilities, parks, and neighborhood associations, all in one place.",
  },
];

export default function HomeownersPage() {
  // Reuse the registered valley-view aerial (no reprocessing). object-position
  // biases down so the hillside neighborhood, not just sky, stays in frame.
  const hero = photo("neighborhood-watch-hero");
  return (
    <>
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        objectPosition="center 70%"
        eyebrow="For Residents"
        title="Homeowners"
        subtitle="Practical resources for the people who live in Laurelwood."
      />
      <section className="bg-navy-950 py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <div className="grid md:grid-cols-3 gap-8">
            {SUBPAGES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group block border border-white/10 p-8 hover:border-gold-500/50 transition-colors"
              >
                <span className="gold-rule mb-6" />
                <h2 className="font-display font-light text-xl text-white mb-3 group-hover:text-gold-500 transition-colors">
                  {p.title}
                </h2>
                <p className="text-ink-100/70 text-sm leading-relaxed mb-6">{p.body}</p>
                <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white group-hover:text-gold-500 transition-colors">
                  Open <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
