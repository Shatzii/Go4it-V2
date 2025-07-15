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
  // Disable all optimizations for faster builds
  webpack: (config, { dev, isServer }) => {
    // Disable all minification and optimization
    config.optimization = {
      ...config.optimization,
      minimize: false,
      minimizer: [],
      splitChunks: false,
      runtimeChunk: false,
    };
    
    // Enhanced module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, '.'),
      'lib': require('path').resolve(__dirname, 'lib'),
      'shared': require('path').resolve(__dirname, 'shared'),
      'components': require('path').resolve(__dirname, 'components'),
    };
    
    // Improve module resolution
    config.resolve.modules = [
      require('path').resolve(__dirname, '.'),
      require('path').resolve(__dirname, 'lib'),
      require('path').resolve(__dirname, 'shared'),
      'node_modules'
    ];
    
    // Speed up builds
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
  // Reduce build complexity
  output: 'standalone',
  distDir: '.next',
  // Skip static optimization for faster builds
  staticPageGenerationTimeout: 60,
  generateBuildId: async () => {
    return 'build-simple';
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