/**
 * Security Headers Middleware
 * 
 * Applies comprehensive security headers to all HTTP responses
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Apply security headers to all responses
 */
export function securityHeaders(request: NextRequest) {
  const response = NextResponse.next();
  
  // Prevent XSS attacks
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  const isDevelopment = process.env.NODE_ENV === 'development';
  const cspPolicy = [
    "default-src 'self'",
    isDevelopment 
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" 
      : "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.anthropic.com https://api.openai.com",
    "frame-src 'none'",
    "object-src 'none'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspPolicy);
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  
  return response;
}

/**
 * CORS configuration for API endpoints
 */
export function corsHeaders(origin?: string) {
  const allowedOrigins = [
    'http://localhost:5000',
    'https://go4itsports.org',
    process.env.CLIENT_URL,
    process.env.PRODUCTION_DOMAIN
  ].filter(Boolean);
  
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
}