/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential production settings only
  output: 'standalone',
  
  // Basic image config 
  images: { 
    unoptimized: true,
  },
  
  // Fix cross-origin issues for Replit
  allowedDevOrigins: [
    '7fd1735e-ab9f-42d2-b097-a1492a69af8c-00-206a96lwblvdm.kirk.replit.dev',
    '127.0.0.1',
    'localhost',
    '.replit.dev',
    '.repl.co'
  ],
  
  // Error handling for deployment
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: { 
    ignoreBuildErrors: true 
  },
  
  // Static asset handling for Replit
  assetPrefix: process.env.NODE_ENV === 'development' ? '' : '',
  trailingSlash: false,
  
  // Headers for static assets
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
  
  // Environment variables
  env: { 
    PORT: process.env.PORT || '5000',
    HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
  },
};

module.exports = nextConfig;