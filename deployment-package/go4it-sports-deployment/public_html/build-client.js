#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building client...');

// Apply the cartographer fix first
try {
  console.log('Applying cartographer fix...');
  execSync('node fix-cartographer.cjs', { stdio: 'inherit' });
} catch (error) {
  console.error('Error applying cartographer fix:', error);
  process.exit(1);
}

// Use our patched vite config
try {
  console.log('Using patched vite config...');
  // Copy the patched config to vite.config.js for building
  if (fs.existsSync('vite.config.patched.ts')) {
    fs.copyFileSync('vite.config.patched.ts', 'vite.config.js');
    console.log('Successfully copied patched vite config');
  } else {
    console.error('Could not find patched vite config');
    process.exit(1);
  }
} catch (error) {
  console.error('Error setting up patched vite config:', error);
  process.exit(1);
}

// Build the client
try {
  console.log('Building client with vite...');
  execSync('npx vite build', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building client:', error);
  process.exit(1);
}

// Restore the original vite config
try {
  console.log('Restoring original vite config...');
  if (fs.existsSync('vite.config.js')) {
    fs.unlinkSync('vite.config.js');
    console.log('Successfully restored original vite config');
  }
} catch (error) {
  console.error('Error restoring original vite config:', error);
}