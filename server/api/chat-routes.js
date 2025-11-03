/**
 * Chat API Endpoint for Landing Page
 * Connects chat widget to existing Anthropic/Claude integration
 */

const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Claude model - using latest
const CLAUDE_MODEL = "claude-3-7-sonnet-20250219";

/**
 * POST /api/chat
 * Handle chat messages from landing page widget
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    // System prompt for Go4it landing page assistant
    const systemPrompt = `You are the Go4it Sports Academy AI Assistant. You are knowledgeable, enthusiastic, and helpful.

Your primary responsibilities:
1. Answer questions about Go4it Sports Academy programs and services
2. Explain GAR (Go4it Athletic Rating) testing and what it measures
3. Provide information about NCAA pathway support and eligibility
4. Describe the academy's online and hybrid school options
5. Help prospective students and parents understand the application process
6. Explain AthleteAI and other technology offerings
7. Share information about Friday Night Lights showcases and international hubs

Key Information:
- GAR Testing: Comprehensive athlete verification measuring physical, cognitive, and mental abilities
- Programs: Online Academy, Hybrid Training, NCAA Pathway, GAR Testing, AthleteAI, Friday Night Lights (FNL)
- Locations: Denver (HQ), Vienna, Dallas, Mérida (Mexico)
- Sports: Basketball, Football, Soccer, Volleyball, Baseball, and more
- Focus: NCAA compliance, academic excellence, verified athletic performance

Communication Style:
- Friendly and approachable but professional
- Use emojis occasionally to show enthusiasm (🏀⚽🏈🎓)
- Keep responses concise (2-4 sentences unless detailed explanation is needed)
- Always encourage next steps: "Schedule a call", "Apply now", "Book a GAR test"
- For complex questions, offer to connect them with a human advisor

If you don't know something specific, acknowledge it and offer to have someone from the team reach out.`;

    // Build conversation messages
    const messages = [];
    
    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory);
    }
    
    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    // Call Claude API
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 500, // Keep responses concise for chat
      system: systemPrompt,
      messages: messages
    });

    // Extract response text
    const assistantMessage = response.content[0].text;

    // Return response
    res.json({
      success: true,
      response: assistantMessage,
      messageId: response.id,
      model: CLAUDE_MODEL
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Handle specific error types
    if (error.status === 401) {
      return res.status(500).json({
        error: 'API authentication failed. Please contact support.'
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a moment and try again.'
      });
    }
    
    // Generic error response
    res.status(500).json({
      error: 'Sorry, I\'m having trouble right now. Please try again or contact us directly.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/chat/status
 * Check if chat API is available
 */
router.get('/chat/status', (req, res) => {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  
  res.json({
    available: hasApiKey,
    model: CLAUDE_MODEL,
    status: hasApiKey ? 'ready' : 'no_api_key'
  });
});

module.exports = router;
