const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = parseInt(process.env.PORT, 10) || 5000

console.log(`🚀 Starting Go4It Sports Platform in ${dev ? 'development' : 'production'} mode`)
console.log(`🌐 Binding to ${hostname}:${port}`)

// When using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

console.log('⚡ Preparing Next.js application...')

app.prepare().then(() => {
  console.log('✅ Next.js application prepared successfully')
  
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('❌ Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error('❌ Server error:', err)
      if (err.code === 'EADDRINUSE') {
        console.error(`📍 Port ${port} is already in use. Please close other processes or use a different port.`)
      }
      process.exit(1)
    })
    .listen(port, hostname, () => {
      console.log(`✅ Go4It Sports Platform ready!`)
      console.log(`🌐 Server running on: http://${hostname}:${port}`)
      console.log(`📱 Local access: http://localhost:${port}`)
      console.log(`🔗 Network access: http://0.0.0.0:${port}`)
    })
}).catch(err => {
  console.error('❌ Failed to prepare Next.js application:', err)
  process.exit(1)
})