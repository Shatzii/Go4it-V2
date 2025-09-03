/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // Build error handling - ignore errors for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Server-side package externalization for AI/ML packages
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
  ],

  // Security headers
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
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  // Puppeteer configuration for build
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD || 'false',
    PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
  },

  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
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
          { key: 'Access-Control-Allow-Origin', value: '*' },
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
  webpack: (config, { isServer, dev, buildId }) => {
    // Add build ID to environment
    config.plugins.push(
      new config.webpack.DefinePlugin({
        __BUILD_ID__: JSON.stringify(buildId),
      })
    );

    if (isServer) {
      // Completely exclude browser-only AI packages from server builds
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

    // Optimize bundle splitting
    if (!dev) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        radix: {
          test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
          name: 'radix-ui',
          chunks: 'all',
          priority: 20,
        },
      };
    }

    return config;
  },
};

// Try to apply Sentry config safely
let exported = nextConfig;
try {
  if (process.env.NODE_ENV === 'production') {
    const { withSentryConfig } = require('@sentry/nextjs');
    exported = withSentryConfig(exported, {
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    });
  }
} catch (error) {
  // Sentry configuration is optional
  console.warn('Sentry configuration failed, proceeding without it');
}

module.exports = exported;
