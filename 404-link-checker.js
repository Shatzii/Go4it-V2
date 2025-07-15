#!/usr/bin/env node

/**
 * 404 Link Checker for Go4It Sports Platform
 * Comprehensive testing of all pages and links for 404 errors
 */

const http = require('http');
const { URL } = require('url');

const BASE_URL = 'http://localhost:5000';
const TIMEOUT = 10000;

// Test results storage
const results = {
  passed: [],
  failed: [],
  total: 0
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, TIMEOUT);

    const req = http.request(url, options, (res) => {
      clearTimeout(timeout);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });

    req.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    req.end();
  });
}

// Test a single URL
async function testUrl(url, description) {
  console.log(`Testing: ${url}`);
  results.total++;
  
  try {
    const response = await makeRequest(url);
    
    if (response.statusCode === 200) {
      results.passed.push({ url, description, status: response.statusCode });
      console.log(`  ✅ ${description} - ${response.statusCode}`);
      return true;
    } else if (response.statusCode === 404) {
      results.failed.push({ url, description, status: response.statusCode, error: '404 Not Found' });
      console.log(`  ❌ ${description} - 404 NOT FOUND`);
      return false;
    } else {
      results.passed.push({ url, description, status: response.statusCode });
      console.log(`  ⚠️  ${description} - ${response.statusCode} (Not 200 but not 404)`);
      return true;
    }
  } catch (error) {
    results.failed.push({ url, description, status: 'ERROR', error: error.message });
    console.log(`  ❌ ${description} - ERROR: ${error.message}`);
    return false;
  }
}

// Main pages to test
const mainPages = [
  { url: '/', description: 'Homepage' },
  { url: '/dashboard', description: 'Dashboard' },
  { url: '/academy', description: 'Academy' },
  { url: '/upload', description: 'Upload Page' },
  { url: '/ai-teachers', description: 'AI Teachers' },
  { url: '/admin', description: 'Admin Panel' },
  { url: '/profile', description: 'Profile Page' },
  { url: '/auth', description: 'Authentication Page' },
  { url: '/teams', description: 'Teams Page' },
  { url: '/starpath', description: 'StarPath Page' },
  { url: '/highlight-reel', description: 'Highlight Reel' },
  { url: '/mobile-video', description: 'Mobile Video' },
  { url: '/models', description: 'Models Page' },
  { url: '/curriculum-generator', description: 'Curriculum Generator' },
  { url: '/gar-upload', description: 'GAR Upload' },
  { url: '/video-analysis', description: 'Video Analysis' },
  { url: '/parent-dashboard', description: 'Parent Dashboard' },
  { url: '/student-dashboard', description: 'Student Dashboard' }
];

// API endpoints to test
const apiEndpoints = [
  { url: '/api/health', description: 'Health Check API' },
  { url: '/api/auth/me', description: 'Auth Me API' },
  { url: '/api/auth/login', description: 'Auth Login API' },
  { url: '/api/auth/register', description: 'Auth Register API' },
  { url: '/api/notifications', description: 'Notifications API' },
  { url: '/api/recruitment/schools', description: 'Recruitment Schools API' },
  { url: '/api/recruitment/profile', description: 'Recruitment Profile API' },
  { url: '/api/integrations', description: 'Integrations API' },
  { url: '/api/ai/models', description: 'AI Models API' },
  { url: '/api/performance/metrics', description: 'Performance Metrics API' },
  { url: '/api/search', description: 'Search API' },
  { url: '/api/videos/upload', description: 'Video Upload API' },
  { url: '/api/academic', description: 'Academic API' },
  { url: '/api/academy', description: 'Academy API' },
  { url: '/api/accessibility', description: 'Accessibility API' },
  { url: '/api/achievements', description: 'Achievements API' },
  { url: '/api/admin', description: 'Admin API' },
  { url: '/api/ai', description: 'AI API' },
  { url: '/api/ai-coaching', description: 'AI Coaching API' },
  { url: '/api/analytics', description: 'Analytics API' },
  { url: '/api/challenges', description: 'Challenges API' },
  { url: '/api/communication', description: 'Communication API' },
  { url: '/api/gamification', description: 'Gamification API' },
  { url: '/api/gar', description: 'GAR API' },
  { url: '/api/health', description: 'Health API' },
  { url: '/api/highlight-reel', description: 'Highlight Reel API' },
  { url: '/api/mobile-tools', description: 'Mobile Tools API' },
  { url: '/api/profile', description: 'Profile API' },
  { url: '/api/starpath', description: 'StarPath API' },
  { url: '/api/teams', description: 'Teams API' },
  { url: '/api/videos', description: 'Videos API' }
];

// Static assets to test
const staticAssets = [
  { url: '/manifest.json', description: 'PWA Manifest' },
  { url: '/sw.js', description: 'Service Worker' },
  { url: '/favicon.ico', description: 'Favicon' },
  { url: '/_next/static/chunks/main.js', description: 'Main JS Bundle' },
  { url: '/_next/static/css/app.css', description: 'Main CSS Bundle' }
];

// Test for common 404 pages
const common404Tests = [
  { url: '/nonexistent-page', description: 'Non-existent Page' },
  { url: '/random-404-test', description: 'Random 404 Test' },
  { url: '/api/nonexistent', description: 'Non-existent API' },
  { url: '/dashboard/nonexistent', description: 'Non-existent Dashboard Sub-page' },
  { url: '/academy/nonexistent', description: 'Non-existent Academy Sub-page' }
];

// Run all tests
async function runAllTests() {
  console.log('🔍 Starting 404 Link Checker for Go4It Sports Platform\n');
  
  // Test main pages
  console.log('📄 Testing Main Pages...\n');
  for (const page of mainPages) {
    await testUrl(`${BASE_URL}${page.url}`, page.description);
  }
  
  console.log('\n📡 Testing API Endpoints...\n');
  for (const endpoint of apiEndpoints) {
    await testUrl(`${BASE_URL}${endpoint.url}`, endpoint.description);
  }
  
  console.log('\n📦 Testing Static Assets...\n');
  for (const asset of staticAssets) {
    await testUrl(`${BASE_URL}${asset.url}`, asset.description);
  }
  
  console.log('\n🔍 Testing Common 404 Cases...\n');
  for (const test of common404Tests) {
    const response = await testUrl(`${BASE_URL}${test.url}`, test.description);
    // For 404 tests, we actually expect them to fail (return 404)
    if (!response) {
      console.log(`  ✅ ${test.description} correctly returns 404`);
    } else {
      console.log(`  ⚠️  ${test.description} should return 404 but returned different status`);
    }
  }
  
  // Print summary
  console.log('\n📊 404 Link Check Results:');
  console.log(`  Total URLs Tested: ${results.total}`);
  console.log(`  Passed (200/other): ${results.passed.length}`);
  console.log(`  Failed (404/errors): ${results.failed.length}`);
  console.log(`  Success Rate: ${Math.round((results.passed.length / results.total) * 100)}%`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed URLs:');
    results.failed.forEach(result => {
      console.log(`  - ${result.url} (${result.description}): ${result.status} - ${result.error || 'Unknown error'}`);
    });
  }
  
  console.log('\n✅ Passed URLs:');
  results.passed.forEach(result => {
    console.log(`  - ${result.url} (${result.description}): ${result.status}`);
  });
  
  if (results.failed.length === 0) {
    console.log('\n🎉 All tested URLs are working correctly!');
  } else {
    console.log('\n⚠️  Some URLs returned 404 or errors. Please review the failed URLs above.');
  }
}

// Run the tests
runAllTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});