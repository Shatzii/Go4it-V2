/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration that works on Replit
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: false,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;