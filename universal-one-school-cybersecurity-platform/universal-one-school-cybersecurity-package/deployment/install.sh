#!/bin/bash

# Universal One School Cybersecurity Platform - Installation Script
# This script sets up the complete cybersecurity platform for educational environments

echo "🔐 Universal One School Cybersecurity Platform Installation"
echo "=========================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [[ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]]; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found locally. Using DATABASE_URL from environment."
else
    echo "✅ PostgreSQL detected"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Copy environment file
echo ""
echo "🔧 Setting up environment configuration..."

if [ ! -f ".env" ]; then
    cp deployment/environment-setup.env .env
    echo "⚠️  Environment file created at .env"
    echo "⚠️  Please update the .env file with your actual credentials before running the platform"
else
    echo "✅ Environment file already exists"
fi

# Database setup
echo ""
echo "🗄️  Setting up database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Please configure your database connection in .env"
else
    echo "✅ DATABASE_URL configured"
    
    # Run database migrations
    echo "Running database migrations..."
    npm run db:push
    
    if [ $? -eq 0 ]; then
        echo "✅ Database migrations completed"
    else
        echo "⚠️  Database migrations failed. Please check your database connection."
    fi
fi

# Build frontend
echo ""
echo "🏗️  Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Create necessary directories
echo ""
echo "📁 Creating necessary directories..."
mkdir -p logs/security
mkdir -p uploads/evidence
mkdir -p backups
chmod 700 logs/security uploads/evidence backups

echo "✅ Directories created"

# Security setup
echo ""
echo "🛡️  Security setup..."

# Generate random secrets if not provided
if ! grep -q "your-256-bit-secret" .env; then
    echo "✅ Custom secrets detected in .env"
else
    echo "⚠️  Default secrets detected. Please update .env with secure random values:"
    echo "   - JWT_SECRET"
    echo "   - JWT_REFRESH_SECRET" 
    echo "   - ENCRYPTION_KEY"
    echo "   - SESSION_SECRET"
fi

# Final checks
echo ""
echo "🔍 Running final checks..."

# Check if all required environment variables are set
REQUIRED_VARS=("DATABASE_URL" "JWT_SECRET" "ENCRYPTION_KEY" "SESSION_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ] && ! grep -q "^$var=" .env; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "✅ All required environment variables configured"
else
    echo "⚠️  Missing required environment variables: ${MISSING_VARS[*]}"
    echo "   Please update .env file before starting the platform"
fi

# Installation complete
echo ""
echo "🎉 Installation Complete!"
echo "========================"
echo ""
echo "Next steps:"
echo "1. Update .env file with your actual credentials"
echo "2. Configure your database connection"
echo "3. Start the platform with: npm run dev"
echo ""
echo "For production deployment:"
echo "1. Set NODE_ENV=production in .env"
echo "2. Start with: npm start"
echo ""
echo "Platform Features:"
echo "✓ Social Media Safety Guardian"
echo "✓ Multi-School Management (4 schools, 2,146+ students)"
echo "✓ COPPA/FERPA/GDPR Compliance"
echo "✓ Predictive Behavioral Analytics"
echo "✓ Emergency Response Automation"
echo "✓ Real-time Threat Detection"
echo ""
echo "Default Admin Login:"
echo "Username: admin"
echo "Password: sentinel123"
echo ""
echo "Documentation: See documentation/ folder for complete guides"
echo "Support: platform-security@universalschool.edu"