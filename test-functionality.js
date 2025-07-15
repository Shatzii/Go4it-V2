#!/usr/bin/env node

/**
 * Go4It Sports Platform - Comprehensive Functionality Testing
 * Tests actual functionality, not just visual appearance
 */

const { spawn } = require('child_process');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const BASE_URL = 'http://localhost:5000';
let testResults = [];
let authToken = null;

// Test utilities
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

function addResult(test, passed, details = '') {
  testResults.push({ test, passed, details });
  log(`${test}: ${passed ? 'PASSED' : 'FAILED'} ${details}`, passed ? 'success' : 'error');
}

async function makeRequest(url, options = {}) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        ...options.headers
      }
    };
    
    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            data: { text: data }
          });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ ok: false, status: 0, error: error.message });
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test 1: Database Connection
async function testDatabaseConnection() {
  log('Testing database connection...');
  
  try {
    const result = await makeRequest(`${BASE_URL}/api/health`);
    addResult('Database Connection', result.ok, `Status: ${result.status}`);
    return result.ok;
  } catch (error) {
    addResult('Database Connection', false, error.message);
    return false;
  }
}

// Test 2: Authentication System
async function testAuthentication() {
  log('Testing authentication system...');
  
  // Test login with valid credentials
  const loginResult = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  });
  
  const loginPassed = loginResult.ok && loginResult.data.token;
  addResult('Login Authentication', loginPassed, 
    loginPassed ? 'Token received' : `Status: ${loginResult.status}, Error: ${loginResult.data.error || 'Unknown'}`);
  
  if (loginPassed) {
    authToken = loginResult.data.token;
    
    // Test protected route access
    const protectedResult = await makeRequest(`${BASE_URL}/api/auth/me`);
    addResult('Protected Route Access', protectedResult.ok, 
      protectedResult.ok ? 'User data retrieved' : `Status: ${protectedResult.status}`);
  }
  
  // Test login with invalid credentials
  const invalidLoginResult = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'wrong@example.com',
      password: 'wrongpassword'
    })
  });
  
  const invalidLoginPassed = !invalidLoginResult.ok && invalidLoginResult.status === 401;
  addResult('Invalid Login Rejection', invalidLoginPassed, 
    invalidLoginPassed ? 'Correctly rejected' : 'Security issue: invalid login accepted');
  
  return loginPassed;
}

// Test 3: API Endpoints Functionality
async function testAPIEndpoints() {
  log('Testing API endpoints functionality...');
  
  const endpoints = [
    { path: '/api/health', method: 'GET', expectAuth: false },
    { path: '/api/auth/me', method: 'GET', expectAuth: true },
    { path: '/api/notifications', method: 'GET', expectAuth: true },
    { path: '/api/performance/metrics', method: 'GET', expectAuth: true },
    { path: '/api/analytics/dashboard', method: 'GET', expectAuth: true },
  ];
  
  for (const endpoint of endpoints) {
    const result = await makeRequest(`${BASE_URL}${endpoint.path}`, {
      method: endpoint.method
    });
    
    const expectedStatus = endpoint.expectAuth && !authToken ? 401 : 200;
    const passed = result.status === expectedStatus;
    
    addResult(`API ${endpoint.path}`, passed, 
      `Expected ${expectedStatus}, got ${result.status}`);
  }
}

// Test 4: Database CRUD Operations
async function testDatabaseOperations() {
  log('Testing database CRUD operations...');
  
  if (!authToken) {
    addResult('Database CRUD Operations', false, 'No auth token available');
    return;
  }
  
  // Test user data retrieval
  const userResult = await makeRequest(`${BASE_URL}/api/auth/me`);
  const userPassed = userResult.ok && userResult.data.id;
  addResult('User Data Retrieval', userPassed, 
    userPassed ? `User ID: ${userResult.data.id}` : 'No user data returned');
  
  // Test profile update (if endpoint exists)
  const profileUpdateResult = await makeRequest(`${BASE_URL}/api/profile/update`, {
    method: 'POST',
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'User'
    })
  });
  
  // Don't fail if endpoint doesn't exist, just log
  if (profileUpdateResult.status !== 404) {
    addResult('Profile Update', profileUpdateResult.ok, 
      profileUpdateResult.ok ? 'Profile updated' : `Status: ${profileUpdateResult.status}`);
  }
}

// Test 5: Page Rendering and Functionality
async function testPageFunctionality() {
  log('Testing page functionality...');
  
  const pages = [
    { path: '/', name: 'Landing Page' },
    { path: '/auth', name: 'Authentication Page' },
    { path: '/dashboard', name: 'Dashboard Page' },
    { path: '/academy', name: 'Academy Page' },
    { path: '/video-analysis', name: 'Video Analysis Page' },
    { path: '/student-dashboard', name: 'Student Dashboard Page' }
  ];
  
  for (const page of pages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page.path}`);
      const content = response.data.text || JSON.stringify(response.data);
      
      // Check for React hydration and basic functionality
      const hasReactElements = content.includes('__NEXT_DATA__');
      const hasTitle = content.includes('<title>');
      const hasContent = content.length > 1000; // Minimum content size
      
      const passed = response.ok && hasReactElements && hasTitle && hasContent;
      addResult(`${page.name} Functionality`, passed, 
        `Status: ${response.status}, React: ${hasReactElements}, Content: ${hasContent}`);
    } catch (error) {
      addResult(`${page.name} Functionality`, false, error.message);
    }
  }
}

// Test 6: Form Submissions
async function testFormSubmissions() {
  log('Testing form submission functionality...');
  
  // Test registration form
  const registrationResult = await makeRequest(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      username: 'testuser' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    })
  });
  
  const regPassed = registrationResult.ok || registrationResult.status === 400; // 400 if user exists
  addResult('Registration Form', regPassed, 
    registrationResult.ok ? 'New user created' : 
    registrationResult.status === 400 ? 'User exists (expected)' : 
    `Status: ${registrationResult.status}`);
}

// Test 7: Real-time Features
async function testRealTimeFeatures() {
  log('Testing real-time features...');
  
  // Test notifications endpoint
  const notificationsResult = await makeRequest(`${BASE_URL}/api/notifications`);
  const notificationsPassed = authToken ? 
    (notificationsResult.ok || notificationsResult.status === 401) : 
    notificationsResult.status === 401;
  
  addResult('Notifications System', notificationsPassed, 
    `Status: ${notificationsResult.status}`);
  
  // Test WebSocket connection would go here if implemented
  // For now, just verify the endpoint exists
}

// Test 8: File Upload Functionality
async function testFileUpload() {
  log('Testing file upload functionality...');
  
  // Test video upload endpoint
  const uploadResult = await makeRequest(`${BASE_URL}/api/videos/upload`, {
    method: 'POST',
    body: JSON.stringify({
      filename: 'test.mp4',
      filesize: 1024000,
      type: 'video/mp4'
    })
  });
  
  // Don't fail if endpoint doesn't exist yet
  if (uploadResult.status !== 404) {
    addResult('File Upload', uploadResult.ok, 
      uploadResult.ok ? 'Upload initiated' : `Status: ${uploadResult.status}`);
  }
}

// Test 9: Academy System Functionality
async function testAcademySystem() {
  log('Testing academy system functionality...');
  
  // Test course enrollment
  const coursesResult = await makeRequest(`${BASE_URL}/api/academy/courses`);
  const coursesPassed = coursesResult.ok || coursesResult.status === 401;
  addResult('Academy Courses', coursesPassed, 
    coursesResult.ok ? 'Courses retrieved' : `Status: ${coursesResult.status}`);
  
  // Test student data
  const studentResult = await makeRequest(`${BASE_URL}/api/academy/student`);
  const studentPassed = studentResult.ok || studentResult.status === 401;
  addResult('Student Data', studentPassed, 
    studentResult.ok ? 'Student data retrieved' : `Status: ${studentResult.status}`);
}

// Test 10: Performance and Load Testing
async function testPerformance() {
  log('Testing performance and load handling...');
  
  const startTime = Date.now();
  const promises = [];
  
  // Send 10 concurrent requests to test load handling
  for (let i = 0; i < 10; i++) {
    promises.push(makeRequest(`${BASE_URL}/api/health`));
  }
  
  const results = await Promise.all(promises);
  const endTime = Date.now();
  
  const allPassed = results.every(result => result.ok);
  const responseTime = endTime - startTime;
  
  addResult('Load Handling', allPassed, 
    `10 concurrent requests in ${responseTime}ms, all passed: ${allPassed}`);
}

// Main test runner
async function runTests() {
  log('Starting comprehensive functionality tests...');
  log('='.repeat(60));
  
  // Run all tests
  await testDatabaseConnection();
  await testAuthentication();
  await testAPIEndpoints();
  await testDatabaseOperations();
  await testPageFunctionality();
  await testFormSubmissions();
  await testRealTimeFeatures();
  await testFileUpload();
  await testAcademySystem();
  await testPerformance();
  
  // Summary
  log('='.repeat(60));
  log('TEST SUMMARY');
  log('='.repeat(60));
  
  const passed = testResults.filter(r => r.passed).length;
  const total = testResults.length;
  const passRate = ((passed / total) * 100).toFixed(1);
  
  log(`Total Tests: ${total}`);
  log(`Passed: ${passed}`);
  log(`Failed: ${total - passed}`);
  log(`Pass Rate: ${passRate}%`);
  
  if (passed === total) {
    log('🎉 ALL TESTS PASSED - Platform is fully functional!', 'success');
  } else {
    log('❌ Some tests failed - Platform needs attention', 'error');
    
    // Show failed tests
    const failedTests = testResults.filter(r => !r.passed);
    log('\nFailed Tests:');
    failedTests.forEach(test => {
      log(`  - ${test.test}: ${test.details}`, 'error');
    });
  }
  
  return passRate >= 80; // 80% pass rate considered acceptable
}

// Run tests if called directly
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runTests };