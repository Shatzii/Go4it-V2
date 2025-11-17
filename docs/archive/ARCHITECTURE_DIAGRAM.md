# Profile Picture Upload System - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  pages/user/settings.tsx (Settings Page)                         │   │
│  │  ┌────────────────────────────────────────────────────────┐     │   │
│  │  │  ProfilePictureUpload Component                         │     │   │
│  │  │  • Circular avatar with camera icon                     │     │   │
│  │  │  • File input (hidden, styled button)                   │     │   │
│  │  │  • Image preview                                        │     │   │
│  │  │  • Upload/Delete buttons                                │     │   │
│  │  │  • Loading states                                       │     │   │
│  │  │  • Success/Error messages                               │     │   │
│  │  └────────────────────────────────────────────────────────┘     │   │
│  │         │                                    │                   │   │
│  │         │ onUploadSuccess()                 │ onDeleteSuccess() │   │
│  │         ▼                                    ▼                   │   │
│  │  ┌──────────────────────────────────────────────────────┐       │   │
│  │  │  Parent Component State Management                    │       │   │
│  │  │  • profileImageUrl state                              │       │   │
│  │  │  • handleProfilePictureUpload()                       │       │   │
│  │  │  • handleProfilePictureDelete()                       │       │   │
│  │  └──────────────────────────────────────────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    │
                                    │ HTTP Requests
                                    │
┌───────────────────────────────────▼───────────────────────────────────────┐
│                           API LAYER                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  server/api/profile-picture-routes.js                           │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │  POST /api/profile/upload-picture                        │   │   │
│  │  │  ┌─────────────────────────────────────────────────┐    │   │   │
│  │  │  │ 1. Multer middleware processes upload           │    │   │   │
│  │  │  │ 2. Validate file type (JPEG/PNG/GIF/WebP)      │    │   │   │
│  │  │  │ 3. Validate file size (max 5MB)                 │    │   │   │
│  │  │  │ 4. Generate unique filename (crypto)            │    │   │   │
│  │  │  │ 5. Save to public/uploads/profiles/             │    │   │   │
│  │  │  │ 6. Update database (Drizzle ORM)                │    │   │   │
│  │  │  │ 7. Delete old image if exists                   │    │   │   │
│  │  │  │ 8. Return imageUrl                              │    │   │   │
│  │  │  └─────────────────────────────────────────────────┘    │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │  DELETE /api/profile/delete-picture                     │   │   │
│  │  │  ┌─────────────────────────────────────────────────┐    │   │   │
│  │  │  │ 1. Validate authentication                      │    │   │   │
│  │  │  │ 2. Get imageUrl from request                    │    │   │   │
│  │  │  │ 3. Delete file from filesystem                  │    │   │   │
│  │  │  │ 4. Update database (set null)                   │    │   │   │
│  │  │  │ 5. Return success                               │    │   │   │
│  │  │  └─────────────────────────────────────────────────┘    │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │  GET /api/profile/picture/:userId                       │   │   │
│  │  │  ┌─────────────────────────────────────────────────┐    │   │   │
│  │  │  │ 1. Validate userId parameter                    │    │   │   │
│  │  │  │ 2. Query database for user                      │    │   │   │
│  │  │  │ 3. Return profileImageUrl                       │    │   │   │
│  │  │  └─────────────────────────────────────────────────┘    │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└───────────────────────────────────┬───────────────────────────────────────┘
                                    │
                ┌───────────────────┴────────────────────┐
                │                                         │
                ▼                                         ▼
┌───────────────────────────────┐      ┌────────────────────────────────┐
│     FILE SYSTEM LAYER         │      │      DATABASE LAYER             │
├───────────────────────────────┤      ├────────────────────────────────┤
│                               │      │                                 │
│  public/uploads/profiles/     │      │  PostgreSQL Database            │
│  ├── profile-123-abc.jpg      │      │  ┌──────────────────────────┐  │
│  ├── profile-456-def.png      │      │  │  users table             │  │
│  └── profile-789-ghi.webp     │      │  │  ┌────────────────────┐  │  │
│                               │      │  │  │ id (UUID)          │  │  │
│  Storage:                     │      │  │  │ email              │  │  │
│  • Unique filenames           │      │  │  │ firstName          │  │  │
│  • 755 permissions            │      │  │  │ lastName           │  │  │
│  • Automatic cleanup          │      │  │  │ profileImageUrl    │◄─┼──┼─ Stores imageUrl
│                               │      │  │  │ updatedAt          │  │  │
└───────────────────────────────┘      │  │  └────────────────────┘  │  │
                                       │  └──────────────────────────┘  │
                                       │                                 │
                                       │  Drizzle ORM Integration:       │
                                       │  • Type-safe queries            │
                                       │  • Automatic migrations         │
                                       │  • Transaction support          │
                                       └────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐   │
│  │ File Validation│  │ Authentication │  │ Error Handling         │   │
│  ├────────────────┤  ├────────────────┤  ├────────────────────────┤   │
│  │ • Type check   │  │ • req.user     │  │ • Try-catch blocks     │   │
│  │ • Size check   │  │ • req.session  │  │ • File cleanup         │   │
│  │ • MIME type    │  │ • Token verify │  │ • Safe error messages  │   │
│  │ • Whitelist    │  │ • 401 on fail  │  │ • Logging              │   │
│  └────────────────┘  └────────────────┘  └────────────────────────┘   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  UPLOAD FLOW:                                                             │
│  1. User selects file → ProfilePictureUpload component                  │
│  2. Client validates (type, size) → Shows preview                        │
│  3. User clicks upload → FormData POST to API                            │
│  4. Server receives → Multer processes                                   │
│  5. File validation → Save to disk                                       │
│  6. Database update → Return imageUrl                                    │
│  7. Component updates → Shows success                                    │
│                                                                           │
│  DELETE FLOW:                                                             │
│  1. User clicks delete → Confirmation dialog                             │
│  2. User confirms → DELETE request to API                                │
│  3. Server validates → Delete file from disk                             │
│  4. Database update → Set null                                           │
│  5. Component updates → Shows placeholder                                │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT LIFECYCLE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Mount                                                                    │
│    ↓                                                                      │
│  Initialize State                                                         │
│    • imageUrl = currentImageUrl (from props)                             │
│    • uploading = false                                                   │
│    • error = null                                                        │
│    • success = null                                                      │
│    • previewUrl = null                                                   │
│    ↓                                                                      │
│  Render                                                                   │
│    • Show current image OR placeholder                                   │
│    • Show upload button                                                  │
│    • Show delete button (if image exists)                                │
│    ↓                                                                      │
│  User Interaction                                                         │
│    • File selected → handleFileSelect()                                  │
│      ├─ Validate file                                                    │
│      ├─ Create preview (FileReader)                                      │
│      └─ Call uploadFile()                                                │
│    • Delete clicked → handleDelete()                                     │
│      ├─ Show confirmation                                                │
│      ├─ DELETE API call                                                  │
│      └─ Clear state                                                      │
│    ↓                                                                      │
│  Update & Re-render                                                       │
│    • Success/error messages                                              │
│    • Loading states                                                      │
│    • Callback props                                                      │
│    ↓                                                                      │
│  Unmount (cleanup)                                                        │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         ERROR HANDLING                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Client-Side:                      Server-Side:                          │
│  ┌──────────────────────┐         ┌──────────────────────┐             │
│  │ Invalid file type    │         │ No file uploaded     │             │
│  │ File too large       │         │ Authentication fail  │             │
│  │ Network error        │         │ Database error       │             │
│  │ Upload failed        │         │ File system error    │             │
│  └──────────┬───────────┘         └──────────┬───────────┘             │
│             │                                  │                         │
│             └──────────┬──────────────────────┘                         │
│                        ▼                                                 │
│              ┌──────────────────┐                                       │
│              │ Error Message    │                                       │
│              │ • User-friendly  │                                       │
│              │ • Red styling    │                                       │
│              │ • Auto-dismiss   │                                       │
│              └──────────────────┘                                       │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         TESTING POINTS                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Component Testing:              API Testing:                            │
│  • File input triggers          • POST with valid file                  │
│  • Preview renders              • POST with invalid type                │
│  • Upload button state          • POST with large file                  │
│  • Delete confirmation          • POST without auth                     │
│  • Error messages               • DELETE with valid URL                 │
│  • Success messages             • DELETE without auth                   │
│  • Loading states               • GET with valid userId                 │
│  • Responsive design            • GET with invalid userId               │
│                                                                           │
│  Integration Testing:            Database Testing:                       │
│  • End-to-end upload            • profileImageUrl updates               │
│  • End-to-end delete            • updatedAt timestamp                   │
│  • Settings page integration    • Transaction rollback                  │
│  • Multiple uploads             • Concurrent updates                    │
│  • Network failures             • Null handling                         │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

Legend:
┌─┐  Container/Component
│ │  Process/Action
▼    Data flow direction
◄─   Reference/Pointer
```

## Key Architectural Decisions

### 1. **Separation of Concerns**
- **UI Layer**: React components handle presentation and user interaction
- **API Layer**: Express routes handle business logic and validation
- **Data Layer**: Separate file system and database operations

### 2. **Security First**
- Multiple validation layers (client + server)
- Authentication checks on all routes
- File type and size restrictions
- Automatic cleanup on errors

### 3. **Error Resilience**
- Try-catch blocks at every async operation
- File cleanup on upload failure
- Database transaction safety
- User-friendly error messages

### 4. **State Management**
- Component manages its own UI state
- Parent component manages application state
- Callbacks for state synchronization
- Controlled component pattern

### 5. **Performance**
- Client-side preview (no server round-trip)
- Optimistic UI updates
- Lazy loading of images
- Efficient file handling

### 6. **Scalability**
- Unique filenames prevent conflicts
- CDN-ready file structure
- Database-backed state
- Stateless API endpoints

### 7. **Maintainability**
- TypeScript for type safety
- Clear component boundaries
- Well-documented code
- Consistent error handling patterns
