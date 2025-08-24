import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV !== "production" ? false : true,
    remotePatterns: [
      {
        // Keeping the existing one in case you need it.
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "h8gocc0ogkwg044so08wow8c.91.99.109.140.sslip.io",
      },
      {
        protocol: "https",
        hostname: "auth.birdsatfive.ai",
      },
      {
        protocol: "https",
        hostname: "personas-api.birdsatfive.ai",
      },
      {
        protocol: "https",
        hostname: "hempelv2.birdsatfive.ai",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;

