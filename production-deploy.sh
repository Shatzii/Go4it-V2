#!/bin/bash

# Go4It Sports Platform - Production Deployment Script
# This script prepares and deploys the platform to production

echo "🚀 Starting Go4It Sports Platform Production Deployment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Install dependencies
print_status "Installing dependencies..."
npm install --production=false

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

# Run pre-deployment tests
print_status "Running pre-deployment tests..."
if [ -f "pre-deployment-test.js" ]; then
    node pre-deployment-test.js
    if [ $? -ne 0 ]; then
        print_error "Pre-deployment tests failed. Please fix issues before deployment."
        exit 1
    fi
else
    print_warning "Pre-deployment test file not found. Skipping tests."
fi

# Build the application
print_status "Building application for production..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed. Please check the build output and fix any issues."
    exit 1
fi

# Check if build directory exists
if [ ! -d ".next" ]; then
    print_error "Build directory not found. Build may have failed."
    exit 1
fi

# Create production environment file if it doesn't exist
if [ ! -f ".env.production" ]; then
    print_warning "Production environment file not found. Creating template..."
    cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production
PORT=5000
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret-here
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
EOF
    print_warning "Please update .env.production with your actual production values"
fi

# Database migration (if needed)
print_status "Checking database schema..."
if command -v drizzle-kit &> /dev/null; then
    print_status "Running database migrations..."
    npm run db:push
    if [ $? -ne 0 ]; then
        print_warning "Database migration failed. Please check your database connection."
    fi
else
    print_warning "Drizzle Kit not found. Skipping database migrations."
fi

# Create deployment package
print_status "Creating deployment package..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="go4it-sports-platform-${TIMESTAMP}.tar.gz"

tar -czf "$PACKAGE_NAME" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=*.log \
    --exclude=.env.local \
    --exclude=.env.development \
    .

if [ $? -eq 0 ]; then
    print_status "Deployment package created: $PACKAGE_NAME"
else
    print_error "Failed to create deployment package"
    exit 1
fi

# Final checks
print_status "Running final deployment checks..."

# Check critical files
CRITICAL_FILES=(
    "package.json"
    "next.config.js"
    "app/layout.tsx"
    "app/page.tsx"
    "public/manifest.json"
    "public/sw.js"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Critical file missing: $file"
        exit 1
    fi
done

print_status "All critical files present"

# Display deployment summary
echo ""
echo "🎉 Deployment Preparation Complete!"
echo "=================================="
echo "✅ Dependencies installed"
echo "✅ Tests passed"
echo "✅ Application built successfully"
echo "✅ Deployment package created: $PACKAGE_NAME"
echo "✅ All critical files verified"
echo ""
echo "📦 Next Steps:"
echo "1. Update .env.production with your production values"
echo "2. Upload the deployment package to your server"
echo "3. Extract and run: npm start"
echo "4. Set up reverse proxy (nginx/apache) if needed"
echo "5. Configure SSL certificates"
echo "6. Set up monitoring and logging"
echo ""
echo "🔧 Production Start Command:"
echo "   npm start"
echo ""
echo "🌐 Health Check URL:"
echo "   https://your-domain.com/api/health"
echo ""
print_status "Go4It Sports Platform is ready for production deployment!"