import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "What Misraje Real Estate Partners does for buyers and sellers in Laurelwood and Studio City: strategy, marketing, off-market access, and decades of proven results.";

export const metadata: Metadata = {
  title: "What We Do",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/what-we-do") },
  openGraph: { title: "What We Do", description: DESCRIPTION, url: absoluteUrl("/what-we-do") },
};

export default function WhatWeDoPage() {
  const body = loadDoc("what-we-do");
  return (
    <>
      <PageHero
        eyebrow="Our Practice"
        title="What We Do"
        subtitle="Strategic solutions, exceptional outcomes."
      />
      <section className="bg-white py-20 md:py-28">
        <div className="editorial">
          <Prose variant="light">{body}</Prose>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
