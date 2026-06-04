// content/home.ts
// Render-ready copy for the home page (kept out of the components per the
// architecture rule). Derived from content/source/home.md. NO em dashes.

export type Testimonial = {
  id: string;
  clientName: string;
  property: string | null;
  body: string;
};

export type WhyPoint = { title: string; body: string };

export const homeContent = {
  hero: {
    wordmark: "Laurelwood Estates",
    tagline: "Studio City",
    italicLine: "Country living, city convenience.",
  },

  intro: {
    eyebrow: "Welcome",
    heading: "One of Studio City's most cherished neighborhoods.",
    body: [
      "Laurelwood is a mid-century community born in 1958, set in the hills above the San Fernando Valley and built around a simple idea: country living with city convenience. Its peaceful streets, custom homes, and Spanish-inspired street names give it a character all its own.",
      "This site is the work of Misraje Real Estate Partners, a mother-and-son team that does not just work in Laurelwood. We live here, and we know the neighborhood inside and out.",
    ],
  },

  neighborhoods: [
    {
      key: "west-laurelwood",
      eyebrow: "Neighborhood",
      title: "West Laurelwood",
      body: "West Laurelwood emerged in 1958 as part of Tract No. 24676, 290 custom homes developed by Home Savings & Loan on land once owned by the Fryman heirs. Mid-century homes, peaceful streets, and the open spaces of Fryman Canyon define it to this day.",
      href: "/west-laurelwood",
    },
    {
      key: "east-laurelwood",
      eyebrow: "Neighborhood",
      title: "East Laurelwood",
      body: "East Laurelwood sits on the east side of Laurel Canyon, developed through the 1960s as a hillside retreat marketed as The Bel Air of the Valley. Custom homes, panoramic views, and a strong community spirit set it apart from its western counterpart.",
      href: "/east-laurelwood",
    },
  ],

  dona: {
    eyebrow: "Heritage",
    title: "The Doña Streets",
    body: "Laurelwood is distinguished by its Spanish-inspired street names, the Doña streets, including Doña Emilia Dr., Doña Rosa Dr., and Doña Pegita Dr. In 2001 residents successfully petitioned to restore the correct Spanish accents on the street signs, honoring Southern California's cultural roots.",
    href: "/dona-streets",
    cta: "Explore the Doña streets",
  },

  why: {
    eyebrow: "Why Misraje",
    heading: "The advantage of working with neighbors.",
    points: [
      {
        title: "Unmatched local expertise",
        body: "Karen and Jack have studied Laurelwood's history, seen its development firsthand, and know its homes, its streets, and often its owners. No one knows this neighborhood better.",
      },
      {
        title: "Laurelwood residents",
        body: "We do not just sell here, we live here. That daily, on-the-ground familiarity informs every recommendation and every negotiation.",
      },
      {
        title: "Quiet, off-market listings",
        body: "Through cultivated relationships and an exclusive coming-soon database, we offer access to private, off-market opportunities that never appear on the MLS. We have personally handled discreet sales in West Laurelwood where privacy was essential.",
      },
    ] as WhyPoint[],
  },

  testimonials: [
    {
      id: "vega",
      clientName: "Charleen & Rafael Vega",
      property: "Casa Vega",
      body: "Karen and Jack's background in the real estate industry made the sale of our home a stress-free experience. They designed a home selling business plan that was beyond successful. Their talent in marketing our home was a streamlined presentation that attracted many prospective buyers.",
    },
    {
      id: "doryon",
      clientName: "Jeremiah & Christine Doryon",
      property: null,
      body: "Jack and Karen are pros. They guided us through everything, staging, pricing, negotiations, and their advice really paid off. Our old home got multiple offers and sold for way more than we expected. The whole escrow process was seamless.",
    },
  ] as Testimonial[],

  // YOUTUBE: no video link was provided for this build (logged in STATE.md
  // Blockers). When a link is supplied, set `video` to { id, title, subject }
  // and the home page will render the gold-framed lazy embed in the section
  // whose subject matches. `subject` is one of: "history" | "neighborhood" |
  // "general" so the embed can be slotted near the matching band.
  video: null as { id: string; title: string; subject: string } | null,
};
