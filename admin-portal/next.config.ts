import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable server-side rendering for certain dependencies
  experimental: {
    serverComponentsExternalPackages: ["dotenv"],
  },
  // Environment variables configuration
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  },
  // Webpack configuration to handle certain node modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `node:` protocol (not available in browser)
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        dgram: false,
        module: false,
      };
    }
    return config;
  },
  // Disable type checking during build for now
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
