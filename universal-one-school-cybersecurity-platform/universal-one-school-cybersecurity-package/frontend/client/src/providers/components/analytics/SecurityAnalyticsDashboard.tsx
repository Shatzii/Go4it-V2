import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  Calendar,
  BarChart3,
  FileSpreadsheet,
  RefreshCw,
  AlertTriangle,
  Shield,
  ShieldOff,
  Clock,
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download,
  Info
} from 'lucide-react';

// Sample data interfaces
interface SecurityTrend {
  date: string;
  threats: number;
  alerts: number;
  incidents: number;
  mitigations: number;
}

interface ThreatTypeData {
  name: string;
  value: number;
  color: string;
}

interface AttackVectorData {
  name: string;
  count: number;
  color: string;
}

interface SecurityScoreData {
  name: string;
  score: number;
  optimum: number;
}

interface AnomalyData {
  timeLabel: string;
  networkAnomaly: number;
  userAnomaly: number;
  systemAnomaly: number;
}

interface RiskAssessment {
  category: string;
  score: number;
  previousScore: number;
  change: number;
  status: 'improved' | 'worsened' | 'unchanged';
}

interface AlertTrendItem {
  hour: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export function SecurityAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Generate sample data for demo purposes
  const generateSampleData = () => {
    // Generate historical data based on selected time range
    const daysToGenerate = 
      timeRange === '1d' ? 1 : 
      timeRange === '7d' ? 7 : 
      timeRange === '30d' ? 30 : 
      timeRange === '90d' ? 90 : 
      timeRange === '1y' ? 365 : 7;
    
    // Security trends data
    const securityTrends: SecurityTrend[] = [];
    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (daysToGenerate - 1 - i));
      
      // Generate some realistic-looking but random data
      const baseThreats = 3 + Math.floor(Math.random() * 5);
      const baseAlerts = 10 + Math.floor(Math.random() * 15);
      const baseMitigations = 2 + Math.floor(Math.random() * 4);
      
      // Add a spike on certain days to make the data more interesting
      const isSpike = Math.random() < 0.2;
      const spikeMultiplier = isSpike ? 2.5 : 1;
      
      securityTrends.push({
        date: date.toISOString().split('T')[0],
        threats: Math.round(baseThreats * spikeMultiplier),
        alerts: Math.round(baseAlerts * spikeMultiplier),
        incidents: Math.round((baseThreats * 0.4) * spikeMultiplier),
        mitigations: baseMitigations
      });
    }
    
    // Threat type distribution
    const threatTypes: ThreatTypeData[] = [
      { name: 'Malware', value: 35, color: '#FF5252' },
      { name: 'Phishing', value: 25, color: '#FF9800' },
      { name: 'Data Breach', value: 15, color: '#FFC107' },
      { name: 'DDoS', value: 10, color: '#7E57C2' },
      { name: 'Insider', value: 8, color: '#2196F3' },
      { name: 'Ransomware', value: 7, color: '#F44336' }
    ];
    
    // Attack vector data
    const attackVectors: AttackVectorData[] = [
      { name: 'Email', count: 42, color: '#4CAF50' },
      { name: 'Web', count: 38, color: '#2196F3' },
      { name: 'Network', count: 27, color: '#FF9800' },
      { name: 'Social', count: 21, color: '#9C27B0' },
      { name: 'Physical', count: 12, color: '#795548' },
      { name: 'Supply Chain', count: 8, color: '#607D8B' }
    ];
    
    // Security score data for radar chart
    const securityScores: SecurityScoreData[] = [
      { name: 'Network', score: 80, optimum: 100 },
      { name: 'Endpoint', score: 75, optimum: 100 },
      { name: 'Data', score: 90, optimum: 100 },
      { name: 'Application', score: 70, optimum: 100 },
      { name: 'Identity', score: 85, optimum: 100 },
      { name: 'Cloud', score: 65, optimum: 100 },
      { name: 'Compliance', score: 85, optimum: 100 },
    ];
    
    // Anomaly detection data
    const anomalyData: AnomalyData[] = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      
      // Generate different patterns for different types of anomalies
      const timeOfDay = i / 24;
      const workHoursEffect = (i >= 8 && i <= 17) ? 0.6 : 1.4; // Less anomalies during work hours
      
      anomalyData.push({
        timeLabel: hour,
        networkAnomaly: Math.round(5 + 10 * Math.sin(timeOfDay * Math.PI * 2) * workHoursEffect),
        userAnomaly: Math.round(8 * workHoursEffect + Math.random() * 5),
        systemAnomaly: Math.round(3 + Math.random() * 7 * workHoursEffect)
      });
    }
    
    // Risk assessment data
    const riskAssessments: RiskAssessment[] = [
      { 
        category: 'Overall Security Posture', 
        score: 78, 
        previousScore: 74, 
        change: 4,
        status: 'improved'
      },
      { 
        category: 'Threat Detection', 
        score: 82, 
        previousScore: 79, 
        change: 3,
        status: 'improved'
      },
      { 
        category: 'Vulnerability Management', 
        score: 65, 
        previousScore: 70, 
        change: -5,
        status: 'worsened'
      },
      { 
        category: 'Security Awareness', 
        score: 72, 
        previousScore: 68, 
        change: 4,
        status: 'improved'
      },
      { 
        category: 'Incident Response', 
        score: 85, 
        previousScore: 85, 
        change: 0,
        status: 'unchanged'
      },
      { 
        category: 'Data Protection', 
        score: 79, 
        previousScore: 75, 
        change: 4,
        status: 'improved'
      }
    ];
    
    // Hourly alert trends
    const alertTrends: AlertTrendItem[] = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      const baseValue = Math.sin(i / 24 * Math.PI * 2) * 5 + 5;
      
      // Generate different patterns for different severity levels
      alertTrends.push({
        hour,
        critical: Math.max(0, Math.round(baseValue * 0.2 + Math.random() * 2)),
        high: Math.max(0, Math.round(baseValue * 0.4 + Math.random() * 3)),
        medium: Math.max(0, Math.round(baseValue * 0.6 + Math.random() * 4)),
        low: Math.max(0, Math.round(baseValue * 0.8 + Math.random() * 5))
      });
    }
    
    return {
      securityTrends,
      threatTypes,
      attackVectors,
      securityScores,
      anomalyData,
      riskAssessments,
      alertTrends
    };
  };
  
  // Use React Query to fetch data (simulated for now)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['security-analytics', timeRange],
    queryFn: () => {
      // This would normally fetch from an API based on the time range
      return Promise.resolve(generateSampleData());
    }
  });
  
  // Calculate summary stats
  const calculateSummaryStats = () => {
    if (!data) return null;
    
    const trends = data.securityTrends;
    
    const totalThreats = trends.reduce((sum, item) => sum + item.threats, 0);
    const totalAlerts = trends.reduce((sum, item) => sum + item.alerts, 0);
    const totalIncidents = trends.reduce((sum, item) => sum + item.incidents, 0);
    const totalMitigations = trends.reduce((sum, item) => sum + item.mitigations, 0);
    
    const averageThreatsPerDay = totalThreats / trends.length;
    const averageAlertsPerDay = totalAlerts / trends.length;
    
    // Compare with previous period
    const midPoint = Math.floor(trends.length / 2);
    const recentPeriod = trends.slice(midPoint);
    const previousPeriod = trends.slice(0, midPoint);
    
    const recentThreats = recentPeriod.reduce((sum, item) => sum + item.threats, 0);
    const previousThreats = previousPeriod.reduce((sum, item) => sum + item.threats, 0);
    const threatTrend = previousThreats === 0 ? 0 : ((recentThreats - previousThreats) / previousThreats) * 100;
    
    const recentAlerts = recentPeriod.reduce((sum, item) => sum + item.alerts, 0);
    const previousAlerts = previousPeriod.reduce((sum, item) => sum + item.alerts, 0);
    const alertTrend = previousAlerts === 0 ? 0 : ((recentAlerts - previousAlerts) / previousAlerts) * 100;
    
    // Risk score calculation (weighted average of various factors)
    const riskScore = Math.round(
      (data.riskAssessments.reduce((sum, item) => sum + item.score, 0) / data.riskAssessments.length) 
    );
    
    // Vulnerability Index (inverse of security score, weighted)
    const vulnerabilityIndex = Math.round(
      100 - (data.securityScores.reduce((sum, item) => sum + item.score, 0) / data.securityScores.length)
    );
    
    return {
      totalThreats,
      totalAlerts,
      totalIncidents,
      totalMitigations,
      averageThreatsPerDay,
      averageAlertsPerDay,
      threatTrend,
      alertTrend,
      riskScore,
      vulnerabilityIndex,
      meanTimeToDetect: 2.4, // Hours, for demo
      meanTimeToResolve: 5.8 // Hours, for demo
    };
  };
  
  const summaryStats = calculateSummaryStats();
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-2 rounded-md shadow-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <BarChart3 className="mr-2 h-6 w-6" />
            Security Analytics
          </h2>
          <p className="text-gray-400">
            Advanced insights and trend analysis for your security posture
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <RefreshCw className="h-10 w-10 animate-spin text-gray-500" />
        </div>
      ) : (
        <>
          {/* Key Metrics Overview */}
          {summaryStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Risk Score</span>
                    <Badge 
                      className={summaryStats.riskScore <= 25 ? 'bg-green-600' : 
                                summaryStats.riskScore <= 50 ? 'bg-amber-600' : 
                                summaryStats.riskScore <= 75 ? 'bg-orange-600' : 'bg-red-600'}
                    >
                      {summaryStats.riskScore <= 25 ? 'Low' : 
                      summaryStats.riskScore <= 50 ? 'Medium' : 
                      summaryStats.riskScore <= 75 ? 'High' : 'Critical'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-indigo-600">
                      <span className="text-2xl font-bold">{summaryStats.riskScore}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-400">Composite score from:</div>
                      <ul className="text-sm list-disc list-inside">
                        <li>Threat severity</li>
                        <li>Exposure level</li>
                        <li>Detection capacity</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Security Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-3xl font-bold">{summaryStats.totalIncidents}</div>
                      <div className="text-sm text-gray-400 flex items-center mt-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {summaryStats.threatTrend > 0 
                          ? <span className="text-red-400">+{summaryStats.threatTrend.toFixed(1)}%</span>
                          : <span className="text-green-400">{summaryStats.threatTrend.toFixed(1)}%</span>
                        }
                        <span className="ml-1">vs previous</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{summaryStats.totalMitigations}</div>
                      <div className="text-sm text-gray-400 mt-1">Mitigated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Mean Time to Respond</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{summaryStats.meanTimeToResolve.toFixed(1)}h</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-400">Detection</div>
                      <div className="font-medium flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {summaryStats.meanTimeToDetect.toFixed(1)}h
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Resolution</div>
                      <div className="font-medium flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        {(summaryStats.meanTimeToResolve - summaryStats.meanTimeToDetect).toFixed(1)}h
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Vulnerability Index</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <div className="text-3xl font-bold mb-1">{summaryStats.vulnerabilityIndex}</div>
                    <div className="text-sm text-gray-400">Risk exposure level</div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        summaryStats.vulnerabilityIndex <= 25 ? 'bg-green-600' : 
                        summaryStats.vulnerabilityIndex <= 50 ? 'bg-amber-600' : 
                        summaryStats.vulnerabilityIndex <= 75 ? 'bg-orange-600' : 'bg-red-600'
                      }`} 
                      style={{ width: `${summaryStats.vulnerabilityIndex}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Analytics Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="overview">
                <BarChart2 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="threats">
                <ShieldOff className="h-4 w-4 mr-2" />
                Threat Analysis
              </TabsTrigger>
              <TabsTrigger value="trends">
                <LineChartIcon className="h-4 w-4 mr-2" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="posture">
                <Shield className="h-4 w-4 mr-2" />
                Security Posture
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Security Trends Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <LineChartIcon className="h-5 w-5 mr-2" />
                      Security Events Over Time
                    </CardTitle>
                    <CardDescription>
                      Trends of threats, alerts, incidents, and mitigations over the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={data?.securityTrends}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="date" stroke="#888" />
                          <YAxis stroke="#888" />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line type="monotone" dataKey="threats" stroke="#FF5252" strokeWidth={2} dot={{ r: 3 }} name="Threats" />
                          <Line type="monotone" dataKey="alerts" stroke="#FFC107" strokeWidth={2} dot={{ r: 3 }} name="Alerts" />
                          <Line type="monotone" dataKey="incidents" stroke="#F44336" strokeWidth={2} dot={{ r: 3 }} name="Incidents" />
                          <Line type="monotone" dataKey="mitigations" stroke="#4CAF50" strokeWidth={2} dot={{ r: 3 }} name="Mitigations" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Threat Types Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <PieChartIcon className="h-5 w-5 mr-2" />
                      Threat Type Distribution
                    </CardTitle>
                    <CardDescription>
                      Breakdown of security threats by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data?.threatTypes}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {data?.threatTypes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Alert Activity by Hour */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BarChart2 className="h-5 w-5 mr-2" />
                      Alert Activity by Hour
                    </CardTitle>
                    <CardDescription>
                      24-hour distribution of alerts by severity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data?.alertTrends}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="hour" stroke="#888" />
                          <YAxis stroke="#888" />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="critical" name="Critical" stackId="a" fill="#F44336" />
                          <Bar dataKey="high" name="High" stackId="a" fill="#FF9800" />
                          <Bar dataKey="medium" name="Medium" stackId="a" fill="#FFC107" />
                          <Bar dataKey="low" name="Low" stackId="a" fill="#4CAF50" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Risk Assessment Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription>
                    Security posture evaluation across critical dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 font-medium text-gray-300">Category</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-300">Score</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-300">Previous</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-300">Change</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-300">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.riskAssessments.map((item, index) => (
                          <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="py-3 px-4 text-left">{item.category}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center">
                                <div className="w-full bg-gray-700 rounded-full h-2 max-w-[100px]">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      item.score >= 80 ? 'bg-green-600' : 
                                      item.score >= 60 ? 'bg-amber-600' : 
                                      item.score >= 40 ? 'bg-orange-600' : 'bg-red-600'
                                    }`} 
                                    style={{ width: `${item.score}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2">{item.score}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">{item.previousScore}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`
                                ${item.status === 'improved' ? 'text-green-400' : ''}
                                ${item.status === 'worsened' ? 'text-red-400' : ''}
                                ${item.status === 'unchanged' ? 'text-gray-400' : ''}
                              `}>
                                {item.change > 0 ? '+' : ''}{item.change}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Badge className={`
                                ${item.status === 'improved' ? 'bg-green-600' : ''}
                                ${item.status === 'worsened' ? 'bg-red-600' : ''}
                                ${item.status === 'unchanged' ? 'bg-gray-600' : ''}
                              `}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Threat Analysis Tab */}
            <TabsContent value="threats" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Attack Vectors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <ShieldOff className="h-5 w-5 mr-2" />
                      Attack Vectors
                    </CardTitle>
                    <CardDescription>
                      Distribution of threat entry points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data?.attackVectors}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis type="number" stroke="#888" />
                          <YAxis dataKey="name" type="category" stroke="#888" />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="count" name="Count">
                            {data?.attackVectors.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Anomaly Detection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Anomaly Detection
                    </CardTitle>
                    <CardDescription>
                      Behavioral anomalies across different systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={data?.anomalyData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="timeLabel" stroke="#888" />
                          <YAxis stroke="#888" />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend />
                          <Area type="monotone" dataKey="networkAnomaly" stackId="1" stroke="#2196F3" fill="#2196F3" name="Network" />
                          <Area type="monotone" dataKey="userAnomaly" stackId="1" stroke="#FFC107" fill="#FFC107" name="User" />
                          <Area type="monotone" dataKey="systemAnomaly" stackId="1" stroke="#9C27B0" fill="#9C27B0" name="System" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Additional threat analysis components would go here */}
              </div>
            </TabsContent>
            
            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-4">
              {/* Security trends analysis components would go here */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2" />
                    Long-term Security Trends
                  </CardTitle>
                  <CardDescription>
                    Analysis of security metrics over the selected time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data?.securityTrends}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="threats" 
                          stroke="#FF5252" 
                          strokeWidth={2} 
                          dot={{ r: 3 }} 
                          name="Threats" 
                          activeDot={{ r: 8 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="alerts" 
                          stroke="#FFC107" 
                          strokeWidth={2} 
                          dot={{ r: 3 }} 
                          name="Alerts" 
                          activeDot={{ r: 8 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="incidents" 
                          stroke="#F44336" 
                          strokeWidth={2} 
                          dot={{ r: 3 }} 
                          name="Incidents" 
                          activeDot={{ r: 8 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="mitigations" 
                          stroke="#4CAF50" 
                          strokeWidth={2} 
                          dot={{ r: 3 }} 
                          name="Mitigations" 
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Posture Tab */}
            <TabsContent value="posture" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Security Score Radar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Security Posture Assessment
                    </CardTitle>
                    <CardDescription>
                      Radar chart of security measures effectiveness
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={130} width={500} height={300} data={data?.securityScores}>
                          <PolarGrid stroke="#666" />
                          <PolarAngleAxis dataKey="name" tick={{ fill: '#888' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#888' }} />
                          <Radar name="Current" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                          <Radar name="Target" dataKey="optimum" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                          <Legend />
                          <RechartsTooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Additional security posture components would go here */}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF Report
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Raw Data
            </Button>
          </div>
        </>
      )}
    </div>
  );
}