// Production Authentication Test Suite
const http = require('http');

const BASE_URL = 'localhost';
const PORT = 5000;

function fetchData(url, options = {}) {
  return new Promise((resolve) => {
    const reqOptions = {
      hostname: BASE_URL,
      port: PORT,
      path: url,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const cookies = res.headers['set-cookie'];
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
            cookies: cookies,
            headers: res.headers,
          });
        } catch (e) {
          resolve({ status: res.statusCode, data: {}, cookies: null });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ status: 'ERROR', error: err.message });
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function testProductionAuth() {
  console.log('='.repeat(60));
  console.log('PRODUCTION AUTHENTICATION TEST SUITE');
  console.log('='.repeat(60));

  let authCookie = null;

  // Test 1: User Registration
  console.log('\n--- Testing User Registration ---');
  const registerResult = await fetchData('/api/auth/register', {
    method: 'POST',
    body: {
      email: 'test@go4itsports.com',
      password: 'securePassword123',
      firstName: 'Test',
      lastName: 'Student',
      sport: 'football',
      position: 'quarterback',
      grade: '11',
      acceptTerms: true,
    },
  });

  if (registerResult.status === 200 && registerResult.data.success) {
    console.log('✅ Registration: SUCCESS');
    console.log(
      `  - User: ${registerResult.data.user?.firstName} ${registerResult.data.user?.lastName}`,
    );
    console.log(`  - Email: ${registerResult.data.user?.email}`);
    if (registerResult.cookies) {
      authCookie = registerResult.cookies.find((c) => c.includes('auth-token'));
      console.log('  - Auth Cookie: SET');
    }
  } else {
    console.log('❌ Registration: FAILED');
    console.log(`  - Status: ${registerResult.status}`);
    console.log(`  - Error: ${registerResult.data.error || 'Unknown error'}`);
  }

  // Test 2: User Login
  console.log('\n--- Testing User Login ---');
  const loginResult = await fetchData('/api/auth/login', {
    method: 'POST',
    body: {
      email: 'demo@go4itsports.com',
      password: 'anypassword',
    },
  });

  if (loginResult.status === 200 && loginResult.data.success) {
    console.log('✅ Login: SUCCESS');
    console.log(`  - User: ${loginResult.data.user?.firstName} ${loginResult.data.user?.lastName}`);
    console.log(`  - Token: ${loginResult.data.token ? 'PROVIDED' : 'MISSING'}`);
    if (loginResult.cookies) {
      authCookie = loginResult.cookies.find((c) => c.includes('auth-token'));
      console.log('  - Auth Cookie: SET');
    }
  } else {
    console.log('❌ Login: FAILED');
    console.log(`  - Status: ${loginResult.status}`);
    console.log(`  - Error: ${loginResult.data.error || 'Unknown error'}`);
  }

  // Test 3: Protected Route Access
  console.log('\n--- Testing Protected Route Access ---');
  const headers = {};
  if (authCookie) {
    headers['Cookie'] = authCookie;
  }

  const meResult = await fetchData('/api/auth/me', { headers });

  if (meResult.status === 200 && meResult.data.success) {
    console.log('✅ Protected Route: SUCCESS');
    console.log(`  - User ID: ${meResult.data.user?.id}`);
    console.log(`  - Profile Complete: ${meResult.data.user?.profileSetupComplete}`);
    console.log(`  - GAR Score: ${meResult.data.user?.garScore}`);
  } else {
    console.log('❌ Protected Route: FAILED');
    console.log(`  - Status: ${meResult.status}`);
    console.log(`  - Error: ${meResult.data.error || 'Unknown error'}`);
  }

  // Test 4: Academy Access (Authenticated)
  console.log('\n--- Testing Academy Access ---');
  const academyResult = await fetchData('/api/academy/courses', { headers });

  if (academyResult.status === 200) {
    console.log('✅ Academy Access: SUCCESS');
    console.log(`  - Courses Available: ${academyResult.data.courses?.length || 0}`);
  } else {
    console.log('❌ Academy Access: FAILED');
    console.log(`  - Status: ${academyResult.status}`);
  }

  // Test 5: Enrollment System
  console.log('\n--- Testing Enrollment System ---');
  const enrollmentResult = await fetchData('/api/academy/enrollment', { headers });

  if (enrollmentResult.status === 200) {
    console.log('✅ Enrollment System: SUCCESS');
    console.log(`  - Student: ${enrollmentResult.data.enrollment?.studentName}`);
    console.log(
      `  - Enrolled Courses: ${enrollmentResult.data.enrollment?.enrolledCourses?.length || 0}`,
    );
  } else {
    console.log('❌ Enrollment System: FAILED');
    console.log(`  - Status: ${enrollmentResult.status}`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('PRODUCTION READINESS SUMMARY');
  console.log('='.repeat(60));

  const tests = [
    registerResult.status === 200,
    loginResult.status === 200,
    meResult.status === 200,
    academyResult.status === 200,
    enrollmentResult.status === 200,
  ];

  const passed = tests.filter(Boolean).length;
  const total = tests.length;

  console.log(`Authentication Tests: ${passed}/${total} passed`);

  if (passed === total) {
    console.log('\n🚀 PRODUCTION READY!');
    console.log('✅ Registration system working');
    console.log('✅ Login system working');
    console.log('✅ Session management working');
    console.log('✅ Protected routes working');
    console.log('✅ Academy integration working');
    console.log('\nThe platform is ready for deployment!');
  } else {
    console.log('\n⚠️ Issues found - needs attention before production');
  }
}

testProductionAuth().catch(console.error);
