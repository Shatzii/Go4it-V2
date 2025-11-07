/**
 * Rate Limiting Utilities for Production
 * 
 * Implements in-memory rate limiting for API endpoints
 * For production, consider using Redis or Upstash for distributed rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /**
   * Maximum number of requests per window
   */
  max: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  
  /**
   * Custom identifier key (defaults to IP address)
   */
  keyGenerator?: (identifier: string) => string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if a request should be rate limited
 * 
 * @param identifier - Unique identifier (usually IP address or user ID)
 * @param options - Rate limiting configuration
 * @returns Rate limit result with remaining quota
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const key = options.keyGenerator ? options.keyGenerator(identifier) : identifier;
  const now = Date.now();
  
  let entry = rateLimitStore.get(key);
  
  // Create new entry if doesn't exist or window expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + options.windowMs,
    };
    rateLimitStore.set(key, entry);
  }
  
  // Increment count
  entry.count++;
  
  const remaining = Math.max(0, options.max - entry.count);
  const success = entry.count <= options.max;
  
  return {
    success,
    limit: options.max,
    remaining,
    reset: entry.resetTime,
  };
}

/**
 * Rate limit response headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
}

/**
 * Common rate limit configurations
 */
export const RateLimitPresets = {
  /** Very strict - for expensive operations (10 per hour) */
  STRICT: { max: 10, windowMs: 60 * 60 * 1000 },
  
  /** Standard - for most API endpoints (100 per 15 minutes) */
  STANDARD: { max: 100, windowMs: 15 * 60 * 1000 },
  
  /** Generous - for read-only operations (300 per 15 minutes) */
  GENEROUS: { max: 300, windowMs: 15 * 60 * 1000 },
  
  /** Webhook - for external webhooks (1000 per hour) */
  WEBHOOK: { max: 1000, windowMs: 60 * 60 * 1000 },
  
  /** Auth - for login/signup (5 per 15 minutes) */
  AUTH: { max: 5, windowMs: 15 * 60 * 1000 },
};

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  // Check common proxy headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to unknown
  return 'unknown';
}

/**
 * Middleware helper to apply rate limiting to API routes
 * 
 * @example
 * ```ts
 * export async function POST(request: Request) {
 *   const rateLimit = await applyRateLimit(request, RateLimitPresets.STANDARD);
 *   if (!rateLimit.success) {
 *     return new Response('Too many requests', {
 *       status: 429,
 *       headers: getRateLimitHeaders(rateLimit),
 *     });
 *   }
 *   // ... rest of handler
 * }
 * ```
 */
export async function applyRateLimit(
  request: Request,
  options: RateLimitOptions,
  identifier?: string
): Promise<RateLimitResult> {
  const ip = identifier || getClientIp(request);
  return checkRateLimit(ip, options);
}
