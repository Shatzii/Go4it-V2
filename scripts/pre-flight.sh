#!/bin/bash
# pre-flight.sh - Pre-deployment checks

set -e

echo "🔍 Running pre-flight checks..."

# Check Node.js version
echo -n "Checking Node.js version... "
node_version=$(node -v | cut -d'v' -f2)
required_version="20.0.0"
if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" = "$required_version" ]; then 
  echo "✓ Node $node_version (>= $required_version)"
else
  echo "❌ Node $node_version is too old (need >= $required_version)"
  exit 1
fi

# Check npm
echo -n "Checking npm... "
npm_version=$(npm -v)
echo "✓ npm $npm_version"

# Check required environment variables
echo "Checking required environment variables..."
required_vars=(
  "DATABASE_URL"
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  "CLERK_SECRET_KEY"
  "STRIPE_SECRET_KEY"
  "CLOUDFLARE_R2_BUCKET_NAME"
  "OLLAMA_BASE_URL"
  "WHISPER_SERVICE_URL"
)

missing_vars=()
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
  else
    echo "  ✓ $var is set"
  fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
  echo "❌ Missing required environment variables:"
  printf '  - %s\n' "${missing_vars[@]}"
  exit 1
fi

# Type check
echo -n "Running TypeScript type check... "
if npm run type-check > /dev/null 2>&1; then
  echo "✓ No type errors"
else
  echo "❌ Type errors found"
  npm run type-check
  exit 1
fi

# Lint check
echo -n "Running linter... "
if npm run lint > /dev/null 2>&1; then
  echo "✓ No lint errors"
else
  echo "⚠️  Lint warnings found (continuing)"
fi

# Test database connection
echo -n "Testing database connection... "
if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
  echo "✓ Database connected"
else
  echo "❌ Database connection failed"
  exit 1
fi

# Check disk space
echo -n "Checking disk space... "
available_space=$(df -h . | awk 'NR==2 {print $4}')
echo "✓ Available: $available_space"

# Check memory
echo -n "Checking memory... "
free_memory=$(free -h | awk 'NR==2 {print $7}')
echo "✓ Free: $free_memory"

echo ""
echo "✅ All pre-flight checks passed!"
echo ""
