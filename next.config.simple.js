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
  // Minimal config for fastest possible builds
  webpack: (config) => {
    // Disable all optimizations
    config.optimization = false;
    config.resolve.alias = {
      '@': require('path').resolve(__dirname, '.'),
    };
    return config;
  },
  env: {
    PORT: '5000',
    HOSTNAME: '0.0.0.0',
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  },
  output: 'standalone',
  distDir: '.next',
  generateBuildId: () => 'simple',
}

module.exports = nextConfig;