// Production Security Utilities

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { isProduction } from './production-config';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security middleware
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!isProduction) return response;

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

// Rate limiting
export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    // Reset window
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }
  
  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }
  
  current.count++;
  rateLimitStore.set(key, current);
  
  return { 
    allowed: true, 
    remaining: maxRequests - current.count, 
    resetTime: current.resetTime 
  };
}

// API key validation
export function validateApiKey(apiKey: string | null): boolean {
  if (!apiKey) return false;
  
  // In production, validate against stored API keys
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
  return validApiKeys.includes(apiKey);
}

// Input sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// JWT token validation
export function validateJwtToken(token: string): { valid: boolean; payload?: any } {
  try {
    // In production, use proper JWT validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false };
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < now) {
      return { valid: false };
    }
    
    return { valid: true, payload };
  } catch (error) {
    return { valid: false };
  }
}

// CORS validation
export function validateCorsOrigin(origin: string | null): boolean {
  if (!isProduction) return true;
  
  const allowedOrigins = [
    'https://go4itsports.org',
    'https://www.go4itsports.org',
    'https://admin.go4itsports.org'
  ];
  
  return origin ? allowedOrigins.includes(origin) : false;
}

// File upload validation
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const maxSize = 500 * 1024 * 1024; // 500MB
  const allowedTypes = [
    'video/mp4', 'video/quicktime', 'video/x-msvideo',
    'image/jpeg', 'image/png', 'image/webp',
    'application/pdf'
  ];
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large (max 500MB)' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }
  
  return { valid: true };
}

// SQL injection prevention
export function preventSqlInjection(query: string): boolean {
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(;|\||&|`|'|"|\\|\*|%|_|\[|\]|\{|\})/g,
    /(script|javascript|vbscript|onload|onerror)/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(query));
}

// Password strength validation
export function validatePasswordStrength(password: string): { 
  valid: boolean; 
  score: number; 
  feedback: string[] 
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score += 1;
  else feedback.push('Password must be at least 8 characters');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('Add numbers');
  
  if (/[^a-zA-Z\d]/.test(password)) score += 1;
  else feedback.push('Add special characters');
  
  return {
    valid: score >= 4,
    score,
    feedback
  };
}

// Session management
export class SessionManager {
  private static sessions = new Map<string, { userId: string; expiry: number }>();
  
  static createSession(userId: string, durationMs: number = 24 * 60 * 60 * 1000): string {
    const sessionId = crypto.randomUUID();
    const expiry = Date.now() + durationMs;
    
    this.sessions.set(sessionId, { userId, expiry });
    
    // Cleanup expired sessions
    this.cleanupExpiredSessions();
    
    return sessionId;
  }
  
  static validateSession(sessionId: string): { valid: boolean; userId?: string } {
    const session = this.sessions.get(sessionId);
    
    if (!session || Date.now() > session.expiry) {
      if (session) this.sessions.delete(sessionId);
      return { valid: false };
    }
    
    return { valid: true, userId: session.userId };
  }
  
  static destroySession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
  
  private static cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now > session.expiry) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

// Audit logging
export class AuditLogger {
  static log(event: {
    userId?: string;
    action: string;
    resource: string;
    ip?: string;
    userAgent?: string;
    timestamp?: Date;
    metadata?: any;
  }): void {
    const logEntry = {
      timestamp: event.timestamp || new Date(),
      userId: event.userId || 'anonymous',
      action: event.action,
      resource: event.resource,
      ip: event.ip,
      userAgent: event.userAgent,
      metadata: event.metadata
    };
    
    // In production, send to logging service
    if (isProduction) {
      console.log('[AUDIT]', JSON.stringify(logEntry));
    } else {
      console.log('[AUDIT]', logEntry);
    }
  }
}