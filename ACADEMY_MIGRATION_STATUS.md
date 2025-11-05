# Academy Routes Migration Status

## 🚧 Current Status: Under Maintenance

The academy API routes have been temporarily disabled during the PostgreSQL migration. These routes were using raw SQLite queries via `better-sqlite3` which are incompatible with the new PostgreSQL database.

## 📋 Affected Routes (34 total)

### Progress & Enrollment
- `/api/academy/progress` - Student progress tracking
- `/api/academy/lessons` - Lesson listing
- `/api/academy/lessons/[lessonId]` - Individual lesson details
- `/api/academy/lessons/[lessonId]/content` - Lesson content

### Teacher Features
- `/api/academy/teacher/students` - Teacher's student list

### Parent Portal
- `/api/academy/parent/students` - Parent's children list
- `/api/academy/parent/students/[studentId]/grades` - Student grades
- `/api/academy/parent/students/[studentId]/assignments` - Student assignments
- `/api/academy/parent/notifications/[notificationId]/read` - Mark notification as read

### Collaboration
- `/api/academy/collaboration/posts` - Discussion posts
- `/api/academy/collaboration/posts/[postId]/like` - Like a post
- `/api/academy/collaboration/posts/[postId]/comments` - Post comments
- `/api/academy/collaboration/comments/[commentId]/like` - Like a comment
- `/api/academy/collaboration/groups` - Collaboration groups
- `/api/academy/collaboration/groups/[groupId]/join` - Join a group
- `/api/academy/collaboration/groups/[groupId]/messages` - Group messages

### Certification
- `/api/academy/certification/transcripts` - Student transcripts
- `/api/academy/certification/courses` - Certified courses
- `/api/academy/certification/certificates` - Certificate management
- `/api/academy/certification/certificates/[certificateId]/download` - Download certificate
- `/api/academy/certification/certificates/[certificateId]/revoke` - Revoke certificate
- `/api/academy/certification/students` - Certified students
- `/api/academy/certification/achievements` - Student achievements

### AI-Powered Features
- `/api/academy/ai/generate/quiz` - AI quiz generation
- `/api/academy/ai/generate/assignment` - AI assignment generation
- `/api/academy/ai/generate/lesson` - AI lesson generation
- `/api/academy/ai/save` - Save AI-generated content
- `/api/academy/ai/recent` - Recent AI generations
- `/api/academy/ai/templates` - AI templates
- `/api/academy/ai/rate` - Rate AI-generated content
- `/api/academy/ai/personalization` - Personalized AI recommendations

### Assessment
- `/api/academy/assessment/quiz/[quizId]/take` - Take a quiz
- `/api/academy/assessment/attempt/[attemptId]/submit` - Submit quiz attempt
- `/api/academy/assessment/attempt/[attemptId]/results` - View quiz results

## ⚠️ Current Behavior

All affected routes now return:
```json
{
  "error": "Academy feature requires database migration",
  "message": "This endpoint uses legacy SQLite and is being migrated to PostgreSQL",
  "status": "under_maintenance"
}
```
HTTP Status: `503 Service Unavailable`

## 🔄 Migration Plan

### Phase 1: Database Schema ✅
- PostgreSQL database configured
- Drizzle ORM schema defined
- Core platform tables migrated

### Phase 2: Academy Routes (In Progress)
1. **Identify query patterns** - Analyze raw SQL queries in disabled routes
2. **Create Drizzle queries** - Replace `db.prepare()` with Drizzle ORM queries
3. **Test endpoints** - Verify functionality with PostgreSQL
4. **Re-enable routes** - Remove 503 stubs, restore functionality

### Phase 3: Data Migration (Future)
1. Export data from existing SQLite `go4it-academy.db`
2. Transform data to match PostgreSQL schema
3. Import into production PostgreSQL database

## 📝 Original Code Location

All original route code has been preserved in the same files as block comments:
```typescript
/* 
 * ORIGINAL CODE BELOW - NEEDS MIGRATION TO DRIZZLE ORM
 * ====================================================
 * [original implementation]
 */
```

## 🛠️ Migration Scripts

Created migration scripts in `scripts/`:
- `migrate-academy-to-drizzle.js` - Attempted automatic migration (partial)
- `add-build-guards-academy.js` - Added build-time safety guards
- `cleanup-academy-imports.js` - Cleaned up import statements
- `disable-legacy-academy-routes.js` - Final stub replacement

## 📊 Impact Analysis

### ✅ No Impact (Routes Already Using Drizzle ORM)
- `/api/academy/classes` - Works with PostgreSQL
- Most core platform features (recruiting, StarPath, etc.)

### ⚠️ Temporarily Unavailable
- All academy collaboration features
- Parent portal functionality
- AI-powered content generation for academy
- Certification and transcript management
- Quiz/assessment taking

### 🎯 Core Platform Status
- **Recruiting Hub**: ✅ Fully functional
- **StarPath AI**: ✅ Fully functional
- **Video Analysis**: ✅ Fully functional
- **Payment Processing**: ✅ Fully functional
- **Admin Panel**: ✅ Fully functional
- **Academy LMS**: ⚠️ Under maintenance

## 🚀 Next Steps to Re-enable Academy

### For Developers:

1. **Pick a route** from the list above
2. **Open the file** (e.g., `app/api/academy/progress/route.ts`)
3. **Find original code** in the block comment at the bottom
4. **Convert SQL to Drizzle**:
   ```typescript
   // Old (SQLite raw SQL):
   const rows = db.prepare(`SELECT * FROM table WHERE id = ?`).all(id);
   
   // New (Drizzle ORM):
   import { db } from '@/lib/db';
   import { table } from '@/shared/schema';
   import { eq } from 'drizzle-orm';
   
   const rows = await db.select().from(table).where(eq(table.id, id));
   ```
5. **Replace stub** with working implementation
6. **Test locally** with PostgreSQL
7. **Submit PR** with migrated route

### Priority Routes (Highest Impact):
1. `/api/academy/lessons` - Core learning functionality
2. `/api/academy/progress` - Student progress tracking
3. `/api/academy/assessment/quiz/[quizId]/take` - Quiz functionality
4. `/api/academy/collaboration/posts` - Discussion features
5. `/api/academy/ai/generate/*` - AI-powered content

## 📚 Resources

- **Drizzle ORM Docs**: https://orm.drizzle.team/docs/overview
- **Schema Location**: `shared/schema.ts`
- **Database Config**: `lib/db/index.ts`
- **Migration Guide**: `POSTGRES_MIGRATION.md`

## ⏱️ Timeline Estimate

- **Per Route**: 15-30 minutes (simple queries) to 1-2 hours (complex logic)
- **Total for 34 routes**: 8-16 hours of development time
- **Can be parallelized**: Multiple developers can work on different routes simultaneously

---

**Last Updated**: November 5, 2025  
**Commit**: `ea3a7f34` - "fix: disable legacy SQLite academy routes during PostgreSQL migration"
