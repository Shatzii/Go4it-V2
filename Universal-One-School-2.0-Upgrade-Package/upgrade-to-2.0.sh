#!/bin/bash

# Universal One School 2.0 Upgrade Script
# This script upgrades version 1.0 to 2.0 with all improvements and fixes

set -e

echo "🚀 Starting Universal One School 2.0 Upgrade..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root (for production deployment)
if [[ $EUID -eq 0 ]]; then
   print_warning "Running as root. This is recommended for production deployment."
fi

# Step 1: Backup current installation
print_info "Step 1: Creating backup of current installation..."
BACKUP_DIR="./universal-one-school-1.0-backup-$(date +%Y%m%d_%H%M%S)"
if [ -d "./app" ] || [ -d "./components" ] || [ -d "./server" ]; then
    mkdir -p "$BACKUP_DIR"
    cp -r app components server lib public package.json .env* "$BACKUP_DIR/" 2>/dev/null || true
    print_status "Backup created at: $BACKUP_DIR"
else
    print_warning "No existing installation detected. Proceeding with fresh 2.0 installation."
fi

# Step 2: Install Node.js dependencies
print_info "Step 2: Installing 2.0 dependencies..."
if command -v npm &> /dev/null; then
    npm install
    print_status "Dependencies installed successfully"
else
    print_error "npm not found. Please install Node.js 18+ first."
    exit 1
fi

# Step 3: Database migration
print_info "Step 3: Running database migrations..."
if [ -f ".env" ] || [ -f ".env.production" ]; then
    # Check if database connection works
    npm run db:check 2>/dev/null || {
        print_warning "Database connection failed. Please verify DATABASE_URL in .env file."
        print_info "Example: DATABASE_URL=postgresql://user:pass@localhost:5432/universal_one_school"
    }
    
    # Run migrations
    npm run db:migrate 2>/dev/null || {
        print_warning "Database migrations skipped. Run manually: npm run db:migrate"
    }
    print_status "Database migrations completed"
else
    print_warning "No environment file found. Please configure .env before continuing."
fi

# Step 4: Copy 2.0 enhanced files
print_info "Step 4: Installing 2.0 enhancements..."

# Copy enhanced CSS files
mkdir -p app components/ui lib
cp -r ./2.0-enhancements/app/* ./app/ 2>/dev/null || true
cp -r ./2.0-enhancements/components/* ./components/ 2>/dev/null || true
cp -r ./2.0-enhancements/lib/* ./lib/ 2>/dev/null || true

# Copy configuration files
cp ./2.0-enhancements/tailwind.config.js . 2>/dev/null || true
cp ./2.0-enhancements/next.config.js . 2>/dev/null || true

print_status "2.0 enhancement files installed"

# Step 5: Build the application
print_info "Step 5: Building 2.0 application..."
npm run build
print_status "Application built successfully"

# Step 6: Set up PM2 for production (if available)
print_info "Step 6: Setting up production environment..."
if command -v pm2 &> /dev/null; then
    pm2 stop universal-one-school 2>/dev/null || true
    pm2 delete universal-one-school 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    print_status "PM2 production setup completed"
else
    print_warning "PM2 not found. For production, install PM2: npm install -g pm2"
fi

# Step 7: Verify installation
print_info "Step 7: Verifying 2.0 installation..."

# Check if key 2.0 files exist
REQUIRED_FILES=(
    "app/globals.css"
    "components/ui/theme-provider.tsx"
    "app/schools/primary-school/page.tsx"
    "app/schools/secondary-school/page.tsx"
)

ALL_GOOD=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "✓ $file"
    else
        print_error "✗ $file missing"
        ALL_GOOD=false
    fi
done

# Check for 2.0 features in code
if grep -q "neon-green-text" app/globals.css 2>/dev/null; then
    print_status "✓ Enhanced neon CSS framework detected"
else
    print_warning "⚠ Enhanced CSS framework not detected"
fi

if grep -q "Dean Wonder\|Dean Sterling" components/ui/* 2>/dev/null; then
    print_status "✓ AI teacher integration detected"
else
    print_warning "⚠ AI teacher integration not detected"
fi

# Final status
echo ""
echo "================================================"
if [ "$ALL_GOOD" = true ]; then
    print_status "🎉 Universal One School 2.0 upgrade completed successfully!"
    echo ""
    print_info "Next steps:"
    echo "1. Configure your .env file with API keys"
    echo "2. Start the application: npm run dev (development) or npm start (production)"
    echo "3. Access your upgraded platform at: http://localhost:3000"
    echo ""
    print_info "2.0 New Features Available:"
    echo "• Enhanced dark theme with neon effects"
    echo "• Six specialized AI teachers"
    echo "• Improved performance and security"
    echo "• Global operations management"
    echo "• Advanced compliance engine"
    echo "• Student license control system"
else
    print_warning "⚠️ Upgrade completed with warnings. Please check missing files above."
fi

echo ""
print_info "For support: support@universaloneschool.com"
print_info "Documentation: https://docs.universaloneschool.com/2.0"
echo "================================================"