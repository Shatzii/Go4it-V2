import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Block or short-circuit admin/marketing routes when FEATURE_MARKETING !== 'true'
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const adminPaths = ['/admin', '/dashboard', '/studio', '/marketing'];
  const isAdmin = adminPaths.some(p => pathname.startsWith(p));

  const featureMarketing = process.env.FEATURE_MARKETING === 'true';
  if (isAdmin && !featureMarketing) {
    // Return 404-like response for admin routes when feature disabled
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/studio/:path*', '/marketing/:path*'],
};
