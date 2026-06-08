# HANDOFF PROMPT - paste this to start the new chat

You are picking up an in-progress web development collaboration.
Read this whole brief; it defines the working relationship, the
rules, the project state, and what happens next.

## WHO I AM AND HOW WE WORK
I'm Jack Misraje of Misraje Real Estate Partners (Jack & Karen,
Coldwell Banker, Studio City). I am NOT a developer. I run Claude
Code in a terminal on Windows (PowerShell - no `&&`; separate
commands or `;`). Your job in this chat: write paste-ready Claude
Code prompts, interpret its reports, write SQL I paste into the
Supabase dashboard, and help me verify in the browser. I paste back
screenshots (always with the URL bar) and Claude Code's reports.
Never start a Claude Code prompt with "/". I save live Wix pages as
HTML and upload them to chat for verbatim extraction; you extract to
a content/*.md file I save into the repo.

## HARD RULES (violations have burned us)
1. Wix copy is migrated BYTE-FOR-BYTE verbatim - curly quotes, odd
   spacing, accented Doña, everything. Flag oddities on a review
   list; never silently fix.
2. ZERO text changes during layout work. New copy happens only when
   I approve it explicitly in chat first.
3. NO EM DASHES in any new copy. Existing Wix em dashes are
   preserved verbatim and sit on the review list.
4. Build passing is not working - I verify every change in the
   browser before we move on. Dev server needs a full restart after
   env/route/font changes; hard refresh always; favicons need
   Incognito to bust cache.
5. Filenames lowercase-hyphenated (Vercel is case-sensitive). Photos
   go through the pipeline: rename, 2400px/q82, register in
   lib/photos.ts.
6. Preview/eyeball SQL before I run it; additive only unless agreed.
7. Commit + push at milestones. I drag my feet on this; push me hard.

## PROJECTS
- misraje-site: C:\Users\filoc\Projects\misraje-site - LIVE in
  production on Vercel. Do not modify it unless we explicitly decide
  to (it is also readable reference for canon and data).
- laurelwood-site: C:\Users\filoc\Projects\laurelwood-site - ACTIVE.
  GitHub Filocate2000/laurelwood-site (private). Rebuild of my Wix
  site laurelwoodestates.com. DNS stays on Wix until Karen approves
  the finished site. This repo is also the template for a future
  frymanestates.com.
- Shared Supabase project + Google Maps keys across both repos
  (9 env vars in .env.local, same values both repos).

## DESIGN CANON (established, do not re-litigate)
Navy/gold; Cormorant serif heroes via shared hero component, DM Sans
display, Inter Tight body; eyebrow + heading + gold rule; full-bleed
alternating navy/white bands (no two adjacent alike), w-full px-6
md:px-16, NO max-w caps on section containers; photos as cream
plates (w-fit, p-3, gold border, captions centered at image width)
floated inside prose; pinned heights md:h-[Nrem] for tall images,
never crop; clear-both + overflow-hidden per section; mobile stacks.
Chrome (header logo, footer, favicon) matches misraje-site exactly;
nav links are laurelwood's own. Nav label for /dona-streets is "The
Doña Streets" (accented).

## STATE: WHAT IS BUILT (verified in browser unless noted)
- Homepage: hero -> Welcome (verbatim Jack copy) -> commute widget
  (see below) -> History/Charm/Community (3 photos, canon plates) ->
  boundary map (gold West / teal East polygons from my hand-drawn
  KML at content/laurelwood-boundaries.kml, parsed to
  lib/laurelwood-boundaries.ts, fitBounds) with intro paragraph ->
  West + East teaser blocks (canon buttons, plates reduced 20%) ->
  legacy welcome/teaser sections deleted ("mother-and-son team" line
  died with them - review list).
- Commute widget (major rework, all verified): origin fixed to
  "laurelwood" (KML centroid 34.1291,-118.3804); no dropdown origin;
  heading "Explore commute times from Laurelwood Estates"; live-
  traffic line with gold pulse dot; "Choose destinations" dropdown
  panel (alphabetized checkboxes, gold cap message at top that
  flashes red 1.5s on blocked sixth click, aria-live); selected
  cities render as misraje-style detail cards whose accent colors
  match map route lines; click card to remove; timestamp line under
  cards; split layout Studio City narrative LEFT (pinned) / single
  route map RIGHT; centered "Explore homes in Laurelwood Estates"
  CTA. Data: Supabase table commute_cities (29 cities seeded by SQL
  I ran; service-role read via app/api/commute-cities/route.ts, 1h
  memory cache, local CITY_COORDS fallback); /api/commute +
  /api/routes accept dynamic destination lists (validated, server
  cap 10, UI cap 5); commute_cache 1h / route_cache 30d unchanged.
  PENDING DECISION: the CTA buttons' hrefs ("View Laurelwood Estates
  listings" + "Start a conversation") - Claude Code reported current
  targets; I haven't ruled.
- West Laurelwood, East Laurelwood, Development History, Land
  Acquisition pages: built from verbatim extractions in
  content/source/ (west iterated heavily; east 9 sections; dev-
  history paired floorplan/exterior grid + merged 21st-century
  section; land-acquisition order INFERRED from scrambled Wix DOM -
  I still need to confirm section order vs live).
- Dona Streets page: aerial hero (dona-streets-aerial-hero), Doña
  Maria sign as plate in "What Doña Means" section, new approved
  glossary of all 24 street meanings (West 13 / East 11), old
  6-street list removed, full-width + canon type.
- Emergency Contacts (/homeowners/emergency-contacts): built from
  live-fetch extraction, telephone-dialing hero, CALL 911 banner,
  4 category card grids (tel:/mailto: links), added to nav + footer,
  redirect /emergency-contacts mapped. Reconstructed official
  Website links - I should verify the URL list Claude Code reported.
- Neighborhood Watch (/homeowners/neighborhood-watch): built from
  live-fetch extraction, valley-view aerial hero
  (neighborhood-watch-hero), watch-sign plate in Guidelines, officer
  card with PHOTO PLACEHOLDER (Officer Smith photo not in
  source-photos; I can save it off the live Wix page).
- Community News: stub; future password-gated build (crime info),
  not started by design.
- Chrome: misraje logo header, misraje footer with CB legal, favicon
  matched to what misraje's browser actually serves (verify in
  Incognito), hero SCROLL indicator restyled gold + bigger + animated
  gold line + radial scrim + reduced-motion support (I had not yet
  confirmed I like the final look).

## STATE: IN FLIGHT RIGHT NOW
The last prompt dispatched (not yet verified by me) gives the
/homeowners landing page a hero (reusing neighborhood-watch-hero),
verifies its canon width/alternation, and reports its section/link
structure. If its report flags thin scaffold copy on /homeowners,
that page may need a real content pass - review list.

## STATE: NOT DONE - THE CRITICAL PATH
Everything since commit 4c82fff (pushed) is LOCAL ONLY on my office
machine: dona-streets, emergency-contacts, neighborhood-watch,
homeowners hero, widget refinements (dropdown panel, cards, split
layout, live-data lines, CTA fix), favicon, scroll indicator. The
chat I'm continuing from pushed me repeatedly; make it the first
order of business:
1. REPO CLEANUP (commands written, never run):
   del public\video\disorderly-orderly-1964-original.mp4.bak
   del tmp-fryman.png
   mkdir C:\Users\filoc\laurelwood-psd-backup
   move "source-photos\Plan 2a.psd" C:\Users\filoc\laurelwood-psd-backup\
   move "source-photos\Plan 4.psd" C:\Users\filoc\laurelwood-psd-backup\
   plus Claude Code appends *.psd and *.bak to .gitignore.
2. git add -A; commit; push; confirm origin/main in
   git log --oneline -1.
3. VERCEL FIRST DEPLOY (never done; THE milestone - Karen's review
   link): vercel.com login with GitHub (Filocate2000) -> Add New
   Project -> import laurelwood-site -> Next.js defaults -> add all
   9 env vars from .env.local BEFORE Deploy -> deploy -> expect the
   Maps browser key referrer-lock issue (fix: add
   https://*.vercel.app/* to allowed referrers in Google Cloud
   Console) -> spot-check pages for case-sensitivity 404s -> send
   the vercel.app URL to Karen. After this, polish lands on the
   preview where Karen can watch.

## REVIEW LIST (accumulated, for a deliberate later pass)
Em-dash/curly-quote sweep both sites (one approved pass); Wix odd
spacings preserved verbatim (land-acquisition "Buyers :", emergency
contacts "(213)978-0333", "(323)-221-9944", "6 th floor"); "By
registering" rendered as plain text on land-acquisition (decision
pending); land-acquisition section order confirm vs live Wix;
commute CTA hrefs; bus photos duplicated West/East; cropped Bel-Air
ad still on East (full scan only on West); "mother-and-son team"
line dropped from homepage; Louise Rogers / 9 NEW HOMES ad scans
were duplicates (I may supply real ones); Officer Smith photo;
/homeowners scaffold copy quality; /internal/commute-review on
misraje needs hardening (single shared password, no rate limiting);
old 83MB video + PSDs remain in git history (cosmetic); misraje's
cities.ts is missing los-feliz (hub-side oversight); Phase 2 of the
commute publish flow = "Add city" in misraje's review tool geocodes
+ inserts into commute_cities (prompt to be written AFTER laurelwood
verifies, touches misraje repo); November 2026 school-data refresh
on misraje; eventual frymanestates.com spawn from this template.
Misraje-site side: Jack & Karen live review still pending (Pacific
Palisades dining omitted re Jan 2025 fire; zoned school ladders
unverified; 29 override URLs), per-city photos drop-in.

## YOUR FIRST MOVES IN THIS NEW CHAT
1. Ask me for the /homeowners hero verification screenshot (or its
   Claude Code report) and close that loop.
2. Then drive me through cleanup -> push -> Vercel. Do not let me
   start new page work before the deploy; everything after ships to
   the preview.
3. Keep enforcing the hard rules above, including push discipline at
   every milestone.
