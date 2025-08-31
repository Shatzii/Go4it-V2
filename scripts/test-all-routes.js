// Test all routes and pages for Go4It Sports Platform
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

// Key pages to test
const PAGES_TO_TEST = [
  '/',
  '/academy',
  '/dashboard',
  '/starpath',
  '/ai-coach',
  '/performance',
  '/recruiting-hub',
  '/pricing',
  '/register',
  '/profile',
  '/teams',
  '/rankings',
  '/video-analysis',
  '/upload',
  '/ncaa-eligibility',
  '/wellness-hub',
];

// Key API routes to test
const API_ROUTES_TO_TEST = [
  '/api/health',
  '/api/academy/courses',
  '/api/dashboard/overview',
  '/api/performance',
  '/api/gar-analysis',
  '/api/auth/me',
  '/api/models',
  '/api/starpath',
  '/api/rankings',
  '/api/ai-coach',
];

async function testRoute(route, isAPI = false) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: route,
      method: 'GET',
      timeout: 10000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const result = {
          route,
          status: res.statusCode,
          success: res.statusCode < 400,
          type: isAPI ? 'API' : 'Page',
          headers: res.headers,
          contentLength: data.length,
        };

        if (isAPI && data) {
          try {
            const parsed = JSON.parse(data);
            result.response = parsed;
            result.hasError = !!parsed.error;
          } catch (e) {
            result.parseError = true;
          }
        }

        resolve(result);
      });
    });

    req.on('error', (err) => {
      resolve({
        route,
        status: 'ERROR',
        success: false,
        type: isAPI ? 'API' : 'Page',
        error: err.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        route,
        status: 'TIMEOUT',
        success: false,
        type: isAPI ? 'API' : 'Page',
        error: 'Request timeout',
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Go4It Sports Platform Routes\n');

  const results = {
    pages: [],
    apis: [],
    summary: {
      total: 0,
      successful: 0,
      failed: 0,
      authRequired: 0,
    },
  };

  // Test pages
  console.log('📄 Testing Pages...');
  for (const page of PAGES_TO_TEST) {
    process.stdout.write(`Testing ${page}... `);
    const result = await testRoute(page, false);
    results.pages.push(result);

    if (result.success) {
      console.log(`✅ ${result.status}`);
      results.summary.successful++;
    } else {
      console.log(`❌ ${result.status} ${result.error || ''}`);
      results.summary.failed++;
    }
    results.summary.total++;
  }

  console.log('\n🔌 Testing API Routes...');

  // Test API routes
  for (const api of API_ROUTES_TO_TEST) {
    process.stdout.write(`Testing ${api}... `);
    const result = await testRoute(api, true);
    results.apis.push(result);

    if (result.success) {
      console.log(`✅ ${result.status}`);
      results.summary.successful++;
    } else if (result.status === 401) {
      console.log(`🔐 ${result.status} (Auth Required)`);
      results.summary.authRequired++;
    } else {
      console.log(`❌ ${result.status} ${result.error || ''}`);
      results.summary.failed++;
    }
    results.summary.total++;
  }

  // Generate report
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  console.log(`Total Routes Tested: ${results.summary.total}`);
  console.log(`✅ Successful: ${results.summary.successful}`);
  console.log(`🔐 Auth Required: ${results.summary.authRequired}`);
  console.log(`❌ Failed: ${results.summary.failed}`);

  const successRate = Math.round(
    ((results.summary.successful + results.summary.authRequired) / results.summary.total) * 100,
  );
  console.log(`📈 Overall Health: ${successRate}%`);

  // Show problematic routes
  const problematicRoutes = [...results.pages, ...results.apis].filter(
    (r) => !r.success && r.status !== 401,
  );
  if (problematicRoutes.length > 0) {
    console.log('\n🚨 PROBLEMATIC ROUTES:');
    problematicRoutes.forEach((route) => {
      console.log(
        `❌ ${route.route} - Status: ${route.status} ${route.error ? '(' + route.error + ')' : ''}`,
      );
    });
  }

  // Show auth-required routes (this is expected)
  const authRoutes = [...results.pages, ...results.apis].filter((r) => r.status === 401);
  if (authRoutes.length > 0) {
    console.log('\n🔐 AUTH-PROTECTED ROUTES (Expected):');
    authRoutes.forEach((route) => {
      console.log(`🔐 ${route.route}`);
    });
  }

  // Save results to file
  fs.writeFileSync(
    path.join(__dirname, '..', 'route-test-results.json'),
    JSON.stringify(results, null, 2),
  );

  console.log('\n✅ Route testing complete. Results saved to route-test-results.json');

  if (successRate >= 90) {
    console.log('🎉 Platform health is EXCELLENT!');
  } else if (successRate >= 75) {
    console.log('✅ Platform health is GOOD');
  } else {
    console.log('⚠️  Platform needs attention');
  }

  return results;
}

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testRoute };
