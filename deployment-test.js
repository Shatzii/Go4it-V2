#!/usr/bin/env node

// Comprehensive deployment test script
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Running comprehensive deployment test...');

// Test 1: Clean build test
console.log('\n1. Testing clean build process...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build process successful');
} catch (error) {
  console.log('❌ Build failed - using clean build script');
  try {
    execSync('node build-clean.js', { stdio: 'inherit' });
    console.log('✅ Clean build successful');
  } catch (cleanError) {
    console.error('❌ All build methods failed');
    process.exit(1);
  }
}

// Test 2: Check if .next directory was created
console.log('\n2. Checking build output...');
if (fs.existsSync('.next')) {
  console.log('✅ .next directory exists');

  // Check for static files
  if (fs.existsSync('.next/static')) {
    console.log('✅ Static files generated');
  } else {
    console.log('⚠️  Static files missing');
  }
} else {
  console.log('❌ .next directory missing');
}

// Test 3: Configuration validation
console.log('\n3. Validating configuration...');
try {
  const config = require('./next.config.js');
  console.log('✅ Next.js config valid');
  console.log(`   - Output: ${config.output}`);
  console.log(`   - Images unoptimized: ${config.images?.unoptimized}`);
} catch (error) {
  console.log('❌ Next.js config invalid:', error.message);
}

console.log('\n🎉 Deployment test completed');
