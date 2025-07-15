#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || '5000';
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

console.log('🚀 Starting Go4It Sports Platform');
console.log('📍 Environment:', process.env.NODE_ENV);
console.log('🌐 Port:', process.env.PORT);
console.log('🔧 Mode: Development');
console.log('🔄 Preparing Next.js application...');

// Start Next.js development server
const nextArgs = ['dev', '-p', process.env.PORT, '-H', process.env.HOSTNAME];
const nextProcess = spawn('npx', ['next', ...nextArgs], {
  stdio: 'inherit',
  env: process.env
});

nextProcess.on('error', (err) => {
  console.error('❌ Failed to start Next.js:', err);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Received SIGTERM, shutting down gracefully...');
  nextProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🔄 Received SIGINT, shutting down gracefully...');
  nextProcess.kill('SIGINT');
});