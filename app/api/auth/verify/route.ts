import { NextRequest, NextResponse } from 'next/server';
import { verify as jwtVerify } from 'jsonwebtoken';
import { storage } from '@/server/storage';
import { logger } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export async function GET(req: NextRequest) {
  const t0 = Date.now();
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token) {
      logger.warn('auth.verify.missing_token');
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const decoded = jwtVerify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    if (decoded.purpose !== 'email-verify') {
      return NextResponse.json({ error: 'Invalid token purpose' }, { status: 400 });
    }

    const userId = Number(decoded.userId);
    const user = await storage.getUser(userId);
    if (!user) {
      logger.warn('auth.verify.user_not_found', { userId });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Mark verified
    const updated = await storage.updateUser(user.id, {
      isVerified: true,
      verifiedAt: new Date(),
    } as any);

    // Redirect to a success page or dashboard
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';
  logger.info('auth.verify.success', { userId, durationMs: Date.now() - t0 });
  return NextResponse.redirect(`${appUrl}/dashboard?verified=1`);
  } catch (err) {
  logger.error('auth.verify.error', { err: (err as Error)?.message, durationMs: Date.now() - t0 });
  try { if (process.env.SENTRY_DSN) Sentry.captureException(err); } catch {}
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }
}
