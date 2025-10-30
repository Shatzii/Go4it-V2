#!/bin/bash
# GO4IT Platform - Pre-Deployment Verification

echo "🔍 GO4IT Sports Platform - Deployment Readiness Check"
echo "=================================================="
echo ""

# Check Node version
echo "✓ Checking Node.js version..."
node --version

# Check npm version
echo "✓ Checking npm version..."
npm --version

# Check if key files exist
echo ""
echo "✓ Checking configuration files..."
files=("package.json" ".npmrc" ".replit" "next.config.js" "tailwind.config.js" "postcss.config.js" "middleware.ts")
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file exists"
  else
    echo "  ❌ $file missing!"
  fi
done

# Check if key dependencies are installed
echo ""
echo "✓ Checking critical packages..."
packages=("next" "tailwindcss" "postcss" "autoprefixer" "@clerk/nextjs" "drizzle-orm")
for pkg in "${packages[@]}"; do
  if [ -d "node_modules/$pkg" ]; then
    echo "  ✅ $pkg installed"
  else
    echo "  ❌ $pkg NOT installed - run: npm install --legacy-peer-deps"
  fi
done

# Check Tailwind version
echo ""
echo "✓ Verifying Tailwind CSS version..."
if [ -d "node_modules/tailwindcss" ]; then
  tw_version=$(node -e "console.log(require('./node_modules/tailwindcss/package.json').version)")
  if [ "$tw_version" = "3.4.1" ]; then
    echo "  ✅ Tailwind CSS $tw_version (correct)"
  else
    echo "  ⚠️  Tailwind CSS $tw_version (expected 3.4.1)"
  fi
fi

# Check PostCSS config
echo ""
echo "✓ Checking PostCSS configuration..."
if node -e "require('./postcss.config.js')" 2>/dev/null; then
  echo "  ✅ PostCSS config valid"
else
  echo "  ❌ PostCSS config has errors"
fi

# Check environment variables
echo ""
echo "✓ Checking environment variables..."
env_vars=("DATABASE_URL" "CLERK_SECRET_KEY" "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
for var in "${env_vars[@]}"; do
  if [ ! -z "${!var}" ]; then
    echo "  ✅ $var is set"
  else
    echo "  ⚠️  $var not set (required for deployment)"
  fi
done

echo ""
echo "=================================================="
echo "Pre-deployment check complete!"
echo ""
echo "Next steps:"
echo "1. If any packages are missing: npm install --legacy-peer-deps"
echo "2. Set missing environment variables in Replit Secrets"
echo "3. Run: npm run build"
echo "4. Deploy using Replit's Deploy button"
echo ""
