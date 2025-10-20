import { NextResponse } from 'next/server';

// Main recruiting hub API - redirects to recruiting-hub
export async function GET() {
  return NextResponse.redirect('/recruiting-hub');
}
