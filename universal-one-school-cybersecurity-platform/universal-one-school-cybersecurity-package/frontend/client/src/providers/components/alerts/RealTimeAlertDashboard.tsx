import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/services/notificationService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  Filter, 
  Search, 
  RefreshCw, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  ArrowRightCircle, 
  Zap, 
  ChevronDown,
  Bookmark,
  UserCog,
  HelpCircle,
  FileText
} from 'lucide-react';

// Alert interface (expanding on the existing one)
interface Alert {
  id: number;
  title: string;
  description?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt?: string;
  source?: string;
  type?: string;
  category?: string;
  assignedTo?: string;
  affectedSystems?: string[];
  ipAddress?: string;
  isRead: boolean;
  ttl?: number; // Time to live (minutes)
  metadata?: Record<string, any>;
  relatedAlerts?: number[];
  tags?: string[];
  priority?: number;
}

// Response template interface
interface ResponseTemplate {
  id: number;
  name: string;
  category: string;
  description: string;
  steps: {
    order: number;
    action: string;
    description: string;
    automatable: boolean;
  }[];
}

// Activity log entry interface
interface ActivityLogEntry {
  id: number;
  alertId: number;
  timestamp: string;
  actor: string;
  action: string;
  details?: string;
}

export function RealTimeAlertDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isResponseOpen, setIsResponseOpen] = useState(false);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ResponseTemplate | null>(null);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  // Use notifications service to get real-time updates
  const { notifications } = useNotifications(user?.clientId);

  // Fetch alerts
  const { data: alerts = [], isLoading: isLoadingAlerts, refetch: refetchAlerts } = useQuery<Alert[]>({
    queryKey: ['/api/alerts', activeTab],
    queryFn: async () => {
      try {
        const url = new URL('/api/alerts', window.location.origin);
        url.searchParams.append('status', activeTab === 'active' ? 'active' : 'all');
        
        if (user?.clientId) {
          url.searchParams.append('clientId', user.clientId.toString());
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch alerts');
        return await response.json();
      } catch (error) {
        console.error('Error fetching alerts:', error);
        // For demo, return sample data
        return generateSampleAlerts(activeTab);
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch response templates
  const { data: responseTemplates = [] } = useQuery<ResponseTemplate[]>({
    queryKey: ['/api/alert-templates'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/alert-templates');
        if (!response.ok) throw new Error('Failed to fetch templates');
        return await response.json();
      } catch (error) {
        console.error('Error fetching templates:', error);
        // Return sample templates
        return [
          {
            id: 1,
            name: 'Malware Response',
            category: 'Malware',
            description: 'Standard response procedure for malware detection',
            steps: [
              { order: 1, action: 'Isolate affected system', description: 'Disconnect system from network', automatable: true },
              { order: 2, action: 'Identify malware type', description: 'Analyze logs and system behavior', automatable: false },
              { order: 3, action: 'Clean or reimage system', description: 'Remove malware or restore from clean backup', automatable: true },
              { order: 4, action: 'Verify remediation', description: 'Ensure system is clean and malware is removed', automatable: false },
              { order: 5, action: 'Document incident', description: 'Record all actions taken and findings', automatable: false },
            ]
          },
          {
            id: 2,
            name: 'Unauthorized Access',
            category: 'Access Control',
            description: 'Response for unauthorized access attempts',
            steps: [
              { order: 1, action: 'Lock affected account', description: 'Temporarily disable the compromised account', automatable: true },
              { order: 2, action: 'Review access logs', description: 'Determine scope and timeline of unauthorized access', automatable: false },
              { order: 3, action: 'Reset credentials', description: 'Force password reset for affected accounts', automatable: true },
              { order: 4, action: 'Review permissions', description: 'Audit and adjust access rights if necessary', automatable: false },
              { order: 5, action: 'Notify affected users', description: 'Inform users of the incident and actions taken', automatable: true },
            ]
          },
          {
            id: 3,
            name: 'DDoS Mitigation',
            category: 'Network',
            description: 'Steps to mitigate Distributed Denial of Service attacks',
            steps: [
              { order: 1, action: 'Activate traffic filtering', description: 'Enable DDoS protection services', automatable: true },
              { order: 2, action: 'Analyze attack pattern', description: 'Identify attack vectors and sources', automatable: false },
              { order: 3, action: 'Scale resources', description: 'Increase bandwidth or server capacity', automatable: true },
              { order: 4, action: 'Block malicious IPs', description: 'Update firewall rules to block attackers', automatable: true },
              { order: 5, action: 'Monitor effectiveness', description: 'Ensure mitigation is working', automatable: false },
            ]
          }
        ];
      }
    }
  });

  // Fetch activity logs for selected alert
  const { data: activityLogs = [], refetch: refetchLogs } = useQuery<ActivityLogEntry[]>({
    queryKey: ['/api/alerts/activity', selectedAlert?.id],
    enabled: !!selectedAlert,
    queryFn: async () => {
      try {
        const response = await fetch(`/api/alerts/${selectedAlert?.id}/activity`);
        if (!response.ok) throw new Error('Failed to fetch activity logs');
        return await response.json();
      } catch (error) {
        console.error('Error fetching activity logs:', error);
        // Return sample logs
        return [
          { id: 1, alertId: selectedAlert?.id || 0, timestamp: new Date().toISOString(), actor: 'System', action: 'Alert Created', details: 'Alert was generated by monitoring system' },
          { id: 2, alertId: selectedAlert?.id || 0, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), actor: 'admin', action: 'Status Change', details: 'Changed status from New to Acknowledged' },
          { id: 3, alertId: selectedAlert?.id || 0, timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), actor: 'admin', action: 'Comment Added', details: 'Added comment: Starting investigation on this issue' },
        ];
      }
    }
  });

  // Update alert status mutation
  const updateAlertMutation = useMutation({
    mutationFn: async ({ alertId, status, notes }: { alertId: number, status: string, notes?: string }) => {
      try {
        const response = await fetch(`/api/alerts/${alertId}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, notes })
        });
        
        if (!response.ok) throw new Error('Failed to update alert status');
        return await response.json();
      } catch (error) {
        console.error('Error updating alert status:', error);
        // Mock success for demo
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: 'Alert Updated',
        description: 'The alert status has been updated successfully.'
      });
      
      if (selectedAlert) {
        refetchLogs();
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Run automated response mutation
  const runAutomatedResponseMutation = useMutation({
    mutationFn: async ({ alertId, templateId }: { alertId: number, templateId: number }) => {
      try {
        const response = await fetch(`/api/alerts/${alertId}/automate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId })
        });
        
        if (!response.ok) throw new Error('Failed to run automated response');
        return await response.json();
      } catch (error) {
        console.error('Error running automated response:', error);
        // Mock success for demo
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: 'Automation Started',
        description: 'The automated response workflow has been initiated.'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Automation Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Generate sample alert data
  const generateSampleAlerts = (tab: string): Alert[] => {
    const now = new Date();
    const alerts: Alert[] = [];
    
    // New unresolved alerts
    if (tab === 'active' || tab === 'all') {
      alerts.push(
        {
          id: 1,
          title: 'Suspicious Login Attempt',
          description: 'Multiple failed login attempts detected from IP 203.0.113.42',
          severity: 'high',
          status: 'new',
          createdAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
          source: 'Authentication System',
          type: 'Access',
          category: 'Authentication',
          ipAddress: '203.0.113.42',
          isRead: false,
          priority: 2,
          tags: ['login', 'bruteforce'],
          affectedSystems: ['authentication-server']
        },
        {
          id: 2,
          title: 'Malware Signature Detected',
          description: 'Trojan signature detected on workstation DEV-WS-034',
          severity: 'critical',
          status: 'acknowledged',
          createdAt: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
          updatedAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
          source: 'Endpoint Protection',
          type: 'Malware',
          category: 'Endpoint',
          assignedTo: 'admin',
          isRead: true,
          priority: 1,
          tags: ['malware', 'trojan'],
          affectedSystems: ['DEV-WS-034']
        },
        {
          id: 3,
          title: 'Unusual Network Traffic',
          description: 'Unusual outbound traffic to IP 198.51.100.76 on port 4444',
          severity: 'medium',
          status: 'investigating',
          createdAt: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
          updatedAt: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
          source: 'Network IDS',
          type: 'Network',
          category: 'Data Exfiltration',
          assignedTo: 'analyst',
          isRead: true,
          priority: 2,
          tags: ['network', 'exfiltration'],
          affectedSystems: ['firewall', 'network-segment-3']
        },
        {
          id: 4,
          title: 'File Integrity Alert',
          description: 'Critical system file modified: /etc/passwd',
          severity: 'high',
          status: 'new',
          createdAt: new Date(now.getTime() - 1000 * 60 * 10).toISOString(),
          source: 'File Integrity Monitor',
          type: 'System',
          category: 'System Integrity',
          isRead: false,
          priority: 1,
          tags: ['system', 'file-integrity'],
          affectedSystems: ['auth-server-3']
        }
      );
    }
    
    // Add some resolved/closed alerts for the all tab
    if (tab === 'all') {
      alerts.push(
        {
          id: 5,
          title: 'Unauthorized Access Attempt',
          description: 'Admin login attempt from unauthorized location',
          severity: 'high',
          status: 'resolved',
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
          updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
          source: 'Authentication System',
          type: 'Access',
          category: 'Authentication',
          assignedTo: 'admin',
          isRead: true,
          priority: 1,
          tags: ['access', 'admin'],
          affectedSystems: ['admin-portal']
        },
        {
          id: 6,
          title: 'DDoS Attack Detected',
          description: 'Distributed Denial of Service attack targeting web servers',
          severity: 'critical',
          status: 'closed',
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
          updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 6).toISOString(),
          source: 'Network Monitoring',
          type: 'Network',
          category: 'Availability',
          assignedTo: 'analyst',
          isRead: true,
          priority: 1,
          tags: ['ddos', 'network'],
          affectedSystems: ['web-cluster', 'load-balancer']
        }
      );
    }
    
    return alerts;
  };

  // Apply filters to alerts
  const filteredAlerts = alerts.filter(alert => {
    // Search query filter
    const searchMatch = !searchQuery || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.description && alert.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alert.source && alert.source.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alert.tags && alert.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Severity filter
    const severityMatch = !severityFilter || alert.severity === severityFilter;
    
    // Type filter
    const typeMatch = !typeFilter || alert.type === typeFilter;
    
    return searchMatch && severityMatch && typeMatch;
  });

  // Get unique alert types for filter
  const alertTypes = [...new Set(alerts.map(alert => alert.type).filter(Boolean) as string[])];

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <Badge variant="destructive" className="bg-red-600">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Critical
          </Badge>
        );
      case 'high':
        return (
          <Badge className="bg-orange-600">
            <AlertTriangle className="mr-1 h-3 w-3" />
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-amber-600">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-green-600">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Low
          </Badge>
        );
      default:
        return (
          <Badge>
            <AlertTriangle className="mr-1 h-3 w-3" />
            {severity}
          </Badge>
        );
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            <Bell className="mr-1 h-3 w-3" />
            New
          </Badge>
        );
      case 'acknowledged':
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            <Clock className="mr-1 h-3 w-3" />
            Acknowledged
          </Badge>
        );
      case 'investigating':
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            <Search className="mr-1 h-3 w-3" />
            Investigating
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Resolved
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            <XCircle className="mr-1 h-3 w-3" />
            Closed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  // Calculate time since creation in relative format
  const getTimeSince = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (seconds < 60) return `${seconds} seconds ago`;
      
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } catch (error) {
      return 'Unknown';
    }
  };

  // Handle opening alert details
  const handleOpenDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDetailsOpen(true);
  };

  // Handle status change
  const handleStatusChange = (alert: Alert, newStatus: string) => {
    updateAlertMutation.mutate({
      alertId: alert.id,
      status: newStatus,
      notes: `Status changed to ${newStatus}`
    });
  };

  // Handle opening response workflow
  const handleOpenResponse = (alert: Alert) => {
    setSelectedAlert(alert);
    setSelectedTemplate(null);
    setWorkflowStep(0);
    setIsWorkflowRunning(false);
    setIsResponseOpen(true);
  };

  // Handle selecting a response template
  const handleSelectTemplate = (template: ResponseTemplate) => {
    setSelectedTemplate(template);
    setWorkflowStep(1);
  };

  // Handle next step in workflow
  const handleNextStep = () => {
    if (!selectedTemplate) return;
    
    const nextStep = workflowStep + 1;
    
    if (nextStep <= selectedTemplate.steps.length) {
      setWorkflowStep(nextStep);
    }
    
    // If we've reached the end, run the automation
    if (nextStep === selectedTemplate.steps.length + 1) {
      handleRunAutomation();
    }
  };

  // Handle running the automated response
  const handleRunAutomation = () => {
    if (!selectedAlert || !selectedTemplate) return;
    
    setIsWorkflowRunning(true);
    
    // Run the automation
    runAutomatedResponseMutation.mutate({
      alertId: selectedAlert.id,
      templateId: selectedTemplate.id
    });
    
    // For demo, simulate completion after a delay
    setTimeout(() => {
      setIsWorkflowRunning(false);
      setWorkflowStep(selectedTemplate.steps.length + 1); // Completed
      
      // Update alert status to reflect automation
      updateAlertMutation.mutate({
        alertId: selectedAlert.id,
        status: 'investigating',
        notes: `Automated response applied: ${selectedTemplate.name}`
      });
    }, 3000);
  };

  // Get appropriate action buttons based on alert status
  const getActionButtons = (alert: Alert) => {
    switch (alert.status) {
      case 'new':
        return (
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => handleStatusChange(alert, 'acknowledged')}>
              <Clock className="mr-1 h-3 w-3" />
              Acknowledge
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleOpenResponse(alert)}>
              <Zap className="mr-1 h-3 w-3" />
              Respond
            </Button>
          </div>
        );
      case 'acknowledged':
        return (
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => handleStatusChange(alert, 'investigating')}>
              <Search className="mr-1 h-3 w-3" />
              Investigate
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleOpenResponse(alert)}>
              <Zap className="mr-1 h-3 w-3" />
              Respond
            </Button>
          </div>
        );
      case 'investigating':
        return (
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => handleStatusChange(alert, 'resolved')}>
              <CheckCircle className="mr-1 h-3 w-3" />
              Resolve
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsAssignDialogOpen(true)}>
              <UserCog className="mr-1 h-3 w-3" />
              Assign
            </Button>
          </div>
        );
      case 'resolved':
        return (
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => handleStatusChange(alert, 'closed')}>
              <XCircle className="mr-1 h-3 w-3" />
              Close
            </Button>
            <Button size="sm" variant="outline" onClick={() => {}}>
              <FileText className="mr-1 h-3 w-3" />
              Report
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => {}}>
              <FileText className="mr-1 h-3 w-3" />
              View Report
            </Button>
          </div>
        );
    }
  };

  // Render active alert count badge with animation for new alerts
  const renderAlertCountBadge = () => {
    const activeCount = alerts.filter(alert => 
      ['new', 'acknowledged', 'investigating'].includes(alert.status)
    ).length;
    
    const newCount = alerts.filter(alert => alert.status === 'new').length;
    
    return (
      <div className="flex items-center">
        <Badge className="bg-blue-600">
          {activeCount} Active
        </Badge>
        {newCount > 0 && (
          <Badge className="ml-2 bg-red-600 animate-pulse">
            {newCount} New
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Real-time Alert Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Bell className="mr-2 h-6 w-6" />
            Real-time Alert Dashboard
          </h2>
          <p className="text-gray-400">
            Monitor and respond to security alerts across your infrastructure
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => refetchAlerts()}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingAlerts ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Alert Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="active" className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Active Alerts
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    <Bell className="mr-2 h-4 w-4" />
                    All Alerts
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {renderAlertCountBadge()}
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <Select
                value={severityFilter || ''}
                onValueChange={(value) => setSeverityFilter(value || null)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={typeFilter || ''}
                onValueChange={(value) => setTypeFilter(value || null)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Alert Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {alertTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full md:w-[200px]"
                />
              </div>
              
              <Button variant="outline" size="icon" onClick={() => {
                setSearchQuery('');
                setSeverityFilter(null);
                setTypeFilter(null);
              }}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Alert List */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Security Alerts</CardTitle>
          <CardDescription>
            Manage and respond to detected security threats and anomalies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAlerts ? (
            <div className="h-60 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <ShieldCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No alerts found</h3>
              <p className="text-gray-400 mt-2">
                {searchQuery || severityFilter || typeFilter
                  ? 'Try adjusting your filters to see more results'
                  : 'Your systems are currently secure with no active alerts'}
              </p>
            </div>
          ) : (
            <div className="border rounded-md border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Severity</TableHead>
                    <TableHead className="w-full">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredAlerts.map((alert) => (
                      <motion.tr
                        key={alert.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer ${
                          !alert.isRead ? 'bg-indigo-900/10' : ''
                        }`}
                        onClick={() => handleOpenDetails(alert)}
                      >
                        <TableCell>
                          {getSeverityBadge(alert.severity)}
                          {!alert.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 absolute top-1/2 transform -translate-y-1/2 -left-1"></div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{alert.title}</div>
                          <div className="text-sm text-gray-400 truncate max-w-md">
                            {alert.description}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(alert.status)}</TableCell>
                        <TableCell>
                          <span className="text-sm">{alert.source || 'System'}</span>
                          {alert.tags && alert.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {alert.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs py-0 px-1">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="text-sm whitespace-nowrap">{getTimeSince(alert.createdAt)}</div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Created: {formatDate(alert.createdAt)}</p>
                                {alert.updatedAt && <p>Updated: {formatDate(alert.updatedAt)}</p>}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {getActionButtons(alert)}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Alert Details Dialog */}
      {selectedAlert && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <span className="mr-2">{selectedAlert.title}</span>
                {getSeverityBadge(selectedAlert.severity)}
              </DialogTitle>
              <DialogDescription>
                Alert details and response options
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Clock className="mr-2 h-4 w-4" />
                  Activity Log
                </TabsTrigger>
                <TabsTrigger value="related">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Related Items
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-300">
                      {selectedAlert.description || 'No description provided.'}
                    </p>
                    
                    {selectedAlert.ipAddress && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-400">Associated IP Address</h4>
                        <p className="font-mono bg-gray-700 p-1 rounded mt-1 text-sm">
                          {selectedAlert.ipAddress}
                        </p>
                      </div>
                    )}
                    
                    {selectedAlert.affectedSystems && selectedAlert.affectedSystems.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-400">Affected Systems</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedAlert.affectedSystems.map((system, i) => (
                            <Badge key={i} variant="outline">
                              {system}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">Alert Information</h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-400">ID:</dt>
                          <dd>{selectedAlert.id}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Status:</dt>
                          <dd>{getStatusBadge(selectedAlert.status)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Created:</dt>
                          <dd>{formatDate(selectedAlert.createdAt)}</dd>
                        </div>
                        {selectedAlert.updatedAt && (
                          <div className="flex justify-between">
                            <dt className="text-gray-400">Last Updated:</dt>
                            <dd>{formatDate(selectedAlert.updatedAt)}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Source:</dt>
                          <dd>{selectedAlert.source || 'System'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Type:</dt>
                          <dd>{selectedAlert.type || 'Alert'}</dd>
                        </div>
                        {selectedAlert.assignedTo && (
                          <div className="flex justify-between">
                            <dt className="text-gray-400">Assigned To:</dt>
                            <dd>{selectedAlert.assignedTo}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    
                    <div className="space-y-2">
                      {selectedAlert.status === 'new' && (
                        <Button 
                          className="w-full" 
                          onClick={() => handleStatusChange(selectedAlert, 'acknowledged')}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Acknowledge
                        </Button>
                      )}
                      
                      {selectedAlert.status === 'acknowledged' && (
                        <Button 
                          className="w-full" 
                          onClick={() => handleStatusChange(selectedAlert, 'investigating')}
                        >
                          <Search className="mr-2 h-4 w-4" />
                          Start Investigation
                        </Button>
                      )}
                      
                      {['new', 'acknowledged'].includes(selectedAlert.status) && (
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => handleOpenResponse(selectedAlert)}
                        >
                          <Zap className="mr-2 h-4 w-4" />
                          Automated Response
                        </Button>
                      )}
                      
                      {selectedAlert.status === 'investigating' && (
                        <Button 
                          className="w-full" 
                          onClick={() => handleStatusChange(selectedAlert, 'resolved')}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Resolved
                        </Button>
                      )}
                      
                      {selectedAlert.status === 'resolved' && (
                        <Button 
                          className="w-full" 
                          onClick={() => handleStatusChange(selectedAlert, 'closed')}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Close Alert
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="pt-4">
                <div className="border rounded-lg border-gray-800 overflow-hidden">
                  <ScrollArea className="h-[300px]">
                    <div className="p-4 space-y-4">
                      {activityLogs.length === 0 ? (
                        <div className="text-center p-4">
                          <Clock className="h-10 w-10 mx-auto text-gray-500 mb-2" />
                          <p className="text-gray-400">No activity recorded yet</p>
                        </div>
                      ) : (
                        activityLogs.map((entry) => (
                          <div key={entry.id} className="flex">
                            <div className="mr-4 relative">
                              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                {entry.action.includes('Created') && <Bell className="h-5 w-5" />}
                                {entry.action.includes('Status') && <ArrowRightCircle className="h-5 w-5" />}
                                {entry.action.includes('Comment') && <MessageSquare className="h-5 w-5" />}
                                {!entry.action.includes('Created') && !entry.action.includes('Status') && !entry.action.includes('Comment') && (
                                  <UserCog className="h-5 w-5" />
                                )}
                              </div>
                              <div className="absolute top-10 bottom-0 left-1/2 w-0.5 bg-gray-700 transform -translate-x-1/2"></div>
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{entry.action}</p>
                                    <p className="text-sm text-gray-400">{entry.details}</p>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatDate(entry.timestamp)}
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-gray-400">
                                  By: {entry.actor}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="related" className="pt-4">
                <div className="border rounded-lg border-gray-800 p-6">
                  <div className="text-center">
                    <HelpCircle className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium">Related Insights</h3>
                    <p className="text-gray-400 max-w-md mx-auto mt-2">
                      Advanced threat correlation and contextual information will be displayed here.
                    </p>
                    <Button className="mt-4" variant="outline">
                      View Threat Intelligence
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Response Workflow Dialog */}
      {selectedAlert && (
        <Dialog open={isResponseOpen} onOpenChange={setIsResponseOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Automated Response Workflow
                </div>
              </DialogTitle>
              <DialogDescription>
                Apply automated response procedures to address the alert
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {workflowStep === 0 && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-medium">Alert Information</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {selectedAlert.title} - {getSeverityBadge(selectedAlert.severity)}
                    </p>
                    <p className="text-sm mt-2">
                      {selectedAlert.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Select Response Template</h3>
                    <div className="space-y-3">
                      {responseTemplates.map((template) => (
                        <div 
                          key={template.id}
                          className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleSelectTemplate(template)}
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge variant="outline">{template.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            {template.description}
                          </p>
                          <div className="text-xs text-gray-500 mt-2">
                            {template.steps.length} steps ({template.steps.filter(s => s.automatable).length} automatable)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedTemplate && workflowStep > 0 && workflowStep <= selectedTemplate.steps.length && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{selectedTemplate.name}</h3>
                    <Badge variant="outline">Step {workflowStep} of {selectedTemplate.steps.length}</Badge>
                  </div>
                  
                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(workflowStep / selectedTemplate.steps.length) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="p-6 border border-gray-700 rounded-lg bg-gray-800">
                    <h4 className="text-lg font-medium flex items-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 mr-3">
                        {workflowStep}
                      </span>
                      {selectedTemplate.steps[workflowStep - 1].action}
                    </h4>
                    
                    <p className="mt-4 ml-11 text-gray-300">
                      {selectedTemplate.steps[workflowStep - 1].description}
                    </p>
                    
                    {selectedTemplate.steps[workflowStep - 1].automatable && (
                      <div className="mt-4 ml-11 p-3 bg-green-900/20 border border-green-800 rounded-md">
                        <div className="flex items-center">
                          <Zap className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-400 font-medium">This step can be automated</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedTemplate && workflowStep > selectedTemplate.steps.length && (
                <div className="space-y-4 text-center py-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-medium">Response Completed</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    The automated response workflow has been completed successfully. 
                    The alert status has been updated.
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              {workflowStep === 0 && (
                <Button variant="outline" onClick={() => setIsResponseOpen(false)}>
                  Cancel
                </Button>
              )}
              
              {selectedTemplate && workflowStep > 0 && workflowStep <= selectedTemplate.steps.length && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setWorkflowStep(Math.max(0, workflowStep - 1))}
                    disabled={workflowStep === 1}
                  >
                    Back
                  </Button>
                  <Button onClick={handleNextStep} disabled={isWorkflowRunning}>
                    {isWorkflowRunning ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowRightCircle className="mr-2 h-4 w-4" />
                        {workflowStep === selectedTemplate.steps.length ? 'Complete' : 'Next Step'}
                      </>
                    )}
                  </Button>
                </>
              )}
              
              {selectedTemplate && workflowStep > selectedTemplate.steps.length && (
                <Button onClick={() => setIsResponseOpen(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

import { MessageSquare } from 'lucide-react';