import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow phone testing through Cloudflare quick tunnels in dev
     (Next blocks cross-origin dev assets by default) */
  allowedDevOrigins: ["*.trycloudflare.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jzbnauhdemknufmryjls.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
