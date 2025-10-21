#!/usr/bin/env node

// Simple start script for Next.js production deployment
const { execSync } = require('child_process');

console.log('🚀 Starting Go4It Sports Platform...');

// Set production environment
process.env.NODE_ENV = 'production';
process.env.PORT = '5000';
process.env.HOSTNAME = '0.0.0.0';

try {
  // Start Next.js in production mode
  console.log('⚡ Starting Next.js server on port 5000...');
  execSync('npx next start -p 5000', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
} catch (error) {
  console.error('❌ Failed to start application:', error.message);
  process.exit(1);
}
