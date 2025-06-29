#!/usr/bin/env node

// Set the port to 5000 before starting Next.js
process.env.PORT = '5000';

// Start Next.js dev server
const { createServer } = require('next/dist/server/next');
const { parse } = require('url');

async function startServer() {
  try {
    const dev = process.env.NODE_ENV !== 'production';
    const hostname = '0.0.0.0';
    const port = parseInt(process.env.PORT, 10) || 5000;

    // Create Next.js app
    const app = createServer({ dev, hostname, port });
    const handle = app.getRequestHandler();

    await app.prepare();

    const server = require('http').createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    });

    server.listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();