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
  // Configure for Replit deployment
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  trailingSlash: false,
  
  // Fix cross-origin issues for Replit
  async headers() {
    return [
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization'
          }
        ]
      }
    ]
  },
  
  // Configure for development
  env: { 
    PORT: '5000', 
    HOSTNAME: '0.0.0.0' 
  },
  
  // Simplified webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Basic optimization for development
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      };
      
      // Increase timeout for slow connections
      config.output.chunkLoadTimeout = 30000;
    }
    return config;
  }
};

module.exports = nextConfig;