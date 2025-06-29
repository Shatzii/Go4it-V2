/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: false,
  // Force port configuration for Replit compatibility
  env: {
    PORT: '5000',
    HOSTNAME: '0.0.0.0',
  },
  // Configure server for Replit
  serverRuntimeConfig: {
    port: 5000,
    hostname: '0.0.0.0'
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  },
  // Custom server configuration
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      // Development server configuration
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

module.exports = nextConfig