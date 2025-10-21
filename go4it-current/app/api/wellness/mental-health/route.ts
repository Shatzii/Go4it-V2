import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Mental health modules for student athletes
    const modules = [
      {
        id: 'breathing-1',
        title: 'Pre-Game Breathing',
        type: 'breathing',
        duration: 5,
        description: '4-7-8 breathing technique for calm focus before competition',
        benefits: [
          'Reduces performance anxiety',
          'Improves focus',
          'Activates parasympathetic system',
        ],
        instructions: [
          'Inhale through nose for 4 counts',
          'Hold breath for 7 counts',
          'Exhale through mouth for 8 counts',
          'Repeat 4-6 cycles before competition',
        ],
      },
      {
        id: 'meditation-1',
        title: 'Body Scan Recovery',
        type: 'meditation',
        duration: 10,
        description: 'Progressive muscle awareness meditation for post-training recovery',
        benefits: [
          'Identifies muscle tension',
          'Promotes faster recovery',
          'Increases body awareness',
        ],
        instructions: [
          'Lie down in comfortable position',
          'Start with toes, notice any tension',
          'Slowly move up through each muscle group',
          'Breathe into areas of tension',
        ],
      },
      {
        id: 'visualization-1',
        title: 'Perfect Performance Visualization',
        type: 'visualization',
        duration: 15,
        description: 'Mental rehearsal of optimal athletic performance execution',
        benefits: ['Builds confidence', 'Improves technique memory', 'Reduces performance anxiety'],
        instructions: [
          'Visualize yourself in competition setting',
          'See yourself executing skills perfectly',
          'Feel the emotions of successful performance',
          'Imagine overcoming challenges confidently',
        ],
      },
      {
        id: 'focus-1',
        title: 'Attention Training for Athletes',
        type: 'focus',
        duration: 8,
        description: 'Concentration exercises designed for competitive sports situations',
        benefits: [
          'Enhances focus under pressure',
          'Improves decision making',
          'Builds mental resilience',
        ],
        instructions: [
          'Focus on single point for 30 seconds',
          'Practice switching attention between targets',
          'Maintain focus despite distractions',
          'Apply techniques during practice',
        ],
      },
      {
        id: 'confidence-1',
        title: 'Athletic Confidence Builder',
        type: 'confidence',
        duration: 12,
        description: 'Positive self-talk and confidence building exercises for athletes',
        benefits: [
          'Increases self-confidence',
          'Reduces negative self-talk',
          'Improves performance mindset',
        ],
        instructions: [
          'Identify your athletic strengths',
          'Create positive affirmations',
          'Practice confident body language',
          'Recall past successful performances',
        ],
      },
      {
        id: 'stress-management-1',
        title: 'Competition Stress Management',
        type: 'stress',
        duration: 10,
        description: 'Techniques to manage competition stress and pressure',
        benefits: [
          'Reduces competition anxiety',
          'Improves stress response',
          'Maintains optimal arousal',
        ],
        instructions: [
          'Recognize early stress signals',
          'Use progressive muscle relaxation',
          'Practice calming self-talk',
          'Implement pre-competition routine',
        ],
      },
      {
        id: 'goal-setting-1',
        title: 'SMART Athletic Goals',
        type: 'goal-setting',
        duration: 20,
        description: 'Strategic goal setting for athletic and academic achievement',
        benefits: [
          'Provides clear direction',
          'Increases motivation',
          'Tracks progress effectively',
        ],
        instructions: [
          'Set Specific, Measurable goals',
          'Make goals Achievable and Relevant',
          'Set Time-bound deadlines',
          'Create action steps for each goal',
        ],
      },
      {
        id: 'recovery-mindset-1',
        title: 'Recovery Mindset Training',
        type: 'recovery',
        duration: 8,
        description: 'Mental techniques to optimize physical and mental recovery',
        benefits: [
          'Speeds up recovery process',
          'Improves sleep quality',
          'Reduces mental fatigue',
        ],
        instructions: [
          'Practice gratitude for your body',
          'Visualize muscles repairing and growing',
          'Use positive recovery affirmations',
          'Focus on rest as productive time',
        ],
      },
    ];

    return NextResponse.json({
      success: true,
      modules,
      totalModules: modules.length,
      categories: [
        'breathing',
        'meditation',
        'visualization',
        'focus',
        'confidence',
        'stress',
        'goal-setting',
        'recovery',
      ],
    });
  } catch (error) {
    console.error('Error fetching mental health modules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mental health modules' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, moduleId, sessionData } = body;

    // In a real app, you would save session completion data to database
    // For demo, we'll return success with session summary
    const sessionSummary = {
      moduleId,
      completedAt: new Date().toISOString(),
      duration: sessionData?.duration || 0,
      rating: sessionData?.rating || 0,
      notes: sessionData?.notes || '',
      userId,
    };

    return NextResponse.json({
      success: true,
      message: 'Mental health session completed successfully',
      sessionSummary,
    });
  } catch (error) {
    console.error('Error saving mental health session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save session data' },
      { status: 500 },
    );
  }
}
