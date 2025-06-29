
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = 5000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

console.log('⚡ Preparing Next.js application...')

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
  })
    .once('error', (err) => {
      console.error('❌ Server error:', err)
      process.exit(1)
    })
    .listen(port, hostname, () => {
      console.log(`✅ Go4It Sports Platform ready on http://${hostname}:${port}`)
      console.log(`🌐 Local access: http://localhost:${port}`)
    })
})
