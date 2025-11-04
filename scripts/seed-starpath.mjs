#!/usr/bin/env node

/**
 * Seed StarPath Demo Data
 * Creates demo student, GAR sessions, and NCAA evaluation for testing
 * Run: npm run seed:starpath
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const timestamp = new Date().toISOString();

const data = {
  students: [
    {
      id: "demo-student-1",
      email: "demo+student@go4it.org",
      firstName: "Demo",
      lastName: "Student",
      graduationYear: 2026,
      division: "DI",
      fullTimeStudent: true,
      createdAt: timestamp,
    },
  ],
  garSessions: [
    {
      id: "gar-session-1",
      studentId: "demo-student-1",
      sessionDate: timestamp,
      duration: 60,
      sessionType: "testing",
      tags: ["speed", "vertical"],
      notes: "Baseline assessment",
    },
    {
      id: "gar-session-2",
      studentId: "demo-student-1",
      sessionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 45,
      sessionType: "training",
      tags: ["endurance"],
      notes: "Conditioning work",
    },
  ],
  garMetrics: [
    {
      studentId: "demo-student-1",
      garScore: 74,
      lastTestAt: timestamp,
      deltas: {
        speed: 2,
        vertical: 1,
        lateral: 0,
        endurance: -1,
      },
      readiness: 82,
      trainingLoad: 65,
    },
  ],
  evaluations: [
    {
      id: "eval-001",
      studentId: "demo-student-1",
      division: "DI",
      status: "ready",
      evaluationVersion: "2.0",
      summary: {
        coreGPA: 2.85,
        overallGPA: 3.1,
        coreUnits: 12,
        buckets: {
          english: 3,
          math: 2,
          science: 2,
          socialScience: 3,
          additional: 2,
          foreignLanguage: 0,
        },
        missing: [
          {
            bucket: "math",
            creditsNeeded: 1,
            description: "Math: 1 credit needed",
          },
          {
            bucket: "additional",
            creditsNeeded: 2,
            description: "Additional: 2 credits needed",
          },
        ],
        lastUpdated: timestamp,
      },
      recommendations: [
        {
          id: "rec-1",
          priority: "high",
          action: "Complete Algebra II or higher math course",
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
        },
        {
          id: "rec-2",
          priority: "medium",
          action: "Add 2 additional core academic credits",
          deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
        },
      ],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: timestamp,
    },
  ],
  studioProgress: [
    {
      studentId: "demo-student-1",
      currentWeek: 3,
      rotationsCompleted: 24,
      synthesisCompleted: 3,
      lastActivityAt: timestamp,
    },
  ],
};

async function main() {
  try {
    console.log("🌟 Seeding StarPath demo data...");

    // Create seeds directory
    const seedsDir = path.join(process.cwd(), "seeds");
    await fs.mkdir(seedsDir, { recursive: true });

    // Write seed file
    const seedFile = path.join(seedsDir, "starpath.seed.json");
    await fs.writeFile(seedFile, JSON.stringify(data, null, 2), "utf-8");

    console.log("✅ Seed file written:", seedFile);
    console.log("\n📊 Seed data summary:");
    console.log(`  - Students: ${data.students.length}`);
    console.log(`  - GAR Sessions: ${data.garSessions.length}`);
    console.log(`  - GAR Metrics: ${data.garMetrics.length}`);
    console.log(`  - Evaluations: ${data.evaluations.length}`);
    console.log(`  - Studio Progress: ${data.studioProgress.length}`);

    console.log("\n🎯 Demo student:");
    console.log(`  - ID: ${data.students[0].id}`);
    console.log(`  - Email: ${data.students[0].email}`);
    console.log(`  - Core GPA: ${data.evaluations[0].summary.coreGPA}`);
    console.log(`  - Core Units: ${data.evaluations[0].summary.coreUnits}`);
    console.log(`  - GAR Score: ${data.garMetrics[0].garScore}`);
    console.log(`  - Status: ${data.evaluations[0].status}`);

    console.log("\n💡 Next steps:");
    console.log("  1. Run migrations: npm run db:push");
    console.log("  2. Import seed data to DB (manual or via script)");
    console.log("  3. Run smoke tests: npm run smoke");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

main();
