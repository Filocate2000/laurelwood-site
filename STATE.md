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
- **Phase 2 (photo pipeline): infrastructure DONE, 0 photos processed.**
  `scripts/process-photos.mjs` (sharp: max 2400px wide, q82, strip metadata,
  kebab-case lowercase output to `public/images/`) and `lib/photos.ts` (typed
  manifest + filename-hint placement inference) are built and runnable
  (`npm run photos`). `source-photos/` is empty, so PHOTOS is empty and pages
  fall back to the navy gradient.
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

None processed yet (source-photos/ is empty). When photos are added and
`npm run photos` is run, list here any output file that `inferPlacement()` in
`lib/photos.ts` returns `page: null` for (unrecognized filename hint), so a
human can assign its page/section by hand.

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
