# 🚀 Replit Production Deployment Guide - Go4it v2.1

**Last Updated:** November 5, 2025  
**Platform:** Go4it Sports Academy - Online NCAA Readiness School  
**Environment:** Replit Production

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Replit Configuration](#replit-configuration)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Performance Optimizations](#performance-optimizations)
6. [Security Hardening](#security-hardening)
7. [Monitoring & Logging](#monitoring--logging)
8. [Deployment Steps](#deployment-steps)
9. [Post-Deployment Verification](#post-deployment-verification)
10. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Critical Items:
- [ ] All environment variables configured in Replit Secrets
- [ ] Database migrations completed
- [ ] Ollama models downloaded and tested
- [ ] Whisper Docker service running
- [ ] Cloudflare R2 buckets created and accessible
- [ ] Stripe webhooks configured
- [ ] Clerk authentication keys (production) set
- [ ] SSL/TLS certificates validated
- [ ] Domain DNS pointed to Replit
- [ ] All API endpoints tested
- [ ] Build process successful
- [ ] Production dependencies installed

### Nice-to-Have:
- [ ] Sentry error tracking configured
- [ ] PostHog analytics setup
- [ ] Backup automation scripts ready
- [ ] Monitoring dashboards configured
- [ ] Load testing completed

---

## ⚙️ Replit Configuration

### .replit File (Optimized)

```toml
# Go4it v2.1 - Production Configuration
run = "npm run start:production"

[env]
NODE_ENV = "production"
PORT = "3000"

[nix]
channel = "stable-23_11"

[deployment]
run = ["sh", "-c", "npm run build && npm run start:production"]
deploymentTarget = "cloudrun"
ignorePorts = false

[[ports]]
localPort = 3000
externalPort = 80

[[ports]]
localPort = 11434
externalPort = 11434
exposeLocalhost = true

[[ports]]
localPort = 8000
externalPort = 8000
exposeLocalhost = true
```

### replit.nix (Production Dependencies)

```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.postgresql_15
    pkgs.docker
    pkgs.docker-compose
    pkgs.ffmpeg
    pkgs.imagemagick
    pkgs.git
    pkgs.curl
    pkgs.nginx
  ];
  
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
      pkgs.stdenv.cc.cc
    ];
  };
}
```

---

## 🔐 Environment Variables

### Required Production Variables

Create a `.env.production` file (DO NOT commit to Git):

```bash
# =============================================================================
# PRODUCTION ENVIRONMENT - Go4it v2.1
# =============================================================================

# Node Environment
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://go4itsports.org
NEXT_PUBLIC_SITE_URL=https://go4itsports.org

# =============================================================================
# DATABASE
# =============================================================================
DATABASE_URL=postgresql://user:password@host:5432/go4it_production
DATABASE_POOL_SIZE=20
DATABASE_IDLE_TIMEOUT=30000
DATABASE_CONNECTION_TIMEOUT=10000

# =============================================================================
# AUTHENTICATION (Clerk - Production Keys)
# =============================================================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXX
CLERK_SECRET_KEY=sk_live_XXXXXXXXXXXXXX
CLERK_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXX

# =============================================================================
# PAYMENTS (Stripe - Production Keys)
# =============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXX

# Product IDs
STRIPE_TRANSCRIPT_AUDIT_PRICE_ID=price_XXXXXXXXXXXXXX
STRIPE_STARPATH_MONTHLY_PRICE_ID=price_XXXXXXXXXXXXXX
STRIPE_SUPPLEMENTAL_COURSE_PRICE_ID=price_XXXXXXXXXXXXXX

# =============================================================================
# CLOUDFLARE R2 STORAGE
# =============================================================================
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=go4it-production-drills
CLOUDFLARE_CDN_URL=https://cdn.go4itsports.com
CLOUDFLARE_R2_REGION=auto

# =============================================================================
# AI SERVICES (Self-Hosted)
# =============================================================================
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_FAST_MODEL=claude-educational-primary:7b
OLLAMA_EMBED_MODEL=nomic-embed-text
OLLAMA_TIMEOUT=60000

WHISPER_SERVICE_URL=http://localhost:8000
WHISPER_MODEL=base
WHISPER_TIMEOUT=120000

# =============================================================================
# EMAIL (SMTP)
# =============================================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=noreply@go4itsports.org
SMTP_PASS=your_app_password
SMTP_FROM=Go4it Sports Academy <noreply@go4itsports.org>

# SMS Carrier Gateways (Email-to-SMS)
SMS_ENABLE_EMAIL_TO_SMS=true

# =============================================================================
# LIVEKIT (Optional - Video Conferencing)
# =============================================================================
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
LIVEKIT_URL=wss://go4it.livekit.cloud
NEXT_PUBLIC_LIVEKIT_URL=wss://go4it.livekit.cloud

# =============================================================================
# MONITORING & ANALYTICS
# =============================================================================
SENTRY_DSN=https://XXXXXX@sentry.io/XXXXXX
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1

POSTHOG_API_KEY=phc_XXXXXXXXXXXXXX
POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_POSTHOG_KEY=phc_XXXXXXXXXXXXXX
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# =============================================================================
# SECURITY
# =============================================================================
NEXTAUTH_SECRET=generate_random_32_char_string
NEXTAUTH_URL=https://go4itsports.org

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000

# CORS
CORS_ORIGINS=https://go4itsports.org,https://www.go4itsports.org

# =============================================================================
# FEATURE FLAGS
# =============================================================================
FEATURE_SMART_ROUTING=true
FEATURE_PROGRESSIVE_LOADING=true
FEATURE_PERFORMANCE_MONITORING=true
FEATURE_PREDICTIVE_CACHING=true
FEATURE_REMOTE_GAR_VERIFICATION=true
FEATURE_SUPPLEMENTAL_ENROLLMENT=true

# =============================================================================
# CACHING
# =============================================================================
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600

# =============================================================================
# LOGGING
# =============================================================================
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=/var/log/go4it/app.log

# =============================================================================
# BUILD OPTIMIZATION
# =============================================================================
NEXT_TELEMETRY_DISABLED=1
ANALYZE_BUNDLE=false
GENERATE_SOURCEMAP=false
```

### Setting Environment Variables in Replit:

1. Open your Replit project
2. Click on "Secrets" (lock icon) in the left sidebar
3. Add each variable from above individually
4. Click "Add new secret" for each entry

---

## 🗄️ Database Setup

### PostgreSQL Optimization for Production

```sql
-- Production Database Configuration
-- Run these commands in your PostgreSQL instance

-- Optimize for production workload
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET max_wal_size = '4GB';

-- Connection pooling
ALTER SYSTEM SET max_connections = 100;

-- Reload configuration
SELECT pg_reload_conf();
```

### Migration Script

```bash
#!/bin/bash
# migrate-production.sh

echo "🔄 Running production database migrations..."

# Backup database first
echo "📦 Creating backup..."
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Run migrations
echo "⚙️ Applying migrations..."
npx drizzle-kit push:pg

# Seed essential data
echo "🌱 Seeding data..."
npm run seed:production

echo "✅ Migration complete!"
```

---

## ⚡ Performance Optimizations

### 1. Next.js Configuration (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  
  // Image optimization
  images: {
    domains: ['cdn.go4itsports.com', 'pub-*.r2.dev'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
  },
  
  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

### 2. Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000",
    "start:production": "NODE_ENV=production next start -p 3000",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    
    "seed:production": "tsx scripts/seed-production.ts",
    "populate:colleges": "curl -X POST https://go4itsports.org/api/colleges/populate",
    
    "docker:ollama": "docker run -d -p 11434:11434 --name ollama --restart unless-stopped -v ollama_data:/root/.ollama ollama/ollama:latest",
    "docker:whisper": "docker run -d -p 8000:8000 --name whisper --restart unless-stopped ghcr.io/openai/whisper:latest",
    
    "health:check": "curl http://localhost:3000/api/health",
    "test:production": "NODE_ENV=production npm run build && npm run health:check",
    
    "analyze": "ANALYZE=true npm run build",
    "clean": "rm -rf .next out node_modules/.cache"
  }
}
```

### 3. Docker Compose for Services

```yaml
# docker-compose.production.yml
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    container_name: go4it-ollama-prod
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_ORIGINS=*
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 8G
        reservations:
          memory: 4G

  whisper:
    image: ghcr.io/openai/whisper:latest
    container_name: go4it-whisper-prod
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - WHISPER_MODEL=base
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G

  redis:
    image: redis:7-alpine
    container_name: go4it-redis-prod
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: go4it-nginx-prod
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - ollama
      - whisper
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  ollama_data:
  redis_data:
```

---

## 🔒 Security Hardening

### 1. Rate Limiting Middleware

```typescript
// middleware/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export async function rateLimit(
  request: NextRequest,
  limit: number = 100,
  window: number = 60000
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const key = `rate_limit:${ip}`;
  
  const requests = await redis.incr(key);
  
  if (requests === 1) {
    await redis.expire(key, Math.floor(window / 1000));
  }
  
  if (requests > limit) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  return null;
}
```

### 2. Security Headers

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 3. Input Validation Schema

```typescript
// lib/validation/production.ts
import { z } from 'zod';

export const transcriptAuditSchema = z.object({
  athleteId: z.string().uuid(),
  transcriptData: z.object({
    courses: z.array(z.object({
      name: z.string().max(200),
      grade: z.string().max(5),
      credits: z.number().min(0).max(10),
      year: z.number().min(2020).max(2030),
    })),
  }).refine(
    (data) => data.courses.length <= 100,
    { message: 'Too many courses' }
  ),
});

export const drillUploadSchema = z.object({
  title: z.string().min(3).max(200),
  sport: z.enum(['football', 'basketball', 'soccer', 'track', 'baseball']),
  fileSize: z.number().max(500 * 1024 * 1024), // 500MB max
});
```

---

## 📊 Monitoring & Logging

### 1. Winston Logger Configuration

```typescript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'go4it-v2' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 10485760,
      maxFiles: 5,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

### 2. Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {
      database: 'unknown',
      ollama: 'unknown',
      whisper: 'unknown',
      r2: 'unknown',
    },
    version: '2.1',
    environment: process.env.NODE_ENV,
  };

  try {
    // Check database
    await db.execute('SELECT 1');
    checks.services.database = 'connected';
  } catch (error) {
    checks.services.database = 'error';
    checks.status = 'degraded';
  }

  try {
    // Check Ollama
    const ollamaResponse = await fetch(`${process.env.OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    });
    checks.services.ollama = ollamaResponse.ok ? 'running' : 'error';
  } catch (error) {
    checks.services.ollama = 'error';
  }

  try {
    // Check Whisper
    const whisperResponse = await fetch(`${process.env.WHISPER_SERVICE_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    checks.services.whisper = whisperResponse.ok ? 'running' : 'error';
  } catch (error) {
    checks.services.whisper = 'error';
  }

  // Check R2 (simple presence check)
  checks.services.r2 = process.env.CLOUDFLARE_R2_BUCKET_NAME ? 'configured' : 'missing';

  const statusCode = checks.status === 'healthy' ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}
```

---

## 🚀 Deployment Steps

### Step 1: Pre-Flight Checks

```bash
#!/bin/bash
# pre-flight.sh

echo "🔍 Running pre-flight checks..."

# Check Node version
node_version=$(node -v)
echo "✓ Node version: $node_version"

# Check npm version
npm_version=$(npm -v)
echo "✓ npm version: $npm_version"

# Type check
echo "📝 Type checking..."
npm run type-check

# Lint
echo "🔍 Linting..."
npm run lint

# Build test
echo "🏗️ Test build..."
npm run build

echo "✅ Pre-flight checks complete!"
```

### Step 2: Build Process

```bash
#!/bin/bash
# build-production.sh

echo "🏗️ Building Go4it v2.1 for production..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next out

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Generate Prisma/Drizzle client
echo "⚙️ Generating database client..."
npm run db:generate

# Build Next.js
echo "🔨 Building Next.js application..."
NODE_ENV=production npm run build

# Check build size
echo "📊 Build analysis:"
du -sh .next

echo "✅ Build complete!"
```

### Step 3: Start Services

```bash
#!/bin/bash
# start-services.sh

echo "🚀 Starting Go4it production services..."

# Start Docker services
echo "🐳 Starting Docker containers..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 10

# Download Ollama models
echo "📥 Downloading Ollama models..."
docker exec go4it-ollama-prod ollama pull claude-educational-primary:7b
docker exec go4it-ollama-prod ollama pull nomic-embed-text

# Verify services
echo "✅ Verifying services..."
curl -f http://localhost:11434/api/tags || echo "❌ Ollama not ready"
curl -f http://localhost:8000/health || echo "❌ Whisper not ready"

echo "✅ Services started!"
```

### Step 4: Database Migration

```bash
#!/bin/bash
# migrate-and-seed.sh

echo "🗄️ Setting up production database..."

# Backup existing database
echo "📦 Creating backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backups/backup_${timestamp}.sql"

# Run migrations
echo "⚙️ Running migrations..."
npm run db:migrate

# Seed essential data
echo "🌱 Seeding production data..."
npm run seed:production

# Populate colleges
echo "🏫 Populating college database..."
npm run populate:colleges

echo "✅ Database setup complete!"
```

### Step 5: Start Application

```bash
#!/bin/bash
# start-app.sh

echo "🎬 Starting Go4it application..."

# Set production environment
export NODE_ENV=production

# Start application
npm run start:production &

# Save PID
echo $! > app.pid

# Wait for startup
echo "⏳ Waiting for application to start..."
sleep 15

# Health check
echo "🏥 Running health check..."
response=$(curl -s http://localhost:3000/api/health)
echo $response

if echo $response | grep -q '"status":"healthy"'; then
  echo "✅ Application is healthy!"
else
  echo "❌ Application health check failed!"
  exit 1
fi

echo "✅ Go4it v2.1 is live!"
```

### Master Deployment Script

```bash
#!/bin/bash
# deploy-production.sh - Master deployment script

set -e  # Exit on any error

echo "🚀 Go4it v2.1 - Production Deployment"
echo "======================================"

# Pre-flight checks
./scripts/pre-flight.sh

# Build application
./scripts/build-production.sh

# Start services
./scripts/start-services.sh

# Database setup
./scripts/migrate-and-seed.sh

# Start application
./scripts/start-app.sh

echo ""
echo "✅ Deployment complete!"
echo "🌐 Application: https://go4itsports.org"
echo "📊 Health Check: https://go4itsports.org/api/health"
echo ""
```

---

## ✅ Post-Deployment Verification

### Verification Checklist

```bash
#!/bin/bash
# verify-deployment.sh

echo "🔍 Verifying Go4it v2.1 deployment..."

# 1. Health check
echo "1️⃣ Checking application health..."
health=$(curl -s https://go4itsports.org/api/health)
echo $health | jq '.'

# 2. Database connectivity
echo "2️⃣ Checking database..."
psql $DATABASE_URL -c "SELECT COUNT(*) FROM colleges;" || echo "❌ Database check failed"

# 3. Ollama availability
echo "3️⃣ Checking Ollama..."
curl -s http://localhost:11434/api/tags | jq '.models | length'

# 4. Whisper availability
echo "4️⃣ Checking Whisper..."
curl -s http://localhost:8000/health

# 5. R2 storage
echo "5️⃣ Checking Cloudflare R2..."
# Test upload (implement based on your R2 setup)

# 6. Clerk authentication
echo "6️⃣ Checking Clerk..."
curl -s https://go4itsports.org/api/auth/session

# 7. Stripe webhooks
echo "7️⃣ Checking Stripe..."
# Verify webhook endpoint is accessible

# 8. Critical pages
echo "8️⃣ Checking critical pages..."
curl -s -o /dev/null -w "%{http_code}" https://go4itsports.org
curl -s -o /dev/null -w "%{http_code}" https://go4itsports.org/starpath
curl -s -o /dev/null -w "%{http_code}" https://go4itsports.org/academy
curl -s -o /dev/null -w "%{http_code}" https://go4itsports.org/drills

echo "✅ Verification complete!"
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules/.cache
npm ci
npm run build
```

#### 2. Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Check connection pool
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
```

#### 3. Ollama Not Responding

```bash
# Restart Ollama
docker restart go4it-ollama-prod

# Check logs
docker logs go4it-ollama-prod --tail 100

# Verify models
docker exec go4it-ollama-prod ollama list
```

#### 4. Memory Issues

```bash
# Check memory usage
free -h
docker stats

# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run start:production
```

#### 5. Port Conflicts

```bash
# Check what's using ports
lsof -i :3000
lsof -i :11434
lsof -i :8000

# Kill process
kill -9 <PID>
```

### Logs & Debugging

```bash
# Application logs
tail -f logs/combined.log
tail -f logs/error.log

# Docker logs
docker logs go4it-ollama-prod -f
docker logs go4it-whisper-prod -f

# Next.js logs
cat .next/trace

# System logs
journalctl -u go4it -f
```

---

## 📞 Emergency Contacts

**Technical Issues:**
- DevOps Team: devops@go4itsports.org
- Database Admin: dba@go4itsports.org

**Business Critical:**
- CTO: cto@go4itsports.org
- On-Call: +1-205-434-8405

**Service Providers:**
- Replit Support: support@replit.com
- Cloudflare Support: support.cloudflare.com

---

## 📚 Additional Resources

- [Replit Documentation](https://docs.replit.com/)
- [Next.js Production Guide](https://nextjs.org/docs/deployment)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Deployment Version:** 2.1  
**Last Deployed:** Run `date` command to timestamp  
**Deployed By:** [Your Name]  
**Environment:** Production (Replit)

---

*This guide is part of the Go4it v2.1 documentation suite. For platform documentation, see GO4IT_COMPLETE_PLATFORM_DOCUMENTATION.md*
