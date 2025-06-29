#!/usr/bin/env node

// Go4It Sports App Starter
// This script ensures the app starts on port 5000 as expected by the Replit workflow

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Go4It Sports Platform...');

// Set environment variables
process.env.PORT = '5000';
process.env.HOSTNAME = '0.0.0.0';

// Function to start the custom Next.js server
function startCustomServer() {
  console.log('📡 Starting custom Next.js server on port 5000...');
  
  const serverScript = `
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = 5000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

console.log('⚡ Preparing Next.js application...')

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error('❌ Server error:', err)
      process.exit(1)
    })
    .listen(port, hostname, () => {
      console.log(\`✅ Go4It Sports Platform ready on http://\${hostname}:\${port}\`)
      console.log(\`🌐 Local access: http://localhost:\${port}\`)
    })
})
`;

  // Write the server script to a temporary file
  fs.writeFileSync('./temp-server.js', serverScript);
  
  // Start the server
  const child = spawn('node', ['temp-server.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '5000' }
  });

  child.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });

  child.on('close', (code) => {
    console.log(`🔄 Server exited with code ${code}`);
    // Clean up temp file
    try {
      fs.unlinkSync('./temp-server.js');
    } catch (e) {
      // Ignore cleanup errors
    }
    process.exit(code);
  });
}

// Start the server
startCustomServer();