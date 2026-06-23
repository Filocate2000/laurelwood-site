import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import type { TeamMember, Credential } from "@/lib/team";

type CredentialGroup = {
  heading: string;
  items: Credential[];
};

/**
 * Groups credentials by kind for rendering in distinct sections of the detail
 * page (Licenses, Awards & Recognitions, U.S. Patents). Maintains source order
 * within each group.
 */
function groupCredentials(credentials: Credential[]): CredentialGroup[] {
  const groups: Record<string, CredentialGroup> = {
    license: { heading: "Licenses", items: [] },
    award: { heading: "Awards and Recognitions", items: [] },
    role: { heading: "Leadership Roles", items: [] },
    patent: { heading: "U.S. Patents", items: [] },
  };

  for (const cred of credentials) {
    groups[cred.kind]?.items.push(cred);
  }

  // Return only groups with items, in this display order
  return ["license", "award", "role", "patent"]
    .map((kind) => groups[kind])
    .filter((group) => group.items.length > 0);
}

/**
 * Per-principal hero images. Lookout Mountain Ave was a Misraje representation;
 * each principal gets a different room from the property as their hero image.
 * Falls back to the shared courtyard photo for any future team member without
 * a dedicated hero (defensive default; should not happen for Karen or Jack).
 *
 * TODO: When team_directory grows beyond Karen and Jack, consider moving
 * hero_image_path to the database so non-developers can change it via SQL.
 */
const HERO_BY_SLUG: Record<string, string> = {
  karen: "/images/sections/lookout-livingroom.jpg",
  jack: "/images/sections/lookout-kitchen.jpg",
};

const FALLBACK_HERO = "/images/sections/lookout-mountain-courtyard.jpg";

export function TeamMemberDetail({ person }: { person: TeamMember }) {
  const longBioParagraphs = person.long_bio.split("\n\n").filter((p) => p.trim().length > 0);
  const credentialGroups = groupCredentials(person.credentials);
  const heroImage = HERO_BY_SLUG[person.slug] ?? FALLBACK_HERO;

  return (
    <>
      <PageHero
        image={heroImage}
        alt={`${person.name} of Misraje Real Estate Partners`}
        eyebrow="PRINCIPAL"
        title={person.name}
        subtitle={person.title}
      />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-8">

          {/* Portrait + stats band */}
          <div className="grid md:grid-cols-5 gap-10 md:gap-14 mb-16 md:mb-20 items-start">
            <div className="md:col-span-2">
              {person.photo_path && (
                <div className="relative aspect-[4/5] overflow-hidden border-2 border-gold-500" style={{ borderRadius: "2px" }}>
                  <Image
                    src={person.photo_path}
                    alt={`Portrait of ${person.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                    style={{ objectPosition: person.photo_object_position }}
                    priority
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-3">
              {person.stats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 pb-10 border-b border-stone-200">
                  {person.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-serif text-3xl md:text-4xl font-normal text-navy-950 mb-1" style={{ letterSpacing: "-0.01em" }}>
                        {stat.value}
                      </div>
                      <div className="text-[10px] uppercase text-stone-500" style={{ letterSpacing: "0.15em" }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Long bio */}
              <div className="space-y-5 text-base text-stone-700 leading-relaxed">
                {longBioParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Credentials sections */}
          {credentialGroups.length > 0 && (
            <div className="border-t border-stone-200 pt-12 md:pt-16 space-y-10">
              {credentialGroups.map((group) => (
                <div key={group.heading}>
                  <h2 className="text-[11px] font-medium text-gold-500 mb-5" style={{ letterSpacing: "0.18em" }}>
                    {group.heading.toUpperCase()}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                    {group.items.map((item, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-baseline md:gap-4 py-2 border-b border-stone-100 last:border-b-0">
                        <div className="text-navy-950 font-medium text-base flex-1">
                          {item.label}
                        </div>
                        <div className="text-sm text-stone-600">
                          {item.value}
                          {item.year && <span className="text-stone-400 ml-2">{item.year}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact block */}
          <div className="border-t border-stone-200 pt-12 md:pt-16 mt-12 md:mt-16">
            <h2 className="text-[11px] font-medium text-gold-500 mb-6" style={{ letterSpacing: "0.18em" }}>
              CONTACT
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {person.phone && person.phone_href && (
                <div>
                  <p className="text-[10px] uppercase text-stone-500 mb-2" style={{ letterSpacing: "0.15em" }}>Direct</p>
                  <a href={person.phone_href} className="text-navy-950 hover:text-gold-500 transition-colors text-base">{person.phone}</a>
                </div>
              )}
              {person.email && (
                <div>
                  <p className="text-[10px] uppercase text-stone-500 mb-2" style={{ letterSpacing: "0.15em" }}>Email</p>
                  <a href={`mailto:${person.email}`} className="text-navy-950 hover:text-gold-500 transition-colors text-base">{person.email}</a>
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase text-stone-500 mb-2" style={{ letterSpacing: "0.15em" }}>Office</p>
                <p className="text-navy-950 text-base">301 N Canon Dr, Suite E · Beverly Hills, CA 90210</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


