// lib/photos.ts
//
// Typed photo manifest. Every entry below was produced by the photo pipeline
// (scripts/process-photos.mjs: sharp, max 2400px wide, q82, metadata stripped,
// clean kebab-case output to public/images/). Each source image was inspected
// by eye and categorized + captioned accordingly.
//
// Many archival images carry an intentional "MISRAJE REAL ESTATE PARTNERS"
// watermark; that is by design, left as-is.
//
// Pages reference images by `id` via photo(id) for deterministic placement, or
// by category via byCategory(). heroFor()/bestWideHero() drive the hero slots.

export type PhotoPage =
  | "home"
  | "west-laurelwood"
  | "east-laurelwood"
  | "dona-streets"
  | "history"
  | "homeowners"
  | "about"
  | "what-we-do"
  | "contact"
  | "buying"
  | "selling";

export type PhotoSection = "hero" | "feature" | "gallery" | "team";

export type PhotoCategory =
  | "archival-ads"
  | "documents"
  | "street-signs"
  | "period-photos"
  | "renderings"
  | "highway-shields"
  | "vista";

export type Photo = {
  /** Stable id (the output slug, no path/extension). Used by photo(id). */
  id: string;
  /** Public path under /images. */
  src: string;
  /** Accessibility alt text. */
  alt: string;
  /** Italic caption shown beneath framed artifacts (date where known). */
  caption?: string;
  category: PhotoCategory;
  /** Primary page placement (inference + default). Pages may reference any id. */
  page: PhotoPage | null;
  section: PhotoSection;
  width: number;
  height: number;
  /** True for landscape shots suitable for a full-bleed hero. */
  wide?: boolean;
};

export const PHOTOS: Photo[] = [
  // --- Modern vista (hero) -------------------------------------------------
  {
    id: "laurelwood-vista",
    src: "/images/laurelwood-vista.jpg",
    alt: "Present-day view over the hillside homes and greenery of Laurelwood in Studio City.",
    caption: "Laurelwood today, from the surrounding hills.",
    category: "vista",
    page: "west-laurelwood",
    section: "hero",
    width: 2400,
    height: 1596,
    wide: true,
  },

  // --- Archival newspaper ads (1958-1966) ----------------------------------
  {
    id: "april-13-1966-east-laurelwood-ad",
    src: "/images/april-13-1966-east-laurelwood-ad.png",
    alt: "Laurelwood Realty Co. classified newspaper ad from April 13, 1966.",
    caption: "Laurelwood Realty Co. listing ad, April 13, 1966.",
    category: "archival-ads",
    page: "west-laurelwood",
    section: "gallery",
    width: 302,
    height: 418,
  },
  {
    id: "cannell-chaffin-mother-in-law-ad",
    src: "/images/cannell-chaffin-mother-in-law-ad.png",
    alt: "Cannell & Chaffin newspaper ad for Laurelwood with the line about a happy mother-in-law.",
    caption: 'Cannell & Chaffin campaign ad, "even my mother-in-law\'s happy."',
    category: "archival-ads",
    page: "west-laurelwood",
    section: "gallery",
    width: 1150,
    height: 416,
  },
  {
    id: "cannell-chaffin-sensations-not-words-ad",
    src: "/images/cannell-chaffin-sensations-not-words-ad.png",
    alt: 'Cannell & Chaffin model-home ad for Laurelwood, "described in sensations, not words."',
    caption: 'Cannell & Chaffin model-home ad, "sensations, not words."',
    category: "archival-ads",
    page: "west-laurelwood",
    section: "gallery",
    width: 396,
    height: 292,
  },
  {
    id: "bel-air-of-the-valley-ad",
    src: "/images/bel-air-of-the-valley-ad.png",
    alt: 'East Laurelwood newspaper ad billing it "The Bel-Air of the Valley," new custom homes from $39,950.',
    caption: 'East Laurelwood, "The Bel-Air of the Valley," new custom homes from $39,950.',
    category: "archival-ads",
    page: "east-laurelwood",
    section: "gallery",
    width: 662,
    height: 762,
  },

  // --- Origins: billboard photo + renderings + recorded map ----------------
  {
    id: "gateway-homes-billboard",
    src: "/images/gateway-homes-billboard.jpg",
    alt: 'Two men at the "Gateway Homes Inc. at Laurelwood" roadside billboard on the future tract.',
    caption: "Breaking ground: the Gateway Homes billboard at the Laurelwood tract.",
    category: "period-photos",
    page: "west-laurelwood",
    section: "feature",
    width: 1102,
    height: 1226,
  },
  {
    id: "plan-4bc-renderings",
    src: "/images/plan-4bc-renderings.png",
    alt: "Architectural renderings of Laurelwood home elevations Plan 4B and Plan 4C.",
    caption: "Model elevations: Plan 4B and Plan 4C.",
    category: "renderings",
    page: "west-laurelwood",
    section: "feature",
    width: 1098,
    height: 448,
  },
  {
    id: "tract-24676-map",
    src: "/images/tract-24676-map.png",
    alt: "The recorded subdivision document for Tract No. 24676, West Laurelwood.",
    caption: "Tract No. 24676, the recorded subdivision map (1958).",
    category: "documents",
    page: "west-laurelwood",
    section: "feature",
    width: 496,
    height: 702,
  },

  // --- Street sign ---------------------------------------------------------
  {
    id: "dona-maria-street-sign",
    src: "/images/dona-maria-street-sign.png",
    alt: "Doña Maria Dr. street sign, 3100 N, with the Spanish tilde restored.",
    caption: "Doña Maria Dr., one of Laurelwood's Spanish-named streets.",
    category: "street-signs",
    page: "dona-streets",
    section: "feature",
    width: 808,
    height: 222,
    wide: true,
  },

  // --- Period life ---------------------------------------------------------
  {
    id: "neighborhood-children",
    src: "/images/neighborhood-children.png",
    alt: "Laurelwood children lined up outdoors in the early 1970s, waiting for the school bus.",
    caption: "Kids in the early 70s are lined up in Laurelwood, waiting for the school bus to arrive.",
    category: "period-photos",
    page: "east-laurelwood",
    section: "gallery",
    width: 696,
    height: 472,
  },
  {
    id: "school-bus",
    src: "/images/school-bus.png",
    alt: "A Laurelwood child looking out the window of a Los Angeles City Schools bus in the early 1970s.",
    caption: "Laurelwood kids in the early 70s on the neighborhood bus to school.",
    category: "period-photos",
    page: "east-laurelwood",
    section: "gallery",
    width: 696,
    height: 472,
  },

  // --- Documents: freeway study map ----------------------------------------
  {
    id: "route-170-freeway-study-map-1970",
    src: "/images/route-170-freeway-study-map-1970.png",
    alt: "Study zone map for the proposed Route 170 (Laurel Canyon) Freeway.",
    caption: "Study zone map, the proposed Route 170 (Laurel Canyon) Freeway, February 6, 1970.",
    category: "documents",
    page: "history",
    section: "feature",
    width: 1534,
    height: 876,
  },

  // --- Highway shields -----------------------------------------------------
  {
    id: "ca-170-shield",
    src: "/images/ca-170-shield.png",
    alt: "California State Route 170 highway shield.",
    caption: "California State Route 170.",
    category: "highway-shields",
    page: "history",
    section: "gallery",
    width: 552,
    height: 492,
  },
  {
    id: "ca-90-shield",
    src: "/images/ca-90-shield.png",
    alt: "California State Route 90 highway shield.",
    caption: "California State Route 90.",
    category: "highway-shields",
    page: "history",
    section: "gallery",
    width: 466,
    height: 486,
  },
];

// Self-hosted video (copied verbatim by the pipeline to public/video/). The
// caption lives with the page copy in content/west.ts; this is a fallback.
export const VIDEOS = {
  "disorderly-orderly": {
    src: "/video/disorderly-orderly-1964.mp4",
    caption: "West Laurelwood, mid-construction, as seen in The Disorderly Orderly (1964).",
  },
} as const;

// --- Accessors --------------------------------------------------------------

/** Look up a photo by its stable id. Returns null if missing. */
export function photo(id: string): Photo | null {
  return PHOTOS.find((p) => p.id === id) ?? null;
}

/** All photos in a category, in manifest order. */
export function byCategory(category: PhotoCategory): Photo[] {
  return PHOTOS.filter((p) => p.category === category);
}

/** The hero image for a page, or null (caller falls back to the gradient). */
export function heroFor(page: PhotoPage): Photo | null {
  return PHOTOS.find((p) => p.page === page && p.section === "hero") ?? null;
}

/** All photos whose primary placement is this page. */
export function photosFor(page: PhotoPage): Photo[] {
  return PHOTOS.filter((p) => p.page === page);
}

/** The best wide landscape photo for a full-bleed hero, or null. */
export function bestWideHero(): Photo | null {
  return (
    PHOTOS.find((p) => p.section === "hero" && p.wide) ??
    PHOTOS.find((p) => p.wide) ??
    null
  );
}

/** Photos the pipeline could not confidently place (for STATE.md review). */
export function unplacedPhotos(): Photo[] {
  return PHOTOS.filter((p) => p.page === null);
}
