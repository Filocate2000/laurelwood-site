# Redirect Map (old URLs to current paths)

Every redirect below is **implemented in `next.config.mjs`** and verified against
a production build. This file is the human-readable record; `next.config.mjs` is
the source of truth. If they disagree, the config wins and this file is stale.

History: this map was written during the Phase 1 Wix content inventory and then
sat unimplemented. A 2026-08-27 audit found every path-level redirect below
returning a 404 on the live site, and several of the destinations recorded here
pointing at pages that had since been deleted (`/about`, `/what-we-do`,
`/history/development`, `/history/land-acquisition`). Both problems are fixed:
the rules exist, and the destinations below are the pages that actually serve.

All paths are on https://www.laurelwoodestates.com.

## Page redirects (308 permanent)

| Old URL | Current path | Notes |
| --- | --- | --- |
| `/contact-us` | `/contact` | Wix, renamed |
| `/buying-in-laurelwood` | `/buying` | Wix, renamed |
| `/selling-in-laurelwood` | `/selling` | Wix, renamed |
| `/neighborhood-watch` | `/homeowners/neighborhood-watch` | Wix, grouped under /homeowners |
| `/community-news` | `/homeowners/community-news` | Wix, grouped under /homeowners |
| `/emergency-contacts` | `/homeowners/emergency-contacts` | Wix, grouped under /homeowners |
| `/land-aquisition-history-item` | `/development-history` | Wix URL really is misspelled "aquisition"; the rule matches it verbatim. Folded into the development-history page |
| `/los-angeles-real-estate-report` | `/lare-report` | Wix. The LARE Report is live, hub-distributed from realestategpa.com |
| `/misraje-partners` | `/meet-the-partners` | Wix "Who We Are" bios page |
| `/karen-misraje` | `/meet-the-partners/karen` | See "Per-agent bios" below |
| `/jack-misraje` | `/meet-the-partners/jack` | See "Per-agent bios" below |
| `/about` | `/meet-the-partners` | Interim Next route, git-renamed in 006b6cc |
| `/what-we-do` | `/why-use-us` | Wix page AND an interim Next route; git-renamed in 006b6cc |
| `/history` | `/development-history` | Interim Next route |
| `/history/development` | `/development-history` | Interim Next route |
| `/history/land-acquisition` | `/development-history` | Interim Next route |

### Per-agent bios

`/karen-misraje` and `/jack-misraje` deep-link to
`/meet-the-partners/<siteConfig.agents[].slug>`, i.e. `/karen` and `/jack`.

Those target slugs are a calculated guess. `team_directory.slug` is typed by hand
in the hub admin and validated only as `[a-z0-9-]+`, so nothing guarantees it
matches `siteConfig.agents[].slug`, even though migration 031 documents
"karen, jack" as the intended convention.

The guess is made safe in `app/meet-the-partners/[slug]/page.tsx`: a slug that
names a CONFIGURED agent but has no directory row redirects to the index rather
than 404ing. So the link lands on the real bio when the convention holds, and on
the index (exactly where it used to land) when it does not. Any other unknown
slug still 404s, deliberately, because redirecting every typo to the index is a
soft-404 pattern search engines penalise.

Both branches are verified against a stub directory. Confirming the real slugs
(`select slug from team_directory;`) would remove the second hop in the
convention-broken case, but nothing is broken without it.

The slugs in `next.config.mjs` MUST stay in step with `siteConfig.agents[].slug`;
they are repeated there because `next.config.mjs` cannot import the TypeScript
config.

## Unchanged paths (no redirect needed)

`/`, `/west-laurelwood`, `/east-laurelwood`, `/development-history`, `/report`,
`/marketreport`.

Note on the last two: an earlier version of this map proposed redirecting
`/report` to `/buying` and `/marketreport` to `/selling`. That is obsolete. Both
are now live pages carrying the West and East Laurelwood market overviews, so
the Wix URLs keep working as themselves.

## Deliberately NOT redirected

| Old URL | Why |
| --- | --- |
| `/register` | Register/login decision deferred; no destination exists |
| `/blog/categories/neighborhood-news` | The blog is not built on this site yet. Redirecting into a 404 is worse than letting the 404 be honest. Add a rule when `/blog` ships |

## Domain-level redirects

Implemented in `next.config.mjs` via a `has: [{ type: "host" }]` condition, so
each fires only for its own hostname (apex and www) and matches every path.

| Old domain | Current path |
| --- | --- |
| `westlaurelwood.com` | `/west-laurelwood` |
| `laurelwoodwest.com` | `/west-laurelwood` |
| `eastlaurelwood.com` | `/east-laurelwood` |
| `thedonastreets.com` | `/dona-streets` |

These rules are ordered **before** the page redirects above, so a request to a
vanity domain reaches its canonical page in one hop instead of being rewritten
on the vanity host first and redirected again.
