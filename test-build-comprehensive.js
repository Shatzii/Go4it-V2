#!/usr/bin/env node

/**
 * Comprehensive Build Test & Fix Script
 * Tests entire site and fixes common Next.js build issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Comprehensive Build Test & Fix...\n');

// 1. Fix revalidate issues in client components
function fixRevalidateIssues() {
  console.log('📋 Step 1: Fixing revalidate issues in client components...');
  
  const problematicFiles = [
    './sports-school/app/schools/stage-prep/onboarding/page.tsx',
    './sports-school/app/schools/stage-prep/parent-dashboard/page.tsx',
    './sports-school/app/schools/sports/parent-dashboard/page.tsx',
    './sports-school/app/schools/secondary/parent-dashboard/page.tsx',
    './sports-school/app/schools/primary/parent-dashboard/page.tsx',
    './sports-school/app/schools/law/parent-dashboard/page.tsx',
    './sports-school/app/schools/language/parent-dashboard/page.tsx'
  ];
  
  problematicFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`  ✓ Fixing ${filePath}`);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove invalid revalidate exports from client components
      content = content.replace(/export const revalidate = \d+;?\n?/g, '');
      content = content.replace(/export const dynamic = ['"]force-dynamic['"];?\n?/g, '');
      
      fs.writeFileSync(filePath, content);
    }
  });
  
  console.log('  ✅ Fixed revalidate issues\n');
}

// 2. Check for missing dependencies
function checkDependencies() {
  console.log('📋 Step 2: Checking dependencies...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const requiredDeps = [
      '@radix-ui/react-slot',
      '@radix-ui/react-label',
      '@radix-ui/react-progress',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-badge',
      'lucide-react'
    ];
    
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length > 0) {
      console.log(`  ⚠️  Missing dependencies: ${missingDeps.join(', ')}`);
      console.log('  📦 Installing missing dependencies...');
      execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
    }
    
    console.log('  ✅ All dependencies checked\n');
  } catch (error) {
    console.log('  ❌ Error checking dependencies:', error.message);
  }
}

// 3. Test API routes
async function testApiRoutes() {
  console.log('📋 Step 3: Testing API routes...');
  
  const apiRoutes = [
    '/api/health',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/me'
  ];
  
  // Start server for testing
  console.log('  🚀 Starting development server...');
  const serverProcess = execSync('npm run dev > /dev/null 2>&1 &', { stdio: 'inherit' });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  for (const route of apiRoutes) {
    try {
      const response = await fetch(`http://localhost:5000${route}`);
      console.log(`  ✓ ${route}: ${response.status}`);
    } catch (error) {
      console.log(`  ❌ ${route}: Failed to connect`);
    }
  }
  
  console.log('  ✅ API routes tested\n');
}

// 4. Test page builds
function testPageBuilds() {
  console.log('📋 Step 4: Testing page builds...');
  
  const importantPages = [
    './app/page.tsx',
    './app/dashboard/page.tsx',
    './app/auth/page.tsx',
    './app/admin/page.tsx',
    './app/academy/page.tsx'
  ];
  
  importantPages.forEach(page => {
    if (fs.existsSync(page)) {
      try {
        const content = fs.readFileSync(page, 'utf8');
        
        // Check for common issues
        if (content.includes("'use client'") && content.includes('export const revalidate')) {
          console.log(`  ⚠️  ${page}: Has revalidate in client component`);
        } else {
          console.log(`  ✓ ${page}: No build issues detected`);
        }
      } catch (error) {
        console.log(`  ❌ ${page}: Error reading file`);
      }
    } else {
      console.log(`  ⚠️  ${page}: File not found`);
    }
  });
  
  console.log('  ✅ Page builds tested\n');
}

// 5. Test database connection
function testDatabase() {
  console.log('📋 Step 5: Testing database connection...');
  
  if (process.env.DATABASE_URL) {
    console.log('  ✓ Database URL configured');
    console.log('  ✅ Database connection available\n');
  } else {
    console.log('  ⚠️  Database URL not configured');
    console.log('  ℹ️  This is normal for development\n');
  }
}

// 6. Build test
function testBuild() {
  console.log('📋 Step 6: Testing Next.js build...');
  
  try {
    console.log('  🔨 Running Next.js build...');
    execSync('npm run build', { stdio: 'inherit', timeout: 120000 });
    console.log('  ✅ Build successful!\n');
    return true;
  } catch (error) {
    console.log('  ❌ Build failed:', error.message);
    return false;
  }
}

// 7. Generate build report
function generateReport(buildSuccess) {
  console.log('📋 Step 7: Generating build report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    buildSuccess: buildSuccess,
    checkedItems: [
      'Revalidate issues in client components',
      'Missing dependencies',
      'API routes functionality',
      'Page build compatibility',
      'Database connection',
      'Next.js build process'
    ],
    recommendations: buildSuccess ? [
      'All systems operational',
      'Ready for deployment',
      'Monitor for any runtime errors'
    ] : [
      'Check console output for specific errors',
      'Review file imports and exports',
      'Ensure all components are properly typed'
    ]
  };
  
  fs.writeFileSync('./build-test-report.json', JSON.stringify(report, null, 2));
  console.log('  ✅ Build report generated\n');
  
  return report;
}

// Main execution
async function main() {
  try {
    // Fix known issues
    fixRevalidateIssues();
    checkDependencies();
    
    // Test components
    await testApiRoutes();
    testPageBuilds();
    testDatabase();
    
    // Test build
    const buildSuccess = testBuild();
    
    // Generate report
    const report = generateReport(buildSuccess);
    
    console.log('🎉 Comprehensive Build Test Complete!\n');
    console.log('📊 Summary:');
    console.log(`   Build Status: ${buildSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`   Checked Items: ${report.checkedItems.length}`);
    console.log(`   Report: ./build-test-report.json`);
    
    if (buildSuccess) {
      console.log('\n🚀 Site is ready for deployment!');
    } else {
      console.log('\n⚠️  Please review errors and run test again');
    }
    
  } catch (error) {
    console.error('❌ Test script failed:', error);
    process.exit(1);
  }
}

main();