/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/moneyez-bank-web",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },

      {
        protocol: "https",
        hostname: "freesvg.org",
      },

      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
