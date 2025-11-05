#!/bin/bash
# Deployment Pre-Check Script
# Run this before deploying to catch common issues

echo "🔍 Go4It Deployment Pre-Check"
echo "================================"
echo ""

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is not set"
  echo "   Set it to your PostgreSQL connection string:"
  echo "   export DATABASE_URL='postgresql://user:pass@host:port/db'"
  echo ""
  exit 1
else
  echo "✅ DATABASE_URL is set"
  # Check if it's PostgreSQL
  if [[ $DATABASE_URL == postgresql://* ]] || [[ $DATABASE_URL == postgres://* ]]; then
    echo "   Using PostgreSQL ✓"
  elif [[ $DATABASE_URL == file:* ]]; then
    echo "   ⚠️  Using SQLite (not recommended for production)"
  else
    echo "   ⚠️  Unknown database type"
  fi
fi

# Check Clerk keys
if [ -z "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ]; then
  echo "❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set"
  exit 1
else
  echo "✅ Clerk publishable key is set"
fi

if [ -z "$CLERK_SECRET_KEY" ]; then
  echo "❌ CLERK_SECRET_KEY is not set"
  exit 1
else
  echo "✅ Clerk secret key is set"
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js version is too old (need 20+, got $NODE_VERSION)"
  exit 1
else
  echo "✅ Node.js version is compatible ($NODE_VERSION)"
fi

echo ""
echo "================================"
echo "✅ All checks passed!"
echo ""
echo "Next steps:"
echo "1. Run: npm run db:push (to set up database schema)"
echo "2. Run: npm run build (to test build locally)"
echo "3. Deploy to your platform"
echo ""
