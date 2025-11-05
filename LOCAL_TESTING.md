# Local Testing Guide

## Quick Start

### 1. Run Pre-flight Check
```bash
./scripts/test-local.sh
```

### 2. Start Development Server
```bash
npm run dev
```
- **URL**: http://localhost:3000
- **Auto-reload**: Yes (hot module replacement)
- **Best for**: Development & testing features

### 3. Test Production Build
```bash
npm run build
npm run start
```
- **URL**: http://localhost:3000
- **Auto-reload**: No (production mode)
- **Best for**: Testing production performance

---

## ✅ Current Status

**Server Running**: http://localhost:3000
- ✅ Next.js compiled successfully
- ✅ Middleware active
- ✅ Hot reload enabled
- ⚠️ Database connection pending (needs real PostgreSQL)

---

## Required Setup

### Essential (Already Done)
- ✅ `.env` file created
- ✅ Dependencies installed
- ✅ Next.js configured

### Optional (Add when ready)
1. **Clerk Authentication**
   - Get keys from: https://dashboard.clerk.com
   - Add to `.env`:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
     CLERK_SECRET_KEY="sk_test_..."
     ```

2. **PostgreSQL Database**
   - Install PostgreSQL locally
   - Update `.env`:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/go4it"
     ```
   - Run migrations:
     ```bash
     npm run db:push
     ```

3. **Stripe Payments** (Optional)
   - Get test keys from: https://dashboard.stripe.com
   - Add to `.env`

---

## Testing Different Pages

### Homepage
```
http://localhost:3000
```

### Dashboard (requires Clerk auth)
```
http://localhost:3000/dashboard
```

### API Health Check
```
http://localhost:3000/api/health
```

### Academy
```
http://localhost:3000/academy
```

---

## Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run type-check            # Check TypeScript (will show errors)
npm run lint                  # Check code style

# Database
npm run db:push               # Push schema changes
npm run db:studio             # Open Drizzle Studio (database GUI)
npm run seed:production       # Seed with sample data

# Production Testing
npm run build                 # Build for production
npm run build:production      # Build with optimizations
npm run start                 # Start production server
npm run start:production      # Start with production env

# Deployment Scripts
./scripts/pre-flight.sh       # Check before deploy
./scripts/deploy-production.sh # Full deployment
```

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Database Connection Error
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Try: `psql $DATABASE_URL -c "SELECT 1"`

### Build Errors
- TypeScript errors won't block the build (ignoreBuildErrors: true)
- For serious issues, check: `npm run type-check:production`

### Missing Modules
```bash
# Clean install
rm -rf node_modules .next
npm install
```

---

## Development Workflow

1. **Make changes** to code
2. **Auto-reload** shows changes instantly
3. **Check console** for errors
4. **Test features** in browser
5. **Check terminal** for server logs

---

## Next Steps

1. ✅ **Local testing active** (development server running)
2. 🔄 **Add Clerk keys** (for authentication testing)
3. 🔄 **Setup PostgreSQL** (for database features)
4. 🔄 **Test all pages** (browse and interact)
5. 🔄 **Check API endpoints** (use browser or Postman)
6. 🚀 **Deploy to Replit** (when ready)

---

## Performance Monitoring

While testing locally, watch for:
- ✅ Fast page loads (< 2s)
- ✅ No console errors
- ✅ Smooth navigation
- ✅ Responsive design
- ⚠️ Memory leaks (check Chrome DevTools)

---

## Environment Comparison

| Feature | Local Dev | Production |
|---------|-----------|------------|
| Hot Reload | ✅ Yes | ❌ No |
| Source Maps | ✅ Yes | ❌ No |
| Minification | ❌ No | ✅ Yes |
| Type Checking | ⚠️ Warn | ⚠️ Skip |
| Speed | 🐢 Slower | 🚀 Faster |

---

## Ready to Deploy?

When local testing is complete:

```bash
# Run full deployment to Replit
./scripts/deploy-production.sh
```

Or push to GitHub and deploy from Replit dashboard.
