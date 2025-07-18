/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  
  // Essential for Replit deployment
  trailingSlash: false,
  poweredByHeader: false,
  
  // Fix static asset serving
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Cross-origin configuration for Replit
  experimental: { 
    serverActions: { 
      allowedOrigins: ['localhost:5000', '*.replit.app', '*.replit.dev'] 
    }
  },
  
  // Environment configuration
  env: { 
    PORT: '5000', 
    HOSTNAME: '0.0.0.0' 
  },
  
  // Headers for cross-origin requests
  async headers() {
    return [
      {
        source: '/_next/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  }
};

module.exports = nextConfig;