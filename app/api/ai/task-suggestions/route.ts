import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { projectDescription, projectType, existingTasks = [] } = body;

    if (!projectDescription) {
      return new NextResponse('Project description is required', { status: 400 });
    }

    // Create the AI prompt
    const prompt = `
You are an expert project manager and task breakdown specialist. Based on the following project description, generate a comprehensive list of tasks that need to be completed.

Project Description: ${projectDescription}
Project Type: ${projectType || 'General'}

Existing Tasks (if any):
${existingTasks.map((task: any, index: number) => `${index + 1}. ${task.title} (${task.status})`).join('\n')}

Please generate 5-8 specific, actionable tasks that would be needed to complete this project. For each task, provide:

1. A clear, concise title
2. A brief description of what needs to be done
3. An estimated time in hours
4. A priority level (high, medium, low)
5. Any dependencies on other tasks
6. Suggested tags for categorization

Format your response as a JSON array of objects with the following structure:
[
  {
    "title": "Task Title",
    "description": "Brief description",
    "estimatedHours": 4,
    "priority": "high",
    "dependencies": ["Task 1", "Task 2"],
    "tags": ["planning", "research"]
  }
]

Consider the project type and ensure the tasks are realistic and comprehensive. If there are existing tasks, make sure the new suggestions complement them without duplication.
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert project manager who creates detailed, actionable task breakdowns. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return new NextResponse('Failed to generate task suggestions', { status: 500 });
    }

    // Parse the JSON response
    let suggestions;
    try {
      suggestions = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return new NextResponse('Invalid AI response format', { status: 500 });
    }

    // Validate the response structure
    if (!Array.isArray(suggestions)) {
      return new NextResponse('AI response is not in expected format', { status: 500 });
    }

    // Enhance suggestions with additional metadata
    const enhancedSuggestions = suggestions.map((suggestion: any, index: number) => ({
      ...suggestion,
      id: `ai-suggestion-${Date.now()}-${index}`,
      suggestedBy: 'ai',
      confidence: 0.85, // AI confidence score
      createdAt: new Date().toISOString(),
      projectType: projectType || 'general',
    }));

    return NextResponse.json({
      suggestions: enhancedSuggestions,
      metadata: {
        projectDescription,
        projectType: projectType || 'general',
        existingTasksCount: existingTasks.length,
        generatedAt: new Date().toISOString(),
        model: 'gpt-4-turbo-preview',
      },
    });
  } catch (error) {
    console.error('[AI_TASK_SUGGESTIONS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// GET endpoint to retrieve task suggestions history or templates
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectType = searchParams.get('projectType');

    // Return project type templates
    const templates = {
      software: [
        { title: 'Requirements Analysis', description: 'Gather and document project requirements', estimatedHours: 8, priority: 'high', tags: ['planning', 'analysis'] },
        { title: 'System Design', description: 'Create system architecture and design documents', estimatedHours: 12, priority: 'high', tags: ['design', 'architecture'] },
        { title: 'Database Design', description: 'Design database schema and relationships', estimatedHours: 6, priority: 'medium', tags: ['database', 'design'] },
        { title: 'Frontend Development', description: 'Implement user interface components', estimatedHours: 20, priority: 'high', tags: ['frontend', 'development'] },
        { title: 'Backend Development', description: 'Implement server-side logic and APIs', estimatedHours: 25, priority: 'high', tags: ['backend', 'development'] },
        { title: 'Testing', description: 'Write and execute comprehensive tests', estimatedHours: 10, priority: 'medium', tags: ['testing', 'quality'] },
        { title: 'Deployment', description: 'Deploy application to production environment', estimatedHours: 4, priority: 'medium', tags: ['deployment', 'operations'] },
      ],
      marketing: [
        { title: 'Market Research', description: 'Analyze target market and competitors', estimatedHours: 6, priority: 'high', tags: ['research', 'strategy'] },
        { title: 'Content Strategy', description: 'Develop content marketing plan', estimatedHours: 8, priority: 'high', tags: ['content', 'strategy'] },
        { title: 'Campaign Design', description: 'Create campaign creative and messaging', estimatedHours: 10, priority: 'high', tags: ['creative', 'design'] },
        { title: 'Channel Setup', description: 'Configure marketing channels and tools', estimatedHours: 4, priority: 'medium', tags: ['setup', 'tools'] },
        { title: 'Campaign Execution', description: 'Launch and monitor campaign performance', estimatedHours: 12, priority: 'high', tags: ['execution', 'monitoring'] },
        { title: 'Analytics & Reporting', description: 'Track KPIs and generate performance reports', estimatedHours: 6, priority: 'medium', tags: ['analytics', 'reporting'] },
      ],
      construction: [
        { title: 'Site Assessment', description: 'Evaluate site conditions and requirements', estimatedHours: 4, priority: 'high', tags: ['assessment', 'planning'] },
        { title: 'Permit Acquisition', description: 'Obtain necessary construction permits', estimatedHours: 6, priority: 'high', tags: ['permits', 'regulatory'] },
        { title: 'Foundation Work', description: 'Prepare and construct foundation', estimatedHours: 16, priority: 'high', tags: ['foundation', 'construction'] },
        { title: 'Structural Work', description: 'Build main structural elements', estimatedHours: 24, priority: 'high', tags: ['structure', 'construction'] },
        { title: 'Finishing Work', description: 'Complete interior and exterior finishes', estimatedHours: 20, priority: 'medium', tags: ['finishing', 'interior'] },
        { title: 'Inspection & Approval', description: 'Final inspections and project sign-off', estimatedHours: 4, priority: 'medium', tags: ['inspection', 'quality'] },
      ],
    };

    if (projectType && templates[projectType as keyof typeof templates]) {
      return NextResponse.json({
        templates: templates[projectType as keyof typeof templates],
        projectType,
      });
    }

    // Return all available templates
    return NextResponse.json({
      templates,
      availableTypes: Object.keys(templates),
    });
  } catch (error) {
    console.error('[AI_TASK_SUGGESTIONS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
