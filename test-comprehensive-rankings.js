#!/usr/bin/env node

/**
 * Comprehensive Test Suite for New Ranking Functions
 * Tests all 15 independent Top 100 rankings
 */

const BASE_URL = 'http://localhost:5000';

// Test configurations for all 15 rankings
const testCases = [
  // American Football Rankings
  { sport: 'football', region: 'USA', gender: 'men', name: 'American Football USA Top 100' },
  { sport: 'football', region: 'Europe', gender: 'men', name: 'American Football Europe Top 30' },
  { sport: 'football', region: null, gender: 'men', name: 'American Football Global Top 100' },

  // Basketball Men's Rankings
  { sport: 'basketball', region: 'USA', gender: 'men', name: "Basketball Men's USA Top 100" },
  { sport: 'basketball', region: 'Europe', gender: 'men', name: "Basketball Men's Europe Top 100" },
  { sport: 'basketball', region: null, gender: 'men', name: "Basketball Men's Global Top 100" },

  // Basketball Women's Rankings
  { sport: 'basketball', region: 'USA', gender: 'women', name: "Basketball Women's USA Top 100" },
  {
    sport: 'basketball',
    region: 'Europe',
    gender: 'women',
    name: "Basketball Women's Europe Top 100",
  },
  { sport: 'basketball', region: null, gender: 'women', name: "Basketball Women's Global Top 100" },

  // Soccer Men's Rankings
  { sport: 'soccer', region: 'USA', gender: 'men', name: "Soccer Men's USA Top 100" },
  { sport: 'soccer', region: 'Europe', gender: 'men', name: "Soccer Men's Europe Top 100" },
  { sport: 'soccer', region: null, gender: 'men', name: "Soccer Men's Global Top 100" },

  // Soccer Women's Rankings
  { sport: 'soccer', region: 'USA', gender: 'women', name: "Soccer Women's USA Top 100" },
  { sport: 'soccer', region: 'Europe', gender: 'women', name: "Soccer Women's Europe Top 100" },
  { sport: 'soccer', region: null, gender: 'women', name: "Soccer Women's Global Top 100" },
];

async function testRankingEndpoint(testCase) {
  try {
    const response = await fetch(`${BASE_URL}/api/rankings/gar-ranking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sport: testCase.sport,
        region: testCase.region,
        gender: testCase.gender,
        maxResults: 100,
      }),
    });

    const data = await response.json();

    return {
      name: testCase.name,
      success: data.success || false,
      athletes: data.athletes ? data.athletes.length : 0,
      totalProcessed: data.metadata ? data.metadata.totalProcessed : 0,
      error: data.error || null,
    };
  } catch (error) {
    return {
      name: testCase.name,
      success: false,
      athletes: 0,
      totalProcessed: 0,
      error: error.message,
    };
  }
}

async function testPageAccess(path, expectedContent) {
  try {
    const response = await fetch(`${BASE_URL}${path}`);
    const html = await response.text();
    const hasContent = html.includes(expectedContent);

    return {
      path,
      status: response.status,
      hasContent,
      accessible: response.status === 200 && hasContent,
    };
  } catch (error) {
    return {
      path,
      status: 0,
      hasContent: false,
      accessible: false,
      error: error.message,
    };
  }
}

async function runComprehensiveTest() {
  console.log('🚀 Starting Comprehensive Rankings Test Suite\n');

  // Test 1: Health Check
  console.log('📋 1. Testing Application Health...');
  const healthCheck = await testPageAccess('/api/health', 'healthy');
  console.log(`   ${healthCheck.accessible ? '✅' : '❌'} Health Check: ${healthCheck.status}`);

  // Test 2: Page Accessibility
  console.log('\n📋 2. Testing Page Accessibility...');
  const pageTests = [
    { path: '/', content: 'Go4It Sports' },
    { path: '/rankings', content: 'American Football' },
    { path: '/dashboard', content: 'Dashboard' },
    { path: '/academy', content: 'Academy' },
    { path: '/pricing', content: 'Pricing' },
    { path: '/ai-coach', content: 'AI Coach' },
  ];

  for (const test of pageTests) {
    const result = await testPageAccess(test.path, test.content);
    console.log(`   ${result.accessible ? '✅' : '❌'} ${test.path}: ${result.status}`);
  }

  // Test 3: Comprehensive Rankings API
  console.log('\n📋 3. Testing All 15 Ranking Endpoints...');

  let successCount = 0;
  let totalAthletes = 0;

  for (const testCase of testCases) {
    const result = await testRankingEndpoint(testCase);
    const status = result.success ? '✅' : '❌';

    console.log(
      `   ${status} ${result.name}: ${result.athletes} athletes (${result.totalProcessed} processed)`,
    );

    if (result.success) {
      successCount++;
      totalAthletes += result.athletes;
    }

    if (result.error) {
      console.log(`       Error: ${result.error}`);
    }
  }

  // Test 4: Summary Report
  console.log('\n📊 Test Summary:');
  console.log(`   Total Rankings Tested: ${testCases.length}`);
  console.log(`   Successful Rankings: ${successCount}`);
  console.log(`   Failed Rankings: ${testCases.length - successCount}`);
  console.log(`   Total Athletes Found: ${totalAthletes}`);
  console.log(`   Success Rate: ${Math.round((successCount / testCases.length) * 100)}%`);

  // Test 5: System Status
  console.log('\n🎯 System Status:');
  if (successCount === testCases.length) {
    console.log('   ✅ ALL RANKINGS OPERATIONAL - System fully functional!');
  } else if (successCount > testCases.length / 2) {
    console.log('   ⚠️  PARTIAL FUNCTIONALITY - Some rankings need attention');
  } else {
    console.log('   ❌ SYSTEM ISSUES - Multiple rankings failing');
  }

  console.log('\n✨ Test Complete!\n');
}

// Run the test
runComprehensiveTest().catch(console.error);
