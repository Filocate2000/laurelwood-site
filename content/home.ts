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

  // Section 1 of the homepage reorder. Copy supplied by Jack, verbatim from the
  // live Wix homepage. Accented "Doña" used throughout (the source has it).
  welcome: {
    eyebrow: "Why Location Matters in Laurelwood, Studio City",
    heading: "Welcome to Laurelwood Estates in Studio City",
    body: "As experienced real estate agents, we understand that location is everything in real estate. Laurelwood is one of the most highly sought-after neighborhoods in Los Angeles, offering an unmatched balance of convenience and centrality. With quick access to key areas like Downtown LA, Hollywood, Beverly Hills, and more, Laurelwood's location makes it an ideal choice for those looking to stay connected to the heart of the city. Below, you'll find live commute data, allowing you to return at any time to check how easily you can navigate from this prime location. The Doña streets of Laurelwood, including Doña Emilia Dr., Doña Sarita Pl., and Doña Dolores Pl., have become iconic within Studio City. Known for their scenic, tree-lined views and close-knit community feel, these streets reflect the charm and history that make Laurelwood such a desirable location.",
  },

  // Section 3 of the homepage reorder. Copy supplied by Jack, verbatim from the
  // live Wix homepage. Accented "Doña" + curly apostrophes preserved exactly.
  // "West Laurelwood" / "East Laurelwood" in paragraphs 1 and 2 are turned into
  // links to /west-laurelwood and /east-laurelwood at render time (see page.tsx).
  history: {
    heading: "A Neighborhood of History, Charm, and Community",
    body: [
      "Laurelwood, nestled in the heart of Studio City, stands as one of the area’s most beloved and historic neighborhoods. Divided into West Laurelwood and East Laurelwood, these two areas blend mid-century architectural appeal with modern comforts, making the neighborhood a hidden gem in Los Angeles.",
      "West Laurelwood, developed in 1958, showcases classic mid-century homes and tree-lined streets, while East Laurelwood, expanded in 1960, offers a balance of modern amenities and timeless charm. Both neighborhoods are not only renowned for their distinct character but are also celebrated for their connection to nature, with easy access to scenic Fryman Canyon and the popular Betty B. Dearing Trail.",
      "The history of Laurelwood tells a fascinating story of thoughtful urban planning, cultural preservation, and a community dedicated to maintaining its natural beauty. From the iconic Doña streets, with their unique Spanish titles, to the neighborhood’s efforts to halt further development to preserve the local landscape, the story of Laurelwood is one of careful balance between progress and conservation.",
      "Whether you’re a long-term resident or a newcomer, Laurelwood offers a welcoming community with a rich history, vibrant homeowner involvement, and an unmatched quality of life. Explore the history of Laurelwood and discover how this neighborhood became the sought-after enclave it is today.",
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
