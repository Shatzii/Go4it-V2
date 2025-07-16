#!/usr/bin/env node

/**
 * Immediate Build Fix - Remove problematic revalidate exports
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Immediate Build Fix - Removing revalidate issues...\n');

// Function to fix a single file
function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove problematic export statements
    const problematicExports = [
      /export const revalidate = \d+;?\s*\n?/g,
      /export const dynamic = ['"]force-dynamic['"];?\s*\n?/g,
      /export const fetchCache = ['"]force-no-store['"];?\s*\n?/g,
      /export const runtime = ['"]nodejs['"];?\s*\n?/g
    ];

    problematicExports.forEach(regex => {
      if (regex.test(content)) {
        content = content.replace(regex, '');
        modified = true;
      }
    });

    // Clean up extra empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ Fixed: ${filePath}`);
    } else {
      console.log(`  ✓ Clean: ${filePath}`);
    }
  } catch (error) {
    console.log(`  ❌ Error fixing ${filePath}: ${error.message}`);
  }
}

// Files to fix
const filesToFix = [
  './sports-school/app/schools/stage-prep/onboarding/page.tsx',
  './sports-school/app/schools/stage-prep/parent-dashboard/page.tsx',
  './sports-school/app/schools/sports/parent-dashboard/page.tsx',
  './sports-school/app/schools/secondary/parent-dashboard/page.tsx',
  './sports-school/app/schools/primary/parent-dashboard/page.tsx',
  './sports-school/app/schools/law/parent-dashboard/page.tsx',
  './sports-school/app/schools/language/parent-dashboard/page.tsx',
  './attached_assets/app/schools/stage-prep/onboarding/page.tsx',
  './attached_assets/app/schools/stage-prep/parent-dashboard/page.tsx',
  './attached_assets/app/schools/sports/parent-dashboard/page.tsx',
  './attached_assets/app/schools/secondary/parent-dashboard/page.tsx',
  './attached_assets/app/schools/primary/parent-dashboard/page.tsx',
  './attached_assets/app/schools/law/parent-dashboard/page.tsx',
  './attached_assets/app/schools/language/parent-dashboard/page.tsx'
];

// Fix all files
filesToFix.forEach(fixFile);

console.log('\n🎉 Build fix complete!');
console.log('📝 Summary:');
console.log('   - Removed invalid revalidate exports from client components');
console.log('   - Cleaned up dynamic export statements');
console.log('   - Fixed Next.js build compatibility issues');
console.log('\n✅ Ready for build test!');