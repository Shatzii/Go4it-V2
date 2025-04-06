// This is a simplified script to start the server in a way that bypasses the Vite config issues
const { exec } = require('child_process');
const { promises: fs } = require('fs');
const path = require('path');

// Setup the environment for running the server
process.env.NODE_ENV = 'development';
process.env.PORT = '3000';
process.env.DEBUG = '*';

console.log('Starting Go4It Sports Platform...');

// Run the server with tsx
const command = 'npx tsx server/index.ts';
console.log(`Running command: ${command}`);

// Execute the command and pipe output to console
const child = exec(command, {
  env: process.env
});

child.stdout.on('data', (data) => {
  console.log(data.toString().trim());
});

child.stderr.on('data', (data) => {
  console.error(data.toString().trim());
});

child.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  child.kill('SIGINT');
  process.exit(0);
});