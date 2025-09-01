import { NextResponse } from 'next/server';

// Centralized rate limiter supporting optional Upstash Redis REST API.
// Usage: await limit({ keyParts: ['login', ip], limit: 30, windowMs: 60_000 })
// Returns { ok: boolean, resetMs: number, remaining: number } or a NextResponse (429) if throwOnFail.
interface LimitArgs {
  keyParts: (string | number | undefined | null)[];
  limit: number;
  windowMs: number;
  throwOnFail?: boolean;
}

interface LimitResult {
  ok: boolean;
  remaining: number;
  resetMs: number;
}

type Bucket = { count: number; resetAt: number };
const globalAny = globalThis as unknown as { __centralRateLimit?: Map<string, Bucket> };
if (!globalAny.__centralRateLimit) globalAny.__centralRateLimit = new Map();

export async function limit(args: LimitArgs): Promise<LimitResult | NextResponse> {
  const { keyParts, limit, windowMs, throwOnFail } = args;
  const key = keyParts.filter(Boolean).join(':');
  const now = Date.now();
  const useRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  try {
    if (useRedis) {
      const urlBase = process.env.UPSTASH_REDIS_REST_URL!;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
      const incrRes = await fetch(`${urlBase}/incr/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const incrVal = await incrRes.json();
      if (incrVal.result === 1) {
        await fetch(`${urlBase}/pexpire/${encodeURIComponent(key)}/${windowMs}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      const count = Number(incrVal.result);
      if (count > limit) {
        if (throwOnFail) {
          return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        return { ok: false, remaining: 0, resetMs: now + windowMs };
      }
      return { ok: true, remaining: Math.max(0, limit - count), resetMs: now + windowMs };
    }
  } catch {
    // fall through to in-memory
  }

  const store = globalAny.__centralRateLimit!;
  let bucket = store.get(key);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 1, resetAt: now + windowMs };
    store.set(key, bucket);
  } else {
    bucket.count += 1;
  }
  if (bucket.count > limit) {
    if (throwOnFail) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }
    return { ok: false, remaining: 0, resetMs: bucket.resetAt };
  }
  return { ok: true, remaining: limit - bucket.count, resetMs: bucket.resetAt };
}

// Convenience helpers
export const limiters = {
  register: (ip: string) =>
    limit({ keyParts: ['reg', ip], limit: 20, windowMs: 60_000, throwOnFail: true }),
  login: (ip: string) =>
    limit({ keyParts: ['login', ip], limit: 30, windowMs: 60_000, throwOnFail: true }),
  passwordRequest: (ip: string, email: string) =>
    limit({ keyParts: ['pwdreq', ip, email], limit: 5, windowMs: 60 * 60_000, throwOnFail: true }),
  resendVerify: (ip: string, email: string) =>
    limit({ keyParts: ['resend', ip, email], limit: 5, windowMs: 60 * 60_000, throwOnFail: true }),
};
