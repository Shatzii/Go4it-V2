/**
 * Ollama Integration for Self-Hosted AI Models
 * Local AI inference with no external dependencies
 */

import { EventEmitter } from 'events';

export interface OllamaModel {
  name: string;
  size: string;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
  modified_at: Date;
}

export interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export interface GenerationOptions {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  raw?: boolean;
  format?: 'json';
  options?: {
    numa?: boolean;
    num_ctx?: number;
    num_batch?: number;
    num_gqa?: number;
    num_gpu?: number;
    main_gpu?: number;
    low_vram?: boolean;
    f16_kv?: boolean;
    logits_all?: boolean;
    vocab_only?: boolean;
    use_mmap?: boolean;
    use_mlock?: boolean;
    embedding_only?: boolean;
    num_thread?: number;
    num_keep?: number;
    seed?: number;
    num_predict?: number;
    top_k?: number;
    top_p?: number;
    tfs_z?: number;
    typical_p?: number;
    repeat_last_n?: number;
    temperature?: number;
    repeat_penalty?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    mirostat?: number;
    mirostat_tau?: number;
    mirostat_eta?: number;
    penalize_newline?: boolean;
    stop?: string[];
  };
}

export class OllamaService extends EventEmitter {
  private baseUrl: string;
  private isConnected = false;
  private availableModels: OllamaModel[] = [];
  private defaultModel = 'llama3.1:8b';

  constructor(baseUrl = 'http://localhost:11434') {
    super();
    this.baseUrl = baseUrl;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.checkConnection();
      await this.loadAvailableModels();
      await this.ensureModelsInstalled();
      this.emit('ready');
      console.log('🤖 Ollama service initialized successfully');
    } catch (error) {
      console.error('🤖 Ollama initialization failed:', error);
      this.emit('error', error);
    }
  }

  private async checkConnection(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const version = await response.json();
      this.isConnected = true;
      console.log(`🤖 Connected to Ollama server version: ${version.version}`);
    } catch (error) {
      this.isConnected = false;
      throw new Error(`Failed to connect to Ollama server at ${this.baseUrl}: ${error}`);
    }
  }

  private async loadAvailableModels(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      this.availableModels = data.models || [];
      console.log(`🤖 Found ${this.availableModels.length} installed models`);
    } catch (error) {
      console.error('🤖 Failed to load models:', error);
      this.availableModels = [];
    }
  }

  private async ensureModelsInstalled(): Promise<void> {
    const requiredModels = [
      'llama3.1:8b',
      'mistral:7b',
      'phi3:3.8b',
      'qwen2:7b'
    ];

    for (const modelName of requiredModels) {
      const isInstalled = this.availableModels.some(m => m.name.includes(modelName.split(':')[0]));
      
      if (!isInstalled) {
        console.log(`🤖 Installing model: ${modelName}`);
        await this.pullModel(modelName);
      }
    }
  }

  async pullModel(modelName: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName })
      });

      if (!response.ok) {
        throw new Error(`Failed to pull model ${modelName}: ${response.statusText}`);
      }

      console.log(`🤖 Model ${modelName} installation started`);
      this.emit('modelPulling', modelName);
    } catch (error) {
      console.error(`🤖 Failed to pull model ${modelName}:`, error);
      throw error;
    }
  }

  async generate(options: GenerationOptions): Promise<OllamaResponse> {
    if (!this.isConnected) {
      throw new Error('Ollama service is not connected');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options.model || this.defaultModel,
          prompt: options.prompt,
          system: options.system,
          template: options.template,
          context: options.context,
          stream: false, // We'll handle streaming separately
          raw: options.raw,
          format: options.format,
          options: options.options
        })
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('🤖 Generation failed:', error);
      throw error;
    }
  }

  async generateBusinessContent(prompt: string, industry?: string): Promise<string> {
    const systemPrompt = `You are Shatzii AI, an expert business automation assistant specializing in ${industry || 'general business'} operations. Provide professional, actionable, and results-focused responses that help optimize business processes and increase revenue.`;

    const response = await this.generate({
      model: this.defaultModel,
      prompt: prompt,
      system: systemPrompt,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 500
      }
    });

    return response.response;
  }

  async generateMarketingContent(prompt: string, brand: string, tone: 'professional' | 'casual' | 'technical' = 'professional'): Promise<string> {
    const systemPrompt = `You are a marketing AI assistant for ${brand}. Create compelling, ${tone} marketing content that drives engagement and conversions. Focus on benefits, use persuasive language, and include clear calls to action.`;

    const response = await this.generate({
      model: this.defaultModel,
      prompt: prompt,
      system: systemPrompt,
      options: {
        temperature: 0.8,
        top_p: 0.9,
        num_predict: 300
      }
    });

    return response.response;
  }

  async analyzeSentiment(text: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral'; confidence: number; reasoning: string }> {
    const prompt = `Analyze the sentiment of this text and respond with valid JSON only:

Text: "${text}"

Respond with JSON in this exact format:
{
  "sentiment": "positive|negative|neutral",
  "confidence": 0.85,
  "reasoning": "Brief explanation of the sentiment analysis"
}`;

    const response = await this.generate({
      model: this.defaultModel,
      prompt: prompt,
      format: 'json',
      options: {
        temperature: 0.3,
        num_predict: 150
      }
    });

    try {
      return JSON.parse(response.response);
    } catch (error) {
      console.error('🤖 Failed to parse sentiment analysis JSON:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        reasoning: 'Failed to analyze sentiment'
      };
    }
  }

  async extractKeywords(text: string, maxKeywords = 10): Promise<string[]> {
    const prompt = `Extract the ${maxKeywords} most important keywords from this text. Return only a JSON array of keywords:

Text: "${text}"

Return format: ["keyword1", "keyword2", "keyword3"]`;

    const response = await this.generate({
      model: this.defaultModel,
      prompt: prompt,
      format: 'json',
      options: {
        temperature: 0.2,
        num_predict: 100
      }
    });

    try {
      return JSON.parse(response.response);
    } catch (error) {
      console.error('🤖 Failed to parse keywords JSON:', error);
      return [];
    }
  }

  async summarizeText(text: string, maxLength = 200): Promise<string> {
    const prompt = `Summarize this text in approximately ${maxLength} characters, maintaining the key points and important details:

${text}`;

    const response = await this.generate({
      model: this.defaultModel,
      prompt: prompt,
      options: {
        temperature: 0.5,
        num_predict: Math.floor(maxLength / 4), // Rough token estimate
        top_p: 0.9
      }
    });

    return response.response.trim();
  }

  getAvailableModels(): OllamaModel[] {
    return this.availableModels;
  }

  isServiceReady(): boolean {
    return this.isConnected && this.availableModels.length > 0;
  }

  getStatus(): {
    connected: boolean;
    models: number;
    defaultModel: string;
    baseUrl: string;
  } {
    return {
      connected: this.isConnected,
      models: this.availableModels.length,
      defaultModel: this.defaultModel,
      baseUrl: this.baseUrl
    };
  }
}

export const ollamaService = new OllamaService();

// Event listeners for service status
ollamaService.on('ready', () => {
  console.log('🤖 Ollama service is ready for AI generation');
});

ollamaService.on('error', (error) => {
  console.error('🤖 Ollama service error:', error);
});

ollamaService.on('modelPulling', (modelName) => {
  console.log(`🤖 Downloading model: ${modelName} (this may take several minutes)`);
});