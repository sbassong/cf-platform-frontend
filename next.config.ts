import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  crossOrigin: "anonymous",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "googleusercontent.com",
        port: "",
        pathname: "/image_generation_content/**",
      },
    ],
  },
};

export default nextConfig;
