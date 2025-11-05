#!/bin/bash
# cleanup-old-files.sh - Remove old/duplicate deployment files

echo "🧹 Cleaning up old and duplicate files..."

# Remove old deployment scripts from root
echo "Removing old deployment scripts..."
rm -f build.sh
rm -f check-deployment.sh
rm -f clean-build.sh
rm -f create-deployment-package.sh
rm -f package-deployment.sh
rm -f production-deploy.sh
rm -f start.sh

# Remove old documentation
echo "Removing old documentation..."
rm -f manual-deployment-guide.md
rm -f "post-deployment-updates-prompt (1).md"
rm -f post-deployment-updates-prompt.md

# Remove duplicate next.config files (keep main one)
echo "Removing duplicate next.config files..."
rm -f next.config.safe.js
# Keep next.config.production.js as reference

# Remove old .replit variants
echo "Removing old .replit variants..."
rm -f .replit.deployment
rm -f .replit.fixed

# Remove old scripts in scripts directory
echo "Checking scripts directory..."
cd scripts
rm -f add-dynamic-export.sh
rm -f add-runtime-export.sh
rm -f build.sh
rm -f clean-build.sh
rm -f convert-to-sqlite.sh
rm -f test-apis.sh
rm -f validate-production.sh

cd ..

# List what's left
echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📂 Remaining deployment files:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ls -1 scripts/*.sh
echo ""
echo "📄 Remaining config files:"
ls -1 next.config.js .replit replit.nix 2>/dev/null
echo ""
