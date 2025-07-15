/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, '.'),
    };
    return config;
  },
  env: { PORT: '5000', HOSTNAME: '0.0.0.0' },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  output: 'standalone',
  distDir: '.next',
  generateBuildId: () => 'build-fixed',
};

module.exports = nextConfig;