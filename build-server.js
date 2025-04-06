#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building server...');

// Apply the cartographer fix first
try {
  console.log('Applying cartographer fix...');
  execSync('node fix-cartographer.cjs', { stdio: 'inherit' });
} catch (error) {
  console.error('Error applying cartographer fix:', error);
  process.exit(1);
}

// Then build the server
try {
  console.log('Building server with esbuild...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building server:', error);
  process.exit(1);
}