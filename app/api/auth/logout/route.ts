import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    
    // Clear the authentication cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/',
      maxAge: 0
    });

  logger.info('auth.logout.success');
  return response;
  } catch (error) {
  logger.error('auth.logout.error', { err: (error as Error)?.message });
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}