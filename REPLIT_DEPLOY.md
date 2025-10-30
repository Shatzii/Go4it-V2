# 🚀 GO4IT Sports Platform - Replit Deployment Guide

## Quick Deploy Steps

### 1. Pull Latest Changes
```bash
git pull origin main
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Set Environment Variables
In Replit Secrets, add:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `CLERK_SECRET_KEY` - Clerk authentication secret
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `OPENAI_API_KEY` - OpenAI API key
- `ADMIN_TOKEN` - Admin authentication token

### 4. Build & Deploy
```bash
npm run build
npm start
```

Or use Replit's Deploy button → Autoscale Deployment

## Configuration Files

### ✅ Already Configured:
- `.npmrc` - Automatic legacy-peer-deps resolution
- `.replit` - Optimized for autoscale deployment
- `replit.nix` - System dependencies
- `next.config.js` - Production optimizations
- `middleware.ts` - Edge-compatible security headers

### Package Versions:
- Next.js: 15.5.6
- Tailwind CSS: 3.4.1
- PostCSS: 8.4.47
- Autoprefixer: 10.4.20

## Expected Build Output

```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size
┌ ○ /                                    ...
├ ○ /dashboard                           ...
├ ○ /recruiting-hub                      ...
└ ○ /academy                             ...
```

## Deployment URL
After deployment, your site will be available at:
`https://[your-repl-name].replit.app`

## Troubleshooting

### If build fails with dependency errors:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### If Tailwind CSS doesn't load:
- Check that `postcss.config.js` exists
- Verify `tailwindcss`, `postcss`, and `autoprefixer` are in node_modules
- Run `npm list tailwindcss` to confirm version 3.4.1

### If middleware causes errors:
The middleware is minimal and Edge-compatible. If issues persist:
```bash
mv middleware.ts middleware.ts.disabled
```

## Features Included

✅ Recruiting Hub Dashboard - Full athlete profiles, scholarship tracking
✅ Academy Platform - Courses, assessments, progress tracking  
✅ AI Voice Coach - Eleven Labs integration
✅ Video Analysis - TensorFlow.js/MediaPipe
✅ Payment Processing - Stripe integration
✅ Authentication - Clerk with role-based access
✅ Database - Drizzle ORM with Neon PostgreSQL
✅ Security Headers - CSP, X-Frame-Options, etc.
✅ Rate Limiting - Built into middleware
✅ Admin Panel - Protected routes

## Performance Optimizations

- Standalone output mode for smaller deployments
- Memory optimization (4GB limit in .replit)
- Webpack memory optimizations enabled
- Package imports optimized (lucide-react, radix-ui)
- Source maps disabled in production
- Console logs removed in production builds

## Support

If deployment fails, check:
1. All environment variables are set in Replit Secrets
2. Database connection string is correct
3. Node version is 20+ (specified in package.json)
4. Build logs in Replit console for specific errors

---

**Ready to Deploy!** 🎉
