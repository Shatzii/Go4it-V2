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
  // Replit configuration
  trailingSlash: false,
  
  // Fix cross-origin issues for Replit
  allowedDevOrigins: ['7fd1735e-ab9f-42d2-b097-a1492a69af8c-00-206a96lwblvdm.kirk.replit.dev', 'localhost:5000', '*.replit.dev', '*.replit.app'],
  
  // Configure for development
  env: { 
    PORT: '5000', 
    HOSTNAME: '0.0.0.0' 
  }
};

module.exports = nextConfig;