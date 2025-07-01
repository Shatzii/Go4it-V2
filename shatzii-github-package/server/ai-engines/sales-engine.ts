/**
 * Sales Engine - Autonomous Sales Operations
 * Manages deals, prospects, and sales agent activities
 */

import { EventEmitter } from 'events';

interface Deal {
  id: string;
  company: string;
  contact: string;
  email: string;
  value: number;
  stage: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  source: string;
  assignedAgent: string;
  createdAt: Date;
  lastActivity: Date;
  notes: string[];
}

interface SalesAgent {
  id: string;
  name: string;
  specialization: string;
  status: 'active' | 'busy' | 'offline';
  performance: {
    dealsWon: number;
    totalRevenue: number;
    conversionRate: number;
    activitiesThisWeek: number;
  };
  assignedDeals: string[];
}

interface SalesActivity {
  id: string;
  dealId: string;
  agentId: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'follow-up';
  description: string;
  outcome: string;
  nextAction?: string;
  scheduledFor?: Date;
  completedAt: Date;
}

export class SalesEngine extends EventEmitter {
  private deals: Map<string, Deal> = new Map();
  private agents: Map<string, SalesAgent> = new Map();
  private activities: Map<string, SalesActivity> = new Map();
  private isRunning = false;
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initializeWithSeedData();
  }

  private initializeWithSeedData() {
    // Initialize sales agents
    const salesAgents: SalesAgent[] = [
      {
        id: 'agent-001',
        name: 'Alex Rodriguez',
        specialization: 'Enterprise Sales',
        status: 'active',
        performance: {
          dealsWon: 12,
          totalRevenue: 450000,
          conversionRate: 0.65,
          activitiesThisWeek: 28
        },
        assignedDeals: []
      },
      {
        id: 'agent-002',
        name: 'Sarah Mitchell',
        specialization: 'SMB Sales',
        status: 'active',
        performance: {
          dealsWon: 18,
          totalRevenue: 180000,
          conversionRate: 0.58,
          activitiesThisWeek: 35
        },
        assignedDeals: []
      },
      {
        id: 'agent-003',
        name: 'Michael Chen',
        specialization: 'Technical Sales',
        status: 'active',
        performance: {
          dealsWon: 8,
          totalRevenue: 320000,
          conversionRate: 0.72,
          activitiesThisWeek: 22
        },
        assignedDeals: []
      }
    ];

    salesAgents.forEach(agent => this.agents.set(agent.id, agent));

    // Initialize sample deals
    const sampleDeals: Deal[] = [
      {
        id: 'deal-001',
        company: 'TechCorp Solutions',
        contact: 'Jennifer Walsh',
        email: 'j.walsh@techcorp.com',
        value: 85000,
        stage: 'proposal',
        probability: 0.75,
        source: 'Marketing Lead',
        assignedAgent: 'agent-001',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notes: ['Initial demo completed', 'Technical requirements gathered', 'Proposal sent']
      },
      {
        id: 'deal-002',
        company: 'Growth Industries',
        contact: 'David Kim',
        email: 'd.kim@growthindustries.com',
        value: 45000,
        stage: 'negotiation',
        probability: 0.60,
        source: 'Cold Outreach',
        assignedAgent: 'agent-002',
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: ['Price negotiation in progress', 'Decision maker identified']
      },
      {
        id: 'deal-003',
        company: 'Innovation Labs',
        contact: 'Lisa Thompson',
        email: 'l.thompson@innovationlabs.com',
        value: 120000,
        stage: 'qualified',
        probability: 0.45,
        source: 'Referral',
        assignedAgent: 'agent-003',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
        notes: ['Technical evaluation scheduled', 'Budget confirmed']
      }
    ];

    sampleDeals.forEach(deal => {
      this.deals.set(deal.id, deal);
      const agent = this.agents.get(deal.assignedAgent);
      if (agent) {
        agent.assignedDeals.push(deal.id);
      }
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('Sales Engine started - beginning autonomous sales operations');

    // Start automated sales processes
    this.processingInterval = setInterval(() => {
      this.processDeals();
      this.updateAgentActivities();
      this.generateSalesActivities();
    }, 30000); // Every 30 seconds

    this.emit('started');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }

    console.log('Sales Engine stopped');
    this.emit('stopped');
  }

  private processDeals(): void {
    this.deals.forEach(deal => {
      // Simulate deal progression
      const daysSinceActivity = Math.floor((Date.now() - deal.lastActivity.getTime()) / (24 * 60 * 60 * 1000));
      
      if (daysSinceActivity > 7 && Math.random() > 0.7) {
        this.advanceDealStage(deal);
      }
      
      // Update probability based on stage and time
      if (deal.stage === 'proposal' && daysSinceActivity > 5) {
        deal.probability = Math.max(0.2, deal.probability - 0.1);
      }
    });
  }

  private advanceDealStage(deal: Deal): void {
    const stageProgression = {
      'prospect': 'qualified',
      'qualified': 'proposal',
      'proposal': 'negotiation',
      'negotiation': Math.random() > 0.3 ? 'closed-won' : 'closed-lost'
    } as const;

    const newStage = stageProgression[deal.stage as keyof typeof stageProgression];
    if (newStage) {
      deal.stage = newStage as Deal['stage'];
      deal.lastActivity = new Date();
      
      if (newStage === 'closed-won') {
        this.emit('dealWon', deal);
        const agent = this.agents.get(deal.assignedAgent);
        if (agent) {
          agent.performance.dealsWon++;
          agent.performance.totalRevenue += deal.value;
        }
      }
    }
  }

  private updateAgentActivities(): void {
    this.agents.forEach(agent => {
      // Simulate agent activities
      if (agent.status === 'active' && Math.random() > 0.6) {
        agent.performance.activitiesThisWeek += Math.floor(Math.random() * 3) + 1;
        
        // Assign new deals if available
        const unassignedDeals = Array.from(this.deals.values())
          .filter(deal => !deal.assignedAgent || deal.assignedAgent === '');
        
        if (unassignedDeals.length > 0 && agent.assignedDeals.length < 5) {
          const deal = unassignedDeals[0];
          deal.assignedAgent = agent.id;
          agent.assignedDeals.push(deal.id);
        }
      }
    });
  }

  private generateSalesActivities(): void {
    // Create new sales activities
    this.deals.forEach(deal => {
      if (Math.random() > 0.8) {
        const activity: SalesActivity = {
          id: this.generateId(),
          dealId: deal.id,
          agentId: deal.assignedAgent,
          type: this.getRandomActivityType(),
          description: this.generateActivityDescription(deal),
          outcome: 'Positive engagement',
          completedAt: new Date()
        };

        this.activities.set(activity.id, activity);
        deal.lastActivity = new Date();
        this.emit('activityCreated', activity);
      }
    });
  }

  private getRandomActivityType(): SalesActivity['type'] {
    const types: SalesActivity['type'][] = ['call', 'email', 'meeting', 'demo', 'proposal', 'follow-up'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private generateActivityDescription(deal: Deal): string {
    const descriptions = [
      `Follow-up call with ${deal.contact} at ${deal.company}`,
      `Technical demo scheduled for ${deal.company}`,
      `Proposal review meeting with ${deal.contact}`,
      `Contract negotiation with ${deal.company}`,
      `ROI analysis presentation for ${deal.company}`,
      `Implementation timeline discussion with ${deal.contact}`
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private generateId(): string {
    return 'act_' + Math.random().toString(36).substr(2, 9);
  }

  async createDeal(dealData: Partial<Deal>): Promise<string> {
    const id = 'deal_' + Math.random().toString(36).substr(2, 9);
    const deal: Deal = {
      id,
      company: dealData.company || 'Unknown Company',
      contact: dealData.contact || 'Unknown Contact',
      email: dealData.email || '',
      value: dealData.value || 0,
      stage: 'prospect',
      probability: 0.2,
      source: dealData.source || 'Manual',
      assignedAgent: this.findAvailableAgent(),
      createdAt: new Date(),
      lastActivity: new Date(),
      notes: []
    };

    this.deals.set(id, deal);
    this.emit('dealCreated', deal);
    return id;
  }

  private findAvailableAgent(): string {
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => agent.status === 'active')
      .sort((a, b) => a.assignedDeals.length - b.assignedDeals.length);
    
    return availableAgents[0]?.id || 'agent-001';
  }

  getDeals(): Deal[] {
    return Array.from(this.deals.values());
  }

  getAgents(): SalesAgent[] {
    return Array.from(this.agents.values());
  }

  getActivities(): SalesActivity[] {
    return Array.from(this.activities.values());
  }

  getMetrics() {
    const deals = this.getDeals();
    const totalPipeline = deals.reduce((sum, deal) => sum + deal.value, 0);
    const wonDeals = deals.filter(deal => deal.stage === 'closed-won');
    const avgDealSize = wonDeals.length > 0 ? wonDeals.reduce((sum, deal) => sum + deal.value, 0) / wonDeals.length : 0;

    return {
      totalPipeline,
      dealsWon: wonDeals.length,
      revenue: wonDeals.reduce((sum, deal) => sum + deal.value, 0),
      avgDealSize,
      conversionRate: deals.length > 0 ? wonDeals.length / deals.length : 0,
      activitiesLastWeek: this.getActivities().filter(activity => 
        activity.completedAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length
    };
  }
}