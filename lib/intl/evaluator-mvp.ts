/**
 * International Credential Evaluator - MVP Mode
 * 
 * Purpose: Transform international transcripts → NCAA eligibility reports
 * Mode: Rule-based matching with explicit heuristics
 * No ML, no external APIs - reliable, fast, auditable
 * 
 * Flow: ingest → suggest → evaluate → report
 */

import { db } from "@/lib/db";
import {
  intlCountries,
  intlSystems,
  intlGradeScales,
  intlCourseEquivalencies,
  intlTranscripts,
  intlStudentCourses,
  intlEvaluations,
  intlAuditLog,
  type IntlTranscript,
  type IntlStudentCourse,
  type IntlEvaluation,
} from "@/lib/db/schema-intl";
import { eq, and } from "drizzle-orm";

/**
 * NCAA Core Course Requirements (Division I & II)
 * Source: NCAA Eligibility Center
 */
const NCAA_CORE_REQUIREMENTS = {
  divisionI: {
    english: 4,
    mathAlgebraI: 3,
    science: 2,
    scienceLab: 2, // Must be lab-based
    socialScience: 2,
    additionalAcademic: 4, // English, math, science, or additional core
    total: 16,
  },
  divisionII: {
    english: 3,
    mathAlgebraI: 2,
    science: 2,
    scienceLab: 2,
    socialScience: 2,
    additionalAcademic: 4,
    total: 16,
  },
};

/**
 * Carnegie Unit Definition: 120 hours of instruction
 * 1 hour/day × 5 days/week × 36 weeks = 180 hours = 1.0 unit (US standard)
 * International courses vary; we calculate proportionally
 */
const CARNEGIE_UNIT_HOURS = 120;

/**
 * Phase 1: Ingest - Upload and parse transcript
 */
export async function ingestTranscript(params: {
  userId: string;
  countryId: string;
  systemId: string;
  schoolName?: string;
  schoolType?: string;
  curriculum?: string;
  language: string;
  courses: Array<{
    year: number;
    term?: string;
    subject: string;
    level?: string;
    localGrade: string;
    hoursPerWeek?: number;
    weeksPerYear?: number;
    isCompleted?: boolean;
  }>;
}) {
  // Create transcript record
  const [transcript] = await db
    .insert(intlTranscripts)
    .values({
      userId: params.userId,
      countryId: params.countryId,
      systemId: params.systemId,
      schoolName: params.schoolName,
      schoolType: params.schoolType,
      curriculum: params.curriculum,
      language: params.language,
      status: "processing",
    })
    .returning();

  // Insert all courses
  const coursePromises = params.courses.map((course) =>
    db.insert(intlStudentCourses).values({
      transcriptId: transcript.id,
      year: course.year,
      term: course.term,
      subject: course.subject,
      level: course.level,
      localGrade: course.localGrade,
      hoursPerWeek: course.hoursPerWeek,
      weeksPerYear: course.weeksPerYear,
      isCompleted: course.isCompleted ?? true,
    })
  );

  await Promise.all(coursePromises);

  return transcript;
}

/**
 * Phase 2: Suggest - Match courses to NCAA categories
 */
export async function suggestCourseMatches(transcriptId: number) {
  // Get transcript and system info
  const transcript = await db.query.intlTranscripts.findFirst({
    where: eq(intlTranscripts.id, transcriptId),
  });

  if (!transcript) throw new Error(`Transcript ${transcriptId} not found`);

  // Get all courses for this transcript
  const courses = await db
    .select()
    .from(intlStudentCourses)
    .where(eq(intlStudentCourses.transcriptId, transcriptId));

  // Get equivalency rules for this system
  const equivalencies = await db
    .select()
    .from(intlCourseEquivalencies)
    .where(eq(intlCourseEquivalencies.systemId, transcript.systemId));

  // Get grade scale for normalization
  const gradeScales = await db
    .select()
    .from(intlGradeScales)
    .where(eq(intlGradeScales.systemId, transcript.systemId));

  // Match each course
  const updates = courses.map(async (course) => {
    // Find best equivalency match
    const match = findBestMatch(course.subject, course.level, equivalencies);

    // Normalize grade to 4.0 scale
    const normalizedGrade = normalizeGrade(course.localGrade, gradeScales);

    // Calculate credit hours
    const creditHours = calculateCreditHours(
      course.hoursPerWeek,
      course.weeksPerYear,
      match?.defaultCreditHours
    );

    // Update course with suggestions
    await db
      .update(intlStudentCourses)
      .set({
        ncaaCategory: match?.ncaaCategory,
        usEquivalent: match?.usEquivalent,
        isLabScience: match?.isLabScience ?? false,
        isAlgebraIOrHigher: match?.isAlgebraIOrHigher ?? false,
        creditHoursAwarded: creditHours,
        normalizedGrade,
        requiresReview: match?.requiresReview ?? false,
        updatedAt: new Date(),
      })
      .where(eq(intlStudentCourses.id, course.id));
  });

  await Promise.all(updates);

  // Mark transcript as ready for evaluation
  await db
    .update(intlTranscripts)
    .set({ status: "completed", updatedAt: new Date() })
    .where(eq(intlTranscripts.id, transcriptId));

  return { transcriptId, coursesProcessed: courses.length };
}

/**
 * Phase 3: Evaluate - Calculate NCAA eligibility
 */
export async function evaluateEligibility(transcriptId: number) {
  const transcript = await db.query.intlTranscripts.findFirst({
    where: eq(intlTranscripts.id, transcriptId),
  });

  if (!transcript) throw new Error(`Transcript ${transcriptId} not found`);

  // Get all categorized courses
  const courses = await db
    .select()
    .from(intlStudentCourses)
    .where(
      and(
        eq(intlStudentCourses.transcriptId, transcriptId),
        eq(intlStudentCourses.isCompleted, true)
      )
    );

  // Calculate core GPA (NCAA core courses only)
  const coreCourses = courses.filter((c) => c.ncaaCategory);
  const coreGpa = calculateGPA(coreCourses);
  const overallGpa = calculateGPA(courses);

  // Sum credits by category
  const credits = {
    english: sumCredits(courses, "english"),
    mathAlgebraI: sumCredits(courses, "math"),
    science: sumCredits(courses, "science"),
    scienceLab: sumCredits(courses, "science", true),
    socialScience: sumCredits(courses, "social_science"),
    foreignLanguage: sumCredits(courses, "foreign_language"),
    additionalAcademic: 0, // Calculated below
  };

  // Additional academic = extra English/Math/Science + elective cores
  const extraCore = courses.filter(
    (c) =>
      c.ncaaCategory &&
      !["english", "math", "science", "social_science", "foreign_language"].includes(
        c.ncaaCategory
      )
  );
  credits.additionalAcademic = extraCore.reduce(
    (sum, c) => sum + (c.creditHoursAwarded || 0),
    0
  );

  const totalCoreUnits = Object.values(credits).reduce((sum, val) => sum + val, 0);

  // Count foreign language courses (not just credits)
  const foreignLanguageCount = courses.filter(
    (c) => c.ncaaCategory === "foreign_language"
  ).length;

  // Check Division I eligibility
  const divIStatus = checkDivisionIEligibility(credits, coreGpa);
  const divIIStatus = checkDivisionIIEligibility(credits, coreGpa);

  // Identify gaps
  const missingRequirements = identifyGaps(credits, NCAA_CORE_REQUIREMENTS.divisionI);
  const riskFactors = identifyRiskFactors(credits, coreGpa, coreCourses);
  const recommendedActions = generateRecommendations(
    missingRequirements,
    riskFactors
  );

  // Create evaluation record
  const [evaluation] = await db
    .insert(intlEvaluations)
    .values({
      transcriptId,
      userId: transcript.userId,
      coreGpa,
      overallGpa,
      coreUnits: totalCoreUnits,
      englishCredits: credits.english,
      mathAlgebraICredits: credits.mathAlgebraI,
      scienceCredits: credits.science,
      scienceLabCredits: credits.scienceLab,
      socialScienceCredits: credits.socialScience,
      additionalAcademicCredits: credits.additionalAcademic,
      foreignLanguageCredits: credits.foreignLanguage,
      foreignLanguageCount,
      divisionIStatus: divIStatus,
      divisionIIMStatus: divIIStatus,
      riskFactors: riskFactors as any,
      missingRequirements: missingRequirements as any,
      recommendedActions: recommendedActions as any,
      evaluatorVersion: "mvp",
    })
    .returning();

  return evaluation;
}

/**
 * Phase 4: Report - Generate PDF-ready summary
 */
export async function generateReport(evaluationId: number) {
  const evaluation = await db.query.intlEvaluations.findFirst({
    where: eq(intlEvaluations.id, evaluationId),
  });

  if (!evaluation) throw new Error(`Evaluation ${evaluationId} not found`);

  const transcript = await db.query.intlTranscripts.findFirst({
    where: eq(intlTranscripts.id, evaluation.transcriptId),
  });

  const courses = await db
    .select()
    .from(intlStudentCourses)
    .where(eq(intlStudentCourses.transcriptId, evaluation.transcriptId));

  // Format report data
  const report = {
    studentInfo: {
      userId: transcript!.userId,
      schoolName: transcript!.schoolName,
      country: transcript!.countryId,
      system: transcript!.systemId,
    },
    summary: {
      coreGpa: evaluation.coreGpa,
      overallGpa: evaluation.overallGpa,
      totalCoreUnits: evaluation.coreUnits,
      divisionIStatus: evaluation.divisionIStatus,
      divisionIIStatus: evaluation.divisionIIMStatus,
    },
    creditBreakdown: {
      english: evaluation.englishCredits,
      mathAlgebraI: evaluation.mathAlgebraICredits,
      science: evaluation.scienceCredits,
      scienceLab: evaluation.scienceLabCredits,
      socialScience: evaluation.socialScienceCredits,
      additionalAcademic: evaluation.additionalAcademicCredits,
      foreignLanguage: evaluation.foreignLanguageCredits,
    },
    requirements: {
      divisionI: NCAA_CORE_REQUIREMENTS.divisionI,
      divisionII: NCAA_CORE_REQUIREMENTS.divisionII,
    },
    courses: courses.map((c) => ({
      year: c.year,
      term: c.term,
      subject: c.subject,
      level: c.level,
      localGrade: c.localGrade,
      normalizedGrade: c.normalizedGrade,
      ncaaCategory: c.ncaaCategory,
      usEquivalent: c.usEquivalent,
      creditHours: c.creditHoursAwarded,
      isLabScience: c.isLabScience,
    })),
    analysis: {
      riskFactors: evaluation.riskFactors,
      missingRequirements: evaluation.missingRequirements,
      recommendedActions: evaluation.recommendedActions,
    },
    metadata: {
      evaluatedAt: evaluation.evaluatedAt,
      evaluatorVersion: evaluation.evaluatorVersion,
      generatedAt: new Date().toISOString(),
    },
  };

  return report;
}

// ========== Helper Functions ==========

function findBestMatch(
  subject: string,
  level: string | null | undefined,
  equivalencies: Array<any>
) {
  // Exact match first
  const exactMatch = equivalencies.find(
    (eq) => eq.localCourseName.toLowerCase() === subject.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  // Fuzzy match by keywords
  const fuzzyMatch = equivalencies.find((eq) => {
    const keywords = eq.matchKeywords ? JSON.parse(eq.matchKeywords) : [];
    return keywords.some((kw: string) =>
      subject.toLowerCase().includes(kw.toLowerCase())
    );
  });

  return fuzzyMatch || null;
}

function normalizeGrade(
  localGrade: string,
  gradeScales: Array<{ localGrade: string; usGpaEquivalent: number }>
) {
  const match = gradeScales.find(
    (gs) => gs.localGrade.toLowerCase() === localGrade.toLowerCase()
  );
  return match?.usGpaEquivalent || null;
}

function calculateCreditHours(
  hoursPerWeek: number | null | undefined,
  weeksPerYear: number | null | undefined,
  defaultCredit: number | null | undefined
) {
  if (hoursPerWeek && weeksPerYear) {
    const totalHours = hoursPerWeek * weeksPerYear;
    return Math.round((totalHours / CARNEGIE_UNIT_HOURS) * 10) / 10;
  }
  return defaultCredit || 1.0; // Default to 1.0 unit
}

function calculateGPA(courses: Array<any>) {
  const gradedCourses = courses.filter((c) => c.normalizedGrade !== null);
  if (gradedCourses.length === 0) return null;

  const totalGradePoints = gradedCourses.reduce(
    (sum, c) => sum + (c.normalizedGrade || 0) * (c.creditHoursAwarded || 1.0),
    0
  );
  const totalCredits = gradedCourses.reduce(
    (sum, c) => sum + (c.creditHoursAwarded || 1.0),
    0
  );

  return Math.round((totalGradePoints / totalCredits) * 100) / 100;
}

function sumCredits(
  courses: Array<any>,
  category: string,
  labScienceOnly = false
) {
  return courses
    .filter((c) => {
      if (c.ncaaCategory !== category) return false;
      if (labScienceOnly && !c.isLabScience) return false;
      return true;
    })
    .reduce((sum, c) => sum + (c.creditHoursAwarded || 0), 0);
}

function checkDivisionIEligibility(credits: any, coreGpa: number | null) {
  const req = NCAA_CORE_REQUIREMENTS.divisionI;
  const meetsEnglish = credits.english >= req.english;
  const meetsMath = credits.mathAlgebraI >= req.mathAlgebraI;
  const meetsScience = credits.science >= req.science;
  const meetsLabScience = credits.scienceLab >= req.scienceLab;
  const meetsSocialScience = credits.socialScience >= req.socialScience;
  const meetsGpa = coreGpa !== null && coreGpa >= 2.3;

  return meetsEnglish &&
    meetsMath &&
    meetsScience &&
    meetsLabScience &&
    meetsSocialScience &&
    meetsGpa
    ? "eligible"
    : "at_risk";
}

function checkDivisionIIEligibility(credits: any, coreGpa: number | null) {
  const req = NCAA_CORE_REQUIREMENTS.divisionII;
  const meetsEnglish = credits.english >= req.english;
  const meetsMath = credits.mathAlgebraI >= req.mathAlgebraI;
  const meetsScience = credits.science >= req.science;
  const meetsLabScience = credits.scienceLab >= req.scienceLab;
  const meetsSocialScience = credits.socialScience >= req.socialScience;
  const meetsGpa = coreGpa !== null && coreGpa >= 2.2;

  return meetsEnglish &&
    meetsMath &&
    meetsScience &&
    meetsLabScience &&
    meetsSocialScience &&
    meetsGpa
    ? "eligible"
    : "at_risk";
}

function identifyGaps(credits: any, requirements: any) {
  const gaps = [];
  if (credits.english < requirements.english)
    gaps.push(`English: ${requirements.english - credits.english} units short`);
  if (credits.mathAlgebraI < requirements.mathAlgebraI)
    gaps.push(`Math: ${requirements.mathAlgebraI - credits.mathAlgebraI} units short`);
  if (credits.science < requirements.science)
    gaps.push(`Science: ${requirements.science - credits.science} units short`);
  if (credits.scienceLab < requirements.scienceLab)
    gaps.push(
      `Lab Science: ${requirements.scienceLab - credits.scienceLab} units short`
    );
  if (credits.socialScience < requirements.socialScience)
    gaps.push(
      `Social Science: ${requirements.socialScience - credits.socialScience} units short`
    );
  return gaps;
}

function identifyRiskFactors(credits: any, coreGpa: number | null, coreCourses: Array<any>) {
  const risks = [];
  if (coreGpa !== null && coreGpa < 2.3)
    risks.push(`Core GPA (${coreGpa}) below NCAA minimum (2.3)`);
  if (coreCourses.some((c) => c.requiresReview))
    risks.push("Some courses flagged for manual review");
  if (coreCourses.some((c) => c.normalizedGrade === null))
    risks.push("Some grades could not be normalized");
  return risks;
}

function generateRecommendations(
  missingRequirements: Array<string>,
  riskFactors: Array<string>
) {
  const actions = [];
  if (missingRequirements.length > 0)
    actions.push("Complete missing core course requirements");
  if (riskFactors.some((r) => r.includes("GPA")))
    actions.push("Focus on improving grades in core courses");
  if (riskFactors.some((r) => r.includes("review")))
    actions.push("Submit official course syllabi for manual review");
  if (actions.length === 0)
    actions.push("Continue maintaining strong academic performance");
  return actions;
}
