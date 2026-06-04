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
    // ids reference lib/photos.ts
    ads: [
      "april-13-1966-east-laurelwood-ad",
      "bel-air-of-the-valley-ad",
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

  dona: {
    eyebrow: "Heritage",
    heading: "The Doña streets",
    body: "West Laurelwood's Spanish street names are the signature of the neighborhood. In 2001 residents petitioned to restore the tilde over the n in Doña, a small stand that honors the area's cultural background.",
    sign: "dona-maria-street-sign",
    cta: "Explore the Doña streets",
    href: "/dona-streets",
  },

  period: {
    eyebrow: "Neighborhood Life",
    heading: "Family streets.",
    body: "From the start, Laurelwood was a place for families. Children grew up on its quiet streets and rode the Los Angeles City Schools bus down the hill, first to Carpenter Avenue Elementary in Studio City, a routine that shaped the neighborhood's close-knit character.",
    photos: ["neighborhood-children", "school-bus"],
    film: {
      eyebrow: "On the Big Screen",
      body: "In 1964, Hollywood captured the young neighborhood in The Disorderly Orderly, a comedy starring Jerry Lewis. Several scenes featured West Laurelwood in its early stages, showing many unbuilt lots and homes without mature landscaping, a glimpse of Laurelwood's infancy.",
      videoKey: "disorderly-orderly",
    },
  },
};
