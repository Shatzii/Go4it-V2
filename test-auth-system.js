/**
 * Comprehensive Authentication System Test
 * Tests user registration, login, camp registration, and database integration
 */

const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
  username: 'testathlete2025',
  email: 'test.athlete.2025@example.com',
  password: 'SecurePassword123!',
  firstName: 'John',
  lastName: 'Athlete',
  dateOfBirth: '2006-01-15',
  position: 'Quarterback',
  sport: 'football',
};

const testCampRegistration = {
  campId: 'merida-summer-2025',
  campName: 'Merida Summer Football Camp',
  campDates: 'July 15-28, 2025',
  campLocation: 'Merida, Mexico',
  parentName: 'Jane Athlete',
  parentEmail: 'jane.athlete@example.com',
  emergencyContact: 'John Athlete Sr.',
  emergencyPhone: '555-123-4567',
  experience: 'High School Varsity',
  garAnalysis: true,
  usaFootballMembership: true,
  actionNetworkOptIn: true,
  createAccount: true,
  registrationFee: 299.99,
};

async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error(`Request failed for ${endpoint}:`, error.message);
    return { error: error.message };
  }
}

async function testUserRegistration() {
  console.log('\n🔵 Testing User Registration...');

  const { response, data, error } = await makeRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser),
  });

  if (error) {
    console.log('❌ Registration request failed:', error);
    return false;
  }

  if (response.ok) {
    console.log('✅ User registration successful');
    console.log('   User ID:', data.user.id);
    console.log('   Username:', data.user.username);
    console.log('   Email:', data.user.email);
    console.log('   Role:', data.user.role);

    // Extract cookie for future requests
    const cookies = response.headers.get('set-cookie');
    if (cookies && cookies.includes('token=')) {
      console.log('✅ Authentication token set');
      return cookies;
    } else {
      console.log('⚠️  No authentication token received');
      return false;
    }
  } else {
    console.log('❌ Registration failed:', data.error);
    return false;
  }
}

async function testUserLogin() {
  console.log('\n🔵 Testing User Login...');

  const { response, data, error } = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }),
  });

  if (error) {
    console.log('❌ Login request failed:', error);
    return false;
  }

  if (response.ok) {
    console.log('✅ User login successful');
    console.log('   User ID:', data.user.id);
    console.log('   Username:', data.user.username);

    const cookies = response.headers.get('set-cookie');
    if (cookies && cookies.includes('token=')) {
      console.log('✅ Authentication token received');
      return cookies;
    }
  } else {
    console.log('❌ Login failed:', data.error);
  }

  return false;
}

async function testAuthenticatedRequest(cookies) {
  console.log('\n🔵 Testing Authenticated User Profile Fetch...');

  const { response, data, error } = await makeRequest('/api/auth/me', {
    method: 'GET',
    headers: {
      Cookie: cookies,
    },
  });

  if (error) {
    console.log('❌ Profile fetch request failed:', error);
    return false;
  }

  if (response.ok) {
    console.log('✅ User profile fetched successfully');
    console.log('   User ID:', data.id);
    console.log('   Name:', `${data.firstName} ${data.lastName}`);
    console.log('   Email:', data.email);
    console.log('   Position:', data.position);
    console.log('   Sport:', data.sport);
    return data;
  } else {
    console.log('❌ Profile fetch failed:', data.error);
    return false;
  }
}

async function testCampRegistrationWithAccount() {
  console.log('\n🔵 Testing Camp Registration with Account Creation...');

  // Use slightly different email to avoid conflicts
  const registrationData = {
    ...testCampRegistration,
    firstName: testUser.firstName,
    lastName: testUser.lastName,
    email: testUser.email.replace('@example.com', '+camp@example.com'),
    phone: '555-987-6543',
    dateOfBirth: testUser.dateOfBirth,
    position: testUser.position,
    username: testUser.username + '_camp',
    password: testUser.password,
  };

  const { response, data, error } = await makeRequest('/api/camp-registration', {
    method: 'POST',
    body: JSON.stringify(registrationData),
  });

  if (error) {
    console.log('❌ Camp registration request failed:', error);
    return false;
  }

  if (response.ok) {
    console.log('✅ Camp registration successful');
    console.log('   Registration ID:', data.registrationId);
    console.log('   Account Created:', data.accountCreated);
    console.log('   Message:', data.message);
    return data;
  } else {
    console.log('❌ Camp registration failed:', data.error);
    return false;
  }
}

async function testDatabaseQueries() {
  console.log('\n🔵 Testing Database Queries...');

  try {
    // Test notifications endpoint as a proxy for database connectivity
    const { response, data, error } = await makeRequest('/api/notifications');

    if (error) {
      console.log('❌ Database query failed:', error);
      return false;
    }

    if (response.ok) {
      console.log('✅ Database connection working');
      console.log('   Notifications available:', Array.isArray(data) ? data.length : 'Unknown');
      return true;
    } else {
      console.log('❌ Database query failed:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Database test error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Authentication System Test');
  console.log('================================================');

  let results = {
    registration: false,
    login: false,
    authRequest: false,
    campRegistration: false,
    database: false,
  };

  // Test 1: User Registration
  const registrationCookies = await testUserRegistration();
  results.registration = !!registrationCookies;

  // Test 2: User Login (using fresh login)
  const loginCookies = await testUserLogin();
  results.login = !!loginCookies;

  // Test 3: Authenticated Request
  if (loginCookies) {
    const userProfile = await testAuthenticatedRequest(loginCookies);
    results.authRequest = !!userProfile;
  }

  // Test 4: Camp Registration with Account Creation
  const campRegistration = await testCampRegistrationWithAccount();
  results.campRegistration = !!campRegistration;

  // Test 5: Database Connectivity
  const dbTest = await testDatabaseQueries();
  results.database = dbTest;

  // Results Summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`Registration:      ${results.registration ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Login:             ${results.login ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Auth Requests:     ${results.authRequest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Camp Registration: ${results.campRegistration ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Database:          ${results.database ? '✅ PASS' : '❌ FAIL'}`);

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;

  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Authentication system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please review the issues above.');
  }

  return results;
}

// Run the tests
runAllTests().catch(console.error);
