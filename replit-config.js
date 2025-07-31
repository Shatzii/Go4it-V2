// Replit-specific configuration for optimal deployment
module.exports = {
  // Environment settings
  port: process.env.PORT || 5000,
  hostname: '0.0.0.0',
  
  // Build optimization for Replit
  buildSettings: {
    nodeOptions: '--max-old-space-size=4096',
    skipLinting: true,
    telemetryDisabled: true,
  },
  
  // Static asset handling
  staticAssets: {
    maxAge: '1y',
    compression: true,
    etag: true,
  },
  
  // Memory management
  memorySettings: {
    maxOldSpaceSize: 4096,
    maxSemiSpaceSize: 256,
  },
  
  // Health check configuration
  healthCheck: {
    endpoint: '/api/health',
    interval: 30000,
    timeout: 5000,
  }
};