/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  trailingSlash: false,
  poweredByHeader: false,
  
  // Fix cross-origin issues for Replit
  allowedDevOrigins: [
    '7fd1735e-ab9f-42d2-b097-a1492a69af8c-00-206a96lwblvdm.kirk.replit.dev',
    '127.0.0.1',
    'localhost'
  ],
  
  // Minimal configuration for Replit
  env: { 
    PORT: '5000', 
    HOSTNAME: '0.0.0.0' 
  },
  
  // Static asset optimization
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Remove complex webpack config
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;