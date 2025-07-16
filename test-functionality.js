/**
 * Go4It Sports Platform - Comprehensive Functionality Testing
 * Tests actual functionality, not just visual appearance
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 COMPREHENSIVE FUNCTIONALITY ANALYSIS\n');

// Test results storage
const testResults = [];

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const symbols = { info: 'ℹ', success: '✅', error: '❌', warning: '⚠️', test: '🧪' };
  console.log(`${symbols[type]} [${timestamp.split('T')[1].split('.')[0]}] ${message}`);
}

function addResult(test, passed, details = '') {
  testResults.push({ test, passed, details });
}

// 1. Test Database Connection
async function testDatabaseConnection() {
  log('Testing database connection...', 'test');
  
  try {
    const dbTestResult = execSync('node -e "const { testConnection } = require(\'./lib/db\'); testConnection().then(console.log).catch(console.error)"', { encoding: 'utf8', timeout: 5000 });
    
    if (dbTestResult.includes('success') || dbTestResult.includes('connected')) {
      log('Database connection successful', 'success');
      addResult('Database Connection', true, 'PostgreSQL connection working');
    } else {
      log('Database connection failed', 'error');
      addResult('Database Connection', false, 'PostgreSQL connection issues');
    }
  } catch (error) {
    log(`Database test failed: ${error.message}`, 'error');
    addResult('Database Connection', false, 'Database connection error');
  }
}

// 2. Test Authentication
async function testAuthentication() {
  log('Testing authentication system...', 'test');
  
  try {
    // Test login endpoint
    const loginTest = execSync('curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d \'{"email":"test@example.com","password":"password123"}\'', { encoding: 'utf8', timeout: 5000 });
    
    if (loginTest.includes('token') || loginTest.includes('success')) {
      log('Authentication login working', 'success');
      addResult('Authentication - Login', true, 'Login endpoint functional');
    } else {
      log('Authentication login failed', 'error');
      addResult('Authentication - Login', false, 'Login endpoint not working');
    }
    
    // Test registration endpoint
    const registerTest = execSync('curl -s -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d \'{"email":"newuser@test.com","password":"password123","username":"testuser","firstName":"Test","lastName":"User"}\'', { encoding: 'utf8', timeout: 5000 });
    
    if (registerTest.includes('token') || registerTest.includes('success') || registerTest.includes('already exists')) {
      log('Authentication registration working', 'success');
      addResult('Authentication - Register', true, 'Registration endpoint functional');
    } else {
      log('Authentication registration failed', 'error');
      addResult('Authentication - Register', false, 'Registration endpoint not working');
    }
    
  } catch (error) {
    log(`Authentication test failed: ${error.message}`, 'error');
    addResult('Authentication', false, 'Authentication system error');
  }
}

// 3. Test API Endpoints
async function testAPIEndpoints() {
  log('Testing API endpoints...', 'test');
  
  const endpoints = [
    { path: '/api/health', expectCode: 200 },
    { path: '/api/auth/me', expectCode: 401 }, // Should be unauthorized without token
    { path: '/api/notifications', expectCode: 401 }, // Should be unauthorized without token
    { path: '/api/gar/stats', expectCode: 401 }, // Should be unauthorized without token
  ];
  
  for (const endpoint of endpoints) {
    try {
      const testResult = execSync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:5000${endpoint.path}`, { encoding: 'utf8', timeout: 5000 });
      const statusCode = parseInt(testResult.trim());
      
      if (statusCode === endpoint.expectCode) {
        log(`${endpoint.path} - Status ${statusCode} ✓`, 'success');
        addResult(`API - ${endpoint.path}`, true, `Returns expected ${endpoint.expectCode}`);
      } else {
        log(`${endpoint.path} - Status ${statusCode} (expected ${endpoint.expectCode})`, 'warning');
        addResult(`API - ${endpoint.path}`, false, `Returns ${statusCode}, expected ${endpoint.expectCode}`);
      }
    } catch (error) {
      log(`${endpoint.path} - Error: ${error.message}`, 'error');
      addResult(`API - ${endpoint.path}`, false, 'Endpoint error');
    }
  }
}

// 4. Test Page Functionality
async function testPageFunctionality() {
  log('Testing page functionality...', 'test');
  
  const pages = [
    { path: '/', name: 'Landing Page' },
    { path: '/auth', name: 'Authentication' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/admin', name: 'Admin Panel' },
    { path: '/academy', name: 'Academy' },
    { path: '/upload', name: 'Upload' },
  ];
  
  for (const page of pages) {
    try {
      const testResult = execSync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:5000${page.path}`, { encoding: 'utf8', timeout: 5000 });
      const statusCode = parseInt(testResult.trim());
      
      if (statusCode === 200) {
        log(`${page.name} - Loading ✓`, 'success');
        addResult(`Page - ${page.name}`, true, 'Page loads successfully');
      } else {
        log(`${page.name} - Status ${statusCode}`, 'warning');
        addResult(`Page - ${page.name}`, false, `Returns status ${statusCode}`);
      }
    } catch (error) {
      log(`${page.name} - Error: ${error.message}`, 'error');
      addResult(`Page - ${page.name}`, false, 'Page loading error');
    }
  }
}

// 5. Test File Structure
async function testFileStructure() {
  log('Testing file structure...', 'test');
  
  const criticalFiles = [
    { path: 'lib/db.ts', name: 'Database Connection' },
    { path: 'lib/auth.ts', name: 'Authentication Library' },
    { path: 'lib/auth-client.ts', name: 'Auth Client' },
    { path: 'app/api/auth/login/route.ts', name: 'Login API' },
    { path: 'app/api/auth/me/route.ts', name: 'User API' },
    { path: 'app/api/notifications/route.ts', name: 'Notifications API' },
    { path: 'app/api/health/route.ts', name: 'Health Check API' },
  ];
  
  for (const file of criticalFiles) {
    if (fs.existsSync(file.path)) {
      log(`${file.name} - Found ✓`, 'success');
      addResult(`File - ${file.name}`, true, 'File exists');
    } else {
      log(`${file.name} - Missing ❌`, 'error');
      addResult(`File - ${file.name}`, false, 'File missing');
    }
  }
}

// 6. Test Token Inconsistencies
async function testTokenInconsistencies() {
  log('Testing token storage inconsistencies...', 'test');
  
  try {
    // Check for authToken vs auth-token inconsistencies
    const authTokenRefs = execSync('grep -r "authToken" app/ --include="*.ts" --include="*.tsx" | wc -l', { encoding: 'utf8' });
    const authTokenHyphenRefs = execSync('grep -r "auth-token" app/ --include="*.ts" --include="*.tsx" | wc -l', { encoding: 'utf8' });
    
    log(`Found ${authTokenRefs.trim()} references to 'authToken'`, 'info');
    log(`Found ${authTokenHyphenRefs.trim()} references to 'auth-token'`, 'info');
    
    if (parseInt(authTokenRefs.trim()) > 0 && parseInt(authTokenHyphenRefs.trim()) > 0) {
      log('Token storage inconsistency detected', 'warning');
      addResult('Token Consistency', false, 'Mixed authToken and auth-token usage');
    } else {
      log('Token storage consistent', 'success');
      addResult('Token Consistency', true, 'Consistent token naming');
    }
    
  } catch (error) {
    log(`Token consistency test failed: ${error.message}`, 'error');
    addResult('Token Consistency', false, 'Test error');
  }
}

// Main test runner
async function runTests() {
  log('Starting comprehensive functionality testing...', 'info');
  
  await testDatabaseConnection();
  await testAuthentication();
  await testAPIEndpoints();
  await testPageFunctionality();
  await testFileStructure();
  await testTokenInconsistencies();
  
  // Generate summary report
  log('\n📊 FUNCTIONALITY TEST SUMMARY', 'info');
  log('================================', 'info');
  
  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => r.passed === false).length;
  const total = testResults.length;
  
  log(`✅ Passed: ${passed}/${total}`, 'success');
  log(`❌ Failed: ${failed}/${total}`, 'error');
  log(`📈 Success Rate: ${Math.round((passed/total) * 100)}%`, 'info');
  
  // Show failed tests
  if (failed > 0) {
    log('\n🔍 ISSUES FOUND:', 'warning');
    testResults.filter(r => !r.passed).forEach(result => {
      log(`❌ ${result.test}: ${result.details}`, 'error');
    });
  }
  
  // Show critical fixes needed
  log('\n🔧 RECOMMENDED FIXES:', 'info');
  log('1. Fix token storage inconsistency (authToken vs auth-token)', 'warning');
  log('2. Ensure all API endpoints use consistent authentication', 'warning');
  log('3. Verify database connection and schema sync', 'warning');
  log('4. Test button functionality and form submissions', 'warning');
  log('5. Implement proper error handling for failed API calls', 'warning');
}

// Run the tests
runTests().catch(console.error);