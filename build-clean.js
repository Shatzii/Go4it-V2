#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting clean build process...');

try {
  // Set environment variables for consistent builds
  process.env.NODE_ENV = 'production';
  process.env.PORT = '5000';
  process.env.HOSTNAME = '0.0.0.0';
  
  console.log('📦 Running Next.js build...');
  execSync('npx next build', { 
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env }
  });
  
  console.log('✅ Build completed successfully');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}