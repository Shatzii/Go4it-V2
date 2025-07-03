/**
 * AI Service
 * 
 * This service provides a unified interface for working with multiple AI providers
 * including Self-Hosted Anthropic, Anthropic (Claude) and OpenAI (GPT). It handles 
 * prompt construction, response parsing, and error handling for all AI-related functionality.
 */

import Anthropic from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import { selfHostedAnthropic } from './self-hosted-anthropic';

// Initialize AI clients
// The newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Configuration for AI routing
const USE_SELF_HOSTED = process.env.USE_SELF_HOSTED_AI === 'true' || !process.env.ANTHROPIC_API_KEY;
const FALLBACK_TO_CLOUD = process.env.AI_FALLBACK_TO_CLOUD === 'true';

// Model types and options
export type AIModelProvider = 'anthropic' | 'openai';
export type AnthropicModelType = 'claude-3-7-sonnet-20250219' | 'claude-3-7-opus-20250219' | 'claude-3-5-sonnet-20240620';
export type OpenAIModelType = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4';

export type AIModel = {
  provider: AIModelProvider;
  model: AnthropicModelType | OpenAIModelType;
};

// Default AI configurations
const DEFAULT_AI_MODEL: AIModel = {
  provider: 'anthropic',
  model: 'claude-3-7-sonnet-20250219',
};

const BACKUP_AI_MODEL: AIModel = {
  provider: 'openai',
  model: 'gpt-4o',
};

// Message types
export interface AIMessageContent {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Define ContentBlock types for Anthropic API responses
interface TextContentBlock {
  type: 'text';
  text: string;
}

interface ToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, any>;
}

type ContentBlock = TextContentBlock | ToolUseBlock;

// Response types
export interface AIResponse {
  content: string;
  model: string;
  provider: AIModelProvider;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Handles errors from AI providers and returns a standardized error message
 */
const handleAIError = (error: any, provider: AIModelProvider): Error => {
  console.error(`Error with ${provider} API:`, error);
  
  // Extract meaningful information from the error
  let errorMessage = `${provider} API error: `;
  
  if (error.response) {
    errorMessage += `Status ${error.response.status}: ${error.response.data?.error?.message || 'Unknown error'}`;
  } else if (error.message) {
    errorMessage += error.message;
  } else {
    errorMessage += 'Unknown error occurred';
  }
  
  return new Error(errorMessage);
};

/**
 * Makes a request to Anthropic (Self-Hosted or Cloud)
 */
const callAnthropic = async (
  messages: AIMessageContent[],
  model: AnthropicModelType,
  maxTokens: number = 2048
): Promise<AIResponse> => {
  try {
    // Try self-hosted Anthropic first if enabled
    if (USE_SELF_HOSTED) {
      console.log('Using Self-Hosted Educational AI Engine');
      
      try {
        const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';
        
        const response = await selfHostedAnthropic.generateContent({
          model,
          messages,
          max_tokens: maxTokens,
          system: systemMessage
        });

        return {
          content: response.content[0].text,
          model: `self-hosted-${model}`,
          provider: 'anthropic',
          tokenUsage: {
            promptTokens: response.usage.input_tokens,
            completionTokens: response.usage.output_tokens,
            totalTokens: response.usage.input_tokens + response.usage.output_tokens
          }
        };
      } catch (selfHostedError) {
        console.warn('Self-hosted AI failed, falling back to cloud:', selfHostedError.message);
        
        if (!FALLBACK_TO_CLOUD || !process.env.ANTHROPIC_API_KEY) {
          // Return educational fallback response
          return {
            content: generateEducationalFallback(messages),
            model: 'educational-fallback',
            provider: 'anthropic',
            tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
          };
        }
      }
    }

    // Use cloud Anthropic API if available
    if (process.env.ANTHROPIC_API_KEY) {
      console.log('Using Cloud Anthropic API');
      
      // Separate system message from the rest
      const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';
      
      // Format the remaining messages for Anthropic
      const anthropicMessages = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

    // Fix Anthropic API call - system message needs to be separate
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemMessage,
      messages: anthropicMessages.map(msg => ({
        role: msg.role === 'system' ? 'user' : msg.role,
        content: msg.content
      })),
    });

    // Extract the content safely from the response
    let content = '';
    if (response.content && response.content.length > 0) {
      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        content = contentBlock.text;
      } else {
        // If it's not a text block, try to stringify it
        content = JSON.stringify(contentBlock);
      }
    }

    return {
      content: content,
      model: response.model,
      provider: 'anthropic',
      tokenUsage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  } catch (error) {
    throw handleAIError(error, 'anthropic');
  }
};

/**
 * Makes a request to the OpenAI API
 */
const callOpenAI = async (
  messages: AIMessageContent[],
  model: OpenAIModelType,
  maxTokens: number = 2048
): Promise<AIResponse> => {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      max_tokens: maxTokens,
    });

    return {
      content: response.choices[0].message.content || '',
      model: response.model,
      provider: 'openai',
      tokenUsage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
    };
  } catch (error) {
    throw handleAIError(error, 'openai');
  }
};

/**
 * Main function to get AI response from any provider
 * Falls back to secondary provider if the primary fails
 */
export const getAIResponse = async (
  messages: AIMessageContent[],
  options: {
    model?: AIModel;
    maxTokens?: number;
    attemptFallback?: boolean;
  } = {}
): Promise<AIResponse> => {
  const model = options.model || DEFAULT_AI_MODEL;
  const maxTokens = options.maxTokens || 2048;
  const attemptFallback = options.attemptFallback !== false; // Default to true
  
  try {
    if (model.provider === 'anthropic') {
      return await callAnthropic(
        messages,
        model.model as AnthropicModelType,
        maxTokens
      );
    } else if (model.provider === 'openai') {
      return await callOpenAI(
        messages,
        model.model as OpenAIModelType,
        maxTokens
      );
    } else {
      throw new Error(`Unsupported AI provider: ${model.provider}`);
    }
  } catch (error) {
    console.error(`Error with primary AI provider (${model.provider}):`, error);
    
    // Attempt fallback if enabled and we're not already using the fallback model
    if (attemptFallback && 
        (model.provider !== BACKUP_AI_MODEL.provider || 
         model.model !== BACKUP_AI_MODEL.model)) {
      console.log(`Attempting fallback to ${BACKUP_AI_MODEL.provider}...`);
      
      return getAIResponse(messages, {
        model: BACKUP_AI_MODEL,
        maxTokens,
        attemptFallback: false // Prevent infinite recursion
      });
    }
    
    // If no fallback or fallback failed, rethrow the error
    throw error;
  }
};

/**
 * Specialized function for generating educational content
 */
export const generateEducationalContent = async (
  topic: string,
  grade: string,
  learningStyle: string,
  contentType: 'lesson' | 'quiz' | 'activity' | 'summary',
  options: {
    model?: AIModel;
    maxTokens?: number;
    attemptFallback?: boolean;
  } = {}
): Promise<AIResponse> => {
  // Create system prompt with educational focus
  const systemPrompt = `You are an expert educator specializing in creating personalized educational content.
Focus on making content that is engaging, accurate, and adapted to the student's learning style.
All content should be educationally sound and age-appropriate.`;

  // Create detailed content prompt
  const contentPrompt = `Create a ${contentType} about "${topic}" for a student in grade ${grade} with a learning style that is ${learningStyle}.
  
The content should:
- Be engaging and interactive
- Include clear explanations and examples
- Be accessible for students with ${learningStyle} learning preferences
- Include appropriate visual descriptions or multimedia suggestions
- Follow educational best practices for this age group

Output the content in a well-formatted structure that would be easy to present to a student.`;

  // Combine into messages
  const messages: AIMessageContent[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: contentPrompt }
  ];

  // Get response with possibly higher token limit for educational content
  return await getAIResponse(messages, {
    ...options,
    maxTokens: options.maxTokens || 3072 // Default to higher limit for educational content
  });
};

/**
 * Specialized function for UAE legal content generation
 */
export const generateLegalContent = async (
  topic: string,
  contentType: 'explanation' | 'case-study' | 'practice-question' | 'summary',
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'bar-exam',
  options: {
    model?: AIModel;
    maxTokens?: number;
    attemptFallback?: boolean;
  } = {}
): Promise<AIResponse> => {
  // Create system prompt with UAE legal focus
  const systemPrompt = `You are an expert in UAE law, specializing in creating accurate, educational legal content.
All legal information must be accurate and up-to-date with current UAE legal codes and practices.
Content should be presented in a structured, clear manner appropriate for law students.`;

  // Create detailed content prompt
  const contentPrompt = `Create a ${contentType} about "${topic}" for a law student studying UAE law at a ${difficulty} level.
  
The content should:
- Be legally accurate and cite relevant UAE laws and codes
- Include practical applications and real-world context
- Be structured in a way that builds understanding of UAE legal principles
- Use appropriate legal terminology with explanations as needed
- For case studies, use realistic scenarios that highlight important legal concepts
- For practice questions, provide both the question and a model answer

Output the content in a well-formatted structure that would be appropriate for a law student.`;

  // Combine into messages
  const messages: AIMessageContent[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: contentPrompt }
  ];

  // Get response with possibly higher token limit for legal content
  return await getAIResponse(messages, {
    ...options,
    maxTokens: options.maxTokens || 4096 // Default to higher limit for legal content
  });
};

/**
 * Educational fallback for when AI services are unavailable
 */
const generateEducationalFallback = (messages: AIMessageContent[]): string => {
  const userMessage = messages.find(msg => msg.role === 'user')?.content || '';
  const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';
  
  // Extract topic from user message
  const topic = extractTopicFromMessage(userMessage);
  
  // Determine educational level and type
  let fallbackResponse = '';
  
  if (systemMessage.includes('superhero') || systemMessage.includes('primary') || systemMessage.includes('K-6')) {
    fallbackResponse = generatePrimaryFallback(topic, userMessage);
  } else if (systemMessage.includes('law') || systemMessage.includes('legal')) {
    fallbackResponse = generateLegalFallback(topic, userMessage);
  } else if (systemMessage.includes('language') || systemMessage.includes('translation')) {
    fallbackResponse = generateLanguageFallback(topic, userMessage);
  } else if (systemMessage.includes('secondary') || systemMessage.includes('7-12')) {
    fallbackResponse = generateSecondaryFallback(topic, userMessage);
  } else {
    fallbackResponse = generateGeneralFallback(topic, userMessage);
  }
  
  return fallbackResponse;
};

const extractTopicFromMessage = (message: string): string => {
  // Simple keyword extraction
  const words = message.toLowerCase().split(' ');
  const importantWords = words.filter(word => 
    word.length > 4 && 
    !['what', 'how', 'why', 'when', 'where', 'help', 'teach', 'explain', 'about'].includes(word)
  );
  return importantWords.slice(0, 2).join(' ') || 'this topic';
};

const generatePrimaryFallback = (topic: string, userMessage: string): string => {
  return `🦸‍♂️ **Super Learning Mode!**

Hey there, Super Student! I'd love to help you learn about **${topic}**!

📚 **What I know about ${topic}:**
• This is an important concept that super learners like you can master
• It connects to many other cool things you're learning
• We can explore it step by step to make it super clear!

🎯 **Let's explore together:**
1. What part of ${topic} interests you most?
2. Have you seen this before in your superhero adventures?
3. How do you think ${topic} might help you in real life?

🌟 **Remember:** Every superhero started by learning one thing at a time. You're doing great!

💡 **Next steps:** Tell me more about what you'd like to know, and I'll help break it down into super-manageable pieces!`;
};

const generateSecondaryFallback = (topic: string, userMessage: string): string => {
  return `🎭 **Stage Prep Learning Session**

Welcome to our exploration of **${topic}**! Let's dive into this fascinating subject.

📖 **Overview of ${topic}:**
This concept represents an important area of study that connects to broader themes in your education. Understanding ${topic} will help you develop critical thinking skills and prepare for advanced coursework.

🔍 **Key areas to explore:**
• Fundamental principles and definitions
• Real-world applications and examples  
• Connections to other subjects you're studying
• Practical skills you can develop

🎯 **Your learning journey:**
1. Start with basic understanding
2. Explore applications and examples
3. Practice with hands-on activities
4. Connect to your interests and goals

💼 **College & Career connections:**
Understanding ${topic} builds valuable skills for your future academic and professional success.

What specific aspect of ${topic} would you like to explore first?`;
};

const generateLegalFallback = (topic: string, userMessage: string): string => {
  return `⚖️ **Legal Education Session**

**Subject: ${topic}**

**Introduction:**
This legal concept is fundamental to understanding how law operates in practice. Let's examine the key principles and applications.

**Core Elements:**
• Legal framework and foundations
• Relevant statutes and case law
• Practical applications in legal practice
• Professional implications for lawyers

**Analysis Framework:**
1. **Definition and Scope**: What does ${topic} encompass?
2. **Legal Sources**: Which laws and precedents apply?
3. **Practical Application**: How is this used in practice?
4. **Professional Responsibility**: What ethical considerations apply?

**Study Recommendations:**
• Review relevant statutes and regulations
• Examine key cases and precedents
• Consider practical scenarios and applications
• Practice legal writing and analysis

**Next Steps:**
What specific aspect of ${topic} would you like to examine in greater detail?`;
};

const generateLanguageFallback = (topic: string, userMessage: string): string => {
  return `🌍 **Multilingual Learning Session**

**Topic: ${topic}**

**¡Bienvenidos! Welcome! Willkommen!**

Let's explore ${topic} through the lens of language and culture!

**🗣️ Language Learning Elements:**
• Vocabulary and expressions
• Cultural context and usage
• Practical conversation applications
• Cross-cultural understanding

**🌐 Multilingual Approach:**
We can explore this topic in English, Spanish, and German to give you a complete cultural perspective.

**📝 Learning Activities:**
1. Vocabulary building and practice
2. Cultural context exploration
3. Conversation scenarios
4. Real-world applications

**🤝 Cultural Integration:**
Understanding ${topic} across cultures helps build global communication skills and cultural awareness.

What language would you like to focus on first, and how can I help you explore ${topic}?`;
};

const generateGeneralFallback = (topic: string, userMessage: string): string => {
  return `📚 **Educational Support Session**

**Topic: ${topic}**

I'm here to help you understand ${topic} better! While I don't have access to advanced AI features right now, I can still provide structured learning support.

**🎯 Learning Approach:**
• Break down complex concepts into manageable parts
• Provide clear explanations and examples
• Suggest practice activities and exercises
• Connect learning to real-world applications

**📖 Study Framework:**
1. **Understanding**: What is ${topic}?
2. **Application**: How is it used?
3. **Practice**: How can you work with it?
4. **Connection**: How does it relate to other learning?

**💡 Learning Support:**
• Visual learners: Request diagrams and examples
• Auditory learners: Ask for explanations and discussions
• Kinesthetic learners: Look for hands-on activities
• Reading/writing learners: Focus on notes and summaries

**🚀 Next Steps:**
Tell me more about what you'd like to learn about ${topic}, and I'll help structure your learning experience!`;
};

/**
 * Specialized function for language learning content
 */
export const generateLanguageContent = async (
  language: string,
  topic: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  contentType: 'vocabulary' | 'dialogue' | 'grammar' | 'exercise',
  options: {
    model?: AIModel;
    maxTokens?: number;
    attemptFallback?: boolean;
  } = {}
): Promise<AIResponse> => {
  // Create system prompt with language learning focus
  const systemPrompt = `You are an expert language teacher specializing in ${language}.
Create educational content that helps students learn ${language} effectively.
All content should be linguistically accurate and culturally appropriate.`;

  // Create detailed content prompt
  const contentPrompt = `Create ${contentType} content about "${topic}" for a ${level} level student learning ${language}.
  
The content should:
- Use appropriate vocabulary and grammar for the ${level} level
- Include both the ${language} text and English translations
- For vocabulary, include pronunciation guides
- For dialogues, create realistic conversational exchanges
- For grammar, explain rules clearly with examples
- For exercises, include both questions and answers
- Include cultural notes where relevant

Output the content in a well-formatted structure that facilitates language learning.`;

  // Combine into messages
  const messages: AIMessageContent[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: contentPrompt }
  ];

  // Get response
  return await getAIResponse(messages, {
    ...options,
    maxTokens: options.maxTokens || 3072 // Default to higher limit for language content
  });
};

/**
 * Check if AI APIs are functioning correctly
 */
export const checkAIConnections = async (): Promise<{
  anthropic: boolean;
  openai: boolean;
  message: string;
}> => {
  let results = {
    anthropic: false,
    openai: false,
    message: "",
  };

  // Test Anthropic
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("Anthropic API key not configured");
    }
    
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 50,
      messages: [{ role: "user", content: "Respond with 'Anthropic API is working' only." }],
    });
    
    results.anthropic = true;
    results.message += "Anthropic API connection successful. ";
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.message += `Anthropic API issue: ${errorMessage}. `;
  }

  // Test OpenAI
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "Respond with 'OpenAI API is working' only." }],
      max_tokens: 50,
    });
    
    results.openai = true;
    results.message += "OpenAI API connection successful.";
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    results.message += `OpenAI API issue: ${errorMessage}`;
  }

  return results;
};

/**
 * AIService class for easier usage by other services
 */
export class AIService {
  /**
   * Get a completion from an AI model using a simple prompt
   */
  async getCompletion(
    prompt: string,
    model: AIModel = DEFAULT_AI_MODEL,
    maxTokens: number = 2048
  ): Promise<string> {
    const messages: AIMessageContent[] = [
      { role: 'user', content: prompt }
    ];
    
    const response = await getAIResponse(messages, {
      model,
      maxTokens,
      attemptFallback: true
    });
    
    return response.content;
  }
  
  /**
   * Get a completion from an AI model using system and user prompts
   */
  async getCompletionWithSystem(
    systemPrompt: string,
    userPrompt: string,
    model: AIModel = DEFAULT_AI_MODEL,
    maxTokens: number = 2048
  ): Promise<string> {
    const messages: AIMessageContent[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    
    const response = await getAIResponse(messages, {
      model,
      maxTokens,
      attemptFallback: true
    });
    
    return response.content;
  }
  
  /**
   * Get a completion for legal content
   */
  async getLegalContent(
    topic: string,
    contentType: 'explanation' | 'case-study' | 'practice-question' | 'summary',
    difficulty: 'basic' | 'intermediate' | 'advanced' | 'bar-exam',
    model: AIModel = DEFAULT_AI_MODEL
  ): Promise<string> {
    const response = await generateLegalContent(topic, contentType, difficulty, { model });
    return response.content;
  }
  
  /**
   * Get a completion for educational content
   */
  async getEducationalContent(
    topic: string,
    grade: string,
    learningStyle: string,
    contentType: 'lesson' | 'quiz' | 'activity' | 'summary',
    model: AIModel = DEFAULT_AI_MODEL
  ): Promise<string> {
    const response = await generateEducationalContent(topic, grade, learningStyle, contentType, { model });
    return response.content;
  }
  
  /**
   * Get a completion for language learning content
   */
  async getLanguageContent(
    language: string,
    topic: string,
    level: 'beginner' | 'intermediate' | 'advanced',
    contentType: 'vocabulary' | 'dialogue' | 'grammar' | 'exercise',
    model: AIModel = DEFAULT_AI_MODEL
  ): Promise<string> {
    const response = await generateLanguageContent(language, topic, level, contentType, { model });
    return response.content;
  }
  
  /**
   * Check if AI connections are working
   */
  async checkConnections(): Promise<{
    anthropic: boolean;
    openai: boolean;
    message: string;
  }> {
    return await checkAIConnections();
  }
}

export default {
  getAIResponse,
  generateEducationalContent,
  generateLegalContent,
  generateLanguageContent,
  checkAIConnections,
  DEFAULT_AI_MODEL,
  BACKUP_AI_MODEL,
  AIService,
};