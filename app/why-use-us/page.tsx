import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Why work with Misraje Real Estate Partners in Laurelwood: strategy, marketing, off-market access, and decades of proven results for buyers and sellers above Studio City.";

export const metadata: Metadata = {
  title: "Why Use Us",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/why-use-us") },
  openGraph: { title: "Why Use Us", description: DESCRIPTION, url: absoluteUrl("/why-use-us") },
};

export default function WhyUseUsPage() {
  const body = loadDoc("why-use-us");
  return (
    <>
      <PageHero
        eyebrow="Our Practice"
        title="Why Use Us"
        subtitle="Representation built for the Laurelwood market."
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
