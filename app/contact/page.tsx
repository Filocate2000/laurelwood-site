import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

const DESCRIPTION =
  "Get in touch with Misraje Real Estate Partners about buying or selling in Laurelwood, the Doña streets, and Studio City.";

export const metadata: Metadata = {
  title: "Contact",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: { title: "Contact", description: DESCRIPTION, url: absoluteUrl("/contact") },
};

export default function ContactPage() {
  const o = siteConfig.office;
  return (
    <div className="pt-32 pb-24">
      <div className="w-full px-6 md:px-16">
        <div className="max-w-2xl mb-16">
          <p className="eyebrow text-gold-500 mb-4">Ways to Reach Us</p>
          <h1 className="font-display font-light text-display text-white mb-6">
            Let&apos;s start a <span className="italic">conversation.</span>
          </h1>
          <span className="gold-rule" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact details */}
          <div className="space-y-10">
            <div>
              <p className="eyebrow text-gold-500 mb-3">Office</p>
              <p className="text-ink-100 text-lg">
                {o.street}
                <br />
                {o.city}, {o.state} {o.zip}
              </p>
            </div>

            <div>
              <p className="eyebrow text-gold-500 mb-3">Email</p>
              <div className="space-y-1 text-lg">
                {siteConfig.agents.map((a) => (
                  <p key={a.slug}>
                    <a
                      href={`mailto:${a.email}`}
                      className="text-ink-100 hover:text-gold-500 transition-colors"
                    >
                      {a.email}
                    </a>
                  </p>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow text-gold-500 mb-3">Telephone</p>
              <div className="space-y-1 text-ink-100 text-lg">
                {siteConfig.agents.map((a) => (
                  <p key={a.slug}>
                    {a.firstName[0]}) {a.phone}
                  </p>
                ))}
                <p>O) {o.phone}</p>
              </div>
            </div>

            <div>
              <p className="eyebrow text-gold-500 mb-3">Service Area</p>
              <p className="text-ink-100">Laurelwood · Studio City · Los Angeles · Ventura · South Bay</p>
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
