#!/usr/bin/env node

/**
 * Go4It Sports Platform Startup Script
 * This ensures the application always starts correctly on port 5000
 */

const { spawn } = require('child_process');

console.log('🚀 Go4It Sports Platform - Starting...');

// Force the custom server to run
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: '5000'
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Shutting down...');
  server.kill('SIGTERM');
  process.exit(0);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
  }
  process.exit(code);
});