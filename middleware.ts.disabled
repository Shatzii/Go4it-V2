import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // Reset window
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }

  current.count++;
  return { allowed: true, remaining: maxRequests - current.count, resetTime: current.resetTime };
}

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
  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin/') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Check for admin authentication
    const adminToken = request.cookies.get('adminToken')?.value;
    const adminAccess = request.cookies.get('adminAccess')?.value;

    // For demo purposes, also check localStorage via headers (not ideal for production)
    const hasAdminAccess = adminToken === 'go4it-admin-secure-token-2025' || adminAccess === 'true';

    if (!hasAdminAccess) {
      // Redirect to admin login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Apply rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    const rateLimitResult = checkRateLimit(`api:${clientIP}`, 100, 15 * 60 * 1000); // 100 requests per 15 minutes

    if (!rateLimitResult.allowed) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      });
    }

    // Add rate limit headers to successful requests
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());
  }

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
      "script-src 'self' 'unsafe-inline'",
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
    if (!p.startsWith('/_next/') && process.env.REQUEST_LOGGING !== 'false' && process.env.NODE_ENV !== 'production') {
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
