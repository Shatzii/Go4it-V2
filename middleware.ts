import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow all requests to pass through without interference
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only run middleware on pages, exclude all static assets and API routes
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|manifest.json|robots.txt|sitemap.xml).*)',
  ],
}