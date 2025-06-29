#!/usr/bin/env node

// This script runs only the API server using tsx directly,
// bypassing the Vite configuration which is causing issues
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Go4It Sports API Server (Direct)...');

// Run tsx directly with our api-server-direct.ts
const proc = spawn('npx', [
  'tsx',
  path.join('server', 'api-server-direct.ts')
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    // Force development mode
    NODE_ENV: 'development'
  }
});

proc.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  process.exit(code);
});

proc.on('error', (err) => {
  console.error('Failed to start process:', err);
  process.exit(1);
});