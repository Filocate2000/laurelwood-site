// content/why-use-us.ts
// Copy for /why-use-us. Lifted out of the page component 2026-08-27, same pass
// and same reasons as content/who-we-are.ts: this and /who-we-are were the last
// two pages holding their prose inline, against the template rule in STATE.md.
//
// Verbatim lift. Apostrophes are U+2019 to match the &rsquo; entities the JSX
// used, so the rendered output is byte-identical.
//
// NO em dashes.

import type { ImageRef } from "@/content/who-we-are";

/** One band of the page: an eyebrow, a heading, prose, and an optional photo.
 *  Whether the photo sits left or right is a layout decision and lives in the
 *  page, not here. */
export type PracticeSection = {
  eyebrow: string;
  heading: string;
  body: string[];
  image?: ImageRef;
};

export const whyUseUsContent = {
  eyebrow: "Our Practice",
  title: "Why Use Us",
  subtitle: "Representation built for the Laurelwood market.",

  metaDescription:
    "Pricing, marketing, and negotiation done with precision. How the Misraje team represents buyers and sellers across Los Angeles, Ventura, and the South Bay.",

  /** Hero photo id, resolved through lib/photos.ts. */
  heroPhotoId: "laurelwood-scenic-2",

  sellers: {
    eyebrow: "FOR SELLERS",
    heading: "Pricing, marketing, and the work of running a listing.",
    image: {
      src: "/images/sections/agent-at-desk.jpg",
      alt: "Pricing analysis at the agent's desk",
    },
    body: [
      "A listing starts before the photographer arrives. Pricing analysis comes first, and we work from current comparable activity rather than from what the owner hopes the home is worth. That conversation is harder than it sounds. Most sellers have a number in mind before they call us, and most of the time the number is reasonable. Sometimes it isn’t. We tell sellers what we think the market will pay, and what we think it won’t, and we explain the reasoning. From there, the pricing decision is theirs.",
      "Once the pricing is set, the marketing plan gets built specifically for the property. Photography that matches the home’s character. Copy that reads like prose rather than a brochure. Distribution across the channels where qualified buyers in that submarket actually look, which varies more than you’d expect. What works in Beverly Hills isn’t necessarily what works in Studio City. We have opinions about which channels deserve budget and which don’t.",
      "Jack’s technical practice extends what we can do on the data side. He uses AI-supported tools to analyze market activity at a finer grain than traditional comp analysis allows, and to surface qualified buyer signals earlier in a listing cycle. Three U.S. patents in real estate technology reflect a long-running interest in how the industry’s data infrastructure actually moves transactions. That work doesn’t replace judgment, but it sharpens it.",
    ],
  } as PracticeSection,

  /** No photo: this band runs text-only at a narrower measure. */
  buyers: {
    eyebrow: "FOR BUYERS",
    heading: "Information, judgment, and pushback when it matters.",
    body: [
      "Buyer representation comes down to giving clients accurate information about the markets they’re considering. What listings are actually worth versus what they’re asking. How offers in this submarket tend to be structured, and what terms matter most when competition is real. Which neighborhoods make sense at a client’s price point and which ones require stretching or compromising in ways the client may not have thought through.",
      "We push back when a client is about to make a move we think is wrong. Politely, with reasoning, but we push. That includes telling buyers to walk away from properties they’re emotionally attached to when the math doesn’t work, and telling them to be more aggressive on properties they’re underestimating. The trust that builds takes time to develop, but in our experience it’s what separates a working agent relationship from a transactional one.",
      "Karen’s three decades of practice on the Westside and in Beverly Hills, combined with Jack’s working knowledge of the Valley and the broader Los Angeles market, mean buyers get genuine geographic depth rather than one agent stretched across markets they only know in passing. When a client’s search crosses multiple submarkets, we route the conversation to whichever of us has the stronger working knowledge of that specific area.",
    ],
  } as PracticeSection,

  negotiation: {
    eyebrow: "NEGOTIATION AND CLOSING",
    heading: "The two phases that matter most.",
    image: {
      src: "/images/sections/inspection.jpg",
      alt: "On-site inspection during the contingency period",
    },
    body: [
      "Two parts of a transaction matter more to outcomes than most clients expect when they first start the process: how the negotiation is run, and how the inspection period is managed.",
      "In negotiation, we bring a disciplined approach developed across decades of representations at price points from first purchases to high-end estates. That means structuring terms that hold under pressure, recognizing when to push and when to accept, and protecting our client’s positioning without burning the working relationship with the other side. The other agent is usually someone we’ll work across the table from again. We don’t waste that.",
      "Inspection period management is where deals quietly fall apart when nobody’s paying attention. Issues surface and they always do, and the question becomes which ones are material, which are cosmetic, which are negotiable, and which are best left alone. We work directly with inspectors, contractors, and the other side to make that assessment in real time. The goal is keeping a sound transaction moving toward closing rather than letting it derail over items that can be resolved.",
      "Across both phases, the working principle is the same. Protect our client’s position without losing the deal to friction that didn’t need to be there.",
    ],
  } as PracticeSection,
};
