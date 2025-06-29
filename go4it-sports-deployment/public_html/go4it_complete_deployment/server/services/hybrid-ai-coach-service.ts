import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

// Set default timeout values in milliseconds
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const EXTENDED_TIMEOUT = 45000; // 45 seconds for more complex operations

// Initialize API clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Define interfaces for coach service
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CoachingRequest {
  message: string;
  messageHistory?: ChatMessage[];
  modelPreference?: 'claude' | 'gpt' | 'auto';
}

interface CoachingResponse {
  message: string;
  source: 'claude' | 'gpt';
  timestamp: string;
}

interface TrainingAdviceRequest {
  sport: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  focusArea: string;
}

interface TrainingDrill {
  name: string;
  description: string;
  duration: string; 
  difficulty: string;
  adhdConsiderations: string | null;
}

interface TrainingAdviceResponse {
  advice: string;
  drills: TrainingDrill[];
  source: 'claude' | 'gpt';
}

interface VideoFeedbackRequest {
  sportType: string;
  videoDescription: string;
}

interface VideoFeedbackResponse {
  feedback: {
    overallAssessment: string;
    technicalAnalysis: string;
    strengths: string[];
    improvementAreas: string[];
    adhdConsiderations: string;
    nextSteps: string;
  };
  source: 'claude' | 'gpt';
}

/**
 * Determine the best AI model based on the message content and type of task
 * 
 * Claude is preferred for:
 * - Personalized training plans
 * - Video analysis and detailed technique feedback
 * - Mental health and ADHD-specific support 
 * - Longer, more detailed responses
 * 
 * GPT is preferred for:
 * - Quick tactical advice
 * - Statistical analysis and comparisons
 * - Sport-specific technical information
 * - Performance metrics evaluation
 */
function determineOptimalModel(
  request: CoachingRequest | TrainingAdviceRequest | VideoFeedbackRequest, 
  requestType: 'chat' | 'training' | 'video'
): 'claude' | 'gpt' {
  // If user has a preference, respect it
  if ('modelPreference' in request && request.modelPreference && request.modelPreference !== 'auto') {
    return request.modelPreference;
  }
  
  // For video analysis, Claude typically provides better feedback
  if (requestType === 'video') {
    return 'claude';
  }
  
  // For training advice, determine based on sport and focus area
  if (requestType === 'training') {
    const req = request as TrainingAdviceRequest;
    
    // For elite-level advice, Claude's nuanced understanding may be better
    if (req.skillLevel === 'elite') {
      return 'claude';
    }
    
    // For mental aspects, Claude is better
    if (req.focusArea.toLowerCase().includes('mental') || 
        req.focusArea.toLowerCase().includes('focus') ||
        req.focusArea.toLowerCase().includes('confidence')) {
      return 'claude';
    }
    
    // For technical skills, GPT's knowledge base is strong
    if (req.focusArea.toLowerCase().includes('technique') ||
        req.focusArea.toLowerCase().includes('skills') ||
        req.focusArea.toLowerCase().includes('form')) {
      return 'gpt';
    }
    
    // Default to Claude for training plans for better structure
    return 'claude';
  }
  
  // For chat, analyze the content
  if (requestType === 'chat') {
    const req = request as CoachingRequest;
    
    // Claude for mental health, detailed training plans, and personal topics
    if (req.message.toLowerCase().includes('mental health') ||
        req.message.toLowerCase().includes('adhd') ||
        req.message.toLowerCase().includes('anxiety') ||
        req.message.toLowerCase().includes('overwhelmed') ||
        req.message.toLowerCase().includes('focus issues') ||
        req.message.toLowerCase().includes('training plan') ||
        req.message.toLowerCase().includes('workout schedule') ||
        req.message.toLowerCase().includes('personal') ||
        req.message.toLowerCase().includes('struggling')) {
      return 'claude';
    }
    
    // GPT for statistics, tactics, technical knowledge
    if (req.message.toLowerCase().includes('stats') ||
        req.message.toLowerCase().includes('statistics') ||
        req.message.toLowerCase().includes('tactics') ||
        req.message.toLowerCase().includes('strategy') ||
        req.message.toLowerCase().includes('compare') ||
        req.message.toLowerCase().includes('metrics') ||
        req.message.toLowerCase().includes('percentages') ||
        req.message.toLowerCase().includes('analysis')) {
      return 'gpt';
    }
    
    // Default to Claude for general conversation
    return 'claude';
  }
  
  // Default fallback
  return 'claude';
}

class HybridAICoachService {
  /**
   * Process a coaching chat request, routing to the optimal model
   */
  async getChatResponse(request: CoachingRequest): Promise<CoachingResponse> {
    try {
      const model = determineOptimalModel(request, 'chat');
      
      // Format message history for the selected model
      const messages = request.messageHistory || [];
      
      if (model === 'claude') {
        // Call Claude API
        const claudeMessages = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
        // Add the system message for context
        const systemPrompt = `You are the Go4It Sports AI Coaching Assistant, focused on helping neurodivergent student athletes aged 12-18. 
You specialize in personalized training advice, mental preparation strategies, and ADHD-friendly techniques. 
Keep answers concise, practical, and actionable.
Always include ADHD considerations in your advice.`;
        
        const response = await anthropic.messages.create({
          model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...claudeMessages,
            { role: 'user', content: request.message }
          ],
        });
        
        return {
          message: response.content[0].text,
          source: 'claude',
          timestamp: new Date().toISOString()
        };
        
      } else {
        // Call GPT API  
        const gptMessages = messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));
        
        const response = await openai.chat.completions.create({
          model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: 'system',
              content: `You are the Go4It Sports AI Coaching Assistant, focused on helping neurodivergent student athletes aged 12-18. 
You specialize in personalized training advice, mental preparation strategies, and ADHD-friendly techniques. 
Keep answers concise, practical, and actionable.
Always include ADHD considerations in your advice.`
            },
            ...gptMessages,
            { role: 'user', content: request.message }
          ],
          max_tokens: 1000,
        });
        
        return {
          message: response.choices[0].message.content || 'No response generated',
          source: 'gpt',
          timestamp: new Date().toISOString()
        };
      }
      
    } catch (error) {
      console.error('Error generating coaching response:', error);
      throw error;
    }
  }
  
  /**
   * Generate personalized training advice for a specific sport
   */
  async getTrainingAdvice(request: TrainingAdviceRequest): Promise<TrainingAdviceResponse> {
    try {
      // Create a timeout functionality
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, EXTENDED_TIMEOUT);
      
      const model = determineOptimalModel(request, 'training');
      
      const prompt = `Create a personalized training plan for a ${request.skillLevel} level athlete in ${request.sport} focusing on improving ${request.focusArea}.
Include:
1. General advice on how to improve in this area (2-3 paragraphs)
2. 3-5 specific drills or exercises, each with:
   - Name
   - Description
   - Recommended duration
   - Difficulty level
   - ADHD considerations

The athlete is a neurodivergent student (age 12-18) with ADHD, so include appropriate accommodations and strategies.`;
      
      if (model === 'claude') {
        // Call Claude API
        const systemPrompt = `You are a specialized sports coach for neurodivergent teenage athletes, particularly those with ADHD.
You have expertise across multiple sports and understand how to create training plans that accommodate focus challenges and leverage hyperfocus strengths.
Provide structured, clear responses that break information into manageable chunks.`;
        
        try {
          const response = await anthropic.messages.create({
            model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
            max_tokens: 1500,
            system: systemPrompt,
            messages: [{ role: 'user', content: prompt }],
            signal: controller.signal,
          });
          
          // Clear timeout since request completed successfully
          clearTimeout(timeoutId);
          
          // Parse Claude's response into structured data
          const responseText = response.content[0].text;
          
          // Extract the advice (first 2-3 paragraphs)
          const advice = responseText.split('\n\n').slice(0, 3).join('\n\n');
          
          // Extract the drills
          const drillsSection = responseText.substring(advice.length);
          const drillBlocks = drillsSection.split(/\n\s*(?=\d+\.\s+|[A-Z][a-z]+:)/g)
            .filter(block => block.trim().length > 0);
          
          const drills: TrainingDrill[] = [];
          
          for (const block of drillBlocks) {
            if (!block.includes(':')) continue;
            
            const nameMatch = block.match(/(?:\d+\.\s+)?([^:]+):/);
            if (!nameMatch) continue;
            
            const name = nameMatch[1].trim();
            const descriptionMatch = block.match(/Description:([^]*?)(?:Duration:|Difficulty:|ADHD Considerations:|$)/i);
            const durationMatch = block.match(/Duration:([^]*?)(?:Difficulty:|ADHD Considerations:|$)/i);
            const difficultyMatch = block.match(/Difficulty:([^]*?)(?:ADHD Considerations:|$)/i);
            const adhdMatch = block.match(/ADHD Considerations:([^]*?)(?:\n\n\d+\.|$)/i);
            
            drills.push({
              name,
              description: descriptionMatch ? descriptionMatch[1].trim() : '',
              duration: durationMatch ? durationMatch[1].trim() : '',
              difficulty: difficultyMatch ? difficultyMatch[1].trim() : '',
              adhdConsiderations: adhdMatch ? adhdMatch[1].trim() : null
            });
          }
          
          return {
            advice,
            drills: drills.length > 0 ? drills : [
              {
                name: 'Basic Training Exercise',
                description: 'A foundational exercise for building skills in this area',
                duration: '15-20 minutes',
                difficulty: 'Moderate',
                adhdConsiderations: 'Break into smaller chunks with short breaks'
              }
            ],
            source: 'claude'
          };
        } catch (error) {
          // Clear timeout to prevent memory leaks
          clearTimeout(timeoutId);
          console.error('Error in Claude API call:', error);
          throw error;
        }
        
      } else {
        // Call GPT API
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
              {
                role: 'system',
                content: `You are a specialized sports coach for neurodivergent teenage athletes, particularly those with ADHD.
You have expertise across multiple sports and understand how to create training plans that accommodate focus challenges and leverage hyperfocus strengths.
Provide structured, clear responses that break information into manageable chunks.`
              },
              { role: 'user', content: prompt }
            ],
            max_tokens: 1500,
            response_format: { type: 'json_object' },
            signal: controller.signal
          });
          
          // Clear timeout since request completed successfully
          clearTimeout(timeoutId);
        
        // Try to parse the JSON response
        try {
          const content = response.choices[0].message.content || '{}';
          const parsedResponse = JSON.parse(content);
          
          // Check if the response has the expected structure
          if (parsedResponse.advice && Array.isArray(parsedResponse.drills)) {
            return {
              advice: parsedResponse.advice,
              drills: parsedResponse.drills.map((drill: any) => ({
                name: drill.name || '',
                description: drill.description || '',
                duration: drill.duration || '',
                difficulty: drill.difficulty || '',
                adhdConsiderations: drill.adhdConsiderations || null
              })),
              source: 'gpt'
            };
          }
          
          // Fallback if structure isn't as expected
          return {
            advice: parsedResponse.advice || response.choices[0].message.content || 'No advice generated',
            drills: [{
              name: 'Basic Training Exercise',
              description: 'A foundational exercise for building skills in this area',
              duration: '15-20 minutes',
              difficulty: 'Moderate',
              adhdConsiderations: 'Break into smaller chunks with short breaks'
            }],
            source: 'gpt'
          };
        } catch (error) {
          console.error('Error parsing GPT response:', error);
          
          // Fallback for parsing error
          const responseText = response.choices[0].message.content || '';
          return {
            advice: responseText.split('\n\n').slice(0, 3).join('\n\n'),
            drills: [{
              name: 'Basic Training Exercise',
              description: 'A foundational exercise for building skills in this area',
              duration: '15-20 minutes',
              difficulty: 'Moderate',
              adhdConsiderations: 'Break into smaller chunks with short breaks'
            }],
            source: 'gpt'
          };
        }
        } catch (error) {
          // Clear timeout to prevent memory leaks
          clearTimeout(timeoutId);
          console.error('Error in GPT API call:', error);
          throw error;
        }
      }
      
    } catch (error) {
      console.error('Error generating training advice:', error);
      throw error;
    }
  }
  
  /**
   * Generate feedback on a sports performance video based on a text description
   */
  async getVideoFeedback(request: VideoFeedbackRequest): Promise<VideoFeedbackResponse> {
    try {
      // Create a timeout functionality
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, EXTENDED_TIMEOUT);
      
      const model = determineOptimalModel(request, 'video');
      
      const prompt = `I'm a student athlete with ADHD. Please analyze this ${request.sportType} performance video and provide detailed feedback:
      
${request.videoDescription}

Provide a complete analysis including:
1. Overall assessment
2. Technical analysis of form and execution
3. Key strengths (as bullet points)
4. Areas for improvement (as bullet points)
5. ADHD-specific considerations for training
6. Recommended next steps for development`;
      
      if (model === 'claude') {
        // Call Claude API
        const systemPrompt = `You are an expert sports performance analyst specializing in helping neurodivergent athletes.
You have deep expertise in biomechanics, sports psychology, and ADHD-specific training approaches.
Provide detailed, constructive feedback focused on both technical skills and neurodivergent-friendly learning strategies.`;
        
        try {
          const response = await anthropic.messages.create({
            model: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
            max_tokens: 1500,
            system: systemPrompt,
            messages: [{ role: 'user', content: prompt }],
            signal: controller.signal
          });
          
          // Clear timeout since request completed successfully
          clearTimeout(timeoutId);
          
          const responseText = response.content[0].text;
        
        // Parse Claude's response
        const overallMatch = responseText.match(/(?:Overall[^:]*:|1\.)[^]*?(?=(?:Technical|2\.))/i);
        const technicalMatch = responseText.match(/(?:Technical[^:]*:|2\.)[^]*?(?=(?:Key Strengths|Strengths|3\.))/i);
        const strengthsMatch = responseText.match(/(?:Key Strengths[^:]*:|Strengths[^:]*:|3\.)[^]*?(?=(?:Areas|Improvements|4\.))/i);
        const areasMatch = responseText.match(/(?:Areas[^:]*:|Improvements[^:]*:|4\.)[^]*?(?=(?:ADHD|5\.))/i);
        const adhdMatch = responseText.match(/(?:ADHD[^:]*:|5\.)[^]*?(?=(?:Next Steps|Recommended|6\.))/i);
        const nextStepsMatch = responseText.match(/(?:Next Steps[^:]*:|Recommended[^:]*:|6\.)[^]*/i);
        
        // Extract bullet points
        const extractBulletPoints = (text: string | null): string[] => {
          if (!text) return [];
          
          // Match lines starting with -, *, •, or numbers
          const bullets = text.match(/(?:^|\n)\s*(?:-|\*|•|\d+\.)\s*(.+)(?:\n|$)/g) || [];
          return bullets.map(b => b.trim().replace(/^\s*(?:-|\*|•|\d+\.)\s*/, ''));
        };
        
        const strengths = extractBulletPoints(strengthsMatch ? strengthsMatch[0] : '');
        const improvements = extractBulletPoints(areasMatch ? areasMatch[0] : '');
        
        return {
          feedback: {
            overallAssessment: overallMatch ? overallMatch[0].replace(/(?:Overall[^:]*:|1\.)\s*/i, '').trim() : 'Analysis unavailable',
            technicalAnalysis: technicalMatch ? technicalMatch[0].replace(/(?:Technical[^:]*:|2\.)\s*/i, '').trim() : 'Technical analysis unavailable',
            strengths: strengths.length > 0 ? strengths : ['Good effort shown in performance'],
            improvementAreas: improvements.length > 0 ? improvements : ['Continue practicing fundamentals'],
            adhdConsiderations: adhdMatch ? adhdMatch[0].replace(/(?:ADHD[^:]*:|5\.)\s*/i, '').trim() : 'Break training into shorter segments with clear goals',
            nextSteps: nextStepsMatch ? nextStepsMatch[0].replace(/(?:Next Steps[^:]*:|Recommended[^:]*:|6\.)\s*/i, '').trim() : 'Focus on fundamentals and gradually increase complexity'
          },
          source: 'claude'
        };
      } catch (error) {
        // Clear timeout to prevent memory leaks
        clearTimeout(timeoutId);
        console.error('Error in Claude API call:', error);
        throw error;
      }
        
      } else {
        // Call GPT API
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
              {
                role: 'system',
                content: `You are an expert sports performance analyst specializing in helping neurodivergent athletes.
You have deep expertise in biomechanics, sports psychology, and ADHD-specific training approaches.
Provide detailed, constructive feedback focused on both technical skills and neurodivergent-friendly learning strategies.`
              },
              { role: 'user', content: prompt }
            ],
            max_tokens: 1500,
            response_format: { type: 'json_object' },
            signal: controller.signal
          });
          
          // Clear timeout since request completed successfully
          clearTimeout(timeoutId);
          
          try {
            const content = response.choices[0].message.content || '{}';
            const parsedResponse = JSON.parse(content);
            
            return {
              feedback: {
                overallAssessment: parsedResponse.overallAssessment || 'Analysis unavailable',
                technicalAnalysis: parsedResponse.technicalAnalysis || 'Technical analysis unavailable',
                strengths: Array.isArray(parsedResponse.strengths) ? parsedResponse.strengths : ['Good effort shown in performance'],
                improvementAreas: Array.isArray(parsedResponse.improvementAreas) ? parsedResponse.improvementAreas : ['Continue practicing fundamentals'],
                adhdConsiderations: parsedResponse.adhdConsiderations || 'Break training into shorter segments with clear goals',
                nextSteps: parsedResponse.nextSteps || 'Focus on fundamentals and gradually increase complexity'
              },
              source: 'gpt'
            };
          } catch (parseError) {
            console.error('Error parsing GPT response:', parseError);
            
            // Fallback
            return {
              feedback: {
                overallAssessment: 'Analysis unavailable due to processing error',
                technicalAnalysis: 'Technical analysis unavailable',
                strengths: ['Good effort shown in performance'],
                improvementAreas: ['Continue practicing fundamentals'],
                adhdConsiderations: 'Break training into shorter segments with clear goals',
                nextSteps: 'Focus on fundamentals and gradually increase complexity'
              },
              source: 'gpt'
            };
          }
        } catch (error) {
          // Clear timeout to prevent memory leaks
          clearTimeout(timeoutId);
          console.error('Error in OpenAI API call:', error);
          throw error;
        }
      }
      
    } catch (error) {
      console.error('Error generating video feedback:', error);
      throw error;
    }
  }
}

export {
  HybridAICoachService,
  type CoachingRequest,
  type CoachingResponse,
  type TrainingAdviceRequest,
  type TrainingAdviceResponse,
  type VideoFeedbackRequest,
  type VideoFeedbackResponse
};