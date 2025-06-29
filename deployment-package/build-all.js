#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building entire application...');

// Apply cartographer fix first
try {
  console.log('Applying cartographer fix...');
  execSync('node fix-cartographer.cjs', { stdio: 'inherit' });
} catch (error) {
  console.error('Error applying cartographer fix:', error);
  process.exit(1);
}

// Build client
try {
  console.log('Building client...');
  execSync('node build-client.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building client:', error);
  process.exit(1);
}

// Build server
try {
  console.log('Building server...');
  execSync('node build-server.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building server:', error);
  process.exit(1);
}

console.log('Build completed successfully!');