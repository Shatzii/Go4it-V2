import Anthropic from '@anthropic-ai/sdk';
import { db } from '../db';
import { apiKeys } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Service to manage Anthropic API interactions
 * This centralizes all Anthropic functionality to ensure API key validation
 * and consistent error handling
 */

// Get Anthropic client with API key validation
async function getAnthropicClient(): Promise<Anthropic> {
  // Check if API key is set in environment variables
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

// Generate a personalized coaching response based on user's profile, message, and history
export async function generatePersonalizedCoachingResponse(
  userId: number,
  userMessage: string,
  messageHistory: any[],
  athleteProfile: any
): Promise<string> {
  try {
    // Get Anthropic client
    const anthropic = await getAnthropicClient();
    
    // Create a system prompt that establishes the coaching companion persona
    // and incorporates the athlete's profile for personalization
    const systemPrompt = `You are an inspiring and motivational sports coach for Go4It Sports, 
    specifically designed to support neurodivergent young athletes (ages 12-18). 
    
    ATHLETE PROFILE:
    - Name: ${athleteProfile.name || 'the athlete'}
    - Age: ${athleteProfile.age || 'teenage'}
    - Sport Focus: ${athleteProfile.sportFocus || 'multiple sports'}
    - ADHD Profile: ${athleteProfile.adhdProfile || 'has attention and focus challenges'}
    - Strengths: ${athleteProfile.strengths ? athleteProfile.strengths.join(', ') : 'developing athletic abilities'}
    - Areas for Growth: ${athleteProfile.areasForGrowth ? athleteProfile.areasForGrowth.join(', ') : 'technical skills and consistency'}
    - Current GAR Score: ${athleteProfile.garScore || 'being evaluated'}
    - Recent Performance: ${athleteProfile.recentPerformance || 'showing progress with room for improvement'}

    YOUR COACHING STYLE:
    - Keep communication clear, concise, and direct - ideal for athletes with ADHD
    - Use positive reinforcement and celebrate small victories
    - Break down complex concepts into simple, actionable steps
    - Adapt your tone to be engaging, energetic, and supportive
    - Focus on practical advice that can be implemented immediately
    - Address both athletic performance and mental focus strategies
    - Provide specific, concrete examples and analogies
    - Maintain a 3:1 ratio of positive feedback to constructive criticism
    
    Respond to the athlete's questions and concerns with personalized guidance,
    always considering their specific profile, ADHD considerations, and athletic goals.`;

    // Format the message history for Anthropic
    const formattedMessages = messageHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add the user's current message
    formattedMessages.push({
      role: 'user',
      content: userMessage
    });

    // Make the API call to Anthropic
    // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      system: systemPrompt,
      messages: formattedMessages,
      max_tokens: 1500,
    });

    // Return the coach's response
    return response.content[0].text;
  } catch (error) {
    console.error('Error generating personalized coaching response:', error);
    throw new Error('Failed to generate coaching response');
  }
}

// Generate a sport-specific training plan based on athlete profile
export async function generateTrainingPlan(
  userId: number,
  sportType: string,
  athleteProfile: any,
  focusArea: string
): Promise<any> {
  try {
    // Get Anthropic client
    const anthropic = await getAnthropicClient();
    
    // Create a system prompt for generating a training plan
    const systemPrompt = `You are an expert sports training planner for Go4It Sports, 
    specializing in creating personalized training plans for neurodivergent young athletes (ages 12-18).
    
    ATHLETE PROFILE:
    - Sport Focus: ${sportType || 'multiple sports'}
    - ADHD Profile: ${athleteProfile.adhdProfile || 'has attention and focus challenges'}
    - Physical Metrics: ${athleteProfile.physicalMetrics || 'standard for age group'}
    - Skill Level: ${athleteProfile.skillLevel || 'developing'}
    - Focus Area: ${focusArea || 'overall improvement'}
    
    TRAINING PLAN REQUIREMENTS:
    - Create a structured 7-day training plan
    - Each day should include specific activities with clear objectives
    - Include rest/recovery periods appropriate for the athlete's age
    - Design workouts to be engaging and varied (ideal for ADHD athletes)
    - Include measurable goals and achievement metrics
    - Incorporate visualization and mental preparation techniques
    - Add modifications for different skill levels
    - Include time estimates for each activity (keep individual activities under 30 minutes for better focus)
    
    Format your response as a JSON object with the following structure:
    {
      "title": "Training Plan Title",
      "sportType": "Sport Name",
      "focusArea": "Specific focus of this plan",
      "durationDays": 7,
      "recommendedLevel": "Beginner/Intermediate/Advanced",
      "overview": "Brief overview of the training plan",
      "days": [
        {
          "day": 1,
          "title": "Day title",
          "focus": "Main focus of this day",
          "activities": [
            {
              "name": "Activity name",
              "duration": "Duration in minutes",
              "description": "Detailed instructions",
              "intensity": "Low/Medium/High",
              "adhdConsiderations": "Specific modifications or tips for ADHD athletes"
            }
          ],
          "cooldown": "Cooldown activity",
          "mentalTraining": "Mental training component"
        }
      ]
    }`;

    // Make the API call to Anthropic
    // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Please create a personalized ${sportType} training plan for me focusing on ${focusArea}.`
        }
      ],
      max_tokens: 2000,
    });

    // Parse the JSON response
    try {
      // Extract the JSON from the response text
      const responseText = response.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing training plan JSON:', parseError);
      throw new Error('Failed to parse training plan');
    }
  } catch (error) {
    console.error('Error generating training plan:', error);
    throw new Error('Failed to generate training plan');
  }
}

// Generate personalized feedback on athlete's performance video
export async function generateVideoFeedback(
  userId: number,
  sportType: string,
  videoDescription: string,
  athleteProfile: any
): Promise<any> {
  try {
    // Get Anthropic client
    const anthropic = await getAnthropicClient();
    
    // Create a system prompt for analyzing video performance
    const systemPrompt = `You are an expert sports coach and video analyst for Go4It Sports, 
    specializing in providing feedback for neurodivergent young athletes (ages 12-18).
    
    ATHLETE PROFILE:
    - Sport Focus: ${sportType || 'multiple sports'}
    - ADHD Profile: ${athleteProfile.adhdProfile || 'has attention and focus challenges'}
    - Skill Level: ${athleteProfile.skillLevel || 'developing'}
    
    VIDEO FEEDBACK REQUIREMENTS:
    - Provide constructive, encouraging feedback on the athlete's performance
    - Highlight 3 specific strengths demonstrated in the video
    - Identify 2-3 areas for improvement with specific, actionable tips
    - Keep feedback concise and direct (ideal for ADHD athletes)
    - Use positive, motivational language
    - Include specific drills or exercises to address areas for improvement
    - Consider the athlete's neurodivergent profile in your recommendations
    
    Format your response as a JSON object with the following structure:
    {
      "overallImpression": "Brief overall impression",
      "strengths": [
        {
          "area": "Strength area",
          "observation": "What was observed",
          "impact": "Why this is important"
        }
      ],
      "improvementAreas": [
        {
          "area": "Area for improvement",
          "observation": "What was observed",
          "recommendation": "Specific, actionable advice",
          "drill": "Recommended drill to improve this area"
        }
      ],
      "adhdConsiderations": "Specific ADHD-friendly tips",
      "nextStepsFocus": "What to focus on next"
    }`;

    // Make the API call to Anthropic
    // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Please analyze my ${sportType} performance video and provide feedback. Video description: ${videoDescription}`
        }
      ],
      max_tokens: 1500,
    });

    // Parse the JSON response
    try {
      // Extract the JSON from the response text
      const responseText = response.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing video feedback JSON:', parseError);
      throw new Error('Failed to parse video feedback');
    }
  } catch (error) {
    console.error('Error generating video feedback:', error);
    throw new Error('Failed to generate video feedback');
  }
}