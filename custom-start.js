#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting application with cartographer fixes applied...');

// Apply cartographer fix first
try {
  console.log('Applying cartographer fixes...');
  execSync('node fix-cartographer.cjs', { stdio: 'inherit' });
  execSync('node patch-vite-config.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error applying cartographer fixes:', error);
  process.exit(1);
}

// Start the application using the patched configuration
try {
  console.log('Starting the application...');
  
  // Use a direct call to node with the patched vite config
  process.env.VITE_CONFIG_PATH = './vite.config.patched.ts';
  
  // Execute the server with the patched configuration
  execSync('TSX_TSCONFIG_PATH=./tsconfig.json tsx server/index.ts', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
} catch (error) {
  console.error('Error starting the application:', error);
  process.exit(1);
}