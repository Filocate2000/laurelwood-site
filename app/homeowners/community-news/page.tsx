import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Community news for Laurelwood and the Doña streets: safety, local government, and real estate updates.";

export const metadata: Metadata = {
  title: "Community News",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/homeowners/community-news") },
  openGraph: { title: "Community News", description: DESCRIPTION, url: absoluteUrl("/homeowners/community-news") },
};

export default function CommunityNewsPage() {
  const body = loadDoc("community-news");
  return (
    <>
      <PageHero
        eyebrow="Homeowners"
        title="Community News"
        subtitle="Safety, local government, and real estate updates for the neighborhood."
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
