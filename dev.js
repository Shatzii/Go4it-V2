#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.PORT = '5000';
process.env.HOSTNAME = '0.0.0.0';

console.log('🚀 Starting Go4It Sports Platform');
console.log('📍 Environment: development');
console.log('🌐 Port: 5000');
console.log('🔧 Mode: Development');
console.log('🔄 Preparing Next.js application...');
console.log(
  ' ⚠ Disabling SWC Minifer will not be an option in the next major version. Please report any issues you may be experiencing to https://github.com/vercel/next.js/issues',
);

try {
  // Start Next.js development server
  execSync('npx next dev -p 5000', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to start Next.js:', error.message);
  process.exit(1);
}
