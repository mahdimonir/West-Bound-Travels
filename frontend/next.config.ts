import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "logos-world.net" },
      { protocol: "https", hostname: "securepay.sslcommerz.com" },
    ],
  },
};

export default nextConfig;