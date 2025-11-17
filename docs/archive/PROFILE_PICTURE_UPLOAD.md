# Profile Picture Upload System

Complete profile picture upload feature for user profiles with secure file handling, database integration, and beautiful UI components.

## 📁 Files Created

### Backend API
- **`server/api/profile-picture-routes.js`** (243 lines)
  - Express router with multer configuration
  - POST `/api/profile/upload-picture` - Upload profile picture
  - DELETE `/api/profile/delete-picture` - Delete profile picture  
  - GET `/api/profile/picture/:userId` - Get user's profile picture
  - Integrated with Drizzle ORM database
  - Security: File type validation, 5MB limit, authentication checks

### Frontend Component
- **`components/ProfilePictureUpload.tsx`** (271 lines)
  - React TypeScript component with full UI
  - File upload with preview
  - Delete functionality
  - Loading states and error handling
  - Size variants: sm, md, lg, xl
  - Tailwind CSS styling with dark mode

### Settings Page
- **`pages/user/settings.tsx`** (Updated)
  - Integrated ProfilePictureUpload component
  - Enhanced with modern gradient design
  - Form validation and error handling
  - Success/error message display

### Test Page
- **`test-profile-upload.html`** (374 lines)
  - Standalone test page for profile picture upload
  - Neon blue/black theme matching site design
  - Live preview and file validation
  - Complete API testing interface

### Directory Structure
- **`public/uploads/profiles/`** (Created)
  - Storage directory for profile pictures
  - Automatically created by API if missing
  - Files named: `profile-{timestamp}-{random}.{ext}`

## 🚀 Features

### Security
✅ File type validation (JPEG, PNG, GIF, WebP only)
✅ File size limit (5MB maximum)
✅ Unique filename generation with crypto
✅ Authentication required for all operations
✅ Automatic file cleanup on errors
✅ Old image deletion when uploading new one

### Database Integration
✅ Uses Drizzle ORM with PostgreSQL
✅ Updates `users.profileImageUrl` field
✅ Updates `users.updatedAt` timestamp
✅ Proper error handling for DB operations

### User Experience
✅ Circular avatar with camera icon placeholder
✅ Upload overlay on hover
✅ Live preview before upload
✅ Loading spinners during operations
✅ Success checkmarks and error messages
✅ Delete button with confirmation dialog
✅ Responsive design for mobile/desktop

## 📝 Usage

### In Settings Page

The ProfilePictureUpload component is already integrated into the user settings page:

```tsx
import ProfilePictureUpload from '@/components/ProfilePictureUpload';

<ProfilePictureUpload
  currentImageUrl={profileImageUrl}
  onUploadSuccess={(url) => setProfileImageUrl(url)}
  onDeleteSuccess={() => setProfileImageUrl(null)}
  size="xl"
/>
```

### In Other Components

You can use the component anywhere:

```tsx
<ProfilePictureUpload
  currentImageUrl={user?.profileImage}
  onUploadSuccess={(imageUrl) => {
    // Update user state
    updateUser({ profileImage: imageUrl });
  }}
  onDeleteSuccess={() => {
    // Clear user profile image
    updateUser({ profileImage: null });
  }}
  size="lg"  // Options: sm, md, lg, xl
  className="custom-class"
/>
```

## 🔌 API Endpoints

### Upload Profile Picture
```http
POST /api/profile/upload-picture
Content-Type: multipart/form-data

Body:
- profilePicture: File (required)
- oldImageUrl: string (optional)

Response:
{
  "success": true,
  "imageUrl": "/uploads/profiles/profile-1234567890-abc123.jpg",
  "filename": "profile-1234567890-abc123.jpg",
  "size": 245678,
  "message": "Profile picture uploaded successfully"
}
```

### Delete Profile Picture
```http
DELETE /api/profile/delete-picture
Content-Type: application/json

Body:
{
  "imageUrl": "/uploads/profiles/profile-1234567890-abc123.jpg"
}

Response:
{
  "success": true,
  "message": "Profile picture deleted successfully"
}
```

### Get User's Profile Picture
```http
GET /api/profile/picture/:userId

Response:
{
  "success": true,
  "profileImageUrl": "/uploads/profiles/profile-1234567890-abc123.jpg",
  "user": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## 🔧 Integration with Express Server

To use the profile picture routes in your Express server:

```javascript
const express = require('express');
const profilePictureRoutes = require('./server/api/profile-picture-routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('public/uploads'));

// Mount profile picture routes
app.use('/api/profile', profilePictureRoutes);

// Your other routes...

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 🗄️ Database Schema

The system uses the existing `users` table with the `profileImageUrl` field:

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  profileImageUrl: text('profile_image_url'),  // <-- Used for profile pictures
  // ... other fields
});
```

## 🎨 Styling

The component uses Tailwind CSS and matches your site's neon blue theme:

- Primary color: `#00F0FF` (Neon blue)
- Background: Dark gradients with transparency
- Buttons: Gradient from cyan to blue with glow effects
- Hover states: Elevation and increased glow
- Dark mode: Fully supported

## 🧪 Testing

### Test Page
Open `test-profile-upload.html` in your browser to test:

1. **File Selection**: Choose an image file
2. **Validation**: Automatic type and size checking
3. **Preview**: See the image before uploading
4. **Upload**: Test the upload API
5. **Delete**: Test the delete API

### Manual Testing Checklist
- [ ] Upload valid image (JPEG/PNG/GIF/WebP)
- [ ] Try uploading invalid file type
- [ ] Try uploading file > 5MB
- [ ] Verify image appears in preview
- [ ] Check file saved to `public/uploads/profiles/`
- [ ] Verify database updated with imageUrl
- [ ] Test delete functionality
- [ ] Verify old image deleted when uploading new one
- [ ] Test error handling (no auth, no file, etc.)

## 🔐 Authentication

The routes expect authentication middleware that sets `req.user` or `req.session.userId`. Example:

```javascript
// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    req.user = { id: req.session.userId };
    next();
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}

// Apply to profile routes
app.use('/api/profile', requireAuth, profilePictureRoutes);
```

## 📦 Dependencies

Already installed in your project:
- `express` - Web server framework
- `multer` - File upload handling
- `drizzle-orm` - Database ORM
- `react` - UI components
- `tailwindcss` - Styling

## 🚧 Future Enhancements

Potential improvements:
- [ ] Image compression before upload
- [ ] Crop tool for square avatars
- [ ] Multiple image sizes (thumbnails)
- [ ] CDN integration for faster loading
- [ ] Progress bar for large uploads
- [ ] Drag-and-drop upload interface
- [ ] Image filters/effects
- [ ] Batch upload for multiple images

## 📄 License

Part of the Go4it platform.

## 🤝 Support

For issues or questions about the profile picture upload system:
1. Check the test page at `test-profile-upload.html`
2. Review API responses for detailed error messages
3. Check browser console for client-side errors
4. Check server logs for backend errors

---

**Status**: ✅ Complete and ready to use!

All features implemented with security, database integration, and beautiful UI.
