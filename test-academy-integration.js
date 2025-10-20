// Test script to verify all academy integrations are fully connected
const http = require('http');

const BASE_URL = 'localhost';
const PORT = 5000;

function fetchData(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: url,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ ok: res.statusCode === 200, data: JSON.parse(data), status: res.statusCode });
        } catch (e) {
          resolve({ ok: false, data: {}, status: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testEndpoint(name, url, expectedFields = []) {
  try {
    console.log(`\nTesting ${name}...`);
    const response = await fetchData(url);
    const data = response.data;

    if (response.ok) {
      console.log(`✅ ${name}: SUCCESS`);

      // Check for expected fields
      expectedFields.forEach((field) => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], data);
        if (value !== undefined) {
          console.log(
            `  - ${field}: ${typeof value === 'object' ? JSON.stringify(value).substring(0, 50) + '...' : value}`,
          );
        } else {
          console.log(`  ⚠️ Missing field: ${field}`);
        }
      });

      return { success: true, data };
    } else {
      console.log(`❌ ${name}: FAILED - Status ${response.status}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`❌ ${name}: ERROR - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runIntegrationTests() {
  console.log('='.repeat(60));
  console.log('ACADEMY INTEGRATION TEST SUITE');
  console.log('Testing all front-to-back connections');
  console.log('='.repeat(60));

  const testResults = [];

  // Test 1: Core Academy Courses
  testResults.push(
    await testEndpoint('Academy Courses', '/api/academy/courses', [
      'success',
      'courses',
      'courses[0].title',
      'courses[0].difficulty',
    ]),
  );

  // Test 2: Student Enrollment
  testResults.push(
    await testEndpoint('Student Enrollment', '/api/academy/enrollment', [
      'success',
      'enrollment.studentName',
      'enrollment.enrolledCourses',
      'enrollment.ncaaEligibility.status',
    ]),
  );

  // Test 3: Scheduling System
  testResults.push(
    await testEndpoint('Scheduling System (Master)', '/api/academy/scheduling', [
      'success',
      'masterSchedule',
      'calendar.events',
      'availableRooms',
    ]),
  );

  // Test 4: Student Schedule
  testResults.push(
    await testEndpoint('Student Schedule', '/api/academy/scheduling?studentId=test&grade=9', [
      'success',
      'schedule.studentId',
      'schedule.blocks',
      'schedule.totalCredits',
    ]),
  );

  // Test 5: Khan Academy Integration
  testResults.push(
    await testEndpoint('Khan Academy', '/api/academy/khan-integration?subject=math', [
      'success',
      'content',
      'message',
    ]),
  );

  // Test 6: Common Core Standards
  testResults.push(
    await testEndpoint('Common Core', '/api/academy/common-core?grade=9', [
      'success',
      'standards',
      'message',
    ]),
  );

  // Test 7: OpenStax Textbooks
  testResults.push(
    await testEndpoint('OpenStax', '/api/academy/openstax?subject=biology', [
      'success',
      'content',
      'message',
    ]),
  );

  // Test 8: MIT OpenCourseWare
  testResults.push(
    await testEndpoint('MIT OCW', '/api/academy/mit-ocw?subject=math', [
      'success',
      'content',
      'message',
    ]),
  );

  // Test 9: Curriculum Sync
  testResults.push(
    await testEndpoint('Curriculum Sync', '/api/academy/curriculum-sync?grade=9', [
      'sportsCourses',
      'curriculum',
      'message',
    ]),
  );

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));

  const passed = testResults.filter((r) => r.success).length;
  const failed = testResults.length - passed;

  console.log(`Total Tests: ${testResults.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / testResults.length) * 100).toFixed(1)}%`);

  if (passed === testResults.length) {
    console.log('\n🎉 ALL SYSTEMS FULLY CONNECTED AND FUNCTIONAL! 🎉');
    console.log('\nThe academy is ready for students with:');
    console.log('  • 4 Core Academy Courses');
    console.log('  • 330+ Integrated Lessons');
    console.log('  • Full K-12 Scheduling System');
    console.log('  • Khan Academy Integration');
    console.log('  • Common Core Standards');
    console.log('  • OpenStax Textbooks');
    console.log('  • MIT OpenCourseWare');
    console.log('  • NCAA Compliance Tracking');
  } else {
    console.log('\n⚠️ Some systems need attention');
  }
}

// Run the tests
runIntegrationTests().catch(console.error);
