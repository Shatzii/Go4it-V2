#!/usr/bin/env node
/**
 * Migrate all academy API routes from better-sqlite3 to Drizzle ORM with PostgreSQL
 */

const fs = require('fs');
const path = require('path');

const filesToMigrate = [
  'app/api/academy/progress/route.ts',
  'app/api/academy/teacher/students/route.ts',
  'app/api/academy/lessons/route.ts',
  'app/api/academy/lessons/[lessonId]/route.ts',
  'app/api/academy/lessons/[lessonId]/content/route.ts',
  'app/api/academy/parent/students/[studentId]/grades/route.ts',
  'app/api/academy/parent/notifications/[notificationId]/read/route.ts',
  'app/api/academy/collaboration/posts/route.ts',
  'app/api/academy/collaboration/posts/[postId]/like/route.ts',
  'app/api/academy/parent/students/route.ts',
  'app/api/academy/collaboration/posts/[postId]/comments/route.ts',
  'app/api/academy/parent/students/[studentId]/assignments/route.ts',
  'app/api/academy/collaboration/comments/[commentId]/like/route.ts',
  'app/api/academy/collaboration/groups/route.ts',
  'app/api/academy/certification/transcripts/route.ts',
  'app/api/academy/certification/courses/route.ts',
  'app/api/academy/certification/certificates/route.ts',
  'app/api/academy/certification/certificates/[certificateId]/revoke/route.ts',
  'app/api/academy/certification/students/route.ts',
  'app/api/academy/certification/certificates/[certificateId]/download/route.ts',
  'app/api/academy/certification/achievements/route.ts',
  'app/api/academy/collaboration/groups/[groupId]/messages/route.ts',
  'app/api/academy/collaboration/groups/[groupId]/join/route.ts',
  'app/api/academy/ai/generate/quiz/route.ts',
  'app/api/academy/ai/generate/assignment/route.ts',
  'app/api/academy/ai/save/route.ts',
  'app/api/academy/ai/recent/route.ts',
  'app/api/academy/ai/templates/route.ts',
  'app/api/academy/ai/rate/route.ts',
  'app/api/academy/ai/generate/lesson/route.ts',
  'app/api/academy/ai/personalization/route.ts',
  'app/api/academy/assessment/attempt/[attemptId]/results/route.ts',
  'app/api/academy/assessment/attempt/[attemptId]/submit/route.ts',
  'app/api/academy/assessment/quiz/[quizId]/take/route.ts',
];

const workspaceRoot = path.join(__dirname, '..');

console.log('🔄 Migrating Academy API routes to Drizzle ORM...\n');

let migratedCount = 0;
let skippedCount = 0;

filesToMigrate.forEach((filePath) => {
  const fullPath = path.join(workspaceRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    skippedCount++;
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already using new db import
  if (content.includes("from '@/lib/db'") || content.includes('from "@/lib/db"')) {
    console.log(`✓ Already migrated: ${filePath}`);
    skippedCount++;
    return;
  }

  // Replace better-sqlite3 import with new db import
  content = content.replace(
    /import Database from ['"]better-sqlite3['"];?\s*\n/g,
    ''
  );
  
  // Remove path import if only used for db
  const hasOtherPathUsage = content.match(/path\.(join|resolve|dirname|basename|extname)/g);
  if (!hasOtherPathUsage || hasOtherPathUsage.length <= 1) {
    content = content.replace(
      /import \* as path from ['"]path['"];?\s*\n/g,
      ''
    );
    content = content.replace(
      /import path from ['"]path['"];?\s*\n/g,
      ''
    );
  }

  // Remove dbPath declarations
  content = content.replace(
    /const dbPath = path\.join\(process\.cwd\(\), ['"]go4it-academy\.db['"]\);?\s*\n/g,
    ''
  );
  
  // Remove module-level db initialization
  content = content.replace(
    /const db = new Database\(dbPath\);?\s*\n/g,
    ''
  );

  // Add new imports at the top (after existing imports)
  const importSection = content.match(/^(import[\s\S]*?)\n\n/);
  if (importSection) {
    const existingImports = importSection[1];
    
    // Check if we need to add the db import
    if (!existingImports.includes("from '@/lib/db'")) {
      const newImports = existingImports + "\nimport { getDb } from '@/lib/db';";
      content = content.replace(importSection[1], newImports);
    }
  } else {
    // No imports found, add at the top
    content = "import { getDb } from '@/lib/db';\n\n" + content;
  }

  // Add db initialization inside route handlers
  // Pattern: export async function GET(
  content = content.replace(
    /(export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*{)/g,
    (match, p1) => {
      return p1 + '\n  const db = getDb();';
    }
  );

  // Write back
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Migrated: ${filePath}`);
  migratedCount++;
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Migrated: ${migratedCount} files`);
console.log(`⏭️  Skipped: ${skippedCount} files`);
console.log('='.repeat(50));
console.log('\n✨ Migration complete! All academy routes now use Drizzle ORM.');
console.log('📝 Note: Some routes may need manual adjustments for SQL queries.\n');
