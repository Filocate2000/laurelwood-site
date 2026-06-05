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
    // Figure captions for the birth section (this section, not origins).
    tractCaption: "Tract No. 24676, recorded with the City of Los Angeles.",
    billboardCaption:
      "Henry L. Gatz, president of Gateway Homes, with Joe Staller, announcing new homes in Laurelwood, November 27, 1960.",
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
    // Upgraded billboard caption (Gatz/Staller, Nov 27 1960) lives on the photo
    // in lib/photos.ts so the FramedArtifact picks it up.
    renderings: "plan-4bc-renderings",
    tractMap: "tract-24676-map",
  },

  // "1960s-1970s: The Growth of East and West Laurelwood" band (prose only;
  // the kids/bus photos stay on /east-laurelwood). Verbatim from
  // content/source/west-laurelwood-missing-sections.md.
  growth: {
    eyebrow: "1960s to 1970s",
    heading: "The growth of East and West Laurelwood.",
    body: [
      "As both East and West Laurelwood expanded in the 1960s and 1970s, the neighborhoods became highly desirable places for families, thanks to their custom-built homes, scenic views, and proximity to both nature and the city. However, this rapid growth also brought challenges, particularly when it came to local schools. Originally, children from both East and West Laurelwood attended Carpenter Avenue Elementary School in Studio City, just two miles away. But by 1964, overcrowding became an issue, and East Laurelwood children were reassigned to Colfax Avenue Elementary School in North Hollywood, four miles away. Meanwhile, West Laurelwood children continued attending Carpenter, with convenient bus service provided throughout their neighborhood.",
      "This decision sparked significant frustration among East Laurelwood parents, many of whom were unhappy with the increased distance and lack of transportation options for their children. Although some families secured special permits to keep their children at Carpenter, they had to arrange their own transportation, which proved challenging for many. Despite these tensions, both East and West Laurelwood continued to thrive, and the homes, often referred to as The \"Bel Air\" of the Valley, remained highly sought after for their spacious designs, scenic views, and ideal blend of suburban peace and urban convenience.",
    ],
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

  // "1971: The Defeat of the Laurel Canyon Freeway" band. West owns the primary
  // placement of the freeway study map + the CA-170/CA-90 shields. Verbatim.
  freewayDefeat: {
    eyebrow: "1971",
    heading: "The defeat of the Laurel Canyon Freeway.",
    body: [
      "In the 1970s, East Laurelwood faced a significant challenge that threatened its peaceful atmosphere and scenic charm, the proposed construction of the Laurel Canyon Freeway. This freeway was planned to cut through the Santa Monica Mountains, linking the San Fernando Valley with Los Angeles International Airport. The proposed route would have passed through key areas of East and West Laurelwood, altering the neighborhood landscape and impacting property values. The controversy surrounding this project united residents of East Laurelwood, West Laurelwood, and surrounding communities in a fight to preserve their way of life.",
      "The freeway's proposed route was met with intense opposition from local homeowners, who saw it as a major disruption to the quiet, suburban lifestyle they had worked so hard to build. Many residents feared that the freeway would not only increase traffic and noise but also destroy some of the most scenic and valuable real estate in the area. Councilmembers and neighborhood associations rallied to block the project, leading to years of contentious meetings and heated debates.",
      "Among the most vocal opponents of the freeway was Councilman James Potter Jr., who described the project as a form of \"gerrymandering,\" favoring certain areas while forcing unwanted infrastructure through others. He highlighted the disproportionate impact the freeway would have on neighborhoods like West Laurelwood, which had already experienced significant growth and development. Residents feared the potential devaluation of their homes and the loss of the quiet, hillside environment that had drawn them to the area.",
      "Opposition grew stronger as community leaders, local officials, and homeowners' associations from Studio City to the west side of Los Angeles banded together. They argued that the freeway would compromise the scenic hillsides, increase air pollution, and permanently alter the unique character of the neighborhood. After years of pushback, the proposal was ultimately shelved, marking a major victory for East Laurelwood and its neighboring communities.",
      "The successful effort to block the freeway cemented West Laurelwood's reputation as a neighborhood that values community and preservation. It also demonstrated the power of residents to shape the future of their neighborhood and maintain the quiet, suburban lifestyle that had attracted so many families in the first place. After years of advocacy, the freeway was officially removed from the state's plans in 1971, a victory that preserved the neighborhood's charm and laid-back lifestyle.",
    ],
    map: "route-170-freeway-study-map-1970",
    mapCaption:
      "The proposed Laurel Canyon Freeway, stretching between Slauson Avenue and Santa Monica Boulevard, sparked controversy over its potential routes. Study zone map, March 1969.",
    shields: ["ca-170-shield", "ca-90-shield"],
  },

  // "1978-1980: Preservation Efforts and Wilacre Park" band. Verbatim.
  preservation: {
    eyebrow: "1978 to 1980",
    heading: "Preservation and Wilacre Park.",
    body: [
      "In the late 1970s, another threat loomed in the form of a proposed 150-157 condominium development in the neighboring Wilacre Estates. Residents, in collaboration with local homeowners' associations, successfully opposed the plan, leading to the preservation of Wilacre Estates and Fryman Canyon as public parkland. This transformation was finalized in 1980 when Assembly Bill 990 was signed into law, protecting these areas from further development. Today, Wilacre Park stands as a testament to the community's efforts to preserve its natural surroundings, providing residents of West Laurelwood with access to hiking trails and scenic vistas.",
    ],
  },

  // "Fryman Road Extension and the Fight for Preservation" band, immediately
  // after Wilacre. Verbatim from west-laurelwood-missing-sections.md.
  frymanRoad: {
    eyebrow: "Early 1980s",
    heading: "The Fryman Road extension.",
    body: [
      "Laurelwood's history is deeply rooted in community action and environmental preservation. In the early 1980s, proposals to extend Fryman Road for further residential development posed a significant threat to the natural beauty of Fryman Canyon. This sparked concern among residents determined to protect the area's landscape. The successful opposition to the Wilacre Estates development had already set a strong precedent, and the community rallied once again to safeguard Fryman Canyon. Their efforts were bolstered in 1983 when the Santa Monica Mountains Conservancy stepped in, purchasing portions of the land to protect the canyon's ecosystem and prevent urban sprawl.",
      "A major victory in this preservation effort was the protection of the Betty B. Dearing Trail, which remains a popular hiking destination today. While the Fryman Road extension was mostly halted, some portions were accepted by the City of Los Angeles for public use, allowing emergency access and utility services without compromising the peaceful, residential character of Laurelwood. The community's dedication to environmental stewardship has shaped the neighborhood's identity, ensuring that it remains an attractive place where residents can enjoy privacy while maintaining a strong connection to nature. This ongoing commitment continues to define the enduring appeal of West Laurelwood.",
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
