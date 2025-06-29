#!/usr/bin/env node

/**
 * Custom Development Server
 * Forces Next.js to run on port 5000 for Replit compatibility
 */

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Force configuration
const port = 5000
const hostname = '0.0.0.0'
const dev = true

console.log('Starting Go4It Sports Platform on port 5000')

// Override Next.js configuration
process.env.PORT = '5000'
process.env.HOSTNAME = '0.0.0.0'

const app = next({ 
  dev, 
  hostname, 
  port,
  conf: {
    ...require('../next.config.js'),
    // Force port in configuration
    serverRuntimeConfig: {
      port: 5000,
      hostname: '0.0.0.0'
    }
  }
})

const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
    if (process.env.REPLIT_DEV_DOMAIN) {
      console.log(`> Replit URL: https://${process.env.REPLIT_DEV_DOMAIN}`)
    }
  })
})