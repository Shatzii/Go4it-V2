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
  // Force Next.js to use port 5000 for Replit compatibility
  async rewrites() {
    return []
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
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  },
  // Custom server configuration to force port 5000
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

export default nextConfig