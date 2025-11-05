/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for better deployment compatibility
  output: 'standalone',
  
  // Force server-side rendering for payment pages to handle runtime env vars
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // Deployment optimizations to reduce build size
  productionBrowserSourceMaps: false,

  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
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

  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  trailingSlash: false,
  
  // Increase timeout for slow static page generation
  staticPageGenerationTimeout: 180, // Increased to 3 minutes
  
  // Optimize builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Build error handling
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // SWC minification
  swcMinify: true,
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Speed up builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
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
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },

  allowedDevOrigins: ['*.replit.dev', '*.replit.app', 'localhost:5000', '127.0.0.1:5000'],

  // Minimal webpack configuration for Next.js 14
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize server-only packages
      config.externals = config.externals || [];
      config.externals.push({
        '@tensorflow/tfjs': 'commonjs @tensorflow/tfjs',
        '@tensorflow/tfjs-backend-webgl': 'commonjs @tensorflow/tfjs-backend-webgl',
        '@tensorflow-models/pose-detection': 'commonjs @tensorflow-models/pose-detection',
        '@mediapipe/camera_utils': 'commonjs @mediapipe/camera_utils',
        '@mediapipe/drawing_utils': 'commonjs @mediapipe/drawing_utils',
        '@mediapipe/holistic': 'commonjs @mediapipe/holistic',
        '@mediapipe/pose': 'commonjs @mediapipe/pose',
        canvas: 'commonjs canvas',
        puppeteer: 'commonjs puppeteer',
        express: 'commonjs express',
        'node-cron': 'commonjs node-cron',
        'form-data': 'commonjs form-data',
      });
    }

    if (!isServer) {
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
        worker_threads: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
