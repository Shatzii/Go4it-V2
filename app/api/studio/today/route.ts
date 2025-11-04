import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
/**
 * GET /api/studio/today
 * Returns today's daily studio for the authenticated student
 * Supports marketing demo mode with ?marketing=1
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isMarketing = searchParams.get('marketing') === '1';

    // Marketing demo mode - return sample data
    if (isMarketing) {
      return NextResponse.json(getSampleDailyStudio());
    }

    // TODO: In production, fetch from DB based on:
    // - Current date
    // - Student's grade level (from Clerk user metadata)
    // - Load rotations, NCAA tasks, and AthleteAI data
    
    // For now, return sample data
    return NextResponse.json(getSampleDailyStudio());
  } catch (error) {
    console.error('Error fetching daily studio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily studio' },
      { status: 500 }
    );
  }
}

/**
 * Sample daily studio for 9th grade
 * Based on Unit 1: Energy Systems & Performance
 */
function getSampleDailyStudio() {
  return {
    date: new Date().toISOString().split('T')[0],
    theme: 'Energy Systems & Athletic Performance',
    drivingQuestion: 'How do our bodies convert food into movement, and why does it matter for training?',
    rotations: {
      math: {
        title: 'Rates & Proportional Reasoning',
        duration: 40,
        standards: ['HSN.Q.A.1', '8.EE.B.5'],
        objectives: [
          'Calculate VO2max and heart rate zones using proportional reasoning',
          'Graph training intensity vs. caloric expenditure',
        ],
        activities: [
          {
            type: 'mini_lesson',
            duration: 10,
            content: 'Introduction to rate calculations in sports performance',
            resources: ['Worksheet: VO2max calculator'],
          },
          {
            type: 'guided_practice',
            duration: 20,
            content: 'Calculate personal training zones using heart rate data',
          },
          {
            type: 'concept_check',
            duration: 10,
            content: 'Quick quiz: Proportional reasoning problems',
          },
        ],
        differentiation: {
          scaffolded: 'Pre-filled template with partial calculations',
          extended: 'Compare multiple athletes and predict optimal training zones',
        },
      },
      ela: {
        title: 'Argument Analysis',
        duration: 40,
        standards: ['RI.9-10.8', 'W.9-10.1'],
        objectives: [
          'Analyze scientific claims about nutrition and performance',
          'Identify evidence-based vs. marketing claims',
        ],
        activities: [
          {
            type: 'close_reading',
            duration: 15,
            content: 'Read: "The Science of Sports Nutrition" (2-page article)',
          },
          {
            type: 'writing_workshop',
            duration: 20,
            content: 'Draft 1-paragraph argument: Do carbs boost performance?',
          },
          {
            type: 'peer_review',
            duration: 5,
            content: 'Exchange drafts and provide feedback',
          },
        ],
      },
      science: {
        title: 'Cellular Respiration Lab',
        duration: 40,
        standards: ['HS-LS1-7', 'HS-LS2-3'],
        objectives: [
          'Model aerobic vs. anaerobic energy pathways',
          'Connect cellular processes to athletic performance',
        ],
        activities: [
          {
            type: 'lab_demo',
            duration: 20,
            content: 'Virtual lab: Measuring CO2 production in yeast fermentation',
          },
          {
            type: 'cer_writeup',
            duration: 15,
            content: 'CER: Why do sprinters rely on anaerobic systems?',
          },
          {
            type: 'exit_ticket',
            duration: 5,
            content: 'Diagram the ATP-PC system',
          },
        ],
      },
      socialStudies: {
        title: 'Economics of Professional Sports',
        duration: 40,
        standards: ['D2.Eco.1.9-12', 'D2.Eco.14.9-12'],
        objectives: [
          'Analyze supply and demand in the sports labor market',
          'Compare athlete salaries across leagues and countries',
        ],
        activities: [
          {
            type: 'case_study',
            duration: 20,
            content: 'Case: Why are NBA salaries higher than WNBA?',
          },
          {
            type: 'learning_log',
            duration: 15,
            content: 'Reflection: How does scarcity affect athlete compensation?',
          },
          {
            type: 'exit_ticket',
            duration: 5,
            content: 'Define: opportunity cost in professional sports',
          },
        ],
      },
    },
    ncaaTasks: [
      'Complete NCAA Eligibility Center profile (85% done)',
      'Upload Q1 transcript by Friday',
      'Review core course requirements with counselor',
    ],
    athleteAIData: {
      sleepScore: 7.5,
      readiness: 8.2,
      trainingLoad: 6.5,
    },
  };
}
