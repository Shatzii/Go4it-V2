#!/usr/bin/env node

/**
 * Pre-Deployment Test Suite
 * Comprehensive testing script for Go4It Sports Platform
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';
const TIMEOUT = 10000;

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const timeout = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, TIMEOUT);

    const req = protocol.request(url, options, (res) => {
      clearTimeout(timeout);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    if (options.method === 'POST' && options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Test functions
async function testHealthEndpoint() {
  console.log('🔍 Testing health endpoint...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/health`);
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      if (data.status === 'healthy') {
        return { passed: true, message: 'Health endpoint responding correctly' };
      }
    }
    return { passed: false, message: `Health check failed: ${response.statusCode}` };
  } catch (error) {
    return { passed: false, message: `Health endpoint error: ${error.message}` };
  }
}

async function testPageEndpoints() {
  console.log('🔍 Testing page endpoints...');
  const pages = ['/', '/dashboard', '/academy', '/upload', '/ai-teachers'];
  const results = [];

  for (const page of pages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page}`);
      if (response.statusCode === 200) {
        results.push({ page, passed: true, message: `Page ${page} loads correctly` });
      } else {
        results.push({ page, passed: false, message: `Page ${page} returned ${response.statusCode}` });
      }
    } catch (error) {
      results.push({ page, passed: false, message: `Page ${page} error: ${error.message}` });
    }
  }

  return results;
}

async function testAPIEndpoints() {
  console.log('🔍 Testing API endpoints...');
  const endpoints = [
    { url: '/api/recruitment/schools', method: 'GET', expectAuth: true },
    { url: '/api/integrations', method: 'GET', expectAuth: true },
    { url: '/api/ai/models', method: 'GET', expectAuth: true },
    { url: '/api/performance/metrics', method: 'GET', expectAuth: true },
    { url: '/api/notifications', method: 'GET', expectAuth: true },
    { 
      url: '/api/search', 
      method: 'POST', 
      expectAuth: true,
      body: JSON.stringify({ query: 'test', filters: { type: 'all' } }),
      headers: { 'Content-Type': 'application/json' }
    }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const options = {
        method: endpoint.method,
        headers: endpoint.headers || {},
        body: endpoint.body
      };

      const response = await makeRequest(`${BASE_URL}${endpoint.url}`, options);
      
      if (endpoint.expectAuth && response.statusCode === 401) {
        results.push({ 
          endpoint: endpoint.url, 
          passed: true, 
          message: `${endpoint.url} properly secured (401 as expected)` 
        });
      } else if (!endpoint.expectAuth && response.statusCode === 200) {
        results.push({ 
          endpoint: endpoint.url, 
          passed: true, 
          message: `${endpoint.url} responding correctly` 
        });
      } else {
        results.push({ 
          endpoint: endpoint.url, 
          passed: false, 
          message: `${endpoint.url} unexpected response: ${response.statusCode}` 
        });
      }
    } catch (error) {
      results.push({ 
        endpoint: endpoint.url, 
        passed: false, 
        message: `${endpoint.url} error: ${error.message}` 
      });
    }
  }

  return results;
}

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/health`);
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      if (data.database_status === 'connected') {
        return { passed: true, message: 'Database connection successful' };
      }
    }
    return { passed: false, message: 'Database connection failed' };
  } catch (error) {
    return { passed: false, message: `Database test error: ${error.message}` };
  }
}

async function testFileStructure() {
  console.log('🔍 Testing file structure...');
  const criticalFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.js',
    'drizzle.config.ts',
    'app/layout.tsx',
    'app/page.tsx',
    'public/manifest.json',
    'public/sw.js',
    'lib/db.ts',
    'lib/auth.ts',
    'shared/schema.ts'
  ];

  const results = [];

  for (const file of criticalFiles) {
    if (fs.existsSync(file)) {
      results.push({ file, passed: true, message: `${file} exists` });
    } else {
      results.push({ file, passed: false, message: `${file} missing` });
    }
  }

  return results;
}

async function testBuildProcess() {
  console.log('🔍 Testing build process...');
  return new Promise((resolve) => {
    exec('npm run build', { timeout: 120000 }, (error, stdout, stderr) => {
      if (error) {
        resolve({ passed: false, message: `Build failed: ${error.message}` });
      } else {
        resolve({ passed: true, message: 'Build process completed successfully' });
      }
    });
  });
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Go4It Sports Platform Pre-Deployment Tests\n');
  
  const tests = [
    { name: 'Health Endpoint', test: testHealthEndpoint },
    { name: 'Page Endpoints', test: testPageEndpoints },
    { name: 'API Endpoints', test: testAPIEndpoints },
    { name: 'Database Connection', test: testDatabaseConnection },
    { name: 'File Structure', test: testFileStructure },
    { name: 'Build Process', test: testBuildProcess }
  ];

  for (const { name, test } of tests) {
    console.log(`\n📋 Running ${name} tests...`);
    const result = await test();
    
    if (Array.isArray(result)) {
      // Multiple test results
      result.forEach(r => {
        testResults.total++;
        if (r.passed) {
          testResults.passed++;
          console.log(`  ✅ ${r.message}`);
        } else {
          testResults.failed++;
          console.log(`  ❌ ${r.message}`);
        }
        testResults.details.push({ test: name, ...r });
      });
    } else {
      // Single test result
      testResults.total++;
      if (result.passed) {
        testResults.passed++;
        console.log(`  ✅ ${result.message}`);
      } else {
        testResults.failed++;
        console.log(`  ❌ ${result.message}`);
      }
      testResults.details.push({ test: name, ...result });
    }
  }

  // Print summary
  console.log('\n📊 Test Results Summary:');
  console.log(`  Total Tests: ${testResults.total}`);
  console.log(`  Passed: ${testResults.passed}`);
  console.log(`  Failed: ${testResults.failed}`);
  console.log(`  Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);

  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Platform is ready for deployment.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix issues before deployment.');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});