#!/usr/bin/env node

/**
 * Go4It Sports Platform - Simple Launch Script
 * This script launches the optimized server and ensures it's working correctly
 */

const { spawn } = require('child_process')
const http = require('http')

console.log('🚀 Launching Go4It Sports Platform...')

// Function to test if server is responding
function testServer(port, callback) {
  const options = {
    hostname: 'localhost',
    port: port,
    path: '/api/health',
    method: 'GET',
    timeout: 5000
  }

  const req = http.request(options, (res) => {
    let data = ''
    res.on('data', chunk => data += chunk)
    res.on('end', () => {
      try {
        const health = JSON.parse(data)
        callback(null, health)
      } catch (e) {
        callback(e)
      }
    })
  })

  req.on('error', callback)
  req.on('timeout', () => callback(new Error('Request timeout')))
  req.end()
}

// Launch the server
const serverProcess = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: process.env
})

// Test server after 3 seconds
setTimeout(() => {
  testServer(5000, (error, health) => {
    if (error) {
      console.log('⚠️  Server test failed:', error.message)
      console.log('🔄 Server may still be starting up...')
    } else {
      console.log('✅ Server is responding correctly!')
      console.log('📊 Health Status:', health.status)
      console.log('🌐 Platform ready at: http://localhost:5000')
    }
  })
}, 3000)

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down server...')
  serverProcess.kill('SIGTERM')
  process.exit(0)
})

serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`)
  process.exit(code)
})