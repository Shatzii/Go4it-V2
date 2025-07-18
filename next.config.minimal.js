/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  trailingSlash: false,
  poweredByHeader: false,
  
  // Minimal configuration for Replit
  env: { 
    PORT: '5000', 
    HOSTNAME: '0.0.0.0' 
  },
  
  // Remove complex webpack config
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;