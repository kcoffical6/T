/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add path aliases to webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@/src": path.resolve(__dirname, "src"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/lib": path.resolve(__dirname, "src/lib"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/config": path.resolve(__dirname, "src/config"),
      "@/middleware": path.resolve(__dirname, "src/middleware"),
      "@/controllers": path.resolve(__dirname, "src/controllers"),
    };
    return config;
  },
  output: "standalone",
  images: {
    domains: ["localhost"],
  },
  env: {
    MONGODB_URI:
      process.env.MONGODB_URI || "mongodb://xyz-mongodb:27017/xyz-tours",
    JWT_SECRET: process.env.JWT_SECRET || "your-jwt-secret",
    JWT_REFRESH_SECRET:
      process.env.JWT_REFRESH_SECRET || "your-jwt-refresh-secret",
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PORT: process.env.REDIS_PORT || "6379",
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
  },
};

module.exports = nextConfig;
