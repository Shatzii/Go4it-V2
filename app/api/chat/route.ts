import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with Assistant
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const ASSISTANT_ID = 'asst_7BwbQ2C2Rv2HIEEsQlRnDXUJ';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, threadId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          response: getStaticResponse(message),
          error: 'OpenAI API key not configured'
        },
        { status: 200 }
      );
    }

    try {
      // Create or use existing thread
      let currentThreadId = threadId;
      if (!currentThreadId) {
        const thread = await openai.beta.threads.create();
        currentThreadId = thread.id;
      }

      // Add user message to thread
      await openai.beta.threads.messages.create(currentThreadId, {
        role: 'user',
        content: message
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(currentThreadId, {
        assistant_id: ASSISTANT_ID
      });

      // Poll for completion
      let runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
      let attempts = 0;
      while (runStatus.status !== 'completed' && attempts < 30) {
        if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
          throw new Error(`Run ${runStatus.status}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
        attempts++;
      }

      if (runStatus.status !== 'completed') {
        throw new Error('Assistant response timeout');
      }

      // Get the assistant's response
      const messages = await openai.beta.threads.messages.list(currentThreadId);
      const lastMessage = messages.data[0];
      
      let response = 'I apologize, I encountered an error. Please contact us directly.';
      if (lastMessage.role === 'assistant' && lastMessage.content[0].type === 'text') {
        response = lastMessage.content[0].text.value;
      }

      return NextResponse.json({
        response,
        threadId: currentThreadId,
        timestamp: new Date().toISOString()
      });

    } catch (aiError) {
      console.error('OpenAI Assistant error:', aiError);
      return NextResponse.json({
        response: getStaticResponse(message),
        error: 'AI assistant unavailable, using fallback response',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        response: 'I apologize for the inconvenience. Please contact us directly at info@go4itsports.org or call +1-303-970-4655 (USA) / +43 650 564 4236 (EU).'
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
    return 'You can reach us at info@go4itsports.org, call USA: +1-303-970-4655 or EU: +43 650 564 4236. We have locations in Denver, Vienna, Dallas, and Mérida (MX). We typically respond within 24 hours!';
  }

  // Default response
  return 'Thanks for your question! I can help with information about our GAR testing, NCAA pathways, enrollment, or programs. For specific questions, feel free to apply at /apply or contact us directly at info@go4itsports.org!';
}
