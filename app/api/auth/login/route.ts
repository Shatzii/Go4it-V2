import { NextRequest, NextResponse } from 'next/server';

// This endpoint is deprecated - authentication is now handled by Clerk
// Keeping it for backwards compatibility but redirecting to Clerk
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Authentication is now handled by Clerk. Please use /login page.',
      redirectTo: '/login',
    },
    { status: 410 } // Gone
  );
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Authentication is handled by Clerk',
      loginUrl: '/login',
      signupUrl: '/register',
    },
    { status: 200 }
  );
}
