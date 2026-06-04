// content/west.ts
// Curated, photo-led band copy for the rebuilt /west-laurelwood page. Sentences
// are drawn verbatim from content/source/west-laurelwood.md (the ported Wix
// copy); the Doña street names below were provided by the site owner and are
// corroborated by the Doña Maria Dr. street-sign asset. NO em dashes.

export const westContent = {
  hero: {
    eyebrow: "Neighborhood",
    title: "West Laurelwood",
    subtitle: "A mid-century community in the Studio City hills, born in 1958.",
  },

  intro: {
    eyebrow: "Since 1958",
    heading: "The birth of West Laurelwood.",
    body: [
      "West Laurelwood emerged in 1958 as part of Tract No. 24676 during Southern California's housing boom. Home Savings & Loan Association transformed land once owned by the Fryman heirs into a mid-century suburban community. The property had been originally purchased by Chapman College in 1952 for a new campus before being sold to Home Savings & Loan.",
      "During the late 1950s, Home Savings & Loan developed the area with 290 custom homes on 5,000-square-foot lots. This development featured various mid-century architectural styles with spacious layouts, panoramic views, and cutting-edge built-in amenities. These homes attracted families seeking suburban serenity while remaining close to urban conveniences.",
      "West Laurelwood is distinguished by Spanish street names that carry the title of respect Doña, among them Doña Dorotea Dr., Doña Mema Pl., and Doña Maria Dr. These names connect the neighborhood to Southern California's cultural roots. In 2001, residents successfully petitioned for the correct use of Spanish accents on the street signs.",
    ],
  },

  archival: {
    eyebrow: "From the Archive",
    heading: "Selling Laurelwood, 1958 to 1966",
    intro:
      "The neighborhood was marketed as the Bel-Air of the Valley: custom homes with country living and city convenience, presented in the newspapers of the day by Laurelwood Realty and the decorators of Cannell & Chaffin.",
    // ids reference lib/photos.ts. The Bel-Air of the Valley ad moved to
    // /east-laurelwood (its copy quotes that ad directly); West keeps the
    // Laurelwood Realty and Cannell & Chaffin ads.
    ads: [
      "april-13-1966-east-laurelwood-ad",
      "cannell-chaffin-mother-in-law-ad",
      "cannell-chaffin-sensations-not-words-ad",
    ],
  },

  origins: {
    eyebrow: "How It Began",
    heading: "Breaking ground on the tract.",
    intro:
      "Gateway Homes raised its billboard on the future tract, the model homes were drawn in a range of elevations, and the subdivision was recorded as Tract No. 24676. Each of the four model homes was curated by the interior design firm Cannell & Chaffin.",
    billboard: "gateway-homes-billboard",
    renderings: "plan-4bc-renderings",
    tractMap: "tract-24676-map",
  },

  // "On the Big Screen" band. Copy verbatim from
  // content/source/west-laurelwood-history.md; the period-life photos (kids +
  // school bus) live on /east-laurelwood now.
  film: {
    eyebrow: "On the Big Screen",
    heading: "A glimpse on the big screen.",
    body: [
      "In 1964, Hollywood brought the burgeoning neighborhood of Laurelwood to the big screen in The Disorderly Orderly, a comedy classic starring Jerry Lewis. In several scenes, viewers catch a rare glimpse of West Laurelwood in its early stages, where the neighborhood appears with many lots yet to be built on and homes without mature landscaping. This footage captures the infancy of what would become one of Studio City's most beloved neighborhoods, providing a nostalgic look at Laurelwood's roots before it grew into the community we cherish today.",
      "Through films like these, Laurelwood's history lives on, preserving a visual legacy of the neighborhood's early days, a testament to the timeless appeal and charm that continue to define West Laurelwood.",
    ],
    caption: "West Laurelwood, mid-construction, as seen in The Disorderly Orderly (1964).",
    videoKey: "disorderly-orderly",
  },

  // "1978-1980: Preservation Efforts and Wilacre Park" band. Verbatim.
  preservation: {
    eyebrow: "1978 to 1980",
    heading: "Preservation and Wilacre Park.",
    body: [
      "In the late 1970s, another threat loomed in the form of a proposed 150-157 condominium development in the neighboring Wilacre Estates. Residents, in collaboration with local homeowners' associations, successfully opposed the plan, leading to the preservation of Wilacre Estates and Fryman Canyon as public parkland. This transformation was finalized in 1980 when Assembly Bill 990 was signed into law, protecting these areas from further development. Today, Wilacre Park stands as a testament to the community's efforts to preserve its natural surroundings, providing residents of West Laurelwood with access to hiking trails and scenic vistas.",
    ],
  },

  // Doña band, under the source heading "Cultural Legacy in Street Names".
  dona: {
    eyebrow: "Heritage",
    heading: "Cultural Legacy in Street Names",
    body: "West Laurelwood's Spanish street names are the signature of the neighborhood. In 2001 residents petitioned to restore the tilde over the n in Doña, a small stand that honors the area's cultural background.",
    sign: "dona-maria-street-sign",
    cta: "Explore the Doña streets",
    href: "/dona-streets",
  },

  // "West Laurelwood Today" closing band. Verbatim.
  today: {
    eyebrow: "Today",
    heading: "West Laurelwood Today",
    body: [
      "Today, West Laurelwood remains one of the most sought-after neighborhoods in Studio City, known for its beautiful mid-century homes, peaceful streets, and strong community spirit. Many of the original homes have been lovingly maintained or updated to include modern amenities, offering the perfect blend of historic charm and contemporary living. The architectural diversity, combined with the neighborhood's proximity to both natural beauty and urban conveniences, makes West Laurelwood an ideal place for families and professionals alike.",
      "From the preserved open spaces of Fryman Canyon to the scenic views of the Santa Monica Mountains, West Laurelwood offers a unique combination of tranquility and convenience. Residents continue to take pride in their community, working together to protect the neighborhood's natural environment and maintain its distinctive character.",
    ],
  },
};
