import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
  Clock,
  Brain,
  Search,
  Calculator,
  Award,
  ArrowUp,
  ArrowDown,
  Eye,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';

export default function LostRevenueRecovery() {
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  // Fetch revenue recovery data
  const { data: opportunities } = useQuery({
    queryKey: ['/api/revenue-recovery/opportunities'],
    refetchInterval: 30000
  });

  const { data: clientProfiles } = useQuery({
    queryKey: ['/api/revenue-recovery/client-profiles'],
    refetchInterval: 60000
  });

  const { data: metrics } = useQuery({
    queryKey: ['/api/revenue-recovery/metrics'],
    refetchInterval: 30000
  });

  const { data: automationCalculations } = useQuery({
    queryKey: ['/api/revenue-recovery/automation-calculations'],
    refetchInterval: 60000
  });

  // Sample data for charts
  const revenueRecoveryTrend = [
    { month: 'Jan', recovered: 125000, identified: 180000, potential: 340000 },
    { month: 'Feb', recovered: 156000, identified: 210000, potential: 420000 },
    { month: 'Mar', recovered: 189000, identified: 245000, potential: 380000 },
    { month: 'Apr', recovered: 234000, identified: 290000, potential: 560000 },
    { month: 'May', recovered: 278000, identified: 320000, potential: 620000 },
    { month: 'Jun', recovered: 425000, identified: 450000, potential: 750000 }
  ];

  const opportunityTypes = [
    { name: 'Lost Billable Time', value: 35, amount: 875000, color: '#ef4444' },
    { name: 'Pricing Optimization', value: 28, amount: 700000, color: '#f59e0b' },
    { name: 'Process Automation', value: 22, amount: 550000, color: '#10b981' },
    { name: 'Upselling', value: 15, amount: 375000, color: '#3b82f6' }
  ];

  const industryPerformance = [
    { industry: 'Professional Services', recovery_rate: 94.2, avg_roi: 3.4, total_recovered: 450000 },
    { industry: 'Healthcare', recovery_rate: 89.7, avg_roi: 2.8, total_recovered: 380000 },
    { industry: 'Financial Services', recovery_rate: 91.3, avg_roi: 4.1, total_recovered: 620000 },
    { industry: 'Manufacturing', recovery_rate: 87.6, avg_roi: 3.7, total_recovered: 590000 },
    { industry: 'Legal', recovery_rate: 92.8, avg_roi: 3.2, total_recovered: 340000 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified': return 'bg-yellow-600';
      case 'analyzing': return 'bg-blue-600';
      case 'ready': return 'bg-green-600';
      case 'implementing': return 'bg-purple-600';
      case 'completed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 90) return 'text-red-400';
    if (priority >= 80) return 'text-orange-400';
    if (priority >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              Lost Revenue Recovery Engine
            </h1>
            <p className="text-slate-400 mt-2">
              Maximum revenue extraction and lost opportunity capture
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-slate-600">
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan for New Opportunities
            </Button>
            <Button className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700">
              <Download className="h-4 w-4 mr-2" />
              Generate Recovery Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Lost Revenue</p>
                  <p className="text-2xl font-bold text-red-400">
                    ${metrics?.total_lost_revenue?.toLocaleString() || '2,750,000'}
                  </p>
                  <p className="text-xs text-red-400">Critical attention needed</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Recovery Potential</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${metrics?.total_recovery_potential?.toLocaleString() || '2,200,000'}
                  </p>
                  <p className="text-xs text-green-400">80% recoverable</p>
                </div>
                <Target className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Opportunities</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {metrics?.total_opportunities || 47}
                  </p>
                  <p className="text-xs text-orange-400">{metrics?.high_priority_opportunities || 12} high priority</p>
                </div>
                <Search className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Average ROI</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {((metrics?.average_roi || 2.8) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-purple-400">Exceptional returns</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Monthly Recovered</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    ${metrics?.monthly_revenue_recovered?.toLocaleString() || '425,000'}
                  </p>
                  <p className="text-xs text-cyan-400">+34% vs last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Recovery Trend Chart */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Revenue Recovery Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={revenueRecoveryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="potential" 
                  stackId="1"
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.3}
                  name="Recovery Potential"
                />
                <Area 
                  type="monotone" 
                  dataKey="identified" 
                  stackId="2"
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.4}
                  name="Lost Revenue Identified"
                />
                <Area 
                  type="monotone" 
                  dataKey="recovered" 
                  stackId="3"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  name="Revenue Recovered"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Opportunity Types Breakdown */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Revenue Leak Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={opportunityTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {opportunityTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {opportunityTypes.map((type, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="text-sm">{type.name}</span>
                    </div>
                    <span className="text-sm font-medium text-white">
                      ${type.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Industry Performance */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Industry Recovery Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {industryPerformance.map((industry, index) => (
                  <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-white">{industry.industry}</h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-green-400">
                          {industry.recovery_rate}% success
                        </span>
                        <span className="text-sm text-blue-400">
                          {industry.avg_roi}x ROI
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress value={industry.recovery_rate} className="flex-1 mr-4" />
                      <span className="text-sm font-medium text-cyan-400">
                        ${industry.total_recovered.toLocaleString()} recovered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Opportunities Table */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              High-Priority Revenue Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-3 text-slate-400">Opportunity</th>
                    <th className="text-left p-3 text-slate-400">Industry</th>
                    <th className="text-left p-3 text-slate-400">Type</th>
                    <th className="text-left p-3 text-slate-400">Lost Revenue</th>
                    <th className="text-left p-3 text-slate-400">Recovery Potential</th>
                    <th className="text-left p-3 text-slate-400">Priority</th>
                    <th className="text-left p-3 text-slate-400">Status</th>
                    <th className="text-left p-3 text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities?.slice(0, 10).map((opp: any, index: number) => (
                    <tr key={opp.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="p-3 font-medium text-white">
                        {opp.client_id.replace('client_', '').replace('_', ' ').toUpperCase()}
                      </td>
                      <td className="p-3 text-slate-300 capitalize">
                        {opp.industry.replace('_', ' ')}
                      </td>
                      <td className="p-3 text-slate-300 capitalize">
                        {opp.opportunity_type.replace('_', ' ')}
                      </td>
                      <td className="p-3 text-red-400 font-medium">
                        ${opp.current_revenue_loss.toLocaleString()}
                      </td>
                      <td className="p-3 text-green-400 font-medium">
                        ${opp.potential_recovery.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className={`font-medium ${getPriorityColor(opp.priority_score)}`}>
                          {opp.priority_score}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge className={`${getStatusColor(opp.status)} text-white border-0`}>
                          {opp.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Zap className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Automation ROI Calculations */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Automation ROI Calculations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {automationCalculations?.map((calc: any, index: number) => (
                <div key={index} className="p-6 bg-slate-700/50 rounded-lg">
                  <h3 className="font-medium text-white mb-4">{calc.process_name}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Cost:</span>
                      <span className="text-red-400">${calc.current_cost.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Automation Cost:</span>
                      <span className="text-orange-400">${calc.automation_cost.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Annual Savings:</span>
                      <span className="text-green-400">${calc.annual_savings.toLocaleString()}</span>
                    </div>
                    
                    <div className="border-t border-slate-600 pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400">ROI:</span>
                        <span className="text-2xl font-bold text-cyan-400">
                          {calc.roi_percentage.toFixed(0)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payback Period:</span>
                        <span className="text-purple-400">{calc.payback_period_months.toFixed(1)} months</span>
                      </div>
                    </div>
                    
                    <div className="pt-3">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                        Implement Automation
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}