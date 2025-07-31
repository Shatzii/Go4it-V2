import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/server/routes';
import { storage } from '@/server/storage';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { videoId, sport } = await request.json();
    
    if (!videoId || !sport) {
      return NextResponse.json({ error: 'Video ID and sport are required' }, { status: 400 });
    }
    
    // Mock GAR analysis - in production, this would use real AI analysis
    const mockGARScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
    const mockAnalysis = {
      technical: Math.floor(Math.random() * 25) + 75,
      physical: Math.floor(Math.random() * 25) + 75,
      tactical: Math.floor(Math.random() * 25) + 75,
      mental: Math.floor(Math.random() * 25) + 75,
      overall: mockGARScore
    };
    
    const mockFeedback = `Strong performance in ${sport}. Key strengths: Technical execution shows excellent form. Areas for improvement: Continue working on consistency and game-time decision making.`;
    
    // Save analysis to database
    const analysis = await storage.createVideoAnalysis({
      userId: user.id,
      fileName: `video_${videoId}`,
      filePath: `/analysis/${videoId}`,
      sport,
      garScore: mockGARScore.toString(),
      analysisData: mockAnalysis,
      feedback: mockFeedback
    });
    
    return NextResponse.json({
      garScore: mockGARScore,
      analysis: mockAnalysis,
      feedback: mockFeedback,
      analysisId: analysis.id
    });
  } catch (error) {
    console.error('GAR analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}