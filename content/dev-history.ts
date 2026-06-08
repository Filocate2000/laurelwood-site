// content/dev-history.ts
// Band copy for /development-history. VERBATIM from
// content/source/dev-history-wix-extraction.md (the Wix extraction). Verbatim
// except one Jack-approved copy fix: the hero title's leading "laurelwood" is
// capitalized to "Laurelwood". Otherwise: straight quotes as-extracted, the
// hero's " - " hyphen kept (no em dash), the duplicated brochure + decorators
// passage included ONCE in order.
// Galleries carry no Wix heading, so those bands render plates only.

export const devHistoryContent = {
  hero: {
    title: "Laurelwood   RESIDENTIAL DEVELOPMENT",
    subtitle:
      "Laurelwood: From 1958 to Today - A Timeless Blend of Country and City Living",
  },

  // ## SECTION: Two figures who shaped Laurelwood (intro band). Added per Jack's
  // approved copy; distinguishes Harry C. Fryman (developer/landowner) from
  // David Freedman, AIA (architect). Verbatim, no em dashes.
  figures: {
    heading: "How Laurelwood Began",
    body:
      "Two men shaped early Laurelwood, and their similar names are often confused. Harry C. Fryman owned the land, and after his death his heirs sold it. In 1949, Chapman College purchased 134 acres from the Fryman heirs, intending to build a San Fernando Valley campus. That project never came to fruition, and the college sold the land to the Home Savings and Loan Association, which began developing West Laurelwood in 1958. To realize that vision, Home Savings commissioned architect David Freedman, AIA, who designed the homes that gave the new neighborhood its character.",
    caption:
      "Harry C. Fryman, a prominent developer, is pictured in a bungalow located on the top floor of a hotel he owned. His heirs later sold the Laurelwood property to Chapman College, which in turn sold it to Home Savings and Loan Association for further development.",
  },

  // ## SECTION: The Laurelwood Dream in 1958
  dream: {
    heading: "The Laurelwood Dream in 1958",
    vision:
      "In 1958, Laurelwood wasn't just another neighborhood; it was a vision. Architect David Freedman, AIA, crafted a place where families could experience the tranquility of country living, with the convenience of city life just minutes away. The marketing of that era captured the imagination with its promise of a new kind of town and country living, offering both elegance and practicality.",
    brochureIntro:
      'The original brochure invited families to "Take a long hard look at the best the land of Laurelwood offers!" and presented features like:',
    features: [
      "Underground utilities: For unobstructed scenic views and a clean aesthetic.",
      "Genuine plaster and lath construction: A testament to craftsmanship and durability.",
      "Fireplaces in four distinct styles: Choose from white ruffled Norman brick, plaster, marble, or Spanish tile, bringing warmth and character to every home.",
    ],
    decorators:
      "Each of the four model homes was beautifully curated by the esteemed interior design firm Cannell & Chaffin, with renowned decorators Milan Bayan, Rodger Billingsley, Hillard Pettler, and Claire Robinson adding their own artistic touch. Together, they created interiors that matched the grandeur of the architecture, offering a luxurious, yet welcoming atmosphere for families.",
    // Staging caption shown centered above the floorplan/rendering grid. NOTE:
    // provided by Jack for this layout; NOT from the Wix extraction.
    stagingCaption:
      "Today, sellers stage a home with furniture and photography so buyers can picture themselves living in it. In 1958, Laurelwood did the same thing with a brush and ink. Since the tract was sold before it was built, prospective buyers couldn't walk a model on every lot. Instead, each floor plan was offered with a choice of three different exterior treatments, and an artist rendered each one. Plans 1B, 1C, and 1D were shown with their distinct rooflines, post-and-beam facades, and freshly imagined landscaping. These watercolor elevations were the era's version of staging, a hand-drawn promise of what your home could look like before a single slab was poured.",
  },

  // ## SECTION: Laurelwood in the 21st Century
  century21: {
    heading: "Laurelwood in the 21st Century",
    body: [
      "While the essence of Laurelwood remains unchanged, offering a perfect blend of country charm and city convenience, the homes here have evolved to meet the needs of today's families. The vision set by David Freedman in 1958 has seamlessly transitioned into the 21st century, with homes now incorporating the best of modern living while preserving the neighborhood's timeless appeal.",
      "Today's homes feature open-concept layouts and energy-efficient systems that ensure sustainability without compromising style. The contemporary finishes, including sleek countertops, custom cabinetry, and high-end appliances, add sophistication to every space. Laurelwood continues to provide a tranquil environment with modern touches, true to Freedman's original vision.",
      "Just as in 1958, Laurelwood remains ideally located, only minutes from Hollywood, Beverly Hills, and downtown Los Angeles. It continues to offer both the quiet beauty of nature and the convenience of urban access.",
    ],
  },

  // ## GALLERY: Scenic views (captions West/East alternating)
  scenic: {
    captions: ["West Laurelwood", "East Laurelwood", "West Laurelwood", "East Laurelwood"],
  },

  // ## SECTION: A Timeless Transformation: Laurelwood's Homes Then and Now
  transformation: {
    heading: "A Timeless Transformation: Laurelwood's Homes Then and Now",
    intro: [
      'Step back in time to 1958, when Laurelwood first welcomed families seeking the perfect balance of "country living with city convenience." Nestled above the San Fernando Valley, this neighborhood offered a peaceful escape just minutes from the heart of Los Angeles. The homes were thoughtfully designed by renowned architect David Freedman, AIA, whose vision shaped the community into a harmonious blend of rural charm and urban accessibility.',
      "While much has changed over the decades, the essence of Laurelwood remains the same. Its scenic charm, thoughtful architecture, and close-knit community, as envisioned by Freedman, continue to attract those seeking both elegance and practicality. Today, the homes have evolved with modern features, but the original vision of 1958 still defines Laurelwood.",
    ],
    evolved:
      "As Laurelwood has evolved, the neighborhood's hallmark qualities, such as its blend of country charm and city convenience, are just as relevant today as they were in 1958. While Freedman's original vision still endures, the homes themselves have seen subtle transformations. Modern technology and updated designs have been incorporated to enhance their timeless appeal. Below is a comparison of how specific elements of these homes have adapted to meet the needs of today's homeowners.",
    comparisons: [
      {
        subhead: "Architectural Design",
        then1958:
          "1958: Freedman's designs introduced 20 unique home elevations, carefully crafted to offer families an elegant escape, with each home tailored to reflect the best of rural and urban living.",
        today:
          "Today: These layouts have been refreshed and expanded to accommodate today's lifestyle demands, incorporating customizable floor plans and modern architectural enhancements that remain true to the original designs.",
      },
      {
        subhead: "Interior Layouts",
        then1958:
          "1958: Homes featured cozy yet functional rooms, designed for family life with traditional separation of spaces.",
        today:
          "Today: Open-concept layouts now dominate, providing airy, flexible living spaces that accommodate modern family dynamics, while still honoring the cozy charm of the original designs.",
      },
      {
        subhead: "Technological Advancements",
        then1958:
          "1958: Laurelwood was ahead of its time, offering pioneering features like forced-air heating and intercom systems to connect rooms throughout the house.",
        today:
          "Today: The homes boast smart technology, from integrated home systems for climate control, security, and lighting to energy-efficient HVAC systems, allowing for a seamless blend of comfort and convenience.",
      },
      {
        subhead: "Sustainability",
        then1958:
          "1958: Cedar shake roofs and traditional construction methods offered durability and a connection to the natural surroundings.",
        today:
          "Today: Homes have embraced modern sustainability practices with solar-ready roofs and eco-friendly materials that promote energy efficiency without sacrificing the rustic charm of the original architecture.",
      },
      {
        subhead: "Aesthetic Features",
        then1958:
          "1958: Handcrafted fireplaces in rock, Spanish tile, or plaster provided focal points of warmth and style in each home.",
        today:
          "Today: While many homes have retained these iconic fireplaces, modern updates include sleek gas or electric models that complement contemporary aesthetics while preserving their character.",
      },
    ],
    closing:
      "As you walk through a home in Laurelwood today, you'll find the spirit of 1958 alive in every detail, from the preserved architectural elements to the innovative enhancements that make these homes perfect for modern living. Whether you are drawn to the nostalgia of vintage design or the conveniences of contemporary style, Laurelwood offers a living experience that bridges the past and the present.",
  },

  // ## GALLERY: Plan rows (paired captions, verbatim). Each row = a LEFT plate of
  // three exterior-style renderings + a RIGHT plate of the floor-plan blueprint.
  exterior: {
    // Left-column captions: the three exterior-STYLE renderings per plan.
    styles: [
      ["West Laurelwood Plan 1", "Three Different Exterior Styles"],
      ["West Laurelwood Plan 2", "Three Different Exterior Styles"],
      ["West Laurelwood Plan 3", "Three Different Exterior Styles"],
      ["West Laurelwood Plan 4", "Three Different Exterior Styles"],
    ],
    // Right-column captions: the floor-plan blueprint offered per plan.
    plans: [
      ["West Laurelwood", "Example of the Floor Plan Offered", "1B, 1C, and 1D"],
      ["West Laurelwood", "Example of the Floor Plan Offered", "2B, 2C, and 2D"],
      ["West Laurelwood", "Example of the Floor Plan Offered", "3B, 3C, and 3D"],
      ["West Laurelwood", "Example of the Floor Plan Offered", "4B and 4C"],
    ],
    interiorRendering: ["West Laurelwood", "Interior Rendering"],
  },
} as const;
