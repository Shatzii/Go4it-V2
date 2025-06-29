#!/usr/bin/env node

/**
 * This file replaces the 'next dev' command with our optimized server
 * It will be executed by the workflow instead of the default Next.js dev server
 */

const { spawn } = require('child_process')

console.log('🚀 Starting Go4It Sports Platform (Optimized for Replit)')

// Start our optimized server directly
const serverProcess = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
})

serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`)
  process.exit(code)
})

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...')
  serverProcess.kill('SIGTERM')
})

process.on('SIGTERM', () => {
  console.log('Shutting down...')
  serverProcess.kill('SIGTERM')
})