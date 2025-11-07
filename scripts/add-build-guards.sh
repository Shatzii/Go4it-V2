#!/bin/bash

# Add build guards to all admin API routes
# This prevents database access during Next.js build phase

echo "Adding build guards to admin routes..."

# List of admin route files
admin_routes=(
  "app/api/admin/verify-features/route.ts"
  "app/api/admin/stats/route.ts"
  "app/api/admin/users/route.ts"
  "app/api/admin/users/[id]/route.ts"
  "app/api/admin/users/[id]/toggle/route.ts"
  "app/api/admin/media/route.ts"
  "app/api/admin/content/route.ts"
  "app/api/admin/cms/route.ts"
)

for file in "${admin_routes[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Check if already has dynamic export
    if ! grep -q "export const dynamic" "$file"; then
      # Add dynamic and runtime exports after imports
      sed -i '/^import/,/^$/!b;/^$/a\
\
export const dynamic = '\''force-dynamic'\'';\
export const runtime = '\''nodejs'\'';
' "$file"
    fi
    
    # Check if already has build guard in GET handler
    if ! grep -q "NEXT_PHASE.*phase-production-build" "$file"; then
      # Add build guard at the start of each handler function
      sed -i '/export async function \(GET\|POST\|PUT\|DELETE\)/{
n
a\  // Skip during build phase\
  if (process.env.NEXT_PHASE === '\''phase-production-build'\'') {\
    return NextResponse.json({ error: '\''Not available during build'\'' }, { status: 503 });\
  }\

}' "$file"
    fi
    
    echo "  ✓ Updated $file"
  else
    echo "  ⚠ File not found: $file"
  fi
done

echo ""
echo "✅ Build guards added to all admin routes"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Test build: npm run build"
echo "3. Commit: git add -A && git commit -m 'fix: add build guards to admin routes'"
