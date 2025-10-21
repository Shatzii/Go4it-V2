import { NextRequest, NextResponse } from 'next/server';

// Simplified GAR analysis endpoint for testing upload issues
export async function POST(request: NextRequest) {
  try {
    console.log('GAR Analysis Test - Starting upload processing...');

    // Test basic request handling
    const contentType = request.headers.get('content-type') || '';
    console.log('Content Type:', contentType);

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        {
          error: 'Invalid content type',
          expected: 'multipart/form-data',
          received: contentType,
        },
        { status: 400 },
      );
    }

    // Test formData parsing
    let formData;
    try {
      console.log('Parsing form data...');
      formData = await request.formData();
      console.log('Form data parsed successfully');
    } catch (error) {
      console.error('FormData parsing error:', error);
      return NextResponse.json(
        {
          error: 'Failed to parse form data',
          message: error.message,
        },
        { status: 400 },
      );
    }

    // Test file extraction
    const video = formData.get('video') as File | null;
    const sport = formData.get('sport') as string | null;

    console.log('Form data contents:');
    console.log('- Video file:', video ? `${video.name} (${video.size} bytes)` : 'null');
    console.log('- Sport:', sport);

    if (!video) {
      return NextResponse.json(
        {
          error: 'No video file provided',
          formDataKeys: Array.from(formData.keys()),
        },
        { status: 400 },
      );
    }

    if (!sport) {
      return NextResponse.json(
        {
          error: 'Sport parameter missing',
          formDataKeys: Array.from(formData.keys()),
        },
        { status: 400 },
      );
    }

    // Test file reading
    let buffer;
    try {
      console.log('Reading file buffer...');
      const arrayBuffer = await video.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      console.log(`File buffer created: ${buffer.length} bytes`);
    } catch (error) {
      console.error('File reading error:', error);
      return NextResponse.json(
        {
          error: 'Failed to read video file',
          message: error.message,
        },
        { status: 400 },
      );
    }

    // Simulate analysis without external dependencies
    console.log('Simulating GAR analysis...');
    const analysisResult = {
      id: `test-gar-${Date.now()}`,
      garScore: Math.floor(Math.random() * 30) + 70, // 70-100
      sport: sport,
      analysis: {
        speed: Math.floor(Math.random() * 20) + 75,
        agility: Math.floor(Math.random() * 20) + 75,
        technique: Math.floor(Math.random() * 20) + 70,
        decision_making: Math.floor(Math.random() * 25) + 70,
        endurance: Math.floor(Math.random() * 20) + 75,
      },
      strengths: [
        'Strong fundamental technique',
        'Good court/field awareness',
        'Consistent performance under pressure',
      ],
      improvements: ['Increase explosive power training', 'Work on weak-side development'],
      recommendations: [
        'Focus on plyometric exercises',
        'Practice decision-making drills',
        'Maintain current conditioning level',
      ],
      notes: 'Solid athletic foundation with good potential for improvement',
      videoMetadata: {
        filename: video.name,
        size: Math.round(buffer.length / 1024),
        type: video.type || 'video/*',
      },
      analyzedAt: new Date().toISOString(),
      analysisMethod: 'Test Analysis (Upload Debug)',
      processingTime: '2.3 seconds',
    };

    console.log('Analysis completed successfully');

    return NextResponse.json({
      success: true,
      message: 'GAR analysis upload test successful',
      result: analysisResult,
      debug: {
        fileProcessed: true,
        formDataParsed: true,
        bufferCreated: true,
        analysisGenerated: true,
      },
    });
  } catch (error) {
    console.error('GAR Analysis Test Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Upload test failed',
        message: error.message,
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'GAR Analysis Upload Test Endpoint',
    purpose: 'Debug upload hanging issues',
    usage: 'POST with multipart/form-data: video file + sport parameter',
  });
}
