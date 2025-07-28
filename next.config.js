/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Production optimizations
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Image optimization for production
  images: { 
    unoptimized: !isProduction,
    domains: isProduction ? ['go4itsports.org', 'cdn.go4itsports.org', 'images.unsplash.com'] : [],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Security headers
  async headers() {
    if (!isProduction) return [];
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src https://js.stripe.com;"
          }
        ],
      },
    ];
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: isProduction,
  },
  
  // Error handling
  eslint: { 
    ignoreDuringBuilds: !isProduction 
  },
  typescript: { 
    ignoreBuildErrors: !isProduction 
  },
  
  // Cross-origin configuration for development
  allowedDevOrigins: !isProduction ? [
    '7fd1735e-ab9f-42d2-b097-a1492a69af8c-00-206a96lwblvdm.kirk.replit.dev',
    '127.0.0.1',
    'localhost'
  ] : [],
  
  // Redirects for production
  async redirects() {
    if (!isProduction) return [];
    
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Production optimizations
    if (isProduction && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    // Bundle analyzer for production builds
    if (isProduction && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    
    return config;
  },
  
  // Environment variables
  env: { 
    PORT: process.env.PORT || '5000', 
    HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'development-key'
  },
};

module.exports = nextConfig;