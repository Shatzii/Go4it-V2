/**
 * POST /api/starpath/ncaa/link-audit
 * Link a Credit Audit evaluation to student profile
 * Triggered after $299 audit payment or intl evaluation completion
 * Auth: Clerk required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { studentProfiles } from "@/lib/db/schema-starpath";
import { intlEvaluations } from "@/lib/db/schema-intl";
import { eq } from "drizzle-orm";
import { z } from "zod";

const LinkSchema = z.object({
  evaluationId: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { evaluationId } = LinkSchema.parse(body);

    // Verify evaluation exists and belongs to user
    const evaluation = await db.query.intlEvaluations.findFirst({
      where: eq(intlEvaluations.id, evaluationId),
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: "Evaluation not found" },
        { status: 404 }
      );
    }

    if (evaluation.userId !== userId) {
      return NextResponse.json(
        { error: "Evaluation does not belong to user" },
        { status: 403 }
      );
    }

    // Get or create student profile
    let profile = await db.query.studentProfiles.findFirst({
      where: eq(studentProfiles.userId, userId),
    });

    if (!profile) {
      // Create new profile
      const [newProfile] = await db
        .insert(studentProfiles)
        .values({
          userId,
          enrollmentType: "audit_only", // Can be updated later
          auditEvaluationId: evaluationId,
          coreGpa: evaluation.coreGpa || undefined,
          overallGpa: evaluation.overallGpa || undefined,
          coreUnitsCompleted: evaluation.coreUnits || undefined,
          ncaaStatus: evaluation.divisionIStatus || "at_risk",
          divisionIStatus: evaluation.divisionIStatus || undefined,
          divisionIIStatus: evaluation.divisionIIMStatus || undefined,
          missingRequirements: evaluation.missingRequirements as any,
          lastAcademicSync: new Date(),
        })
        .returning();

      profile = newProfile;
    } else {
      // Update existing profile
      const [updatedProfile] = await db
        .update(studentProfiles)
        .set({
          auditEvaluationId: evaluationId,
          coreGpa: evaluation.coreGpa || profile.coreGpa,
          overallGpa: evaluation.overallGpa || profile.overallGpa,
          coreUnitsCompleted: evaluation.coreUnits || profile.coreUnitsCompleted,
          ncaaStatus: evaluation.divisionIStatus || profile.ncaaStatus,
          divisionIStatus: evaluation.divisionIStatus || profile.divisionIStatus,
          divisionIIStatus: evaluation.divisionIIMStatus || profile.divisionIIStatus,
          missingRequirements: evaluation.missingRequirements as any,
          lastAcademicSync: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(studentProfiles.userId, userId))
        .returning();

      profile = updatedProfile;
    }

    // Emit PostHog server event
    // TODO: Add PostHog server tracking

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        coreGpa: profile.coreGpa,
        ncaaStatus: profile.ncaaStatus,
        divisionIStatus: profile.divisionIStatus,
        divisionIIStatus: profile.divisionIIStatus,
      },
      message: "Credit Audit evaluation linked to StarPath profile",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to link audit evaluation" },
      { status: 500 }
    );
  }
}
