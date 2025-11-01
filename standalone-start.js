#!/usr/bin/env node

// Wrapper to set environment variables for Next.js standalone server
// This ensures the server binds to 0.0.0.0 for Replit deployment

const fs = require('fs');
const path = require('path');

process.env.HOSTNAME = '0.0.0.0';
process.env.PORT = process.env.PORT || '5000';

console.log(`Starting Next.js standalone server on ${process.env.HOSTNAME}:${process.env.PORT}`);

// Ensure static and public files are accessible
const standalonePath = path.join(__dirname, '.next', 'standalone');
const staticPath = path.join(__dirname, '.next', 'static');
const publicPath = path.join(__dirname, 'public');
const standaloneStaticPath = path.join(standalonePath, '.next', 'static');
const standalonePublicPath = path.join(standalonePath, 'public');

// Check if standalone build exists
if (!fs.existsSync(standalonePath)) {
  console.error('ERROR: Standalone build not found. Run "npm run build" first.');
  process.exit(1);
}

// Copy static files if they don't exist in standalone
if (fs.existsSync(staticPath) && !fs.existsSync(standaloneStaticPath)) {
  console.log('Copying static files to standalone...');
  fs.mkdirSync(path.dirname(standaloneStaticPath), { recursive: true });
  fs.cpSync(staticPath, standaloneStaticPath, { recursive: true });
}

// Copy public files if they don't exist in standalone
if (fs.existsSync(publicPath) && !fs.existsSync(standalonePublicPath)) {
  console.log('Copying public files to standalone...');
  fs.cpSync(publicPath, standalonePublicPath, { recursive: true });
}

console.log('Static files ready. Starting server...');

// Load and run the standalone server
require('./.next/standalone/server.js');
