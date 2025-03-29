import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'encrypted-tbn0.gstatic.com'
    ],
  },
};

export default nextConfig;
