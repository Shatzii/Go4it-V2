/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { 
    serverActions: { 
      allowedOrigins: ['localhost:5000', '*.replit.app', '*.replit.dev'] 
    } 
  },
  env: { 
    PORT: '5000', 
    HOSTNAME: '0.0.0.0' 
  },
  // Simplified config for development
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  trailingSlash: false,
};

module.exports = nextConfig;