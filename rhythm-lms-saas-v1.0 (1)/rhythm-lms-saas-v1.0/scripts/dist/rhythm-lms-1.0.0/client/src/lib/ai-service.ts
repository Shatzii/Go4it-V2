import { apiRequest } from './queryClient';

export interface AiGenerationResult {
  content: string;
  success: boolean;
  message?: string;
}

export interface AiPromptRequest {
  prompt: string;
  model: string;
  context?: string;
  temperature?: number;
  maxTokens?: number;
}

// Map of models that can be used
export const availableModels = [
  { 
    id: 'rhythm-core-v0.1.0', 
    name: 'Rhythm Core v0.1.0', 
    description: 'Optimized for Rhythm language generation',
    type: 'local' 
  },
  { 
    id: 'gpt-4', 
    name: 'GPT-4', 
    description: 'Advanced general-purpose model with strong code generation',
    type: 'remote' 
  },
  { 
    id: 'custom-model', 
    name: 'Custom Model', 
    description: 'User-provided model path',
    type: 'local' 
  }
];

// Default settings for AI prompts
const defaultSettings = {
  temperature: 0.7,
  maxTokens: 2000,
};

export async function generateCode(promptRequest: AiPromptRequest): Promise<AiGenerationResult> {
  try {
    const response = await apiRequest('POST', '/api/ai/generate', {
      ...defaultSettings,
      ...promptRequest
    });
    
    return await response.json();
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      content: '',
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function explainCode(code: string, model: string = 'rhythm-core-v0.1.0'): Promise<AiGenerationResult> {
  return generateCode({
    prompt: 'Explain the following Rhythm code:',
    model,
    context: code,
  });
}

export async function optimizeCode(code: string, model: string = 'rhythm-core-v0.1.0'): Promise<AiGenerationResult> {
  return generateCode({
    prompt: 'Optimize the following Rhythm code:',
    model,
    context: code,
  });
}

export async function getAiStatus(): Promise<{
  isReady: boolean;
  model: string;
  memoryUsage: { used: number; total: number };
  message?: string;
}> {
  try {
    const response = await apiRequest('GET', '/api/ai/status', undefined);
    return await response.json();
  } catch (error) {
    console.error('AI status error:', error);
    return {
      isReady: false,
      model: 'unknown',
      memoryUsage: { used: 0, total: 0 },
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
