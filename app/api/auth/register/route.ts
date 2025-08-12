import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { sign } from 'jsonwebtoken';

// Simple in-memory rate limiter (per-process) keyed by IP
// Note: For multi-instance deployments, use a shared store (Redis/Upstash).
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_MAX_REQUESTS = 20; // max registration attempts per IP per window
type Bucket = { count: number; resetAt: number };
const globalAny = globalThis as unknown as {
  __registerRateLimit?: Map<string, Bucket>;
};
if (!globalAny.__registerRateLimit) {
  globalAny.__registerRateLimit = new Map<string, Bucket>();
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit by client IP (prefer Redis if configured)
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const useRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
    if (useRedis) {
      try {
        const key = `reg:${ip}`;
        const urlBase = process.env.UPSTASH_REDIS_REST_URL!;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
        // INCR
        const incrRes = await fetch(`${urlBase}/incr/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const incrVal = await incrRes.json();
        // On first increment, set expiry
        if (incrVal.result === 1) {
          await fetch(`${urlBase}/pexpire/${encodeURIComponent(key)}/${RATE_WINDOW_MS}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        if (Number(incrVal.result) > RATE_MAX_REQUESTS) {
          return NextResponse.json(
            { error: 'Too many registration attempts. Please try again later.' },
            { status: 429 }
          );
        }
      } catch {
        // Fallback to in-memory on any Redis error
        const limiter = globalAny.__registerRateLimit!;
        const bucket = limiter.get(ip);
        if (!bucket || now > bucket.resetAt) {
          limiter.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        } else {
          bucket.count += 1;
          if (bucket.count > RATE_MAX_REQUESTS) {
            const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
            return NextResponse.json(
              { error: 'Too many registration attempts. Please try again later.' },
              { status: 429, headers: { 'Retry-After': String(retryAfter) } }
            );
          }
        }
      }
    } else {
      const limiter = globalAny.__registerRateLimit!;
      const bucket = limiter.get(ip);
      if (!bucket || now > bucket.resetAt) {
        limiter.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
      } else {
        bucket.count += 1;
        if (bucket.count > RATE_MAX_REQUESTS) {
          const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
          return NextResponse.json(
            { error: 'Too many registration attempts. Please try again later.' },
            { status: 429, headers: { 'Retry-After': String(retryAfter) } }
          );
        }
      }
    }

  const data = await req.json();
  const { username, email, password, firstName, lastName, dateOfBirth, position, sport = 'football', acceptTerms, captchaToken } = data;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }
    if (acceptTerms !== true) {
      return NextResponse.json({ error: 'You must accept the Terms of Service and Privacy Policy' }, { status: 400 });
    }
    // Optional reCAPTCHA verification if configured
    if (process.env.RECAPTCHA_SECRET_KEY && captchaToken) {
      try {
        const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: String(captchaToken),
          }),
        });
        const verifyJson = await verifyRes.json();
        if (!verifyJson.success) {
          return NextResponse.json({ error: 'Captcha verification failed' }, { status: 400 });
        }
      } catch {
        // If captcha service errors, fail closed
        return NextResponse.json({ error: 'Captcha verification error' }, { status: 400 });
      }
    }
    // Basic additional validation
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (String(password).length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const existingUsername = await storage.getUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Create user
    const userData = {
      username,
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      position: position || '',
      sport,
      role: 'athlete',
      garScore: '0.0',
      subscriptionPlan: 'free',
      subscriptionStatus: 'active'
    };

    const newUser = await storage.createUser(userData);

    // Generate JWT token
    const token = sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Email verification token (24h) – log URL for now (replace with email send)
    const verifyToken = sign(
      { userId: newUser.id, purpose: 'email-verify' },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';
    const verifyUrl = `${appUrl}/api/auth/verify?token=${encodeURIComponent(verifyToken)}`;
    console.info('[register] Email verification URL:', verifyUrl);
    // Optional: send verification email via Resend
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
            to: newUser.email,
            subject: 'Verify your Go4It Sports account',
            html: `<p>Welcome to Go4It Sports!</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">Verify Email</a></p>`
          })
        });
      } catch (e) {
        console.warn('[register] Failed to send verification email:', e);
      }
    }

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        sport: newUser.sport
      },
      // In development, expose verifyUrl for easier testing
      verifyUrl: process.env.NODE_ENV === 'development' ? verifyUrl : undefined
    }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      // Only mark secure in production so local/dev over http works
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}