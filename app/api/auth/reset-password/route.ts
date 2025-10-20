import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { logger, mask } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const { token, password } = await req.json();
    if (!token || !password)
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    if (String(password).length < 8)
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 },
      );
    let payload: any;
    try {
      payload = verify(token, process.env.JWT_SECRET || 'fallback-secret');
      if (payload.purpose !== 'pwd-reset') throw new Error('invalid');
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    const user = await storage.getUser(payload.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Update the user's password securely
    const hashed = await bcrypt.hash(password, 12);

    // Omit id, createdAt, updatedAt for upsertUser, and only pass allowed fields
    const { id, createdAt, updatedAt, ...upsertFields } = user;
    // Only include fields that are in upsertUserSchema
    const upsertUser: any = { ...upsertFields, password: hashed };
    delete upsertUser.id;
    delete upsertUser.createdAt;
    delete upsertUser.updatedAt;
    await storage.upsertUser(upsertUser);

    logger.info('auth.pwdreset.success', {
      userId: user.id,
      email: mask.email(user.email),
      durationMs: Date.now() - t0,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('auth.pwdreset.error', {
      err: (error as Error).message,
      durationMs: Date.now() - t0,
    });
    try {
      if (process.env.SENTRY_DSN) Sentry.captureException(error);
    } catch {}
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
