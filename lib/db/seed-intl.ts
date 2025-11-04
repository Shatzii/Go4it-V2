/**
 * Seed International Credential Engine Reference Data
 * Run with: npm run seed:intl
 * 
 * Purpose: Populate countries, systems, grade scales, and course equivalencies
 * for MVP launch (UK A-Levels, IB Diploma, German Abitur)
 */

import "dotenv/config";
import { db } from "./index";
import {
  intlCountries,
  intlSystems,
  intlGradeScales,
  intlCourseEquivalencies,
} from "./schema-intl";

async function seed() {
  console.log("🌍 Seeding International Credential Engine...");

  // 1. Seed Countries
  console.log("📍 Seeding countries...");
  await db.insert(intlCountries).values([
    { id: "GB", name: "United Kingdom", region: "Europe", isActive: true },
    { id: "DE", name: "Germany", region: "Europe", isActive: true },
    { id: "FR", name: "France", region: "Europe", isActive: true },
    { id: "ES", name: "Spain", region: "Europe", isActive: true },
    { id: "IT", name: "Italy", region: "Europe", isActive: true },
    { id: "CN", name: "China", region: "Asia", isActive: true },
    { id: "IN", name: "India", region: "Asia", isActive: true },
    { id: "JP", name: "Japan", region: "Asia", isActive: true },
    { id: "BR", name: "Brazil", region: "Americas", isActive: true },
    { id: "MX", name: "Mexico", region: "Americas", isActive: true },
  ]);

  // 2. Seed Education Systems
  console.log("🎓 Seeding education systems...");
  await db.insert(intlSystems).values([
    {
      id: "uk_alevel",
      countryId: "GB",
      name: "UK A-Levels",
      description: "General Certificate of Education Advanced Level",
      gradingScale: "A*-E",
      creditSystem: "hours",
      isActive: true,
      rulesVersion: "1.0",
    },
    {
      id: "ib_diploma",
      countryId: "GB", // IB is international but often UK-based
      name: "IB Diploma Programme",
      description: "International Baccalaureate Diploma",
      gradingScale: "1-7",
      creditSystem: "hours",
      isActive: true,
      rulesVersion: "1.0",
    },
    {
      id: "de_abitur",
      countryId: "DE",
      name: "German Abitur",
      description: "Allgemeine Hochschulreife",
      gradingScale: "1.0-6.0",
      creditSystem: "hours",
      isActive: true,
      rulesVersion: "1.0",
    },
  ]);

  // 3. Seed Grade Scales
  console.log("📊 Seeding grade scales...");

  // UK A-Level grades
  await db.insert(intlGradeScales).values([
    { systemId: "uk_alevel", localGrade: "A*", usGpaEquivalent: 4.0, description: "Exceptional" },
    { systemId: "uk_alevel", localGrade: "A", usGpaEquivalent: 3.7, description: "Excellent" },
    { systemId: "uk_alevel", localGrade: "B", usGpaEquivalent: 3.3, description: "Very Good" },
    { systemId: "uk_alevel", localGrade: "C", usGpaEquivalent: 3.0, description: "Good" },
    { systemId: "uk_alevel", localGrade: "D", usGpaEquivalent: 2.3, description: "Satisfactory" },
    { systemId: "uk_alevel", localGrade: "E", usGpaEquivalent: 2.0, description: "Pass" },
  ]);

  // IB Diploma grades
  await db.insert(intlGradeScales).values([
    { systemId: "ib_diploma", localGrade: "7", usGpaEquivalent: 4.0, description: "Excellent" },
    { systemId: "ib_diploma", localGrade: "6", usGpaEquivalent: 3.7, description: "Very Good" },
    { systemId: "ib_diploma", localGrade: "5", usGpaEquivalent: 3.3, description: "Good" },
    { systemId: "ib_diploma", localGrade: "4", usGpaEquivalent: 3.0, description: "Satisfactory" },
    { systemId: "ib_diploma", localGrade: "3", usGpaEquivalent: 2.3, description: "Mediocre" },
    { systemId: "ib_diploma", localGrade: "2", usGpaEquivalent: 2.0, description: "Poor" },
    { systemId: "ib_diploma", localGrade: "1", usGpaEquivalent: 1.0, description: "Very Poor" },
  ]);

  // German Abitur grades (inverted: 1.0 = best)
  await db.insert(intlGradeScales).values([
    { systemId: "de_abitur", localGrade: "1.0", usGpaEquivalent: 4.0, description: "Sehr gut" },
    { systemId: "de_abitur", localGrade: "1.5", usGpaEquivalent: 3.85, description: "Sehr gut" },
    { systemId: "de_abitur", localGrade: "2.0", usGpaEquivalent: 3.7, description: "Gut" },
    { systemId: "de_abitur", localGrade: "2.5", usGpaEquivalent: 3.4, description: "Gut" },
    { systemId: "de_abitur", localGrade: "3.0", usGpaEquivalent: 3.0, description: "Befriedigend" },
    { systemId: "de_abitur", localGrade: "3.5", usGpaEquivalent: 2.7, description: "Befriedigend" },
    { systemId: "de_abitur", localGrade: "4.0", usGpaEquivalent: 2.3, description: "Ausreichend" },
  ]);

  // 4. Seed Course Equivalencies
  console.log("📚 Seeding course equivalencies...");

  // UK A-Level courses
  await db.insert(intlCourseEquivalencies).values([
    {
      systemId: "uk_alevel",
      localCourseName: "A-Level Mathematics",
      ncaaCategory: "math",
      usEquivalent: "Algebra II / Pre-Calculus",
      isAlgebraIOrHigher: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["mathematics", "maths", "calculus"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "uk_alevel",
      localCourseName: "A-Level English Literature",
      ncaaCategory: "english",
      usEquivalent: "English Literature",
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["english", "literature"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "uk_alevel",
      localCourseName: "A-Level Biology",
      ncaaCategory: "science",
      usEquivalent: "Biology",
      isLabScience: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["biology", "life sciences"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "uk_alevel",
      localCourseName: "A-Level Chemistry",
      ncaaCategory: "science",
      usEquivalent: "Chemistry",
      isLabScience: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["chemistry"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "uk_alevel",
      localCourseName: "A-Level Physics",
      ncaaCategory: "science",
      usEquivalent: "Physics",
      isLabScience: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["physics"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "uk_alevel",
      localCourseName: "A-Level History",
      ncaaCategory: "social_science",
      usEquivalent: "World History",
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["history"]),
      confidenceScore: 1.0,
    },
  ]);

  // IB Diploma courses
  await db.insert(intlCourseEquivalencies).values([
    {
      systemId: "ib_diploma",
      localCourseName: "IB Mathematics: Analysis and Approaches",
      ncaaCategory: "math",
      usEquivalent: "Algebra II / Pre-Calculus",
      isAlgebraIOrHigher: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["mathematics", "math", "analysis"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "ib_diploma",
      localCourseName: "IB English A: Language and Literature",
      ncaaCategory: "english",
      usEquivalent: "English Language Arts",
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["english", "language", "literature"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "ib_diploma",
      localCourseName: "IB Biology",
      ncaaCategory: "science",
      usEquivalent: "Biology",
      isLabScience: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["biology"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "ib_diploma",
      localCourseName: "IB Chemistry",
      ncaaCategory: "science",
      usEquivalent: "Chemistry",
      isLabScience: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["chemistry"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "ib_diploma",
      localCourseName: "IB Physics",
      ncaaCategory: "science",
      usEquivalent: "Physics",
      isLabScience: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["physics"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "ib_diploma",
      localCourseName: "IB History",
      ncaaCategory: "social_science",
      usEquivalent: "World History",
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["history"]),
      confidenceScore: 1.0,
    },
  ]);

  // German Abitur courses
  await db.insert(intlCourseEquivalencies).values([
    {
      systemId: "de_abitur",
      localCourseName: "Mathematik",
      ncaaCategory: "math",
      usEquivalent: "Algebra II / Pre-Calculus",
      isAlgebraIOrHigher: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["mathematik", "mathematics"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "de_abitur",
      localCourseName: "Deutsch",
      ncaaCategory: "english",
      usEquivalent: "German Language (Foreign Language)",
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["deutsch", "german"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "de_abitur",
      localCourseName: "Biologie",
      ncaaCategory: "science",
      usEquivalent: "Biology",
      isLabScience: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["biologie", "biology"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "de_abitur",
      localCourseName: "Chemie",
      ncaaCategory: "science",
      usEquivalent: "Chemistry",
      isLabScience: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["chemie", "chemistry"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "de_abitur",
      localCourseName: "Physik",
      ncaaCategory: "science",
      usEquivalent: "Physics",
      isLabScience: true,
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["physik", "physics"]),
      confidenceScore: 1.0,
    },
    {
      systemId: "de_abitur",
      localCourseName: "Geschichte",
      ncaaCategory: "social_science",
      usEquivalent: "World History",
      defaultCreditHours: 1.0,
      matchKeywords: JSON.stringify(["geschichte", "history"]),
      confidenceScore: 1.0,
    },
  ]);

  console.log("✅ International Credential Engine seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
