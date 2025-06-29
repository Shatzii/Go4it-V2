#!/usr/bin/env node

/**
 * Go4It Sports Platform - Replit-Optimized Startup
 * 
 * This script ensures the platform runs correctly in Replit workflows
 * while maintaining all optimizations and fixing port conflicts.
 */

const { spawn } = require('child_process')
const { createServer } = require('http')
const { parse } = require('url')

// Replit-specific configuration
const REPLIT_PORT = 5000
const HOSTNAME = '0.0.0.0'

console.log('🚀 Starting Go4It Sports Platform (Replit Optimized)')
console.log(`📍 Target Port: ${REPLIT_PORT}`)
console.log(`🌐 Network: ${HOSTNAME}`)

// Start Next.js on port 3000 and proxy to 5000
async function startOptimizedPlatform() {
  try {
    // Start Next.js process
    console.log('🔄 Starting Next.js server...')
    const nextProcess = spawn('npx', ['next', 'dev', '-p', '3000', '-H', '0.0.0.0'], {
      stdio: 'pipe',
      env: { ...process.env, PORT: '3000' }
    })

    let nextReady = false

    // Monitor Next.js startup
    nextProcess.stdout.on('data', (data) => {
      const output = data.toString()
      console.log(`Next.js: ${output.trim()}`)
      
      if (output.includes('Ready in') || output.includes('ready')) {
        nextReady = true
        console.log('✅ Next.js server ready')
        startProxy()
      }
    })

    nextProcess.stderr.on('data', (data) => {
      const error = data.toString()
      if (!error.includes('Disabling SWC')) {
        console.error(`Next.js Error: ${error.trim()}`)
      }
    })

    nextProcess.on('close', (code) => {
      console.log(`Next.js process exited with code ${code}`)
      process.exit(code)
    })

    // Start proxy server immediately to satisfy Replit port requirement
    startProxy()

  } catch (error) {
    console.error('❌ Failed to start platform:', error)
    process.exit(1)
  }
}

// Proxy server that forwards requests from port 5000 to Next.js on 3000
function startProxy() {
  const proxy = createServer(async (req, res) => {
    try {
      // Health check endpoint
      if (req.url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          platform: 'Go4It Sports',
          environment: 'replit',
          port: REPLIT_PORT,
          nextjs_port: 3000,
          uptime: process.uptime()
        }, null, 2))
        return
      }

      // Forward all other requests to Next.js
      const proxyReq = require('http').request({
        hostname: 'localhost',
        port: 3000,
        path: req.url,
        method: req.method,
        headers: req.headers
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers)
        proxyRes.pipe(res)
      })

      proxyReq.on('error', (err) => {
        console.error('Proxy error:', err)
        res.writeHead(502, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          error: 'Service Temporarily Unavailable',
          message: 'Next.js server is starting up...',
          timestamp: new Date().toISOString()
        }))
      })

      req.pipe(proxyReq)

    } catch (error) {
      console.error('Request handling error:', error)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        error: 'Internal Server Error',
        timestamp: new Date().toISOString()
      }))
    }
  })

  proxy.listen(REPLIT_PORT, HOSTNAME, () => {
    console.log(`✅ Proxy server running on http://${HOSTNAME}:${REPLIT_PORT}`)
    console.log(`🔗 Forwarding to Next.js on port 3000`)
    console.log(`📊 Health check: http://${HOSTNAME}:${REPLIT_PORT}/api/health`)
    console.log('\n🎯 Go4It Sports Platform ready!')
  })

  proxy.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${REPLIT_PORT} is already in use`)
    } else {
      console.error('Proxy server error:', err)
    }
    process.exit(1)
  })

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🔄 Shutting down gracefully...')
    proxy.close(() => {
      console.log('✅ Proxy server closed')
      process.exit(0)
    })
  })

  process.on('SIGINT', () => {
    console.log('🔄 Shutting down gracefully...')
    proxy.close(() => {
      console.log('✅ Proxy server closed')
      process.exit(0)
    })
  })
}

// Start the optimized platform
startOptimizedPlatform()