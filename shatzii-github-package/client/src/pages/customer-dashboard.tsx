import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Search,
  Filter,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Eye,
  Star,
  Zap,
  BarChart3,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Youtube
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email?: string;
  company?: string;
  role?: string;
  platform: string;
  score: number;
  priority: 'hot' | 'warm' | 'cold';
  contactStatus: string;
  potentialValue: number;
  conversionProbability: number;
  discoveryDate: string;
  lastActivity: string;
  socialMetrics: {
    followers: number;
    engagement_rate: number;
    influence_score: number;
  };
  painPoints: string[];
  techStack: string[];
  assignedAgent: string;
  nextAction: string;
}

export default function CustomerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Fetch customers data
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['/api/customers'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: metrics } = useQuery({
    queryKey: ['/api/customers/metrics'],
    refetchInterval: 60000 // Refresh every minute
  });

  // Customer status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ customerId, status }: { customerId: string; status: string }) => 
      apiRequest(`/api/customers/${customerId}/status`, { 
        method: 'PUT', 
        body: JSON.stringify({ status }) 
      }),
    onSuccess: () => {
      toast({ title: 'Customer status updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
    }
  });

  // Contact attempt mutation
  const recordContactMutation = useMutation({
    mutationFn: ({ customerId, method, message }: { customerId: string; method: string; message: string }) => 
      apiRequest(`/api/customers/${customerId}/contact`, { 
        method: 'POST', 
        body: JSON.stringify({ method, message }) 
      }),
    onSuccess: () => {
      toast({ title: 'Contact attempt recorded' });
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
    }
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin advanced':
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'github': return <Github className="h-4 w-4" />;
      case 'twitter/x':
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-yellow-500';
      case 'cold': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted': return 'bg-green-500';
      case 'qualified': return 'bg-blue-500';
      case 'contacted': return 'bg-purple-500';
      case 'attempted': return 'bg-yellow-500';
      case 'discovered': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredCustomers = customers.filter((customer: Customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.platform.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlatform = platformFilter === 'all' || customer.platform === platformFilter;
    const matchesPriority = priorityFilter === 'all' || customer.priority === priorityFilter;
    
    return matchesSearch && matchesPlatform && matchesPriority;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-cyan-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-300">Loading customer database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Customer Discovery Database
            </h1>
            <p className="text-slate-400 mt-2">
              Comprehensive tracking of all discovered prospects across social platforms
            </p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
            <Target className="h-4 w-4 mr-2" />
            Export Database
          </Button>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Customers</p>
                    <p className="text-2xl font-bold text-cyan-400">{metrics.totalCustomers}</p>
                  </div>
                  <Users className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Hot Prospects</p>
                    <p className="text-2xl font-bold text-red-400">{metrics.priorityBreakdown?.hot || 0}</p>
                  </div>
                  <Star className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Potential Value</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${metrics.totalPotentialValue?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Avg. Lead Score</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {metrics.averageScore?.toFixed(1) || '0'}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600"
                />
              </div>
              
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="LinkedIn Advanced">LinkedIn Advanced</SelectItem>
                  <SelectItem value="GitHub">GitHub</SelectItem>
                  <SelectItem value="Twitter/X">Twitter/X</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Stack Overflow">Stack Overflow</SelectItem>
                  <SelectItem value="ProductHunt">ProductHunt</SelectItem>
                  <SelectItem value="Indie Hackers">Indie Hackers</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-slate-600">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer List */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Discovered Customers ({filteredCustomers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-6 max-h-96 overflow-y-auto">
                  {filteredCustomers.map((customer: Customer) => (
                    <div
                      key={customer.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedCustomer?.id === customer.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700'
                      }`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getPlatformIcon(customer.platform)}
                          <div>
                            <h3 className="font-medium text-white">{customer.name}</h3>
                            <p className="text-sm text-slate-400">{customer.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="secondary" 
                            className={`${getPriorityColor(customer.priority)} text-white border-0`}
                          >
                            {customer.priority}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(customer.contactStatus)} text-white border-0`}
                          >
                            {customer.contactStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Score</p>
                          <p className="font-medium">{customer.score}/100</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Value</p>
                          <p className="font-medium">${customer.potentialValue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Conversion</p>
                          <p className="font-medium">{customer.conversionProbability}%</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Progress value={customer.score} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Details */}
          <div className="lg:col-span-1">
            {selectedCustomer ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-cyan-400 flex items-center">
                      {getPlatformIcon(selectedCustomer.platform)}
                      <span className="ml-2">{selectedCustomer.name}</span>
                    </CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={`${getPriorityColor(selectedCustomer.priority)} text-white border-0`}
                    >
                      {selectedCustomer.priority}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="social">Social</TabsTrigger>
                      <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Contact Information</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-slate-400">Email:</span> {selectedCustomer.email}</p>
                          <p><span className="text-slate-400">Role:</span> {selectedCustomer.role}</p>
                          <p><span className="text-slate-400">Platform:</span> {selectedCustomer.platform}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Business Intelligence</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Pain Points</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedCustomer.painPoints.map((point, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-slate-600">
                                  {point}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Tech Stack</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedCustomer.techStack.map((tech, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-slate-700">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Last Activity</h4>
                        <p className="text-sm text-slate-300">{selectedCustomer.lastActivity}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="social" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4 text-center">
                            <p className="text-lg font-bold text-cyan-400">
                              {selectedCustomer.socialMetrics.followers.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400">Followers</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4 text-center">
                            <p className="text-lg font-bold text-green-400">
                              {selectedCustomer.socialMetrics.engagement_rate}%
                            </p>
                            <p className="text-xs text-slate-400">Engagement</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Influence Score</p>
                        <Progress value={selectedCustomer.socialMetrics.influence_score} className="h-3" />
                        <p className="text-xs text-slate-400 mt-1">
                          {selectedCustomer.socialMetrics.influence_score}/100
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Conversion Probability</p>
                        <Progress value={selectedCustomer.conversionProbability} className="h-3" />
                        <p className="text-xs text-slate-400 mt-1">
                          {selectedCustomer.conversionProbability}%
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="actions" className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Assigned Agent</h4>
                        <p className="text-sm text-slate-300">{selectedCustomer.assignedAgent}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Next Action</h4>
                        <p className="text-sm text-slate-300">{selectedCustomer.nextAction}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => recordContactMutation.mutate({
                            customerId: selectedCustomer.id,
                            method: 'email',
                            message: 'Initial outreach email sent'
                          })}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => recordContactMutation.mutate({
                            customerId: selectedCustomer.id,
                            method: 'linkedin',
                            message: 'LinkedIn connection request sent'
                          })}
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn Connect
                        </Button>
                        
                        <Button 
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => updateStatusMutation.mutate({
                            customerId: selectedCustomer.id,
                            status: 'contacted'
                          })}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Mark Contacted
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Select a customer to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}