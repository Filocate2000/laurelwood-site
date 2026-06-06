// content/dev-history.ts
// Band copy for /development-history. VERBATIM from
// content/source/dev-history-wix-extraction.md (the Wix extraction). ZERO text
// changes: straight quotes as-extracted, the hero's " - " hyphen kept (no em
// dash), the duplicated brochure + decorators passage included ONCE in order.
// Galleries carry no Wix heading, so those bands render plates only.

export const devHistoryContent = {
  hero: {
    title: "laurelwood   RESIDENTIAL DEVELOPMENT",
    subtitle:
      "Laurelwood: From 1958 to Today - A Timeless Blend of Country and City Living",
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

  // Floorplan-strip overlay labels. NOTE: these were NOT in the Wix extraction
  // (the strips had no caption there) — provided by Jack for the in-image
  // bottom-right overlay. The subtitle is pending confirmation of the trailing
  // "..." in the request.
  floorplanLabels: [
    { title: "West Laurelwood Floor Plan 1", subtitle: "The Choice of Three Different Interiors" },
    { title: "West Laurelwood Floor Plan 2", subtitle: "The Choice of Three Different Interiors" },
    { title: "West Laurelwood Floor Plan 3", subtitle: "The Choice of Three Different Interiors" },
    { title: "West Laurelwood Floor Plan 4", subtitle: "The Choice of Three Different Interiors" },
  ],

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

  // ## GALLERY: Exterior home plans (three-line captions, verbatim)
  exterior: {
    // Right-column "Exterior Home Plan" captions, plans 1-4, paired in the Dream
    // grid. NOTE: plan 1's third line ("1B,1C, and 1D") fills the "[WORDING]"
    // placeholder Jack left, following the sibling format and the staging
    // caption's "Plans 1B, 1C, and 1D" — confirm if it should differ.
    plans: [
      ["West Laurelwood", "Exterior Home Plan", "1B,1C, and 1D"],
      ["West Laurelwood", "Exterior Home Plan", "2B,2C, and 2D"],
      ["West Laurelwood", "Exterior Home Plan", "3B,3C, and 3D"],
      ["West Laurelwood", "Exterior Home Plan", "4B and 4C"],
    ],
    interiorRendering: ["West Laurelwood", "Interior Rendering"],
  },
} as const;
