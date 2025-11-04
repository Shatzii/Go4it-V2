#!/bin/bash
# Production Validation Suite - Run All 5 Steps
# Usage: ./scripts/validate-production.sh

set -e  # Exit on error

echo "🚀 StarPath v2 - Production Validation Suite"
echo "============================================="
echo ""

# Step 1: Type Check
echo "📝 Step 1/5: Type Check"
echo "------------------------"
npm run typecheck
echo "✅ Type check passed"
echo ""

# Step 2: Build
echo "🏗️  Step 2/5: Build"
echo "------------------------"
npm run build
echo "✅ Build successful"
echo ""

# Step 3: Database Migration
echo "💾 Step 3/5: Database Migration"
echo "------------------------"
npm run db:push
echo "✅ Schema pushed to database"
echo ""

# Step 4: Seed Data
echo "🌱 Step 4/5: Seed Data"
echo "------------------------"
npm run seed:starpath
echo "✅ Demo data seeded"
echo ""

# Step 5: Integrity Check
echo "🔍 Step 5/5: Integrity Check"
echo "------------------------"
npm run integrity
echo "✅ All critical files present"
echo ""

# Optional: Smoke Tests (requires server running)
echo "🧪 Bonus: Smoke Tests"
echo "------------------------"
echo "To run smoke tests:"
echo "  1. Start dev server: npm run dev"
echo "  2. In another terminal: npm run smoke"
echo ""

echo "============================================="
echo "✅ ALL VALIDATION STEPS PASSED"
echo "============================================="
echo ""
echo "Next Steps:"
echo "  1. Update navigation with feature flags ✓ (Already done)"
echo "  2. Start dev server: npm run dev"
echo "  3. Run smoke tests: npm run smoke"
echo "  4. Test event flow in browser"
echo "  5. Verify PostHog events"
echo ""
echo "Ready for production! 🎉"
