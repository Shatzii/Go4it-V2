// This is a simple wrapper to start the application with fixed components
// It uses the fixed versions of files to avoid various issues

console.log('Starting Go4It Sports Platform (Fixed Version)...');

const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Set required environment variables
process.env.NODE_ENV = 'development';
process.env.DEBUG = '*';

// Start the application using tsx with the fixed server file
const command = 'tsx --tsconfig ./tsconfig.json --experimental-specifier-resolution=node server/index.fixed.ts';

console.log('Running command:', command);

const child = exec(command, {
  env: {
    ...process.env
  }
});

child.stdout.on('data', (data) => {
  console.log(data.toString().trim());
});

child.stderr.on('data', (data) => {
  console.error(data.toString().trim());
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Process exited with code ${code}`);
  }
});

// Ensure we close the child process when this script ends
process.on('SIGINT', () => {
  child.kill();
  process.exit();
});