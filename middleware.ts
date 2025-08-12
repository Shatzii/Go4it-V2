import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add headers for Replit preview compatibility
  const response = NextResponse.next()
  // Ensure a request ID for tracing
  const incomingRid = request.headers.get('x-request-id')
  const rid = incomingRid || Math.random().toString(36).slice(2)
  response.headers.set('X-Request-Id', rid)
  // Minimal request log (skip noisy asset routes)
  try {
    const p = request.nextUrl.pathname
    if (!p.startsWith('/_next/') && process.env.REQUEST_LOGGING !== 'false') {
      // Keep it short to avoid log spam
      console.log(`[req] ${request.method} ${p} id=${rid}`)
    }
  } catch {}
  
  // Add CORS headers for cross-origin requests
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  // Basic CSP (adjust domains as needed for analytics/CDN)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "connect-src 'self' https: http:",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
  ].join('; ')
  response.headers.set('Content-Security-Policy', csp)

  // HSTS (enable only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains; preload')
  }

  // Simple caching for GET requests to public assets/pages
  if (request.method === 'GET' && request.nextUrl.pathname.startsWith('/_next/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  return response
}

export const config = {
  matcher: [
    // Apply to all routes except static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}