#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Starting production server...');

try {
  // Set environment variables
  process.env.NODE_ENV = 'production';
  process.env.PORT = '5000';
  process.env.HOSTNAME = '0.0.0.0';

  console.log('🌐 Starting Next.js server on port 5000...');
  execSync('npx next start -p 5000', {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env },
  });
} catch (error) {
  console.error('❌ Server start failed:', error.message);
  process.exit(1);
}
