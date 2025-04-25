#!/usr/bin/env node

// This script starts only the API server without Vite frontend
const { spawn } = require('child_process');

console.log('Starting Go4It Sports API Server...');

// Use our API-only server file
const command = 'npx';
const args = [
  'tsx',
  '--tsconfig', './tsconfig.json',
  '--experimental-specifier-resolution=node',
  './server/api-only-server.ts'
];

// Run the command with unbuffered output
const proc = spawn(command, args, {
  stdio: 'inherit'
});

// Handle process exit
proc.on('close', (code) => {
  if (code !== 0) {
    console.error(`Process exited with code ${code}`);
    process.exit(code);
  }
});

// Handle errors
proc.on('error', (err) => {
  console.error('Failed to start process:', err);
  process.exit(1);
});