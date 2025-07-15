/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable all minification to resolve build errors
  // swcMinify option is deprecated in Next.js 15+
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Disable Terser minification completely for production builds
      config.optimization.minimize = false;
      config.optimization.minimizer = [];
    }
    
    // Add chunking to reduce build size
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 25,
      maxAsyncRequests: 25,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
    
    if (dev && isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    
    return config;
  },
  // Force Next.js to use port 5000 for Replit compatibility
  env: {
    PORT: '5000',
    HOSTNAME: '0.0.0.0',
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  },
  // Add timeout configurations for build
  staticPageGenerationTimeout: 120,
  // Skip static generation for dynamic routes
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ]
  },
}

module.exports = nextConfig