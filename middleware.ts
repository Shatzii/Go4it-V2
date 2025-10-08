import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Centralized security headers applied to all responses
const securityHeaders: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    "geolocation=()",
    "camera=()",
    "microphone=()",
    "accelerometer=()",
    "autoplay=()",
    "clipboard-write=(self)",
    "fullscreen=(self)",
  ].join(', '),
  // Note: HSTS should only be enabled when serving over HTTPS with a valid cert
  ...(process.env.NODE_ENV === 'production'
    ? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload' }
    : {}),
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Attach security headers
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Optional lightweight CSP for SVG and inline risks (tune as needed)
  // Keep permissive in dev to avoid DX issues; tighten in production.
  if (process.env.NODE_ENV === 'production') {
    const csp = [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next dev/React hydrate may need inline/eval
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ');
    response.headers.set('Content-Security-Policy', csp);
  }

  // Basic request logging (disable by setting REQUEST_LOGGING=false)
  try {
    const p = request.nextUrl.pathname;
    if (!p.startsWith('/_next/') && process.env.REQUEST_LOGGING !== 'false') {
      console.log(`[req] ${request.method} ${p}`);
    }
  } catch {}

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
