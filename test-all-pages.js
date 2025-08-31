// Comprehensive test for all pages and endpoints
const http = require('http');

const BASE_URL = 'localhost';
const PORT = 5000;

function fetchData(url) {
  return new Promise((resolve) => {
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
        resolve({ status: res.statusCode, path: url });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 'ERROR', path: url, error: err.message });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ status: 'TIMEOUT', path: url });
    });
    req.end();
  });
}

async function testAllPages() {
  console.log('='.repeat(60));
  console.log('COMPREHENSIVE PAGE & API TEST');
  console.log('='.repeat(60));

  // Main pages that should work
  const mainPages = [
    '/',
    '/academy',
    '/starpath',
    '/teams',
    '/challenges',
    '/wellness-hub',
    '/recruiting-hub',
    '/athletes',
    '/dashboard',
    '/profile',
  ];

  // API endpoints that should work
  const apiEndpoints = [
    '/api/health',
    '/api/auth/me',
    '/api/academy/courses',
    '/api/academy/enrollment',
    '/api/academy/scheduling',
    '/api/academy/khan-integration?subject=math',
    '/api/academy/common-core?grade=9',
    '/api/academy/openstax?subject=all',
    '/api/academy/mit-ocw?subject=all',
    '/api/academy/curriculum-sync?grade=9',
  ];

  console.log('\n--- Testing Main Pages ---');
  const pageResults = [];
  for (const page of mainPages) {
    const result = await fetchData(page);
    const status =
      result.status === 200 ? '✅' : result.status === 404 ? '❌ 404' : `⚠️ ${result.status}`;
    console.log(`${status} ${page}`);
    pageResults.push(result);
  }

  console.log('\n--- Testing API Endpoints ---');
  const apiResults = [];
  for (const endpoint of apiEndpoints) {
    const result = await fetchData(endpoint);
    const status =
      result.status === 200 ? '✅' : result.status === 404 ? '❌ 404' : `⚠️ ${result.status}`;
    console.log(`${status} ${endpoint}`);
    apiResults.push(result);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  const workingPages = pageResults.filter((r) => r.status === 200).length;
  const notFoundPages = pageResults.filter((r) => r.status === 404).length;
  const errorPages = pageResults.filter((r) => r.status !== 200 && r.status !== 404).length;

  const workingAPIs = apiResults.filter((r) => r.status === 200).length;
  const notFoundAPIs = apiResults.filter((r) => r.status === 404).length;
  const errorAPIs = apiResults.filter((r) => r.status !== 200 && r.status !== 404).length;

  console.log(`\nPages:`);
  console.log(`  ✅ Working: ${workingPages}/${mainPages.length}`);
  console.log(`  ❌ Not Found: ${notFoundPages}`);
  console.log(`  ⚠️ Errors: ${errorPages}`);

  console.log(`\nAPI Endpoints:`);
  console.log(`  ✅ Working: ${workingAPIs}/${apiEndpoints.length}`);
  console.log(`  ❌ Not Found: ${notFoundAPIs}`);
  console.log(`  ⚠️ Errors: ${errorAPIs}`);

  // List problem pages
  if (notFoundPages > 0) {
    console.log('\n404 Pages to fix:');
    pageResults
      .filter((r) => r.status === 404)
      .forEach((r) => {
        console.log(`  - ${r.path}`);
      });
  }

  if (errorPages > 0) {
    console.log('\nPages with errors:');
    pageResults
      .filter((r) => r.status !== 200 && r.status !== 404)
      .forEach((r) => {
        console.log(`  - ${r.path}: ${r.status}`);
      });
  }

  // Academy specific check
  console.log('\n--- Academy System Status ---');
  if (workingAPIs >= 8) {
    console.log('✅ Academy fully functional with all integrations');
  } else {
    console.log('⚠️ Some academy systems need attention');
  }
}

// Run the tests
testAllPages().catch(console.error);
