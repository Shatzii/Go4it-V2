#!/usr/bin/env node

// Set environment variables for Next.js
process.env.PORT = '5000';
process.env.HOSTNAME = '0.0.0.0';

// Import and run next dev with custom port
const { spawn } = require('child_process');

const child = spawn('npx', ['next', 'dev', '-p', '5000', '-H', '0.0.0.0'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
});

child.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`Next.js exited with code ${code}`);
  process.exit(code);
});