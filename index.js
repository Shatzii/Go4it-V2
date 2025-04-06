// This is a wrapper script to start the application
// It doesn't use tsx, just plain node.js to avoid the vite.config.ts issue
import { exec } from 'child_process';

console.log('Starting Go4It Sports Platform...');

// Run the start-app.js script
const child = exec('node start-app.js', {
  env: {
    ...process.env,
    VITE_CONFIG_PATH: './vite.config.simple.js',
    NODE_OPTIONS: '--no-warnings'
  }
});

child.stdout.on('data', (data) => {
  process.stdout.write(data);
});

child.stderr.on('data', (data) => {
  process.stderr.write(data);
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Process exited with code ${code}`);
    process.exit(code);
  }
});

// Ensure we close the child process when this script ends
process.on('SIGINT', () => {
  child.kill();
  process.exit();
});