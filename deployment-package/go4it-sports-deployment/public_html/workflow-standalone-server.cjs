#!/usr/bin/env node

// This script is designed to be used as a Replit workflow
// It runs the standalone server without relying on Vite or other problematic modules

console.log('Starting Go4It Sports Standalone API Server...');

const { spawn } = require('child_process');

// Start the server as a background process
const proc = spawn('node', ['standalone-server.cjs'], {
  stdio: 'inherit'
});

// Handle process exit
proc.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle errors
proc.on('error', (err) => {
  console.error('Failed to start server process:', err);
  process.exit(1);
});