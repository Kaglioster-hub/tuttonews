/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      { source: "/cronaca", destination: "/?cat=cronaca", permanent: true },
      { source: "/politica", destination: "/?cat=politica", permanent: true },
      { source: "/economia", destination: "/?cat=economia", permanent: true },
      { source: "/sport", destination: "/?cat=sport", permanent: true },
      { source: "/esteri", destination: "/?cat=esteri", permanent: true },
      { source: "/cultura", destination: "/?cat=cultura", permanent: true },
      { source: "/tecnologia", destination: "/?cat=tecnologia", permanent: true },
    ];
  },
};
