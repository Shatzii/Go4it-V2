#!/usr/bin/env node

// Simple build script for Next.js production deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building Go4It Sports Platform...');

// Set production environment
process.env.NODE_ENV = 'production';
process.env.PORT = '5000';
process.env.HOSTNAME = '0.0.0.0';

try {
  // Run Next.js build
  console.log('📦 Running Next.js build...');
  execSync('npx next build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}