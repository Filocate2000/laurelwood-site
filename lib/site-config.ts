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
  /** Nationwide Mortgage Licensing System number, if any. */
  nmls?: string;
  /** US patent numbers, if any (printed on the bio page). */
  patents?: string[];
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

  /**
   * Which `past_transaction_site.site_key` the /past-transactions page reads.
   * NOT necessarily this site's own `siteKey`: the track record belongs to the
   * firm, and showing the whole book is the stronger credibility signal on a
   * listing pitch. Set this to a site's own key to show only the transactions
   * tagged to that site. Deliberate and explicit, because a sibling site cloned
   * from this repo must make the same choice consciously rather than inherit it.
   */
  pastTransactionsSiteKey: string;

  /** Commute widget origin key (a key in lib/commute/origins.ts). */
  commuteOriginKey: string;
  /** Destination slugs checked by default in the commute widget (max 5). */
  commuteDefaultDestinations: string[];

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
    /** MLS data attribution line, verbatim. */
    mlsAttribution: string;
    /** Guaranteed Rate Affinity common-ownership disclosure, verbatim. */
    guaranteedRate: string;
    /** Equal Housing + informational disclosure, verbatim. */
    disclosure: string;
    /** Coldwell Banker System / fair-housing franchise statement, verbatim. */
    franchise: string;
    /** Full accessibility statement, verbatim (also rendered on /accessibility). */
    accessibility: string;
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

  // The firm's full Los Angeles / South Bay book, not just Laurelwood-tagged
  // rows. Decided 2026-08-27: the page is a credibility surface for the firm,
  // and its copy now says so.
  pastTransactionsSiteKey: "misraje",

  // Laurelwood Estates is its own commute origin: coords in lib/commute/cities.ts
  // (the midpoint of the West+East Laurelwood KML polygons) and an entry in
  // lib/commute/origins.ts. The reworked homepage widget reads this as the fixed
  // origin (no dropdown) and starts with commuteDefaultDestinations checked.
  commuteOriginKey: "laurelwood",
  commuteDefaultDestinations: [
    "beverly-hills",
    "burbank",
    "sherman-oaks",
    "pasadena",
    "west-hollywood",
  ],

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
      calRE: "00592639", // verified from the Wix footer + bio (Phase 1)
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
      calRE: "01015912", // verified from the Wix footer + bio (Phase 1)
      nmls: "259077",
      patents: ["8,145,563", "8,117,120", "7,769,681"],
      photo: "/images/team/jack-portrait.jpg",
    },
  ],

  brokerage: {
    name: "Coldwell Banker Global Luxury",
    license: "CalRE# 00616212",
    addressLine: "Southern California 450 Exchange | Irvine, CA 92602",
  },

  social: [],

  // Ported verbatim from the Wix footer (Phase 1). NO em dashes (the source had none here).
  legal: {
    mlsAttribution: "Real Estate Data obtained from theMLS.com",
    guaranteedRate:
      "Coldwell Banker Realty and Guaranteed Rate Affinity, LLC share common ownership and because of this relationship the brokerage may receive a financial or other benefit. You are not required to use Guaranteed Rate Affinity, LLC as a condition of purchase or sale of any real estate. Operating in the state of New York as GR Affinity, LLC in lieu of the legal name Guaranteed Rate Affinity, LLC.",
    disclosure:
      "All material presented herein is intended for informational purposes only and is compiled from sources deemed reliable but not verified. Changes in prices, conditions, sale or withdrawal may be made without notice. No statement is made as to the accuracy of any description. All measurements and square footage are approximated. Equal Housing Opportunity.",
    franchise:
      "The Coldwell Banker System is comprised of company owned offices which are owned by a subsidiary of Realogy Brokerage Group LLC and franchised offices which are independently owned and operated. The Coldwell Banker System fully supports the principles of the Fair Housing Act and the Equal Opportunity Act.",
    accessibility:
      "Misraje Real Estate Partners is committed to providing a website that is accessible to the broadest possible audience, regardless of technology or ability. We are actively working to increase the accessibility and usability of our website and, in doing so, adhere to many of the available standards and guidelines. Misraje Real Estate Partners does not discriminate on the basis of religion, age, race, color, national origin, gender, marital or parental status, or disability. In order to further our commitment to nondiscrimination, we are working to ensure our site conforms to level Double-A world wide web consortium (W3C) web content accessibility guidelines (WCAG 2.1 AA). Such guidelines detail best practices for ensuring assistive technology users can access the site. The guidelines also make the site more user-friendly for all people. If anyone finds information or functionality inaccessible, please get in touch with us at 323-209-5225. We will make every reasonable effort to accommodate.",
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
