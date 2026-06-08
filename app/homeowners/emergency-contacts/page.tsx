import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { emergencyContacts, type EmergencyContact } from "@/content/emergency-contacts";
import { photo } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Emergency and local contacts for Laurelwood, West Laurelwood, East Laurelwood, and the Doña streets: fire, police, utilities, parks, and neighborhood associations.";

export const metadata: Metadata = {
  title: "Emergency Contacts",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/homeowners/emergency-contacts") },
  openGraph: { title: "Emergency Contacts", description: DESCRIPTION, url: absoluteUrl("/homeowners/emergency-contacts") },
};

// Render a verbatim phone string as gold tel: links. A value may hold two
// numbers joined by " or " (e.g. "311 or 213-473-3231"); each number becomes its
// own tel: link and the literal " or " is preserved, so the displayed text is
// byte-for-byte the source (including the odd "(213)978-0333" / "(323)-221-9944"
// spacing). tel: hrefs use digits only, +1 for 10-digit numbers.
function PhoneLinks({ value, tone }: { value: string; tone: "light" | "dark" }) {
  const cls =
    tone === "dark"
      ? "text-gold-500 hover:text-gold-400 transition-colors"
      : "text-gold-600 hover:text-gold-700 transition-colors";
  const parts = value.split(" or ");
  return (
    <>
      {parts.map((part, i) => {
        const digits = part.replace(/\D/g, "");
        const href = digits.length === 10 ? `tel:+1${digits}` : `tel:${digits}`;
        return (
          <span key={i}>
            {i > 0 ? " or " : null}
            <a href={href} className={cls}>
              {part}
            </a>
          </span>
        );
      })}
    </>
  );
}

function ContactCard({ c, tone }: { c: EmergencyContact; tone: "light" | "dark" }) {
  const dark = tone === "dark";
  const muted = dark ? "text-ink-300" : "text-navy-950/55";
  const linkCls = dark
    ? "text-gold-500 hover:text-gold-400 transition-colors"
    : "text-gold-600 hover:text-gold-700 transition-colors";
  return (
    <div
      className={`p-6 border ${
        dark ? "border-white/12 bg-navy-900" : "border-navy-950/12 bg-white"
      }`}
    >
      <h3 className={`font-display text-lg ${dark ? "text-white" : "text-navy-950"}`}>
        {c.name}
      </h3>
      {c.sub && <p className={`text-sm mt-0.5 ${muted}`}>{c.sub}</p>}
      {c.phone && (
        <p className={`mt-3 ${dark ? "text-ink-100" : "text-navy-950/80"}`}>
          <PhoneLinks value={c.phone} tone={tone} />
        </p>
      )}
      {c.email && (
        <p className="mt-1">
          <a href={`mailto:${c.email}`} className={`text-sm break-all ${linkCls}`}>
            {c.email}
          </a>
        </p>
      )}
      {c.address && <p className={`text-sm mt-3 leading-relaxed ${muted}`}>{c.address}</p>}
      {c.website && (
        <p className="mt-3">
          <a
            href={c.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.18em] ${linkCls}`}
          >
            Website <span aria-hidden="true">&#8599;</span>
          </a>
        </p>
      )}
    </div>
  );
}

export default function EmergencyContactsPage() {
  const data = emergencyContacts;
  const hero = photo("telephone-dialing");
  return (
    <>
      {/* 1. Hero: shared PageHero (canon serif title + scrim + nav gradient) over
          the telephone-dialing photo. The source is 7360x4912, so full hero
          resolution is fine. scrim="dark" because the photo is high-key (white
          background) and the title must stay legible. */}
      <PageHero
        image={hero?.src}
        alt={hero?.alt}
        objectPosition="center"
        scrim="dark"
        eyebrow="Homeowners"
        title={data.pageTitle}
      />

      {/* 2. Emergency banner: the most visible element on the page. */}
      <section className="bg-navy-900 border-y border-gold-500/40 py-12 md:py-16">
        <div className="w-full px-6 md:px-16 text-center">
          <p className="eyebrow text-gold-500/90 mb-4">{data.immediate.eyebrow}</p>
          <a
            href="tel:911"
            className="inline-block font-display font-light text-gold-500 hover:text-gold-400 transition-colors"
            style={{ fontSize: "clamp(3rem, 9vw, 6rem)", lineHeight: 1, letterSpacing: "0.02em" }}
          >
            {data.immediate.call}
          </a>
        </div>
      </section>

      {/* 3. Category sections, alternating white / navy in extraction order. */}
      {data.categories.map((cat, i) => {
        const dark = i % 2 === 1; // white, navy, white, navy
        return (
          <section
            key={cat.name}
            className={dark ? "bg-navy-950 py-20 md:py-28" : "bg-white py-20 md:py-28"}
          >
            <div className="w-full px-6 md:px-16">
              <p className={`eyebrow mb-4 ${dark ? "text-gold-500" : "text-gold-600"}`}>
                Contacts
              </p>
              <h2
                className={`font-display font-light text-3xl md:text-4xl mb-5 ${
                  dark ? "text-white" : "text-navy-950"
                }`}
              >
                {cat.name}
              </h2>
              <span className={`${dark ? "gold-rule" : "gold-rule-dark"} mb-10`} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.contacts.map((c) => (
                  <ContactCard key={c.name} c={c} tone={dark ? "dark" : "light"} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* 5. Closing CTA (white, after the navy Associations band). */}
      <ContactCTA />
    </>
  );
}
