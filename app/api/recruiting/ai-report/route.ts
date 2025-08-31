import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/server/routes';
import { go4itAI } from '@/lib/openai-integration';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { athleteData, reportType = 'comprehensive' } = await request.json();

    if (!athleteData || !athleteData.sport) {
      return NextResponse.json(
        {
          error: 'Athlete data with sport information required',
        },
        { status: 400 },
      );
    }

    // Generate authentic AI-powered recruitment report
    const analysisRequest = {
      sport: athleteData.sport,
      analysisType: 'recruitment' as const,
      context: {
        athleteData,
        reportType,
        userId: user.id,
        timestamp: new Date().toISOString(),
      },
    };

    const recruitmentReport = await go4itAI.generateRecruitmentReport(analysisRequest);

    return NextResponse.json({
      success: true,
      report: recruitmentReport,
      athleteId: user.id,
      generatedAt: new Date().toISOString(),
      reportType,
    });
  } catch (error) {
    console.error('AI recruitment report error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate recruitment report',
      },
      { status: 500 },
    );
  }
}
