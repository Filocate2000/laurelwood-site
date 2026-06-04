// scripts/process-photos.mjs
//
// Photo pipeline for the Misraje neighborhood-site template.
//
// Reads every image in source-photos/, then with sharp:
//   - resizes to a max of 2400px wide (never upscales),
//   - re-encodes at quality 82,
//   - strips all metadata,
//   - writes to public/images/ under a clean kebab-case, lowercase name
//     (Vercel's filesystem is case-sensitive, so we lowercase everything).
//
// JPEG/JPG and WEBP inputs keep their container; PNG inputs are kept as PNG
// (to preserve transparency for any logo/diagram). Output names always use the
// lowercased, kebab-cased base name with the normalized extension.
//
// Run: npm run photos   (or: node scripts/process-photos.mjs)
//
// After running, update lib/photos.ts so each output file is mapped to its
// page/section. The script prints a manifest scaffold you can paste in.

import { readdir, mkdir, stat, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "source-photos");
const OUT_DIR = path.join(ROOT, "public", "images");
const VIDEO_DIR = path.join(ROOT, "public", "video");

const MAX_WIDTH = 2400;
const QUALITY = 82;
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);
const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov"]);

// Clean, semantic output slugs keyed by the SOURCE basename (without extension).
// The originals carry camera/scan names (DSC_0094, IMG_1869) or filename typos
// (mohter); this map gives each artifact a stable, descriptive public name that
// reflects its verified content (each image was inspected). Sources not listed
// here fall back to kebab() of their original name.
const RENAME = {
  "April_13__1966_E_Laurelwood_Ad_MREP": "april-13-1966-east-laurelwood-ad",
  "Cannell_Chaffin_mohter_in_law_ad_MREP": "cannell-chaffin-mother-in-law-ad",
  "Cannell_Chaffin_Sensations_Not_Words_MREP": "cannell-chaffin-sensations-not-words-ad",
  "Gateway_Homes_Inc_MREP": "bel-air-of-the-valley-ad",
  "Breaking Ground MREP": "gateway-homes-billboard",
  "Multi_Home_Plan_4": "plan-4bc-renderings",
  "Tract_24676": "tract-24676-map",
  "Feb_6_1970_Proposed_Laurel_Canyon_FreewayMREP": "route-170-freeway-study-map-1970",
  "Dona_Maria": "dona-maria-street-sign",
  "Green_170_sign": "ca-170-shield",
  "California_90_svg": "ca-90-shield",
  "IMG_1863": "neighborhood-children",
  "IMG_1869": "school-bus",
  "DSC_0094": "laurelwood-vista",
  "Orderly V3E (1)": "disorderly-orderly-1964",
};

function slugFor(base) {
  return RENAME[base] ?? kebab(base);
}

/** kebab-case + lowercase a base filename (no extension). */
function kebab(name) {
  return name
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

/** Normalize an extension to the output container we will write. */
function outExt(ext) {
  const e = ext.toLowerCase();
  if (e === ".jpeg" || e === ".jpg") return ".jpg";
  if (e === ".png") return ".png";
  if (e === ".webp") return ".webp";
  // tif/tiff and anything else become jpg
  return ".jpg";
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`source-photos/ not found at ${SRC_DIR}`);
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const entries = await readdir(SRC_DIR);
  const images = [];
  const videos = [];
  for (const name of entries) {
    const full = path.join(SRC_DIR, name);
    const s = await stat(full);
    if (!s.isFile()) continue;
    const ext = path.extname(name).toLowerCase();
    if (IMAGE_EXTS.has(ext)) images.push(name);
    else if (VIDEO_EXTS.has(ext)) videos.push(name);
  }

  // Videos are copied through verbatim (no transcode) to public/video/.
  if (videos.length > 0) {
    await mkdir(VIDEO_DIR, { recursive: true });
    for (const name of videos) {
      const ext = path.extname(name).toLowerCase();
      const outName = `${slugFor(path.basename(name, path.extname(name)))}${ext}`;
      await copyFile(path.join(SRC_DIR, name), path.join(VIDEO_DIR, outName));
      console.log(`  ${name}  ->  /video/${outName}  (copied)`);
    }
  }

  if (images.length === 0) {
    console.log(
      "No images found in source-photos/. Nothing to process.\n" +
        "Drop the neighborhood photos into source-photos/ and re-run."
    );
    return;
  }

  const manifest = [];
  for (const name of images) {
    const ext = path.extname(name);
    const base = path.basename(name, ext);
    const outName = `${slugFor(base)}${outExt(ext)}`;
    const src = path.join(SRC_DIR, name);
    const dest = path.join(OUT_DIR, outName);

    let pipeline = sharp(src, { failOn: "none" })
      .rotate() // honor EXIF orientation before stripping metadata
      .resize({ width: MAX_WIDTH, withoutEnlargement: true });

    const e = outExt(ext);
    if (e === ".jpg") pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
    else if (e === ".png") pipeline = pipeline.png({ quality: QUALITY });
    else if (e === ".webp") pipeline = pipeline.webp({ quality: QUALITY });

    const info = await pipeline.toFile(dest);
    manifest.push({ src: name, out: `/images/${outName}`, w: info.width, h: info.height });
    console.log(`  ${name}  ->  /images/${outName}  (${info.width}x${info.height})`);
  }

  console.log(`\nProcessed ${manifest.length} image(s) into public/images/.`);
  console.log("\nManifest scaffold for lib/photos.ts:\n");
  console.log(JSON.stringify(manifest, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
