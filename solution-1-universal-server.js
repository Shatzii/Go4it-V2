#!/usr/bin/env node

// Universal Server - Works on Any Port Configuration
// This eliminates port conflicts permanently

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Auto-detect port from environment or use fallbacks
const possiblePorts = [
  process.env.PORT,
  process.env.REPLIT_DEV_DOMAIN ? 5000 : null,
  3000,
  8000,
  3001
].filter(Boolean).map(p => parseInt(p, 10))

const hostname = process.env.HOSTNAME || '0.0.0.0'
const dev = process.env.NODE_ENV !== 'production'

async function startUniversalServer() {
  const app = next({ dev, hostname })
  const handle = app.getRequestHandler()
  
  await app.prepare()
  
  // Try ports in order until one works
  for (const port of possiblePorts) {
    try {
      const server = createServer(async (req, res) => {
        try {
          const parsedUrl = parse(req.url, true)
          await handle(req, res, parsedUrl)
        } catch (err) {
          console.error('Request error:', err)
          res.statusCode = 500
          res.end('Internal Server Error')
        }
      })
      
      await new Promise((resolve, reject) => {
        server.listen(port, hostname, (err) => {
          if (err) reject(err)
          else resolve()
        })
        server.on('error', reject)
      })
      
      console.log(`✅ Go4It Sports Platform running on http://${hostname}:${port}`)
      console.log(`🌐 Access via: http://localhost:${port}`)
      return
      
    } catch (err) {
      console.log(`Port ${port} unavailable, trying next...`)
      continue
    }
  }
  
  throw new Error('No available ports found')
}

startUniversalServer().catch(console.error)