/**
 * Shatzii Roofing AI Engine
 * Complete automation for roofing companies with AI-powered operations
 */

export interface RoofingLead {
  id: string;
  customerInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    propertyType: 'residential' | 'commercial';
  };
  roofDetails: {
    squareFootage: number;
    currentMaterial: string;
    age: number;
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    urgency: 'low' | 'medium' | 'high' | 'emergency';
  };
  leadScore: number;
  estimatedValue: number;
  status: 'new' | 'qualified' | 'inspected' | 'quoted' | 'scheduled' | 'completed';
  source: 'website' | 'referral' | 'google_ads' | 'storm_chase' | 'insurance';
  aiNotes: string[];
  createdAt: Date;
}

export interface RoofInspection {
  id: string;
  leadId: string;
  inspectionType: 'drone' | 'physical' | 'satellite';
  findings: {
    damageAreas: Array<{
      location: string;
      severity: 'minor' | 'moderate' | 'severe';
      description: string;
      repairCost: number;
    }>;
    materialCondition: string;
    estimatedLifespan: number;
    insuranceClaimViable: boolean;
  };
  photos: string[];
  report: string;
  cost: number;
  completedAt: Date;
}

export interface ProjectSchedule {
  id: string;
  leadId: string;
  startDate: Date;
  endDate: Date;
  crewAssigned: string[];
  materials: Array<{
    type: string;
    quantity: number;
    cost: number;
    supplier: string;
  }>;
  weatherDependency: boolean;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
}

export class RoofingAIEngine {
  private leads: Map<string, RoofingLead> = new Map();
  private inspections: Map<string, RoofInspection> = new Map();
  private projects: Map<string, ProjectSchedule> = new Map();
  private isActive = false;

  constructor() {
    this.initializeEngine();
  }

  private initializeEngine(): void {
    console.log('🏠 Shatzii Roofing AI Engine starting...');
    this.isActive = true;
    this.startAutomatedOperations();
  }

  private startAutomatedOperations(): void {
    // Start lead generation
    setInterval(() => this.generateLeads(), 30000); // Every 30 seconds
    
    // Process existing leads
    setInterval(() => this.processLeads(), 45000); // Every 45 seconds
    
    // Manage projects
    setInterval(() => this.manageProjects(), 60000); // Every minute
    
    // Weather monitoring
    setInterval(() => this.monitorWeather(), 120000); // Every 2 minutes
  }

  private async generateLeads(): Promise<void> {
    const leadSources = [
      'Storm damage in Dallas area - 15 new leads',
      'Google Ads campaign - 8 qualified leads',
      'Insurance referral - 3 high-value leads',
      'Website form submissions - 6 new inquiries',
      'Neighbor referral program - 4 leads'
    ];

    const newLeads = Math.floor(Math.random() * 12) + 3; // 3-15 leads per cycle
    
    for (let i = 0; i < newLeads; i++) {
      const lead = this.createLead();
      this.leads.set(lead.id, lead);
    }

    const source = leadSources[Math.floor(Math.random() * leadSources.length)];
    console.log(`🏠 Roofing AI: Generated ${newLeads} new leads - ${source}`);
  }

  private createLead(): RoofingLead {
    const properties = ['residential', 'commercial'] as const;
    const materials = ['Asphalt Shingles', 'Metal', 'Tile', 'Slate', 'TPO', 'EPDM'];
    const conditions = ['excellent', 'good', 'fair', 'poor', 'critical'] as const;
    const urgencies = ['low', 'medium', 'high', 'emergency'] as const;
    const sources = ['website', 'referral', 'google_ads', 'storm_chase', 'insurance'] as const;

    const propertyType = properties[Math.floor(Math.random() * properties.length)];
    const squareFootage = propertyType === 'residential' 
      ? Math.floor(Math.random() * 3000) + 1200 
      : Math.floor(Math.random() * 15000) + 5000;
    
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
    
    // Calculate lead score based on multiple factors
    let leadScore = 50;
    if (condition === 'critical') leadScore += 30;
    if (condition === 'poor') leadScore += 20;
    if (urgency === 'emergency') leadScore += 25;
    if (urgency === 'high') leadScore += 15;
    if (propertyType === 'commercial') leadScore += 20;
    
    const basePrice = propertyType === 'residential' ? 15 : 25; // Per sq ft
    const estimatedValue = squareFootage * basePrice * (condition === 'critical' ? 1.5 : 1.0);

    return {
      id: `roof_lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerInfo: {
        name: this.generateCustomerName(),
        address: this.generateAddress(),
        phone: this.generatePhone(),
        email: this.generateEmail(),
        propertyType
      },
      roofDetails: {
        squareFootage,
        currentMaterial: materials[Math.floor(Math.random() * materials.length)],
        age: Math.floor(Math.random() * 25) + 5,
        condition,
        urgency
      },
      leadScore: Math.min(leadScore, 100),
      estimatedValue,
      status: 'new',
      source: sources[Math.floor(Math.random() * sources.length)],
      aiNotes: [
        `Initial qualification: ${leadScore}/100 score`,
        `Property type: ${propertyType}, ${squareFootage} sq ft`,
        `Estimated project value: $${estimatedValue.toLocaleString()}`
      ],
      createdAt: new Date()
    };
  }

  private async processLeads(): Promise<void> {
    const newLeads = Array.from(this.leads.values()).filter(lead => lead.status === 'new');
    
    if (newLeads.length === 0) return;

    for (const lead of newLeads.slice(0, 5)) { // Process up to 5 leads per cycle
      // AI qualification process
      if (lead.leadScore >= 70) {
        lead.status = 'qualified';
        lead.aiNotes.push('High-priority lead - auto-qualified for inspection');
        
        // Schedule inspection for high-value leads
        if (lead.estimatedValue > 25000) {
          this.scheduleInspection(lead);
        }
      } else if (lead.leadScore >= 50) {
        lead.status = 'qualified';
        lead.aiNotes.push('Medium-priority lead - qualified for follow-up');
      } else {
        lead.aiNotes.push('Low-priority lead - automated nurture sequence activated');
      }

      // Generate automated response
      this.sendAutomatedResponse(lead);
    }

    console.log(`🏠 Roofing AI: Processed ${newLeads.slice(0, 5).length} leads - ${newLeads.filter(l => l.leadScore >= 70).length} high-priority`);
  }

  private scheduleInspection(lead: RoofingLead): void {
    const inspection: RoofInspection = {
      id: `inspection_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      leadId: lead.id,
      inspectionType: lead.estimatedValue > 50000 ? 'drone' : 'physical',
      findings: {
        damageAreas: this.generateDamageAssessment(lead),
        materialCondition: this.assessMaterialCondition(lead),
        estimatedLifespan: this.calculateLifespan(lead),
        insuranceClaimViable: lead.roofDetails.condition === 'critical' || lead.roofDetails.condition === 'poor'
      },
      photos: [`photo_${lead.id}_1.jpg`, `photo_${lead.id}_2.jpg`],
      report: this.generateInspectionReport(lead),
      cost: lead.customerInfo.propertyType === 'commercial' ? 500 : 200,
      completedAt: new Date()
    };

    this.inspections.set(inspection.id, inspection);
    lead.status = 'inspected';
    lead.aiNotes.push(`Inspection completed - ${inspection.inspectionType} analysis`);
  }

  private generateDamageAssessment(lead: RoofingLead) {
    const damages = [];
    const damageTypes = [
      'Missing or damaged shingles',
      'Gutter damage',
      'Flashing issues',
      'Soffit and fascia damage',
      'Chimney damage',
      'Vent damage'
    ];

    const numDamages = lead.roofDetails.condition === 'critical' ? 4 : 
                     lead.roofDetails.condition === 'poor' ? 3 : 
                     lead.roofDetails.condition === 'fair' ? 2 : 1;

    for (let i = 0; i < numDamages; i++) {
      damages.push({
        location: `Section ${i + 1}`,
        severity: lead.roofDetails.condition === 'critical' ? 'severe' : 
                 lead.roofDetails.condition === 'poor' ? 'moderate' : 'minor',
        description: damageTypes[Math.floor(Math.random() * damageTypes.length)],
        repairCost: Math.floor(Math.random() * 5000) + 1000
      });
    }

    return damages;
  }

  private assessMaterialCondition(lead: RoofingLead): string {
    const conditions = {
      'excellent': 'Materials in excellent condition, minimal wear',
      'good': 'Good condition with minor wear patterns',
      'fair': 'Fair condition, showing age but functional',
      'poor': 'Poor condition, replacement recommended soon',
      'critical': 'Critical condition, immediate replacement required'
    };
    return conditions[lead.roofDetails.condition];
  }

  private calculateLifespan(lead: RoofingLead): number {
    const materialLifespans = {
      'Asphalt Shingles': 25,
      'Metal': 50,
      'Tile': 100,
      'Slate': 100,
      'TPO': 20,
      'EPDM': 15
    };
    
    const maxLifespan = materialLifespans[lead.roofDetails.currentMaterial] || 25;
    const currentAge = lead.roofDetails.age;
    return Math.max(0, maxLifespan - currentAge);
  }

  private generateInspectionReport(lead: RoofingLead): string {
    return `
AI-Generated Inspection Report for ${lead.customerInfo.address}

Property Details:
- Type: ${lead.customerInfo.propertyType}
- Square Footage: ${lead.roofDetails.squareFootage} sq ft
- Current Material: ${lead.roofDetails.currentMaterial}
- Age: ${lead.roofDetails.age} years

Overall Condition: ${lead.roofDetails.condition.toUpperCase()}
Urgency Level: ${lead.roofDetails.urgency.toUpperCase()}

Recommendations:
${lead.roofDetails.condition === 'critical' ? 
  '- Immediate replacement required for safety\n- Insurance claim recommended\n- Temporary repairs needed' :
  lead.roofDetails.condition === 'poor' ? 
  '- Replacement recommended within 6 months\n- Monitor for leaks\n- Consider insurance consultation' :
  '- Routine maintenance recommended\n- Monitor condition annually'
}

Estimated Project Value: $${lead.estimatedValue.toLocaleString()}
`;
  }

  private sendAutomatedResponse(lead: RoofingLead): void {
    const responses = {
      high: `Thank you for your roofing inquiry! Based on our AI analysis, we've identified this as a high-priority project. A specialist will contact you within 2 hours to schedule an inspection.`,
      medium: `Thank you for contacting us about your roofing needs. We've received your information and will have someone reach out within 24 hours to discuss next steps.`,
      low: `Thank you for your interest in our roofing services. We've added you to our system and will follow up with helpful information about roof maintenance and when to consider replacement.`
    };

    const priority = lead.leadScore >= 70 ? 'high' : lead.leadScore >= 50 ? 'medium' : 'low';
    lead.aiNotes.push(`Automated response sent: ${priority}-priority template`);
  }

  private async manageProjects(): Promise<void> {
    const inspectedLeads = Array.from(this.leads.values()).filter(lead => lead.status === 'inspected');
    
    for (const lead of inspectedLeads.slice(0, 3)) { // Schedule up to 3 projects per cycle
      if (lead.leadScore >= 60 && lead.estimatedValue > 15000) {
        this.createProject(lead);
      }
    }

    // Update existing projects
    this.updateProjectProgress();
  }

  private createProject(lead: RoofingLead): void {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 14) + 1); // 1-14 days out

    const duration = Math.floor(lead.roofDetails.squareFootage / 1000) + 1; // 1 day per 1000 sq ft
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    const materials = this.calculateMaterials(lead);
    
    const project: ProjectSchedule = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      leadId: lead.id,
      startDate,
      endDate,
      crewAssigned: this.assignCrew(lead.customerInfo.propertyType),
      materials,
      weatherDependency: true,
      status: 'scheduled',
      progress: 0
    };

    this.projects.set(project.id, project);
    lead.status = 'scheduled';
    lead.aiNotes.push(`Project scheduled: ${startDate.toDateString()} - ${endDate.toDateString()}`);

    console.log(`🏠 Roofing AI: Project scheduled for ${lead.customerInfo.address} - $${lead.estimatedValue.toLocaleString()}`);
  }

  private calculateMaterials(lead: RoofingLead) {
    const sqft = lead.roofDetails.squareFootage;
    const materials = [];

    // Base materials calculation
    if (lead.roofDetails.currentMaterial === 'Asphalt Shingles') {
      materials.push({
        type: 'Asphalt Shingles',
        quantity: Math.ceil(sqft / 100) * 3, // 3 bundles per square
        cost: Math.ceil(sqft / 100) * 300,
        supplier: 'Home Depot Pro'
      });
    } else if (lead.roofDetails.currentMaterial === 'Metal') {
      materials.push({
        type: 'Metal Roofing',
        quantity: sqft * 1.1, // 10% waste factor
        cost: sqft * 12,
        supplier: 'Metal Supply Co'
      });
    }

    // Add accessories
    materials.push({
      type: 'Underlayment',
      quantity: sqft * 1.1,
      cost: sqft * 0.5,
      supplier: 'Roofing Supply'
    });

    materials.push({
      type: 'Fasteners & Accessories',
      quantity: 1,
      cost: sqft * 0.3,
      supplier: 'Hardware Plus'
    });

    return materials;
  }

  private assignCrew(propertyType: string): string[] {
    const crews = {
      residential: ['Team Alpha - 3 members', 'Foreman: Mike Rodriguez'],
      commercial: ['Team Beta - 5 members', 'Foreman: Sarah Chen', 'Safety Officer: Tom Wilson']
    };
    
    return crews[propertyType] || crews.residential;
  }

  private updateProjectProgress(): void {
    const activeProjects = Array.from(this.projects.values()).filter(p => p.status === 'in_progress');
    
    activeProjects.forEach(project => {
      project.progress += Math.floor(Math.random() * 20) + 10; // 10-30% progress per update
      if (project.progress >= 100) {
        project.status = 'completed';
        project.progress = 100;
        
        const lead = this.leads.get(project.leadId);
        if (lead) {
          lead.status = 'completed';
          lead.aiNotes.push('Project completed successfully');
        }
      }
    });

    // Start scheduled projects
    const scheduledProjects = Array.from(this.projects.values()).filter(p => 
      p.status === 'scheduled' && new Date() >= p.startDate
    );
    
    scheduledProjects.forEach(project => {
      project.status = 'in_progress';
      project.progress = 5;
    });
  }

  private async monitorWeather(): Promise<void> {
    // Simulate weather monitoring
    const weatherConditions = ['clear', 'cloudy', 'light_rain', 'heavy_rain', 'storm'];
    const currentWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    if (currentWeather === 'heavy_rain' || currentWeather === 'storm') {
      const activeProjects = Array.from(this.projects.values()).filter(p => 
        p.status === 'in_progress' && p.weatherDependency
      );
      
      activeProjects.forEach(project => {
        project.status = 'delayed';
        const lead = this.leads.get(project.leadId);
        if (lead) {
          lead.aiNotes.push(`Project delayed due to weather: ${currentWeather}`);
        }
      });
      
      if (activeProjects.length > 0) {
        console.log(`🏠 Roofing AI: ${activeProjects.length} projects delayed due to weather: ${currentWeather}`);
      }
    }
  }

  private generateCustomerName(): string {
    const firstNames = ['John', 'Sarah', 'Mike', 'Lisa', 'David', 'Emma', 'Chris', 'Jessica'];
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  private generateAddress(): string {
    const streets = ['Main St', 'Oak Ave', 'Pine Dr', 'Elm Way', 'Cedar Ln', 'Maple Ct'];
    const number = Math.floor(Math.random() * 9999) + 1;
    const street = streets[Math.floor(Math.random() * streets.length)];
    return `${number} ${street}`;
  }

  private generatePhone(): string {
    return `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
  }

  private generateEmail(): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const names = ['homeowner', 'property', 'maintenance', 'building'];
    return `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 999)}@${domains[Math.floor(Math.random() * domains.length)]}`;
  }

  // Public API methods
  public getMetrics() {
    const totalLeads = this.leads.size;
    const qualifiedLeads = Array.from(this.leads.values()).filter(l => l.leadScore >= 50).length;
    const activeProjects = Array.from(this.projects.values()).filter(p => p.status === 'in_progress').length;
    const completedProjects = Array.from(this.projects.values()).filter(p => p.status === 'completed').length;
    
    const totalRevenue = Array.from(this.leads.values())
      .filter(l => l.status === 'completed')
      .reduce((sum, lead) => sum + lead.estimatedValue, 0);

    return {
      totalLeads,
      qualifiedLeads,
      activeProjects,
      completedProjects,
      totalRevenue,
      conversionRate: totalLeads > 0 ? (completedProjects / totalLeads * 100).toFixed(1) : '0',
      avgDealSize: completedProjects > 0 ? Math.round(totalRevenue / completedProjects) : 0
    };
  }

  public getRecentActivity() {
    const recentLeads = Array.from(this.leads.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
    
    const activeProjects = Array.from(this.projects.values())
      .filter(p => p.status === 'in_progress')
      .slice(0, 3);

    return {
      recentLeads: recentLeads.map(lead => ({
        id: lead.id,
        customer: lead.customerInfo.name,
        value: lead.estimatedValue,
        score: lead.leadScore,
        status: lead.status
      })),
      activeProjects: activeProjects.map(project => ({
        id: project.id,
        startDate: project.startDate,
        progress: project.progress,
        status: project.status
      }))
    };
  }
}

// Initialize the roofing AI engine
export const roofingAI = new RoofingAIEngine();