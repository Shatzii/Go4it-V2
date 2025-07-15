// AI Model Management for Go4It Sports Platform
// Supports both cloud APIs and local self-hosted models

export interface AIModelConfig {
  type: 'cloud' | 'local';
  provider: 'openai' | 'anthropic' | 'ollama' | 'huggingface';
  model: string;
  endpoint?: string;
  apiKey?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface LocalModelInfo {
  name: string;
  size: string;
  description: string;
  downloadUrl: string;
  modelFile: string;
  requirements: {
    ram: string;
    storage: string;
    gpu?: string;
  };
  capabilities: string[];
}

// Small, efficient models for local deployment
export const AVAILABLE_LOCAL_MODELS: LocalModelInfo[] = [
  {
    name: 'llama3.1:8b',
    size: '4.7GB',
    description: 'General-purpose AI model optimized for coaching and instruction',
    downloadUrl: 'ollama://llama3.1:8b',
    modelFile: 'llama3.1-8b.gguf',
    requirements: {
      ram: '8GB',
      storage: '5GB',
      gpu: 'Optional (CUDA/ROCm)'
    },
    capabilities: ['coaching', 'instruction', 'sports', 'personalization', 'analytics']
  },
  {
    name: 'codellama:7b',
    size: '3.8GB',
    description: 'Code-focused model for technical drill instructions',
    downloadUrl: 'ollama://codellama:7b',
    modelFile: 'codellama-7b.gguf',
    requirements: {
      ram: '6GB',
      storage: '4GB'
    },
    capabilities: ['instruction', 'technical', 'drills']
  },
  {
    name: 'mistral:7b',
    size: '4.1GB',
    description: 'Fast and efficient model for quick coaching responses',
    downloadUrl: 'ollama://mistral:7b',
    modelFile: 'mistral-7b.gguf',
    requirements: {
      ram: '6GB',
      storage: '4.5GB'
    },
    capabilities: ['coaching', 'sports', 'motivation', 'psychology']
  },
  {
    name: 'neural-chat:7b',
    size: '4.2GB',
    description: 'Conversational AI optimized for student-athlete interactions',
    downloadUrl: 'ollama://neural-chat:7b',
    modelFile: 'neural-chat-7b.gguf',
    requirements: {
      ram: '6GB',
      storage: '4.5GB'
    },
    capabilities: ['coaching', 'conversation', 'psychology', 'motivation', 'education']
  },
  {
    name: 'phi3:mini',
    size: '2.3GB',
    description: 'Lightweight model for basic coaching and quick responses',
    downloadUrl: 'ollama://phi3:mini',
    modelFile: 'phi3-mini.gguf',
    requirements: {
      ram: '4GB',
      storage: '2.5GB'
    },
    capabilities: ['coaching', 'basic', 'fast']
  }
];

export class AIModelManager {
  private config: AIModelConfig;
  private localModelsPath: string;

  constructor(config: AIModelConfig) {
    this.config = config;
    this.localModelsPath = process.env.LOCAL_MODELS_PATH || './models';
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    if (this.config.type === 'cloud') {
      return this.generateCloudResponse(prompt, context);
    } else {
      return this.generateLocalResponse(prompt, context);
    }
  }

  async generateResponseWithLicense(prompt: string, licenseKey: string, context?: any): Promise<string> {
    if (this.config.type === 'local') {
      // Validate license before using local model
      const { createModelEncryptionManager } = await import('./model-encryption');
      const encryptionManager = createModelEncryptionManager();
      
      const validation = await encryptionManager.validateLicense(licenseKey);
      if (!validation.valid) {
        throw new Error(`License validation failed: ${validation.error}`);
      }
      
      return this.generateLocalResponse(prompt, context);
    } else {
      return this.generateCloudResponse(prompt, context);
    }
  }

  private async generateCloudResponse(prompt: string, context?: any): Promise<string> {
    switch (this.config.provider) {
      case 'openai':
        return this.callOpenAI(prompt, context);
      case 'anthropic':
        return this.callAnthropic(prompt, context);
      default:
        throw new Error(`Unsupported cloud provider: ${this.config.provider}`);
    }
  }

  private async generateLocalResponse(prompt: string, context?: any): Promise<string> {
    switch (this.config.provider) {
      case 'ollama':
        return this.callOllama(prompt, context);
      case 'huggingface':
        return this.callHuggingFace(prompt, context);
      default:
        throw new Error(`Unsupported local provider: ${this.config.provider}`);
    }
  }

  private async callOpenAI(prompt: string, context?: any): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert sports analyst specializing in youth athlete development and neurodivergent-friendly coaching.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens || 2000,
        temperature: this.config.temperature || 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callAnthropic(prompt: string, context?: any): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.config.apiKey!,
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens || 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    return data.content[0].text;
  }

  private async callOllama(prompt: string, context?: any): Promise<string> {
    const endpoint = this.config.endpoint || 'http://localhost:11434/api/generate';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: this.config.temperature || 0.7,
          num_predict: this.config.maxTokens || 2000
        }
      })
    });

    const data = await response.json();
    return data.response;
  }

  private async callHuggingFace(prompt: string, context?: any): Promise<string> {
    const endpoint = this.config.endpoint || `http://localhost:8080/generate`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: this.config.maxTokens || 2000,
          temperature: this.config.temperature || 0.7,
          do_sample: true
        }
      })
    });

    const data = await response.json();
    return data.generated_text || data[0]?.generated_text || '';
  }

  async checkLocalModelAvailability(): Promise<boolean> {
    try {
      if (this.config.provider === 'ollama') {
        const response = await fetch('http://localhost:11434/api/tags');
        return response.ok;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async downloadModel(modelInfo: LocalModelInfo): Promise<void> {
    // This would implement the actual model download logic
    console.log(`Downloading model: ${modelInfo.name}`);
    // In a real implementation, this would:
    // 1. Download the model file
    // 2. Verify checksum
    // 3. Extract if needed
    // 4. Set up local inference server
  }
}

// Factory function to create AI model manager based on configuration
export function createAIModelManager(): AIModelManager {
  const useLocal = process.env.USE_LOCAL_MODELS === 'true';
  
  if (useLocal) {
    return new AIModelManager({
      type: 'local',
      provider: 'ollama',
      model: process.env.LOCAL_SPORTS_MODEL || 'sports-coach-mini',
      endpoint: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434/api/generate',
      maxTokens: 2000,
      temperature: 0.7
    });
  } else {
    // Fallback to cloud APIs
    if (process.env.OPENAI_API_KEY) {
      return new AIModelManager({
        type: 'cloud',
        provider: 'openai',
        model: 'gpt-4o',
        apiKey: process.env.OPENAI_API_KEY,
        maxTokens: 2000,
        temperature: 0.7
      });
    } else if (process.env.ANTHROPIC_API_KEY) {
      return new AIModelManager({
        type: 'cloud',
        provider: 'anthropic',
        model: 'claude-3-sonnet-20240229',
        apiKey: process.env.ANTHROPIC_API_KEY,
        maxTokens: 2000,
        temperature: 0.7
      });
    } else {
      throw new Error('No AI model configuration available');
    }
  }
}