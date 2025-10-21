#!/bin/bash

# Comprehensive Site Cleanup Script
# This script safely removes unnecessary files to reduce project size

echo "🧹 Starting comprehensive site cleanup..."
echo "📊 Current project size:"
du -sh . 2>/dev/null

echo ""
echo "🗂️ Analyzing space usage:"
du -sh attached_assets/ node_modules/ .next/ ai-models/ 2>/dev/null | sort -hr

echo ""
echo "⚠️  SAFETY CHECK: This will remove the following:"
echo "   ✓ Build artifacts (.next, out, dist)"
echo "   ✓ Cache files (node_modules/.cache, *.tsbuildinfo)"
echo "   ✓ Log files (*.log)"
echo "   ✓ Large media files (*.mov, *.mp4, *.avi)"
echo "   ✓ Documentation files (except README.md and replit.md)"
echo "   ✓ Temporary files (temp/, tmp/)"
echo "   ✓ Backup files (*backup*, *.bak)"
echo "   ⚠️  Optional: attached_assets/ (106MB of uploaded files)"
echo "   ⚠️  Optional: ai-models/ (if present)"
echo ""

read -p "Continue with cleanup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled"
    exit 1
fi

echo ""
echo "🧹 Removing build artifacts..."
rm -rf .next
rm -rf out  
rm -rf dist
rm -f *.tsbuildinfo
rm -f tsconfig.tsbuildinfo
echo "✅ Build artifacts removed"

echo ""
echo "🗑️ Cleaning cache files..."
rm -rf node_modules/.cache
npm cache clean --force 2>/dev/null || true
rm -f build-error.log
echo "✅ Cache files cleaned"

echo ""
echo "📄 Removing log files..."
find . -name "*.log" -delete 2>/dev/null || true
rm -rf logs/ 2>/dev/null || true
echo "✅ Log files removed"

echo ""
echo "🎬 Removing large media files..."
find . -name "*.mov" -delete 2>/dev/null || true
find . -name "*.mp4" -not -path "./test-video.mp4" -delete 2>/dev/null || true
find . -name "*.avi" -delete 2>/dev/null || true
find . -name "*.mkv" -delete 2>/dev/null || true
echo "✅ Large media files removed (kept test-video.mp4)"

echo ""
echo "🗂️ Removing temporary files..."
rm -rf temp/ tmp/ 2>/dev/null || true
find . -name "*~" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true
echo "✅ Temporary files removed"

echo ""
echo "💾 Removing backup files..."
find . -name "*backup*" -delete 2>/dev/null || true
find . -name "*.bak" -delete 2>/dev/null || true
find . -name "*.backup" -delete 2>/dev/null || true
echo "✅ Backup files removed"

echo ""
echo "📚 Cleaning documentation files..."
# Keep important docs but remove others
find . -name "*.md" \
    -not -name "README.md" \
    -not -name "replit.md" \
    -not -path "./node_modules/*" \
    -delete 2>/dev/null || true
echo "✅ Documentation cleaned (kept README.md and replit.md)"

echo ""
echo "🎯 Optional cleanups (you'll be asked for each):"

# Optional: Remove attached assets
echo ""
if [ -d "attached_assets" ]; then
    echo "📎 Found attached_assets/ (106MB of uploaded files)"
    read -p "Remove attached_assets/? This removes all uploaded images/videos (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf attached_assets/
        echo "✅ attached_assets/ removed"
    else
        echo "⏭️ Keeping attached_assets/"
    fi
fi

# Optional: Remove AI models  
if [ -d "ai-models" ]; then
    echo ""
    echo "🤖 Found ai-models/ directory"
    read -p "Remove ai-models/? This removes AI model files (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf ai-models/
        echo "✅ ai-models/ removed"
    else
        echo "⏭️ Keeping ai-models/"
    fi
fi

# Optional: Remove deployment scripts
echo ""
echo "🚀 Found multiple deployment/build scripts"
read -p "Remove old deployment scripts? (keeps main ones) (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f build-fix-*.js deploy-*.sh *deploy*.js.backup 2>/dev/null || true
    rm -f emergency-build.sh deployment-troubleshoot.sh 2>/dev/null || true
    echo "✅ Old deployment scripts removed"
else
    echo "⏭️ Keeping all deployment scripts"
fi

echo ""
echo "✨ Cleanup complete!"
echo ""
echo "📊 New project size:"
du -sh . 2>/dev/null

echo ""
echo "🎉 Space saved: Check the difference!"
echo ""
echo "💡 Next steps:"
echo "   1. Run 'npm run build' to regenerate clean build files"
echo "   2. Test your application to ensure everything works"
echo "   3. Consider running this script before deployments"