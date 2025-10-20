import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIResponse(message: string, context?: string) {
  try {
    const systemPrompt = `You are an AI learning assistant for Universal One School, a comprehensive educational platform with 5 specialized schools:

1. Primary School (K-6): Superhero-themed learning with personalized AI support
2. S.T.A.G.E Prep Global Academy (7-12): 5 specialized programs (Sports, Technology, Agriculture, Gaming, Entrepreneurship)
3. Law School: Legal education with case-based learning
4. Language School: Multilingual learning with cultural immersion
5. Sports Academy: Athletic education with performance optimization

You provide:
- Subject-specific help across all grade levels
- Study tips and learning strategies
- Homework and assignment assistance
- Neurodivergent learning support (ADHD, dyslexia, autism)
- Course recommendations and guidance
- Motivational support and encouragement

Current context: ${context || 'general learning assistance'}

Be helpful, encouraging, and educational. Adapt your language to be appropriate for the student's level. Always prioritize learning and academic growth.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return (
      response.choices[0].message.content ||
      "I'm sorry, I couldn't generate a response at this time."
    );
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}
