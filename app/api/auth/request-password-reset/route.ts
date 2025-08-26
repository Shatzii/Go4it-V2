import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { sign } from 'jsonwebtoken';
import { limiters } from '@/lib/rateLimiter';
import { logger, mask } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
  const body = await req.json();
  let email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
  // Basic sanitation
  if (email.length > 254) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown';
    const limited = await limiters.passwordRequest(ip, email);
    if (limited instanceof NextResponse) return limited;

    const user = storage.findUserByEmail
      ? await storage.findUserByEmail(email)
      : null;
    if (!user) return NextResponse.json({ success: true }); // do not leak

  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'please-set-a-secret-in-prod';
  const resetToken = sign({ userId: user.id, purpose: 'pwd-reset' }, secret, { expiresIn: '1h' });
  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';
  const appUrl = rawAppUrl.replace(/\/$/, '');
  const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;
    logger.info('auth.pwdreset.request', {
      email: mask.email(email),
      resetUrl,
      dev: process.env.NODE_ENV !== 'production',
    });

    if (process.env.RESEND_API_KEY && process.env.FROM_EMAIL) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.FROM_EMAIL,
            to: user.email,
            subject: 'Password reset',
            html: `<p>Reset your password <a href="${resetUrl}">here</a></p>`,
          }),
        });
      } catch (e) {
        logger.warn('auth.pwdreset.email_failed', { err: (e as Error).message });
      }
    }

    logger.info('auth.pwdreset.request.success', {
      email: mask.email(email),
      durationMs: Date.now() - t0,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('auth.pwdreset.request.error', {
      err: (error as Error).message,
      durationMs: Date.now() - t0,
    });
    try {
      if (process.env.SENTRY_DSN) Sentry.captureException(error);
    } catch {}
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
