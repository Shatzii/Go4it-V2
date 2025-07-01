import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, Circle, TrendingUp, Globe, Users, Zap, BarChart3, Settings, Target, Database, Map, Rocket, Crown, Shield, Brain, Command, Server, AlertTriangle, Power, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
  revenue_impact: string;
}

const wizardSteps: WizardStep[] = [
  {
    id: 'system-initialization',
    title: 'Core System Initialization',
    description: 'Boot up the AI engine cluster, initialize 202+ autonomous agents, and establish secure connections',
    icon: Power,
    component: () => <div className="p-4"><p>System Initialization Step</p></div>,
    estimatedTime: '5 min',
    priority: 'high',
    dependencies: [],
    revenue_impact: 'Platform foundation'
  },
  {
    id: 'ai-deployment',
    title: 'AI Agent Fleet Deployment',
    description: 'Deploy 202+ autonomous agents across 13 vertical markets - Transportation, Healthcare, Finance, Legal, Manufacturing, Retail, Energy, Insurance, Real Estate, Government, Agriculture, Education, and Roofing',
    icon: Brain,
    component: () => <div className="p-4"><p>AI Deployment Step</p></div>,
    estimatedTime: '10 min',
    priority: 'high',
    dependencies: ['system-initialization'],
    revenue_impact: '$166.2M potential unlocked'
  },
  {
    id: 'revenue-streams',
    title: 'Revenue Stream Activation',
    description: 'Activate all revenue channels: autonomous marketing engines, sales automation, enterprise subscriptions, and API licensing across all verticals',
    icon: TrendingUp,
    component: () => <div className="p-4"><p>Revenue Stream Step</p></div>,
    estimatedTime: '15 min',
    priority: 'high',
    dependencies: ['ai-deployment'],
    revenue_impact: 'Multi-million revenue activation'
  },
  {
    id: 'security-protocols',
    title: 'Enterprise Security Protocols',
    description: 'Implement bank-level security, compliance frameworks, and data protection across all systems and customer interactions',
    icon: Shield,
    component: () => <div className="p-4"><p>Security Protocols Step</p></div>,
    estimatedTime: '12 min',
    priority: 'high',
    dependencies: ['system-initialization'],
    revenue_impact: '40% conversion boost'
  },
  {
    id: 'market-dominance',
    title: 'Market Dominance Strategy',
    description: 'Launch autonomous marketing campaigns, enterprise outreach, and thought leadership positioning to establish market category dominance',
    icon: Crown,
    component: () => <div className="p-4"><p>Market Dominance Step</p></div>,
    estimatedTime: '20 min',
    priority: 'high',
    dependencies: ['revenue-streams', 'security-protocols'],
    revenue_impact: 'Market leadership establishment'
  },
  {
    id: 'monitoring-systems',
    title: 'Command Center Monitoring',
    description: 'Activate real-time monitoring, performance dashboards, and executive reporting systems for complete operational oversight',
    icon: Command,
    component: () => <div className="p-4"><p>Monitoring Systems Step</p></div>,
    estimatedTime: '8 min',
    priority: 'medium',
    dependencies: ['ai-deployment'],
    revenue_impact: 'Operational excellence'
  },
  {
    id: 'enterprise-readiness',
    title: 'Enterprise Deployment Readiness',
    description: 'Final system validation, Fortune 500 client onboarding preparation, and deployment certification for immediate market launch',
    icon: Rocket,
    component: () => <div className="p-4"><p>Enterprise Readiness Step</p></div>,
    estimatedTime: '10 min',
    priority: 'high',
    dependencies: ['market-dominance', 'monitoring-systems'],
    revenue_impact: 'Go-to-market activation'
  },
  {
    id: 'client-portal',
    title: 'Enterprise Client Portal Preview',
    description: 'Mock dashboard showing enterprise client experience and AI performance',
    icon: Globe,
    component: ClientPortalStep,
    estimatedTime: '22 min',
    priority: 'medium',
    dependencies: ['ai-heatmap'],
    revenue_impact: 'Enterprise confidence'
  },
  {
    id: 'partnership-map',
    title: 'Strategic Partnership Visual Map',
    description: 'Interactive world map showing partnership opportunities and deployment strategy',
    icon: Map,
    component: PartnershipMapStep,
    estimatedTime: '20 min',
    priority: 'low',
    dependencies: ['industry-routing'],
    revenue_impact: 'Global expansion ready'
  }
];

export default function VerticalOptimizationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);

  const currentStepData = wizardSteps[currentStep];
  const totalSteps = wizardSteps.length;
  const overallProgress = (completedSteps.length / totalSteps) * 100;

  const canProceed = (step: WizardStep) => {
    return step.dependencies.every(dep => completedSteps.includes(dep));
  };

  const executeStep = async (stepId: string) => {
    setIsExecuting(true);
    setExecutionProgress(0);
    
    // Simulate step execution with progress updates
    for (let i = 0; i <= 100; i += 10) {
      setExecutionProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setCompletedSteps(prev => [...prev, stepId]);
    setIsExecuting(false);
    setExecutionProgress(0);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Rocket className="w-4 h-4" />
            12-Vertical AI Empire Optimization
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Interactive <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Deployment Wizard</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Transform Shatzii.com into the definitive multi-vertical AI platform with these 10 strategic optimizations. 
            Each step builds upon the previous to create an unstoppable market presence.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-300 font-medium">Overall Progress</span>
            <span className="text-cyan-400 font-mono">{completedSteps.length}/{totalSteps} completed</span>
          </div>
          <Progress value={overallProgress} className="h-3 bg-slate-700" />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Step Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100 text-lg">Implementation Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {wizardSteps.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isCurrent = index === currentStep;
                  const canAccess = canProceed(step);
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => jumpToStep(index)}
                      disabled={!canAccess && !isCompleted}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        isCurrent 
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                          : isCompleted
                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : canAccess
                              ? 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                              : 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <step.icon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{step.title}</div>
                          <div className="text-xs opacity-70">{step.estimatedTime}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
                      <currentStepData.icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-100 text-xl mb-2">{currentStepData.title}</CardTitle>
                      <p className="text-slate-300">{currentStepData.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      currentStepData.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      currentStepData.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {currentStepData.priority.toUpperCase()} PRIORITY
                    </div>
                    <div className="text-slate-400 text-sm mt-2">{currentStepData.revenue_impact}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Step Content */}
                <div className="mb-6">
                  <currentStepData.component />
                </div>

                {/* Execution Progress */}
                {isExecuting && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 font-medium">Implementing...</span>
                      <span className="text-cyan-400 font-mono">{executionProgress}%</span>
                    </div>
                    <Progress value={executionProgress} className="h-2 bg-slate-700" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-4">
                    {!completedSteps.includes(currentStepData.id) && (
                      <Button
                        onClick={() => executeStep(currentStepData.id)}
                        disabled={!canProceed(currentStepData) || isExecuting}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      >
                        {isExecuting ? 'Implementing...' : 'Execute Step'}
                      </Button>
                    )}

                    <Button
                      onClick={nextStep}
                      disabled={currentStep === totalSteps - 1}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dependencies */}
            {currentStepData.dependencies.length > 0 && (
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-sm">Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentStepData.dependencies.map(dep => {
                      const depStep = wizardSteps.find(s => s.id === dep);
                      const isCompleted = completedSteps.includes(dep);
                      
                      return (
                        <div
                          key={dep}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isCompleted 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {isCompleted ? '✓' : '⚠'} {depStep?.title}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function VerticalDashboardStep() {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <h4 className="text-slate-100 font-semibold mb-2">Implementation Plan</h4>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Create interactive grid layout with 12 industry cards</li>
            <li>• Add hover effects with real-time metrics display</li>
            <li>• Implement revenue potential animations</li>
            <li>• Connect to vertical engines data source</li>
          </ul>
        </div>
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <h4 className="text-slate-100 font-semibold mb-2">Expected Outcome</h4>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• 40% increase in user engagement</li>
            <li>• Clear value proposition for each vertical</li>
            <li>• Interactive revenue showcase ($161.7M)</li>
            <li>• Foundation for all other optimizations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function RevenueCounterStep() {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <h4 className="text-slate-100 font-semibold mb-2">Animation Features</h4>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Smooth counting animations from 0 to target</li>
            <li>• Real-time updates from autonomous agents</li>
            <li>• Multiple currency formats (monthly/annual)</li>
            <li>• Breakdown by vertical performance</li>
          </ul>
        </div>
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <h4 className="text-slate-100 font-semibold mb-2">Key Metrics</h4>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• TruckFlow: $99K monthly active revenue</li>
            <li>• Total Platform: $161.7M annual potential</li>
            <li>• Lead Generation: 54+ enterprise prospects</li>
            <li>• Market Coverage: 12 industry verticals</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function IndustryRoutingStep() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
        <h4 className="text-slate-100 font-semibold mb-2">Smart Detection Logic</h4>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• IP-based industry detection and geographic routing</li>
          <li>• Referrer analysis for industry-specific traffic sources</li>
          <li>• Custom landing pages for each of the 12 verticals</li>
          <li>• A/B testing framework for conversion optimization</li>
        </ul>
      </div>
    </div>
  );
}

function AIHeatmapStep() {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <h4 className="text-slate-100 font-semibold mb-2">Live Activity Visualization</h4>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Real-time agent activity across all verticals</li>
            <li>• Lead generation heat map with live updates</li>
            <li>• Deal progression tracking and success rates</li>
            <li>• Performance metrics by industry vertical</li>
          </ul>
        </div>
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <h4 className="text-slate-100 font-semibold mb-2">Current Agent Performance</h4>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Marketing Agents: 9 leads/cycle active</li>
            <li>• Sales Agents: AWS, Google, Microsoft targets</li>
            <li>• Campaign Success: 92.7% cache hit rate</li>
            <li>• Global Coverage: Technology sector dominance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ComparisonMatrixStep() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
        <h4 className="text-slate-100 font-semibold mb-2">Interactive Matrix Features</h4>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• Sortable columns by revenue, complexity, timeline</li>
          <li>• Filterable by industry, budget, deployment type</li>
          <li>• Side-by-side comparison of up to 4 verticals</li>
          <li>• Export functionality for enterprise decision makers</li>
        </ul>
      </div>
    </div>
  );
}

function SuccessCarouselStep() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
        <h4 className="text-slate-100 font-semibold mb-2">Case Study Highlights</h4>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• TruckFlow: $875+ daily driver earnings success</li>
          <li>• Healthcare AI: Automated patient scheduling</li>
          <li>• Financial Services: Compliance automation</li>
          <li>• Manufacturing: Predictive maintenance ROI</li>
        </ul>
      </div>
    </div>
  );
}

function MarketplacePreviewStep() {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <h4 className="text-slate-100 font-semibold mb-2">Packaging Options</h4>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• Cloud Deployment: $25K-50K setup</li>
            <li>• On-Premise: $15K per GB + hardware</li>
            <li>• Edge Computing: $35K specialized deployment</li>
            <li>• API Access: $5K monthly subscription</li>
          </ul>
        </div>
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <h4 className="text-slate-100 font-semibold mb-2">Interactive Calculators</h4>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• ROI calculator by industry vertical</li>
            <li>• Total cost of ownership projections</li>
            <li>• Deployment timeline estimator</li>
            <li>• Custom configuration pricing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function AdvantageTimelineStep() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
        <h4 className="text-slate-100 font-semibold mb-2">Evolution Milestones</h4>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• Phase 1: TruckFlow + Education (2 verticals)</li>
          <li>• Phase 2: Healthcare + Financial + Legal (5 total)</li>
          <li>• Phase 3: Manufacturing + Retail + Energy (8 total)</li>
          <li>• Phase 4: Insurance + Real Estate + Gov + Agriculture (12 total)</li>
        </ul>
      </div>
    </div>
  );
}

function ClientPortalStep() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
        <h4 className="text-slate-100 font-semibold mb-2">Portal Features Preview</h4>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• Real-time AI agent performance dashboard</li>
          <li>• Revenue tracking and projection analytics</li>
          <li>• Custom model deployment management</li>
          <li>• Industry-specific insights and recommendations</li>
        </ul>
      </div>
    </div>
  );
}

function PartnershipMapStep() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
        <h4 className="text-slate-100 font-semibold mb-2">Global Strategy Visualization</h4>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• Interactive world map with opportunity clusters</li>
          <li>• Partnership potential by region and industry</li>
          <li>• Market entry strategy visualization</li>
          <li>• Revenue opportunity heat mapping</li>
        </ul>
      </div>
    </div>
  );
}