#!/usr/bin/env node
/**
 * Remove duplicate build guards from academy routes
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/api/academy/enrollments/route.ts',
  'app/api/academy/assignments/route.ts',
  'app/api/academy/enroll/route.ts',
];

const workspaceRoot = path.join(__dirname, '..');

console.log('🧹 Removing duplicate build guards...\n');

let fixedCount = 0;

const duplicatePattern = /(\s*\/\/ Build-time safety: skip during static generation\s*\n\s*if \(process\.env\.NEXT_PHASE === 'phase-production-build'\) {\s*\n\s*return NextResponse\.json\([^}]+}\);?\s*\n\s*}\s*\n)(\s*\/\/ Build-time safety: skip during static generation\s*\n\s*if \(process\.env\.NEXT_PHASE === 'phase-production-build'\) {\s*\n\s*return NextResponse\.json\([^}]+}\);?\s*\n\s*}\s*\n)/g;

filesToFix.forEach((filePath) => {
  const fullPath = path.join(workspaceRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Remove duplicates - keep only the first occurrence
  content = content.replace(duplicatePattern, '$1');
  
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Cleaned: ${filePath}`);
    fixedCount++;
  } else {
    console.log(`✓ Already clean: ${filePath}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Cleaned: ${fixedCount} files`);
console.log('='.repeat(50));
console.log('\n✨ Duplicate build guards removed!\n');
