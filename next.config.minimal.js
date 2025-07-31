/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential production settings only
  output: 'standalone',
  
  // Basic image config 
  images: { 
    unoptimized: true,
  },
  
  // Error handling for deployment
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: { 
    ignoreBuildErrors: true 
  },
  
  // Environment variables
  env: { 
    PORT: process.env.PORT || '5000',
    HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
  },
};

module.exports = nextConfig;