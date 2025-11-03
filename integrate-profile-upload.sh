#!/bin/bash

# Profile Picture Upload - Quick Integration Script
# This script helps integrate the profile picture upload system into your main server

echo "======================================"
echo "Profile Picture Upload Integration"
echo "======================================"
echo ""

# Check if profile routes exist
if [ -f "server/api/profile-picture-routes.js" ]; then
    echo "✅ Profile picture routes found"
else
    echo "❌ Profile picture routes not found!"
    echo "   Expected: server/api/profile-picture-routes.js"
    exit 1
fi

# Check if uploads directory exists
if [ -d "public/uploads/profiles" ]; then
    echo "✅ Upload directory exists"
else
    echo "⚠️  Creating uploads directory..."
    mkdir -p public/uploads/profiles
    chmod 755 public/uploads/profiles
    echo "✅ Upload directory created"
fi

# Check if component exists
if [ -f "components/ProfilePictureUpload.tsx" ]; then
    echo "✅ ProfilePictureUpload component found"
else
    echo "❌ ProfilePictureUpload component not found!"
    exit 1
fi

echo ""
echo "======================================"
echo "Integration Instructions"
echo "======================================"
echo ""
echo "1. Add to your Express server:"
echo ""
echo "   const profileRoutes = require('./server/api/profile-picture-routes');"
echo "   app.use('/api/profile', profileRoutes);"
echo ""
echo "2. Serve uploaded files:"
echo ""
echo "   app.use('/uploads', express.static('public/uploads'));"
echo ""
echo "3. Add authentication middleware:"
echo ""
echo "   function requireAuth(req, res, next) {"
echo "     if (req.user || req.session?.userId) {"
echo "       next();"
echo "     } else {"
echo "       res.status(401).json({ error: 'Not authenticated' });"
echo "     }"
echo "   }"
echo ""
echo "   app.use('/api/profile', requireAuth, profileRoutes);"
echo ""
echo "4. Use in your React components:"
echo ""
echo "   import ProfilePictureUpload from '@/components/ProfilePictureUpload';"
echo ""
echo "   <ProfilePictureUpload"
echo "     currentImageUrl={user?.profileImage}"
echo "     onUploadSuccess={(url) => updateUser({ profileImage: url })}"
echo "     onDeleteSuccess={() => updateUser({ profileImage: null })}"
echo "     size=\"lg\""
echo "   />"
echo ""
echo "======================================"
echo "Testing"
echo "======================================"
echo ""
echo "Test the upload system:"
echo "  1. Open test-profile-upload.html in browser"
echo "  2. Or visit your /user/settings page"
echo ""
echo "API Endpoints:"
echo "  • POST   /api/profile/upload-picture"
echo "  • DELETE /api/profile/delete-picture"
echo "  • GET    /api/profile/picture/:userId"
echo ""
echo "======================================"
echo "Documentation"
echo "======================================"
echo ""
echo "Full documentation: PROFILE_PICTURE_UPLOAD.md"
echo "Summary of updates: RECENT_UPDATES_SUMMARY.md"
echo ""
echo "✅ Integration check complete!"
