import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Certificate dashboard needs API routes + file uploads, so this app
  // runs as a Node server (`npm run build && npm start`), not static export.
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  trailingSlash: true,
};

export default nextConfig;
