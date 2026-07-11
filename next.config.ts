import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray pnpm-lock.yaml in the home
  // directory otherwise makes Next infer the wrong root and warn on startup.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
