/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // Build error handling - optimize for memory
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Compiler optimization - keep minimal to avoid conflicts
  compiler: {
    // Let Next.js 15 handle optimizations automatically
  },
  
  // Note: SWC minification is enabled by default in Next.js 15
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Server-side package externalization for AI/ML packages and legacy features
  // Note: In Next.js 15, serverComponentsExternalPackages moved to serverExternalPackages
  serverExternalPackages: [
    '@tensorflow/tfjs',
    '@tensorflow/tfjs-node',
    '@tensorflow/tfjs-backend-webgl',
    '@tensorflow-models/pose-detection',
    '@mediapipe/camera_utils',
    '@mediapipe/drawing_utils',
    '@mediapipe/holistic',
    '@mediapipe/pose',
    'puppeteer',
    'sharp',
    'canvas',
    '@prisma/client',
    'prisma',
    'express',
    'node-cron',
    'form-data',
    '@opentelemetry/api',
    '@opentelemetry/core',
    '@opentelemetry/resources',
    '@opentelemetry/instrumentation',
    '@opentelemetry/semantic-conventions',
    '@opentelemetry/context-async-hooks',
    'full-icu',
  ],

  // Turbopack configuration (replaces experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
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

  // Enhanced webpack configuration for Next.js 15
  webpack: (config, { isServer, dev, buildId, nextRuntime }) => {
    // Memory optimization - limit parallel processing
    config.parallelism = 1;
    
    // Let Next.js 15 handle minification automatically with SWC
    // Do not override config.optimization.minimize
    
    // Exclude OpenTelemetry from Edge runtime (middleware) to prevent eval() errors
    if (nextRuntime === 'edge') {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/api': false,
        '@opentelemetry/core': false,
        '@opentelemetry/resources': false,
        '@opentelemetry/instrumentation': false,
      };
    }

    // Exclude OpenTelemetry from Edge Runtime (middleware)
    if (nextRuntime === 'edge') {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/api': false,
        '@opentelemetry/core': false,
        '@opentelemetry/resources': false,
        '@opentelemetry/instrumentation': false,
        '@opentelemetry/semantic-conventions': false,
        '@opentelemetry/context-async-hooks': false,
      };
      // Exclude all OpenTelemetry packages from edge bundle
      config.externals = config.externals || [];
      config.externals.push(/@opentelemetry\/.*/);
    }
    
    // Add build ID to environment
    if (!isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          __BUILD_ID__: JSON.stringify(buildId),
        })
      );
    }

    if (isServer) {
      // Completely exclude browser-only AI packages and server-only legacy packages from server builds
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

    // Let Next.js 15 handle bundle optimization automatically
    
    return config;
  },
};

module.exports = nextConfig;
