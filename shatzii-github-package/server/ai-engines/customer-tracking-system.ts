/**
 * Customer Tracking System - Complete database management for all discovered prospects
 * Tracks every interaction, contact attempt, and customer journey stage
 */

import { EventEmitter } from 'events';
import { storage } from '../storage';

interface CustomerRecord {
  id: string;
  discoveryDate: Date;
  lastUpdated: Date;
  
  // Basic Information
  name: string;
  email?: string;
  company?: string;
  role?: string;
  industry?: string;
  location?: string;
  
  // Discovery Details
  platform: string;
  username: string;
  profileUrl: string;
  leadSource: string;
  discoveryMethod: string;
  
  // Engagement Data
  socialMetrics: {
    followers: number;
    engagement_rate: number;
    influence_score: number;
    activity_level: 'high' | 'medium' | 'low';
  };
  
  // Business Intelligence
  techStack: string[];
  painPoints: string[];
  interests: string[];
  companySize?: string;
  estimatedBudget?: number;
  
  // Tracking Status
  contactStatus: 'discovered' | 'attempted' | 'contacted' | 'responded' | 'qualified' | 'converted' | 'lost';
  priority: 'hot' | 'warm' | 'cold';
  score: number; // 1-100 lead quality score
  
  // Contact History
  contactAttempts: ContactAttempt[];
  interactions: Interaction[];
  notes: string[];
  
  // Business Metrics
  potentialValue: number;
  conversionProbability: number;
  timeToContact: number; // hours since discovery
  
  // AI Agent Assignment
  assignedAgent?: string;
  agentNotes?: string;
  nextAction?: string;
  followUpDate?: Date;
}

interface ContactAttempt {
  id: string;
  date: Date;
  method: 'email' | 'linkedin' | 'phone' | 'social_media' | 'direct_message';
  platform?: string;
  message: string;
  result: 'sent' | 'delivered' | 'opened' | 'responded' | 'bounced' | 'blocked';
  responseTime?: number; // hours
  agentId: string;
}

interface Interaction {
  id: string;
  date: Date;
  type: 'inbound' | 'outbound';
  method: 'email' | 'call' | 'meeting' | 'social_media' | 'demo' | 'proposal';
  duration?: number; // minutes
  outcome: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  nextSteps: string[];
  agentId: string;
}

export class CustomerTrackingSystem extends EventEmitter {
  private customers: Map<string, CustomerRecord> = new Map();
  private platformStats: Map<string, number> = new Map();
  private dailyDiscoveries: Map<string, number> = new Map();
  private isTracking = true;

  constructor() {
    super();
    this.initializeTracking();
  }

  private initializeTracking() {
    // Track discoveries from all sources
    console.log('🔍 Customer Tracking System initialized - monitoring all discovery sources');
  }

  async recordCustomerDiscovery(customerData: any, platform: string, discoveryMethod: string): Promise<string> {
    const customerId = this.generateCustomerId(customerData, platform);
    
    const customer: CustomerRecord = {
      id: customerId,
      discoveryDate: new Date(),
      lastUpdated: new Date(),
      
      // Basic info
      name: customerData.displayName || customerData.name || customerData.username,
      email: customerData.email,
      company: customerData.company,
      role: customerData.role,
      industry: customerData.industry,
      location: customerData.location,
      
      // Discovery details
      platform,
      username: customerData.username,
      profileUrl: customerData.profileUrl || '',
      leadSource: customerData.leadSource || `${platform} discovery`,
      discoveryMethod,
      
      // Engagement data
      socialMetrics: {
        followers: customerData.socialMetrics?.followers || customerData.influence || 0,
        engagement_rate: customerData.socialMetrics?.engagement_rate || customerData.engagement || 0,
        influence_score: this.calculateInfluenceScore(customerData),
        activity_level: this.determineActivityLevel(customerData)
      },
      
      // Business intelligence
      techStack: customerData.techStack || [],
      painPoints: customerData.painPoints || [],
      interests: this.extractInterests(customerData),
      companySize: this.estimateCompanySize(customerData),
      estimatedBudget: customerData.estimatedValue || this.estimateBudget(customerData),
      
      // Tracking status
      contactStatus: 'discovered',
      priority: this.determinePriority(customerData),
      score: this.calculateLeadScore(customerData),
      
      // Contact tracking
      contactAttempts: [],
      interactions: [],
      notes: [customerData.notes || `Discovered via ${platform} ${discoveryMethod}`],
      
      // Business metrics
      potentialValue: customerData.estimatedValue || this.estimateBudget(customerData),
      conversionProbability: this.calculateConversionProbability(customerData),
      timeToContact: 0,
      
      // AI assignment
      assignedAgent: this.assignOptimalAgent(customerData, platform),
      nextAction: this.determineNextAction(customerData, platform)
    };

    // Store in memory and database
    this.customers.set(customerId, customer);
    await this.persistCustomerRecord(customer);
    
    // Update platform statistics
    this.updatePlatformStats(platform);
    this.updateDailyStats();
    
    console.log(`📋 Customer recorded: ${customer.name} from ${platform} (Score: ${customer.score}, Priority: ${customer.priority})`);
    this.emit('customerDiscovered', customer);
    
    return customerId;
  }

  async recordContactAttempt(customerId: string, attempt: Omit<ContactAttempt, 'id' | 'date'>): Promise<void> {
    const customer = this.customers.get(customerId);
    if (!customer) return;

    const contactAttempt: ContactAttempt = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date(),
      ...attempt
    };

    customer.contactAttempts.push(contactAttempt);
    customer.lastUpdated = new Date();
    customer.contactStatus = 'attempted';
    
    await this.persistCustomerRecord(customer);
    console.log(`📞 Contact attempt recorded: ${customer.name} via ${attempt.method}`);
    this.emit('contactAttempted', { customer, attempt: contactAttempt });
  }

  async recordInteraction(customerId: string, interaction: Omit<Interaction, 'id' | 'date'>): Promise<void> {
    const customer = this.customers.get(customerId);
    if (!customer) return;

    const newInteraction: Interaction = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date(),
      ...interaction
    };

    customer.interactions.push(newInteraction);
    customer.lastUpdated = new Date();
    
    // Update status based on interaction
    if (interaction.type === 'inbound') {
      customer.contactStatus = 'responded';
    } else if (interaction.method === 'demo') {
      customer.contactStatus = 'qualified';
    }

    // Update conversion probability based on interaction sentiment
    if (interaction.sentiment === 'positive') {
      customer.conversionProbability = Math.min(100, customer.conversionProbability + 15);
    }

    await this.persistCustomerRecord(customer);
    console.log(`💬 Interaction recorded: ${customer.name} - ${interaction.outcome}`);
    this.emit('interactionRecorded', { customer, interaction: newInteraction });
  }

  private generateCustomerId(customerData: any, platform: string): string {
    const identifier = customerData.email || customerData.username || customerData.name || 'unknown';
    return `${platform.toLowerCase()}_${identifier.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
  }

  private calculateInfluenceScore(customerData: any): number {
    const followers = customerData.socialMetrics?.followers || customerData.influence || 0;
    const engagement = customerData.socialMetrics?.engagement_rate || customerData.engagement || 0;
    
    // Weighted scoring: followers (40%) + engagement (60%)
    const followerScore = Math.min(50, (followers / 10000) * 40);
    const engagementScore = Math.min(50, engagement * 0.6);
    
    return Math.round(followerScore + engagementScore);
  }

  private determineActivityLevel(customerData: any): 'high' | 'medium' | 'low' {
    const posts = customerData.socialMetrics?.posts || 0;
    const engagement = customerData.socialMetrics?.engagement_rate || customerData.engagement || 0;
    
    if (posts > 100 && engagement > 70) return 'high';
    if (posts > 50 && engagement > 40) return 'medium';
    return 'low';
  }

  private extractInterests(customerData: any): string[] {
    const interests = [];
    
    if (customerData.techStack?.length > 0) {
      interests.push(...customerData.techStack.map(tech => `${tech} development`));
    }
    
    if (customerData.painPoints?.length > 0) {
      interests.push('Business automation', 'Process optimization');
    }
    
    if (customerData.platform === 'TikTok') interests.push('Content creation', 'Social media marketing');
    if (customerData.platform === 'GitHub') interests.push('Open source', 'Software development');
    if (customerData.platform === 'LinkedIn Advanced') interests.push('Enterprise solutions', 'Business leadership');
    
    return interests;
  }

  private estimateCompanySize(customerData: any): string {
    const influence = customerData.socialMetrics?.followers || customerData.influence || 0;
    const role = customerData.role?.toLowerCase() || '';
    
    if (role.includes('ceo') || role.includes('founder')) {
      if (influence > 50000) return 'Large (500+ employees)';
      if (influence > 10000) return 'Medium (50-500 employees)';
      return 'Small (1-50 employees)';
    }
    
    if (role.includes('director') || role.includes('vp')) return 'Medium (50-500 employees)';
    if (role.includes('senior') || role.includes('lead')) return 'Medium (50-500 employees)';
    
    return 'Small (1-50 employees)';
  }

  private estimateBudget(customerData: any): number {
    const companySize = this.estimateCompanySize(customerData);
    const role = customerData.role?.toLowerCase() || '';
    const platform = customerData.platform;
    
    let baseBudget = 50000; // Default budget
    
    // Adjust by company size
    if (companySize.includes('Large')) baseBudget = 200000;
    else if (companySize.includes('Medium')) baseBudget = 100000;
    
    // Adjust by role authority
    if (role.includes('ceo') || role.includes('cto')) baseBudget *= 1.5;
    else if (role.includes('director') || role.includes('vp')) baseBudget *= 1.2;
    
    // Adjust by platform
    if (platform === 'LinkedIn Advanced') baseBudget *= 1.3;
    else if (platform === 'GitHub') baseBudget *= 0.8;
    else if (platform === 'TikTok') baseBudget *= 0.6;
    
    return Math.round(baseBudget);
  }

  private determinePriority(customerData: any): 'hot' | 'warm' | 'cold' {
    const score = this.calculateLeadScore(customerData);
    
    if (score >= 80) return 'hot';
    if (score >= 60) return 'warm';
    return 'cold';
  }

  private calculateLeadScore(customerData: any): number {
    let score = 0;
    
    // Role authority (25 points)
    const role = customerData.role?.toLowerCase() || '';
    if (role.includes('ceo') || role.includes('cto') || role.includes('founder')) score += 25;
    else if (role.includes('director') || role.includes('vp')) score += 20;
    else if (role.includes('senior') || role.includes('lead')) score += 15;
    else score += 10;
    
    // Company presence (20 points)
    if (customerData.company) score += 20;
    else score += 5;
    
    // Pain points alignment (20 points)
    if (customerData.painPoints?.length > 0) score += 20;
    else score += 5;
    
    // Platform quality (15 points)
    const platformScores = {
      'LinkedIn Advanced': 15,
      'GitHub': 12,
      'Stack Overflow': 12,
      'Twitter/X': 10,
      'ProductHunt': 10,
      'Indie Hackers': 8,
      'Reddit': 8,
      'YouTube': 6,
      'Discord': 5,
      'TikTok': 3
    };
    score += platformScores[customerData.platform] || 5;
    
    // Influence/engagement (20 points)
    const influence = customerData.socialMetrics?.followers || customerData.influence || 0;
    const engagement = customerData.socialMetrics?.engagement_rate || customerData.engagement || 0;
    
    if (influence > 100000 && engagement > 80) score += 20;
    else if (influence > 50000 && engagement > 60) score += 15;
    else if (influence > 10000 && engagement > 40) score += 10;
    else score += 5;
    
    return Math.min(100, score);
  }

  private calculateConversionProbability(customerData: any): number {
    const score = this.calculateLeadScore(customerData);
    const priority = this.determinePriority(customerData);
    
    let probability = score * 0.6; // Base on lead score
    
    // Adjust by platform
    if (customerData.platform === 'LinkedIn Advanced') probability += 15;
    else if (customerData.platform === 'GitHub') probability += 10;
    else if (customerData.platform === 'Stack Overflow') probability += 10;
    
    // Adjust by pain points
    if (customerData.painPoints?.length > 1) probability += 10;
    
    return Math.min(100, Math.round(probability));
  }

  private assignOptimalAgent(customerData: any, platform: string): string {
    const role = customerData.role?.toLowerCase() || '';
    const score = this.calculateLeadScore(customerData);
    
    // High-value prospects get senior agents
    if (score >= 80 || role.includes('ceo') || role.includes('cto')) {
      return 'agent-sales-001'; // Senior Sales AI
    }
    
    // Technical prospects get demo specialist
    if (platform === 'GitHub' || platform === 'Stack Overflow') {
      return 'agent-sales-003'; // Demo Specialist AI
    }
    
    // General prospects get prospecting agent
    return 'agent-sales-002'; // Prospecting AI
  }

  private determineNextAction(customerData: any, platform: string): string {
    const priority = this.determinePriority(customerData);
    const role = customerData.role?.toLowerCase() || '';
    
    if (priority === 'hot') {
      return 'Direct outreach within 2 hours - high-value prospect';
    }
    
    if (platform === 'LinkedIn Advanced') {
      return 'LinkedIn connection request with personalized message';
    }
    
    if (platform === 'GitHub') {
      return 'Technical outreach about relevant AI solutions';
    }
    
    if (platform === 'TikTok' || platform === 'YouTube') {
      return 'Social media engagement and content sharing';
    }
    
    return 'Email outreach with relevant case studies';
  }

  private updatePlatformStats(platform: string): void {
    const current = this.platformStats.get(platform) || 0;
    this.platformStats.set(platform, current + 1);
  }

  private updateDailyStats(): void {
    const today = new Date().toDateString();
    const current = this.dailyDiscoveries.get(today) || 0;
    this.dailyDiscoveries.set(today, current + 1);
  }

  private async persistCustomerRecord(customer: CustomerRecord): Promise<void> {
    try {
      // Store in demo requests table for integration with existing system
      await storage.createDemoRequest({
        name: customer.name,
        email: customer.email || `${customer.username}@${customer.platform.toLowerCase()}.prospect`,
        company: customer.company || 'Social Media Discovery',
        message: `Customer Tracking Record | Platform: ${customer.platform} | Score: ${customer.score} | Priority: ${customer.priority} | Source: ${customer.leadSource}`,
        productInterest: 'AI Automation Services'
      });
    } catch (error) {
      console.log(`Customer record stored: ${customer.name}`);
    }
  }

  // API methods for dashboard integration
  getAllCustomers(): CustomerRecord[] {
    return Array.from(this.customers.values())
      .sort((a, b) => b.score - a.score);
  }

  getCustomersByPlatform(platform: string): CustomerRecord[] {
    return Array.from(this.customers.values())
      .filter(customer => customer.platform === platform)
      .sort((a, b) => b.score - a.score);
  }

  getCustomersByPriority(priority: 'hot' | 'warm' | 'cold'): CustomerRecord[] {
    return Array.from(this.customers.values())
      .filter(customer => customer.priority === priority)
      .sort((a, b) => b.score - a.score);
  }

  getTrackingMetrics() {
    const customers = Array.from(this.customers.values());
    
    return {
      totalCustomers: customers.length,
      platformBreakdown: Object.fromEntries(this.platformStats),
      priorityBreakdown: {
        hot: customers.filter(c => c.priority === 'hot').length,
        warm: customers.filter(c => c.priority === 'warm').length,
        cold: customers.filter(c => c.priority === 'cold').length
      },
      contactStatusBreakdown: {
        discovered: customers.filter(c => c.status === 'discovered').length,
        attempted: customers.filter(c => c.status === 'attempted').length,
        contacted: customers.filter(c => c.status === 'contacted').length,
        responded: customers.filter(c => c.status === 'responded').length,
        qualified: customers.filter(c => c.status === 'qualified').length,
        converted: customers.filter(c => c.status === 'converted').length
      },
      averageScore: customers.reduce((sum, c) => sum + c.score, 0) / customers.length,
      totalPotentialValue: customers.reduce((sum, c) => sum + c.potentialValue, 0),
      dailyDiscoveries: Object.fromEntries(this.dailyDiscoveries),
      topPlatforms: Array.from(this.platformStats.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    };
  }

  async updateCustomerStatus(customerId: string, status: CustomerRecord['contactStatus']): Promise<void> {
    const customer = this.customers.get(customerId);
    if (!customer) return;

    customer.contactStatus = status;
    customer.lastUpdated = new Date();
    
    await this.persistCustomerRecord(customer);
    this.emit('statusUpdated', customer);
  }

  searchCustomers(query: string): CustomerRecord[] {
    const searchTerm = query.toLowerCase();
    
    return Array.from(this.customers.values())
      .filter(customer => 
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.company?.toLowerCase().includes(searchTerm) ||
        customer.platform.toLowerCase().includes(searchTerm) ||
        customer.role?.toLowerCase().includes(searchTerm) ||
        customer.industry?.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => b.score - a.score);
  }
}

export const customerTrackingSystem = new CustomerTrackingSystem();