#!/usr/bin/env node

// This script starts the application with our fixed versions of key files
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('Starting Go4It Sports Platform with fixed configuration...');

// Use NODE_OPTIONS to suppress warnings
const NODE_OPTIONS = '--no-warnings';

// Use our fixed server file
const command = 'npx';
const args = [
  'tsx',
  '--tsconfig', './tsconfig.json',
  '--experimental-specifier-resolution=node',
  './server/index.fixed.ts'
];

// Run the command with unbuffered output
const proc = spawn(command, args, {
  env: {
    ...process.env,
    NODE_OPTIONS,
    VITE_CONFIG_PATH: path.resolve(__dirname, 'vite.config.fixed.ts')
  },
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