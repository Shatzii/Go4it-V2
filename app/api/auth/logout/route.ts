import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export async function POST(req: NextRequest) {
  const t0 = Date.now();
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

  logger.info('auth.logout.success', { durationMs: Date.now() - t0 });
  return response;
  } catch (error) {
  logger.error('auth.logout.error', { err: (error as Error)?.message, durationMs: Date.now() - t0 });
  try { if (process.env.SENTRY_DSN) Sentry.captureException(error); } catch {}
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}