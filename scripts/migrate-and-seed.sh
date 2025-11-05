#!/bin/bash
# migrate-and-seed.sh - Run database migrations and seed data

set -e

echo "🗄️  Setting up production database..."

# Create backups directory if it doesn't exist
mkdir -p backups

# Backup existing database
echo "📦 Creating database backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
backup_file="backups/backup_${timestamp}.sql"

if psql "$DATABASE_URL" -c "\l" > /dev/null 2>&1; then
    pg_dump "$DATABASE_URL" > "$backup_file"
    echo "✓ Backup created: $backup_file"
    
    # Compress backup
    gzip "$backup_file"
    echo "✓ Backup compressed: ${backup_file}.gz"
else
    echo "⚠️  Could not create backup (database may not exist yet)"
fi

# Run migrations
echo "⚙️  Running database migrations..."
if npm run db:migrate; then
    echo "✓ Migrations completed"
else
    echo "❌ Migration failed"
    exit 1
fi

# Seed essential data
echo "🌱 Seeding production data..."

# Check if seed script exists
if [ -f "scripts/seed-production.ts" ] || [ -f "scripts/seed-production.js" ]; then
    if npm run seed:production; then
        echo "✓ Seeding completed"
    else
        echo "⚠️  Seeding failed (continuing anyway)"
    fi
else
    echo "⚠️  No seed script found, skipping..."
fi

# Populate colleges (if endpoint is available)
echo "🏫 Populating college database..."
if [ -n "$NEXT_PUBLIC_APP_URL" ]; then
    # Wait for app to be running
    max_attempts=10
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "${NEXT_PUBLIC_APP_URL}/api/health" > /dev/null 2>&1; then
            echo "✓ App is running, populating colleges..."
            curl -X POST "${NEXT_PUBLIC_APP_URL}/api/colleges/populate" || echo "⚠️  College population may have failed"
            break
        else
            echo "⏳ Waiting for app to start (attempt $((attempt + 1))/$max_attempts)..."
            sleep 5
            ((attempt++))
        fi
    done
    
    if [ $attempt -eq $max_attempts ]; then
        echo "⚠️  App not responding, skipping college population"
    fi
else
    echo "⚠️  NEXT_PUBLIC_APP_URL not set, skipping college population"
fi

# Database statistics
echo ""
echo "📊 Database Statistics:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count records in main tables
tables=("users" "athletes" "colleges" "drills" "transcriptAudits")
for table in "${tables[@]}"; do
    count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM \"$table\";" 2>/dev/null || echo "0")
    printf "%-20s: %s\n" "$table" "$count"
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Database setup complete!"
echo ""
