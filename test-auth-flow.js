#!/usr/bin/env node

/**
 * Comprehensive Authentication Test Script
 * Tests the complete auth flow from registration to protected routes
 */

const BASE_URL = 'http://localhost:5000';

async function testAuthFlow() {
  console.log('🔬 Testing Go4It Sports Authentication System\n');

  // Generate unique test credentials
  const timestamp = Date.now();
  const testUser = {
    email: `test${timestamp}@example.com`,
    password: 'testpass123',
    username: `testuser${timestamp}`,
    firstName: 'Test',
    lastName: 'User'
  };

  let authCookie = null;

  try {
    // Test 1: Registration
    console.log('1️⃣ Testing User Registration...');
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful');
      console.log(`   User ID: ${registerData.user.id}`);
      console.log(`   Username: ${registerData.user.username}`);
      console.log(`   Role: ${registerData.user.role}`);
      
      // Extract auth cookie
      const setCookieHeader = registerResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        authCookie = setCookieHeader.split(';')[0];
        console.log('   Auth cookie set');
      }
    } else {
      const errorData = await registerResponse.json();
      console.log('❌ Registration failed:', errorData.error);
      return false;
    }

    // Test 2: Login with registered user
    console.log('\n2️⃣ Testing User Login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful');
      console.log(`   Welcome back: ${loginData.user.firstName} ${loginData.user.lastName}`);
      
      // Update auth cookie from login
      const setCookieHeader = loginResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        authCookie = setCookieHeader.split(';')[0];
      }
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData.error);
      return false;
    }

    // Test 3: Access protected route with auth
    console.log('\n3️⃣ Testing Protected Route Access...');
    const meResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Cookie': authCookie || ''
      }
    });

    if (meResponse.ok) {
      const userData = await meResponse.json();
      console.log('✅ Protected route access successful');
      console.log(`   Current user: ${userData.username} (${userData.email})`);
      console.log(`   Sport: ${userData.sport || 'Not set'}`);
      console.log(`   Position: ${userData.position || 'Not set'}`);
    } else {
      console.log('❌ Protected route access failed');
      console.log(`   Status: ${meResponse.status}`);
      return false;
    }

    // Test 4: Access protected route without auth
    console.log('\n4️⃣ Testing Unauthorized Access...');
    const unauthorizedResponse = await fetch(`${BASE_URL}/api/auth/me`);

    if (unauthorizedResponse.status === 401) {
      console.log('✅ Unauthorized access properly blocked');
      console.log('   Status: 401 Unauthorized');
    } else {
      console.log('❌ Security issue: Unauthorized access not properly blocked');
      return false;
    }

    // Test 5: Invalid login attempt
    console.log('\n5️⃣ Testing Invalid Login...');
    const invalidLoginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: 'wrongpassword'
      })
    });

    if (invalidLoginResponse.status === 401) {
      console.log('✅ Invalid login properly rejected');
      console.log('   Status: 401 Unauthorized');
    } else {
      console.log('❌ Security issue: Invalid login not properly rejected');
      return false;
    }

    console.log('\n🎉 All authentication tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ User Registration');
    console.log('   ✅ User Login');
    console.log('   ✅ Protected Route Access');
    console.log('   ✅ Unauthorized Access Protection');
    console.log('   ✅ Invalid Login Rejection');
    
    return true;

  } catch (error) {
    console.error('\n💥 Test failed with error:', error.message);
    return false;
  }
}

// Enhanced database connectivity test
async function testDatabaseConnectivity() {
  console.log('\n🔧 Testing Database Connectivity...');
  
  try {
    // Test notifications endpoint as a database connectivity check
    const response = await fetch(`${BASE_URL}/api/notifications`);
    
    if (response.ok) {
      console.log('✅ Database connectivity confirmed');
      const data = await response.json();
      console.log(`   Retrieved ${data.length || 0} notifications`);
    } else {
      console.log('⚠️ Database connectivity issue detected');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Database connectivity test failed:', error.message);
  }
}

// Run the complete test suite
async function runTests() {
  console.log('Go4It Sports Platform - Authentication Test Suite');
  console.log('=' .repeat(55));
  
  await testDatabaseConnectivity();
  
  console.log('\n' + '=' .repeat(55));
  const authTestPassed = await testAuthFlow();
  
  console.log('\n' + '=' .repeat(55));
  if (authTestPassed) {
    console.log('🏆 AUTHENTICATION SYSTEM: FULLY OPERATIONAL');
    console.log('   Ready for production use');
  } else {
    console.log('🚨 AUTHENTICATION SYSTEM: NEEDS ATTENTION');
    console.log('   Check logs for specific issues');
  }
  console.log('=' .repeat(55));
}

// Execute tests
runTests().catch(console.error);