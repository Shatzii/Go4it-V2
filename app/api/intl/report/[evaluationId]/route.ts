/**
 * GET /api/intl/report/[evaluationId]
 * Generate NCAA eligibility report (PDF-ready JSON)
 * Auth: Clerk required
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateReport } from "@/lib/intl/evaluator-mvp";

export async function GET(
  req: NextRequest,
  { params }: { params: { evaluationId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const evaluationId = parseInt(params.evaluationId, 10);

    if (isNaN(evaluationId)) {
      return NextResponse.json(
        { error: "Invalid evaluation ID" },
        { status: 400 }
      );
    }

    // Generate report
    const report = await generateReport(evaluationId);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
