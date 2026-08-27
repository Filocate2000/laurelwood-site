/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    qualities: [82, 85],
  },
  experimental: {
    // Disable Next's dev-tools "Segment Explorer". In 15.5.x it injects a
    // <SegmentViewNode> client component that fails to resolve in the RSC
    // client manifest, surfacing as "Cannot read properties of undefined
    // (reading 'call')" on dev pages. (Inherited from misraje-site.)
    devtoolSegmentExplorer: false,
  },
  async redirects() {
    return [
      // The old /history tree was blended into /development-history. 308-redirect
      // the retired routes to the live page so links/bookmarks/crawlers
      // consolidate. (Apply on every host, including the canonical domain.)
      { source: "/history", destination: "/development-history", permanent: true },
      { source: "/history/development", destination: "/development-history", permanent: true },
      { source: "/history/land-acquisition", destination: "/development-history", permanent: true },

      // Vanity-domain redirects. Each fires ONLY when the request arrives with
      // one of the listed hosts (apex + www), via the `has` host condition, and
      // matches every path ("/:path*") so any URL on the vanity domain lands on
      // the matching canonical page. The host `value` is the exact hostname, so
      // requests to laurelwoodestates.com / www.laurelwoodestates.com / the
      // *.vercel.app domain never match these rules.
      {
        source: "/:path*",
        has: [{ type: "host", value: "westlaurelwood.com" }],
        destination: "https://www.laurelwoodestates.com/west-laurelwood",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.westlaurelwood.com" }],
        destination: "https://www.laurelwoodestates.com/west-laurelwood",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "eastlaurelwood.com" }],
        destination: "https://www.laurelwoodestates.com/east-laurelwood",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.eastlaurelwood.com" }],
        destination: "https://www.laurelwoodestates.com/east-laurelwood",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "thedonastreets.com" }],
        destination: "https://www.laurelwoodestates.com/dona-streets",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.thedonastreets.com" }],
        destination: "https://www.laurelwoodestates.com/dona-streets",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "laurelwoodwest.com" }],
        destination: "https://www.laurelwoodestates.com/west-laurelwood",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.laurelwoodwest.com" }],
        destination: "https://www.laurelwoodestates.com/west-laurelwood",
        permanent: true,
      },

      // Wix-era paths, 308'd to their current homes. content/redirect-map.md
      // recorded this mapping during the Phase 1 content inventory but it was
      // never implemented anywhere: as of the 2026-08-27 audit every URL below
      // returned a 404 on the live site, so the inbound links and search equity
      // built up on the old Wix site were being thrown away.
      //
      // These sit AFTER the vanity-domain block on purpose. Those rules match
      // "/:path*" on their own hosts, so a vanity host short-circuits to its
      // canonical page in ONE hop; putting these first would send, say,
      // westlaurelwood.com/contact-us to westlaurelwood.com/contact and only
      // then on to the canonical domain.
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/buying-in-laurelwood", destination: "/buying", permanent: true },
      { source: "/selling-in-laurelwood", destination: "/selling", permanent: true },
      { source: "/neighborhood-watch", destination: "/homeowners/neighborhood-watch", permanent: true },
      { source: "/community-news", destination: "/homeowners/community-news", permanent: true },
      { source: "/emergency-contacts", destination: "/homeowners/emergency-contacts", permanent: true },
      // The Wix URL really was misspelled "aquisition". Kept verbatim so the
      // rule matches the URL that exists in the wild.
      { source: "/land-aquisition-history-item", destination: "/development-history", permanent: true },
      { source: "/los-angeles-real-estate-report", destination: "/lare-report", permanent: true },

      // The firm pages. /about and /what-we-do were interim Next routes, git-
      // renamed away in 006b6cc (app/about -> app/meet-the-partners,
      // app/what-we-do -> app/why-use-us), which is where these destinations
      // come from. /misraje-partners is the Wix original of the same page.
      { source: "/about", destination: "/meet-the-partners", permanent: true },
      { source: "/what-we-do", destination: "/why-use-us", permanent: true },
      { source: "/misraje-partners", destination: "/meet-the-partners", permanent: true },
      // The per-agent Wix bios point at the index rather than deep-linking to
      // /meet-the-partners/<slug>: those slugs live in the team_directory table
      // and could not be verified from here, and a redirect into a 404 is worse
      // than one extra click. Deep-link these once the slugs are confirmed.
      { source: "/karen-misraje", destination: "/meet-the-partners", permanent: true },
      { source: "/jack-misraje", destination: "/meet-the-partners", permanent: true },

      // NOT redirected on purpose:
      //   /register .......... decision deferred, no destination exists
      //   /blog/... .......... the blog is not built yet; redirecting into a
      //                        404 is worse than letting the 404 be honest
    ];
  },
};
export default nextConfig;
