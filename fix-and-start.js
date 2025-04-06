#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Preparing to start application with fixes...');

// Apply cartographer fix first
try {
  console.log('Applying cartographer fixes...');
  execSync('node fix-cartographer.cjs', { stdio: 'inherit' });
  execSync('node patch-vite-config.js', { stdio: 'inherit' });
  
  // Create a modified version of index.ts that uses vite-wrapper.ts
  console.log('Creating temporary index.ts with vite-wrapper...');
  const originalIndexPath = './server/index.ts';
  const tempIndexPath = './server/index.fixed.ts';
  
  let indexContent = fs.readFileSync(originalIndexPath, 'utf8');
  // Replace the import from "./vite" with import from "./vite-wrapper"
  indexContent = indexContent.replace(
    'import { setupVite, serveStatic, log } from "./vite";',
    'import { setupVite, serveStatic, log } from "./vite-wrapper";'
  );
  
  fs.writeFileSync(tempIndexPath, indexContent);
  console.log('Created temporary index file with fixed imports');
  
} catch (error) {
  console.error('Error applying fixes:', error);
  process.exit(1);
}

// Start the application using the patched configuration
try {
  console.log('Starting the application with fixed configuration...');
  
  // Use a direct call to node with the patched configuration
  process.env.VITE_CONFIG_PATH = './vite.config.patched.ts';
  
  // Execute the server with the patched configuration and fixed index.ts
  execSync('TSX_TSCONFIG_PATH=./tsconfig.json tsx server/index.fixed.ts', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
} catch (error) {
  console.error('Error starting the application:', error);
  
  // Clean up temporary files
  try {
    fs.unlinkSync('./server/index.fixed.ts');
  } catch (e) {
    console.log('Could not remove temporary file:', e);
  }
  
  process.exit(1);
}

// Clean up temporary files on success
try {
  fs.unlinkSync('./server/index.fixed.ts');
} catch (e) {
  console.log('Could not remove temporary file:', e);
}