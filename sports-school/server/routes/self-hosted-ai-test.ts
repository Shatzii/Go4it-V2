/**
 * Self-Hosted AI Test Routes
 * 
 * API endpoints to test and demonstrate the self-hosted Anthropic-compatible
 * educational AI engine functionality.
 */

import { Router } from 'express';
import { selfHostedAnthropic } from '../services/self-hosted-anthropic';
import { getAIResponse } from '../services/ai-service';

const router = Router();

/**
 * Test self-hosted AI engine health
 */
router.get('/health', async (req, res) => {
  try {
    const health = await selfHostedAnthropic.healthCheck();
    res.json({
      success: true,
      ...health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get available educational AI models
 */
router.get('/models', async (req, res) => {
  try {
    const models = selfHostedAnthropic.getAvailableModels();
    res.json({
      success: true,
      models: models.map(model => ({
        id: model.id,
        name: model.name,
        specialization: model.specialization,
        capabilities: model.capabilities
      })),
      count: models.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Test educational content generation
 */
router.post('/test-generation', async (req, res) => {
  try {
    const { 
      query = 'Explain photosynthesis to a 5th grade student',
      model = 'claude-educational-primary',
      school = 'primary'
    } = req.body;

    // Create test messages based on school type
    const messages = [
      {
        role: 'system' as const,
        content: getSystemPromptForSchool(school)
      },
      {
        role: 'user' as const,
        content: query
      }
    ];

    console.log('Testing self-hosted AI generation:', { query, model, school });

    // Test direct self-hosted generation
    const selfHostedResponse = await selfHostedAnthropic.generateContent({
      model,
      messages,
      max_tokens: 1024
    });

    // Also test through main AI service for comparison
    const aiServiceResponse = await getAIResponse(messages, {
      maxTokens: 1024
    });

    res.json({
      success: true,
      test: {
        query,
        model,
        school
      },
      responses: {
        selfHosted: {
          content: selfHostedResponse.content[0].text,
          model: selfHostedResponse.model,
          usage: selfHostedResponse.usage
        },
        aiService: {
          content: aiServiceResponse.content,
          model: aiServiceResponse.model,
          provider: aiServiceResponse.provider,
          usage: aiServiceResponse.tokenUsage
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Self-hosted AI test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Test specific educational scenarios
 */
router.post('/test-scenarios', async (req, res) => {
  try {
    const scenarios = [
      {
        name: 'Primary School Math',
        school: 'primary',
        query: 'Help me understand addition with superhero examples',
        model: 'claude-educational-primary'
      },
      {
        name: 'Secondary School Science',
        school: 'secondary', 
        query: 'Explain DNA structure for a theater student',
        model: 'claude-educational-secondary'
      },
      {
        name: 'Law School Case Analysis',
        school: 'law',
        query: 'Analyze the elements of contract formation',
        model: 'claude-legal-education'
      },
      {
        name: 'Language Learning',
        school: 'language',
        query: 'Teach me basic Spanish greetings with cultural context',
        model: 'claude-language-tutor'
      },
      {
        name: 'Neurodivergent Support',
        school: 'neurodivergent',
        query: 'Help me organize my study schedule with ADHD accommodations',
        model: 'claude-neurodivergent-specialist'
      }
    ];

    const results = [];

    for (const scenario of scenarios) {
      try {
        const messages = [
          {
            role: 'system' as const,
            content: getSystemPromptForSchool(scenario.school)
          },
          {
            role: 'user' as const,
            content: scenario.query
          }
        ];

        const response = await selfHostedAnthropic.generateContent({
          model: scenario.model,
          messages,
          max_tokens: 512
        });

        results.push({
          scenario: scenario.name,
          success: true,
          content: response.content[0].text.substring(0, 200) + '...',
          model: response.model,
          usage: response.usage
        });

      } catch (error) {
        results.push({
          scenario: scenario.name,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      totalScenarios: scenarios.length,
      successfulTests: results.filter(r => r.success).length,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Compare self-hosted vs cloud AI performance
 */
router.post('/compare-performance', async (req, res) => {
  try {
    const { query = 'Explain fractions to a 4th grader using pizza examples' } = req.body;

    const messages = [
      {
        role: 'system' as const,
        content: 'You are a friendly elementary school teacher who makes math fun and easy to understand.'
      },
      {
        role: 'user' as const,
        content: query
      }
    ];

    const startTime = Date.now();

    // Test self-hosted response
    const selfHostedStart = Date.now();
    const selfHostedResponse = await selfHostedAnthropic.generateContent({
      model: 'claude-educational-primary',
      messages,
      max_tokens: 512
    });
    const selfHostedTime = Date.now() - selfHostedStart;

    // Test cloud AI response (if available)
    let cloudResponse = null;
    let cloudTime = 0;
    
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const cloudStart = Date.now();
        cloudResponse = await getAIResponse(messages, { maxTokens: 512 });
        cloudTime = Date.now() - cloudStart;
      } catch (error) {
        console.log('Cloud AI not available:', error.message);
      }
    }

    const totalTime = Date.now() - startTime;

    res.json({
      success: true,
      query,
      performance: {
        selfHosted: {
          responseTime: selfHostedTime,
          content: selfHostedResponse.content[0].text,
          model: selfHostedResponse.model,
          usage: selfHostedResponse.usage,
          available: true
        },
        cloud: cloudResponse ? {
          responseTime: cloudTime,
          content: cloudResponse.content,
          model: cloudResponse.model,
          usage: cloudResponse.tokenUsage,
          available: true
        } : {
          available: false,
          reason: 'No API key configured'
        },
        comparison: {
          totalTime,
          selfHostedFaster: cloudResponse ? selfHostedTime < cloudTime : true,
          costSavings: cloudResponse ? 'Self-hosted eliminates per-token costs' : 'Cloud API unavailable'
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get system prompts for different school types
 */
function getSystemPromptForSchool(school: string): string {
  const prompts = {
    primary: 'You are Dean Wonder, the friendly AI assistant for SuperHero School (K-6). You help young students learn through superhero themes, making education fun and engaging while supporting different learning styles.',
    secondary: 'You are Dean Sterling, the AI assistant for Stage Prep School (7-12). You help students with secondary education through theatrical and performance arts themes, preparing them for college and careers.',
    law: 'You are Professor Barrett, the AI legal education specialist. You help law students understand complex legal concepts, case analysis, and bar exam preparation with clear explanations and practical applications.',
    language: 'You are Professor Lingua, the multilingual AI tutor. You help students learn languages through cultural immersion, conversation practice, and real-world applications across English, Spanish, and German.',
    neurodivergent: 'You are a specialized AI assistant focused on neurodivergent learning support. You provide accommodations for ADHD, autism, dyslexia, and other learning differences with structured, supportive approaches.',
    sports: 'You are Coach Athletics, the AI assistant for Go4it Sports Academy. You help student-athletes balance academics and athletics while pursuing excellence in both areas.'
  };

  return prompts[school] || prompts.primary;
}

export default router;