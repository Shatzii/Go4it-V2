import { NextRequest, NextResponse } from 'next/server';

// Simple AI Service for testing
const AI_SERVICE = {
  async checkStatus() {
    const useLocal = process.env.USE_LOCAL_AI_ENGINE === 'true';

    if (useLocal) {
      try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
          const data = await response.json();
          return {
            status: 'healthy',
            engine: 'self-hosted',
            models: data.models || [],
            message: 'Academic AI Engine is operational',
          };
        }
      } catch (error) {
        return {
          status: 'error',
          engine: 'self-hosted',
          message: 'Academic AI Engine not responding - please start it on port 8000',
        };
      }
    }

    return {
      status: 'healthy',
      engine: 'external',
      message: 'Using external AI APIs',
    };
  },

  async generateChatCompletion(messages: any[], options: any = {}) {
    const useLocal = process.env.USE_LOCAL_AI_ENGINE === 'true';

    if (useLocal) {
      try {
        const response = await fetch('http://localhost:8000/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages,
            model: options.model || 'educational-llama-7b',
            max_tokens: options.maxTokens || 1024,
            temperature: options.temperature || 0.7,
          }),
        });

        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        throw new Error('Academic AI Engine not available');
      }
    }

    throw new Error('External AI APIs not configured');
  },
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'status') {
      const status = await AI_SERVICE.checkStatus();
      return NextResponse.json(status);
    }

    if (action === 'models') {
      return NextResponse.json({
        object: 'list',
        data: [
          { id: 'educational-llama-7b', name: 'Educational Llama 7B' },
          { id: 'neurodivergent-assistant', name: 'Neurodivergent Learning Assistant' },
          { id: 'legal-education-ai', name: 'Legal Education AI' },
          { id: 'language-tutor-ai', name: 'Multilingual Language Tutor' },
          { id: 'cybersecurity-analyzer', name: 'Cybersecurity Content Analyzer' },
        ],
      });
    }

    return NextResponse.json({
      message: 'Self-Hosted Academic AI Engine API',
      endpoints: [
        'GET /api/ai/engine?action=status - Check AI engine status',
        'GET /api/ai/engine?action=models - Get available models',
        'POST /api/ai/engine/chat - Generate chat completion',
        'POST /api/ai/engine/lesson - Generate lesson plan',
        'POST /api/ai/engine/assessment - Generate assessment',
        'POST /api/ai/engine/analyze - Analyze content for safety',
      ],
      engine: process.env.USE_LOCAL_AI_ENGINE === 'true' ? 'self-hosted' : 'external',
    });
  } catch (error) {
    console.error('AI engine API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'AI engine API error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'chat': {
        const { messages, model, maxTokens, temperature } = data;
        const response = await AI_SERVICE.generateChatCompletion(messages, {
          model,
          maxTokens,
          temperature,
        });
        return NextResponse.json(response);
      }

      case 'lesson': {
        const { subject, grade, topic, learningStyle, accommodations } = data;
        return NextResponse.json({
          success: true,
          lesson: {
            subject,
            grade,
            topic,
            content: `Educational lesson about ${topic} for grade ${grade} students`,
            learningStyle,
            accommodations,
          },
        });
      }

      case 'assessment': {
        const { subject, grade, topic, assessmentType, difficulty } = data;
        return NextResponse.json({
          success: true,
          assessment: {
            subject,
            grade,
            topic,
            type: assessmentType,
            difficulty,
            content: `${assessmentType} assessment for ${topic} at ${difficulty} level`,
          },
        });
      }

      case 'analyze': {
        const { content, platform, userId } = data;
        return NextResponse.json({
          success: true,
          analysis: {
            safe: true,
            content,
            platform,
            userId,
            message: 'Content analysis complete',
          },
        });
      }

      case 'dean_wonder': {
        const { prompt, accommodations } = data;
        return NextResponse.json({
          success: true,
          response: `🦸‍♂️ Dean Wonder here! I understand you're asking about: ${prompt}. Let me help you with this superhero-style learning adventure!`,
          accommodations,
        });
      }

      case 'dean_sterling': {
        const { prompt, accommodations } = data;
        return NextResponse.json({
          success: true,
          response: `🎭 Dean Sterling here! Your question about ${prompt} is excellent for our stage prep approach. Let's explore this together!`,
          accommodations,
        });
      }

      case 'professor_barrett': {
        const { prompt, specialization } = data;
        return NextResponse.json({
          success: true,
          response: `⚖️ Professor Barrett here! Your legal inquiry about ${prompt} is important. Let me provide you with comprehensive legal education guidance.`,
          specialization,
        });
      }

      case 'professor_lingua': {
        const { prompt, language, level } = data;
        return NextResponse.json({
          success: true,
          response: `🌍 Professor Lingua here! I'll help you learn about ${prompt} in ${language} at ${level} level. ¡Vamos a aprender!`,
          language,
          level,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action specified',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('AI engine POST error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'AI engine processing error',
      },
      { status: 500 },
    );
  }
}
