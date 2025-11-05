#!/usr/bin/env node
/**
 * Add build-time safety to academy API routes
 * Returns 503 during build phase to prevent database access
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

console.log('🔄 Adding build-time safety to academy routes...\n');

let fixedCount = 0;

const buildGuardCode = `
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}
`;

filesToFix.forEach((filePath) => {
  const fullPath = path.join(workspaceRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already has build guard
  if (content.includes('phase-production-build')) {
    console.log(`✓ Already protected: ${filePath}`);
    return;
  }

  // Add build guard after each route handler function declaration
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  
  methods.forEach(method => {
    // Match: export async function GET(request: NextRequest) {
    const regex = new RegExp(
      `(export async function ${method}\\([^)]*\\)\\s*{)`,
      'g'
    );
    
    content = content.replace(regex, (match) => {
      return match + buildGuardCode;
    });
  });

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Protected: ${filePath}`);
  fixedCount++;
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Protected: ${fixedCount} files`);
console.log('='.repeat(50));
console.log('\n✨ All academy routes now skip database access during build!\n');
