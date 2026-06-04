// lib/site-config.ts
//
// THE single source of truth for everything site-specific. This repo is the
// TEMPLATE for the Misraje family of neighborhood sites (laurelwoodestates.com
// today; frymanestates.com next). To spawn a sibling site you clone the repo,
// then replace THREE things: this file, the content/ directory, and
// source-photos/. Nothing Laurelwood-specific should live in a component, a
// page, or anywhere outside this file and content/.
//
// Architecture rule: components and pages read from `siteConfig`; they never
// hardcode a site name, domain, phone number, address, license number, or
// brokerage detail. Page copy lives in content/ (markdown), not in components.
//
// NO EM DASHES anywhere in site content (rewrite with comma/period/colon).
// Numeric-range hyphens (K-5, 9-12) are fine.

export type Agent = {
  firstName: string;
  lastName: string;
  /** Slug used for the /about/[slug] anchor and bio file name. */
  slug: string;
  title: string;
  email: string;
  phone: string; // display form
  phoneHref: string; // tel: form
  /** California DRE / CalRE license number. */
  calRE: string;
  /** Path under public/images for the portrait, if present. */
  photo?: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  /** Supabase / lead-source site key. Distinguishes sibling sites in the shared backend. */
  siteKey: string;
  /** Public neighborhood-site name shown in the wordmark and titles. */
  name: string;
  /** Short tagline under the wordmark. */
  tagline: string;
  /** The brokerage/legal entity behind the site. */
  legalName: string;
  /** Bare domain (no scheme). */
  domain: string;
  /** Canonical origin with scheme + www. Used for canonical URLs, OG, sitemap. */
  url: string;
  /** Default meta description. */
  description: string;

  /** Commute widget origin key (a key in lib/commute/origins.ts). */
  commuteOriginKey: string;

  office: {
    street: string;
    city: string;
    state: string;
    zip: string;
    /** Office phone, display form. */
    phone: string;
    phoneHref: string;
  };

  agents: Agent[];

  brokerage: {
    name: string;
    /** Brokerage CalRE / corporate license line as printed in the footer. */
    license: string;
    /** Office-of-record address line printed in the footer. */
    addressLine: string;
  };

  social: SocialLink[];

  legal: {
    /** Equal Housing + fair-housing / informational disclosure, verbatim. */
    disclosure: string;
    /** Coldwell Banker trademark / franchise statement, verbatim. */
    franchise: string;
  };
};

export const siteConfig: SiteConfig = {
  siteKey: "laurelwood",
  name: "Laurelwood Estates",
  tagline: "Studio City",
  legalName: "Misraje Real Estate Partners",
  domain: "laurelwoodestates.com",
  url: "https://www.laurelwoodestates.com",
  description:
    "Laurelwood Estates, the hyperlocal guide to the Laurelwood and Dona streets of Studio City, presented by Misraje Real Estate Partners.",

  // Laurelwood Estates sits in the Studio City hills. No dedicated laurelwood
  // origin exists hub-side yet (see STATE.md Blockers), so the commute widget
  // uses the nearest curated origin, studio-city.
  commuteOriginKey: "studio-city",

  office: {
    street: "301 N Canon Dr Suite E",
    city: "Beverly Hills",
    state: "CA",
    zip: "90210",
    phone: "855-888-SOLD",
    phoneHref: "tel:+18558887653",
  },

  agents: [
    {
      firstName: "Karen",
      lastName: "Misraje",
      slug: "karen",
      title: "Real Estate Partner",
      email: "karen@misraje.com",
      phone: "310-488-1030",
      phoneHref: "tel:+13104881030",
      calRE: "00616212",
      photo: "/images/team/karen-portrait.jpg",
    },
    {
      firstName: "Jack",
      lastName: "Misraje",
      slug: "jack",
      title: "Real Estate Partner",
      email: "jack@misraje.com",
      phone: "323-209-5225",
      phoneHref: "tel:+13232095225",
      calRE: "", // TBD: confirm from Wix bio/footer in Phase 1 (do not fabricate)
      photo: "/images/team/jack-portrait.jpg",
    },
  ],

  brokerage: {
    name: "Coldwell Banker Global Luxury",
    license: "CalRE# 00616212",
    addressLine: "Southern California 450 Exchange | Irvine, CA 92602",
  },

  social: [],

  legal: {
    disclosure:
      "All material presented herein is intended for informational purposes only and is compiled from sources deemed reliable but not verified. Equal Housing Opportunity.",
    franchise:
      "Coldwell Banker, the Coldwell Banker logo and the Coldwell Banker Global Luxury logo are trademarks of Coldwell Banker Real Estate LLC. The Coldwell Banker System is comprised of company owned offices which are owned by a subsidiary of Anywhere Advisors LLC and franchised offices which are independently owned and operated. Coldwell Banker Real Estate LLC fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Listing information is deemed reliable but is not guaranteed. This website may contain content created by AI and is provided for informational purposes only and should not be relied upon without verification of its accuracy or completeness.",
  },
};

/** Convenience: "301 N Canon Dr Suite E, Beverly Hills, CA 90210". */
export function officeAddressOneLine(): string {
  const o = siteConfig.office;
  return `${o.street}, ${o.city}, ${o.state} ${o.zip}`;
}

/** Absolute URL for a site-relative path, used for canonical + OG tags. */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${clean === "/" ? "" : clean}`;
}
