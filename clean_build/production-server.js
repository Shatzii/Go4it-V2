/**
 * Go4It Sports Production Server
 * Configured for deployment on 5.16.1.9:81
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { createServer } = require('http');
const compression = require('compression');
const helmet = require('helmet');

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 81;
const HOST = process.env.SERVER_HOST || '5.16.1.9';

// Create Express app
const app = express();

// Production optimizations
app.use(compression()); // Compress responses
app.use(helmet({
  contentSecurityPolicy: false, // Adjust as needed
  crossOriginEmbedderPolicy: false,
}));

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, 'client/dist')));

// API routes
// This will be replaced by the actual API server instance
// We're adding this to make the setup file complete
app.get('/api/healthcheck', (req, res) => {
  res.json({ status: 'ok', server: `${HOST}:${PORT}` });
});

// For all other routes, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Create HTTP server
const server = createServer(app);

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Go4It Sports Server running on http://${HOST}:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});