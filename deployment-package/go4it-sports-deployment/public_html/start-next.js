#!/usr/bin/env node

import { spawn } from 'child_process';

// Start Next.js on port 5000 to match workflow expectations
const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
});

nextProcess.on('error', (err) => {
  console.error('Failed to start Next.js:', err);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down Next.js...');
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down Next.js...');
  nextProcess.kill('SIGTERM');
});