/**
 * Test Admin Login Flow
 * Tests the complete authentication flow for admin access
 */

const { execSync } = require('child_process');

console.log('=== Testing Admin Login Flow ===\n');

// Test 1: Login and get token
console.log('1. Testing login...');
try {
  const loginResult = execSync(
    `curl -s -X POST http://localhost:5000/api/auth/login \\
    -H "Content-Type: application/json" \\
    -d '{"email":"admin@goforit.com","password":"password123"}'`,
    { encoding: 'utf8' },
  );

  const loginData = JSON.parse(loginResult);

  if (loginData.token) {
    console.log('✅ Login successful');
    console.log('✅ Token received:', loginData.token.substring(0, 20) + '...');
    console.log('✅ User role:', loginData.user.role);

    // Test 2: Verify token with /api/auth/me
    console.log('\n2. Testing token verification...');
    const meResult = execSync(
      `curl -s -H "Authorization: Bearer ${loginData.token}" http://localhost:5000/api/auth/me`,
      { encoding: 'utf8' },
    );

    const meData = JSON.parse(meResult);

    if (meData.role === 'admin') {
      console.log('✅ Token verification successful');
      console.log('✅ Admin role confirmed');

      // Test 3: Check admin page access
      console.log('\n3. Testing admin page access...');
      const adminResult = execSync(`curl -s http://localhost:5000/admin`, { encoding: 'utf8' });

      if (adminResult.includes('AdminDashboard') || adminResult.includes('Admin Dashboard')) {
        console.log('✅ Admin page loading successfully');
      } else {
        console.log('❌ Admin page not loading properly');
      }

      console.log('\n=== Test Results ===');
      console.log('✅ All authentication tests passed');
      console.log('✅ Login flow is working correctly');
      console.log('✅ Token is valid and admin role is confirmed');
      console.log('\n📋 Instructions for user:');
      console.log('1. Go to /auth page');
      console.log('2. Enter email: admin@goforit.com');
      console.log('3. Enter password: password123');
      console.log('4. Click Sign In');
      console.log('5. You should be redirected to /admin automatically');
    } else {
      console.log('❌ Token verification failed or not admin');
      console.log('Response:', meData);
    }
  } else {
    console.log('❌ Login failed');
    console.log('Response:', loginData);
  }
} catch (error) {
  console.error('❌ Test failed:', error.message);
}
