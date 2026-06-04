import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Prose } from "@/components/Prose";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { loadDoc } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Emergency and local contacts for Laurelwood, West Laurelwood, East Laurelwood, and the Doña streets: fire, police, utilities, parks, and neighborhood associations.";

export const metadata: Metadata = {
  title: "Emergency Contacts",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/homeowners/emergency-contacts") },
  openGraph: { title: "Emergency Contacts", description: DESCRIPTION, url: absoluteUrl("/homeowners/emergency-contacts") },
};

export default function EmergencyContactsPage() {
  const body = loadDoc("emergency-contacts");
  return (
    <>
      <PageHero
        eyebrow="Homeowners"
        title="Emergency Contacts"
        subtitle="For any emergency, dial 911. Other local contacts are below."
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
