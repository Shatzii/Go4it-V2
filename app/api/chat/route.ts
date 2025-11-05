import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // System prompt for Go4it landing page chat
    const systemPrompt = `You are a helpful assistant for Go4it Sports Academy, an online-first NCAA readiness school. 

Key information:
- We offer full-time online education with NCAA pathway support
- GAR™ (Go4it Athletic Rating) verification system for athletes
- Three enrollment paths: Full-time, Supplemental courses, and Monitoring-only
- StarPath: Our AI-powered enrollment management system
- Locations: Denver, Vienna, Dallas, Mérida (MX)
- Contact: info@go4itsports.org, USA: +1-205-434-8405, EU: +43 650 564 4236

Services:
- AI-powered video analysis with 12 Ollama models
- 48-hour transcript audits
- GetVerified™ Combines (in-person GAR testing events)
- College recruiting hub
- Daily 3-hour studio sessions
- NCAA eligibility tracking

Be friendly, enthusiastic, and helpful. Keep responses concise (2-3 sentences max). 
If asked about pricing or detailed enrollment, direct them to apply at /apply or contact us directly.`;

    // Use Ollama for local chat (free) or fallback to Anthropic
    let response;
    
    try {
      // Try Ollama first (local, free)
      const ollamaResponse = await fetch(process.env.OLLAMA_BASE_URL + '/api/chat' || 'http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          stream: false
        })
      });

      if (ollamaResponse.ok) {
        const data = await ollamaResponse.json();
        response = data.message.content;
      } else {
        throw new Error('Ollama not available');
      }
    } catch (ollamaError) {
      // Fallback to Anthropic if Ollama fails
      if (process.env.ANTHROPIC_API_KEY) {
        const anthropicResponse = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 300,
          system: systemPrompt,
          messages: [
            { role: 'user', content: message }
          ]
        });

        response = anthropicResponse.content[0].type === 'text' 
          ? anthropicResponse.content[0].text 
          : 'I apologize, I encountered an error. Please contact us directly.';
      } else {
        // No AI available, provide helpful static response
        response = getStaticResponse(message);
      }
    }

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        response: 'I apologize for the inconvenience. Please contact us directly at info@go4itsports.org or call +1-205-434-8405 (USA) / +43 650 564 4236 (EU).'
      },
      { status: 500 }
    );
  }
}

// Static fallback responses when AI is not available
function getStaticResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('gar') || lowerMessage.includes('test') || lowerMessage.includes('rating')) {
    return 'GAR™ (Go4it Athletic Rating) is our NCAA-recognized verification system. Athletes get tested at GetVerified™ Combines for speed, agility, strength and sport-specific skills. Want to register for a combine? Visit /events or contact us!';
  }

  if (lowerMessage.includes('apply') || lowerMessage.includes('enroll') || lowerMessage.includes('join')) {
    return 'Great! We offer three enrollment paths: Full-time Online School, Supplemental Courses, or Monitoring-Only. Start your application at /apply or schedule a call with our enrollment team!';
  }

  if (lowerMessage.includes('ncaa') || lowerMessage.includes('college') || lowerMessage.includes('recruit')) {
    return 'We provide complete NCAA pathway support including eligibility tracking, college connections, and recruiting hub access. Our StarPath system guides you through every step. Want to learn more about your NCAA readiness?';
  }

  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('tuition')) {
    return 'Pricing varies by enrollment path and services. The best way to get accurate pricing is to apply at /apply or schedule a consultation. We offer flexible payment options for all families!';
  }

  if (lowerMessage.includes('program') || lowerMessage.includes('course') || lowerMessage.includes('academy')) {
    return 'Go4it Academy offers full online education with NCAA support, AI coaching, video analysis, and daily studio sessions. Check out our programs at /academy or contact us for a personalized tour!';
  }

  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
    return 'You can reach us at info@go4itsports.org, call USA: +1-205-434-8405 or EU: +43 650 564 4236. We have locations in Denver, Vienna, Dallas, and Mérida (MX). We typically respond within 24 hours!';
  }

  // Default response
  return 'Thanks for your question! I can help with information about our GAR testing, NCAA pathways, enrollment, or programs. For specific questions, feel free to apply at /apply or contact us directly at info@go4itsports.org!';
}
