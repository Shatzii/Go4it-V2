import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Anthropic client
const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const MODEL = 'claude-3-7-sonnet-20250219';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const anthropicService = {
  /**
   * Generate a response to a chat message using Claude
   */
  async getChatResponse(
    message: string, 
    messageHistory: ChatMessage[] = [],
    systemPrompt?: string
  ): Promise<string> {
    try {
      // Format message history for Anthropic API
      const messages = [
        ...messageHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user' as const, content: message }
      ];
      
      // Default system prompt for athletic coaching
      const defaultSystemPrompt = `
        You are a personalized coaching companion for Go4It Sports, a platform for neurodivergent student athletes aged 12-18.
        Your role is to provide supportive, motivational, and technically sound coaching advice.
        
        Key guidelines:
        - Be encouraging and positive, especially for athletes with ADHD who may struggle with focus and consistency
        - Provide clear, concise instructions with bullet points and numbered steps
        - Break down complex movements into simpler parts
        - Offer specific drills and exercises that address the athlete's questions
        - Suggest modifications for different skill levels
        - Incorporate focus strategies that help neurodivergent athletes
        - Remember these athletes are middle/high school students, so keep advice age-appropriate
        - Every response should be constructive, even when pointing out improvements
        
        You are knowledgeable about the following sports: basketball, football, soccer, baseball, volleyball, track, swimming, tennis, golf, and wrestling.
      `;
      
      const response = await anthropicClient.messages.create({
        model: MODEL,
        max_tokens: 2048,
        system: systemPrompt || defaultSystemPrompt,
        messages,
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error calling Anthropic API:', error);
      throw new Error('Failed to generate response from AI coach');
    }
  },

  /**
   * Generate a personalized training plan
   */
  async generateTrainingPlan(
    sportType: string, 
    focusArea: string, 
    athleteContext?: string
  ): Promise<any> {
    try {
      const systemPrompt = `
        You are a specialized sports training plan generator for Go4It Sports, a platform for neurodivergent student athletes aged 12-18.
        Generate a detailed, structured training plan in JSON format based on the requested sport and focus area.
        
        Key guidelines:
        - Tailor the plan for young neurodivergent athletes (primarily with ADHD)
        - Include ADHD-specific strategies in each activity (e.g., timer use, visual cues, chunking workouts)
        - Balance technical development with fun and engagement
        - Structure activities to have clear start/finish points
        - Include variety to maintain attention
        - Incorporate both physical and mental training
        - Keep sessions appropriately timed for younger athletes (30-45 mins ideal)
        - Include built-in breaks and transitions between activities
        
        The plan should be detailed enough for implementation but not overwhelming.
      `;
      
      const message = `
        Please create a comprehensive training plan for a student athlete focused on ${sportType} with emphasis on improving ${focusArea}.
        
        ${athleteContext ? `Additional athlete context: ${athleteContext}` : ''}
        
        Return the training plan in JSON format that conforms exactly to this structure:
        {
          "title": "Plan title",
          "sportType": "${sportType}",
          "focusArea": "${focusArea}",
          "durationDays": 7, // Number of days in plan
          "recommendedLevel": "Beginner", // or "Intermediate" or "Advanced"
          "overview": "Brief overview of the plan",
          "days": [
            {
              "day": 1,
              "title": "Day 1 focus",
              "focus": "Brief description of day's focus",
              "activities": [
                {
                  "name": "Activity name",
                  "duration": "15 minutes",
                  "description": "Detailed description",
                  "intensity": "Low", // or "Medium" or "High"
                  "adhdConsiderations": "ADHD-specific modifications"
                },
                // More activities...
              ],
              "cooldown": "Cooldown description",
              "mentalTraining": "Mental training exercise"
            },
            // More days...
          ]
        }
        
        Ensure the plan is appropriate for a student athlete (12-18 years old) and includes neurodivergent-friendly activities and considerations.
      `;
      
      const response = await anthropicClient.messages.create({
        model: MODEL,
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
        response_format: { type: 'json_object' }
      });
      
      // Parse the JSON response
      const trainingPlan = JSON.parse(response.content[0].text);
      return trainingPlan;
    } catch (error) {
      console.error('Error generating training plan:', error);
      throw new Error('Failed to generate training plan');
    }
  },

  /**
   * Generate feedback on a sports performance video
   */
  async generateVideoFeedback(
    sportType: string, 
    videoDescription: string
  ): Promise<any> {
    try {
      const systemPrompt = `
        You are a specialized sports performance analyzer for Go4It Sports, a platform for neurodivergent student athletes aged 12-18.
        Your role is to analyze video performance descriptions and provide constructive, detailed feedback.
        
        Key guidelines:
        - Focus on both strengths and areas for improvement
        - Provide specific, actionable feedback
        - Include ADHD-specific considerations and recommendations
        - Be encouraging and constructive, especially for young athletes
        - Suggest specific drills or exercises to address improvement areas
        - Maintain a positive tone even when identifying weaknesses
        - Format feedback in a clear, structured way for neurodivergent athletes
        
        Respond with detailed, structured feedback in JSON format.
      `;
      
      const message = `
        Please analyze this ${sportType} performance based on the following description:
        
        ${videoDescription}
        
        Return your analysis in JSON format that conforms exactly to this structure:
        {
          "overallImpression": "Brief overall assessment",
          "strengths": [
            {
              "area": "Technical aspect",
              "observation": "What you observed",
              "impact": "How this positively affects performance"
            },
            // 2-3 more strengths...
          ],
          "improvementAreas": [
            {
              "area": "Technical aspect",
              "observation": "What you observed",
              "recommendation": "How to improve",
              "drill": "Specific exercise to practice"
            },
            // 2-3 more improvement areas...
          ],
          "adhdConsiderations": "Specific recommendations for athletes with ADHD",
          "nextStepsFocus": "Recommended primary focus for next practice"
        }
      `;
      
      const response = await anthropicClient.messages.create({
        model: MODEL,
        max_tokens: 3000,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
        response_format: { type: 'json_object' }
      });
      
      // Parse the JSON response
      const feedback = JSON.parse(response.content[0].text);
      return feedback;
    } catch (error) {
      console.error('Error generating video feedback:', error);
      throw new Error('Failed to generate video feedback');
    }
  }
};