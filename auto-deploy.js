#!/usr/bin/env node

// Auto-Deploy Script - Fixed version using standard Next.js commands
const { execSync } = require('child_process');

console.log('🚀 Auto-Deploy Script Starting...');

// Get command from arguments
const command = process.argv[2];

// Set environment variables
process.env.NODE_ENV = command === 'build' ? 'production' : 'development';
process.env.PORT = '5000';
process.env.HOSTNAME = '0.0.0.0';

if (command === 'build') {
  console.log('🔨 Running build command...');
  try {
    execSync('npx next build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
} else if (command === 'start') {
  console.log('🚀 Running start command...');
  try {
    execSync('npx next start -p 5000', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Start failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('Usage: node auto-deploy.js [build|start]');
  process.exit(1);
}