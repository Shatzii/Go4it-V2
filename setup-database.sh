#!/bin/bash

# Go4It OS Database Setup Script
# Handles database creation and schema deployment

set -e

echo "🗄️  Go4It OS Database Setup"
echo "==========================="
echo ""

# Check if DATABASE_URL is configured
if ! grep -q "^DATABASE_URL=" .env.local; then
    echo "❌ DATABASE_URL not configured in .env.local"
    echo "Please set your database connection string:"
    echo "DATABASE_URL=\"postgresql://username:password@host:port/database\""
    echo "Or for development: DATABASE_URL=\"file:./go4it-os.db\""
    exit 1
fi

# Extract database connection details
DB_URL=$(grep "^DATABASE_URL=" .env.local | cut -d'=' -f2 | tr -d '"')

if [[ $DB_URL == file:* ]]; then
    echo "Database Configuration:"
    echo "  Type: SQLite"
    echo "  File: ${DB_URL#file:}"
    echo ""
    echo "Testing SQLite database..."
    # For SQLite, just check if we can run drizzle-kit
    if command -v npx &> /dev/null; then
        echo "✅ SQLite database ready (file-based)"
    else
        echo "❌ npx not found"
        exit 1
    fi
else
    DB_HOST=$(echo $DB_URL | sed -n 's|.*@\([^:]*\):.*|\1|p')
    DB_PORT=$(echo $DB_URL | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
    DB_NAME=$(echo $DB_URL | basename $DB_URL)
    DB_USER=$(echo $DB_URL | sed -n 's|.*://\([^:]*\):.*|\1|p')
    DB_PASS=$(echo $DB_URL | sed -n 's|.*:\([^@]*\)@.*|\1|p')

    echo "Database Configuration:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo ""

    # Test database connection
    echo "Testing database connection..."
    if command -v psql &> /dev/null; then
        if PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" &> /dev/null; then
            echo "✅ Database connection successful"
        else
            echo "❌ Database connection failed"
            echo ""
            echo "🔧 TROUBLESHOOTING:"
            echo "==================="
            echo "1. Make sure PostgreSQL is running:"
            echo "   sudo service postgresql start"
            echo ""
            echo "2. Create the database if it doesn't exist:"
            echo "   createdb $DB_NAME"
            echo ""
            echo "3. Or use a different DATABASE_URL for a cloud database"
            exit 1
        fi
    else
        echo "⚠️  psql not found - skipping connection test"
        echo "   Assuming database is accessible via Drizzle"
    fi
fi

echo ""
echo "Deploying database schema..."
echo "============================"

# Deploy schema using Drizzle
if npx drizzle-kit push; then
    echo "✅ Database schema deployed successfully!"
    echo ""
    echo "📊 Schema includes:"
    echo "  - Users table (Clerk integration)"
    echo "  - Goals table (5-year → yearly → quarterly → monthly)"
    echo "  - Projects table (linked to goals)"
    echo "  - Tasks table (core work units)"
    echo "  - Events table (calendar integration)"
    echo "  - Comments table (task discussions)"
    echo "  - Enterprise audit & metrics tables"
else
    echo "❌ Schema deployment failed"
    echo ""
    echo "🔧 TROUBLESHOOTING:"
    echo "==================="
    echo "1. Check your DATABASE_URL in .env.local"
    echo "2. Ensure database exists: createdb $DB_NAME"
    echo "3. Verify database user has CREATE privileges"
    echo "4. Check database server is running and accessible"
    exit 1
fi

echo ""
echo "🎉 Database setup complete!"
echo "==========================="
echo "Your Go4It OS database is ready for production! 🚀"
