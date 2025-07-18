/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  
  // Essential for Replit deployment
  trailingSlash: false,
  poweredByHeader: false,
  
  // Fix static asset serving - remove assetPrefix for development
  assetPrefix: '',
  
  // Cross-origin configuration for Replit
  experimental: { 
    serverActions: { 
      allowedOrigins: ['localhost:5000', '*.replit.app', '*.replit.dev', '*.replit.com'] 
    }
  },
  
  // Environment configuration
  env: { 
    PORT: '5000', 
    HOSTNAME: '0.0.0.0' 
  },
  
  // Add allowedDevOrigins to fix cross-origin issues
  allowedDevOrigins: ['localhost:5000', '*.replit.app', '*.replit.dev', '*.replit.com', '7fd1735e-ab9f-42d2-b097-a1492a69af8c-00-206a96lwblvdm.kirk.replit.dev'],
  
  // Fix webpack configuration for Replit
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;