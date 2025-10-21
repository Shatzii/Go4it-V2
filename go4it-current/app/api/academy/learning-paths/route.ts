import { NextRequest, NextResponse } from 'next/server';

let learningPaths = [
  {
    id: '1',
    name: 'Algebra Mastery Path',
    description: 'Complete pathway from basic algebra to advanced functions',
    subjects: ['Algebra I', 'Pre-Calculus'],
    totalSteps: 15,
    completedSteps: 8,
    estimatedCompletionTime: 120,
    difficulty: 'intermediate',
    adaptiveLevel: 5,
    prerequisites: ['Basic arithmetic', 'Elementary algebra'],
    learningObjectives: [
      'Master linear equations and inequalities',
      'Understand quadratic functions',
      'Apply algebraic principles to real-world problems',
    ],
    currentStep: {
      title: 'Quadratic Equations',
      description: 'Learn to solve quadratic equations using multiple methods',
      progress: 65,
    },
  },
  {
    id: '2',
    name: 'Biology Foundations',
    description: 'Build strong understanding of biological principles',
    subjects: ['Biology I'],
    totalSteps: 12,
    completedSteps: 6,
    estimatedCompletionTime: 90,
    difficulty: 'beginner',
    adaptiveLevel: 4,
    prerequisites: ['Basic science knowledge'],
    learningObjectives: [
      'Understand cell structure and function',
      'Learn about genetics and heredity',
      'Explore ecosystems and biodiversity',
    ],
    currentStep: {
      title: 'Cell Division',
      description: 'Study mitosis and meiosis processes',
      progress: 40,
    },
  },
  {
    id: '3',
    name: 'Advanced Writing Skills',
    description: 'Develop sophisticated academic writing abilities',
    subjects: ['English Literature', 'Composition'],
    totalSteps: 10,
    completedSteps: 3,
    estimatedCompletionTime: 75,
    difficulty: 'advanced',
    adaptiveLevel: 6,
    prerequisites: ['Basic grammar', 'Reading comprehension'],
    learningObjectives: [
      'Master essay structure and argumentation',
      'Develop critical analysis skills',
      'Learn research and citation methods',
    ],
    currentStep: {
      title: 'Thesis Development',
      description: 'Create strong, defensible thesis statements',
      progress: 20,
    },
  },
];

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get('studentId') || 'dev-user-123';

    // Filter paths based on student's enrollment and progress
    const availablePaths = learningPaths;

    return NextResponse.json({
      learningPaths: availablePaths,
      totalPaths: availablePaths.length,
    });
  } catch (error) {
    console.error('Learning Paths Error:', error);
    return NextResponse.json({ error: 'Failed to load learning paths' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const pathData = await req.json();

    const newPath = {
      id: (learningPaths.length + 1).toString(),
      name: pathData.name,
      description: pathData.description,
      subjects: pathData.subjects || [],
      totalSteps: pathData.totalSteps || 10,
      completedSteps: 0,
      estimatedCompletionTime: pathData.estimatedCompletionTime || 60,
      difficulty: pathData.difficulty || 'intermediate',
      adaptiveLevel: pathData.adaptiveLevel || 3,
      prerequisites: pathData.prerequisites || [],
      learningObjectives: pathData.learningObjectives || [],
      currentStep: {
        title: 'Getting Started',
        description: 'Begin your learning journey',
        progress: 0,
      },
    };

    learningPaths.push(newPath);

    return NextResponse.json({
      learningPath: newPath,
      message: 'Learning path created successfully',
    });
  } catch (error) {
    console.error('Create Learning Path Error:', error);
    return NextResponse.json({ error: 'Failed to create learning path' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { pathId, progress } = await req.json();

    const pathIndex = learningPaths.findIndex((path) => path.id === pathId);
    if (pathIndex === -1) {
      return NextResponse.json({ error: 'Learning path not found' }, { status: 404 });
    }

    // Update progress
    learningPaths[pathIndex].completedSteps = progress.completedSteps;
    if (progress.currentStep) {
      learningPaths[pathIndex].currentStep = progress.currentStep;
    }

    return NextResponse.json({
      learningPath: learningPaths[pathIndex],
      message: 'Progress updated successfully',
    });
  } catch (error) {
    console.error('Update Learning Path Error:', error);
    return NextResponse.json({ error: 'Failed to update learning path' }, { status: 500 });
  }
}
