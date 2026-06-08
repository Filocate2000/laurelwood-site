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
  // The old /history tree was blended into /development-history. 308-redirect the
  // retired routes to the live page so links/bookmarks/crawlers consolidate.
  async redirects() {
    return [
      { source: "/history", destination: "/development-history", permanent: true },
      { source: "/history/development", destination: "/development-history", permanent: true },
      { source: "/history/land-acquisition", destination: "/development-history", permanent: true },
    ];
  },
};
export default nextConfig;
