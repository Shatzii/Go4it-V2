#!/usr/bin/env node

// Wrapper to set environment variables for Next.js standalone server
// This ensures the server binds to 0.0.0.0 for Replit deployment

process.env.HOSTNAME = '0.0.0.0';
process.env.PORT = process.env.PORT || '5000';

console.log(`Starting Next.js standalone server on ${process.env.HOSTNAME}:${process.env.PORT}`);

// Load and run the standalone server
require('./.next/standalone/server.js');
