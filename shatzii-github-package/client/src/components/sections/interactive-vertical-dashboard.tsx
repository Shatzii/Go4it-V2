import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Building, Truck, GraduationCap, Heart, DollarSign, Scale, Factory, ShoppingBag, Zap, Shield, Home, Wheat, Construction } from 'lucide-react';

interface VerticalData {
  id: string;
  title: string;
  industry: string;
  description: string;
  monthlyRevenue: string;
  annualPotential: string;
  clients: number;
  growth: string;
  icon: React.ComponentType<any>;
  color: string;
  bgGradient: string;
  status: 'active' | 'deploying' | 'planning';
  agentsCount: number;
  deploymentProgress: number;
}

const verticalData: VerticalData[] = [
  {
    id: 'truckflow',
    title: 'TruckFlow AI',
    industry: 'Transportation',
    description: 'Autonomous dispatch and driver optimization generating $875+ daily earnings',
    monthlyRevenue: '$99K',
    annualPotential: '$1.2M',
    clients: 347,
    growth: '+23%',
    icon: Truck,
    color: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    status: 'active',
    agentsCount: 8,
    deploymentProgress: 100
  },
  {
    id: 'education',
    title: 'ShatziiOS Education',
    industry: 'Education',
    description: 'Complete educational institution management with AI-powered scheduling',
    monthlyRevenue: '$67K',
    annualPotential: '$800K',
    clients: 156,
    growth: '+31%',
    icon: GraduationCap,
    color: 'from-purple-500 to-indigo-500',
    bgGradient: 'from-purple-500/10 to-indigo-500/10',
    status: 'active',
    agentsCount: 6,
    deploymentProgress: 100
  },
  {
    id: 'healthcare',
    title: 'Healthcare AI',
    industry: 'Healthcare',
    description: 'Patient scheduling, diagnostics assistance, and treatment optimization',
    monthlyRevenue: '$542K',
    annualPotential: '$6.5M',
    clients: 89,
    growth: '+45%',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    bgGradient: 'from-red-500/10 to-pink-500/10',
    status: 'deploying',
    agentsCount: 12,
    deploymentProgress: 78
  },
  {
    id: 'financial',
    title: 'Financial Services AI',
    industry: 'Financial Services',
    description: 'Automated compliance, risk assessment, and investment analysis',
    monthlyRevenue: '$1.2M',
    annualPotential: '$14.5M',
    clients: 234,
    growth: '+67%',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
    status: 'deploying',
    agentsCount: 15,
    deploymentProgress: 65
  },
  {
    id: 'legal',
    title: 'Legal Tech AI',
    industry: 'Legal',
    description: 'Contract analysis, case research, and legal document automation',
    monthlyRevenue: '$890K',
    annualPotential: '$10.7M',
    clients: 167,
    growth: '+52%',
    icon: Scale,
    color: 'from-gray-600 to-slate-600',
    bgGradient: 'from-gray-600/10 to-slate-600/10',
    status: 'deploying',
    agentsCount: 10,
    deploymentProgress: 71
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing AI',
    industry: 'Manufacturing',
    description: 'Predictive maintenance, quality control, and supply chain optimization',
    monthlyRevenue: '$3.8M',
    annualPotential: '$45.4M',
    clients: 445,
    growth: '+89%',
    icon: Factory,
    color: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-500/10 to-red-600/10',
    status: 'planning',
    agentsCount: 18,
    deploymentProgress: 23
  },
  {
    id: 'retail',
    title: 'Retail AI',
    industry: 'Retail',
    description: 'Inventory optimization, customer behavior analysis, and sales forecasting',
    monthlyRevenue: '$2.1M',
    annualPotential: '$25.2M',
    clients: 678,
    growth: '+34%',
    icon: ShoppingBag,
    color: 'from-pink-500 to-rose-500',
    bgGradient: 'from-pink-500/10 to-rose-500/10',
    status: 'planning',
    agentsCount: 14,
    deploymentProgress: 15
  },
  {
    id: 'energy',
    title: 'Energy AI',
    industry: 'Energy',
    description: 'Grid optimization, renewable energy forecasting, and efficiency monitoring',
    monthlyRevenue: '$5.2M',
    annualPotential: '$62.4M',
    clients: 123,
    growth: '+112%',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgGradient: 'from-yellow-500/10 to-orange-500/10',
    status: 'planning',
    agentsCount: 22,
    deploymentProgress: 8
  },
  {
    id: 'insurance',
    title: 'Insurance AI',
    industry: 'Insurance',
    description: 'Claims processing, risk assessment, and fraud detection automation',
    monthlyRevenue: '$1.8M',
    annualPotential: '$21.6M',
    clients: 289,
    growth: '+78%',
    icon: Shield,
    color: 'from-blue-600 to-indigo-600',
    bgGradient: 'from-blue-600/10 to-indigo-600/10',
    status: 'planning',
    agentsCount: 11,
    deploymentProgress: 5
  },
  {
    id: 'realestate',
    title: 'Real Estate AI',
    industry: 'Real Estate',
    description: 'Property valuation, market analysis, and transaction automation',
    monthlyRevenue: '$1.3M',
    annualPotential: '$15.6M',
    clients: 567,
    growth: '+45%',
    icon: Home,
    color: 'from-teal-500 to-cyan-500',
    bgGradient: 'from-teal-500/10 to-cyan-500/10',
    status: 'planning',
    agentsCount: 9,
    deploymentProgress: 12
  },
  {
    id: 'government',
    title: 'Government AI',
    industry: 'Government',
    description: 'Public service automation, policy analysis, and citizen engagement',
    monthlyRevenue: '$8.7M',
    annualPotential: '$104M',
    clients: 78,
    growth: '+156%',
    icon: Building,
    color: 'from-indigo-600 to-purple-600',
    bgGradient: 'from-indigo-600/10 to-purple-600/10',
    status: 'planning',
    agentsCount: 25,
    deploymentProgress: 3
  },
  {
    id: 'agriculture',
    title: 'Agriculture AI',
    industry: 'Agriculture',
    description: 'Crop monitoring, yield prediction, and farm management optimization',
    monthlyRevenue: '$920K',
    annualPotential: '$11M',
    clients: 234,
    growth: '+67%',
    icon: Wheat,
    color: 'from-green-600 to-lime-500',
    bgGradient: 'from-green-600/10 to-lime-500/10',
    status: 'planning',
    agentsCount: 7,
    deploymentProgress: 18
  },
  {
    id: 'roofing',
    title: 'Roofing AI',
    industry: 'Roofing & Construction',
    description: 'Complete roofing automation: lead generation, inspections, project management',
    monthlyRevenue: '$378K',
    annualPotential: '$4.5M',
    clients: 147,
    growth: '+89%',
    icon: Construction,
    color: 'from-orange-600 to-red-600',
    bgGradient: 'from-orange-600/10 to-red-600/10',
    status: 'active',
    agentsCount: 9,
    deploymentProgress: 100
  }
];

export default function InteractiveVerticalDashboard() {
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const [hoveredVertical, setHoveredVertical] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = verticalData.reduce((sum, vertical) => {
    return sum + parseFloat(vertical.annualPotential.replace(/[$MK,]/g, '')) * (vertical.annualPotential.includes('M') ? 1000000 : 1000);
  }, 0);

  const activeVerticals = verticalData.filter(v => v.status === 'active').length;
  const totalAgents = verticalData.reduce((sum, v) => sum + v.agentsCount, 0);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Interactive Vertical Dashboard
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
            Complete Industry <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI Domination</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Explore our specialized AI engines across 13 major industries including our newest Roofing AI. Hover over each vertical to see real-time metrics, 
            revenue potential, and autonomous agent performance.
          </p>

          {/* Live Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                ${(totalRevenue / 1000000).toFixed(1)}M
              </div>
              <div className="text-slate-300 text-sm">Total Annual Potential</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">{activeVerticals}/12</div>
              <div className="text-slate-300 text-sm">Active Verticals</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm p-6 rounded-xl border border-green-500/20">
              <div className="text-3xl font-bold text-green-400 mb-2">{totalAgents}</div>
              <div className="text-slate-300 text-sm">AI Agents Deployed</div>
            </div>
          </div>
        </div>

        {/* Vertical Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {verticalData.map((vertical) => {
            const isHovered = hoveredVertical === vertical.id;
            const isSelected = selectedVertical === vertical.id;
            
            return (
              <Card
                key={vertical.id}
                className={`group relative overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                  isHovered || isSelected 
                    ? 'bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-cyan-400/50 shadow-xl shadow-cyan-400/20' 
                    : 'bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700 hover:border-slate-600'
                }`}
                onMouseEnter={() => setHoveredVertical(vertical.id)}
                onMouseLeave={() => setHoveredVertical(null)}
                onClick={() => setSelectedVertical(isSelected ? null : vertical.id)}
              >
                {/* Animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${vertical.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Status indicator */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={vertical.status === 'active' ? 'default' : vertical.status === 'deploying' ? 'secondary' : 'outline'}
                    className={`text-xs ${
                      vertical.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      vertical.status === 'deploying' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }`}
                  >
                    {vertical.status}
                  </Badge>
                </div>

                <CardContent className="relative p-6">
                  {/* Icon and header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${vertical.color} group-hover:scale-110 transition-transform duration-300`}>
                      <vertical.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {vertical.title}
                      </h3>
                      <p className="text-slate-400 text-sm">{vertical.industry}</p>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed">
                      {vertical.description}
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700">
                      <div>
                        <div className="text-lg font-bold text-green-400">{vertical.monthlyRevenue}</div>
                        <div className="text-xs text-slate-400">Monthly</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-400">{vertical.annualPotential}</div>
                        <div className="text-xs text-slate-400">Annual</div>
                      </div>
                    </div>

                    {/* Progress and agents */}
                    {(isHovered || isSelected) && (
                      <div className="space-y-3 pt-3 border-t border-slate-600">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Deployment Progress</span>
                          <span className="text-cyan-400 font-medium">{vertical.deploymentProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${vertical.color} transition-all duration-1000`}
                            style={{ width: `${vertical.deploymentProgress}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">{vertical.clients} clients</span>
                          <span className="text-green-400 font-medium">{vertical.growth} growth</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">AI Agents</span>
                          <span className="text-cyan-400 font-medium">{vertical.agentsCount} active</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/20">
            <div className="text-sm text-slate-300">
              <span className="font-semibold text-cyan-400">12 Industry Engines</span> • 
              <span className="font-semibold text-green-400">${(totalRevenue / 1000000).toFixed(1)}M Revenue Potential</span> • 
              <span className="font-semibold text-purple-400">{totalAgents} AI Agents</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}