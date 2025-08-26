/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized configuration for Replit deployment and .replit.dev preview
  output: 'standalone',
  
  // Environment variables to suppress Sentry warnings
  env: {
    SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING: '1',
    SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING: '1',
  },
  
  // Force server-side rendering for payment pages to handle runtime env vars
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
  images: {
    // In dev/Replit, disable optimization; in prod, allow AVIF/WebP
    unoptimized: process.env.NODE_ENV !== 'production',
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
  
  // Environment variables configuration
  env: {
    // Ensure runtime environment variables are accessible
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers for cross-origin compatibility
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/_next/:path*',
        headers: [ { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' } ],
      },
      {
        source: '/(.*)\.(svg|png|jpg|jpeg|gif|ico|webp|avif)$',
        headers: [ { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' } ],
      },
      {
        source: '/api/:path*',
        headers: [ { key: 'Cache-Control', value: 'no-store' } ],
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

// Conditionally wrap with Sentry config if available
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { withSentryConfig } = require('@sentry/nextjs');
  module.exports = withSentryConfig(nextConfig, {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  });
} catch (e) {
  module.exports = nextConfig;
}