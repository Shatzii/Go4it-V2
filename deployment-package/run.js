// Go4It Sports Launcher
// This script determines the best way to start the application
// based on the environment

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we should use the static server (no database)
const useStaticServer = true; // Change to false to use the original server

console.log('===========================================');
console.log('       Go4It Sports Platform Launcher      ');
console.log('===========================================');

if (useStaticServer) {
  console.log('🚀 Starting in static mode (no database required)');
  
  // Check if static server file exists
  const staticServerPath = path.join(__dirname, 'start-static-server.js');
  if (!fs.existsSync(staticServerPath)) {
    console.error('❌ Static server file not found:', staticServerPath);
    process.exit(1);
  }
  
  // Start the static server as a child process
  const server = spawn('node', [staticServerPath], {
    stdio: 'inherit',
    detached: false
  });
  
  // Log server events
  server.on('error', (err) => {
    console.error('❌ Failed to start static server:', err);
  });
  
  // Keep the parent process running
  process.on('SIGINT', () => {
    console.log('👋 Shutting down static server...');
    server.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('👋 Shutting down static server...');
    server.kill('SIGTERM');
  });
} else {
  console.log('🚀 Starting in normal mode (using database)');
  // Start the original server
  const originalServerPath = path.join(__dirname, 'server', 'index.ts');
  
  if (!fs.existsSync(originalServerPath)) {
    console.error('❌ Original server file not found:', originalServerPath);
    process.exit(1);
  }
  
  // Use tsx to run the TypeScript server
  const server = spawn('npx', ['tsx', originalServerPath], {
    stdio: 'inherit',
    detached: false
  });
  
  // Log server events
  server.on('error', (err) => {
    console.error('❌ Failed to start original server:', err);
  });
  
  // Keep the parent process running
  process.on('SIGINT', () => {
    console.log('👋 Shutting down original server...');
    server.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('👋 Shutting down original server...');
    server.kill('SIGTERM');
  });
}