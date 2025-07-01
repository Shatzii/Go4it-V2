/**
 * Content Management System
 * Full control over all platform content and configurations
 */

import { EventEmitter } from 'events';
import { storage } from '../storage';

export interface ContentBlock {
  id: string;
  type: 'text' | 'html' | 'json' | 'image' | 'video' | 'ai_config' | 'pricing' | 'feature_list';
  page: string;
  section: string;
  key: string;
  title: string;
  content: any;
  metadata: {
    description?: string;
    required?: boolean;
    validation?: string;
    category?: string;
  };
  lastModified: Date;
  modifiedBy: string;
  version: number;
  published: boolean;
}

export interface AIConfiguration {
  id: string;
  engine: string;
  model: string;
  parameters: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  };
  systemPrompt: string;
  enabled: boolean;
  performance: {
    accuracy: number;
    speed: number;
    cost_per_request: number;
  };
}

export interface PlatformConfig {
  id: string;
  category: 'general' | 'ai' | 'security' | 'email' | 'billing' | 'analytics';
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description: string;
  sensitive: boolean;
  required: boolean;
  validation?: string;
}

export class ContentManager extends EventEmitter {
  private contentBlocks: Map<string, ContentBlock> = new Map();
  private aiConfigurations: Map<string, AIConfiguration> = new Map();
  private platformConfigs: Map<string, PlatformConfig> = new Map();
  private isInitialized = false;

  constructor() {
    super();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.loadDefaultContent();
    await this.loadAIConfigurations();
    await this.loadPlatformConfigurations();
    this.isInitialized = true;
    console.log('📝 Content Management System initialized');
    this.emit('ready');
  }

  private async loadDefaultContent(): Promise<void> {
    const defaultContent: ContentBlock[] = [
      // Landing Page Content
      {
        id: 'landing_hero_title',
        type: 'text',
        page: 'landing',
        section: 'hero',
        key: 'title',
        title: 'Hero Title',
        content: 'Transform Your Business with Autonomous AI Operations',
        metadata: { description: 'Main headline on the landing page', required: true },
        lastModified: new Date(),
        modifiedBy: 'system',
        version: 1,
        published: true
      },
      {
        id: 'landing_hero_subtitle',
        type: 'text',
        page: 'landing',
        section: 'hero',
        key: 'subtitle',
        title: 'Hero Subtitle',
        content: 'Self-hosted AI platform that automates your entire business operations with zero external dependencies',
        metadata: { description: 'Supporting text below the main headline' },
        lastModified: new Date(),
        modifiedBy: 'system',
        version: 1,
        published: true
      },
      {
        id: 'landing_features',
        type: 'json',
        page: 'landing',
        section: 'features',
        key: 'feature_list',
        title: 'Feature List',
        content: [
          {
            title: 'Autonomous AI Operations',
            description: 'Complete business automation with self-managing AI agents',
            icon: 'brain'
          },
          {
            title: 'Self-Hosted Control',
            description: 'Your data never leaves your infrastructure',
            icon: 'shield'
          },
          {
            title: 'Revenue Recovery',
            description: 'AI identifies and captures lost revenue opportunities',
            icon: 'dollar-sign'
          }
        ],
        metadata: { description: 'List of main platform features' },
        lastModified: new Date(),
        modifiedBy: 'system',
        version: 1,
        published: true
      },
      // Pricing Content
      {
        id: 'pricing_plans',
        type: 'pricing',
        page: 'pricing',
        section: 'plans',
        key: 'plan_list',
        title: 'Pricing Plans',
        content: {
          plans: [
            {
              name: 'AI Starter',
              price: 299,
              description: 'Perfect for small businesses starting their AI journey',
              features: [
                'Basic AI automation',
                '5 AI agents',
                'Standard support',
                'Self-hosted deployment'
              ],
              popular: false
            },
            {
              name: 'Business Pro',
              price: 899,
              description: 'Advanced AI operations for growing companies',
              features: [
                'Advanced AI automation',
                '25 AI agents',
                'Priority support',
                'Custom integrations',
                'Revenue recovery engine'
              ],
              popular: true
            },
            {
              name: 'Enterprise',
              price: 2499,
              description: 'Complete AI transformation for large organizations',
              features: [
                'Unlimited AI agents',
                'White-label options',
                'Dedicated support',
                'Custom AI models',
                'Complete source code'
              ],
              popular: false
            }
          ]
        },
        metadata: { description: 'Platform pricing tiers and features' },
        lastModified: new Date(),
        modifiedBy: 'system',
        version: 1,
        published: true
      },
      // Dashboard Content
      {
        id: 'dashboard_welcome',
        type: 'html',
        page: 'dashboard',
        section: 'welcome',
        key: 'welcome_message',
        title: 'Dashboard Welcome Message',
        content: '<h2>Welcome to Your AI Command Center</h2><p>Your autonomous AI agents are working 24/7 to optimize your business operations.</p>',
        metadata: { description: 'Welcome message shown on dashboard' },
        lastModified: new Date(),
        modifiedBy: 'system',
        version: 1,
        published: true
      }
    ];

    for (const content of defaultContent) {
      this.contentBlocks.set(content.id, content);
    }
  }

  private async loadAIConfigurations(): Promise<void> {
    const defaultAIConfigs: AIConfiguration[] = [
      {
        id: 'shatzii_financial_ai',
        engine: 'financial',
        model: 'Shatzii-Finance-7B',
        parameters: {
          temperature: 0.3,
          max_tokens: 1000,
          top_p: 0.9
        },
        systemPrompt: 'You are Shatzii Financial AI, an expert in financial operations and compliance. Provide accurate, compliant, and actionable financial advice.',
        enabled: true,
        performance: {
          accuracy: 96.7,
          speed: 150,
          cost_per_request: 0.02
        }
      },
      {
        id: 'shatzii_legal_ai',
        engine: 'legal',
        model: 'Shatzii-Legal-7B',
        parameters: {
          temperature: 0.2,
          max_tokens: 1500,
          top_p: 0.85
        },
        systemPrompt: 'You are Shatzii Legal AI, specialized in legal document analysis and case strategy. Maintain attorney-client privilege at all times.',
        enabled: true,
        performance: {
          accuracy: 94.3,
          speed: 200,
          cost_per_request: 0.03
        }
      },
      {
        id: 'shatzii_marketing_ai',
        engine: 'marketing',
        model: 'Shatzii-Marketing-7B',
        parameters: {
          temperature: 0.8,
          max_tokens: 800,
          top_p: 0.9
        },
        systemPrompt: 'You are Shatzii Marketing AI, expert in creating compelling marketing content and campaigns that drive conversions.',
        enabled: true,
        performance: {
          accuracy: 91.2,
          speed: 120,
          cost_per_request: 0.015
        }
      }
    ];

    for (const config of defaultAIConfigs) {
      this.aiConfigurations.set(config.id, config);
    }
  }

  private async loadPlatformConfigurations(): Promise<void> {
    const defaultConfigs: PlatformConfig[] = [
      {
        id: 'platform_name',
        category: 'general',
        key: 'platform_name',
        value: 'Shatzii',
        type: 'string',
        description: 'Platform brand name',
        sensitive: false,
        required: true
      },
      {
        id: 'company_email',
        category: 'general',
        key: 'company_email',
        value: 'contact@shatzii.com',
        type: 'string',
        description: 'Primary company contact email',
        sensitive: false,
        required: true
      },
      {
        id: 'max_ai_agents',
        category: 'ai',
        key: 'max_ai_agents',
        value: 50,
        type: 'number',
        description: 'Maximum number of concurrent AI agents',
        sensitive: false,
        required: true
      },
      {
        id: 'enable_revenue_recovery',
        category: 'ai',
        key: 'enable_revenue_recovery',
        value: true,
        type: 'boolean',
        description: 'Enable automatic revenue recovery detection',
        sensitive: false,
        required: true
      },
      {
        id: 'email_service_provider',
        category: 'email',
        key: 'email_service_provider',
        value: 'sendgrid',
        type: 'string',
        description: 'Email service provider (sendgrid/smtp)',
        sensitive: false,
        required: true
      }
    ];

    for (const config of defaultConfigs) {
      this.platformConfigs.set(config.id, config);
    }
  }

  // Content Management Methods
  async updateContent(id: string, content: any, userId: string): Promise<ContentBlock> {
    const existingContent = this.contentBlocks.get(id);
    if (!existingContent) {
      throw new Error(`Content block with ID ${id} not found`);
    }

    const updatedContent: ContentBlock = {
      ...existingContent,
      content,
      lastModified: new Date(),
      modifiedBy: userId,
      version: existingContent.version + 1
    };

    this.contentBlocks.set(id, updatedContent);
    this.emit('contentUpdated', updatedContent);
    
    console.log(`📝 Content updated: ${id} by user ${userId}`);
    return updatedContent;
  }

  async createContent(data: Omit<ContentBlock, 'id' | 'lastModified' | 'version'>): Promise<ContentBlock> {
    const id = `${data.page}_${data.section}_${data.key}_${Date.now()}`;
    
    const newContent: ContentBlock = {
      ...data,
      id,
      lastModified: new Date(),
      version: 1
    };

    this.contentBlocks.set(id, newContent);
    this.emit('contentCreated', newContent);
    
    console.log(`📝 New content created: ${id}`);
    return newContent;
  }

  async deleteContent(id: string, userId: string): Promise<boolean> {
    const content = this.contentBlocks.get(id);
    if (!content) {
      return false;
    }

    this.contentBlocks.delete(id);
    this.emit('contentDeleted', { id, deletedBy: userId });
    
    console.log(`📝 Content deleted: ${id} by user ${userId}`);
    return true;
  }

  getContent(page?: string, section?: string): ContentBlock[] {
    let content = Array.from(this.contentBlocks.values());
    
    if (page) {
      content = content.filter(c => c.page === page);
    }
    
    if (section) {
      content = content.filter(c => c.section === section);
    }
    
    return content.filter(c => c.published);
  }

  getContentById(id: string): ContentBlock | undefined {
    return this.contentBlocks.get(id);
  }

  // AI Configuration Methods
  async updateAIConfiguration(id: string, config: Partial<AIConfiguration>, userId: string): Promise<AIConfiguration> {
    const existing = this.aiConfigurations.get(id);
    if (!existing) {
      throw new Error(`AI configuration ${id} not found`);
    }

    const updated: AIConfiguration = {
      ...existing,
      ...config
    };

    this.aiConfigurations.set(id, updated);
    this.emit('aiConfigUpdated', updated);
    
    console.log(`🤖 AI configuration updated: ${id} by user ${userId}`);
    return updated;
  }

  getAIConfigurations(): AIConfiguration[] {
    return Array.from(this.aiConfigurations.values());
  }

  getAIConfiguration(id: string): AIConfiguration | undefined {
    return this.aiConfigurations.get(id);
  }

  // Platform Configuration Methods
  async updatePlatformConfig(id: string, value: any, userId: string): Promise<PlatformConfig> {
    const existing = this.platformConfigs.get(id);
    if (!existing) {
      throw new Error(`Platform configuration ${id} not found`);
    }

    const updated: PlatformConfig = {
      ...existing,
      value
    };

    this.platformConfigs.set(id, updated);
    this.emit('platformConfigUpdated', updated);
    
    console.log(`⚙️ Platform config updated: ${id} by user ${userId}`);
    return updated;
  }

  getPlatformConfigs(): PlatformConfig[] {
    return Array.from(this.platformConfigs.values())
      .filter(config => !config.sensitive); // Don't expose sensitive configs in general listing
  }

  getPlatformConfig(key: string): any {
    const config = Array.from(this.platformConfigs.values())
      .find(c => c.key === key);
    return config?.value;
  }

  // Content Export/Import
  exportContent(): {
    contentBlocks: ContentBlock[];
    aiConfigurations: AIConfiguration[];
    platformConfigs: PlatformConfig[];
  } {
    return {
      contentBlocks: Array.from(this.contentBlocks.values()),
      aiConfigurations: Array.from(this.aiConfigurations.values()),
      platformConfigs: Array.from(this.platformConfigs.values())
    };
  }

  async importContent(data: {
    contentBlocks?: ContentBlock[];
    aiConfigurations?: AIConfiguration[];
    platformConfigs?: PlatformConfig[];
  }, userId: string): Promise<void> {
    if (data.contentBlocks) {
      for (const content of data.contentBlocks) {
        this.contentBlocks.set(content.id, {
          ...content,
          lastModified: new Date(),
          modifiedBy: userId
        });
      }
    }

    if (data.aiConfigurations) {
      for (const config of data.aiConfigurations) {
        this.aiConfigurations.set(config.id, config);
      }
    }

    if (data.platformConfigs) {
      for (const config of data.platformConfigs) {
        this.platformConfigs.set(config.id, config);
      }
    }

    this.emit('contentImported', data);
    console.log(`📝 Content imported by user ${userId}`);
  }

  // Content Versioning
  getContentHistory(id: string): ContentBlock[] {
    // In a real implementation, this would query a version history table
    const current = this.contentBlocks.get(id);
    return current ? [current] : [];
  }

  async revertContent(id: string, version: number, userId: string): Promise<ContentBlock> {
    // In a real implementation, this would restore from version history
    const content = this.contentBlocks.get(id);
    if (!content) {
      throw new Error(`Content ${id} not found`);
    }

    const reverted: ContentBlock = {
      ...content,
      lastModified: new Date(),
      modifiedBy: userId,
      version: content.version + 1
    };

    this.contentBlocks.set(id, reverted);
    this.emit('contentReverted', reverted);
    
    console.log(`📝 Content reverted: ${id} to version ${version} by user ${userId}`);
    return reverted;
  }

  // Search and Filtering
  searchContent(query: string): ContentBlock[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.contentBlocks.values()).filter(content =>
      content.title.toLowerCase().includes(lowercaseQuery) ||
      content.key.toLowerCase().includes(lowercaseQuery) ||
      JSON.stringify(content.content).toLowerCase().includes(lowercaseQuery)
    );
  }

  getContentByCategory(category: string): ContentBlock[] {
    return Array.from(this.contentBlocks.values()).filter(content =>
      content.metadata.category === category
    );
  }

  // Validation
  validateContent(content: ContentBlock): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!content.title || content.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!content.key || content.key.trim() === '') {
      errors.push('Key is required');
    }

    if (content.metadata.required && (!content.content || content.content === '')) {
      errors.push('Content is required for this block');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Status and Statistics
  getSystemStatus(): {
    initialized: boolean;
    totalContent: number;
    totalAIConfigs: number;
    totalPlatformConfigs: number;
    lastActivity: Date | null;
  } {
    return {
      initialized: this.isInitialized,
      totalContent: this.contentBlocks.size,
      totalAIConfigs: this.aiConfigurations.size,
      totalPlatformConfigs: this.platformConfigs.size,
      lastActivity: new Date() // In real implementation, track actual last activity
    };
  }
}

export const contentManager = new ContentManager();