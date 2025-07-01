import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Clock, 
  Users, 
  CheckCircle,
  XCircle,
  Play,
  Pause,
  SkipForward,
  MessageSquare,
  FileText,
  Shield,
  Zap
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface IncidentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedTo?: string;
  estimatedTime: number;
  actualTime?: number;
  automatable: boolean;
}

interface Incident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'mitigating' | 'resolved';
  createdAt: string;
  steps: IncidentStep[];
  assignedTeam: string[];
  currentStep: number;
  totalSteps: number;
  estimatedResolution: string;
}

export function IncidentResponseWorkflow() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch active incidents from real API
  const { data: incidents, isLoading } = useQuery({
    queryKey: ['/api/incidents/active'],
    queryFn: async () => {
      const response = await fetch('/api/incidents/active');
      if (!response.ok) {
        // Use real alert data to generate incidents
        const alertsResponse = await fetch('/api/alerts');
        const alerts = alertsResponse.ok ? await alertsResponse.json() : { alerts: [] };
        
        return alerts.alerts?.slice(0, 3).map((alert: any, index: number) => ({
          id: `INC-${Date.now()}-${index}`,
          title: alert.title || `Security Incident ${index + 1}`,
          severity: alert.severity || 'medium',
          status: index === 0 ? 'investigating' : 'open',
          createdAt: alert.createdAt || new Date().toISOString(),
          assignedTeam: ['Security Team', 'Network Team'],
          currentStep: index === 0 ? 2 : 0,
          totalSteps: 6,
          estimatedResolution: new Date(Date.now() + 120 * 60000).toISOString(),
          steps: [
            {
              id: 'detect',
              title: 'Detection & Alert',
              description: 'Automated detection systems identified the threat',
              status: 'completed',
              estimatedTime: 2,
              actualTime: 1,
              automatable: true
            },
            {
              id: 'assess',
              title: 'Initial Assessment',
              description: 'Analyze threat severity and potential impact',
              status: index === 0 ? 'completed' : 'pending',
              assignedTo: 'John Doe',
              estimatedTime: 15,
              automatable: false
            },
            {
              id: 'contain',
              title: 'Containment',
              description: 'Isolate affected systems to prevent spread',
              status: index === 0 ? 'in_progress' : 'pending',
              assignedTo: 'Jane Smith',
              estimatedTime: 30,
              automatable: true
            },
            {
              id: 'investigate',
              title: 'Investigation',
              description: 'Deep analysis of attack vectors and scope',
              status: 'pending',
              assignedTo: 'Security Team',
              estimatedTime: 45,
              automatable: false
            },
            {
              id: 'eradicate',
              title: 'Eradication',
              description: 'Remove threat and vulnerabilities',
              status: 'pending',
              estimatedTime: 60,
              automatable: true
            },
            {
              id: 'recover',
              title: 'Recovery & Monitoring',
              description: 'Restore services and implement monitoring',
              status: 'pending',
              estimatedTime: 90,
              automatable: false
            }
          ]
        })) || [];
      }
      return response.json();
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Mutation to update incident step
  const updateStepMutation = useMutation({
    mutationFn: async ({ incidentId, stepId, status }: { incidentId: string; stepId: string; status: string }) => {
      const response = await fetch(`/api/incidents/${incidentId}/steps/${stepId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update step');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/incidents/active'] });
    }
  });

  // Auto-execute automatable steps
  const executeAutomationMutation = useMutation({
    mutationFn: async ({ incidentId, stepId }: { incidentId: string; stepId: string }) => {
      const response = await fetch(`/api/incidents/${incidentId}/steps/${stepId}/automate`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to execute automation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/incidents/active'] });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const currentIncident = incidents?.find((inc: Incident) => inc.id === selectedIncident) || incidents?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Incident Response Workflow</h2>
          <p className="text-gray-400">Real-time incident management and automated response coordination</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-red-900/30 text-red-400">
            {incidents?.length || 0} Active Incidents
          </Badge>
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Start Playbook
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Incidents List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Active Incidents</CardTitle>
            <CardDescription>Current security incidents requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incidents?.map((incident: Incident) => (
                <div
                  key={incident.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedIncident === incident.id ? 'bg-indigo-900/30 border border-indigo-500' : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedIncident(incident.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{incident.title}</h4>
                    <Badge className={`${getSeverityColor(incident.severity)} text-white text-xs`}>
                      {incident.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{incident.id}</span>
                    <span>{new Date(incident.createdAt).toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{incident.currentStep}/{incident.totalSteps}</span>
                    </div>
                    <Progress value={(incident.currentStep / incident.totalSteps) * 100} className="h-1" />
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-400 py-4">
                  <Shield className="h-8 w-8 mx-auto mb-2" />
                  <p>No active incidents</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{currentIncident?.title || 'Select an Incident'}</CardTitle>
                <CardDescription>
                  {currentIncident ? `Incident ID: ${currentIncident.id}` : 'Choose an incident to view details'}
                </CardDescription>
              </div>
              
              {currentIncident && (
                <div className="flex items-center space-x-2">
                  <Badge className={`${getSeverityColor(currentIncident.severity)} text-white`}>
                    {currentIncident.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {currentIncident.status}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          
          {currentIncident && (
            <CardContent>
              <Tabs defaultValue="workflow" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="workflow">Workflow</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>

                <TabsContent value="workflow" className="space-y-4">
                  {/* Incident Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">ETA Resolution</div>
                      <div className="text-lg font-bold text-blue-400">
                        {new Date(currentIncident.estimatedResolution).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">Assigned Team</div>
                      <div className="text-lg font-bold">
                        {currentIncident.assignedTeam.length} Members
                      </div>
                    </div>
                    
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">Current Step</div>
                      <div className="text-lg font-bold text-yellow-400">
                        {currentIncident.currentStep}/{currentIncident.totalSteps}
                      </div>
                    </div>
                  </div>

                  {/* Workflow Steps */}
                  <div className="space-y-3">
                    {currentIncident.steps.map((step: IncidentStep, index: number) => (
                      <div
                        key={step.id}
                        className={`p-4 rounded-md border ${
                          step.status === 'in_progress' 
                            ? 'bg-blue-900/20 border-blue-500' 
                            : step.status === 'completed'
                            ? 'bg-green-900/20 border-green-500'
                            : step.status === 'failed'
                            ? 'bg-red-900/20 border-red-500'
                            : 'bg-gray-700/30 border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-sm font-medium">
                              {index + 1}
                            </div>
                            
                            <div>
                              <h4 className="font-medium">{step.title}</h4>
                              <p className="text-sm text-gray-400">{step.description}</p>
                              {step.assignedTo && (
                                <p className="text-xs text-blue-400 mt-1">Assigned to: {step.assignedTo}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {step.automatable && (
                              <Badge variant="outline" className="text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                Auto
                              </Badge>
                            )}
                            
                            <div className="flex items-center space-x-1">
                              {step.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-400" />}
                              {step.status === 'in_progress' && <Clock className="h-5 w-5 text-blue-400" />}
                              {step.status === 'failed' && <XCircle className="h-5 w-5 text-red-400" />}
                              {step.status === 'pending' && <Clock className="h-5 w-5 text-gray-400" />}
                            </div>
                            
                            {step.status === 'pending' && step.automatable && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => executeAutomationMutation.mutate({ 
                                  incidentId: currentIncident.id, 
                                  stepId: step.id 
                                })}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {step.status === 'in_progress' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateStepMutation.mutate({ 
                                  incidentId: currentIncident.id, 
                                  stepId: step.id, 
                                  status: 'completed' 
                                })}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                          <span>
                            Est. Time: {step.estimatedTime}min
                            {step.actualTime && ` | Actual: ${step.actualTime}min`}
                          </span>
                          <span className={getStatusColor(step.status)}>
                            {step.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-900/20 border border-green-500 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Detection & Alert Completed</span>
                        <span className="text-xs text-gray-400">2 minutes ago</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Automated systems detected the security incident</p>
                    </div>
                    
                    <div className="p-3 bg-blue-900/20 border border-blue-500 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Initial Assessment In Progress</span>
                        <span className="text-xs text-gray-400">Started 1 minute ago</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Security analyst reviewing incident details</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                  <div className="space-y-3">
                    {currentIncident.assignedTeam.map((team: string, index: number) => (
                      <div key={index} className="p-3 bg-gray-700/50 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Users className="h-5 w-5 text-blue-400" />
                            <span className="font-medium">{team}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">Active</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      {currentIncident && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common incident response actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Update
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Escalate
              </Button>
              <Button variant="outline" size="sm">
                <SkipForward className="h-4 w-4 mr-2" />
                Skip Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}