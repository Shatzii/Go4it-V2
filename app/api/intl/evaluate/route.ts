/**
 * POST /api/intl/evaluate
 * Calculate NCAA eligibility from matched courses
 * Auth: Clerk required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { evaluateEligibility } from "@/lib/intl/evaluator-mvp";
import { z } from "zod";

const EvaluateSchema = z.object({
  transcriptId: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { transcriptId } = EvaluateSchema.parse(body);

    // Evaluate eligibility
    const evaluation = await evaluateEligibility(transcriptId);

    return NextResponse.json({
      success: true,
      evaluationId: evaluation.id,
      coreGpa: evaluation.coreGpa,
      coreUnits: evaluation.coreUnits,
      divisionIStatus: evaluation.divisionIStatus,
      divisionIIStatus: evaluation.divisionIIMStatus,
      missingRequirements: evaluation.missingRequirements,
      riskFactors: evaluation.riskFactors,
      recommendedActions: evaluation.recommendedActions,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Evaluate error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate eligibility" },
      { status: 500 }
    );
  }
}
