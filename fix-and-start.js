#!/usr/bin/env node

/**
 * Go4It Sports Platform - Workflow Fix & Start
 * This file replaces the problematic next dev command
 */

const { spawn } = require('child_process');

// Start the properly configured server
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '5000'
  }
});

// Handle process cleanup
process.on('SIGINT', () => server.kill('SIGINT'));
process.on('SIGTERM', () => server.kill('SIGTERM'));

server.on('exit', (code) => {
  process.exit(code);
});