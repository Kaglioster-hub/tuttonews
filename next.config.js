/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      { source: "/tutte", destination: "/?cat=tutte", permanent: false },
      { source: "/cronaca", destination: "/?cat=cronaca", permanent: false },
      { source: "/politica", destination: "/?cat=politica", permanent: false },
      { source: "/economia", destination: "/?cat=economia", permanent: false },
      { source: "/sport", destination: "/?cat=sport", permanent: false },
      { source: "/esteri", destination: "/?cat=esteri", permanent: false },
      { source: "/cultura", destination: "/?cat=cultura", permanent: false },
      { source: "/tecnologia", destination: "/?cat=tecnologia", permanent: false },
    ];
  },
};

module.exports = nextConfig;
