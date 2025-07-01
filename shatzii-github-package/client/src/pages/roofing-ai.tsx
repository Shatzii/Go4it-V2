import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home,
  Zap,
  Eye,
  Calculator,
  Calendar,
  Users,
  TrendingUp,
  MapPin,
  Camera,
  FileText,
  Shield,
  Wrench,
  CloudRain,
  DollarSign,
  Phone,
  MessageSquare,
  BarChart3,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface RoofingProject {
  id: string;
  address: string;
  customerName: string;
  projectType: string;
  status: 'estimate' | 'approved' | 'in-progress' | 'completed';
  estimatedCost: number;
  actualCost?: number;
  startDate: string;
  completionDate?: string;
  squareFootage: number;
  materials: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
}

interface LeadData {
  source: string;
  count: number;
  conversionRate: number;
  avgValue: number;
}

interface WeatherAlert {
  id: string;
  type: 'storm' | 'hail' | 'wind' | 'rain';
  severity: 'low' | 'medium' | 'high';
  location: string;
  timeframe: string;
  potentialLeads: number;
}

export default function RoofingAI() {
  const [activeProjects, setActiveProjects] = useState<RoofingProject[]>([]);
  const [dailyMetrics, setDailyMetrics] = useState({
    leadsGenerated: 142,
    estimatesCreated: 23,
    projectsCompleted: 8,
    revenue: 87450,
    customerSatisfaction: 98.5
  });

  const [aiCapabilities] = useState([
    {
      category: 'Lead Generation & Qualification',
      icon: <Target className="w-6 h-6" />,
      capabilities: [
        'Storm damage detection via satellite imagery',
        'Insurance claim lead identification',
        'Weather pattern analysis for proactive outreach',
        'Competitor analysis and market penetration',
        'Social media and online review monitoring',
        'Referral program automation'
      ],
      color: 'bg-blue-600'
    },
    {
      category: 'Inspection & Assessment',
      icon: <Eye className="w-6 h-6" />,
      capabilities: [
        'Drone roof inspection with AI analysis',
        'Damage detection and classification',
        '3D modeling and measurements',
        'Thermal imaging analysis',
        'Material condition assessment',
        'Safety hazard identification'
      ],
      color: 'bg-green-600'
    },
    {
      category: 'Estimation & Pricing',
      icon: <Calculator className="w-6 h-6" />,
      capabilities: [
        'Automated material calculations',
        'Labor cost estimation based on complexity',
        'Market pricing analysis and optimization',
        'Instant quote generation with 95% accuracy',
        'Profit margin optimization',
        'Multi-tier pricing strategies'
      ],
      color: 'bg-purple-600'
    },
    {
      category: 'Project Management',
      icon: <Calendar className="w-6 h-6" />,
      capabilities: [
        'Automated scheduling and crew assignment',
        'Material ordering and delivery coordination',
        'Progress tracking with photo documentation',
        'Quality control checkpoints',
        'Weather delay management',
        'Timeline optimization'
      ],
      color: 'bg-orange-600'
    },
    {
      category: 'Customer Communication',
      icon: <MessageSquare className="w-6 h-6" />,
      capabilities: [
        '24/7 AI customer service chatbot',
        'Automated appointment scheduling',
        'Progress updates and photo sharing',
        'Insurance claim assistance',
        'Review and testimonial collection',
        'Emergency response coordination'
      ],
      color: 'bg-red-600'
    },
    {
      category: 'Business Intelligence',
      icon: <BarChart3 className="w-6 h-6" />,
      capabilities: [
        'Real-time revenue and profit tracking',
        'Crew productivity analytics',
        'Material waste optimization',
        'Customer lifetime value analysis',
        'Seasonal demand forecasting',
        'Competitive market analysis'
      ],
      color: 'bg-yellow-600'
    }
  ]);

  const leadSources: LeadData[] = [
    { source: 'Storm Damage Detection', count: 45, conversionRate: 78, avgValue: 8500 },
    { source: 'Insurance Referrals', count: 32, conversionRate: 65, avgValue: 12000 },
    { source: 'Google Ads', count: 28, conversionRate: 42, avgValue: 6500 },
    { source: 'Neighbor Referrals', count: 22, conversionRate: 85, avgValue: 7200 },
    { source: 'Website Forms', count: 15, conversionRate: 35, avgValue: 5800 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 125000, projects: 18 },
    { month: 'Feb', revenue: 145000, projects: 22 },
    { month: 'Mar', revenue: 168000, projects: 25 },
    { month: 'Apr', revenue: 195000, projects: 29 },
    { month: 'May', revenue: 225000, projects: 34 },
    { month: 'Jun', revenue: 260000, projects: 38 }
  ];

  const weatherAlerts: WeatherAlert[] = [
    {
      id: '1',
      type: 'storm',
      severity: 'high',
      location: 'Dallas Metro Area',
      timeframe: 'Next 48 hours',
      potentialLeads: 150
    },
    {
      id: '2',
      type: 'hail',
      severity: 'medium',
      location: 'Fort Worth',
      timeframe: 'This weekend',
      potentialLeads: 85
    }
  ];

  const projectTypes = [
    { name: 'Residential Re-roof', value: 45, color: '#8B5CF6' },
    { name: 'Commercial Repair', value: 25, color: '#06B6D4' },
    { name: 'Insurance Claims', value: 20, color: '#10B981' },
    { name: 'Emergency Repairs', value: 10, color: '#F59E0B' }
  ];

  useEffect(() => {
    // Simulate real-time project updates
    const projects: RoofingProject[] = [
      {
        id: '1',
        address: '1234 Oak Street, Dallas, TX',
        customerName: 'Johnson Family',
        projectType: 'Full Roof Replacement',
        status: 'in-progress',
        estimatedCost: 15500,
        startDate: '2025-06-25',
        squareFootage: 2400,
        materials: ['Asphalt Shingles', 'Underlayment', 'Flashing'],
        urgency: 'medium'
      },
      {
        id: '2',
        address: '5678 Pine Avenue, Plano, TX',
        customerName: 'Smith Corporation',
        projectType: 'Commercial Roof Repair',
        status: 'approved',
        estimatedCost: 32000,
        startDate: '2025-07-01',
        squareFootage: 12000,
        materials: ['TPO Membrane', 'Insulation', 'Drains'],
        urgency: 'high'
      },
      {
        id: '3',
        address: '9876 Elm Drive, Richardson, TX',
        customerName: 'Williams Family',
        projectType: 'Storm Damage Repair',
        status: 'estimate',
        estimatedCost: 8750,
        startDate: '2025-06-30',
        squareFootage: 1800,
        materials: ['Impact Shingles', 'Ridge Vent', 'Gutters'],
        urgency: 'emergency'
      }
    ];
    setActiveProjects(projects);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'approved': return 'bg-yellow-500';
      case 'estimate': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Home className="w-10 h-10 mr-3 text-blue-400" />
            Shatzii Roofing AI Engine
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Complete Autonomous Roofing Operations - From Lead to Completion
          </p>
          
          {/* Real-time Status */}
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400">AI Systems Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400">Processing 147 Leads</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400">23 Drone Inspections Today</span>
            </div>
          </div>
        </div>

        {/* Daily Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{dailyMetrics.leadsGenerated}</div>
              <div className="text-sm text-gray-400">Leads Generated</div>
              <div className="text-xs text-green-400 mt-1">+23% vs yesterday</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Calculator className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{dailyMetrics.estimatesCreated}</div>
              <div className="text-sm text-gray-400">Estimates Created</div>
              <div className="text-xs text-green-400 mt-1">95% accuracy rate</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{dailyMetrics.projectsCompleted}</div>
              <div className="text-sm text-gray-400">Projects Completed</div>
              <div className="text-xs text-green-400 mt-1">On time & budget</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">${dailyMetrics.revenue.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Revenue Today</div>
              <div className="text-xs text-green-400 mt-1">+18% vs target</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{dailyMetrics.customerSatisfaction}%</div>
              <div className="text-sm text-gray-400">Customer Satisfaction</div>
              <div className="text-xs text-green-400 mt-1">Industry leading</div>
            </CardContent>
          </Card>
        </div>

        {/* Weather Alerts */}
        {weatherAlerts.length > 0 && (
          <Card className="bg-gradient-to-r from-orange-900 to-red-900 border-orange-500 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CloudRain className="w-5 h-5 mr-2" />
                Weather Alerts & Lead Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weatherAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`w-5 h-5 ${alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
                        <span className="text-white font-medium capitalize">{alert.type} Warning</span>
                      </div>
                      <Badge variant={alert.severity === 'high' ? 'destructive' : 'default'}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-gray-300 text-sm space-y-1">
                      <div><MapPin className="w-4 h-4 inline mr-1" />{alert.location}</div>
                      <div><Clock className="w-4 h-4 inline mr-1" />{alert.timeframe}</div>
                      <div className="text-green-400">
                        <Target className="w-4 h-4 inline mr-1" />
                        {alert.potentialLeads} potential leads
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="capabilities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="capabilities">AI Capabilities</TabsTrigger>
            <TabsTrigger value="projects">Active Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="leads">Lead Pipeline</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          {/* AI Capabilities Tab */}
          <TabsContent value="capabilities">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Complete Roofing Business Automation
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiCapabilities.map((category, index) => (
                  <Card key={index} className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <div className={`p-2 rounded-lg ${category.color} mr-3`}>
                          {category.icon}
                        </div>
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {category.capabilities.map((capability, capIndex) => (
                          <li key={capIndex} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{capability}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Technology Stack */}
              <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-white text-center">Advanced Technology Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <Camera className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-white font-medium">Computer Vision</div>
                      <div className="text-gray-300 text-sm">Damage Detection AI</div>
                    </div>
                    <div>
                      <Eye className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-white font-medium">Drone Integration</div>
                      <div className="text-gray-300 text-sm">Automated Inspections</div>
                    </div>
                    <div>
                      <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-white font-medium">Predictive Analytics</div>
                      <div className="text-gray-300 text-sm">Market Forecasting</div>
                    </div>
                    <div>
                      <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <div className="text-white font-medium">Insurance Integration</div>
                      <div className="text-gray-300 text-sm">Claims Automation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Projects Tab */}
          <TabsContent value="projects">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Active Projects</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule New Project
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeProjects.map((project) => (
                  <Card key={project.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{project.customerName}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                          <Badge variant="outline" className="capitalize">
                            {project.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-gray-400 text-sm">Address</div>
                        <div className="text-white">{project.address}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-400 text-sm">Project Type</div>
                          <div className="text-white">{project.projectType}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">Square Footage</div>
                          <div className="text-white">{project.squareFootage.toLocaleString()} sq ft</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-400 text-sm">Estimated Cost</div>
                          <div className="text-green-400 font-medium">${project.estimatedCost.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-sm">Urgency</div>
                          <div className={`font-medium capitalize ${getUrgencyColor(project.urgency)}`}>
                            {project.urgency}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-400 text-sm mb-2">Materials</div>
                        <div className="flex flex-wrap gap-1">
                          {project.materials.map((material, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-gray-400 text-sm">Start Date</div>
                          <div className="text-white">{new Date(project.startDate).toLocaleDateString()}</div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Wrench className="w-4 h-4 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Business Analytics</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '6px'
                            }}
                          />
                          <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Types Distribution */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Project Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={projectTypes}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                          >
                            {projectTypes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">23.5%</div>
                      <div className="text-gray-400">Profit Margin</div>
                      <div className="text-xs text-green-400 mt-1">+2.1% vs last month</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">4.2</div>
                      <div className="text-gray-400">Days Avg Project</div>
                      <div className="text-xs text-green-400 mt-1">15% faster</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">67%</div>
                      <div className="text-gray-400">Lead Conversion</div>
                      <div className="text-xs text-green-400 mt-1">Industry leading</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Lead Pipeline Tab */}
          <TabsContent value="leads">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Lead Generation Pipeline</h2>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Lead Sources Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leadSources.map((source, index) => (
                      <div key={index} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">{source.source}</h3>
                          <Badge className="bg-blue-600">{source.count} leads</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Conversion Rate</div>
                            <div className="text-green-400 font-medium">{source.conversionRate}%</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Avg Value</div>
                            <div className="text-yellow-400 font-medium">${source.avgValue.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Total Value</div>
                            <div className="text-purple-400 font-medium">
                              ${(source.count * source.avgValue * (source.conversionRate / 100)).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Conversion Progress</span>
                            <span>{source.conversionRate}%</span>
                          </div>
                          <Progress value={source.conversionRate} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Automation Controls</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Agent Status */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">AI Agent Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full" />
                          <span className="text-white">Lead Generation Agent</span>
                        </div>
                        <Badge className="bg-green-600">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full" />
                          <span className="text-white">Inspection AI</span>
                        </div>
                        <Badge className="bg-green-600">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full" />
                          <span className="text-white">Estimation Engine</span>
                        </div>
                        <Badge className="bg-green-600">Active</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                          <span className="text-white">Customer Service Bot</span>
                        </div>
                        <Badge className="bg-yellow-600">Training</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Target className="w-4 h-4 mr-2" />
                      Generate Storm Damage Leads
                    </Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Eye className="w-4 h-4 mr-2" />
                      Schedule Drone Inspections
                    </Button>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Calculator className="w-4 h-4 mr-2" />
                      Bulk Generate Estimates
                    </Button>
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Customer Updates
                    </Button>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Emergency Response Mode
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Optimization */}
              <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-500">
                <CardHeader>
                  <CardTitle className="text-white">Performance Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">312%</div>
                      <div className="text-white font-medium">Lead Generation Increase</div>
                      <div className="text-gray-300 text-sm">vs manual methods</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">78%</div>
                      <div className="text-white font-medium">Time Savings</div>
                      <div className="text-gray-300 text-sm">on project management</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">94%</div>
                      <div className="text-white font-medium">Estimation Accuracy</div>
                      <div className="text-gray-300 text-sm">reducing revisions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}