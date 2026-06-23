import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { getTeamMembers, type TeamMember } from "@/lib/team";
import { photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Two principals, one practice. Karen and Jack Misraje, the #1 Two-Member Team in Coldwell Banker Global Luxury, representing buyers and sellers across Los Angeles.";

export const metadata: Metadata = {
  title: "Meet the Partners",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/meet-the-partners") },
  openGraph: { title: "Meet the Partners", description: DESCRIPTION, url: absoluteUrl("/meet-the-partners") },
};

export const revalidate = 3600;

function PersonCard({ person }: { person: TeamMember }) {
  return (
    <article id={person.slug} className="scroll-mt-28 flex flex-col">
      <div className="relative aspect-[4/5] w-[70%] overflow-hidden mb-8 border-2 border-gold-500" style={{ borderRadius: "2px" }}>
        {person.photo_path && (
          <Image
            src={person.photo_path}
            alt={`Portrait of ${person.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            style={{ objectPosition: person.photo_object_position }}
          />
        )}
      </div>
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-navy-950 mb-1" style={{ letterSpacing: "-0.01em" }}>
          {person.name}
        </h2>
        <p className="text-[11px] uppercase text-gold-500 mb-6" style={{ letterSpacing: "0.18em" }}>
          {person.title}
        </p>
        <p className="text-base text-stone-700 leading-relaxed mb-8">
          {person.short_bio}
        </p>
        <div className="text-sm text-stone-600 space-y-1 mb-6">
          {person.email && (
            <p>
              <span className="text-stone-400">Email&nbsp;&nbsp;</span>
              <a href={`mailto:${person.email}`} className="text-navy-950 hover:text-gold-500 transition-colors">{person.email}</a>
            </p>
          )}
          {person.phone && person.phone_href && (
            <p>
              <span className="text-stone-400">Direct&nbsp;</span>
              <a href={person.phone_href} className="text-navy-950 hover:text-gold-500 transition-colors">{person.phone}</a>
            </p>
          )}
          {person.dre_license && (
            <p>
              <span className="text-stone-400">CalRE</span>
              <span className="text-navy-950 ml-2">#{person.dre_license}</span>
            </p>
          )}
        </div>
        <Link
          href={`/meet-the-partners/${person.slug}`}
          className="inline-flex items-center gap-2 text-xs uppercase text-gold-500 hover:text-gold-400 transition-colors"
          style={{ letterSpacing: "0.15em" }}
        >
          Read full biography
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}

export default async function MeetThePartnersPage() {
  const team = await getTeamMembers();
  const hero = photo("laurelwood-scenic-3");

  return (
    <>
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        scrim="dark"
        eyebrow="The Partners"
        title="Meet the Partners"
        subtitle="Two principals, one practice, on the streets of Laurelwood."
      />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16 md:mb-20 max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-stone-700 leading-relaxed">
              Misraje Real Estate Partners practices residential real estate across Los Angeles, Ventura, and the South Bay. Recognized as the #1 Two-Member Team in Beverly Hills, the partnership combines complementary specialties in marketing, negotiation, and contract execution.
            </p>
          </div>

          {team.length === 0 ? (
            <p className="text-center text-stone-500">Team information temporarily unavailable. Please check back shortly.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              {team.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
