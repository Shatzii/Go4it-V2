import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { sign } from 'jsonwebtoken';
import { limiters } from '@/lib/rateLimiter';
import { logger, mask } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown';
    const limited = await limiters.resendVerify(ip, email);
    if (limited instanceof NextResponse) return limited;

    const user = await storage.getUserByEmail(email);
    if (!user) return NextResponse.json({ success: true }); // do not leak
    if (user.isVerified) return NextResponse.json({ success: true });

    const verifyToken = sign(
      { userId: user.id, purpose: 'email-verify' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' },
    );
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';
    const verifyUrl = `${appUrl}/api/auth/verify?token=${encodeURIComponent(verifyToken)}`;
    logger.info('auth.resend.verify_link', {
      email: mask.email(email),
      verifyUrl,
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
            subject: 'Verify your account',
            html: `<p>Verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
          }),
        });
      } catch (e) {
        logger.warn('auth.resend.email_failed', { err: (e as Error).message });
      }
    }

    logger.info('auth.resend.success', { email: mask.email(email), durationMs: Date.now() - t0 });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('auth.resend.error', {
      err: (error as Error).message,
      durationMs: Date.now() - t0,
    });
    try {
    } catch {}
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
