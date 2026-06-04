// lib/content.ts
//
// Server-side loader for the ported page copy in content/source/*.md. Pages
// import this so no Laurelwood-specific prose lives in a component (architecture
// rule). The markdown is rendered by components/Prose.tsx.
//
// stripForPage() removes two things that belong to the inventory record but not
// the public page: the leading H1 (pages supply their own PageHero title) and a
// leading blockquote "note" block (the Phase 1 fetch/naming notes I added at the
// top of some files). Blockquotes that appear later in a file (for example the
// home-page testimonials) are preserved.

import fs from "node:fs";
import path from "node:path";

const SOURCE_DIR = path.join(process.cwd(), "content", "source");

function stripForPage(raw: string): string {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  let i = 0;

  // Skip blank lines, then drop a single leading H1 if present.
  while (i < lines.length && lines[i].trim() === "") i++;
  if (i < lines.length && /^#\s+/.test(lines[i])) i++;

  // Skip blank lines, then drop a leading contiguous blockquote block (a note).
  while (i < lines.length && lines[i].trim() === "") i++;
  if (i < lines.length && lines[i].startsWith(">")) {
    while (i < lines.length && lines[i].startsWith(">")) i++;
  }

  return lines.slice(i).join("\n").trim();
}

/** Read a content/source/<slug>.md file and return page-ready markdown. */
export function loadDoc(slug: string): string {
  const file = path.join(SOURCE_DIR, `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  return stripForPage(raw);
}
