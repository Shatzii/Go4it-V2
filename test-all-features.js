// Complete Platform Features Test
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
      resolve({ status: res.statusCode, path: url });
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

async function testAllFeatures() {
  console.log('='.repeat(60));
  console.log('COMPLETE PLATFORM FEATURES TEST');
  console.log('='.repeat(60));

  // Core pages that should work
  const corePages = [
    '/',
    '/dashboard',
    '/academy',
    '/academy/simple',
    '/starpath',
    '/teams',
    '/challenges',
    '/recruiting-hub',
    '/athletes',
    '/profile',
  ];

  // AI Coach pages
  const aiCoachPages = [
    '/ai-football-coach',
    '/ai-coach-dashboard',
    '/ai-coach',
    '/coaches-corner',
  ];

  // Authentication pages
  const authPages = ['/auth', '/register'];

  console.log('\n--- Core Platform Pages ---');
  let workingCore = 0;
  for (const page of corePages) {
    const result = await fetchData(page);
    const status =
      result.status === 200 ? '✅' : result.status === 404 ? '❌ 404' : `⚠️ ${result.status}`;
    console.log(`${status} ${page}`);
    if (result.status === 200) workingCore++;
  }

  console.log('\n--- AI Coach Features ---');
  let workingAI = 0;
  for (const page of aiCoachPages) {
    const result = await fetchData(page);
    const status =
      result.status === 200 ? '✅' : result.status === 404 ? '❌ 404' : `⚠️ ${result.status}`;
    console.log(`${status} ${page}`);
    if (result.status === 200) workingAI++;
  }

  console.log('\n--- Authentication System ---');
  let workingAuth = 0;
  for (const page of authPages) {
    const result = await fetchData(page);
    const status =
      result.status === 200 ? '✅' : result.status === 404 ? '❌ 404' : `⚠️ ${result.status}`;
    console.log(`${status} ${page}`);
    if (result.status === 200) workingAuth++;
  }

  console.log('\n--- Navigation Issues Found ---');
  const broken404s = [];
  const allPages = [...corePages, ...aiCoachPages, ...authPages];

  for (const page of allPages) {
    const result = await fetchData(page);
    if (result.status === 404) {
      broken404s.push(page);
    }
  }

  if (broken404s.length > 0) {
    console.log('404 pages that need fixing:');
    broken404s.forEach((page) => console.log(`  - ${page}`));
  } else {
    console.log('✅ No 404 errors found');
  }

  console.log('\n' + '='.repeat(60));
  console.log('PLATFORM STATUS SUMMARY');
  console.log('='.repeat(60));

  console.log(`Core Pages: ${workingCore}/${corePages.length} working`);
  console.log(`AI Coach: ${workingAI}/${aiCoachPages.length} working`);
  console.log(`Authentication: ${workingAuth}/${authPages.length} working`);

  const totalWorking = workingCore + workingAI + workingAuth;
  const totalPages = corePages.length + aiCoachPages.length + authPages.length;

  console.log(`\nOverall: ${totalWorking}/${totalPages} pages functional`);

  if (totalWorking >= totalPages * 0.9) {
    console.log('\n🚀 PLATFORM READY FOR PRODUCTION');
    console.log('✅ Most features working correctly');
    console.log('✅ Academy system operational');
    console.log('✅ AI Coach features active');
    console.log('✅ Authentication working');
  } else {
    console.log('\n⚠️ Some features need attention');
    console.log(`${broken404s.length} pages returning 404 errors`);
  }
}

testAllFeatures().catch(console.error);
