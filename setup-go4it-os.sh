#!/bin/bash

# Go4It OS Setup Automation Script
# This script automates the 3 critical setup steps for Go4It OS

set -e  # Exit on any error

echo "🚀 Go4It OS Setup Automation"
echo "============================"
echo ""

# Step 1: Environment Variables Setup
echo "Step 1: Setting up environment variables..."
echo "=========================================="

# Check if .env.local exists, if not create from template
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

# Check for required environment variables
echo "Checking required environment variables..."

# Database URL
if ! grep -q "^DATABASE_URL=" .env.local; then
    echo "⚠️  DATABASE_URL not found in .env.local"
    echo "   Please set: DATABASE_URL=\"postgresql://username:password@localhost:5432/go4it_sports\""
fi

# Clerk Keys
if ! grep -q "^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=" .env.local; then
    echo "⚠️  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY not found in .env.local"
    echo "   Please get this from your Clerk dashboard"
fi

if ! grep -q "^CLERK_SECRET_KEY=" .env.local; then
    echo "⚠️  CLERK_SECRET_KEY not found in .env.local"
    echo "   Please get this from your Clerk dashboard"
fi

# Supabase (optional but recommended)
if ! grep -q "^SUPABASE_URL=" .env.local; then
    echo "ℹ️  SUPABASE_URL not found (optional for audit logging)"
    echo "   Get from: https://supabase.com/dashboard"
fi

echo "✅ Environment variables check complete"
echo ""

# Step 2: Database Schema Deployment
echo "Step 2: Deploying database schema..."
echo "===================================="

# Check if DATABASE_URL is set
if ! grep -q "^DATABASE_URL=" .env.local || grep -q "^DATABASE_URL=.*\$" .env.local; then
    echo "⚠️  DATABASE_URL not configured. Skipping database deployment."
    echo "   Please set DATABASE_URL in .env.local first"
else
    echo "Deploying schema to database..."
    if npx drizzle-kit push; then
        echo "✅ Database schema deployed successfully"
    else
        echo "❌ Database deployment failed"
        echo "   Please check your DATABASE_URL and database connectivity"
        exit 1
    fi
fi

echo ""

# Step 3: Clerk Webhook Setup
echo "Step 3: Clerk Webhook Configuration"
echo "==================================="

# Check if Clerk keys are configured
if ! grep -q "^CLERK_SECRET_KEY=" .env.local || grep -q "^CLERK_SECRET_KEY=.*\$" .env.local; then
    echo "⚠️  CLERK_SECRET_KEY not configured. Skipping webhook setup."
    echo "   Please configure Clerk keys first"
else
    echo "Setting up Clerk webhooks..."

    # Get the webhook endpoint URL
    if [ -n "$VERCEL_URL" ]; then
        WEBHOOK_URL="$VERCEL_URL/api/webhooks/clerk"
    elif [ -n "$NEXT_PUBLIC_APP_URL" ]; then
        WEBHOOK_URL="$NEXT_PUBLIC_APP_URL/api/webhooks/clerk"
    else
        WEBHOOK_URL="http://localhost:3000/api/webhooks/clerk"
    fi

    echo "Webhook endpoint: $WEBHOOK_URL"
    echo ""
    echo "📋 MANUAL WEBHOOK SETUP REQUIRED:"
    echo "=================================="
    echo "1. Go to https://clerk.com/dashboard"
    echo "2. Navigate to Webhooks in your application"
    echo "3. Click 'Add Endpoint'"
    echo "4. Enter URL: $WEBHOOK_URL"
    echo "5. Select events:"
    echo "   - user.created"
    echo "   - user.updated"
    echo "   - user.deleted"
    echo "6. Copy the webhook secret and add to .env.local:"
    echo "   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here"
    echo ""

    # Test webhook endpoint
    echo "Testing webhook endpoint..."
    if curl -s -o /dev/null -w "%{http_code}" "$WEBHOOK_URL" | grep -q "405"; then
        echo "✅ Webhook endpoint is accessible (405 expected for GET)"
    elif curl -s -o /dev/null -w "%{http_code}" "$WEBHOOK_URL" | grep -q "404"; then
        echo "❌ Webhook endpoint not found - check your deployment"
    else
        echo "ℹ️  Webhook endpoint status unknown - manual verification needed"
    fi
fi

echo ""
echo "🎉 Setup automation complete!"
echo "============================"
echo ""
echo "📋 NEXT STEPS:"
echo "=============="
echo "1. Configure any missing environment variables in .env.local"
echo "2. Set up Clerk webhooks manually (see instructions above)"
echo "3. Run the system test: npx tsx test-go4it-os.ts"
echo "4. Start the development server: npm run dev"
echo ""
echo "🔧 Your Go4It OS is ready for production! 🚀"
