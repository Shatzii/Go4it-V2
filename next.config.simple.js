/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    unoptimized: true,
    domains: ['localhost', '*.replit.dev', '*.replit.app']
  },
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: { 
    ignoreBuildErrors: true 
  },
  // Minimal configuration for stable loading
  trailingSlash: false,
  poweredByHeader: false,
  generateEtags: false,
  
  // Configure for Replit environment
  env: {
    CUSTOM_KEY: 'my-value',
  },
  
  // Simple webpack configuration
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting for better loading
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;