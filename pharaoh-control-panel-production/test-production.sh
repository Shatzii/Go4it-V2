#!/bin/bash

# Pharaoh Control Panel - Production Build Test Script

echo "Testing Pharaoh Control Panel Production Build"
echo "=============================================="

# Test 1: Check if all required files exist
echo "1. Checking required files..."
FILES=("package.json" "server/index.ts" "client/src/App.tsx" "shared/schema.ts")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file missing"
    fi
done

# Test 2: Check dependencies
echo ""
echo "2. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✓ Dependencies installed"
else
    echo "✗ Dependencies not installed - run 'npm install'"
fi

# Test 3: Test TypeScript compilation
echo ""
echo "3. Testing TypeScript compilation..."
npx tsc --noEmit --skipLibCheck

# Test 4: Test database schema
echo ""
echo "4. Testing database schema..."
if [ -f "shared/schema.ts" ]; then
    echo "✓ Database schema file exists"
    grep -q "users.*pgTable" shared/schema.ts && echo "✓ Users table defined" || echo "✗ Users table not found"
    grep -q "password.*text" shared/schema.ts && echo "✓ Password field exists" || echo "✗ Password field missing"
fi

# Test 5: Check authentication system
echo ""
echo "5. Testing authentication system..."
if [ -f "client/src/pages/auth/login.tsx" ]; then
    echo "✓ Login page exists"
else
    echo "✗ Login page missing"
fi

if [ -f "server/controllers/authController.ts" ]; then
    echo "✓ Auth controller exists"
else
    echo "✗ Auth controller missing"
fi

# Test 6: Check deployment files
echo ""
echo "6. Testing deployment files..."
if [ -f "deploy.sh" ] && [ -x "deploy.sh" ]; then
    echo "✓ Deployment script ready"
else
    echo "✗ Deployment script not executable"
fi

if [ -f "production.env" ]; then
    echo "✓ Production environment template exists"
else
    echo "✗ Production environment template missing"
fi

# Test 7: Test basic server functionality
echo ""
echo "7. Testing server functionality..."
if pgrep -f "server/index.ts" > /dev/null; then
    echo "✓ Development server is running"
    
    # Test API endpoints
    if curl -s http://localhost:5000/api/auth/user > /dev/null; then
        echo "✓ API endpoint accessible"
    else
        echo "✗ API endpoint not responding"
    fi
else
    echo "✗ Development server not running"
fi

echo ""
echo "=============================================="
echo "Production Build Test Complete"
echo ""
echo "Next steps to verify production readiness:"
echo "1. Run a small build test: npm run build (may take time)"
echo "2. Test authentication: Visit /auth/login"
echo "3. Test database connection with your production database"
echo "4. Deploy to staging environment first"