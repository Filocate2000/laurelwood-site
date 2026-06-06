import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "The history of Laurelwood, from its 1958 development and land acquisition to the preservation efforts that shaped the neighborhood.";

export const metadata: Metadata = {
  title: "History",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/history") },
  openGraph: { title: "History", description: DESCRIPTION, url: absoluteUrl("/history") },
};

const SUBPAGES = [
  {
    href: "/history/development",
    title: "Development History",
    body: "Laurelwood from 1958 to today, the architect David Freedman, the original model homes, and how the homes have evolved.",
  },
  {
    href: "/history/land-acquisition",
    title: "Land Acquisition History",
    body: "How the land moved from the Fryman heirs to Chapman College to Home Savings & Loan, and the Spanish street-name legacy.",
  },
];

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Laurelwood"
        title="History"
        subtitle="How a mid-century vision became one of Studio City's most cherished neighborhoods."
      />
      <section className="bg-white py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-8">
            {SUBPAGES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group block border border-navy-950/10 p-10 hover:border-gold-600/50 transition-colors"
              >
                <span className="gold-rule-dark mb-6" />
                <h2 className="font-display font-light text-2xl text-navy-950 mb-3 group-hover:text-gold-600 transition-colors">
                  {p.title}
                </h2>
                <p className="text-navy-950/70 leading-relaxed mb-6">{p.body}</p>
                <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-navy-950 group-hover:text-gold-600 transition-colors">
                  Read more <span aria-hidden="true">&rarr;</span>
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
