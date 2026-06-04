# Project State: laurelwood-site

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
- **A stale server serves mismatched build hashes and the CSS 400s.** After
  `npm run build`, kill any old `next start` / `next dev` before reloading,
  otherwise the page can render UNSTYLED (looks like narrow, non-full-width
  bands) because the served HTML references a CSS hash the old process does not
  have. Confirm `/_next/static/css/<hash>.css` returns 200. (See the
  2026-06-04 width fix pass near the end of this file.)

---

## Build status

- **Phase 0 (scaffold): DONE.** Next.js 15 App Router + TypeScript + Tailwind,
  design tokens/fonts/globals ported, `lib/site-config.ts` created, this
  STATE.md created. `npm run build` passing.
- **Phase 1 (content inventory): DONE.** All 15 Wix pages fetched into
  `content/source/*.md` (verbatim, em dashes scrubbed, "Acquisition" spelling
  corrected). `content/redirect-map.md` seeded. Verified from the Wix footer/bio
  pages and folded into `lib/site-config.ts`: Karen CalRE# 00592639; Jack CalRE#
  01015912, NMLS# 259077, US patents 8,145,563 / 8,117,120 / 7,769,681; office
  301 N Canon Dr Suite E, Beverly Hills CA 90210; phones J 323-209-5225 /
  K 310-488-1030 / O 855-888-SOLD; full Wix legal + accessibility text ported
  verbatim. Doña streets named in source copy: Doña Emilia Dr., Doña Rosa Dr.,
  Doña Pegita Dr. (there may be more on the live site; only these appear in the
  fetched copy, do not fabricate others).
- **Phase 2 (photo pipeline): DONE, 14 images + 1 video processed (2026-06-04).**
  The real historical archive landed in `source-photos/`. `npm run photos`
  (sharp: max 2400px, q82, metadata stripped) wrote clean, semantically named
  files to `public/images/` (and the `.mp4` to `public/videos/`). The pipeline
  now carries a `RENAME` map giving each artifact a descriptive slug (every
  source image was inspected by eye). `lib/photos.ts` is a real, categorized,
  captioned manifest (categories: archival-ads, documents, street-signs,
  period-photos, renderings, highway-shields, vista) with `photo(id)` /
  `byCategory()` / `heroFor()` accessors. Pages reference images by id for
  deterministic placement. Watermarked images are intentional, left as-is.
- **Photo integration / West Laurelwood rebuild: DONE (2026-06-04).**
  `/west-laurelwood` rebuilt as full-width alternating navy/white bands
  (`.editorial` inner) with framed-artifact treatment (`components/
  FramedArtifact.tsx`, cream plate + thin gold frame + italic captions) and a
  self-hosted clip (`components/SelfHostedVideo.tsx`). Artifacts also placed on
  `/history/development` (freeway map + CA-170/CA-90 shields),
  `/history/land-acquisition` (Tract 24676 map), `/east-laurelwood` (freeway
  map), `/dona-streets` (Doña Maria sign + expanded street list), and the home
  hero (the modern vista). See the placement report at the end of this file.
- **Phase 3 (the site): DONE.** All pages built in the misraje design language:
  home (hero, intro, West/East split bands, Doña band, why-Misraje, commute
  widget, testimonials, CTA); /west-laurelwood + /east-laurelwood (Place
  JSON-LD); /dona-streets (new, names the Doña streets); /history +
  /history/development + /history/land-acquisition; /homeowners + its three
  subpages; /about (Jack + Karen, RealEstateAgent JSON-LD with CalRE); /what-we-do;
  /contact (reuses misraje's Supabase + Turnstile mechanism, lead source keyed
  to laurelwoodestates.com via siteConfig.domain); /buying + /selling;
  /accessibility + /privacy. Nav + footer in the misraje pattern (CB
  affiliation, agent CalRE numbers, equal-housing + full accessibility text,
  Blog/LARE commented placeholders, no dead links). Commute widget transplanted
  with studio-city as the origin. Per-page metadata + OpenGraph + canonical;
  sitemap.xml + robots.txt; site-wide Organization (RealEstateAgent) JSON-LD.
- **Phase 4 (verify + document): DONE.** `npm run build` clean (all 18 static
  routes + 3 API routes); zero em dashes across app/, components/, lib/,
  content/ (grep). Prerendered HTML spot-checked (content present, fetch-notes
  stripped, JSON-LD + canonical present). Browser-verification checklist and
  Future Work below.

## Photos needing placement review

All 14 images (and the 1 video) are placed; nothing is unplaced. The favicon is
still the placeholder "L" (no logo/mark was in this asset batch).

Notes on judgment calls (verify in the browser):
- The home + West Laurelwood heroes use `laurelwood-vista` (DSC_0094), a
  present-day hillside view. It is the only wide landscape asset, so it is the
  hero rather than a period photo. The period billboard is featured in the West
  origins band instead.
- `april-13-1966-east-laurelwood-ad` (source filename said "E_Laurelwood") is
  placed in the West archival band per the rebuild spec; the ad headline reads
  "Laurelwood Estates" / Laurelwood Realty Co.
- `bel-air-of-the-valley-ad` was the source file named `Gateway_Homes_Inc`; by
  visual content it is the "Bel-Air of the Valley" newspaper ad. The actual
  Gateway Homes billboard PHOTO is the source file named `Breaking Ground`
  (id `gateway-homes-billboard`).
- East Laurelwood has no dedicated hero photo, so its hero uses the navy
  gradient; the freeway study map is placed in its body (its copy carries the
  freeway-controversy section).

---

## Blockers

- **RESOLVED (2026-06-04): `source-photos/` populated and processed.** The
  historical archive (14 images + 1 video) was added and run through the
  pipeline; see Phase 2 above and the placement report at the end of this file.
  Heroes and bands now show real imagery. Still outstanding from this batch:
  no team portraits (`/images/team/*.jpg`), so the nav drawer keeps text-only
  agent cards; no logo/mark, so the favicon stays the placeholder "L"; East
  Laurelwood has no dedicated hero photo (gradient hero, freeway map in body).
- **No `laurelwood` commute origin exists hub-side** (checked
  misraje-site/lib/commute/origins.ts). Using the nearest curated origin,
  `studio-city`, as the default (`siteConfig.commuteOriginKey`). A dedicated
  `laurelwood` origin should be added hub-side later (see Future Work in Phase
  4).
- **Three Wix pages would not fetch as full body text** (Phase 1):
  - **Home** (`/`): the page body truncated on every attempt (Wix page is very
    long). `content/source/home.md` is assembled from the retrievable section
    blurbs + services overview + the two testimonials (Vega, Doryon) + framing,
    clearly noted at the top of the file. Re-capture the verbatim homepage body
    if it becomes fetchable.
  - **What We Do** (`/what-we-do`): the fetch returned homepage content instead
    of the dedicated page body. `content/source/what-we-do.md` uses the
    retrievable services overview + tagline ("Strategic Solutions, Exceptional
    Outcomes") and the Who We Are services description. Verify against the live
    page.
  - **Selling in Laurelwood** (`/selling-in-laurelwood`): the Wix page renders a
    dynamic market report that returned "Error loading report data" at capture,
    so no body was available. `content/source/selling-in-laurelwood.md` carries
    the heading + a selling-approach summary drawn from the verified Who We Are /
    What We Do copy. Replace with the verbatim body once the report loads.
  - (Jack Misraje's CalRE number, previously a blocker, is now resolved:
    01015912, verified.)
- **No YouTube link was provided** for the home-page video embed. The
  `YouTubeEmbed` component (gold-framed border-2 gold-500/70 rounded-xl, lazy
  IntersectionObserver iframe, 16:9 no-layout-shift) is built and wired into the
  Doña band on the home page, but it only renders when `homeContent.video` is
  set (`content/home.ts`). To enable: set `video` to
  `{ id: "<youtube-id>", title: "...", subject: "history|neighborhood|general" }`.
- **No logo/favicon file in `source-photos/`** (it is empty), so the favicon at
  `app/icon.svg` is a placeholder (gold serif "L" on navy). Replace it with the
  real Laurelwood mark when available (lowercase filename; `app/icon.svg` or
  `app/icon.png`).
- **`.env.local` NEXT_PUBLIC_SITE_KEY is still "misraje"** (the file was cloned
  from misraje-site). The contact route ignores it and derives the lead source
  from `siteConfig.domain` (laurelwoodestates.com), so leads attribute
  correctly. Optionally update the env value to "laurelwood" for cleanliness;
  not required.

---

## Browser-verification checklist (Phase 4)

`npm run build` passing only proves it compiles. Run `npm run dev` and walk
this list in a real browser before any DNS cutover:

- [ ] **Every page renders** with its content and (eventually) photos:
  `/`, `/west-laurelwood`, `/east-laurelwood`, `/dona-streets`, `/history`,
  `/history/development`, `/history/land-acquisition`, `/homeowners`,
  `/homeowners/neighborhood-watch`, `/homeowners/community-news`,
  `/homeowners/emergency-contacts`, `/about`, `/what-we-do`, `/buying`,
  `/selling`, `/contact`, `/accessibility`, `/privacy`.
- [ ] **Home sections in order**: hero, intro, West + East split bands, Doña
  band, why-Misraje (3 points), commute widget, two testimonials (Vega,
  Doryon), contact CTA.
- [ ] **Commute widget loads with LIVE times**: defaults to Studio City, the
  Google map renders (gold-framed), commute tiles toggle routes on the map,
  durations populate. Needs `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` (browser map)
  + `GOOGLE_MAPS_API_KEY` (server, NOT referrer-locked) + Supabase
  commute_cache/route_cache (shared backend). Restart dev fully after any env
  change.
- [ ] **Video embed plays** once a YouTube link is configured (see Blockers);
  no layout shift, lazy-loads on scroll.
- [ ] **Nav + footer links all resolve, no dead links.** Blog and LARE Report
  are deliberately absent (commented placeholders only). Drawer opens/closes,
  Escape closes, agent cards link to /about#karen and /about#jack anchors.
- [ ] **Contact form submits**: fill it out, confirm the Turnstile challenge,
  submit, see the success state, and confirm a `contact` row lands in Supabase
  with `lead_source = laurelwoodestates.com`.
- [ ] **Mobile layout** on every page (hamburger nav, stacked bands, hero text
  legible, no horizontal scroll).
- [ ] **Metadata / JSON-LD present** (view-source spot check): per-page title +
  description + canonical + OpenGraph; site-wide Organization
  (RealEstateAgent) JSON-LD; Place JSON-LD on the three neighborhood pages;
  RealEstateAgent JSON-LD with CalRE on /about; sitemap.xml + robots.txt serve.
- [ ] **Photo placement looks sensible** page by page once photos are added and
  `npm run photos` + lib/photos.ts mappings are in place (currently gradients).

## Future Work

- **Photos**: drop neighborhood + team photos into `source-photos/`, run
  `npm run photos`, populate `lib/photos.ts` (use `inferPlacement`), and replace
  the placeholder favicon. Add a wide hero for the home page.
- **Hub recon + registration**: register this site (site_key `laurelwood`) AND
  frymanestates.com (`fryman`) in the SAME realestategpa hub migration so the
  blog + LARE Report distribution can target them.
- **Wire the Blog and LARE Report pages** once registered: build `/blog` (and
  `/blog/[slug]`) and `/lare-report` (and `/lare-report/[slug]`) on the
  hub-and-spoke pattern (see misraje-site `lib/blog.ts` / `lib/lare.ts`), then
  uncomment the Blog + LARE Report placeholders in the nav and footer.
- **Add a `laurelwood` commute origin hub-side** (misraje-site
  `lib/commute/origins.ts` + `lib/commute/cities.ts`) with Laurelwood's own
  coordinates and curated destinations, then point `siteConfig.commuteOriginKey`
  at it (currently `studio-city`).
- **Full 301 redirect map** (`content/redirect-map.md`): old Wix URLs to new
  paths (done), plus the domain redirects: `westlaurelwood.com` to
  `/west-laurelwood`, `eastlaurelwood.com` to `/east-laurelwood`,
  `thedonastreets.com` to `/dona-streets`. Implement at the DNS/host/Vercel
  level (or via `next.config` redirects for the path-level ones).
- **Re-capture the three fetch-limited pages** verbatim if/when fetchable: home
  body, /what-we-do body, /selling-in-laurelwood report (see Blockers).
- **Vercel project creation + env vars**: create the Vercel project, set all
  `.env.local` keys (confirm `GOOGLE_MAPS_API_KEY` is the server, non-referrer
  key), set NEXT_PUBLIC_SITE_KEY to `laurelwood`.
- **DNS cutover (LAST, only after content review)**: this replaces the live Wix
  site. Point laurelwoodestates.com (and the redirecting domains) at Vercel only
  after Jack & Karen review the content.
- **Optional future**: a past-transactions section (the shared
  `past_transaction` schema is already multi-site-ready via the
  `past_transaction_site` junction); register/login decision deferred.
- **Spawning frymanestates.com from this template**: clone this repo, replace
  `lib/site-config.ts` (siteKey `fryman`, name, domain, commute origin),
  `content/` (re-run the content inventory against the Fryman Wix site), and
  `source-photos/`. Nothing else should need to change.

---

LAURELWOOD SITE COMPLETE, awaiting browser verification.

---

## Image placement report (West Laurelwood rebuild, 2026-06-04)

> SUPERSEDED IN PART by the "East Laurelwood rebuild" section below: the
> kids/school-bus photos and the Bel-Air of the Valley ad moved from West to
> East, and the freeway study map was removed from /east-laurelwood (history
> page only). The table below reflects the original West rebuild, not the
> current state; trust the East rebuild section for those four assets.

14 images + 1 video processed by `npm run photos` into `public/images/` and
`public/videos/`. Per-file placement:

| Output file | Category | Placed on |
| --- | --- | --- |
| `laurelwood-vista.jpg` | vista | Home hero + West Laurelwood hero |
| `april-13-1966-east-laurelwood-ad.png` | archival-ads | West, Archival band |
| `bel-air-of-the-valley-ad.png` | archival-ads | West, Archival band |
| `cannell-chaffin-mother-in-law-ad.png` | archival-ads | West, Archival band |
| `cannell-chaffin-sensations-not-words-ad.png` | archival-ads | West, Archival band |
| `gateway-homes-billboard.jpg` | period-photos | West, Origins band |
| `plan-4bc-renderings.png` | renderings | West, Origins band |
| `tract-24676-map.png` | documents | West Origins band + /history/land-acquisition |
| `dona-maria-street-sign.png` | street-signs | West Doña band + /dona-streets |
| `neighborhood-children.png` | period-photos | West, Period-life band |
| `school-bus.png` | period-photos | West, Period-life band |
| `route-170-freeway-study-map-1970.png` | documents | /history/development + /east-laurelwood |
| `ca-170-shield.png` | highway-shields | /history/development |
| `ca-90-shield.png` | highway-shields | /history/development |
| `disorderly-orderly-1964.mp4` (video) | n/a | West, Period-life band ("On the Big Screen") |

**Unplaced images:** none. Every processed image is used at least once.

**Copy that references an artifact we now have, and how it was used:**
- "Tract No. 24676": the recorded map is shown on /history/land-acquisition (its
  copy names the tract) and in the West Origins band.
- "The Disorderly Orderly (1964)": the West copy's big-screen reference is now
  backed by the self-hosted clip in the West Period-life band.
- "Cannell & Chaffin" model-home decorators (development-history copy): the two
  Cannell & Chaffin ads are shown in the West Archival band.
- Proposed Laurel Canyon Freeway / Route 170 (West + East freeway copy): the
  1970 study map + CA-170/CA-90 shields are on /history/development; the map is
  also on /east-laurelwood beside its freeway-controversy copy.
- Doña street names: the Doña Maria Dr. sign is shown on /dona-streets and the
  West Doña band; the /dona-streets list now carries Doña Dorotea Dr., Doña
  Emilia Dr., Doña Maria Dr., Doña Mema Pl., Doña Pegita Dr., and Doña Rosa Dr.
  (Dorotea + Mema provided by the site owner; Maria confirmed by the sign;
  Emilia/Rosa/Pegita from the ported source copy).

**Copy references with no matching artifact (not used, none available):**
- The "Betty B. Dearing Trail", "Wilacre Park", and the 1958 model-home
  fireplaces/floor-plan details are described in copy but have no image in this
  batch.

**Page-width rule:** every page uses full-width bands (`<section>` background
spans 100vw) with an inner `.editorial` max-width wrapper, matching the
misraje-site pattern. PageHero is full-bleed. No page was found built narrower.

---

## Width + image-sizing fix pass (2026-06-04)

**The "bands not full width" report did NOT reproduce as a CSS/layout bug.**
Measured in a real headless browser via the Chrome DevTools Protocol at
innerWidth 1898 (1920 minus scrollbar): all seven `<main > section>` bands on
/west-laurelwood report `left=0, right=1898, width=1898`, i.e. edge to edge.
There is no max-width wrapper on body/main/section to remove; the structure
already matches misraje-site (full-width `<section>` bg, inner `.editorial`).

**Root cause of the constrained/unstyled appearance: a STALE server.** A
`next start` left running from before a rebuild served HTML referencing an old
CSS hash, so the stylesheet 404/400'd and the page rendered UNSTYLED, which
looks exactly like "narrow, no full-width bands." After killing the stale
process and restarting, the referenced CSS returns 200 and the page is styled
and full-width. **Banked lesson (added to repo cautions): after `npm run build`,
kill any old `next start`/`next dev` before reloading; a stale server serves
mismatched build hashes and the CSS 400s, yielding an unstyled page. Verify the
served `/_next/static/css/<hash>.css` returns 200.** This is the same family as
the existing "Login fails w/ no error? Check the dev server is RUNNING" rule.

**Image sizing overhaul (the real, actionable fix).** `components/
FramedArtifact.tsx` now sizes by `variant` and the cream plate HUGS the image
(it no longer stretches to the grid cell, so small scans are not marooned in an
oversized frame):
- `ad` (newspaper ads): natural aspect, max-height ~520px, 2-up grid.
- `photo` (period/neighborhood): medium plates (~460px), side by side.
- `document` (tract + freeway maps): ~600px tall, frame links to the full-size
  original in a new tab (an "Open full size" caption link).
- `banner` (the Doña Maria sign, a wide strip): fills the `.editorial` width.
- `shield` (CA-170/CA-90): small ~120px inline accents.
Applied across /west-laurelwood, /history/development, /history/land-acquisition,
/east-laurelwood, and /dona-streets. Placement was already per spec and is
unchanged (archival = the 4 ads only; origins = billboard + Plan 4B/4C +
Tract 24676 map; Doña band = the sign only; period = kids + bus only; the
freeway map + shields live on the history pages, not on West).

---

## East Laurelwood rebuild from authoritative copy (2026-06-04)

`content/source/east-laurelwood.md` was replaced with the full authoritative
East Laurelwood copy (one of the pages that had failed to fetch from Wix; the
old fetched version, which included a Laurel Canyon Freeway controversy section,
is superseded). `/east-laurelwood` was rebuilt from it as full-width alternating
bands (same canon as West), one band per `##` section in source order, copy
verbatim and em-dash-free. Copy now lives in `content/east.ts`.

Band structure (alternating, `.editorial` inner):
1. Hero (navy gradient; East has no dedicated hero photo).
2. The Vision of East Laurelwood, 1960s (white). "View the original floor plans"
   links to /history/development.
3. Growth and Expansion (navy): the 1964 Carpenter/Colfax school story, with the
   two period photos side by side (kids line-up + school bus) and their exact
   captions.
4. Real Estate Ads: A Glimpse into the Past (white): East's archive band, with
   the Bel-Air of the Valley ad (framed). Links to /history/development.
5. East Laurelwood Today (navy).
6. Embrace the East Laurelwood Lifestyle, rendered as the CTA band (white) with
   a Start a conversation button to /contact (no generic ContactCTA here).

**Images moved between pages (manifest `page` updated in lib/photos.ts):**
- `neighborhood-children` (kids line-up) and `school-bus`: West period-life band
  to East Growth band. Captions updated to the authoritative East captions. This
  is East's story (the Carpenter/Colfax controversy).
- `bel-air-of-the-valley-ad`: West archival band to East Real Estate Ads band
  (East's copy quotes that ad directly). West keeps the Laurelwood Realty
  (`april-13-1966-east-laurelwood-ad`) and the two Cannell & Chaffin ads.
- `route-170-freeway-study-map-1970`: REMOVED from /east-laurelwood (the new
  authoritative East copy has no freeway section). It now lives only on
  /history/development (plus the West page does not carry it either).

**West period-life band slimmed:** with the two photos gone, the West band is
now the "On the Big Screen" film band (the Disorderly Orderly clip), which is
West-specific. West archival band is now 3 ads (was 4).

Verified: clean build; rendered HTML confirms East has the two photos + Bel-Air
ad and two /history/development links, West no longer has them; full-width bands
confirmed in a headless browser.

---

EAST LAURELWOOD REBUILD DONE.
