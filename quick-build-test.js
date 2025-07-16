#!/usr/bin/env node

/**
 * Quick Build Test - Simple Next.js build test
 */

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🧪 Quick Build Test Starting...\n');

// Test 1: Check for basic file structure
console.log('📋 Step 1: Checking file structure...');
const requiredFiles = [
  'package.json',
  'next.config.js',
  'app/layout.tsx',
  'app/page.tsx'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file} - exists`);
  } else {
    console.log(`  ❌ ${file} - missing`);
  }
});

// Test 2: Check for problematic patterns
console.log('\n📋 Step 2: Checking for build problems...');

function checkFileForProblems(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const problems = [];
    
    // Check for client-side revalidate
    if (content.includes("'use client'") && content.includes('export const revalidate')) {
      problems.push('Client component with revalidate export');
    }
    
    // Check for missing imports
    if (content.includes('useState') && !content.includes('import { useState')) {
      problems.push('Missing useState import');
    }
    
    if (problems.length > 0) {
      console.log(`  ⚠️  ${filePath}: ${problems.join(', ')}`);
    } else {
      console.log(`  ✅ ${filePath} - no problems`);
    }
  } catch (error) {
    console.log(`  ❌ ${filePath}: Error reading file`);
  }
}

// Check main files
const mainFiles = [
  'app/page.tsx',
  'app/layout.tsx',
  'app/dashboard/page.tsx',
  'app/auth/page.tsx',
  'app/admin/page.tsx',
  'app/academy/page.tsx'
];

mainFiles.forEach(checkFileForProblems);

console.log('\n🎯 Build test complete - check results above');
console.log('💡 To fix issues, run: node build-fix-immediate.js');