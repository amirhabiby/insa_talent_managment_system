// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // It's recommended to use 'remotePatterns' for Next.js 13+ with App Router
    // instead of 'domains' for more flexibility and future compatibility.
    // 'domains' is still supported for simple cases but 'remotePatterns' is preferred.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "**", // Allow any path for Cloudinary
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "**", // Allow any path for Pexels
      },
      {
        protocol: "https", // Assuming your example.com images are served over HTTPS
        hostname: "example.com", // ADDED: The hostname from your error message
        port: "",
        pathname: "**", // Allow any path for example.com, or specify if narrower
      },
      // If you also have images served over HTTP from these domains,
      // you might need to add another pattern with protocol: 'http'
    ],
  },
};

export default nextConfig;
