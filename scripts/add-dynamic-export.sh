#!/bin/bash

# Add 'export const dynamic = "force-dynamic";' to all API route files
# that use request.url but don't already have the export

find app/api -name "route.ts" -type f | while read file; do
  # Check if file uses request.url and doesn't already have dynamic export
  if grep -q "request.url" "$file" && ! grep -q "export const dynamic" "$file"; then
    # Check if file has imports
    if grep -q "^import" "$file"; then
      # Add after the last import line
      sed -i '/^import/,/^$/{ /^$/{ a\
export const dynamic = '\''force-dynamic'\'';
      } }' "$file"
      echo "Added dynamic export to: $file"
    fi
  fi
done

echo "Done adding dynamic exports!"
