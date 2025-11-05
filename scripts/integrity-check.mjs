#!/usr/bin/env node

/**
 * Integrity Check Script
 * Verifies presence of core StarPath files and directories
 * Run: npm run integrity
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");

const REQUIRED_PATHS = {
  // Core API routes
  "app/api/healthz/route.ts": "Basic health check endpoint",
  "app/api/healthz/starpath/route.ts": "StarPath health check endpoint",
  "app/api/starpath/summary/route.ts": "StarPath unified summary API",
  "app/api/starpath/ncaa/route.ts": "NCAA summary API",
  "app/api/starpath/auto-plan/route.ts": "Auto-plan courses API",
  "app/api/gar/session/route.ts": "GAR session tracking API",
  "app/api/gar/metrics/route.ts": "GAR metrics API",
  "app/api/academy/today/route.ts": "Daily studio API",
  "app/api/academy/studio/complete/route.ts": "Studio completion API",
  
  // Event Mode APIs (v2)
  "app/api/event/checkin/route.ts": "Event check-in API",
  "app/api/event/results/upload/route.ts": "Event results upload API",
  "app/api/event/summary/route.ts": "Event operations dashboard API",

  // Schema and types
  "lib/db/schema-starpath.ts": "StarPath database schema",
  "lib/db/schema-starpath-v2.ts": "StarPath v2 schema (multi-tenant + events)",
  "drizzle/20251103_starpath_v2.sql": "StarPath v2 migration",
  "lib/types/starpath.ts": "Shared StarPath types and DTOs",

  // Pages
  "app/(academy)/academy/page.tsx": "Academy dashboard page",
  "app/gar/page.tsx": "GAR analytics page",
  "app/starpath/page.tsx": "StarPath unified page",

  // Seed and test scripts
  "scripts/seed-starpath.mjs": "StarPath seed data script",
  "scripts/smoke.mjs": "Smoke test script",
};

async function checkPath(filePath, description) {
  const fullPath = path.join(ROOT, filePath);
  try {
    await fs.access(fullPath);
    console.log(`✅ ${filePath}`);
    return true;
  } catch {
    console.log(`❌ ${filePath} - ${description}`);
    return false;
  }
}

async function main() {
  console.log("🔍 StarPath Integrity Check");
  console.log("=".repeat(60));
  console.log(`Root: ${ROOT}\n`);

  let missing = 0;
  let found = 0;

  for (const [filePath, description] of Object.entries(REQUIRED_PATHS)) {
    const exists = await checkPath(filePath, description);
    if (exists) {
      found++;
    } else {
      missing++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 Integrity Summary");
  console.log("=".repeat(60));
  console.log(`✅ Found:   ${found}`);
  console.log(`❌ Missing: ${missing}`);
  console.log(`📈 Total:   ${found + missing}`);

  if (missing > 0) {
    console.log("\n⚠️  Some files are missing. StarPath may not function correctly.");
    console.log("💡 Run the full implementation to restore missing files.");
    process.exit(1);
  } else {
    console.log("\n🎉 All critical files present!");
    console.log("\n💡 Next steps:");
    console.log("  1. Set env vars: cp .env.example .env && edit .env");
    console.log("  2. Run migrations: npm run db:push");
    console.log("  3. Seed data: npm run seed:starpath");
    console.log("  4. Smoke test: npm run smoke");
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("\n💥 Integrity check crashed:", error);
  process.exit(1);
});
