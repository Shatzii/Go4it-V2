/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized configuration for Replit deployment and .replit.dev preview
  output: 'standalone',
  
  // Disable image optimization for Replit
  images: { 
    unoptimized: true,
  },
  
  // Remove powered by header
  poweredByHeader: false,
  
  // Replit deployment optimizations
  compress: true,
  generateEtags: false,
  
  // Configure for .replit.dev domain preview
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  trailingSlash: false,
  
  // Build error handling
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: { 
    ignoreBuildErrors: true 
  },
  
  // Headers for cross-origin compatibility
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // Configure allowed dev origins for Replit
  allowedDevOrigins: [
    '*.replit.dev',
    '*.replit.app', 
    'localhost:5000',
    '127.0.0.1:5000'
  ],
  
  // Essential webpack configuration for dependencies
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Externalize problematic server-only dependencies
      config.externals = config.externals || [];
      config.externals.push({
        '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp',
        'mock-aws-s3': 'commonjs mock-aws-s3',
        'nock': 'commonjs nock',
        'puppeteer': 'commonjs puppeteer',
        '@tensorflow/tfjs-node': 'commonjs @tensorflow/tfjs-node'
      });

      // Node.js fallbacks for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        url: false,
        zlib: false,
        querystring: false,
        child_process: false,
        worker_threads: false
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;