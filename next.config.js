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
    optimizeCss: false,
  },
  
  // Error handling
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: { 
    ignoreBuildErrors: true 
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
    // Fix for TensorFlow.js and problematic node modules
    if (!isServer) {
      // Externalize problematic dependencies to prevent bundling
      config.externals = config.externals || [];
      config.externals.push({
        '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp',
        'mock-aws-s3': 'commonjs mock-aws-s3',
        'aws-sdk': 'commonjs aws-sdk',
        'nock': 'commonjs nock',
        'puppeteer': 'commonjs puppeteer',
        'canvas': 'commonjs canvas',
        'fs': 'commonjs fs',
        'path': 'commonjs path',
        'child_process': 'commonjs child_process'
      });

      // Ignore HTML files from node-pre-gyp
      config.module.rules.push({
        test: /\.html$/,
        include: /node_modules\/@mapbox\/node-pre-gyp/,
        use: 'ignore-loader'
      });

      // Handle TensorFlow.js dynamic imports
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
        worker_threads: false
      };

      // Conditional imports for TensorFlow.js
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.IS_CLIENT': JSON.stringify(true),
          'process.env.IS_SERVER': JSON.stringify(false)
        })
      );
    } else {
      // Server-side configuration
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.IS_CLIENT': JSON.stringify(false),
          'process.env.IS_SERVER': JSON.stringify(true)
        })
      );
    }

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
          tensorflow: {
            test: /[\\/]node_modules[\\/]@tensorflow/,
            name: 'tensorflow',
            chunks: 'all',
            priority: 10,
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