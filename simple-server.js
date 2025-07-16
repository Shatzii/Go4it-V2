const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 5000;

const app = next({ 
  dev,
  hostname: '0.0.0.0',
  port: port,
  customServer: true
});

const handle = app.getRequestHandler();

async function start() {
  try {
    await app.prepare();
    
    const server = express();
    
    // Serve static files with proper caching
    server.use('/_next/static', express.static(path.join(__dirname, '.next/static'), {
      maxAge: '1y',
      immutable: true
    }));
    
    // Handle all other requests
    server.all('*', (req, res) => {
      return handle(req, res);
    });
    
    server.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Go4It Sports Platform running on http://localhost:${port}`);
    });
    
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

start();