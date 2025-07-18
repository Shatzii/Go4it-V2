/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential Replit-specific configuration
  images: {
    unoptimized: true,
    domains: ['localhost', '*.replit.dev', '*.replit.app']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  
  // Critical: Add allowedDevOrigins for cross-origin requests
  allowedDevOrigins: [
    '7fd1735e-ab9f-42d2-b097-a1492a69af8c-00-206a96lwblvdm.kirk.replit.dev',
    '*.replit.dev',
    '*.replit.app'
  ],
  
  // Enable experimental features needed for Replit
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:5000', '*.replit.app', '*.replit.dev']
    }
  },
  
  // Basic configuration
  trailingSlash: false,
  poweredByHeader: false,
  
  // Environment variables
  env: {
    PORT: '5000',
    HOSTNAME: '0.0.0.0'
  }
};

module.exports = nextConfig;