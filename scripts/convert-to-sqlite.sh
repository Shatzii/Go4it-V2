#!/bin/bash

# Replace Neon imports with SQLite in all TypeScript files

echo "Converting Neon PostgreSQL imports to SQLite..."

# Find and replace in TypeScript files (excluding node_modules and .next)
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./.config/*" \
  -not -path "./dist/*" | while read file; do
  
  # Check if file contains Neon imports
  if grep -q "@neondatabase/serverless" "$file"; then
    echo "Updating: $file"
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Replace Neon imports with SQLite (basic replacement - manual review needed for complex files)
    sed -i "s|from '@neondatabase/serverless'|from 'better-sqlite3'|g" "$file"
    sed -i "s|import { neon }|import Database|g" "$file"
    sed -i "s|import { Pool, neonConfig }|import Database|g" "$file"
    sed -i "s|import { Pool }|import Database|g" "$file"
    sed -i "s|drizzle-orm/neon-http|drizzle-orm/better-sqlite3|g" "$file"
    sed -i "s|drizzle-orm/neon-serverless|drizzle-orm/better-sqlite3|g" "$file"
  fi
done

echo "Done! Please review the changes and fix any complex database logic manually."
echo "Backup files created with .backup extension"
