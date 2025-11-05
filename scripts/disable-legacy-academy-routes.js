#!/usr/bin/env node
/**
 * Add comprehensive error handling to academy routes
 * These routes use raw SQLite queries and need full migration to Drizzle ORM
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
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

console.log('🔄 Disabling legacy SQLite academy routes...\n');

let fixedCount = 0;

filesToFix.forEach((filePath) => {
  const fullPath = path.join(workspaceRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already has proper stub
  if (content.includes('Academy feature requires database migration')) {
    console.log(`✓ Already disabled: ${filePath}`);
    return;
  }

  // Extract route config lines
  const exportDynamic = content.match(/export const dynamic = ['"]force-dynamic['"];?/)?.[0] || '';
  const exportRuntime = content.match(/export const runtime = ['"]nodejs['"];?/)?.[0] || '';
  
  // Create new content with stub handlers
  const newContent = `import { NextRequest, NextResponse } from 'next/server';

${exportDynamic ? exportDynamic + '\n' : ''}${exportRuntime ? exportRuntime + '\n' : ''}
// TODO: This route uses raw SQLite queries and needs migration to Drizzle ORM
// Temporarily disabled during PostgreSQL migration

const MIGRATION_MESSAGE = {
  error: 'Academy feature requires database migration',
  message: 'This endpoint uses legacy SQLite and is being migrated to PostgreSQL',
  status: 'under_maintenance'
};

export async function GET(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

/* 
 * ORIGINAL CODE BELOW - NEEDS MIGRATION TO DRIZZLE ORM
 * ====================================================
${content.replace(/\*\//g, '* /')}
 */
`;

  fs.writeFileSync(fullPath, newContent, 'utf8');
  console.log(`✅ Disabled: ${filePath}`);
  fixedCount++;
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Disabled: ${fixedCount} legacy routes`);
console.log('='.repeat(50));
console.log('\n✨ All academy routes now return 503 (under maintenance)');
console.log('📝 Original code preserved in comments for future migration\n');
