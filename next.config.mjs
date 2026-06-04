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
};
export default nextConfig;
