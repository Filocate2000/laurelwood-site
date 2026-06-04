import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Laurelwood from 1958 to today: architect David Freedman's vision, the original model homes, and how the neighborhood's homes have evolved while keeping their mid-century character.";

export const metadata: Metadata = {
  title: "Development History",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/history/development") },
  openGraph: { title: "Development History", description: DESCRIPTION, url: absoluteUrl("/history/development") },
};

export default function DevelopmentHistoryPage() {
  const body = loadDoc("development-history");
  return (
    <>
      <PageHero
        eyebrow="History"
        title="Development History"
        subtitle="Laurelwood from 1958 to today, a timeless blend of country and city living."
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
