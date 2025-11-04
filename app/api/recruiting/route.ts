import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Main recruiting hub API - redirects to recruiting-hub
export async function GET(request: NextRequest) {
  const url = new URL('/recruiting-hub', request.url);
  return NextResponse.redirect(url.toString());
}
