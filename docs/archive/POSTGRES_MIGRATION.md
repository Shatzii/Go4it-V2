# PostgreSQL Migration Guide

## Production Setup (Replit/Vercel)

### 1. Set Environment Variable
In your deployment platform (Replit Secrets or Vercel Environment Variables):

```bash
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

**Get a PostgreSQL database:**
- **Neon**: https://neon.tech (Recommended - free tier, serverless)
- **Supabase**: https://supabase.com (Free tier with GUI)
- **Railway**: https://railway.app (Free tier)
- **Vercel Postgres**: https://vercel.com/storage/postgres (If deploying to Vercel)

### 2. Run Migrations

```bash
# Push schema to PostgreSQL
npm run db:push

# Or generate and apply migrations
npm run db:generate
npm run db:migrate
```

### 3. Deploy

The app will automatically detect PostgreSQL from the `DATABASE_URL` and use it.

## Local Development

For local development, you can still use SQLite:

```bash
DATABASE_URL=file:./go4it-os.db
```

Or set up a local PostgreSQL instance.

## Migration Steps

### From SQLite to PostgreSQL

1. **Export data from SQLite** (if you have existing data):
```bash
# Using drizzle-kit
npx drizzle-kit push:sqlite
```

2. **Set up PostgreSQL connection**:
```bash
# Add to .env or deployment secrets
DATABASE_URL="postgresql://..."
```

3. **Push schema to PostgreSQL**:
```bash
npm run db:push
```

4. **Import data** (if migrating):
Use a tool like `pg_dump` or write a migration script.

## Troubleshooting

### Build Errors

If you see "Database not accessible during build":
- This is expected - the build phase doesn't need database access
- The app will connect to the database at runtime

### Connection Issues

- Verify DATABASE_URL is set correctly
- Check SSL requirements (`?sslmode=require` for cloud databases)
- Ensure your IP is whitelisted (for cloud PostgreSQL)
- Test connection: `psql $DATABASE_URL`

### Performance

PostgreSQL connection pooling is configured automatically:
- **Production**: max 10 connections, min 2
- **Development**: max 5 connections, min 1

## Environment Variables Checklist

✅ `DATABASE_URL` - PostgreSQL connection string
✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
✅ `CLERK_SECRET_KEY`
✅ `OPENAI_API_KEY` (optional)
✅ `ANTHROPIC_API_KEY` (optional)

## Recommended PostgreSQL Providers

1. **Neon** (Best for serverless)
   - Free tier: 3 GB storage
   - Serverless, auto-scaling
   - Built-in branching

2. **Supabase** (Best for full features)
   - Free tier: 500 MB database
   - Includes auth, storage, realtime
   - Nice GUI

3. **Railway** (Best for simplicity)
   - $5 credit free
   - One-click PostgreSQL
   - Simple interface

4. **Vercel Postgres** (Best if deploying to Vercel)
   - Free tier: 256 MB
   - Integrated with Vercel
   - Edge-friendly
