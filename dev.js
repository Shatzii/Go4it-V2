#!/usr/bin/env node

/**
 * Development Server Wrapper
 * This replaces 'next dev' and fixes all port/routing issues
 */

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Configuration for Replit compatibility
const port = 5000  // Replit workflow expects this port
const hostname = '0.0.0.0'  // Network binding for Replit
const dev = true

console.log('Starting Go4It Sports Platform Development Server')
console.log(`Port: ${port}, Host: ${hostname}`)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

async function startServer() {
  try {
    await app.prepare()
    
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true)
        
        // Handle health check
        if (parsedUrl.pathname === '/api/health') {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            port: port,
            environment: 'replit-dev'
          }))
          return
        }
        
        // Handle all other requests with Next.js
        await handle(req, res, parsedUrl)
        
      } catch (err) {
        console.error('Request error:', err)
        res.statusCode = 500
        res.end('Internal Server Error')
      }
    })
    
    server.listen(port, hostname, () => {
      console.log(`Ready on http://${hostname}:${port}`)
      if (process.env.REPLIT_DEV_DOMAIN) {
        console.log(`Replit URL: https://${process.env.REPLIT_DEV_DOMAIN}`)
      }
    })
    
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()