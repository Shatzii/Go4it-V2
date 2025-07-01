import { useState } from 'react';
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
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  Linkedin,
  Calendar,
  Star,
  Target,
  Database
} from 'lucide-react';

interface Contact {
  name: string;
  title: string;
  email: string;
  linkedin: string;
  department: string;
  verified: boolean;
  lastVerified: string;
  status: 'active' | 'left_company' | 'changed_role' | 'email_bounced';
}

interface EnterpriseProspect {
  id: string;
  company: string;
  industry: string;
  size: string;
  revenue: string;
  headquarters: string;
  website: string;
  potentialValue: number;
  priority: 'hot' | 'warm' | 'cold';
  status: string;
  contactAttempts: number;
  nextActionDate: string;
  lastUpdated: string;
  verificationStatus: 'verified' | 'needs_update' | 'failed_verification';
  contacts: Contact[];
}

export default function EnterpriseProspects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProspect, setSelectedProspect] = useState<EnterpriseProspect | null>(null);

  // Fetch enterprise prospects
  const { data: prospects = [], isLoading } = useQuery({
    queryKey: ['/api/enterprise/prospects'],
    refetchInterval: 60000 // Refresh every minute
  });

  // Fetch verification stats
  const { data: verificationStats } = useQuery({
    queryKey: ['/api/enterprise/verification-stats'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch contact updates
  const { data: contactUpdates = [] } = useQuery({
    queryKey: ['/api/enterprise/contact-updates'],
    refetchInterval: 60000 // Refresh every minute
  });

  // Manual verification mutation
  const verifyProspectMutation = useMutation({
    mutationFn: (prospectId: string) => 
      apiRequest(`/api/enterprise/verify/${prospectId}`, { method: 'POST' }),
    onSuccess: () => {
      toast({ title: 'Verification started', description: 'Contact verification is running in the background' });
      queryClient.invalidateQueries({ queryKey: ['/api/enterprise/prospects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/enterprise/verification-stats'] });
    }
  });

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
      case 'responded': return 'bg-green-500';
      case 'contacted': return 'bg-blue-500';
      case 'meeting_scheduled': return 'bg-purple-500';
      case 'new': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'needs_update': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'failed_verification': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredProspects = prospects.filter((prospect: EnterpriseProspect) => {
    const matchesSearch = prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || prospect.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-cyan-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-300">Loading enterprise prospects...</p>
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
              Enterprise Prospects Database
            </h1>
            <p className="text-slate-400 mt-2">
              Top 200 companies with automated verification and monthly expansion
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            onClick={() => verifyProspectMutation.mutate('all')}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Verification
          </Button>
        </div>

        {/* Verification Stats */}
        {verificationStats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Prospects</p>
                    <p className="text-2xl font-bold text-cyan-400">{verificationStats.totalProspects}</p>
                  </div>
                  <Database className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Verified Contacts</p>
                    <p className="text-2xl font-bold text-green-400">{verificationStats.verifiedContacts}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Need Verification</p>
                    <p className="text-2xl font-bold text-yellow-400">{verificationStats.needingVerification}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Monthly New</p>
                    <p className="text-2xl font-bold text-purple-400">{verificationStats.monthlyNewProspects}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Accuracy</p>
                    <p className="text-2xl font-bold text-blue-400">{verificationStats.verificationAccuracy}%</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Updates */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Recent Contact Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contactUpdates.slice(0, 5).map((update: any) => (
                <div key={update.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      update.type === 'new_contact' ? 'bg-green-400' :
                      update.type === 'role_change' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <div>
                      <p className="font-medium">{update.company}</p>
                      <p className="text-sm text-slate-400">
                        {update.type === 'new_contact' && `New contact: ${update.contactName} - ${update.title}`}
                        {update.type === 'role_change' && `${update.contactName}: ${update.oldTitle} → ${update.newTitle}`}
                        {update.type === 'contact_left' && `${update.contactName} left the company`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">
                      {new Date(update.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {Math.round(update.confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600"
                />
              </div>
              
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
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-slate-600">
                <Calendar className="h-4 w-4 mr-2" />
                Export Database
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prospects List */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Enterprise Prospects ({filteredProspects.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-6 max-h-96 overflow-y-auto">
                  {filteredProspects.map((prospect: EnterpriseProspect) => (
                    <div
                      key={prospect.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedProspect?.id === prospect.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700'
                      }`}
                      onClick={() => setSelectedProspect(prospect)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Building2 className="h-5 w-5 text-slate-400" />
                          <div>
                            <h3 className="font-medium text-white">{prospect.company}</h3>
                            <p className="text-sm text-slate-400">{prospect.industry}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getVerificationStatusIcon(prospect.verificationStatus)}
                          <Badge 
                            variant="secondary" 
                            className={`${getPriorityColor(prospect.priority)} text-white border-0`}
                          >
                            {prospect.priority}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(prospect.status)} text-white border-0`}
                          >
                            {prospect.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Revenue</p>
                          <p className="font-medium">{prospect.revenue}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Size</p>
                          <p className="font-medium">{prospect.size}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Value</p>
                          <p className="font-medium">${(prospect.potentialValue / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Contacts</p>
                          <p className="font-medium">{prospect.contacts.length}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          Updated: {new Date(prospect.lastUpdated).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          Attempts: {prospect.contactAttempts}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prospect Details */}
          <div className="lg:col-span-1">
            {selectedProspect ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-cyan-400 flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      {selectedProspect.company}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => verifyProspectMutation.mutate(selectedProspect.id)}
                      className="border-slate-600"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <Tabs defaultValue="contacts" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                      <TabsTrigger value="contacts">Contacts</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="contacts" className="space-y-4 mt-4">
                      <h4 className="text-sm font-medium text-slate-400 mb-3">
                        Key Contacts ({selectedProspect.contacts.length})
                      </h4>
                      <div className="space-y-3">
                        {selectedProspect.contacts.map((contact, index) => (
                          <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-white">{contact.name}</p>
                                <p className="text-sm text-slate-400">{contact.title}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                {contact.verified ? (
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                )}
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${contact.status === 'active' ? 'border-green-500 text-green-400' : 'border-yellow-500 text-yellow-400'}`}
                                >
                                  {contact.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                              <a href={`mailto:${contact.email}`} className="text-blue-400 hover:underline flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </a>
                              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center">
                                <Linkedin className="h-3 w-3 mr-1" />
                                LinkedIn
                              </a>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              Verified: {new Date(contact.lastVerified).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-slate-400">Industry</p>
                          <p className="text-white">{selectedProspect.industry}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Headquarters</p>
                          <p className="text-white">{selectedProspect.headquarters}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Website</p>
                          <a href={selectedProspect.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            {selectedProspect.website}
                          </a>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Potential Value</p>
                          <p className="text-xl font-bold text-green-400">
                            ${selectedProspect.potentialValue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Next Action</p>
                          <p className="text-white">
                            {new Date(selectedProspect.nextActionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="actions" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email Campaign
                        </Button>
                        
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn Outreach
                        </Button>
                        
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          <Phone className="h-4 w-4 mr-2" />
                          Schedule Call
                        </Button>
                        
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Demo
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Building2 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Select a prospect to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}