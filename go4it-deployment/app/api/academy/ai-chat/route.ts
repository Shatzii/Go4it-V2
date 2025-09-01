import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  let message = '';
  let chatHistory = [];

  try {
    const body = await req.json();
    message = body.message;
    chatHistory = body.chatHistory;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build context from recent chat history
    const context =
      chatHistory?.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })) || [];

    // Enhanced system prompt with adaptive learning capabilities
    const systemPrompt = `You are an advanced AI Study Companion with adaptive learning capabilities. You provide personalized educational support by:

1. **Adaptive Tutoring**: Tailor explanations to the student's learning level and style
2. **Intelligent Homework Help**: Guide students with scaffolded support, not direct answers
3. **Personalized Study Planning**: Create AI-powered study schedules based on performance data
4. **Adaptive Test Preparation**: Adjust difficulty and focus areas based on mastery levels
5. **Learning Optimization**: Suggest techniques that match their cognitive preferences
6. **Progress Tracking**: Monitor understanding and adjust teaching approach accordingly

**Adaptive Guidelines:**
- Analyze student responses to gauge comprehension level
- Adjust explanation complexity based on their demonstrated understanding
- Identify learning patterns and adapt teaching methods accordingly
- Provide immediate feedback and course corrections
- Use spaced repetition and retrieval practice principles
- Encourage metacognitive reflection ("How did you solve that?")
- Recognize when to challenge vs. when to reinforce

**Current Student Profile:**
- Learning Style: Visual learner, prefers interactive content
- Adaptive Level: 5/10 (Intermediate)
- Current Mastery: Algebra I (75%), Biology I (88%), World History (82%), English (79%)
- Retention Rate: 85%
- Learning Velocity: 1.2x (faster than average)
- Strengths: Problem-solving, visual patterns, logical reasoning
- Challenges: Abstract concepts, time management, complex reading
- Recent Performance: Struggling with quadratic equations, excelling in cell biology

**Adaptive Response Strategy:**
- For concepts they're struggling with: Break down into smaller steps, use visual aids, provide analogies
- For strong areas: Challenge with advanced problems, encourage peer teaching
- Always connect new learning to previously mastered concepts
- Adjust session length and breaks based on engagement patterns

Be an encouraging, intelligent tutor who adapts to their needs in real-time.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: 'system', content: systemPrompt },
        ...context.slice(-10), // Include last 10 messages for context
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response =
      completion.choices[0]?.message?.content ||
      "I'm having trouble responding right now. Could you try rephrasing your question?";

    // Detect subject based on keywords
    const subjectKeywords = {
      'Algebra I': ['algebra', 'equation', 'linear', 'quadratic', 'function', 'graph', 'slope'],
      'Biology I': ['biology', 'cell', 'mitosis', 'dna', 'genetics', 'organism', 'photosynthesis'],
      'World History': ['history', 'civilization', 'ancient', 'empire', 'culture', 'society'],
      'English Literature': [
        'literature',
        'essay',
        'writing',
        'poem',
        'novel',
        'analysis',
        'author',
      ],
    };

    let detectedSubject = '';
    const lowerMessage = message.toLowerCase();

    for (const [subject, keywords] of Object.entries(subjectKeywords)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        detectedSubject = subject;
        break;
      }
    }

    return NextResponse.json({
      response,
      subject: detectedSubject,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Chat Error:', error);

    // Create intelligent fallback responses using pattern matching
    // Message is already parsed at the top of the function
    return createIntelligentFallback(message);
  }
}

function createIntelligentFallback(message: string) {
  const lowerMessage = message.toLowerCase();

  // Math/Algebra responses
  if (lowerMessage.includes('quadratic') || lowerMessage.includes('equation')) {
    return NextResponse.json({
      response:
        "Quadratic equations can be solved using three main methods:\n\n1. **Factoring** - When the equation can be written as (x + a)(x + b) = 0\n2. **Completing the square** - Useful for understanding the vertex form\n3. **Quadratic formula** - x = (-b ± √(b²-4ac)) / 2a\n\nWhich method would you like me to explain in more detail? Or do you have a specific problem you're working on?",
      subject: 'Algebra I',
      timestamp: new Date().toISOString(),
    });
  }

  if (lowerMessage.includes('linear') || lowerMessage.includes('slope')) {
    return NextResponse.json({
      response:
        'Linear functions are fundamental in algebra! The key concepts are:\n\n• **Slope (m)** - How steep the line is (rise over run)\n• **Y-intercept (b)** - Where the line crosses the y-axis\n• **Standard form** - y = mx + b\n\nTo find slope between two points (x₁,y₁) and (x₂,y₂): m = (y₂-y₁)/(x₂-x₁)\n\nWhat specific aspect of linear functions would you like to practice?',
      subject: 'Algebra I',
      timestamp: new Date().toISOString(),
    });
  }

  // Biology responses
  if (lowerMessage.includes('cell') || lowerMessage.includes('biology')) {
    return NextResponse.json({
      response:
        'Cell biology is fascinating! Here are the key organelles and their functions:\n\n🧬 **Nucleus** - Controls cell activities, contains DNA\n⚡ **Mitochondria** - Powerhouse of the cell, produces ATP\n🌿 **Chloroplasts** (plants) - Conduct photosynthesis\n📦 **Ribosomes** - Protein synthesis\n🏭 **Endoplasmic Reticulum** - Protein and lipid transport\n\nWhich organelle or cell process would you like to explore further?',
      subject: 'Biology I',
      timestamp: new Date().toISOString(),
    });
  }

  if (lowerMessage.includes('mitosis') || lowerMessage.includes('division')) {
    return NextResponse.json({
      response:
        "Cell division through mitosis has 4 main phases:\n\n1. **Prophase** - Chromosomes condense, nuclear envelope breaks down\n2. **Metaphase** - Chromosomes align at cell's center\n3. **Anaphase** - Sister chromatids separate to opposite poles\n4. **Telophase** - Nuclear envelopes reform, chromosomes uncoil\n\n*Remember: PMAT!* This creates two identical diploid cells. How can I help you understand this process better?",
      subject: 'Biology I',
      timestamp: new Date().toISOString(),
    });
  }

  // History responses
  if (lowerMessage.includes('history') || lowerMessage.includes('ancient')) {
    return NextResponse.json({
      response:
        'Ancient civilizations laid the foundation for modern society! Key civilizations include:\n\n🏺 **Mesopotamia** - First cities, writing (cuneiform), Code of Hammurabi\n🐪 **Egypt** - Pharaohs, pyramids, hieroglyphics, Nile River importance\n🏛️ **Greece** - Democracy, philosophy, art, Olympic Games\n🗡️ **Rome** - Republic to Empire, law, engineering, military\n\nWhich civilization or time period interests you most?',
      subject: 'World History',
      timestamp: new Date().toISOString(),
    });
  }

  // English/Writing responses
  if (lowerMessage.includes('essay') || lowerMessage.includes('writing')) {
    return NextResponse.json({
      response:
        'Great essay writing follows a clear structure:\n\n📝 **Introduction** - Hook, background, thesis statement\n📚 **Body Paragraphs** - Topic sentence, evidence, analysis, transition\n🎯 **Conclusion** - Restate thesis, summarize key points, final thought\n\n**Pro tips:**\n• Start with an outline\n• Each paragraph = one main idea\n• Use specific examples and quotes\n• Cite your sources properly\n\nWhat type of essay are you working on?',
      subject: 'English Literature',
      timestamp: new Date().toISOString(),
    });
  }

  // Study tips and general help
  if (lowerMessage.includes('study') || lowerMessage.includes('help')) {
    return NextResponse.json({
      response:
        "I'm here to help you succeed! Here are some effective study strategies:\n\n📚 **Active Learning**\n• Summarize in your own words\n• Teach concepts to someone else\n• Create mind maps and diagrams\n\n⏰ **Time Management**\n• Break study sessions into 25-50 minute chunks\n• Take regular breaks\n• Start with your most challenging subjects\n\n🎯 **Focus Techniques**\n• Remove distractions\n• Set specific goals for each session\n• Use practice problems and flashcards\n\nWhat subject would you like to focus on today?",
      subject: '',
      timestamp: new Date().toISOString(),
    });
  }

  // Default helpful response
  return NextResponse.json({
    response:
      "I'm your AI Study Companion! I can help you with:\n\n📐 **Math** - Algebra, geometry, problem-solving strategies\n🧬 **Science** - Biology, chemistry, physics concepts\n📚 **English** - Essay writing, literature analysis\n🌍 **History** - Ancient civilizations, historical analysis\n\nI can explain concepts, help with homework, create study plans, and provide practice problems. What subject would you like to work on?",
    subject: '',
    timestamp: new Date().toISOString(),
  });
}
