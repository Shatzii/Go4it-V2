#!/usr/bin/env node

/**
 * Custom startup script for Go4it Sports Platform
 * Runs Next.js on port 5000 for Replit deployment
 */

const { spawn } = require('child_process');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

console.log(`🚀 Starting Go4it Sports Platform on ${HOST}:${PORT}...`);

// Start Next.js with the correct port
const nextProcess = spawn('npx', ['next', 'dev', '-H', HOST, '-p', PORT.toString()], {
  stdio: 'inherit',
  env: { ...process.env, PORT: PORT.toString() }
});

nextProcess.on('error', (error) => {
  console.error('❌ Failed to start Next.js:', error);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down gracefully...');
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Shutting down gracefully...');
  nextProcess.kill('SIGTERM');
});
