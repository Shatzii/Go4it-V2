#!/usr/bin/env node
/**
 * Clean up academy route files - fix import order and remove duplicates
 */

const fs = require('fs');
const path = require('path');

const filesToClean = [
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

console.log('🧹 Cleaning up academy route imports...\n');

let cleanedCount = 0;

filesToClean.forEach((filePath) => {
  const fullPath = path.join(workspaceRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Remove all misplaced import statements and variable declarations
  const linesToRemove = [
    /import { getDb } from '@\/lib\/db';?\s*\n/g,
    /const db = getDb\(\);?\s*\n/g,
    /const dbPath = path\.join\(process\.cwd\(\), ['"]go4it-[^'"]+['"]?\);?\s*\n/g,
  ];
  
  linesToRemove.forEach(pattern => {
    content = content.replace(pattern, '');
  });
  
  // Find where imports should go (before first 'export')
  const exportMatch = content.match(/^([\s\S]*?)(export\s+(const|async|function))/m);
  
  if (exportMatch) {
    const beforeExport = exportMatch[1];
    const restOfFile = exportMatch[2] + content.substring(exportMatch.index + exportMatch[0].length);
    
    // Clean up the import section
    let imports = beforeExport;
    
    // Ensure NextRequest and NextResponse are imported
    if (!imports.includes('NextRequest') || !imports.includes('NextResponse')) {
      if (imports.includes('from \'next/server\'') || imports.includes('from "next/server"')) {
        // Update existing import
        imports = imports.replace(
          /import\s+{([^}]+)}\s+from\s+['"]next\/server['"]/,
          (match, p1) => {
            const currentImports = p1.split(',').map(s => s.trim()).filter(Boolean);
            const needed = ['NextRequest', 'NextResponse'];
            const combined = [...new Set([...currentImports, ...needed])];
            return `import { ${combined.join(', ')} } from 'next/server'`;
          }
        );
      } else {
        imports = `import { NextRequest, NextResponse } from 'next/server';\n` + imports;
      }
    }
    
    // Ensure clean line breaks
    imports = imports.trim() + '\n\n';
    
    content = imports + restOfFile;
  }
  
  // Remove any double blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // Only save if content changed
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Cleaned: ${filePath}`);
    cleanedCount++;
  } else {
    console.log(`✓ Already clean: ${filePath}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Cleaned: ${cleanedCount} files`);
console.log('='.repeat(50));
console.log('\n✨ Import cleanup complete!\n');
