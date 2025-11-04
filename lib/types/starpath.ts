/**
 * Shared Types and DTOs for StarPath
 * Used across API routes and UI components
 * Validated with Zod for runtime type safety
 */

import { z } from "zod";

// ========== NCAA Core Requirements ==========

export const NCAADivisionSchema = z.enum(["DI", "DII", "DIII", "NAIA", "NJCAA"]);
export type NCAADivision = z.infer<typeof NCAADivisionSchema>;

export const CoreBucketSchema = z.object({
  english: z.number().min(0),
  math: z.number().min(0),
  science: z.number().min(0),
  socialScience: z.number().min(0),
  additional: z.number().min(0),
  foreignLanguage: z.number().min(0).optional(),
});
export type CoreBucket = z.infer<typeof CoreBucketSchema>;

export const MissingRequirementSchema = z.object({
  bucket: z.string(),
  creditsNeeded: z.number(),
  description: z.string().optional(),
});
export type MissingRequirement = z.infer<typeof MissingRequirementSchema>;

export const NCAAEligibilityStatusSchema = z.enum([
  "pending",
  "in_progress",
  "ready",
  "at_risk",
  "ineligible",
]);
export type NCAAEligibilityStatus = z.infer<typeof NCAAEligibilityStatusSchema>;

export const NCAARecommendationSchema = z.object({
  id: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  action: z.string(),
  deadline: z.string().optional(),
  completed: z.boolean().default(false),
});
export type NCAARecommendation = z.infer<typeof NCAARecommendationSchema>;

// ========== GAR (Go4it Athletic Readiness) ==========

export const GARMetricsSchema = z.object({
  garScore: z.number().min(0).max(100),
  lastTestAt: z.string().datetime(),
  deltas: z
    .object({
      speed: z.number().optional(),
      vertical: z.number().optional(),
      lateral: z.number().optional(),
      endurance: z.number().optional(),
    })
    .optional(),
  readiness: z.number().min(0).max(100).optional(),
  trainingLoad: z.number().min(0).optional(),
});
export type GARMetrics = z.infer<typeof GARMetricsSchema>;

export const GARSessionSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  sessionDate: z.string().datetime(),
  duration: z.number().min(0), // minutes
  sessionType: z.enum(["training", "testing", "recovery", "competition"]),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});
export type GARSession = z.infer<typeof GARSessionSchema>;

// ========== Credit Audit Integration ==========

export const EvaluationSummarySchema = z.object({
  coreGPA: z.number().min(0).max(4.0),
  overallGPA: z.number().min(0).max(4.0).optional(),
  coreUnits: z.number().min(0),
  buckets: CoreBucketSchema,
  missing: z.array(MissingRequirementSchema),
  lastUpdated: z.string().datetime(),
});
export type EvaluationSummary = z.infer<typeof EvaluationSummarySchema>;

export const AuditEvaluationSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  division: NCAADivisionSchema,
  status: NCAAEligibilityStatusSchema,
  evaluationVersion: z.string(),
  summary: EvaluationSummarySchema,
  recommendations: z.array(NCAARecommendationSchema).optional(),
  reportUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type AuditEvaluation = z.infer<typeof AuditEvaluationSchema>;

// ========== StarPath Unified Summary ==========

export const StarPathSummarySchema = z.object({
  schemaVersion: z.literal("1.0"),
  studentId: z.string(),
  fullTimeStudent: z.boolean(),
  ncaa: z
    .object({
      status: NCAAEligibilityStatusSchema,
      coreGPA: z.number().min(0).max(4.0),
      coreUnits: z.number().min(0),
      buckets: CoreBucketSchema,
      missing: z.array(MissingRequirementSchema),
      recommendations: z.array(NCAARecommendationSchema).optional(),
      lastEvaluationId: z.string().optional(),
      lastUpdated: z.string().datetime(),
    })
    .nullable(),
  gar: z
    .object({
      garScore: z.number().min(0).max(100),
      lastTestAt: z.string().datetime(),
      deltas: z.record(z.number()).optional(),
      readiness: z.number().min(0).max(100).optional(),
      trainingLoad: z.number().min(0).optional(),
      recentSessions: z.array(GARSessionSchema).optional(),
    })
    .nullable(),
  studio: z
    .object({
      currentWeek: z.number().int().min(1),
      rotationsCompleted: z.number().int().min(0),
      synthesisCompleted: z.number().int().min(0),
      lastActivityAt: z.string().datetime().optional(),
    })
    .optional(),
  timestamp: z.string().datetime(),
});
export type StarPathSummary = z.infer<typeof StarPathSummarySchema>;

// ========== API Request/Response Schemas ==========

export const LinkAuditToStudentRequestSchema = z.object({
  studentId: z.string().min(1),
  leadId: z.string().min(1).optional(),
  evaluationId: z.string().min(1),
});
export type LinkAuditToStudentRequest = z.infer<typeof LinkAuditToStudentRequestSchema>;

export const AutoPlanCoursesRequestSchema = z.object({
  studentId: z.string().min(1),
  targetDivision: NCAADivisionSchema.default("DI"),
  graduationYear: z.number().int().min(2024).max(2040),
});
export type AutoPlanCoursesRequest = z.infer<typeof AutoPlanCoursesRequestSchema>;

export const GARSessionCreateSchema = z.object({
  studentId: z.string().min(1),
  sessionType: z.enum(["training", "testing", "recovery", "competition"]),
  duration: z.number().min(1).max(300), // 1-300 minutes
  tags: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
});
export type GARSessionCreate = z.infer<typeof GARSessionCreateSchema>;

// ========== Helper Functions ==========

/**
 * Calculate NCAA eligibility status based on GPA and missing credits
 */
export function calculateNCAAStatus(
  coreGPA: number,
  missing: MissingRequirement[],
  division: NCAADivision = "DI"
): NCAAEligibilityStatus {
  const minGPA = division === "DI" ? 2.3 : division === "DII" ? 2.2 : 2.0;

  if (coreGPA < minGPA && missing.length > 0) return "ineligible";
  if (coreGPA < minGPA || missing.length > 2) return "at_risk";
  if (missing.length > 0) return "in_progress";
  return "ready";
}

/**
 * Calculate total core credits from buckets
 */
export function calculateTotalCoreUnits(buckets: CoreBucket): number {
  return (
    buckets.english +
    buckets.math +
    buckets.science +
    buckets.socialScience +
    buckets.additional +
    (buckets.foreignLanguage || 0)
  );
}

/**
 * Generate missing requirements based on NCAA division standards
 */
export function identifyMissingCredits(
  buckets: CoreBucket,
  division: NCAADivision = "DI"
): MissingRequirement[] {
  const requirements =
    division === "DI"
      ? { english: 4, math: 3, science: 2, socialScience: 2, additional: 4 }
      : division === "DII"
      ? { english: 3, math: 2, science: 2, socialScience: 2, additional: 4 }
      : { english: 3, math: 2, science: 2, socialScience: 2, additional: 3 };

  const missing: MissingRequirement[] = [];

  Object.entries(requirements).forEach(([bucket, required]) => {
    const current = buckets[bucket as keyof CoreBucket] || 0;
    if (current < required) {
      missing.push({
        bucket,
        creditsNeeded: required - current,
        description: `${bucket.charAt(0).toUpperCase() + bucket.slice(1)}: ${
          required - current
        } credit${required - current > 1 ? "s" : ""} needed`,
      });
    }
  });

  return missing;
}
