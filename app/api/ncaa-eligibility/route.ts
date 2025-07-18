import { NextRequest, NextResponse } from 'next/server';

// NCAA Eligibility API endpoint
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'success',
      message: 'NCAA Eligibility Tracker API',
      features: [
        'SAT/ACT Sliding Scale Calculator',
        'International Student Support',
        'Core Course Validation',
        'GPA Calculations',
        'Eligibility Status Tracking'
      ]
    });
  } catch (error) {
    console.error('NCAA Eligibility API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NCAA eligibility data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gpa, satScore, actScore, division = 'D1' } = body;

    // Basic sliding scale calculation
    let eligible = false;
    let message = '';

    if (division === 'D1') {
      if (gpa >= 2.3 && (satScore >= 900 || actScore >= 75)) {
        eligible = true;
        message = 'Meets NCAA D1 eligibility requirements';
      } else {
        message = 'Does not meet NCAA D1 minimum requirements';
      }
    } else if (division === 'D2') {
      if (gpa >= 2.2 && (satScore >= 840 || actScore >= 70)) {
        eligible = true;
        message = 'Meets NCAA D2 eligibility requirements';
      } else {
        message = 'Does not meet NCAA D2 minimum requirements';
      }
    }

    return NextResponse.json({
      status: 'success',
      eligible,
      message,
      division,
      gpa,
      satScore,
      actScore,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('NCAA Eligibility calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate NCAA eligibility' },
      { status: 500 }
    );
  }
}