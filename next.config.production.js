/** @type {import('next').NextConfig} */

// Production optimizations for Go4it v2.1
const nextConfig = {
  // ============================================================================
  // CORE CONFIGURATION
  // ============================================================================
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // ============================================================================
  // PERFORMANCE OPTIMIZATIONS
  // ============================================================================
  
  // Image optimization
  images: {
    domains: [
      'cdn.go4itsports.com',
      'pub-*.r2.dev',
      'go4itsports.org',
      'livekit.cloud'
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year for static images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'recharts',
      'date-fns'
    ],
  },
  
  // ============================================================================
  // SECURITY HEADERS
  // ============================================================================
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // DNS Prefetch
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // HSTS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          // Content Type Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Frame Options
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.go4itsports.com https://js.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.go4itsports.org https://api.stripe.com wss://*.livekit.cloud",
              "media-src 'self' https://cdn.go4itsports.com blob:",
              "frame-src https://js.stripe.com https://hooks.stripe.com",
              "worker-src 'self' blob:"
            ].join('; ')
          }
        ],
      },
      {
        // Static assets caching
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API routes - no cache
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  
  // ============================================================================
  // REDIRECTS & REWRITES
  // ============================================================================
  async redirects() {
    return [
      // Redirect old URLs
      {
        source: '/transcript-audit',
        destination: '/starpath/audit',
        permanent: true,
      },
      {
        source: '/gar-testing',
        destination: '/starpath/gar',
        permanent: true,
      },
      // Ensure www redirect
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.go4itsports.org',
          },
        ],
        destination: 'https://go4itsports.org/:path*',
        permanent: true,
      },
    ]
  },
  
  async rewrites() {
    return [
      // Health check
      {
        source: '/health',
        destination: '/api/health',
      },
      // Status page
      {
        source: '/status',
        destination: '/api/health',
      },
    ]
  },
  
  // ============================================================================
  // WEBPACK OPTIMIZATION
  // ============================================================================
  webpack: (config, { isServer, dev }) => {
    // Production optimizations only
    if (!dev && !isServer) {
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Common dependencies
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 10,
          },
          // Framework code (React, Next.js)
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Lib code (large libraries)
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )?.[1];
              return `npm.${packageName?.replace('@', '') || 'unknown'}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          // Shared code
          shared: {
            name(module, chunks) {
              return `shared.${chunks.map((chunk) => chunk.name).join('_')}`;
            },
            priority: 20,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
        maxInitialRequests: 25,
        minSize: 20000,
      };
      
      // Minimize bundle size
      config.optimization.minimize = true;
    }
    
    // Handle Canvas (for potential node-canvas usage)
    config.externals = config.externals || {};
    config.externals['canvas'] = 'commonjs canvas';
    
    return config;
  },
  
  // ============================================================================
  // ENVIRONMENT & BUILD
  // ============================================================================
  env: {
    NEXT_PUBLIC_APP_VERSION: '2.1',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  
  // Disable telemetry
  telemetry: false,
  
  // TypeScript configuration
  typescript: {
    // Dangerously allow production builds to complete even with type errors
    // (Remove this in development!)
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to complete even with ESLint errors
    // (Remove this in development!)
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  
  // Output configuration
  output: 'standalone',
  
  // Trailing slash handling
  trailingSlash: false,
  
  // Page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = nextConfig;
