#!/usr/bin/env node

/**
 * Smoke Tests for StarPath Integration
 * Tests critical endpoints without external dependencies (no jq required)
 * Run: npm run smoke
 */

const BASE_URL = process.env.BASE_URL || "http://0.0.0.0:3000";
const DEMO_STUDENT_ID = "demo-student-1";

const tests = [];
let passed = 0;
let failed = 0;

async function testEndpoint(name, path, validator) {
  try {
    const url = BASE_URL + path;
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   URL: ${url}`);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "StarPath-Smoke-Test/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (validator) {
      const validationResult = validator(data);
      if (validationResult !== true) {
        throw new Error(`Validation failed: ${validationResult}`);
      }
    }

    console.log(`   ✅ PASS`);
    passed++;
    return { name, status: "pass", data };
  } catch (error) {
    console.log(`   ❌ FAIL: ${error.message}`);
    failed++;
    return { name, status: "fail", error: error.message };
  }
}

async function runTests() {
  console.log("🚀 Starting StarPath Smoke Tests");
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Demo Student: ${DEMO_STUDENT_ID}`);
  console.log("=" .repeat(60));

  // Test 1: Basic health check
  await testEndpoint("Basic Health Check", "/api/healthz", (data) => {
    if (!data.ok) return "Health check returned ok: false";
    if (data.status !== "healthy") return `Expected status 'healthy', got '${data.status}'`;
    return true;
  });

  // Test 2: StarPath health check
  await testEndpoint("StarPath Health Check", "/api/healthz/starpath", (data) => {
    if (!data.ok) {
      if (data.status === "disabled") {
        return "StarPath feature is disabled. Set NEXT_PUBLIC_FEATURE_STARPATH=true";
      }
      if (data.status === "schema_missing") {
        return "StarPath schema missing. Run migrations: npm run db:push";
      }
      return `Health check failed: ${data.message || "Unknown reason"}`;
    }
    return true;
  });

  // Test 3: StarPath summary endpoint
  await testEndpoint(
    "StarPath Summary",
    `/api/starpath/summary?studentId=${DEMO_STUDENT_ID}`,
    (data) => {
      if (data.schemaVersion !== "1.0") {
        return `Expected schemaVersion '1.0', got '${data.schemaVersion}'`;
      }
      if (!data.ncaa) return "Missing 'ncaa' field";
      if (!data.gar) return "Missing 'gar' field";
      if (typeof data.ncaa.coreGPA !== "number") return "ncaa.coreGPA must be a number";
      if (typeof data.ncaa.coreUnits !== "number") return "ncaa.coreUnits must be a number";
      if (typeof data.gar.garScore !== "number") return "gar.garScore must be a number";
      return true;
    }
  );

  // Test 4: NCAA summary endpoint
  await testEndpoint("NCAA Summary", `/api/starpath/ncaa?studentId=${DEMO_STUDENT_ID}`, (data) => {
    if (typeof data.coreGPA !== "number") return "coreGPA must be a number";
    if (typeof data.coreUnits !== "number") return "coreUnits must be a number";
    if (!data.buckets) return "Missing 'buckets' field";
    if (!Array.isArray(data.missing)) return "'missing' must be an array";
    return true;
  });

  // Test 5: GAR metrics endpoint
  await testEndpoint("GAR Metrics", `/api/gar/metrics?studentId=${DEMO_STUDENT_ID}`, (data) => {
    if (typeof data.garScore !== "number") return "garScore must be a number";
    if (!data.lastTestAt) return "Missing 'lastTestAt' field";
    return true;
  });

  // Test 6: Studio today endpoint (may return 404 if no studio scheduled)
  await testEndpoint("Studio Today", "/api/academy/today", (data) => {
    // Allow 404 or valid response
    return true;
  });

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 Test Summary");
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total:  ${passed + failed}`);

  if (failed > 0) {
    console.log("\n⚠️  Some tests failed. Check the output above for details.");
    process.exit(1);
  } else {
    console.log("\n🎉 All smoke tests passed!");
    process.exit(0);
  }
}

// Run tests
runTests().catch((error) => {
  console.error("\n💥 Smoke test runner crashed:", error);
  process.exit(1);
});
