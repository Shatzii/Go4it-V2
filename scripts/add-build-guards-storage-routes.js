#!/usr/bin/env node
/**
 * Add build-time guards to remaining academy routes that use server/storage
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/api/academy/enrollments/route.ts',
  'app/api/academy/courses/route.ts',
  'app/api/academy/assignments/route.ts',
  'app/api/academy/enroll/route.ts',
];

const workspaceRoot = path.join(__dirname, '..');

console.log('🔄 Adding build guards to storage-based academy routes...\n');

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
    // Match various patterns:
    // export async function GET(req: NextRequest)
    // export async function GET(_req: NextRequest)
    const patterns = [
      new RegExp(`(export async function ${method}\\([^)]*\\)\\s*{)`, 'g'),
      new RegExp(`(export async function ${method}\\s*\\([^)]*\\)\\s*{)`, 'g'),
    ];
    
    patterns.forEach(regex => {
      content = content.replace(regex, (match) => {
        return match + buildGuardCode;
      });
    });
  });

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Protected: ${filePath}`);
  fixedCount++;
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Protected: ${fixedCount} files`);
console.log('='.repeat(50));
console.log('\n✨ Storage-based routes now skip database access during build!\n');
