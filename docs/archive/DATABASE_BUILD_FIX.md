# 🚀 DATABASE BUILD FIX - DEPLOYMENT GUIDE

## Problem
Next.js build fails because database connections initialize during build phase when the database doesn't exist yet.

## ✅ Solution Implemented

### 1. Build-Time Database Skip
Both `lib/db/index.ts` and `server/db.ts` now check for:
- `NEXT_PHASE === 'phase-production-build'` (Next.js build phase)
- `SKIP_DB_INIT === 'true'` (manual override for deployment)
- `typeof window !== 'undefined'` (client-side safety)

### 2. PostgreSQL-First Architecture
- ✅ PostgreSQL is the primary database
- ✅ SQLite only for local development (optional)
- ✅ No SQLite files needed in deployment

---

## 🔧 Deployment Configuration

### Option A: Vercel/Netlify (Recommended)

**Environment Variables:**
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SKIP_DB_INIT=false  # Optional - only set to 'true' if build fails
NODE_ENV=production
```

**Build Settings:**
- Build Command: `npm run build`
- Install Command: `npm ci`
- No special database setup needed!

### Option B: Railway/Render

**Environment Variables:**
```bash
DATABASE_URL=${{ RAILWAY.DATABASE_URL }}  # Railway provides this
NODE_ENV=production
```

**Build Command:**
```bash
npm ci && npm run build
```

### Option C: Docker/Self-Hosted

**Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Set environment for build
ENV SKIP_DB_INIT=true
ENV NODE_ENV=production

# Build Next.js (database will be skipped)
RUN npm run build

# Runtime: Database will connect automatically
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/go4it
      - NODE_ENV=production
    depends_on:
      - postgres
  
  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=go4it
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 🔍 How It Works

### Build Phase (Database Skipped)
```typescript
// lib/db/index.ts
const isBuildPhase = 
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.SKIP_DB_INIT === 'true';

if (isBuildPhase) {
  console.log('Build phase - skipping database');
  db = null; // ✅ No database connection attempted
}
```

### Runtime (Database Connects)
```typescript
else if (DATABASE_URL.startsWith('postgresql')) {
  // ✅ PostgreSQL connection established at runtime
  const queryClient = postgres(DATABASE_URL, {
    max: 10,
    idle_timeout: 60,
  });
  db = drizzle(queryClient, { schema });
}
```

### API Routes (Safe)
```typescript
// All API routes have this protection:
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Build phase' }, { status: 503 });
}

const { userId } = await auth();
// ... database operations only happen at runtime
```

---

## 🎯 Deployment Steps

### Step 1: Set Environment Variables
In your deployment platform, set:
```bash
DATABASE_URL=postgresql://...  # Your PostgreSQL connection string
NODE_ENV=production
```

### Step 2: Deploy
```bash
git push origin main
```

### Step 3: Verify
After deployment, check:
```bash
curl https://your-app.com/api/healthz
```

Should return:
```json
{
  "timestamp": "2025-11-07T...",
  "overall": "healthy",
  "systems": {
    "database": {
      "status": "healthy",
      "latency": 23
    }
  }
}
```

---

## 🚨 Troubleshooting

### Build Still Fails?

**Option 1: Force Skip Database**
```bash
# Add to deployment environment variables
SKIP_DB_INIT=true
```

**Option 2: Check Build Logs**
Look for:
```
✅ "Build phase detected - skipping database initialization"
```

If you see database connection errors during build, the skip didn't work.

**Option 3: Verify DATABASE_URL**
```bash
# Must be PostgreSQL, not SQLite:
✅ DATABASE_URL=postgresql://user:pass@host:5432/dbname
❌ DATABASE_URL=file:./go4it-os.db
```

### Runtime Connection Fails?

**Check Database URL:**
```bash
# In deployment logs, you should see:
[lib/db] Using PostgreSQL: postgresql://****@host:5432/dbname
```

**Verify Database Exists:**
```bash
psql $DATABASE_URL -c "SELECT 1;"
```

**Check Network Access:**
- Database must allow connections from your deployment IP
- Firewall rules must allow port 5432
- SSL may be required (add `?sslmode=require` to URL)

---

## 📋 Migration from SQLite to PostgreSQL

If you have existing SQLite data:

### 1. Export SQLite Data
```bash
node -e "
const Database = require('better-sqlite3');
const db = new Database('./go4it-os.db');
const data = db.prepare('SELECT * FROM users').all();
console.log(JSON.stringify(data, null, 2));
" > users.json
```

### 2. Import to PostgreSQL
```bash
# Connect to PostgreSQL
psql $DATABASE_URL

# Create tables (Drizzle will auto-create)
# Then import data...
```

### 3. Update Environment
```bash
# Change from:
DATABASE_URL=file:./go4it-os.db

# To:
DATABASE_URL=postgresql://user:pass@host:5432/go4it
```

---

## ✅ Checklist

Before deploying, verify:

- [ ] `DATABASE_URL` set to PostgreSQL connection string
- [ ] `NODE_ENV=production` set
- [ ] Database exists and is accessible
- [ ] Database user has CREATE/INSERT/UPDATE/DELETE permissions
- [ ] SSL configured if required by hosting provider
- [ ] Build command is `npm run build` (no database setup)
- [ ] Health check endpoint `/api/healthz` returns 200 OK after deploy

---

## 🎉 Success Indicators

After successful deployment:

1. **Build Completes:**
   ```
   ✓ Compiled successfully
   ✓ Collecting page data
   ✓ Generating static pages (100/100)
   ```

2. **Runtime Connects:**
   ```
   [lib/db] Using PostgreSQL: postgresql://****
   Database connection established
   ```

3. **Health Check Passes:**
   ```bash
   curl https://your-app.com/api/healthz
   # Returns: { "overall": "healthy", "systems": { "database": { "status": "healthy" } } }
   ```

---

## 📞 Support

If you still have issues:

1. Check deployment logs for database errors
2. Verify `SKIP_DB_INIT=true` is set during build
3. Confirm PostgreSQL is running and accessible
4. Review firewall/network settings
5. Check SSL requirements for your database host

**Common Issues:**
- ❌ `DATABASE_URL` still points to SQLite (`file:...`)
- ❌ Database doesn't exist yet (create it first)
- ❌ Network/firewall blocking port 5432
- ❌ SSL required but not configured in connection string

---

**Last Updated:** November 7, 2025  
**Status:** ✅ READY FOR DEPLOYMENT
