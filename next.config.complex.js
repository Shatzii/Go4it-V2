/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential production settings only
  output: 'standalone',
  
  // Basic image config 
  images: { 
    unoptimized: true,
  },
  
  // Production optimization
  poweredByHeader: false,
  
  // Error handling for deployment
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: { 
    ignoreBuildErrors: true 
  },
  
  // Replit preview optimization
  assetPrefix: process.env.NODE_ENV === 'development' ? '' : '',
  trailingSlash: false,
  
  // Enable Replit preview by allowing dev origins
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    '*.replit.dev',
    '*.replit.app',
    '*.repl.it'
  ],
  
  // Headers for static assets and Replit preview
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  
  // Webpack configuration to fix TensorFlow.js and node-pre-gyp issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Externalize problematic dependencies
      config.externals = config.externals || [];
      config.externals.push({
        '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp',
        'aws-sdk': 'commonjs aws-sdk',
        'mock-aws-s3': 'commonjs mock-aws-s3',
        'nock': 'commonjs nock',
        'puppeteer': 'commonjs puppeteer',
        'canvas': 'commonjs canvas',
        '@tensorflow/tfjs-node': 'commonjs @tensorflow/tfjs-node'
      });

      // Ignore HTML files from node-pre-gyp
      config.module.rules.push({
        test: /\.html$/,
        include: /node_modules\/@mapbox\/node-pre-gyp/,
        use: 'ignore-loader'
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
  
  // Environment variables for Replit
  env: { 
    PORT: process.env.PORT || '5000',
    HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
  },
  
  // Server configuration for Replit preview
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:5000', '*.replit.dev', '*.replit.app']
    }
  },
};

module.exports = nextConfig;