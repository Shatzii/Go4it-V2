#!/bin/bash

# Add runtime='nodejs' to API routes that have dynamic export but no runtime export

find app/api -name "route.ts" -type f | while read file; do
  # Check if file has dynamic export but not runtime export
  if grep -q "export const dynamic" "$file" && ! grep -q "export const runtime" "$file"; then
    # Add runtime export after dynamic export
    sed -i '/export const dynamic/a export const runtime = '\''nodejs'\'';' "$file"
    echo "Added runtime export to: $file"
  fi
done

echo "Done adding runtime exports!"
