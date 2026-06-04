import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();
  const calREs = siteConfig.agents
    .map((a) => a.calRE)
    .filter(Boolean)
    .join(" · ");

  return (
    <footer className="bg-navy-950 border-t border-white/5 pt-20 overflow-hidden">
      <div className="editorial">
        {/* Contact info grid */}
        <div className="grid md:grid-cols-3 gap-12 pb-16">
          <div>
            <p className="eyebrow text-gold-500 mb-4">Office</p>
            <p className="text-ink-100 leading-relaxed">
              {siteConfig.office.street}
              <br />
              {siteConfig.office.city}, {siteConfig.office.state} {siteConfig.office.zip}
            </p>
          </div>
          <div>
            <p className="eyebrow text-gold-500 mb-4">Telephone</p>
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

        {/* Oversized wordmark watermark */}
        <div className="relative py-12">
          <div
            aria-hidden="true"
            className="select-none text-center font-display font-light text-white/[0.04] whitespace-nowrap"
            style={{ fontSize: "clamp(4rem, 14vw, 12rem)", letterSpacing: "0.12em", lineHeight: "1" }}
          >
            {siteConfig.name.toUpperCase()}
          </div>
        </div>

        {/* Affiliation band: Coldwell Banker Global Luxury + Equal Housing */}
        <div className="border-t border-white/5 py-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          <div className="text-center md:text-left">
            <p className="text-white/80 text-sm font-display font-light tracking-[0.18em] uppercase">
              {siteConfig.brokerage.name}
            </p>
            <p className="text-ink-300 text-[11px] mt-1">{siteConfig.brokerage.license}</p>
          </div>
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

        {/* Fine print, ported verbatim from the Wix footer via siteConfig.legal.
            Blog and LARE Report are COMING LATER (hub-and-spoke distribution);
            do not render footer links to them yet. Placeholders:
            // <Link href="/blog">Blog</Link>
            // <Link href="/lare-report">LARE Report</Link> */}
        <div className="border-t border-white/5 py-8 text-[11px] text-ink-300 leading-relaxed space-y-3">
          <p>{siteConfig.legal.mlsAttribution}</p>
          <p>{siteConfig.legal.guaranteedRate}</p>
          <p>
            {siteConfig.brokerage.license} {siteConfig.brokerage.addressLine}
            {calREs ? ` · Agent CalRE# ${calREs}` : ""}
          </p>
          <p>{siteConfig.legal.franchise}</p>
          <p>{siteConfig.legal.disclosure}</p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <p>
              Copyright &copy; {year} {siteConfig.legalName}. All Rights Reserved.
            </p>
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
