// lib/routes.ts
//
// THE canonical list of this site's static, indexable pages. Both discovery
// surfaces read it: app/sitemap.ts (for crawlers) and app/llms.txt/route.ts (for
// AI answer engines).
//
// It exists because those two surfaces were maintained by hand and drifted. As
// of the 2026-08-27 audit the sitemap was missing /lare-report entirely while
// the nav linked to it, and still carried a comment claiming the LARE Report was
// "COMING LATER"; llms.txt listed 6 pages out of 20. One list, read twice, can
// not drift from itself.
//
// Adding a page? Add it here and both surfaces pick it up. Every field is
// REQUIRED on purpose: the compiler makes you decide whether a new page belongs
// in the AI-facing summary rather than letting it fall out silently.
//
// Dynamic routes (/lare-report/[slug], /meet-the-partners/[slug]) are NOT here.
// They come from the database and are appended by the sitemap at request time.

export type SiteRoute = {
  /** Site-relative path, leading slash, no trailing slash (home is "/"). */
  path: string;
  /** Human label used in the llms.txt page list. */
  label: string;
  /** Sitemap changeFrequency. Reflect what actually changes, not what you wish. */
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** Sitemap priority, 0 to 1, relative within this site only. */
  priority: number;
  /** Whether to name this page in llms.txt. Legal and utility pages are noise
   *  in an AI-facing summary, so they are listed for crawlers but not there. */
  inLlms: boolean;
};

export const SITE_ROUTES: SiteRoute[] = [
  { path: "/", label: "Home", changeFrequency: "weekly", priority: 1, inLlms: true },

  // Neighborhoods: the hyperlocal core of the site.
  { path: "/west-laurelwood", label: "West Laurelwood", changeFrequency: "monthly", priority: 0.9, inLlms: true },
  { path: "/east-laurelwood", label: "East Laurelwood", changeFrequency: "monthly", priority: 0.9, inLlms: true },
  { path: "/dona-streets", label: "The Dona streets", changeFrequency: "monthly", priority: 0.9, inLlms: true },
  { path: "/development-history", label: "Development history", changeFrequency: "yearly", priority: 0.6, inLlms: true },

  // Market data. The two guides re-render per request from live listings, and
  // the LARE Report lands weekly, so both change far more often than the prose.
  { path: "/report", label: "West Laurelwood market overview", changeFrequency: "weekly", priority: 0.8, inLlms: true },
  { path: "/marketreport", label: "East Laurelwood market overview", changeFrequency: "weekly", priority: 0.8, inLlms: true },
  { path: "/lare-report", label: "The LARE Report, weekly Los Angeles market commentary", changeFrequency: "weekly", priority: 0.8, inLlms: true },

  // Homeowner resources.
  { path: "/homeowners", label: "Homeowner resources", changeFrequency: "monthly", priority: 0.7, inLlms: true },
  { path: "/homeowners/neighborhood-watch", label: "Neighborhood watch", changeFrequency: "monthly", priority: 0.6, inLlms: true },
  { path: "/homeowners/community-news", label: "Community news", changeFrequency: "monthly", priority: 0.6, inLlms: true },
  { path: "/homeowners/emergency-contacts", label: "Emergency contacts", changeFrequency: "monthly", priority: 0.6, inLlms: true },

  // The firm.
  { path: "/who-we-are", label: "Who we are", changeFrequency: "monthly", priority: 0.7, inLlms: true },
  { path: "/meet-the-partners", label: "Meet the partners", changeFrequency: "monthly", priority: 0.7, inLlms: true },
  { path: "/why-use-us", label: "Why use us", changeFrequency: "monthly", priority: 0.7, inLlms: true },
  { path: "/past-transactions", label: "Past transactions", changeFrequency: "monthly", priority: 0.7, inLlms: true },
  { path: "/buying", label: "Buying in Laurelwood", changeFrequency: "monthly", priority: 0.7, inLlms: true },
  { path: "/selling", label: "Selling in Laurelwood", changeFrequency: "monthly", priority: 0.7, inLlms: true },
  { path: "/contact", label: "Contact", changeFrequency: "monthly", priority: 0.8, inLlms: true },

  // Legal and utility: indexable, but not worth an AI answer engine's attention.
  { path: "/accessibility", label: "Accessibility statement", changeFrequency: "yearly", priority: 0.3, inLlms: false },
  { path: "/privacy", label: "Privacy policy", changeFrequency: "yearly", priority: 0.3, inLlms: false },
];
