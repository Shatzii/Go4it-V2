// This is a wrapper script to run the standalone server through the workflow system
const { spawn } = require('child_process');

console.log('Starting Go4It Sports Standalone Server...');

// Start the server as a child process
const serverProcess = spawn('node', ['standalone-server.cjs'], {
  stdio: 'inherit'
});

// Handle process exit
serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle errors
serverProcess.on('error', (err) => {
  console.error('Failed to start server process:', err);
  process.exit(1);
});