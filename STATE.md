# Project State: laurelwood-site

Source-of-truth state file for **laurelwood-site**, the public marketing site for
**laurelwoodestates.com**. Created 2026-06-04. **Last audited against the code:
2026-08-27.**

## How this file works, and how it failed

This file wins over anything said in a conversation, **but only about the things
it actually claims, and only while those claims are true.** From roughly
2026-06-04 to 2026-08-27 it was badly out of date, and because it asserts
precedence, the staleness did active harm: it told every fresh session that the
LARE Report was unbuilt (it had shipped), that `/about`, `/what-we-do` and the
`/history/*` tree were live pages (all deleted), and it never mentioned
`/who-we-are`, `/meet-the-partners`, `/why-use-us`, `/past-transactions`,
`/report`, `/marketreport`, the market ingest route, the Brevo lead email, or
llms.txt. A precedence rule over a stale file is worse than no file.

So: **if you change what this file describes, change this file in the same
commit.** If you find a claim here that is not true, fix it rather than working
around it. Dated build reports at the bottom are history, not current state.

---

## Project purpose

A **hyperlocal neighborhood site** for Laurelwood Estates and the Doña streets of
Studio City (laurelwoodestates.com). Second site in the Misraje family; the first
is misraje-site (the firm's flagship).

**The third sibling is already LIVE**, correcting an earlier claim in this file
that it was "planned". It serves from **frymancanyonhomes.com**;
`frymanestates.com` is a redirect to it, and both are mapped to the `fryman` farm
site in the hub's `brokerage_domain` (migration
`2026-07-23-platform-sites-03-domain-resolution.sql`). The hub's
`lib/reporting/targets.ts` uses `www.frymancanyonhomes.com` as the canonical
host. So the clone-safety work in this repo is not hypothetical: a sibling is in
production, and whatever ships here is what the next clone inherits.

Deliberate content (the LARE Report, and eventually a blog) is authored on the
hub, **realestategpa.com**, and distributed to the spoke sites. See
"Hub integration" below for what is wired and what is not.

## Template-repo note (governs everything)

**This repo is the TEMPLATE for sibling neighborhood sites.** Therefore:

- Everything site-specific is centralized in **`lib/site-config.ts`**.
- All page copy lives in **`content/`**, never hardcoded in components.
- Components read config + content. Nothing Laurelwood-specific lives in a
  component.

**To spawn a sibling: clone the repo, then replace `lib/site-config.ts`, the
`content/` directory, and `source-photos/`. Nothing else should need to change.**

**Template drift, resolved 2026-08-27.** An audit for hardcoded identity found
15 places where the firm name, the agents' names or a neighborhood name were
typed into a page or component rather than read from config. All are lifted:

- `content/who-we-are.ts`, `content/why-use-us.ts` (whole pages of prose)
- `content/privacy.ts` (the entire policy, which had zero `siteConfig`
  references and named the wrong firm for any clone)
- `content/lare-report.ts` (one hero block that had been typed out three times
  across two files)
- `content/market-report.ts`, `content/meet-the-partners.ts`,
  `content/contact.ts` (page furniture and the TCPA consent sentence)
- seven page-metadata descriptions, the nav aria-label, the team-bio alt text
  and the past-transactions map attribution now interpolate `siteConfig`

**The one deliberate exception** is `SPEAKERS` in
`components/sections/MarketReport.tsx`. Those strings match speaker labels
embedded in commentary text written by the ingest Lambda, so they are DATA
matchers, not display copy. They now derive from `siteConfig` AND keep the known
Misraje literals as a fallback, because the Lambda's exact output could not be
verified from here and a wider match can only fail to bold a label, never
corrupt the prose.

Verified by simulating a clone: `siteConfig` was temporarily rewritten with a
different firm name and a different agent, the site rebuilt, and the legal page
came back naming the new firm and licensee with zero occurrences of the old
ones.

Corollary learned the hard way (2026-08-27): a **default value** in a shared
helper defeats this. `getPastTransactions()` defaulted to `site_key "misraje"`,
so this site served the firm's book while `siteConfig.siteKey` said
`"laurelwood"` and nothing at the call site revealed it. A clone would have
inherited the same silence. Site-specific values are now required arguments or
required `SiteConfig` fields, so the compiler forces each clone to decide.

## Design canon: misraje-site

The design language is inherited verbatim from misraje-site, which is the design
canon. Read its `STATE.md`, `app/layout.tsx`, `app/globals.css`,
`tailwind.config.ts` and `components/` when in doubt.

- Tokens: `navy` / `royal` / `gold` / `ink` palettes, editorial font scale,
  `wordmark` / `eyebrow` / `nav` letter-spacing.
- Fonts via `next/font`: **DM Sans** (`--font-display`), **Inter Tight**
  (`--font-sans`), **Cormorant Garamond** (`--font-serif`).
- `globals.css` utilities: `.eyebrow`, `.gold-rule`, `.gold-rule-dark`,
  `.editorial` (+ the `.editorial-prose` family).
- Band canon: `py-20 md:py-28`, navy/white alternation, eyebrow gold-600 on white
  and gold-500 on navy, DM Sans `font-display font-light` headings, prose in
  Inter Tight, serif PageHero titles.

## Content style: NO EM DASHES

No em dashes anywhere in site content. Rewrite with a comma, period or colon;
never substitute " - ". Numeric-range hyphens (K-5, 2021-2025) are fine.

**Status 2026-08-27: swept.** The rule had drifted to 33 occurrences across 15
files. 30 were rewritten (26 code comments, plus the East Laurelwood copy that
still carried an em dash verbatim from Wix). **Three remain, deliberately**, all
places where the em dash is a display glyph rather than prose: `DASH` in
`lib/market/format.ts` and the two commute placeholders in `CommuteWidget.tsx`.
Those are the "no data" character, which is what an em dash is for. A `grep -rn`
across `app/`, `components/`, `lib/`, `content/` should return exactly those
three.

---

## Inherited hard-won rules (from misraje-site)

- **Build passing is NOT the same as working.** `npm run build` succeeding only
  proves it compiles. Verify in a browser.
- **`next dev` reads config/env only at startup.** After changing `.env.local` or
  `next.config.mjs`, do a FULL restart, not a hot reload.
- **`NEXT_PUBLIC_*` is inlined at BUILD time.** Changing one requires a rebuild,
  not just a restart. A missing `NEXT_PUBLIC_TURNSTILE_SITE_KEY` bakes the
  contact form's fallback state into the static page.
- **Verify data claims with your own queries.** Do not assert a fact about the
  data (counts, license numbers, addresses) without checking it.
- **Commit AND push at milestones (two-machine workflow).** Work moves between a
  home machine and the office machine, so unpushed commits strand the other one.
  (An earlier version of this file said "commit-only, do NOT push" for the
  initial build. That no longer applies; push.)
- **Two Google Maps keys with different restrictions.**
  `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` is the in-browser Maps JS key
  (HTTP-referrer restricted). `GOOGLE_MAPS_API_KEY` is the server-side
  geocoding / Distance-Matrix / Directions key (API-restricted, NOT
  referrer-restricted). A referrer-locked browser key FAILS server-side. Never
  cross them.
- **A SHARED credential is not shared authorization.** The Turnstile keys are
  shared across the family, but a Turnstile sitekey carries an allowed-domains
  list in the Cloudflare dashboard. frymancanyonhomes.com hit
  `[Cloudflare Turnstile] Error: 110200` (domain not allowed) on 2026-08-27 for
  exactly this reason: new hostname, shared key, hostname never added to the
  widget. Symptoms are a 400 from challenges.cloudflare.com, a postMessage origin
  warning, an "Unable to connect to website" widget, and a permanently disabled
  submit button. Standing up a sibling on a new domain means adding that domain
  (apex AND www) to the Turnstile widget, and confirming the secret key is the
  pair for that same widget. Same family of trap as the two Maps keys above.
- **Vercel filesystem is case-sensitive. Lowercase all filenames.**
- `.env.local`: no spaces around `=`, UTF-8 no BOM. Backend (Supabase, Maps,
  Turnstile keys) is SHARED with misraje-site / realestategpa.
- **A stale server serves mismatched build hashes and the CSS 400s.** After
  `npm run build`, kill any old `next start` / `next dev` before reloading, or
  the page renders UNSTYLED (looks like narrow, non-full-width bands). Confirm
  `/_next/static/css/<hash>.css` returns 200.
- **Never build a Supabase client at module scope, and never assert its env with
  `!`.** Both fail `next build` when credentials are absent: collecting page data
  imports the module, `createClient` throws "supabaseUrl is required", and the
  whole build dies on a route that is never invoked during a build. Build the
  client lazily inside a function, validate the env, and let public read helpers
  fall back to their empty state. (Fixed 2026-08-27; see `lib/supabase/server.ts`.)

---

## The site today

23 routes. Everything below is reachable from the nav or footer, is in
`app/sitemap.ts` via `lib/routes.ts`, and returns 200.

| Route | Backed by |
| --- | --- |
| `/` | `content/home.ts` + commute widget + testimonials |
| `/west-laurelwood` | `content/west.ts` + `lib/photos.ts` |
| `/east-laurelwood` | `content/east.ts` + `lib/photos.ts` |
| `/dona-streets` | `content/dona.ts` |
| `/development-history` | `content/dev-history.ts`, `content/land-acquisition.ts`, `content/history-extra.ts` |
| `/report` | **Supabase** `laurelwood_listings` + `laurelwood_commentary` (West); chrome in `content/market-report.ts` |
| `/marketreport` | **Supabase**, same tables (East); chrome in `content/market-report.ts` |
| `/lare-report` + `/lare-report/[slug]` | **Supabase** `lare_reports`, read-only, hub-authored; chrome in `content/lare-report.ts` |
| `/homeowners` | `content/` markdown via `lib/content.ts` |
| `/homeowners/neighborhood-watch` | `content/neighborhood-watch.ts` |
| `/homeowners/community-news` | `content/source/community-news.md` (frozen snapshot, see Hub integration) |
| `/homeowners/emergency-contacts` | `content/emergency-contacts.ts` |
| `/who-we-are` | `content/who-we-are.ts` |
| `/why-use-us` | `content/why-use-us.ts` |
| `/meet-the-partners` + `/meet-the-partners/[slug]` | **Supabase** `team_directory`; chrome in `content/meet-the-partners.ts` |
| `/past-transactions` | **Supabase** `past_transaction` + `past_transaction_site` |
| `/buying`, `/selling` | `content/` |
| `/contact` | Turnstile + Supabase `contact` + Brevo notification; copy in `content/contact.ts` |
| `/accessibility` | `siteConfig.legal.accessibility`, verbatim |
| `/privacy` | `content/privacy.ts`, legal text verbatim, identity from `siteConfig` |

**API routes:** `/api/contact`, `/api/listings`, `/api/commute`,
`/api/commute-cities`, `/api/routes`, `/api/ingest/market`.

**Discovery surfaces** (all generated, none hand-maintained, as of 2026-08-27):
`app/sitemap.ts` and `app/llms.txt/route.ts` both read `lib/routes.ts`;
`app/robots.ts` disallows `/api/`. Adding a page means adding it to
`lib/routes.ts` and nothing else.

**Redirects** live in `next.config.mjs`: 24 rules, being 16 path rules (Wix-era
URLs plus the interim Next paths `/about`, `/what-we-do`, `/history/*`) and 8
vanity-domain host rules (westlaurelwood.com, laurelwoodwest.com,
eastlaurelwood.com, thedonastreets.com, each apex + www).
`content/redirect-map.md` is the human-readable record.

Order matters and is not uniform: the three `/history*` rules come first and fire
on every host, then the 8 host rules, then the 13 rules added 2026-08-27. Those
last 13 sit after the host block deliberately, so a vanity domain reaches its
canonical page in ONE hop instead of being rewritten on the vanity host first.
Anything added later belongs in that final block for the same reason.

**Supabase tables this repo touches:** `laurelwood_listings`,
`laurelwood_commentary`, `commentary_run_snapshot`, `commentary_instruction`,
`lare_reports`, `team_directory`, `past_transaction`, `past_transaction_site`,
`contact`, `assignment`, `commute_cities`, `commute_cache`, `route_cache`, and
the `resolve_brokerage_for_host` RPC.

---

## Hub integration: realestategpa.com

The hub is a separate repo (`Filocate2000/realestategpa`) and a separate Next
app. Both it and this site read the SAME Supabase project. Recon 2026-08-27.

**Wired and working:**

- **Brokerage resolution.** `lib/brokerage.ts` calls the
  `resolve_brokerage_for_host` RPC with the hardcoded hostname
  `laurelwoodestates.com`, which the hub's `brokerage_domain` table maps to
  brokerage `4796aec0-1843-4a30-80ba-871a994604b1`. The hostname is hardcoded and
  the brokerage id is not, deliberately: the 2026-07-10 ghost-brokerage incident
  was a hardcoded brokerage id pointing at a deleted row.
- **LARE Report.** Read-only, by `brokerage_id`, so this site inherits the whole
  Misraje archive with no per-site registration. No ingest, no service key here.
- **Market report.** A parallel, bespoke pipeline, NOT the hub's platform
  listings: an AWS Lambda posts to `/api/ingest/market` (shared-secret auth) into
  `laurelwood_listings` / `laurelwood_commentary`.
- **Comp-audit to assignment.** The `pace-comp-reviewer` Lambda posts
  `mode=comp_audit_concern` to the same ingest route, which creates a `review`
  row in `assignment`; the hub renders the queue. Proven end to end 2026-06-13.
- **Site registration.** The hub's `site` table carries a published `laurelwood`
  row (type `farm`), and `past_transaction_site.site_key` accepts `'laurelwood'`.

**Not wired:**

- **Blog.** Dead on both ends. The hub's newsletter composer hardcodes
  `AVAILABLE_SITES = [{ key: 'misraje' }]`, so no post can target Laurelwood even
  though the `blog_post_site.site_key` CHECK already allows it. This repo has no
  `/blog` route and no `lib/blog.ts`. The nav placeholder in
  `components/layout/Navigation.tsx` stays commented until both sides exist.
- **Farm-site listings.** `laurelwood` is registered as a `farm` site but its
  `farm_saved_search_id` is NULL, so the hub's MLS-scoped farm machinery is
  unattached. The market report runs on the bespoke path above instead.
- **Platform site-builder.** The hub's `site_page` / `site_section` tables
  (migration 04a) are unused here. This is a hand-built Next app, not a
  platform-rendered site.
- **`/homeowners/community-news`** is a frozen text snapshot from 2026-06-04, not
  a feed. It becomes real when the blog does.

**Degraded (from the hub's own `docs/INTEGRATIONS.md`, last verified there
2026-07-24, NOT re-verified from here):** the Google OAuth `integration_connection`
is in `status = 'error'` with `invalid_client`, which blocks Search Console
reporting for `sc-domain:laurelwoodestates.com`. The GSC property itself is
verified; the connection is not. Fix is a reconnect, not code.

---

## Blockers

- **No YouTube link for the home-page video.** `components/YouTubeEmbed.tsx` is
  built and wired into the Doña band, but renders only when `content/home.ts`
  sets `video` (currently `null`). To enable: set it to
  `{ id, title, subject: "history|neighborhood|general" }`.
- **Favicon is still the placeholder.** `app/icon.svg` is a gold serif "L" on
  navy. Replace with the real mark when one exists (lowercase filename).
- **`.env.local` `NEXT_PUBLIC_SITE_KEY` is believed to still say "misraje"**
  (cloned from misraje-site). Nothing reads it: `app/api/contact/route.ts`
  derives lead source from `siteConfig.domain`, so leads attribute correctly to
  laurelwoodestates.com. Cosmetic. Not verifiable from the repo.
- **Officer photo gap** on `/homeowners/neighborhood-watch`: a clearly-marked
  placeholder slot until the photo is supplied.

## Verification checklist

`npm run build` passing only proves it compiles. Walk this in a real browser
before any content-affecting deploy.

- [ ] **Every route in the table above renders** with its content and photos.
- [ ] **Commute widget loads with LIVE times.** Needs
      `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` (browser) +
      `GOOGLE_MAPS_API_KEY` (server, NOT referrer-locked) + Supabase
      `commute_cache` / `route_cache` / `commute_cities`. Origin is `laurelwood`
      (`lib/commute/origins.ts` + `cities.ts`), no longer `studio-city`.
- [ ] **Contact form submits end to end**: complete the Turnstile challenge,
      submit, see the success state, confirm a `contact` row lands in Supabase
      with `lead_source = laurelwoodestates.com`, and confirm the Brevo
      notification arrives. **A real Cloudflare round trip has never been
      verified from an agent session** (no outbound network); this one needs a
      human on a networked machine.
- [ ] **Both market reports show live data**, not the graceful empty shell.
- [ ] **LARE Report** shows the latest report plus a populated archive sidebar.
- [ ] **`/past-transactions`** shows the firm's book with a working city filter
      and map.
- [ ] **Mobile layout** on every page; no horizontal scroll.
- [ ] **Metadata / JSON-LD**: per-page title, description, canonical, OpenGraph;
      Organization (RealEstateAgent) JSON-LD site-wide; Place JSON-LD on the
      neighborhood pages; `sitemap.xml`, `robots.txt` and `llms.txt` all serve.

## Future work

- **Wire the blog.** This is the one recon item that cannot be finished from
  inside this repo, because the blocker is hub-side. Order matters:

  1. **Hub first** (`Filocate2000/realestategpa`, a different repo). In
     `app/(authenticated)/(main)/brokerage/marketing/newsletter/new/setup-fields.tsx`
     around line 118, `AVAILABLE_SITES` is `[{ key: 'misraje', label: 'misraje' }]`
     with a comment saying laurelwood and fryman are "reserved but not yet live".
     Adding `{ key: 'laurelwood', label: 'laurelwood' }` is the whole change on
     that side: migration 036 already permits the value
     (`blog_post_site.site_key CHECK IN ('misraje','laurelwood','fryman')`), the
     `site` table already carries a published `laurelwood` row, and
     `newsletter/[id]/actions.ts` validates against the same key set. Verify the
     composer's Blog Distribution section then offers Laurelwood, and publish one
     post to it.
  2. **Then here.** Build `lib/blog.ts` mirroring `lib/lare.ts` (same anon read,
     same `resolveBrokerageId`, but joined through `blog_post_site` filtered on
     `siteConfig.siteKey`), then `/blog` + `/blog/[slug]` mirroring the LARE
     pages, with chrome in `content/blog.ts`.
  3. **Then wire it up.** Add `/blog` to `lib/routes.ts` (sitemap and llms.txt
     both follow automatically), uncomment the nav placeholder in
     `components/layout/Navigation.tsx`, add a Market-column footer link, and add
     the `/blog/categories/neighborhood-news` redirect that
     `content/redirect-map.md` currently lists as deliberately absent.

  Deliberately NOT built ahead of step 1: an unreachable `/blog` would either
  ship an empty page to visitors or sit as dead unlinked code, and neither is
  worth carrying until the hub can actually publish to it.
- **Confirm the `team_directory` slugs** (`select slug from team_directory;`).
  Not blocking anything: `/karen-misraje` and `/jack-misraje` now deep-link to
  `/meet-the-partners/<siteConfig agent slug>`, and the bio route redirects a
  slug that names a configured agent but has no directory row to the index
  instead of 404ing, so the link is right when the convention holds and harmless
  when it does not. Confirming just removes the second hop.
- **Decide whether a Laurelwood-tagged transaction subset should exist.** The hub
  followups record 228 `past_transaction` rows against 684
  `past_transaction_site` rows, exactly 3x, which suggests every transaction is
  already tagged to all three sites. Unverified. If true, switching
  `siteConfig.pastTransactionsSiteKey` to `"laurelwood"` is a one-line change
  whenever a curated list is wanted.
- **Reconnect Google** to restore Search Console reporting (see Hub integration).
- **Move `/api/ingest/market` to `resolveBrokerageId`.** It still uses an
  env-driven `MISRAJE_BROKERAGE_ID` with a hardcoded fallback. The value is
  currently correct; the pattern is the one that caused the ghost-brokerage
  incident. The hub's phase-3 handoff tracks this as a deliberate deferral.
- **Team portraits exist now** (`public/images/team/{jack,karen}-portrait.jpg`),
  so the nav drawer could carry photo cards instead of text-only agent cards.
- **Em-dash cleanup**: 33 occurrences, see Content style above.
- **Spawn frymanestates.com** from this template: clone, replace
  `lib/site-config.ts`, `content/`, `source-photos/`. Note that
  `pastTransactionsSiteKey` and the `getPastTransactions` argument are now
  required, so the clone must make those choices explicitly.

---

# Build history

Everything below is a dated record of past passes. It is **history, not current
state**: where it disagrees with the sections above, the sections above win.
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

---

## West Laurelwood completed: recovered history sections (2026-06-04)

`content/source/west-laurelwood-missing-sections.md` (recovered from the actual
Wix page HTML) was merged into `/west-laurelwood` via `content/west.ts`. Final
band order (full-width alternating navy/white, `.editorial max-w-4xl` inner):

1. Hero  2. The birth of West Laurelwood (white)  3. From the Archive: Selling
Laurelwood 1958-1966 (navy)  4. How It Began / Breaking ground (white)  5. The
growth of East and West Laurelwood (navy, NEW, prose only)  6. On the Big Screen
/ Disorderly Orderly video (white)  7. The defeat of the Laurel Canyon Freeway
(navy, NEW)  8. Preservation and Wilacre Park (white)  9. The Fryman Road
extension (navy, NEW)  10. Cultural Legacy in Street Names / Doña sign (white)
11. West Laurelwood Today (navy)  12. Contact CTA (white).

- **Billboard caption upgraded** (lib/photos.ts `gateway-homes-billboard`) to the
  real one: Henry L. Gatz / Joe Staller, Studio City, November 27, 1960.
- **Freeway artifacts moved to West (primary placement):** the Feb 6 1970 study
  map (framed document, click-to-full-size, caption "...Study zone map, March
  1969.") plus the CA-170 / CA-90 shields as small inline accents, all in the
  1971 Freeway Defeat band. Their manifest `page` is now `west-laurelwood`.
- **/history/development** keeps the freeway prose but the framed map + shields
  are gone; it now links to /west-laurelwood ("See the study map and the full
  story on West Laurelwood"). So West owns the primary placement, history links.
- Growth band is prose only; the kids/bus photos stay on /east-laurelwood.

---

WEST LAURELWOOD COMPLETE.

---

## Editorial float layout on West + East (2026-06-04)

Replaced the grid/flex figure layout on /west-laurelwood and /east-laurelwood
with true CSS text-wrap. New `components/FloatFigure.tsx`: on md+ the figure
floats (float-left/float-right, width 30-44%, ~2rem gap on the text side) INSIDE
the prose flow so paragraphs wrap around it; below md the float collapses to a
centered full-width block with the caption below. Each floated section ends with
`clear-both` so floats never bleed into the next band. Archive ad plates use
fit="hug" (w-fit cream mat that shrink-wraps the image, the tall narrow
Laurelwood Realty ad capped at md:max-w-[190px]). Text-only sections cap at
max-w-3xl; sections with a figure use max-w-4xl. Verified in a headless browser
at desktop (wrap works) and mobile (floats collapse). No wording changed.

Float sides (alternating for balance):
- West: archive Cannell mother-in-law (left) + Laurelwood Realty ad (right) +
  Cannell sensations (right); origins billboard (left) + Plan 4B/4C (right) +
  Tract map (left, links to full size); On the Big Screen video (right);
  1971 Freeway study map (left) with CA-170/CA-90 shields as ~100px accents
  under its caption (no plate); Doña sign stays a full-width banner.
- East: growth kids photo (right) + school-bus photo (left); Real Estate Ads
  Bel-Air ad (right).

---

## Float layout v2: one-float-at-a-time (2026-06-04)

Fixed the disjointed archive/grid look on /west-laurelwood and /east-laurelwood.
`components/FloatFigure.tsx` is now the cream plate itself (w-fit, p-3, caption
inside, muted italic on the mat). Strict rules applied at every editorial
section: each paragraph is one intact <p> (never split to sit beside an image),
only ONE float active at a time, a new float only after the previous is cleared
by text or <div className="clear-both" />, every section has overflow-hidden and
ends with clear-both. Sections with several images and little text float ONE
beside the prose and put the rest in a single centered row
(flex flex-wrap justify-center items-start) of w-fit plates, the only place flex
is allowed. No grid anywhere. Tall narrow ads float ~28-30%, wide ~40-44%.
Below md, floats collapse to centered blocks. Verified in a headless browser at
desktop and mobile; no wording changed.
