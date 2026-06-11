import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rakibur5005.binarybards.online",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.magnific.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5010",
        pathname: "/**",
      },
      // Add your specific uploads pattern
      {
        protocol: "http",
        hostname: "10.10.7.39",
        port: "5005",
        pathname: "/**",  // This specifically allows uploads folder
      },
    ],
  },
};

export default nextConfig;