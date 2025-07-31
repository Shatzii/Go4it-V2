/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for Replit preview compatibility
  output: 'standalone',
  
  // Disable image optimization for Replit
  images: { 
    unoptimized: true,
  },
  
  // Remove powered by header
  poweredByHeader: false,
  
  // Build error handling
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: { 
    ignoreBuildErrors: true 
  },
  
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