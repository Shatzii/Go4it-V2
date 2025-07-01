/**
 * AI Voice Agent System for Shatzii Customer Service
 * Advanced animated phone call voice agent with natural conversation capabilities
 */

import { EventEmitter } from 'events';

export interface VoiceAgentConfig {
  agentId: string;
  name: string;
  voice: {
    language: 'en-US' | 'en-UK' | 'es-ES' | 'fr-FR' | 'de-DE';
    gender: 'male' | 'female' | 'neutral';
    speed: number; // 0.5 to 2.0
    pitch: number; // 0.5 to 2.0
    tone: 'professional' | 'friendly' | 'empathetic' | 'enthusiastic';
  };
  personality: {
    greeting: string;
    conversationStyle: 'formal' | 'casual' | 'consultative';
    expertise: string[];
    defaultResponses: Record<string, string>;
  };
  capabilities: {
    speechToText: boolean;
    textToSpeech: boolean;
    realTimeTranscription: boolean;
    emotionDetection: boolean;
    sentimentAnalysis: boolean;
    languageDetection: boolean;
  };
}

export interface CallSession {
  sessionId: string;
  phoneNumber?: string;
  customerName?: string;
  company?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'connecting' | 'active' | 'hold' | 'transferring' | 'completed' | 'failed';
  transcript: ConversationTurn[];
  summary: string;
  actionItems: string[];
  followUpRequired: boolean;
  leadQuality: 'hot' | 'warm' | 'cold' | 'not_qualified';
  customerSentiment: 'positive' | 'neutral' | 'negative' | 'frustrated';
  outcome: 'demo_scheduled' | 'follow_up_needed' | 'not_interested' | 'technical_questions' | 'pricing_inquiry';
}

export interface ConversationTurn {
  id: string;
  timestamp: Date;
  speaker: 'agent' | 'customer';
  text: string;
  audioUrl?: string;
  confidence: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  intent?: string;
  entities?: Record<string, string>;
}

export class VoiceAgentSystem extends EventEmitter {
  private agents: Map<string, VoiceAgentConfig> = new Map();
  private activeCalls: Map<string, CallSession> = new Map();
  private callHistory: CallSession[] = [];
  private isSystemActive = false;

  constructor() {
    super();
    this.initializeVoiceAgents();
  }

  private initializeVoiceAgents() {
    // Primary Shatzii Customer Service Agent
    const primaryAgent: VoiceAgentConfig = {
      agentId: 'shatzii-primary-agent',
      name: 'Sarah',
      voice: {
        language: 'en-US',
        gender: 'female',
        speed: 1.0,
        pitch: 1.1,
        tone: 'professional'
      },
      personality: {
        greeting: "Hello! This is Sarah from Shatzii AI. I'm here to help you understand how our AI automation solutions can transform your business operations. How can I assist you today?",
        conversationStyle: 'consultative',
        expertise: [
          'AI automation solutions',
          'Business process optimization',
          'ROI analysis and case studies',
          'Technical implementation planning',
          'Enterprise integration',
          'Custom AI development'
        ],
        defaultResponses: {
          pricing: "I'd be happy to discuss our pricing options. Our AI automation solutions are typically priced based on the complexity and scale of your operations. Let me understand your specific needs so I can provide accurate pricing information.",
          demo: "Absolutely! I can schedule a personalized demo where we'll show you exactly how Shatzii AI can automate your specific business processes. When would be a good time for a 30-minute demonstration?",
          technical: "Great question! Our platform uses self-hosted AI models including Llama 3.1, Mistral, and our proprietary Shatzii models. Everything runs on your infrastructure for complete data privacy and control. Would you like me to connect you with our technical team for a deeper dive?",
          roi: "Our clients typically see ROI within 3-6 months. For example, one of our manufacturing clients reduced their processing time by 75% and saved $2.3M annually. I can share specific case studies relevant to your industry.",
          implementation: "Implementation typically takes 4-8 weeks depending on complexity. We handle everything from setup to training your team. Our success rate is 98% with full customer satisfaction guarantee."
        }
      },
      capabilities: {
        speechToText: true,
        textToSpeech: true,
        realTimeTranscription: true,
        emotionDetection: true,
        sentimentAnalysis: true,
        languageDetection: true
      }
    };

    // Technical Specialist Agent
    const technicalAgent: VoiceAgentConfig = {
      agentId: 'shatzii-technical-agent',
      name: 'Alex',
      voice: {
        language: 'en-US',
        gender: 'male',
        speed: 0.9,
        pitch: 0.9,
        tone: 'professional'
      },
      personality: {
        greeting: "Hi, I'm Alex, Shatzii's Technical Specialist. I can dive deep into the technical aspects of our AI platform, architecture, security, and integration capabilities. What technical questions can I answer for you?",
        conversationStyle: 'formal',
        expertise: [
          'Technical architecture',
          'API integrations',
          'Security and compliance',
          'Self-hosted AI models',
          'Database design',
          'Performance optimization',
          'Custom development'
        ],
        defaultResponses: {
          architecture: "Our platform uses a microservices architecture with self-hosted AI models, PostgreSQL database, Redis caching, and Nginx load balancing. Everything is containerized with Docker for easy deployment.",
          security: "We implement end-to-end encryption, role-based access control, and complete data isolation. Your data never leaves your infrastructure, ensuring maximum security and compliance.",
          integration: "We provide RESTful APIs, webhooks, and direct database connections. We support integration with Salesforce, HubSpot, Slack, Microsoft 365, and over 200 other platforms.",
          scalability: "Our platform scales horizontally and can handle millions of operations. We've deployed solutions processing 10M+ transactions daily with sub-second response times.",
          deployment: "We support cloud deployment on AWS, Azure, GCP, or on-premises installation. The deployment is fully automated with zero-downtime updates."
        }
      },
      capabilities: {
        speechToText: true,
        textToSpeech: true,
        realTimeTranscription: true,
        emotionDetection: true,
        sentimentAnalysis: true,
        languageDetection: true
      }
    };

    // Sales Specialist Agent
    const salesAgent: VoiceAgentConfig = {
      agentId: 'shatzii-sales-agent',
      name: 'Michael',
      voice: {
        language: 'en-US',
        gender: 'male',
        speed: 1.1,
        pitch: 1.0,
        tone: 'enthusiastic'
      },
      personality: {
        greeting: "Hello! I'm Michael from Shatzii's sales team. I'm excited to discuss how our AI automation platform can drive significant ROI for your organization. Let's explore the possibilities together!",
        conversationStyle: 'friendly',
        expertise: [
          'ROI analysis',
          'Business case development',
          'Industry solutions',
          'Competitive analysis',
          'Implementation planning',
          'Success stories'
        ],
        defaultResponses: {
          roi: "Based on your industry and company size, I estimate you could see 300-500% ROI within the first year. Let me show you a customized ROI calculator based on your specific use cases.",
          competition: "Unlike other solutions that rely on external APIs, Shatzii is completely self-hosted, giving you full control and eliminating ongoing API costs. We're typically 60-80% more cost-effective long-term.",
          case_studies: "I have several relevant case studies I can share. For example, a similar company in your industry automated 85% of their customer service operations and reduced costs by $1.8M annually.",
          timeline: "We can have you up and running with initial automation in 2-3 weeks, with full implementation typically completed within 6-8 weeks. I can create a detailed timeline for your specific requirements.",
          next_steps: "I'd recommend we schedule a technical deep-dive demo where you can see the platform in action with your actual data. We can also start a pilot program with a small use case to demonstrate immediate value."
        }
      },
      capabilities: {
        speechToText: true,
        textToSpeech: true,
        realTimeTranscription: true,
        emotionDetection: true,
        sentimentAnalysis: true,
        languageDetection: true
      }
    };

    this.agents.set(primaryAgent.agentId, primaryAgent);
    this.agents.set(technicalAgent.agentId, technicalAgent);
    this.agents.set(salesAgent.agentId, salesAgent);

    console.log('🎙️ Voice Agent System initialized with 3 specialized agents');
  }

  async startVoiceSystem(): Promise<void> {
    this.isSystemActive = true;
    console.log('🎙️ Shatzii Voice Agent System activated - Ready for customer calls');
    this.emit('systemStarted');
  }

  async initiateCall(
    agentId: string,
    customerInfo: {
      phoneNumber?: string;
      name?: string;
      company?: string;
      context?: string;
    }
  ): Promise<string> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    const sessionId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: CallSession = {
      sessionId,
      phoneNumber: customerInfo.phoneNumber,
      customerName: customerInfo.name,
      company: customerInfo.company,
      startTime: new Date(),
      status: 'connecting',
      transcript: [],
      summary: '',
      actionItems: [],
      followUpRequired: false,
      leadQuality: 'cold',
      customerSentiment: 'neutral',
      outcome: 'follow_up_needed'
    };

    this.activeCalls.set(sessionId, session);

    // Simulate call connection and agent greeting
    setTimeout(() => {
      this.updateCallStatus(sessionId, 'active');
      this.addConversationTurn(sessionId, {
        speaker: 'agent',
        text: agent.personality.greeting,
        confidence: 1.0,
        sentiment: 'positive',
        intent: 'greeting'
      });
    }, 2000);

    console.log(`📞 Call initiated: ${sessionId} with agent ${agent.name}`);
    this.emit('callStarted', { sessionId, agentId, customerInfo });

    return sessionId;
  }

  async processCustomerSpeech(
    sessionId: string,
    audioData: string | ArrayBuffer,
    options?: {
      language?: string;
      realTime?: boolean;
    }
  ): Promise<ConversationTurn> {
    const session = this.activeCalls.get(sessionId);
    if (!session) {
      throw new Error(`Call session ${sessionId} not found`);
    }

    // Simulate speech-to-text processing
    const transcribedText = this.simulateSpeechToText(audioData);
    
    const customerTurn: ConversationTurn = {
      id: `turn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      speaker: 'customer',
      text: transcribedText,
      confidence: 0.95,
      sentiment: this.analyzeSentiment(transcribedText),
      intent: this.detectIntent(transcribedText),
      entities: this.extractEntities(transcribedText)
    };

    this.addConversationTurn(sessionId, customerTurn);

    // Generate AI agent response
    const agentResponse = await this.generateAgentResponse(sessionId, transcribedText);
    this.addConversationTurn(sessionId, agentResponse);

    this.emit('conversationTurn', { sessionId, customerTurn, agentResponse });

    return customerTurn;
  }

  private simulateSpeechToText(audioData: string | ArrayBuffer): string {
    // Simulate various customer inquiries
    const sampleQueries = [
      "Hi, I'm interested in learning more about your AI automation platform",
      "Can you tell me about pricing for enterprise solutions?",
      "How does your platform integrate with existing systems?",
      "What kind of ROI can we expect from implementing Shatzii?",
      "I'd like to schedule a demo for our technical team",
      "How secure is your platform for sensitive business data?",
      "What's the implementation timeline for a company our size?",
      "Can you share some case studies from similar companies?",
      "What makes Shatzii different from other AI platforms?",
      "Do you offer custom development services?"
    ];

    return sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveKeywords = ['interested', 'excited', 'great', 'excellent', 'love', 'perfect', 'amazing'];
    const negativeKeywords = ['concerned', 'worried', 'expensive', 'complicated', 'difficult', 'problem'];

    const lowerText = text.toLowerCase();
    
    if (positiveKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'positive';
    } else if (negativeKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'negative';
    }
    
    return 'neutral';
  }

  private detectIntent(text: string): string {
    const intentPatterns = {
      pricing: ['price', 'cost', 'pricing', 'expensive', 'budget', 'fee'],
      demo: ['demo', 'demonstration', 'show', 'see', 'example', 'trial'],
      technical: ['integrate', 'api', 'technical', 'architecture', 'security', 'deployment'],
      roi: ['roi', 'return', 'investment', 'savings', 'value', 'benefit'],
      case_studies: ['case study', 'example', 'customer', 'success', 'similar company'],
      timeline: ['timeline', 'implementation', 'how long', 'when', 'time']
    };

    const lowerText = text.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(intentPatterns)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general_inquiry';
  }

  private extractEntities(text: string): Record<string, string> {
    const entities: Record<string, string> = {};
    
    // Extract company size
    const sizePattern = /(\d+)\s*(employee|people|person|staff)/i;
    const sizeMatch = text.match(sizePattern);
    if (sizeMatch) {
      entities.company_size = sizeMatch[1];
    }
    
    // Extract industry mentions
    const industries = ['healthcare', 'finance', 'retail', 'manufacturing', 'technology', 'education'];
    industries.forEach(industry => {
      if (text.toLowerCase().includes(industry)) {
        entities.industry = industry;
      }
    });
    
    return entities;
  }

  private async generateAgentResponse(sessionId: string, customerText: string): Promise<ConversationTurn> {
    const session = this.activeCalls.get(sessionId)!;
    const agent = Array.from(this.agents.values())[0]; // Use primary agent for now
    
    const intent = this.detectIntent(customerText);
    const sentiment = this.analyzeSentiment(customerText);
    
    let responseText = agent.personality.defaultResponses[intent] || 
                      "That's a great question. Let me provide you with detailed information about that. Our AI platform is designed to streamline and automate complex business processes, and I'd love to show you how it can specifically benefit your organization.";
    
    // Adjust response based on sentiment
    if (sentiment === 'negative') {
      responseText = "I understand your concerns. " + responseText + " Let me address any specific worries you might have.";
    } else if (sentiment === 'positive') {
      responseText = "I'm glad to hear your interest! " + responseText + " I think you'll be impressed with what we can accomplish together.";
    }

    const agentTurn: ConversationTurn = {
      id: `turn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      speaker: 'agent',
      text: responseText,
      confidence: 1.0,
      sentiment: 'positive',
      intent: `response_to_${intent}`
    };

    // Update session with intelligence
    this.updateSessionIntelligence(sessionId, customerText, intent, sentiment);

    return agentTurn;
  }

  private updateSessionIntelligence(sessionId: string, customerText: string, intent: string, sentiment: 'positive' | 'neutral' | 'negative') {
    const session = this.activeCalls.get(sessionId)!;
    
    // Update lead quality based on conversation
    if (intent === 'pricing' || intent === 'demo') {
      session.leadQuality = 'hot';
    } else if (intent === 'roi' || intent === 'case_studies') {
      session.leadQuality = 'warm';
    }
    
    // Update customer sentiment
    session.customerSentiment = sentiment;
    
    // Determine outcome
    if (intent === 'demo') {
      session.outcome = 'demo_scheduled';
      session.followUpRequired = true;
      session.actionItems.push('Schedule technical demo');
    } else if (intent === 'pricing') {
      session.outcome = 'pricing_inquiry';
      session.followUpRequired = true;
      session.actionItems.push('Send detailed pricing proposal');
    } else if (intent === 'technical') {
      session.outcome = 'technical_questions';
      session.followUpRequired = true;
      session.actionItems.push('Connect with technical specialist');
    }
  }

  private addConversationTurn(sessionId: string, turn: Omit<ConversationTurn, 'id' | 'timestamp'>) {
    const session = this.activeCalls.get(sessionId);
    if (!session) return;

    const fullTurn: ConversationTurn = {
      id: `turn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...turn
    };

    session.transcript.push(fullTurn);
    this.activeCalls.set(sessionId, session);
  }

  private updateCallStatus(sessionId: string, status: CallSession['status']) {
    const session = this.activeCalls.get(sessionId);
    if (!session) return;

    session.status = status;
    this.activeCalls.set(sessionId, session);
    
    if (status === 'completed') {
      session.endTime = new Date();
      session.duration = session.endTime.getTime() - session.startTime.getTime();
      session.summary = this.generateCallSummary(session);
      
      this.callHistory.push(session);
      this.activeCalls.delete(sessionId);
    }

    this.emit('callStatusChanged', { sessionId, status });
  }

  private generateCallSummary(session: CallSession): string {
    const turns = session.transcript.length;
    const duration = session.duration ? Math.round(session.duration / 1000 / 60) : 0;
    
    return `Call with ${session.customerName || 'prospect'} from ${session.company || 'unknown company'} lasted ${duration} minutes with ${turns} conversation turns. Lead quality: ${session.leadQuality}. Customer sentiment: ${session.customerSentiment}. Outcome: ${session.outcome}. Follow-up required: ${session.followUpRequired}.`;
  }

  async endCall(sessionId: string): Promise<CallSession> {
    const session = this.activeCalls.get(sessionId);
    if (!session) {
      throw new Error(`Call session ${sessionId} not found`);
    }

    this.updateCallStatus(sessionId, 'completed');
    
    console.log(`📞 Call completed: ${sessionId}`);
    this.emit('callEnded', { sessionId, session });

    return session;
  }

  getActiveCall(sessionId: string): CallSession | undefined {
    return this.activeCalls.get(sessionId);
  }

  getActiveCalls(): CallSession[] {
    return Array.from(this.activeCalls.values());
  }

  getCallHistory(): CallSession[] {
    return this.callHistory;
  }

  getAgents(): VoiceAgentConfig[] {
    return Array.from(this.agents.values());
  }

  async transferCall(sessionId: string, targetAgentId: string): Promise<void> {
    const session = this.activeCalls.get(sessionId);
    const targetAgent = this.agents.get(targetAgentId);
    
    if (!session || !targetAgent) {
      throw new Error('Invalid session or agent');
    }

    this.updateCallStatus(sessionId, 'transferring');
    
    // Add transfer message
    this.addConversationTurn(sessionId, {
      speaker: 'agent',
      text: `I'm transferring you to ${targetAgent.name}, our ${targetAgent.personality.expertise[0]} specialist. They'll be able to provide you with more detailed information.`,
      confidence: 1.0,
      sentiment: 'positive',
      intent: 'transfer'
    });

    setTimeout(() => {
      this.updateCallStatus(sessionId, 'active');
      this.addConversationTurn(sessionId, {
        speaker: 'agent',
        text: targetAgent.personality.greeting,
        confidence: 1.0,
        sentiment: 'positive',
        intent: 'greeting'
      });
    }, 3000);

    this.emit('callTransferred', { sessionId, targetAgentId });
  }
}

export const voiceAgentSystem = new VoiceAgentSystem();