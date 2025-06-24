/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '*.replit.dev'],
  },
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
  env: {
    PORT: process.env.PORT || '5000',
  },
}

module.exports = nextConfig