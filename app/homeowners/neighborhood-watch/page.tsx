import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "The Laurelwood neighborhood watch: safety guidelines, the LAPD senior lead officer, and how to report suspicious activity.";

export const metadata: Metadata = {
  title: "Neighborhood Watch",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/homeowners/neighborhood-watch") },
  openGraph: { title: "Neighborhood Watch", description: DESCRIPTION, url: absoluteUrl("/homeowners/neighborhood-watch") },
};

export default function NeighborhoodWatchPage() {
  const body = loadDoc("neighborhood-watch");
  return (
    <>
      <PageHero
        eyebrow="Homeowners"
        title="Neighborhood Watch"
        subtitle="A safe community is an engaged community."
      />
      <section className="bg-white py-20 md:py-28">
        <div className="w-full px-6 md:px-16">
          <Prose variant="light">{body}</Prose>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
