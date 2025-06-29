#!/usr/bin/env node

/**
 * Go4It Sports Platform - Production-Ready Startup Script
 * This ensures the platform runs on port 5000 for Replit compatibility
 */

const { spawn } = require('child_process')
const path = require('path')

// Force environment variables for Replit compatibility
process.env.PORT = '5000'
process.env.HOSTNAME = '0.0.0.0'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

console.log('🚀 Starting Go4It Sports Platform')
console.log('📍 Port: 5000 (Replit Compatible)')
console.log('🌐 Host: 0.0.0.0 (Network Accessible)')

// Start Next.js with forced port configuration
const nextProcess = spawn('npx', [
  'next', 'dev', 
  '-p', '5000',
  '-H', '0.0.0.0'
], {
  stdio: 'inherit',
  env: process.env,
  cwd: process.cwd()
})

// Handle process events
nextProcess.on('exit', (code) => {
  console.log(`Go4It Sports Platform exited with code ${code}`)
  process.exit(code)
})

nextProcess.on('error', (error) => {
  console.error('Failed to start Go4It Sports Platform:', error)
  process.exit(1)
})

// Graceful shutdown handling
const shutdown = (signal) => {
  console.log(`\nReceived ${signal}, shutting down gracefully...`)
  nextProcess.kill('SIGTERM')
  setTimeout(() => {
    console.log('Forcing shutdown...')
    nextProcess.kill('SIGKILL')
    process.exit(1)
  }, 5000)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))