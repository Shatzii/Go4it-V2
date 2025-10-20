import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Minimal middleware for deployment testing
  const response = NextResponse.next();
  
  // Basic request logging only
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
