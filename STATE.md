# Project State — laurelwood-site

Source-of-truth state file for **laurelwood-site**, the public marketing site
for **laurelwoodestates.com**. Created 2026-06-04.

If anything in a conversation contradicts this file, this file wins. Confirm
before proceeding.

---

## Project purpose

A **hyperlocal neighborhood site** for Laurelwood Estates and the Dona streets
of Studio City (laurelwoodestates.com). It is the second site in the Misraje
family of sites; the first is misraje-site (the firm's flagship marketing site).

Content is distributed **hub-and-spoke from realestategpa.com**: the hub authors
deliberate content (newsletters, blog posts, the LARE Report) and publishes it
out to the spoke sites. The blog and LARE Report pages on this site are
**COMING LATER**, after hub-side recon and registering this site (site_key
`laurelwood`) for distribution. Until then they are not rendered (clearly
commented placeholders only, no dead links).

## Design canon: misraje-site

The design language is inherited verbatim from
`C:\Users\filoc\Projects\misraje-site`, which is the **design canon**. Read its
`STATE.md`, `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts`, and
`components/` freely when in doubt. Ported into this repo at Phase 0:

- Design tokens: the `navy` / `royal` / `gold` / `ink` palettes, the editorial
  font scale, and the `wordmark` / `eyebrow` / `nav` letter-spacing tokens.
- Fonts via `next/font`: **DM Sans** (`--font-display`), **Inter Tight**
  (`--font-sans`), **Cormorant Garamond** (`--font-serif`).
- `globals.css` utilities: `.eyebrow`, `.gold-rule`, `.gold-rule-dark`,
  `.editorial` (plus an `.editorial-prose` family for ported page copy).
- Band/spacing canon: `py-20 md:py-28`, navy/white alternation, eyebrow canon
  (gold-600 on white bands, gold-500 on navy bands), DM Sans `font-display
  font-light` headings, prose body in Inter Tight, serif PageHero titles.

## Template-repo note (governs everything)

**This repo is the TEMPLATE for sibling neighborhood sites.** A third site,
frymanestates.com (site_key `fryman`), will be cloned from it. Therefore:

- Everything site-specific is centralized in **`lib/site-config.ts`** (site
  name, tagline, domain, `siteKey`, commute origin, office/contact details,
  agents, brokerage/affiliation, social, legal text).
- All page copy lives in **`content/`** (markdown), never hardcoded in
  components. Components read config + content; nothing Laurelwood-specific
  lives in a component.

**To spawn a sibling site: clone the repo, then replace `lib/site-config.ts`,
the `content/` directory, and `source-photos/`. Nothing else should need to
change.**

## Content style: NO EM DASHES

No em dashes ( the long dash ) anywhere in site content, including future
generated copy. Rewrite with a comma, period, or colon so sentences stay
natural; never substitute " - ". Numeric-range hyphens (K-5, 6-8, 2021-2025)
are fine. Applies to all user-visible strings and to code comments under `app/`,
`components/`, `lib/`, `content/`. `grep -rn` for the em dash across those dirs
must return nothing.

---

## Inherited hard-won rules (from misraje-site)

- **Build passing is NOT the same as working.** `npm run build` succeeding only
  proves it compiles. Always verify in the browser.
- **`next dev` reads config/env only at startup.** After changing `.env.local`
  or `next.config.mjs`, do a FULL dev-server restart, not a hot reload.
- **Verify data claims with your own queries.** Do not assert a fact about the
  data (counts, license numbers, addresses) without checking it; do not
  fabricate values.
- **Commit AND push at milestones (two-machine workflow).** Work moves between a
  home machine and the office machine, so unpushed commits strand the other
  machine. (NOTE: for THIS build the instruction is commit-only, do NOT push.)
- **Two Google Maps keys with different restrictions.**
  `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` is the in-browser Maps JS key
  (HTTP-referrer restricted). `GOOGLE_MAPS_API_KEY` is the server-side geocoding
  /Distance-Matrix/Directions key (API-restricted, NOT referrer-restricted). A
  referrer-locked browser key FAILS server-side. Never cross them.
- **Vercel filesystem is case-sensitive. Lowercase all filenames** (especially
  images in `public/images/`).
- `.env.local`: no spaces around `=`, UTF-8 no BOM. Backend (Supabase, Maps,
  Turnstile keys) is SHARED with misraje-site / realestategpa; the same
  `.env.local` values work here.

---

## Build status

- **Phase 0 (scaffold): DONE.** Next.js 15 App Router + TypeScript + Tailwind,
  design tokens/fonts/globals ported, `lib/site-config.ts` created, this
  STATE.md created. `npm run build` passing.

---

## Blockers

- **`source-photos/` is EMPTY** (verified 2026-06-04). Phase 2 (photo pipeline)
  cannot process any images and Phase 3 pages cannot show matched photos.
  PageHero falls back to a navy editorial gradient; the home hero likewise.
  Drop the neighborhood photos into `source-photos/` and re-run the photo
  pipeline. Team portraits (`/images/team/*.jpg`) are also absent, so the nav
  drawer uses text-only agent cards.
- **No `laurelwood` commute origin exists hub-side** (checked
  misraje-site/lib/commute/origins.ts). Using the nearest curated origin,
  `studio-city`, as the default (`siteConfig.commuteOriginKey`). A dedicated
  `laurelwood` origin should be added hub-side later (see Future Work in Phase
  4).
- **Jack Misraje's CalRE number is unknown.** `siteConfig.agents[jack].calRE`
  is blank pending confirmation from the Wix bio/footer (do not fabricate).
