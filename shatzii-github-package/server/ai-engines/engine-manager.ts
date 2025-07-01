import { EventEmitter } from 'events';
import MarketingEngine from './marketing-engine';
import { SalesEngine } from './sales-engine';
import { InvestorAcquisitionAgent } from './investor-acquisition-agent';

export interface EngineMetrics {
  marketing: {
    totalLeads: number;
    activeCampaigns: number;
    conversionRate: number;
    revenue: number;
    leadsToday: number;
  };
  sales: {
    totalPipeline: number;
    dealsWon: number;
    revenue: number;
    avgDealSize: number;
    conversionRate: number;
    activitiesLastWeek: number;
  };
  combined: {
    totalRevenue: number;
    totalLeads: number;
    overallConversionRate: number;
    monthlyGrowth: number;
  };
}

class EngineManagerClass extends EventEmitter {
  private marketingEngine: MarketingEngine;
  private salesEngine: SalesEngine;
  private investorAgent: InvestorAcquisitionAgent;
  private isRunning = false;
  private metricsHistory: EngineMetrics[] = [];

  constructor() {
    super();
    this.marketingEngine = new MarketingEngine();
    this.salesEngine = new SalesEngine();
    this.investorAgent = new InvestorAcquisitionAgent();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Marketing Engine Events
    this.marketingEngine.on('leadGenerated', (lead) => {
      console.log(`New lead generated: ${lead.company}`);
      this.emit('leadGenerated', lead);
      
      // Auto-transfer qualified leads to sales
      if (lead.score > 85) {
        this.transferLeadToSales(lead);
      }
    });

    this.marketingEngine.on('campaignCreated', (campaign) => {
      console.log(`New campaign created: ${campaign.name}`);
      this.emit('campaignCreated', campaign);
    });

    this.marketingEngine.on('contentCreated', (content) => {
      console.log(`Content created: ${content.type} - ${content.topic}`);
      this.emit('contentCreated', content);
    });

    // Sales Engine Events
    this.salesEngine.on('dealCreated', (deal) => {
      console.log(`New deal created: ${deal.company} - $${deal.value.toLocaleString()}`);
      this.emit('dealCreated', deal);
    });

    this.salesEngine.on('dealQualified', (deal) => {
      console.log(`Deal qualified: ${deal.company}`);
      this.emit('dealQualified', deal);
    });

    this.salesEngine.on('dealWon', (deal) => {
      console.log(`Deal won: ${deal.company} - $${deal.value.toLocaleString()}`);
      this.emit('dealWon', deal);
      
      // Trigger marketing to create case study
      this.marketingEngine.generateContent('case-study', `${deal.company} Success Story`);
    });

    this.salesEngine.on('activityCompleted', (activity) => {
      this.emit('activityCompleted', activity);
    });
  }

  private async transferLeadToSales(lead: any) {
    // Convert marketing lead to sales prospect
    const prospect = {
      company: lead.company,
      contact: lead.contact,
      email: lead.email,
      industry: lead.industry,
      source: lead.source
    };

    console.log(`Transferring qualified lead to sales: ${lead.company}`);
    this.emit('leadTransferred', { lead, prospect });
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    console.log('Starting AI Engine Manager - Initializing autonomous business operations');
    
    this.isRunning = true;

    // Start both engines
    await this.marketingEngine.start();
    await this.salesEngine.start();

    // Start metrics collection
    this.startMetricsCollection();

    console.log('All AI engines are now running autonomously');
    this.emit('enginesStarted');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;

    console.log('Stopping AI engines');
    
    await this.marketingEngine.stop();
    await this.salesEngine.stop();
    
    this.isRunning = false;
    console.log('All AI engines stopped');
    this.emit('enginesStopped');
  }

  private startMetricsCollection(): void {
    // Collect metrics every 30 seconds
    setInterval(() => {
      const metrics = this.getMetrics();
      this.metricsHistory.push(metrics);
      
      // Keep only last 100 data points
      if (this.metricsHistory.length > 100) {
        this.metricsHistory.shift();
      }
      
      this.emit('metricsUpdated', metrics);
    }, 30000);
  }

  getMetrics(): EngineMetrics {
    const marketingMetrics = this.marketingEngine.getMetrics();
    const salesMetrics = this.salesEngine.getMetrics();

    const combined = {
      totalRevenue: marketingMetrics.revenue + salesMetrics.revenue,
      totalLeads: marketingMetrics.totalLeads,
      overallConversionRate: (salesMetrics.dealsWon / Math.max(marketingMetrics.totalLeads, 1)) * 100,
      monthlyGrowth: this.calculateMonthlyGrowth()
    };

    return {
      marketing: marketingMetrics,
      sales: salesMetrics,
      combined
    };
  }

  private calculateMonthlyGrowth(): number {
    if (this.metricsHistory.length < 2) return 0;
    
    const current = this.metricsHistory[this.metricsHistory.length - 1];
    const previous = this.metricsHistory[Math.max(0, this.metricsHistory.length - 30)];
    
    if (!previous || previous.combined.totalRevenue === 0) return 0;
    
    return ((current.combined.totalRevenue - previous.combined.totalRevenue) / previous.combined.totalRevenue) * 100;
  }

  // API methods for dashboard integration
  getMarketingLeads() {
    return this.marketingEngine.getLeads();
  }

  getMarketingCampaigns() {
    return this.marketingEngine.getCampaigns();
  }

  getSalesDeals() {
    return this.salesEngine.getDeals();
  }

  getSalesAgents() {
    return this.salesEngine.getAgents();
  }

  getSalesActivities() {
    return this.salesEngine.getActivities();
  }

  getMetricsHistory() {
    return this.metricsHistory;
  }

  async createMarketingCampaign(name: string, type: string, criteria: any) {
    return await this.marketingEngine.createCampaign(name, type as any, criteria);
  }

  async generateContent(type: string, topic: string) {
    return await this.marketingEngine.generateContent(type as any, topic);
  }

  async startProspecting(criteria: any) {
    return await this.salesEngine.createDeal(criteria);
  }

  isEngineRunning(): boolean {
    return this.isRunning;
  }

  getEngineStatus() {
    return {
      running: this.isRunning,
      uptime: this.isRunning ? Date.now() - (this.metricsHistory[0]?.combined?.totalRevenue || Date.now()) : 0,
      totalMetricsCollected: this.metricsHistory.length,
      lastActivity: this.metricsHistory.length > 0 ? new Date() : null
    };
  }
}

export const engineManager = new EngineManagerClass();
export { EngineManagerClass as EngineManager };
export default engineManager;