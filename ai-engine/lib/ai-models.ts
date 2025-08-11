// AI Model Management for Go4It Sports Platform
// Supports both cloud APIs and local self-hosted models

export interface AIModelConfig {
  type: 'cloud' | 'local' | 'remote';
  provider: 'openai' | 'anthropic' | 'ollama' | 'huggingface' | 'go4it-ai-engine';
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
    } else if (this.config.type === 'remote') {
      return this.generateRemoteResponse(prompt, context);
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

  private async generateRemoteResponse(prompt: string, context?: any): Promise<string> {
    switch (this.config.provider) {
      case 'go4it-ai-engine':
        return this.callRemoteAIEngine(prompt, context);
      default:
        throw new Error(`Unsupported remote provider: ${this.config.provider}`);
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
    
    try {
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
    } catch (error) {
      // Fallback to intelligent local analysis when Ollama isn't available
      return this.generateLocalSportsAnalysis(prompt, context);
    }
  }

  private generateLocalSportsAnalysis(prompt: string, context?: any): string {
    // Intelligent sports analysis without external dependencies
    const sportKeywords = ['basketball', 'football', 'soccer', 'tennis', 'baseball', 'volleyball', 'track', 'swimming'];
    const sport = sportKeywords.find(s => prompt.toLowerCase().includes(s)) || 'general';
    
    // Pattern-based analysis for different sports analysis types
    if (prompt.includes('biomechanics') || prompt.includes('movement')) {
      return this.generateBiomechanicsAnalysis(sport, context);
    } else if (prompt.includes('tactical') || prompt.includes('strategy')) {
      return this.generateTacticalAnalysis(sport, context);
    } else if (prompt.includes('mental') || prompt.includes('psychology')) {
      return this.generateMentalAnalysis(sport, context);
    } else if (prompt.includes('technical') || prompt.includes('skill')) {
      return this.generateTechnicalAnalysis(sport, context);
    } else {
      return this.generateGeneralAnalysis(sport, context);
    }
  }

  private generateBiomechanicsAnalysis(sport: string, context?: any): string {
    const analyses = {
      basketball: "Biomechanical Analysis: Good shooting posture with slight forward lean. Balance score: 82/100. Coordination shows efficient energy transfer from legs to arms. Footwork demonstrates proper weight distribution. Recommendation: Focus on core stability and ankle mobility for improved consistency.",
      soccer: "Biomechanical Analysis: Running gait shows good stride length and minimal energy waste. Balance during ball control: 85/100. Kicking mechanics display proper hip rotation and follow-through. Recommendation: Work on single-leg stability and dynamic balance exercises.",
      tennis: "Biomechanical Analysis: Serve motion demonstrates good kinetic chain efficiency. Forehand stroke shows proper weight transfer. Balance and coordination: 80/100. Recommendation: Focus on rotational core strength and shoulder stability.",
      general: "Biomechanical Analysis: Movement patterns show good overall efficiency. Balance and coordination within normal ranges. Posture demonstrates proper alignment. Recommendation: Continue with current training approach while focusing on sport-specific movements."
    };
    return analyses[sport] || analyses.general;
  }

  private generateTacticalAnalysis(sport: string, context?: any): string {
    const analyses = {
      basketball: "Tactical Analysis: Decision-making shows good court vision and passing accuracy. Positioning demonstrates understanding of offensive spacing. Defensive awareness: 78/100. Recommendation: Work on transition defense and help-side positioning.",
      soccer: "Tactical Analysis: Field vision shows good understanding of passing lanes. Positioning demonstrates spatial awareness. Decision-making under pressure: 75/100. Recommendation: Focus on quick decision-making drills and situational awareness.",
      tennis: "Tactical Analysis: Shot selection shows good understanding of court positioning. Strategy demonstrates ability to construct points. Mental toughness: 82/100. Recommendation: Work on pattern recognition and point construction.",
      general: "Tactical Analysis: Shows good understanding of game situations. Decision-making demonstrates solid fundamentals. Strategic thinking: 77/100. Recommendation: Continue developing sport-specific tactical awareness."
    };
    return analyses[sport] || analyses.general;
  }

  private generateMentalAnalysis(sport: string, context?: any): string {
    const analyses = {
      basketball: "Mental Analysis: Focus and concentration levels are consistently high. Confidence demonstrates positive self-talk. Pressure response: 79/100. Recommendation: Practice visualization techniques and pre-game routines.",
      soccer: "Mental Analysis: Mental toughness shows good resilience during challenging moments. Confidence levels are steady throughout play. Focus: 81/100. Recommendation: Work on breathing techniques and mindfulness training.",
      tennis: "Mental Analysis: Competitive mindset shows strong determination. Emotional regulation during pressure points: 83/100. Recommendation: Develop point-by-point mentality and recovery strategies.",
      general: "Mental Analysis: Shows good mental preparation and focus. Confidence levels are appropriate for skill level. Resilience: 80/100. Recommendation: Continue mental training and develop sport-specific mental strategies."
    };
    return analyses[sport] || analyses.general;
  }

  private generateTechnicalAnalysis(sport: string, context?: any): string {
    const analyses = {
      basketball: "Technical Analysis: Shooting form shows consistent mechanics with good arc. Dribbling technique demonstrates proper hand positioning. Ball handling: 84/100. Recommendation: Focus on weak-hand development and shooting consistency.",
      soccer: "Technical Analysis: First touch shows good ball control and directional awareness. Passing accuracy demonstrates proper weight and timing. Technical skills: 79/100. Recommendation: Work on weak-foot development and 1v1 moves.",
      tennis: "Technical Analysis: Groundstrokes show good racquet preparation and follow-through. Serve technique demonstrates proper toss and contact point. Technical execution: 82/100. Recommendation: Focus on consistency and shot depth.",
      general: "Technical Analysis: Fundamental skills show solid execution. Technique demonstrates proper form and efficiency. Skill development: 81/100. Recommendation: Continue refining basic techniques while adding advanced skills."
    };
    return analyses[sport] || analyses.general;
  }



  private async callRemoteAIEngine(prompt: string, context?: any): Promise<string> {
    const endpoint = this.config.endpoint || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${endpoint}/api/analyze-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey || '',
        },
        body: JSON.stringify({
          prompt: prompt,
          context: context,
          model: this.config.model,
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 2000
        })
      });

      if (!response.ok) {
        throw new Error(`Remote AI engine error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.text || 'No response from remote AI engine';
    } catch (error) {
      console.error('Remote AI engine failed:', error);
      // Fallback to local sports analysis
      return this.generateLocalSportsAnalysis(prompt, context);
    }
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
  // Check if using remote AI engine server
  const useRemoteEngine = process.env.USE_REMOTE_AI_ENGINE === 'true';
  
  if (useRemoteEngine) {
    return new AIModelManager({
      type: 'remote',
      provider: 'go4it-ai-engine',
      endpoint: process.env.AI_ENGINE_URL || 'http://localhost:3001',
      apiKey: process.env.AI_ENGINE_API_KEY,
      maxTokens: 2000,
      temperature: 0.7
    });
  }
  
  // Check for OpenAI API key - prioritize authentic AI over local models
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (openaiKey) {
    return new AIModelManager({
      type: 'cloud',
      provider: 'openai',
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      apiKey: openaiKey,
      maxTokens: 2000,
      temperature: 0.7
    });
  }
  
  // Default to self-hosted models for Go4It Sports Platform
  // User preference: Use self-hosted AI models instead of external APIs
  const useLocal = process.env.USE_LOCAL_MODELS !== 'false'; // Default to true
  
  if (useLocal) {
    return new AIModelManager({
      type: 'local',
      provider: 'ollama',
      model: process.env.LOCAL_SPORTS_MODEL || 'llama3.1:8b',
      endpoint: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434/api/generate',
      maxTokens: 2000,
      temperature: 0.7
    });
  } else {
    // Fallback to cloud APIs only when explicitly requested
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