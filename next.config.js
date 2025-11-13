/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for better deployment compatibility
  output: 'standalone',
  
  // Increase timeout for pages with database queries
  staticPageGenerationTimeout: 300,
  
  // Reduce memory usage during builds
  modularizeImports: {
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}',
    },
  },
  
  // Force server-side rendering for payment pages to handle runtime env vars
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // Deployment optimizations to reduce build size
  productionBrowserSourceMaps: false,


  images: {
    // Disable Next.js image optimization during production builds on constrained hosts.
    // This avoids expensive image processing at build-time; use external image CDN in production.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // Turbopack placeholder to avoid errors when custom webpack config is not used
  turbopack: {},

  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  trailingSlash: false,
  
  // Increase timeout for slow static page generation
  staticPageGenerationTimeout: 180, // Increased to 3 minutes
  
  // Optimize builds
  // Removed unsupported and experimental options

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { 
            key: 'Content-Security-Policy', 
            value: process.env.NODE_ENV === 'production' 
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss:; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;"
              : "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; font-src 'self' data:; connect-src 'self' http: https: ws: wss:; media-src 'self' http: https:; object-src 'none';"
          },
          { 
            key: 'Strict-Transport-Security', 
            value: process.env.NODE_ENV === 'production' 
              ? 'max-age=63072000; includeSubDomains; preload' 
              : 'max-age=0'
          },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGIN || 'https://go4it.com' : '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/_next/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/(.*)\.(svg|png|jpg|jpeg|gif|ico|webp|avif)$',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },

  // Allow development origins for Replit and local dev
  allowedDevOrigins: [
    '*.replit.dev', 
    '*.replit.app', 
    '*.kirk.replit.dev',  // Add Replit workspace domains
    'localhost:3000',
    'localhost:5000', 
    '127.0.0.1:3000',
    '127.0.0.1:5000'
  ],

};

module.exports = nextConfig;
