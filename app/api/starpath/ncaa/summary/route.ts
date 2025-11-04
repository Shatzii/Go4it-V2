/**
 * GET /api/starpath/ncaa/summary
 * Get comprehensive NCAA eligibility summary for StarPath dashboard
 * Pulls from Credit Audit evaluations + ongoing Studio progress
 * Auth: Clerk required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { studentProfiles, ncaaCourseMappings } from "@/lib/db/schema-starpath";
import { intlEvaluations } from "@/lib/db/schema-intl";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get student profile
    const profile = await db.query.studentProfiles.findFirst({
      where: eq(studentProfiles.userId, userId),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    // Pull latest audit evaluation if linked
    let auditData = null;
    if (profile.auditEvaluationId) {
      auditData = await db.query.intlEvaluations.findFirst({
        where: eq(intlEvaluations.id, profile.auditEvaluationId),
      });
    }

    // Get ongoing course mappings
    const courseMappings = await db
      .select()
      .from(ncaaCourseMappings)
      .where(eq(ncaaCourseMappings.studentId, userId));

    // Calculate credit buckets from mappings
    const creditSummary = courseMappings.reduce(
      (acc, course) => {
        if (!course.isCoreCourse) return acc;

        const category = course.ncaaCategory as string;
        const credits = course.carnegieUnits || 0;

        if (category === "english") acc.english += credits;
        if (category === "math") acc.math += credits;
        if (category === "science") acc.science += credits;
        if (category === "social_science") acc.socialScience += credits;
        if (course.isLabScience) acc.labScience += credits;
        if (course.isAlgebraIOrHigher) acc.algebraI += credits;

        return acc;
      },
      {
        english: auditData?.englishCredits || 0,
        math: auditData?.mathAlgebraICredits || 0,
        science: auditData?.scienceCredits || 0,
        socialScience: auditData?.socialScienceCredits || 0,
        labScience: auditData?.scienceLabCredits || 0,
        algebraI: auditData?.mathAlgebraICredits || 0,
        additional: auditData?.additionalAcademicCredits || 0,
      }
    );

    // NCAA Division I requirements
    const divIRequirements = {
      english: 4,
      math: 3,
      science: 2,
      socialScience: 2,
      labScience: 2,
      total: 16,
    };

    // Calculate missing requirements
    const missingCredits = {
      english: Math.max(0, divIRequirements.english - creditSummary.english),
      math: Math.max(0, divIRequirements.math - creditSummary.math),
      science: Math.max(0, divIRequirements.science - creditSummary.science),
      socialScience: Math.max(0, divIRequirements.socialScience - creditSummary.socialScience),
      labScience: Math.max(0, divIRequirements.labScience - creditSummary.labScience),
    };

    const totalMissing = Object.values(missingCredits).reduce((sum, val) => sum + val, 0);

    // Determine status
    const coreGpa = profile.coreGpa || auditData?.coreGpa || 0;
    let ncaaStatus = "ineligible";
    if (totalMissing === 0 && coreGpa >= 2.3) ncaaStatus = "eligible";
    else if (totalMissing <= 2 && coreGpa >= 2.0) ncaaStatus = "at_risk";
    else if (coreGpa >= 2.0) ncaaStatus = "on_track";

    // Build missing requirements array
    const missingRequirements: string[] = [];
    Object.entries(missingCredits).forEach(([category, credits]) => {
      if (credits > 0) {
        const categoryLabel = category
          .replace(/([A-Z])/g, " $1")
          .trim()
          .replace(/^./, (str) => str.toUpperCase());
        missingRequirements.push(`${categoryLabel}: ${credits} unit${credits > 1 ? "s" : ""} short`);
      }
    });
    if (coreGpa < 2.3) {
      missingRequirements.push(`Core GPA: Need ${(2.3 - coreGpa).toFixed(2)} points to reach 2.3 minimum`);
    }

    // Recommended actions
    const recommendedActions: string[] = [];
    if (totalMissing > 0) {
      recommendedActions.push("Complete missing core course requirements via Studio rotations");
    }
    if (coreGpa < 2.3) {
      recommendedActions.push("Focus on improving grades in core courses");
    }
    if (missingRequirements.length === 0) {
      recommendedActions.push("Maintain strong academic performance and explore recruitment opportunities");
    }

    return NextResponse.json({
      success: true,
      summary: {
        coreGpa,
        overallGpa: profile.overallGpa || auditData?.overallGpa,
        totalCoreUnits: profile.coreUnitsCompleted || 0,
        requiredCoreUnits: profile.coreUnitsRequired || 16,
        ncaaStatus: profile.ncaaStatus || ncaaStatus,
        divisionIStatus: profile.divisionIStatus || auditData?.divisionIStatus || "at_risk",
        divisionIIStatus: profile.divisionIIStatus || auditData?.divisionIIMStatus || "at_risk",
      },
      creditBreakdown: creditSummary,
      requirements: divIRequirements,
      missingCredits,
      missingRequirements,
      recommendedActions,
      coursesInProgress: courseMappings.filter((c) => !c.isComplete).length,
      coursesCompleted: courseMappings.filter((c) => c.isComplete).length,
      auditData: auditData
        ? {
            evaluationId: auditData.id,
            evaluatedAt: auditData.evaluatedAt,
            reportUrl: auditData.reportUrl,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch NCAA summary" },
      { status: 500 }
    );
  }
}
