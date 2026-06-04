// lib/photos.ts
//
// Typed photo manifest. Maps each processed image in public/images/ to the
// page/section where it should appear, inferred from filename hints.
//
// STATUS: source-photos/ is currently EMPTY, so PHOTOS is empty and every page
// falls back to the navy editorial gradient (PageHero) or omits its imagery.
// When photos are added: drop them in source-photos/, run `npm run photos`,
// then add one entry per output file to PHOTOS below (the script prints a
// scaffold). Use inferPlacement() to suggest page/section from the filename,
// and override by hand where the hint is wrong.

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

export type Photo = {
  /** Public path, e.g. "/images/west-laurelwood-aerial.jpg". */
  src: string;
  /** Human alt text. */
  alt: string;
  /** Inferred page placement; null means "needs placement review". */
  page: PhotoPage | null;
  /** Section role within the page. */
  section: PhotoSection;
  /** Pixel dimensions from the pipeline, if known. */
  width?: number;
  height?: number;
  /** True for wide/landscape shots suitable for a full-bleed hero. */
  wide?: boolean;
};

// Populated from the photo pipeline. Empty until source-photos/ has images.
export const PHOTOS: Photo[] = [];

// --- Filename-hint inference ------------------------------------------------

// Ordered keyword rules. First match wins for the page; section is inferred
// separately. Tune as the real filenames become known.
const PAGE_HINTS: { page: PhotoPage; keywords: string[] }[] = [
  { page: "west-laurelwood", keywords: ["west-laurelwood", "west-laurel", "westlaurelwood", "west"] },
  { page: "east-laurelwood", keywords: ["east-laurelwood", "east-laurel", "eastlaurelwood", "east"] },
  { page: "dona-streets", keywords: ["dona", "doña", "street-sign", "street"] },
  { page: "history", keywords: ["history", "1958", "vintage", "archive", "brochure", "ad", "fryman", "wilacre"] },
  { page: "about", keywords: ["jack", "karen", "misraje", "portrait", "team", "headshot"] },
  { page: "homeowners", keywords: ["watch", "emergency", "community", "park", "trail"] },
  { page: "what-we-do", keywords: ["marketing", "staging", "service"] },
  { page: "buying", keywords: ["buying", "buyer"] },
  { page: "selling", keywords: ["selling", "seller", "sold"] },
  { page: "home", keywords: ["hero", "aerial", "wide", "panorama", "laurelwood", "studio-city", "valley", "mulholland"] },
];

/** Suggest a page + section for an output filename. page is null if unclear. */
export function inferPlacement(filename: string): { page: PhotoPage | null; section: PhotoSection } {
  const f = filename.toLowerCase();

  let section: PhotoSection = "gallery";
  if (/(jack|karen|portrait|headshot|team)/.test(f)) section = "team";
  else if (/(hero|aerial|wide|panorama|cover|banner)/.test(f)) section = "hero";
  else if (/(feature|desk|study|interior)/.test(f)) section = "feature";

  for (const rule of PAGE_HINTS) {
    if (rule.keywords.some((k) => f.includes(k))) {
      return { page: rule.page, section };
    }
  }
  return { page: null, section };
}

// --- Accessors used by pages ------------------------------------------------

/** The hero image for a page, or null (caller falls back to the gradient). */
export function heroFor(page: PhotoPage): Photo | null {
  return PHOTOS.find((p) => p.page === page && p.section === "hero") ?? null;
}

/** All photos assigned to a page (any section). */
export function photosFor(page: PhotoPage): Photo[] {
  return PHOTOS.filter((p) => p.page === page);
}

/** The best wide landscape photo for the home hero, or null. */
export function bestWideHero(): Photo | null {
  return (
    PHOTOS.find((p) => p.page === "home" && p.section === "hero" && p.wide) ??
    PHOTOS.find((p) => p.section === "hero" && p.wide) ??
    PHOTOS.find((p) => p.wide) ??
    null
  );
}

/** Photos the pipeline could not confidently place (for STATE.md review). */
export function unplacedPhotos(): Photo[] {
  return PHOTOS.filter((p) => p.page === null);
}
