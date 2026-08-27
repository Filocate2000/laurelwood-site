import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

// Footer design + branding are aligned 1:1 with misraje-site's Footer (the firm
// brand carried across every neighborhood site, inherited by the future Fryman
// site via this template): the oversized "MISRAJE" watermark, the Coldwell
// Banker Global Luxury affiliation logo, and the Coldwell Banker legal block are
// reproduced verbatim from misraje-site. Contact details still read from
// siteConfig (they resolve to the same Misraje office + agents).
//
// One deliberate addition over misraje-site's footer: the FOOTER_LINKS columns
// below. misraje-site's footer has no link columns; these keep laurelwood's own
// pages reachable from the footer, styled to the same footer canon.
const FOOTER_LINKS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Neighborhoods",
    links: [
      { label: "West Laurelwood", href: "/west-laurelwood" },
      { label: "East Laurelwood", href: "/east-laurelwood" },
      { label: "The Doña Streets", href: "/dona-streets" },
      { label: "Development History", href: "/development-history" },
    ],
  },
  {
    // Was a "History" column holding one link. The market pages were reachable
    // from the nav but from nowhere in the footer, which left the site's most
    // frequently updated pages with the least internal linking. Labels match
    // each page's own <title> rather than the nav's longer marketing phrasing.
    heading: "Market",
    links: [
      { label: "West Laurelwood Market", href: "/report" },
      { label: "East Laurelwood Market", href: "/marketreport" },
      { label: "The LARE Report", href: "/lare-report" },
    ],
  },
  {
    heading: "Homeowners",
    links: [
      { label: "Resources", href: "/homeowners" },
      { label: "Emergency Contacts", href: "/homeowners/emergency-contacts" },
      { label: "Neighborhood Watch", href: "/homeowners/neighborhood-watch" },
      { label: "Community News", href: "/homeowners/community-news" },
    ],
  },
  {
    heading: "The Firm",
    links: [
      { label: "Who We Are", href: "/who-we-are" },
      { label: "Meet the Partners", href: "/meet-the-partners" },
      { label: "Why Use Us", href: "/why-use-us" },
      { label: "Past Transactions", href: "/past-transactions" },
      { label: "Buying", href: "/buying" },
      { label: "Selling", href: "/selling" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 border-t border-white/5 pt-20 overflow-hidden">
      <div className="editorial">
        {/* Contact info grid */}
        <div className="grid md:grid-cols-3 gap-12 pb-16">
          <div>
            <p className="eyebrow mb-4">Office</p>
            <p className="text-ink-100 leading-relaxed">
              {siteConfig.office.street}
              <br />
              {siteConfig.office.city}, {siteConfig.office.state} {siteConfig.office.zip}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4">Telephone</p>
            <div className="space-y-1 text-ink-100">
              {siteConfig.agents.map((a) => (
                <p key={a.slug}>
                  {a.firstName[0]}) {a.phone}
                </p>
              ))}
              <p>O) {siteConfig.office.phone}</p>
            </div>
          </div>
          <div className="flex md:items-center">
            <Link
              href="/contact"
              className="inline-block bg-gold-500 hover:bg-gold-400 text-navy-950 font-medium px-8 py-4 tracking-wide transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* Site navigation links (laurelwood's own pages). misraje-site's footer
            has no link columns; this block is laurelwood-specific, styled to the
            footer canon so the firm branding above still matches misraje. */}
        <div className="border-t border-white/5 py-12 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <p className="eyebrow mb-4">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-ink-100 text-sm hover:text-gold-500 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Oversized wordmark watermark (the MISRAJE firm brand, per misraje-site) */}
        <div className="relative py-12">
          <div
            aria-hidden="true"
            className="select-none text-center font-display font-light text-white/[0.04] whitespace-nowrap"
            style={{ fontSize: "clamp(6rem, 18vw, 16rem)", letterSpacing: "0.15em", lineHeight: "1" }}
          >
            MISRAJE
          </div>
        </div>

        {/* Affiliation logos band: Coldwell Banker Global Luxury + Equal Housing Opportunity */}
        <div className="border-t border-white/5 py-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          <Image
            src="/images/cb-global-luxury-white.png"
            alt="Coldwell Banker Global Luxury"
            width={220}
            height={55}
            className="opacity-80"
          />
          <div className="flex items-center gap-3 text-white/70">
            <svg
              role="img"
              aria-label="Equal Housing Opportunity"
              width="36"
              height="36"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <path d="M8 32 L32 12 L56 32" />
              <path d="M14 30 L14 54 L50 54 L50 30" />
              <line x1="22" y1="40" x2="42" y2="40" />
              <line x1="22" y1="46" x2="42" y2="46" />
            </svg>
            <div className="text-[10px] uppercase leading-tight" style={{ letterSpacing: "0.15em" }}>
              Equal Housing
              <br />
              Opportunity
            </div>
          </div>
        </div>

        {/* Fine print: Coldwell Banker legal block, reproduced verbatim from
            misraje-site's footer. */}
        <div className="border-t border-white/5 py-8 text-[11px] text-ink-300 leading-relaxed space-y-3">
          <p>CalRE# - 00616212 Southern California 450 Exchange | Irvine, CA 92602</p>
          <p>
            All material presented herein is intended for informational purposes only and is compiled
            from sources deemed reliable but not verified. Equal Housing Opportunity.
          </p>
          <p>
            &copy; {year} Coldwell Banker. All rights reserved. Coldwell Banker, the Coldwell Banker
            logo and the Coldwell Banker Global Luxury&reg; logo are trademarks of Coldwell Banker
            Real Estate LLC. The Coldwell Banker System is comprised of company owned offices which
            are owned by a subsidiary of Anywhere Advisors LLC and franchised offices which are
            independently owned and operated. Coldwell Banker Real Estate LLC fully supports the
            principles of the Fair Housing Act and the Equal Opportunity Act. Listing information is
            deemed reliable but is not guaranteed. This website may contain content created by AI and
            is provided for informational purposes only and should not be relied upon without
            verification of its accuracy or completeness.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <p>Copyright &copy; {year} {siteConfig.legalName}. All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link href="/accessibility" className="hover:text-gold-500 transition-colors">
                Accessibility
              </Link>
              <Link href="/privacy" className="hover:text-gold-500 transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
