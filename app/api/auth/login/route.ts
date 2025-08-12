import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { sign } from 'jsonwebtoken';
import { logger, mask } from '@/lib/logger';

// Simple (or Redis-backed) rate limiter for login brute-force protection
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_MAX_REQUESTS = 30; // allow more than register but still limit
type Bucket = { count: number; resetAt: number };
const globalAny = globalThis as unknown as { __loginRateLimit?: Map<string, Bucket> };
if (!globalAny.__loginRateLimit) globalAny.__loginRateLimit = new Map<string, Bucket>();

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const useRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
    if (useRedis) {
      try {
        const key = `login:${ip}`;
        const urlBase = process.env.UPSTASH_REDIS_REST_URL!;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
        const incrRes = await fetch(`${urlBase}/incr/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${token}` } });
        const incrVal = await incrRes.json();
        if (incrVal.result === 1) {
          await fetch(`${urlBase}/pexpire/${encodeURIComponent(key)}/${RATE_WINDOW_MS}`, { headers: { Authorization: `Bearer ${token}` } });
        }
        if (Number(incrVal.result) > RATE_MAX_REQUESTS) {
          return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
        }
      } catch {
        const limiter = globalAny.__loginRateLimit!;
        const bucket = limiter.get(ip);
        if (!bucket || now > bucket.resetAt) limiter.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        else {
          bucket.count += 1;
          if (bucket.count > RATE_MAX_REQUESTS) return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
        }
      }
    } else {
      const limiter = globalAny.__loginRateLimit!;
      const bucket = limiter.get(ip);
      if (!bucket || now > bucket.resetAt) limiter.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
      else {
        bucket.count += 1;
        if (bucket.count > RATE_MAX_REQUESTS) return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
      }
    }

    const { email, password } = await req.json();

  if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate credentials
    const user = await storage.validateUserCredentials(email, password);
    if (!user) {
  logger.warn('auth.login.invalid_credentials', { email: mask.email(email) });
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await storage.updateLastLogin(user.id);

    // Generate JWT token
    const token = sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        sport: user.sport
      }
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

  logger.info('auth.login.success', { userId: user.id, email: mask.email(user.email) });
  return response;

  } catch (error) {
  logger.error('auth.login.error', { err: (error as Error)?.message });
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}