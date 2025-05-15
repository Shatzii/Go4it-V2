// Go4It Sports Static Launcher (CommonJS version)
// This launcher uses CommonJS syntax to ensure maximum compatibility

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('============================================');
console.log(' Go4It Sports Static Launcher (CommonJS)    ');
console.log('============================================');

// Check for existing processes and kill them
try {
  const { execSync } = require('child_process');
  execSync('pkill -f "node start-static-server.js"', { stdio: 'ignore' });
  console.log('✅ Cleaned up any existing server processes');
} catch (e) {
  // Ignore errors if no processes found
}

// Path to our static server script
const serverPath = path.join(__dirname, 'start-static-server.js');

// Check if the server file exists
if (!fs.existsSync(serverPath)) {
  console.error('❌ Server file not found:', serverPath);
  process.exit(1);
}

console.log('✅ Found server file at:', serverPath);
console.log('🚀 Starting static server...');

// Start the server as a child process
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  detached: false
});

server.on('error', (err) => {
  console.error('❌ Error starting server:', err);
});

// Keep the parent process running
process.on('SIGINT', () => {
  console.log('💤 Shutting down...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('💤 Shutting down...');
  server.kill('SIGTERM');
  process.exit(0);
});

console.log('✅ Launcher is now monitoring the server');