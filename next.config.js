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
  swcMinify: false,
  env: {
    PORT: process.env.PORT || '5000',
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  },
}

module.exports = nextConfig