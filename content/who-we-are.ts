// content/who-we-are.ts
// Copy for /who-we-are. Lifted out of the page component 2026-08-27: it and
// /why-use-us were the last two pages carrying their prose inline, which broke
// the template rule in STATE.md ("all page copy lives in content/, never
// hardcoded in components") and would have handed a frymanestates.com clone
// Misraje copy baked into a page component.
//
// The lift is verbatim. Apostrophes are U+2019 because the JSX used &rsquo;,
// and the point of a lift is that nothing a visitor sees changes. Other content
// modules use straight apostrophes; that inconsistency predates this file and is
// noted rather than silently resolved in either direction.
//
// NO em dashes.

import type { LinkedLine } from "@/content/neighborhood-watch";

export type ImageRef = { src: string; alt: string };

export const whoWeAreContent = {
  eyebrow: "The Firm",
  title: "Who We Are",
  subtitle: "A two-principal practice rooted in the hills above Studio City.",

  metaDescription:
    "A two-principal practice representing buyers and sellers across Los Angeles, the Westside, and the San Fernando Valley. Karen and Jack Misraje, the #1 Two-Member Team in Coldwell Banker Global Luxury.",

  /** Hero photo id, resolved through lib/photos.ts. */
  heroPhotoId: "laurelwood-scenic-1",

  /** Lead prose, no heading. */
  opening: [
    "Misraje Real Estate Partners is the practice of Karen and Jack Misraje, recognized as the #1 Two-Member Team in Coldwell Banker Global Luxury. Across more than three decades and over a billion dollars in transactions, the partnership has represented buyers and sellers throughout Beverly Hills, the Westside, and the San Fernando Valley, with additional depth in the coastal and Valley submarkets that surround them.",
  ],

  /** Image beside text, image on the left. */
  offMarket: {
    heading: "Access before the market",
    image: {
      src: "/images/sections/who-we-are-estate.jpg",
      alt: "A Spanish estate represented by Misraje Real Estate Partners",
    } as ImageRef,
    body: [
      "A meaningful share of the most desirable inventory never reaches the public portals. Through long-standing relationships and active market research, the partnership maintains working knowledge of properties coming to market before they appear on the MLS, Zillow, or Trulia. For buyers, that means access to opportunities others never see. For sellers, it means a network of qualified, motivated interest before a listing goes live.",
    ],
  },

  /** Image beside text, image on the right (alternating). */
  marketing: {
    heading: "How a listing is marketed",
    image: {
      src: "/images/sections/who-we-are-interior.jpg",
      alt: "A staged living room interior represented by Misraje Real Estate Partners",
    } as ImageRef,
    body: [
      "Every listing is built specifically for the property rather than run through a template. That means design and staging that present the home at its best, photography and videography matched to the home’s character, targeted digital campaigns across the channels where qualified buyers actually look, and selective print placement in the publications that reach high-net-worth audiences. The goal is never volume of exposure for its own sake, but the right exposure to the right buyers.",
    ],
  },

  /** Closing section. Its single paragraph carries an inline link, so it uses
   *  the LinkedLine shape already established in content/neighborhood-watch.ts
   *  rather than embedding markup in a content string. */
  partnership: {
    heading: "Two principals",
    paragraph: {
      pre: "Two principals, not one agent stretched thin. Karen’s three decades on the Westside and in Beverly Hills and Jack’s working knowledge of the Valley and the broader Los Angeles market mean clients get genuine geographic depth and two sets of eyes on every decision. The collaboration, and the discipline behind it, is what has set the practice apart in one of the most competitive luxury markets in the country. ",
      linkText: "Meet the partners",
      href: "/meet-the-partners",
      post: ".",
    } as LinkedLine,
  },
};
