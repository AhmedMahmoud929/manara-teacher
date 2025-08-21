// @type {import('next').NextConfig}
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.waraqah-store.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "t4.ftcdn.net" },
    ],
  },
};

module.exports = nextConfig;
