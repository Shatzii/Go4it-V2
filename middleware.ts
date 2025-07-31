import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add headers for Replit preview compatibility
  const response = NextResponse.next()
  
  // Add CORS headers for cross-origin requests
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}

export const config = {
  matcher: [
    // Apply to all routes except static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}