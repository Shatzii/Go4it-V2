/**
 * POST /api/starpath/ncaa/auto-plan
 * Generate AI-powered course plan to fill NCAA credit gaps
 * Full-time students get automatic updates when Studio rotations complete
 * Auth: Clerk required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { studentProfiles, ncaaAutoPlans, ncaaCourseMappings } from "@/lib/db/schema-starpath";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const AutoPlanSchema = z.object({
  targetDivision: z.enum(["D1", "D2", "D3", "NAIA"]).optional(),
  targetGraduation: z.number().int().min(2024).max(2035).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = AutoPlanSchema.parse(body);

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

    // Parse missing requirements
    const missingReqs = (profile.missingRequirements as any) || [];
    
    // Calculate missing credits by category
    const missingCredits: Record<string, number> = {};
    missingReqs.forEach((req: string) => {
      const match = req.match(/(.+):\s*(\d+(?:\.\d+)?)\s*unit/i);
      if (match) {
        const category = match[1].toLowerCase().replace(/\s+/g, "_");
        const units = parseFloat(match[2]);
        missingCredits[category] = units;
      }
    });

    // Get current course mappings
    const currentCourses = await db
      .select()
      .from(ncaaCourseMappings)
      .where(eq(ncaaCourseMappings.studentId, userId));

    // Determine target graduation year
    const targetGrad = data.targetGraduation || profile.expectedGraduation || new Date().getFullYear() + 2;
    const yearsRemaining = targetGrad - new Date().getFullYear();
    const semestersRemaining = yearsRemaining * 2;

    // Recommended courses (Studio-based) mapped to NCAA categories
    const studioRotationMap = {
      english: ["ELA rotation", "Close Reading", "Writing Workshop", "Peer Review"],
      math: ["Math rotation", "Guided Practice", "Concept Check", "Problem Solving"],
      science: ["Science rotation", "Lab Demo", "CER Writeup", "Inquiry Investigation"],
      social_science: ["Social Studies rotation", "Case Study", "Primary Source Analysis", "Historical Thinking"],
    };

    // Build recommended courses based on missing credits
    const recommendedCourses: any[] = [];
    Object.entries(missingCredits).forEach(([category, unitsNeeded]) => {
      const categoryKey = category.replace(/_/g, " ").toLowerCase();
      const rotations = studioRotationMap[category as keyof typeof studioRotationMap] || [];
      
      // Each Studio rotation = 0.25-0.5 units depending on intensity
      const rotationsNeeded = Math.ceil(unitsNeeded / 0.5);
      
      recommendedCourses.push({
        category: categoryKey,
        unitsNeeded,
        rotationsNeeded,
        suggestedRotations: rotations.slice(0, rotationsNeeded),
        weeksEstimated: rotationsNeeded * 6, // 6-week units
      });
    });

    // Calculate academic load score (current courses + recommended)
    const activeCoursesCount = currentCourses.filter((c) => !c.isComplete).length;
    const academicLoadScore = Math.min(10, (activeCoursesCount + recommendedCourses.length) / 2);

    // Recommended training load (inverse of academic load)
    const recommendedTrainingLoad = Math.max(3, 10 - academicLoadScore);

    // Create or update auto-plan
    const existingPlan = await db.query.ncaaAutoPlans.findFirst({
      where: and(
        eq(ncaaAutoPlans.studentId, userId),
        eq(ncaaAutoPlans.isActive, true)
      ),
    });

    let plan;
    if (existingPlan) {
      [plan] = await db
        .update(ncaaAutoPlans)
        .set({
          targetDivision: data.targetDivision || existingPlan.targetDivision,
          targetGraduation: targetGrad,
          missingCredits: missingCredits as any,
          recommendedCourses: recommendedCourses as any,
          recommendedStudioFocus: {
            priorityCategories: Object.keys(missingCredits),
            estimatedWeeks: recommendedCourses.reduce((sum, c) => sum + c.weeksEstimated, 0),
          } as any,
          weeklySchedule: {
            academicHours: academicLoadScore * 3,
            trainingHours: recommendedTrainingLoad * 2,
            recoveryDays: recommendedTrainingLoad > 7 ? 2 : 1,
          } as any,
          recommendedTrainingLoad,
          academicLoadScore,
          lastRecalculated: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(ncaaAutoPlans.id, existingPlan.id))
        .returning();
    } else {
      [plan] = await db
        .insert(ncaaAutoPlans)
        .values({
          studentId: userId,
          planType: missingCredits.length > 3 ? "catch_up" : "standard",
          targetDivision: data.targetDivision || "D1",
          targetGraduation: targetGrad,
          missingCredits: missingCredits as any,
          recommendedCourses: recommendedCourses as any,
          recommendedStudioFocus: {
            priorityCategories: Object.keys(missingCredits),
            estimatedWeeks: recommendedCourses.reduce((sum, c) => sum + c.weeksEstimated, 0),
          } as any,
          weeklySchedule: {
            academicHours: academicLoadScore * 3,
            trainingHours: recommendedTrainingLoad * 2,
            recoveryDays: recommendedTrainingLoad > 7 ? 2 : 1,
          } as any,
          recommendedTrainingLoad,
          academicLoadScore,
          lastRecalculated: new Date(),
        })
        .returning();
    }

    // Emit PostHog server event
    // TODO: Add PostHog tracking

    return NextResponse.json({
      success: true,
      plan: {
        id: plan.id,
        planType: plan.planType,
        targetGraduation: plan.targetGraduation,
        semestersRemaining,
        academicLoadScore: plan.academicLoadScore,
        recommendedTrainingLoad: plan.recommendedTrainingLoad,
      },
      missingCredits,
      recommendedCourses,
      weeklySchedule: plan.weeklySchedule,
      message: "Auto-plan generated successfully. Enroll in Studio to start earning credits.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate auto-plan" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/starpath/ncaa/auto-plan
 * Retrieve active auto-plan for student
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await db.query.ncaaAutoPlans.findFirst({
      where: and(
        eq(ncaaAutoPlans.studentId, userId),
        eq(ncaaAutoPlans.isActive, true)
      ),
    });

    if (!plan) {
      return NextResponse.json(
        { error: "No active plan found. Generate one first." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch auto-plan" },
      { status: 500 }
    );
  }
}
