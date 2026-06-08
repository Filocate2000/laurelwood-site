"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

// Primary navigation. Structure is shared across the Misraje neighborhood-site
// family; labels/links are generic enough to read from the page set, and all
// brand identity (name, tagline, agent contacts) comes from siteConfig.
//
// COMING LATER (do not render until the hub-side recon + registration lands):
//   { label: "Blog", href: "/blog" },
//   { label: "LARE Report", href: "/lare-report" },
const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "West Laurelwood", href: "/west-laurelwood" },
  { label: "East Laurelwood", href: "/east-laurelwood" },
  { label: "The Doña Streets", href: "/dona-streets" },
  { label: "Development History", href: "/development-history" },
  { label: "Laurelwood Homeowners", href: "/homeowners" },
  { label: "About", href: "/about" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "Contact", href: "/contact" },
];

const NEIGHBORHOODS: { label: string; href: string }[] = [
  { label: "West Laurelwood", href: "/west-laurelwood" },
  { label: "East Laurelwood", href: "/east-laurelwood" },
  { label: "The Doña Streets", href: "/dona-streets" },
];

// Scroll threshold past which the nav adopts its "scrolled" state: solid navy
// background + backdrop blur, and the wordmark fades in. 80px feels deliberate.
const SCROLL_THRESHOLD = 80;

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // On non-home pages there is no big hero with a centered wordmark, so show
  // the logo from the start there. Only the homepage hides it until scroll.
  const isHome = pathname === "/";
  const showLogo = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-[#16263d]/95 backdrop-blur-md border-b border-gold-500/30 shadow-[0_1px_24px_rgba(0,0,0,0.25)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-5">
          <Link
            href="/"
            className={cn(
              "group flex flex-col items-center leading-none transition-all duration-500 ease-out",
              showLogo
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 -translate-x-3 pointer-events-none"
            )}
            aria-label="Misraje Real Estate Partners home"
            tabIndex={showLogo ? 0 : -1}
            aria-hidden={!showLogo}
          >
            {/* Misraje Real Estate Partners wordmark, copied verbatim from
                misraje-site's Navigation (the firm brand carried across every
                neighborhood site). NOTE: `font-cormorant` is an undefined
                Tailwind utility in misraje too, so it is a no-op and the wordmark
                inherits the body sans (Inter Tight) exactly as misraje renders. */}
            <span className="font-cormorant text-white text-xl md:text-[26px] tracking-[0.2em] transition-colors group-hover:text-gold-500">
              MISRAJE
            </span>
            <span className="text-white/85 text-[9px] md:text-[10px] tracking-[0.28em] mt-1.5">
              Real Estate Partners
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="primary-drawer"
            className="group flex flex-col items-end gap-[6px] p-2 -mr-2 transition-opacity hover:opacity-80 flex-shrink-0"
          >
            <span className="block h-[1.5px] w-7 bg-white transition-all" />
            <span className="block h-[1.5px] w-7 bg-white transition-all" />
            <span className="block h-[1.5px] w-4 bg-white transition-all group-hover:w-7" />
          </button>
        </div>
      </header>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        id="primary-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] md:w-[420px]",
          "bg-navy-950 text-white overflow-y-auto",
          "transition-transform duration-500 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col min-h-full px-7 md:px-8 pt-6 pb-7">
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 -mr-2 text-white/60 hover:text-gold-500 transition-colors text-lg leading-none"
            >
              <span aria-hidden="true">{"×"}</span>
            </button>
          </div>

          {/* Agent contact cards with headshots, mirroring misraje-site's menu
              panel: portrait above name/phone/email. Phone is rendered with
              spaces (not hyphens) to match misraje exactly. */}
          <div className="grid grid-cols-2 gap-4 mb-7">
            {siteConfig.agents.map((agent) => (
              <div key={agent.slug} className="flex flex-col items-center text-center">
                <Link
                  href={`/about#${agent.slug}`}
                  className="group block overflow-hidden rounded-sm mb-3"
                  aria-label={`View ${agent.firstName} ${agent.lastName} bio`}
                >
                  {agent.photo && (
                    <Image
                      src={agent.photo}
                      alt={`${agent.firstName} ${agent.lastName}`}
                      width={240}
                      height={320}
                      className="block w-[120px] h-[160px] object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: "center 25%" }}
                      priority
                    />
                  )}
                </Link>
                <Link
                  href={`/about#${agent.slug}`}
                  className="block text-white text-[13px] font-medium hover:text-gold-500 transition-colors mb-1.5"
                >
                  {agent.firstName} {agent.lastName}
                </Link>
                <a
                  href={agent.phoneHref}
                  className="block text-gold-500 text-[12px] hover:text-gold-400 transition-colors leading-snug"
                >
                  {agent.phone.replace(/-/g, " ")}
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="block text-gold-500/85 text-[10.5px] hover:text-gold-400 transition-colors leading-snug break-all mt-0.5"
                >
                  {agent.email}
                </a>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="text-white text-[10px] font-medium tracking-[0.3em] uppercase">
              {siteConfig.name}
            </div>
            <div className="flex-1 h-px bg-white/12" />
            <div className="text-gold-500/80 text-[8px] tracking-[0.28em] uppercase">
              {siteConfig.tagline}
            </div>
          </div>

          <nav className="mb-6">
            <ul>
              {NAV_ITEMS.map((item, idx) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3.5 py-2.5 transition-colors"
                    >
                      <span
                        className={cn(
                          "font-mono text-[10px] tracking-wider w-5 transition-colors",
                          isActive
                            ? "text-gold-500"
                            : "text-white/30 group-hover:text-gold-500/70"
                        )}
                      >
                        {String(idx).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-[14px] tracking-[0.01em] transition-colors whitespace-nowrap",
                          isActive
                            ? "text-white"
                            : "text-white/75 group-hover:text-white"
                        )}
                      >
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "flex-1 h-px transition-all duration-500",
                          isActive
                            ? "bg-gold-500"
                            : "bg-transparent group-hover:bg-white/15"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mb-5">
            <div className="text-gold-500/70 text-[9px] font-medium tracking-[0.3em] mb-2.5">
              NEIGHBORHOODS
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {NEIGHBORHOODS.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "text-[12px] tracking-wide transition-colors",
                        isActive ? "text-gold-500" : "text-white/60 hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-auto pt-5 border-t border-white/5">
            <div className="flex items-center gap-3 text-white/30 text-[8px] tracking-[0.3em]">
              <span>STUDIO CITY</span>
              <span className="flex-1 h-px bg-white/10" />
              <span>EST. K {"&"} J MISRAJE</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
