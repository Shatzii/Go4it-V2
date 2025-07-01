#!/bin/bash

echo "🚀 Installing Pharaoh Control Panel 2.0..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install Node.js 18+ first."
    exit 1
fi

# Check for PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is required. Please install PostgreSQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment variables
if [ ! -f .env ]; then
    echo "⚙️  Setting up environment variables..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration"
else
    echo "✅ Environment file already exists"
fi

# Database setup
echo "🗄️  Setting up database..."
npm run db:push

echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run 'npm run start' to start the application"
echo "3. Visit http://localhost:5000 in your browser"
echo ""
echo "For full setup guide, see API_KEYS_SETUP_GUIDE.md"
