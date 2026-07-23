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
    ];
  },
};
export default nextConfig;
