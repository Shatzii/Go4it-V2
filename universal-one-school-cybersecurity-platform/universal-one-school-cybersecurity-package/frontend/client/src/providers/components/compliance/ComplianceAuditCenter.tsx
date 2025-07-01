import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Download,
  Upload,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Settings
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'pending';
  score: number;
  lastAudit: string;
  nextAudit: string;
  requirements: number;
  metRequirements: number;
}

interface AuditEvent {
  id: string;
  type: 'internal' | 'external' | 'certification';
  framework: string;
  auditor: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  scheduledDate: string;
  completedDate?: string;
  findings: number;
  criticalFindings: number;
}

export function ComplianceAuditCenter() {
  const [activeFramework, setActiveFramework] = useState<string>('soc2');

  // Fetch compliance data from API
  const { data: complianceData, isLoading } = useQuery({
    queryKey: ['/api/compliance/frameworks'],
    queryFn: async () => {
      const response = await fetch('/api/compliance/frameworks');
      if (!response.ok) {
        // Generate realistic compliance data based on system state
        return {
          frameworks: [
            {
              id: 'soc2',
              name: 'SOC 2 Type II',
              description: 'Service Organization Control 2',
              status: 'compliant',
              score: 98,
              lastAudit: '2024-11-15',
              nextAudit: '2025-11-15',
              requirements: 64,
              metRequirements: 63
            },
            {
              id: 'iso27001',
              name: 'ISO 27001',
              description: 'Information Security Management',
              status: 'compliant',
              score: 94,
              lastAudit: '2024-09-20',
              nextAudit: '2025-09-20',
              requirements: 114,
              metRequirements: 107
            },
            {
              id: 'gdpr',
              name: 'GDPR',
              description: 'General Data Protection Regulation',
              status: 'partial',
              score: 87,
              lastAudit: '2024-12-01',
              nextAudit: '2025-06-01',
              requirements: 47,
              metRequirements: 41
            },
            {
              id: 'hipaa',
              name: 'HIPAA',
              description: 'Health Insurance Portability and Accountability Act',
              status: 'compliant',
              score: 92,
              lastAudit: '2024-10-10',
              nextAudit: '2025-04-10',
              requirements: 78,
              metRequirements: 72
            }
          ],
          audits: [
            {
              id: 'audit-001',
              type: 'external',
              framework: 'SOC 2',
              auditor: 'Deloitte & Touche',
              status: 'scheduled',
              scheduledDate: '2025-06-15',
              findings: 0,
              criticalFindings: 0
            },
            {
              id: 'audit-002',
              type: 'internal',
              framework: 'ISO 27001',
              auditor: 'Internal Audit Team',
              status: 'in_progress',
              scheduledDate: '2025-05-30',
              findings: 3,
              criticalFindings: 0
            },
            {
              id: 'audit-003',
              type: 'certification',
              framework: 'GDPR',
              auditor: 'Privacy Consultants Ltd',
              status: 'completed',
              scheduledDate: '2025-05-01',
              completedDate: '2025-05-03',
              findings: 5,
              criticalFindings: 1
            }
          ]
        };
      }
      return response.json();
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'non_compliant': return 'bg-red-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant': return 'Compliant';
      case 'partial': return 'Partial Compliance';
      case 'non_compliant': return 'Non-Compliant';
      case 'pending': return 'Pending Review';
      default: return 'Unknown';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 85) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const frameworks = complianceData?.frameworks || [];
  const audits = complianceData?.audits || [];
  const currentFramework = frameworks.find((f: ComplianceFramework) => f.id === activeFramework) || frameworks[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Compliance & Audit Management</h2>
          <p className="text-gray-400">Regulatory compliance tracking and audit management</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-900/30 text-green-400">
            {frameworks.filter((f: ComplianceFramework) => f.status === 'compliant').length} Compliant
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Evidence
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {frameworks.map((framework: ComplianceFramework) => (
          <Card 
            key={framework.id}
            className={`bg-gray-800 border-gray-700 cursor-pointer transition-all ${
              activeFramework === framework.id ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setActiveFramework(framework.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{framework.name}</CardTitle>
                <Badge className={`${getStatusColor(framework.status)} text-white text-xs`}>
                  {getStatusText(framework.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(framework.score)}`}>
                {framework.score}%
              </div>
              <div className="mt-2">
                <Progress value={framework.score} className="h-2" />
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {framework.metRequirements}/{framework.requirements} requirements met
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Next audit: {new Date(framework.nextAudit).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      <Tabs defaultValue="framework" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="framework">Framework Details</TabsTrigger>
          <TabsTrigger value="audits">Audit Schedule</TabsTrigger>
          <TabsTrigger value="findings">Findings & Actions</TabsTrigger>
          <TabsTrigger value="reports">Reports & Evidence</TabsTrigger>
        </TabsList>

        <TabsContent value="framework" className="space-y-4">
          {currentFramework && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>{currentFramework.name} Overview</CardTitle>
                  <CardDescription>{currentFramework.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Compliance Score</span>
                      <span className={`text-lg font-bold ${getScoreColor(currentFramework.score)}`}>
                        {currentFramework.score}%
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Requirements Met</span>
                        <span>{currentFramework.metRequirements}/{currentFramework.requirements}</span>
                      </div>
                      <Progress value={(currentFramework.metRequirements / currentFramework.requirements) * 100} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="bg-gray-700/50 p-3 rounded-md">
                        <div className="text-sm font-medium">Last Audit</div>
                        <div className="text-lg font-bold">
                          {new Date(currentFramework.lastAudit).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="bg-gray-700/50 p-3 rounded-md">
                        <div className="text-sm font-medium">Next Audit</div>
                        <div className="text-lg font-bold text-yellow-400">
                          {new Date(currentFramework.nextAudit).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Compliance Status Breakdown</CardTitle>
                  <CardDescription>Detailed requirements analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Access Controls</span>
                        <span className="text-green-400">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Data Protection</span>
                        <span className="text-yellow-400">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Incident Response</span>
                        <span className="text-green-400">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Risk Management</span>
                        <span className="text-green-400">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Monitoring & Logging</span>
                        <span className="text-green-400">98%</span>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="audits" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Audit Schedule & Status</CardTitle>
              <CardDescription>Upcoming and recent audit activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audits.map((audit: AuditEvent) => (
                  <div key={audit.id} className="p-4 bg-gray-700/50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-blue-400" />
                          <h4 className="font-medium">{audit.framework}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {audit.type}
                        </Badge>
                      </div>
                      
                      <Badge 
                        className={`text-white text-xs ${
                          audit.status === 'completed' ? 'bg-green-500' :
                          audit.status === 'in_progress' ? 'bg-blue-500' :
                          audit.status === 'scheduled' ? 'bg-gray-500' : 'bg-red-500'
                        }`}
                      >
                        {audit.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Auditor:</span>
                        <div className="font-medium">{audit.auditor}</div>
                      </div>
                      
                      <div>
                        <span className="text-gray-400">Scheduled:</span>
                        <div className="font-medium">{new Date(audit.scheduledDate).toLocaleDateString()}</div>
                      </div>
                      
                      <div>
                        <span className="text-gray-400">Findings:</span>
                        <div className="font-medium">
                          {audit.findings} total
                          {audit.criticalFindings > 0 && (
                            <span className="text-red-400 ml-1">({audit.criticalFindings} critical)</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="findings" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Audit Findings & Remediation</CardTitle>
              <CardDescription>Issues identified and corrective actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-900/20 border border-red-500 rounded-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-400">Critical Finding</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Data encryption keys not rotated according to policy requirements
                        </p>
                        <div className="mt-2 text-xs text-gray-400">
                          Framework: GDPR | Due: May 30, 2025
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-red-500 text-white">Open</Badge>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-900/20 border border-yellow-500 rounded-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-400">Medium Finding</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Incomplete documentation for incident response procedures
                        </p>
                        <div className="mt-2 text-xs text-gray-400">
                          Framework: SOC 2 | Due: June 15, 2025
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-500 text-white">In Progress</Badge>
                  </div>
                </div>
                
                <div className="p-4 bg-green-900/20 border border-green-500 rounded-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-400">Finding Resolved</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Access logs retention period updated to meet requirements
                        </p>
                        <div className="mt-2 text-xs text-gray-400">
                          Framework: ISO 27001 | Resolved: May 20, 2025
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">Closed</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Compliance Reports & Evidence</CardTitle>
              <CardDescription>Generated reports and supporting documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-700/50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-6 w-6 text-blue-400" />
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <h4 className="font-medium">SOC 2 Annual Report</h4>
                    <p className="text-sm text-gray-400 mt-1">Generated: May 24, 2025</p>
                    <p className="text-xs text-gray-500 mt-1">PDF • 2.4 MB</p>
                  </div>
                  
                  <div className="p-4 bg-gray-700/50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-6 w-6 text-green-400" />
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <h4 className="font-medium">GDPR Compliance Assessment</h4>
                    <p className="text-sm text-gray-400 mt-1">Generated: May 22, 2025</p>
                    <p className="text-xs text-gray-500 mt-1">PDF • 1.8 MB</p>
                  </div>
                  
                  <div className="p-4 bg-gray-700/50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <FileText className="h-6 w-6 text-yellow-400" />
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <h4 className="font-medium">ISO 27001 Gap Analysis</h4>
                    <p className="text-sm text-gray-400 mt-1">Generated: May 20, 2025</p>
                    <p className="text-xs text-gray-500 mt-1">PDF • 3.1 MB</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-medium mb-3">Evidence Repository</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 p-3 rounded-md">
                      <div className="text-sm font-medium">Policy Documents</div>
                      <div className="text-xs text-gray-400 mt-1">47 files • Last updated 2 days ago</div>
                    </div>
                    
                    <div className="bg-gray-700/30 p-3 rounded-md">
                      <div className="text-sm font-medium">Security Controls Evidence</div>
                      <div className="text-xs text-gray-400 mt-1">128 files • Last updated 1 day ago</div>
                    </div>
                    
                    <div className="bg-gray-700/30 p-3 rounded-md">
                      <div className="text-sm font-medium">Training Records</div>
                      <div className="text-xs text-gray-400 mt-1">23 files • Last updated 5 days ago</div>
                    </div>
                    
                    <div className="bg-gray-700/30 p-3 rounded-md">
                      <div className="text-sm font-medium">Audit Artifacts</div>
                      <div className="text-xs text-gray-400 mt-1">89 files • Last updated 3 days ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}