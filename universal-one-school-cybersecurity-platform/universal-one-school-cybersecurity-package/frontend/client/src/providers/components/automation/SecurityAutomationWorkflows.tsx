import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle,
  Clock,
  Code,
  Copy,
  Edit,
  EyeIcon,
  FileCode,
  FileText,
  Filter,
  History,
  Info,
  Link,
  LayoutDashboard,
  LucideIcon,
  MessageSquare,
  Monitor,
  MoreHorizontal,
  Package,
  Pencil,
  Play,
  Plus,
  PowerOff,
  Puzzle,
  RefreshCw,
  Save,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Terminal,
  Timer,
  Trash,
  Workflow,
  Zap,
  ZapOff
} from 'lucide-react';

// Automation workflow interface
interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'response' | 'remediation' | 'compliance' | 'monitoring' | 'integration';
  status: 'active' | 'disabled' | 'draft';
  trigger: {
    type: 'event' | 'schedule' | 'manual';
    details: string;
    schedule?: string;
    eventType?: string;
  };
  creator: string;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  lastRunStatus?: 'success' | 'failed' | 'partial' | 'running' | 'canceled';
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  steps: WorkflowStep[];
  integrations: string[];
  tags: string[];
}

// Workflow step interface
interface WorkflowStep {
  id: string;
  workflowId: string;
  name: string;
  description: string;
  type: 'action' | 'condition' | 'trigger' | 'integration';
  action?: string;
  parameters?: Record<string, any>;
  position: number;
  nextSteps: string[];
  isConditional: boolean;
  conditionType?: 'if' | 'switch' | 'loop';
  conditionExpression?: string;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: any;
}

// Workflow execution interface
interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  startTime: string;
  endTime?: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'canceled';
  trigger: 'manual' | 'scheduled' | 'event';
  triggeredBy?: string;
  duration?: number;
  stepExecutions: StepExecution[];
  variables: Record<string, any>;
  error?: string;
  result?: any;
}

// Step execution interface
interface StepExecution {
  id: string;
  executionId: string;
  stepId: string;
  stepName: string;
  startTime: string;
  endTime?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  input?: any;
  output?: any;
  error?: string;
  duration?: number;
}

// Action template interface
interface ActionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  parameters: ActionParameter[];
  requiredPermissions: string[];
  integrations: string[];
  exampleUsage: string;
}

// Action parameter interface
interface ActionParameter {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'object' | 'json';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  placeholder?: string;
}

// Integration interface
interface Integration {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected?: string;
  icon: string;
  actions: string[];
}

export function SecurityAutomationWorkflows() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('workflows');
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [isWorkflowDetailsOpen, setIsWorkflowDetailsOpen] = useState(false);
  const [isExecutionDetailsOpen, setIsExecutionDetailsOpen] = useState(false);
  const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false);
  const [isRunWorkflowOpen, setIsRunWorkflowOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Form state for workflow creation
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    category: 'response',
    trigger: {
      type: 'manual',
      details: 'Manual execution'
    }
  });
  
  // Fetch workflows
  const { data: workflows = [], isLoading: isLoadingWorkflows } = useQuery<AutomationWorkflow[]>({
    queryKey: ['/api/automation/workflows'],
    queryFn: async () => {
      try {
        const url = new URL('/api/automation/workflows', window.location.origin);
        
        if (user?.clientId) {
          url.searchParams.append('clientId', user.clientId.toString());
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch workflows');
        return await response.json();
      } catch (error) {
        console.error('Error fetching workflows:', error);
        // Return sample data for demo
        return generateSampleWorkflows();
      }
    }
  });
  
  // Fetch workflow executions
  const { data: executions = [], isLoading: isLoadingExecutions } = useQuery<WorkflowExecution[]>({
    queryKey: ['/api/automation/executions', selectedWorkflow?.id],
    enabled: !!selectedWorkflow,
    queryFn: async () => {
      try {
        const url = new URL('/api/automation/executions', window.location.origin);
        
        if (selectedWorkflow?.id) {
          url.searchParams.append('workflowId', selectedWorkflow.id);
        }
        
        if (user?.clientId) {
          url.searchParams.append('clientId', user.clientId.toString());
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch executions');
        return await response.json();
      } catch (error) {
        console.error('Error fetching executions:', error);
        // Return sample data for demo
        return generateSampleExecutions(selectedWorkflow?.id || '');
      }
    }
  });
  
  // Fetch action templates
  const { data: actionTemplates = [], isLoading: isLoadingTemplates } = useQuery<ActionTemplate[]>({
    queryKey: ['/api/automation/actions'],
    queryFn: async () => {
      try {
        const url = new URL('/api/automation/actions', window.location.origin);
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch action templates');
        return await response.json();
      } catch (error) {
        console.error('Error fetching action templates:', error);
        // Return sample data for demo
        return generateSampleActionTemplates();
      }
    }
  });
  
  // Fetch integrations
  const { data: integrations = [], isLoading: isLoadingIntegrations } = useQuery<Integration[]>({
    queryKey: ['/api/automation/integrations'],
    queryFn: async () => {
      try {
        const url = new URL('/api/automation/integrations', window.location.origin);
        
        if (user?.clientId) {
          url.searchParams.append('clientId', user.clientId.toString());
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch integrations');
        return await response.json();
      } catch (error) {
        console.error('Error fetching integrations:', error);
        // Return sample data for demo
        return generateSampleIntegrations();
      }
    }
  });
  
  // Run workflow mutation
  const runWorkflowMutation = useMutation({
    mutationFn: async ({ workflowId, parameters }: { workflowId: string, parameters?: any }) => {
      try {
        const response = await fetch(`/api/automation/workflows/${workflowId}/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parameters })
        });
        
        if (!response.ok) throw new Error('Failed to run workflow');
        return await response.json();
      } catch (error) {
        console.error('Error running workflow:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation/executions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/workflows'] });
      toast({
        title: 'Workflow Started',
        description: 'The workflow has been successfully started.'
      });
      setIsRunning(false);
      setIsRunWorkflowOpen(false);
      
      // Open execution details
      if (data.executionId) {
        // For demo, we'll simulate finding the execution
        setTimeout(() => {
          const newExecution = generateSampleExecutions(selectedWorkflow?.id || '')[0];
          setSelectedExecution(newExecution);
          setIsExecutionDetailsOpen(true);
        }, 1000);
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Run Workflow',
        description: error.message,
        variant: 'destructive'
      });
      setIsRunning(false);
    }
  });
  
  // Create workflow mutation
  const createWorkflowMutation = useMutation({
    mutationFn: async (workflowData: any) => {
      try {
        const response = await fetch('/api/automation/workflows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workflowData)
        });
        
        if (!response.ok) throw new Error('Failed to create workflow');
        return await response.json();
      } catch (error) {
        console.error('Error creating workflow:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation/workflows'] });
      toast({
        title: 'Workflow Created',
        description: 'The workflow has been successfully created.'
      });
      setIsCreateWorkflowOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Create Workflow',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Generate sample workflows for demo
  const generateSampleWorkflows = (): AutomationWorkflow[] => {
    return [
      {
        id: 'workflow-1',
        name: 'Automated Malware Response',
        description: 'Automatically isolate endpoints when malware is detected and initiate remediation.',
        category: 'response',
        status: 'active',
        trigger: {
          type: 'event',
          details: 'Triggered when malware is detected on an endpoint',
          eventType: 'malware_detected'
        },
        creator: 'admin',
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-04-20T00:00:00Z',
        lastRun: '2025-05-18T14:32:00Z',
        lastRunStatus: 'success',
        totalRuns: 17,
        successfulRuns: 15,
        failedRuns: 2,
        steps: [
          {
            id: 'step-1',
            workflowId: 'workflow-1',
            name: 'Isolate Infected Endpoint',
            description: 'Isolate the endpoint from the network to prevent spread',
            type: 'action',
            action: 'endpoint:isolate',
            parameters: {
              endpointId: '{{event.endpointId}}'
            },
            position: 1,
            nextSteps: ['step-2'],
            isConditional: false
          },
          {
            id: 'step-2',
            workflowId: 'workflow-1',
            name: 'Run Full Antivirus Scan',
            description: 'Initiate a full system scan with antivirus',
            type: 'action',
            action: 'endpoint:scan',
            parameters: {
              endpointId: '{{event.endpointId}}',
              scanType: 'full'
            },
            position: 2,
            nextSteps: ['step-3'],
            isConditional: false
          },
          {
            id: 'step-3',
            workflowId: 'workflow-1',
            name: 'Check Scan Results',
            description: 'Verify if malware was successfully removed',
            type: 'condition',
            conditionType: 'if',
            conditionExpression: '{{step.results.threatCount}} === 0',
            position: 3,
            nextSteps: ['step-4', 'step-5'],
            isConditional: true
          },
          {
            id: 'step-4',
            workflowId: 'workflow-1',
            name: 'Reconnect Endpoint',
            description: 'Reconnect endpoint to network if scan is clean',
            type: 'action',
            action: 'endpoint:deisolate',
            parameters: {
              endpointId: '{{event.endpointId}}'
            },
            position: 4,
            nextSteps: ['step-6'],
            isConditional: false
          },
          {
            id: 'step-5',
            workflowId: 'workflow-1',
            name: 'Create High Priority Ticket',
            description: 'Create ticket for manual intervention if threats remain',
            type: 'action',
            action: 'ticket:create',
            parameters: {
              title: 'Manual Malware Removal Required',
              description: 'Automated cleaning failed on {{event.endpoint.name}}',
              priority: 'high',
              assignee: 'security-team'
            },
            position: 5,
            nextSteps: ['step-6'],
            isConditional: false
          },
          {
            id: 'step-6',
            workflowId: 'workflow-1',
            name: 'Send Notification',
            description: 'Notify security team about the incident',
            type: 'action',
            action: 'notification:send',
            parameters: {
              channel: 'slack',
              message: 'Malware incident on {{event.endpoint.name}} has been processed'
            },
            position: 6,
            nextSteps: [],
            isConditional: false
          }
        ],
        integrations: ['endpoint-protection', 'ticketing-system', 'slack'],
        tags: ['malware', 'response', 'endpoint-protection']
      },
      {
        id: 'workflow-2',
        name: 'Critical Vulnerability Patching',
        description: 'Automatically deploy patches for critical vulnerabilities during maintenance windows.',
        category: 'remediation',
        status: 'active',
        trigger: {
          type: 'schedule',
          details: 'Runs weekly during scheduled maintenance window',
          schedule: '0 2 * * 0' // Every Sunday at 2 AM
        },
        creator: 'admin',
        createdAt: '2025-02-05T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z',
        lastRun: '2025-05-12T02:00:00Z',
        lastRunStatus: 'partial',
        totalRuns: 12,
        successfulRuns: 9,
        failedRuns: 3,
        steps: [
          {
            id: 'step-7',
            workflowId: 'workflow-2',
            name: 'Get Critical Vulnerabilities',
            description: 'Retrieve list of endpoints with critical vulnerabilities',
            type: 'action',
            action: 'vulnerability:list',
            parameters: {
              severities: ['critical'],
              patchAvailable: true
            },
            position: 1,
            nextSteps: ['step-8'],
            isConditional: false
          },
          {
            id: 'step-8',
            workflowId: 'workflow-2',
            name: 'Check Endpoint Count',
            description: 'Check if there are endpoints to patch',
            type: 'condition',
            conditionType: 'if',
            conditionExpression: '{{step.results.endpoints.length}} > 0',
            position: 2,
            nextSteps: ['step-9', 'step-12'],
            isConditional: true
          },
          {
            id: 'step-9',
            workflowId: 'workflow-2',
            name: 'Loop Through Endpoints',
            description: 'Process each endpoint with vulnerabilities',
            type: 'action',
            action: 'flow:foreach',
            parameters: {
              collection: '{{step.results.endpoints}}',
              variable: 'endpoint'
            },
            position: 3,
            nextSteps: ['step-10'],
            isConditional: false
          },
          {
            id: 'step-10',
            workflowId: 'workflow-2',
            name: 'Deploy Patches',
            description: 'Install required security patches',
            type: 'action',
            action: 'endpoint:patch',
            parameters: {
              endpointId: '{{endpoint.id}}',
              patches: '{{endpoint.criticalPatches}}'
            },
            position: 4,
            nextSteps: ['step-11'],
            isConditional: false
          },
          {
            id: 'step-11',
            workflowId: 'workflow-2',
            name: 'Verify Patch Installation',
            description: 'Confirm patches were successfully applied',
            type: 'action',
            action: 'endpoint:verify',
            parameters: {
              endpointId: '{{endpoint.id}}',
              patchIds: '{{endpoint.criticalPatches}}'
            },
            position: 5,
            nextSteps: [],
            isConditional: false
          },
          {
            id: 'step-12',
            workflowId: 'workflow-2',
            name: 'Generate Patching Report',
            description: 'Create report of patching results',
            type: 'action',
            action: 'report:generate',
            parameters: {
              reportType: 'vulnerability-patching',
              format: 'pdf',
              recipients: ['security-team@example.com']
            },
            position: 6,
            nextSteps: [],
            isConditional: false
          }
        ],
        integrations: ['vulnerability-scanner', 'patch-management', 'reporting'],
        tags: ['patching', 'vulnerability', 'scheduled']
      },
      {
        id: 'workflow-3',
        name: 'Security Policy Compliance Check',
        description: 'Routinely verify endpoints comply with security policies and remediate issues.',
        category: 'compliance',
        status: 'active',
        trigger: {
          type: 'schedule',
          details: 'Runs daily at 3 AM',
          schedule: '0 3 * * *'
        },
        creator: 'security-admin',
        createdAt: '2025-03-10T00:00:00Z',
        updatedAt: '2025-04-25T00:00:00Z',
        lastRun: '2025-05-19T03:00:00Z',
        lastRunStatus: 'success',
        totalRuns: 70,
        successfulRuns: 68,
        failedRuns: 2,
        steps: [
          {
            id: 'step-13',
            workflowId: 'workflow-3',
            name: 'Get Non-Compliant Endpoints',
            description: 'Identify endpoints not meeting security policy requirements',
            type: 'action',
            action: 'compliance:check',
            parameters: {
              policyIds: ['standard-endpoint-policy', 'data-protection-policy']
            },
            position: 1,
            nextSteps: ['step-14'],
            isConditional: false
          },
          {
            id: 'step-14',
            workflowId: 'workflow-3',
            name: 'Check Results',
            description: 'Check if non-compliant endpoints were found',
            type: 'condition',
            conditionType: 'if',
            conditionExpression: '{{step.results.nonCompliantCount}} > 0',
            position: 2,
            nextSteps: ['step-15', 'step-18'],
            isConditional: true
          },
          {
            id: 'step-15',
            workflowId: 'workflow-3',
            name: 'Apply Remediation Actions',
            description: 'Apply automatic fixes to non-compliant endpoints',
            type: 'action',
            action: 'compliance:remediate',
            parameters: {
              endpointIds: '{{step.results.nonCompliantEndpoints}}',
              autoFix: true
            },
            position: 3,
            nextSteps: ['step-16'],
            isConditional: false
          },
          {
            id: 'step-16',
            workflowId: 'workflow-3',
            name: 'Verify Remediation',
            description: 'Check if remediation was successful',
            type: 'action',
            action: 'compliance:verify',
            parameters: {
              endpointIds: '{{step.results.nonCompliantEndpoints}}'
            },
            position: 4,
            nextSteps: ['step-17'],
            isConditional: false
          },
          {
            id: 'step-17',
            workflowId: 'workflow-3',
            name: 'Create Tickets for Remaining Issues',
            description: 'Create tickets for issues that could not be auto-remediated',
            type: 'action',
            action: 'ticket:bulk-create',
            parameters: {
              tickets: '{{step.results.unresolvedIssues}}',
              assignee: 'endpoint-team'
            },
            position: 5,
            nextSteps: ['step-18'],
            isConditional: false
          },
          {
            id: 'step-18',
            workflowId: 'workflow-3',
            name: 'Update Compliance Dashboard',
            description: 'Refresh compliance stats on security dashboard',
            type: 'action',
            action: 'dashboard:update',
            parameters: {
              dashboardId: 'security-compliance',
              data: '{{all_steps.results}}'
            },
            position: 6,
            nextSteps: [],
            isConditional: false
          }
        ],
        integrations: ['compliance-manager', 'ticketing-system', 'security-dashboard'],
        tags: ['compliance', 'daily', 'policy']
      },
      {
        id: 'workflow-4',
        name: 'New User Security Onboarding',
        description: 'Automatically configure security settings for new user accounts.',
        category: 'integration',
        status: 'active',
        trigger: {
          type: 'event',
          details: 'Triggered when a new user is created in the directory',
          eventType: 'user_created'
        },
        creator: 'identity-admin',
        createdAt: '2025-01-20T00:00:00Z',
        updatedAt: '2025-03-15T00:00:00Z',
        lastRun: '2025-05-17T09:45:00Z',
        lastRunStatus: 'success',
        totalRuns: 42,
        successfulRuns: 41,
        failedRuns: 1,
        steps: [
          {
            id: 'step-19',
            workflowId: 'workflow-4',
            name: 'Assign Security Groups',
            description: 'Add user to required security groups based on role',
            type: 'action',
            action: 'identity:assign-groups',
            parameters: {
              userId: '{{event.userId}}',
              groups: ['baseline-security', '{{event.department}}-access']
            },
            position: 1,
            nextSteps: ['step-20'],
            isConditional: false
          },
          {
            id: 'step-20',
            workflowId: 'workflow-4',
            name: 'Enable MFA',
            description: 'Enforce multi-factor authentication',
            type: 'action',
            action: 'identity:configure-mfa',
            parameters: {
              userId: '{{event.userId}}',
              required: true,
              methods: ['app', 'sms']
            },
            position: 2,
            nextSteps: ['step-21'],
            isConditional: false
          },
          {
            id: 'step-21',
            workflowId: 'workflow-4',
            name: 'Apply Login Restrictions',
            description: 'Set geographic and time-based login restrictions',
            type: 'action',
            action: 'identity:login-policies',
            parameters: {
              userId: '{{event.userId}}',
              allowedCountries: ['US', 'CA'],
              workHours: '08:00-18:00'
            },
            position: 3,
            nextSteps: ['step-22'],
            isConditional: false
          },
          {
            id: 'step-22',
            workflowId: 'workflow-4',
            name: 'Send Welcome Email',
            description: 'Send security onboarding information to new user',
            type: 'action',
            action: 'notification:email',
            parameters: {
              recipient: '{{event.userEmail}}',
              template: 'security-onboarding',
              variables: {
                userName: '{{event.userName}}',
                securityGuideUrl: 'https://example.com/security-guide'
              }
            },
            position: 4,
            nextSteps: [],
            isConditional: false
          }
        ],
        integrations: ['identity-provider', 'email-service'],
        tags: ['onboarding', 'identity', 'automation']
      },
      {
        id: 'workflow-5',
        name: 'Security Alert Triage',
        description: 'Automatically analyze and categorize security alerts to reduce alert fatigue.',
        category: 'monitoring',
        status: 'active',
        trigger: {
          type: 'event',
          details: 'Triggered when a new security alert is generated',
          eventType: 'security_alert'
        },
        creator: 'security-admin',
        createdAt: '2025-02-25T00:00:00Z',
        updatedAt: '2025-04-05T00:00:00Z',
        lastRun: '2025-05-19T15:20:00Z',
        lastRunStatus: 'success',
        totalRuns: 126,
        successfulRuns: 123,
        failedRuns: 3,
        steps: [
          {
            id: 'step-23',
            workflowId: 'workflow-5',
            name: 'Enrich Alert Data',
            description: 'Add context from threat intelligence sources',
            type: 'action',
            action: 'threatintel:enrich',
            parameters: {
              alertId: '{{event.alertId}}',
              enrichmentSources: ['virustotal', 'alienvault', 'internal-threatdb']
            },
            position: 1,
            nextSteps: ['step-24'],
            isConditional: false
          },
          {
            id: 'step-24',
            workflowId: 'workflow-5',
            name: 'Calculate Risk Score',
            description: 'Determine alert priority based on multiple factors',
            type: 'action',
            action: 'alert:risk-score',
            parameters: {
              alertId: '{{event.alertId}}',
              factors: ['asset-criticality', 'threat-severity', 'intelligence-data']
            },
            position: 2,
            nextSteps: ['step-25'],
            isConditional: false
          },
          {
            id: 'step-25',
            workflowId: 'workflow-5',
            name: 'Check Risk Level',
            description: 'Route alert based on calculated risk score',
            type: 'condition',
            conditionType: 'switch',
            conditionExpression: '{{step.results.riskScore}}',
            position: 3,
            nextSteps: ['step-26', 'step-27', 'step-28'],
            isConditional: true
          },
          {
            id: 'step-26',
            workflowId: 'workflow-5',
            name: 'High Risk Processing',
            description: 'Handle high-risk alerts (score > 80)',
            type: 'action',
            action: 'alert:escalate',
            parameters: {
              alertId: '{{event.alertId}}',
              team: 'soc-tier1',
              priority: 'high',
              slaMinutes: 30
            },
            position: 4,
            nextSteps: ['step-29'],
            isConditional: false
          },
          {
            id: 'step-27',
            workflowId: 'workflow-5',
            name: 'Medium Risk Processing',
            description: 'Handle medium-risk alerts (score 50-80)',
            type: 'action',
            action: 'alert:queue',
            parameters: {
              alertId: '{{event.alertId}}',
              queue: 'regular-review',
              priority: 'medium',
              slaMinutes: 120
            },
            position: 5,
            nextSteps: ['step-29'],
            isConditional: false
          },
          {
            id: 'step-28',
            workflowId: 'workflow-5',
            name: 'Low Risk Processing',
            description: 'Handle low-risk alerts (score < 50)',
            type: 'action',
            action: 'alert:autoclose',
            parameters: {
              alertId: '{{event.alertId}}',
              reason: 'Low risk score after enrichment',
              notifyAnalyst: false
            },
            position: 6,
            nextSteps: ['step-29'],
            isConditional: false
          },
          {
            id: 'step-29',
            workflowId: 'workflow-5',
            name: 'Update Alert Record',
            description: 'Save enriched data and risk score to alert',
            type: 'action',
            action: 'alert:update',
            parameters: {
              alertId: '{{event.alertId}}',
              enrichedData: '{{all_steps.results}}',
              riskScore: '{{step-24.results.riskScore}}'
            },
            position: 7,
            nextSteps: [],
            isConditional: false
          }
        ],
        integrations: ['threat-intelligence', 'siem', 'ticketing-system'],
        tags: ['alert-management', 'triage', 'automation']
      }
    ];
  };
  
  // Generate sample executions for demo
  const generateSampleExecutions = (workflowId: string): WorkflowExecution[] => {
    if (workflowId === 'workflow-1') {
      return [
        {
          id: 'execution-1',
          workflowId: 'workflow-1',
          workflowName: 'Automated Malware Response',
          startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          endTime: new Date(Date.now() - 1000 * 60 * 28).toISOString(), // 28 minutes ago
          status: 'completed',
          trigger: 'event',
          triggeredBy: 'system',
          duration: 120, // seconds
          stepExecutions: [
            {
              id: 'step-execution-1',
              executionId: 'execution-1',
              stepId: 'step-1',
              stepName: 'Isolate Infected Endpoint',
              startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              endTime: new Date(Date.now() - 1000 * 60 * 29.8).toISOString(),
              status: 'completed',
              input: { endpointId: 'endpoint-2' },
              output: { success: true, message: 'Endpoint successfully isolated' },
              duration: 12
            },
            {
              id: 'step-execution-2',
              executionId: 'execution-1',
              stepId: 'step-2',
              stepName: 'Run Full Antivirus Scan',
              startTime: new Date(Date.now() - 1000 * 60 * 29.8).toISOString(),
              endTime: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
              status: 'completed',
              input: { endpointId: 'endpoint-2', scanType: 'full' },
              output: { success: true, threatCount: 1, threatsRemoved: 1 },
              duration: 48
            },
            {
              id: 'step-execution-3',
              executionId: 'execution-1',
              stepId: 'step-3',
              stepName: 'Check Scan Results',
              startTime: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
              endTime: new Date(Date.now() - 1000 * 60 * 28.9).toISOString(),
              status: 'completed',
              input: { threatCount: 0 },
              output: { result: true, path: 'step-4' },
              duration: 6
            },
            {
              id: 'step-execution-4',
              executionId: 'execution-1',
              stepId: 'step-4',
              stepName: 'Reconnect Endpoint',
              startTime: new Date(Date.now() - 1000 * 60 * 28.9).toISOString(),
              endTime: new Date(Date.now() - 1000 * 60 * 28.7).toISOString(),
              status: 'completed',
              input: { endpointId: 'endpoint-2' },
              output: { success: true, message: 'Endpoint successfully reconnected to network' },
              duration: 12
            },
            {
              id: 'step-execution-5',
              executionId: 'execution-1',
              stepId: 'step-6',
              stepName: 'Send Notification',
              startTime: new Date(Date.now() - 1000 * 60 * 28.7).toISOString(),
              endTime: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
              status: 'completed',
              input: { 
                channel: 'slack',
                message: 'Malware incident on SRV-DB01 has been processed'
              },
              output: { success: true, notificationId: 'notification-123' },
              duration: 42
            }
          ],
          variables: {
            event: {
              endpointId: 'endpoint-2',
              endpoint: {
                name: 'SRV-DB01',
                ip: '192.168.1.5'
              }
            }
          },
          result: {
            success: true,
            summary: 'Malware successfully removed and endpoint reconnected'
          }
        },
        {
          id: 'execution-2',
          workflowId: 'workflow-1',
          workflowName: 'Automated Malware Response',
          startTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          endTime: new Date(Date.now() - 1000 * 60 * 60 * 2.9).toISOString(), // 2.9 hours ago
          status: 'failed',
          trigger: 'event',
          triggeredBy: 'system',
          duration: 180, // seconds
          stepExecutions: [
            {
              id: 'step-execution-6',
              executionId: 'execution-2',
              stepId: 'step-1',
              stepName: 'Isolate Infected Endpoint',
              startTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
              endTime: new Date(Date.now() - 1000 * 60 * 60 * 2.98).toISOString(),
              status: 'completed',
              input: { endpointId: 'endpoint-3' },
              output: { success: true, message: 'Endpoint successfully isolated' },
              duration: 12
            },
            {
              id: 'step-execution-7',
              executionId: 'execution-2',
              stepId: 'step-2',
              stepName: 'Run Full Antivirus Scan',
              startTime: new Date(Date.now() - 1000 * 60 * 60 * 2.98).toISOString(),
              endTime: null,
              status: 'failed',
              input: { endpointId: 'endpoint-3', scanType: 'full' },
              error: 'Endpoint unreachable after isolation, scan could not be initiated',
              duration: 60
            }
          ],
          variables: {
            event: {
              endpointId: 'endpoint-3',
              endpoint: {
                name: 'LAPTOP-SALES12',
                ip: '10.10.30.22'
              }
            }
          },
          error: 'Failed to complete antivirus scan on isolated endpoint',
          result: {
            success: false,
            summary: 'Workflow failed at step "Run Full Antivirus Scan"'
          }
        }
      ];
    }
    
    return [];
  };
  
  // Generate sample action templates for demo
  const generateSampleActionTemplates = (): ActionTemplate[] => {
    return [
      {
        id: 'action-1',
        name: 'Isolate Endpoint',
        description: 'Isolate an endpoint from the network while maintaining management connection',
        category: 'Endpoint Management',
        type: 'action',
        parameters: [
          {
            name: 'endpointId',
            description: 'ID of the endpoint to isolate',
            type: 'string',
            required: true,
            placeholder: 'endpoint-123'
          },
          {
            name: 'isolationType',
            description: 'Type of isolation to apply',
            type: 'select',
            required: false,
            defaultValue: 'full',
            options: ['full', 'limited', 'custom']
          },
          {
            name: 'allowedConnections',
            description: 'List of IPs/hostnames to allow during isolation',
            type: 'multiselect',
            required: false,
            options: ['management-server', 'security-console', 'dns-server']
          }
        ],
        requiredPermissions: ['endpoint:manage'],
        integrations: ['endpoint-protection'],
        exampleUsage: 'endpoint:isolate(endpointId: "{{event.endpointId}}", isolationType: "full")'
      },
      {
        id: 'action-2',
        name: 'Run Security Scan',
        description: 'Execute a security scan on an endpoint',
        category: 'Endpoint Management',
        type: 'action',
        parameters: [
          {
            name: 'endpointId',
            description: 'ID of the endpoint to scan',
            type: 'string',
            required: true,
            placeholder: 'endpoint-123'
          },
          {
            name: 'scanType',
            description: 'Type of security scan to run',
            type: 'select',
            required: true,
            options: ['quick', 'full', 'custom']
          },
          {
            name: 'scanLocations',
            description: 'Specific locations to scan if using custom scan type',
            type: 'string',
            required: false,
            placeholder: 'C:\\Users,D:\\Data'
          }
        ],
        requiredPermissions: ['endpoint:scan'],
        integrations: ['endpoint-protection', 'antivirus'],
        exampleUsage: 'endpoint:scan(endpointId: "{{event.endpointId}}", scanType: "full")'
      },
      {
        id: 'action-3',
        name: 'Create Ticket',
        description: 'Create a new ticket in the ticketing system',
        category: 'Incident Management',
        type: 'action',
        parameters: [
          {
            name: 'title',
            description: 'Title of the ticket',
            type: 'string',
            required: true,
            placeholder: 'Security Incident: Malware Detected'
          },
          {
            name: 'description',
            description: 'Detailed description of the ticket',
            type: 'string',
            required: true,
            placeholder: 'Details about the security incident'
          },
          {
            name: 'priority',
            description: 'Priority level of the ticket',
            type: 'select',
            required: true,
            options: ['low', 'medium', 'high', 'critical']
          },
          {
            name: 'assignee',
            description: 'Person or team to assign the ticket to',
            type: 'string',
            required: false,
            placeholder: 'security-team'
          }
        ],
        requiredPermissions: ['ticket:create'],
        integrations: ['ticketing-system'],
        exampleUsage: 'ticket:create(title: "Malware Detected", description: "Malware found on endpoint {{event.endpoint.name}}", priority: "high", assignee: "security-team")'
      },
      {
        id: 'action-4',
        name: 'Send Notification',
        description: 'Send a notification through various channels',
        category: 'Notifications',
        type: 'action',
        parameters: [
          {
            name: 'channel',
            description: 'Notification channel to use',
            type: 'select',
            required: true,
            options: ['email', 'slack', 'sms', 'teams']
          },
          {
            name: 'recipients',
            description: 'Recipients of the notification',
            type: 'string',
            required: false,
            placeholder: 'security@example.com,admin@example.com'
          },
          {
            name: 'message',
            description: 'Message content to send',
            type: 'string',
            required: true,
            placeholder: 'Security alert: Suspicious activity detected'
          },
          {
            name: 'severity',
            description: 'Severity level of the notification',
            type: 'select',
            required: false,
            options: ['info', 'warning', 'critical'],
            defaultValue: 'info'
          }
        ],
        requiredPermissions: ['notification:send'],
        integrations: ['email-service', 'slack', 'sms-gateway', 'teams'],
        exampleUsage: 'notification:send(channel: "slack", message: "Security incident resolved on {{event.endpoint.name}}")'
      },
      {
        id: 'action-5',
        name: 'Update Alert Status',
        description: 'Update the status of a security alert',
        category: 'Alert Management',
        type: 'action',
        parameters: [
          {
            name: 'alertId',
            description: 'ID of the alert to update',
            type: 'string',
            required: true,
            placeholder: 'alert-123'
          },
          {
            name: 'status',
            description: 'New status for the alert',
            type: 'select',
            required: true,
            options: ['new', 'in-progress', 'resolved', 'closed', 'false-positive']
          },
          {
            name: 'resolution',
            description: 'Resolution details for the alert',
            type: 'string',
            required: false,
            placeholder: 'Malware removed and system restored'
          },
          {
            name: 'assignee',
            description: 'New assignee for the alert',
            type: 'string',
            required: false,
            placeholder: 'john.doe'
          }
        ],
        requiredPermissions: ['alert:manage'],
        integrations: ['alert-management-system'],
        exampleUsage: 'alert:update(alertId: "{{event.alertId}}", status: "resolved", resolution: "Automated remediation completed")'
      }
    ];
  };
  
  // Generate sample integrations for demo
  const generateSampleIntegrations = (): Integration[] => {
    return [
      {
        id: 'integration-1',
        name: 'Endpoint Protection Platform',
        type: 'security',
        description: 'Integration with endpoint security solution for threat detection and response',
        status: 'connected',
        lastConnected: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        icon: 'shield',
        actions: ['isolate', 'scan', 'remediate', 'update', 'status']
      },
      {
        id: 'integration-2',
        name: 'Slack',
        type: 'communication',
        description: 'Send notifications and alerts to Slack channels',
        status: 'error',
        lastConnected: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        icon: 'message-square',
        actions: ['send-message', 'create-channel', 'get-user-presence']
      },
      {
        id: 'integration-3',
        name: 'ServiceDesk',
        type: 'ticketing',
        description: 'Create and manage tickets for security incidents',
        status: 'connected',
        lastConnected: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        icon: 'ticket',
        actions: ['create-ticket', 'update-ticket', 'assign-ticket', 'close-ticket']
      },
      {
        id: 'integration-4',
        name: 'Vulnerability Scanner',
        type: 'security',
        description: 'Scan systems for vulnerabilities and track remediation',
        status: 'connected',
        lastConnected: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
        icon: 'search',
        actions: ['scan', 'get-vulnerabilities', 'get-stats', 'generate-report']
      },
      {
        id: 'integration-5',
        name: 'Email Service',
        type: 'communication',
        description: 'Send email notifications to users and groups',
        status: 'connected',
        lastConnected: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        icon: 'mail',
        actions: ['send-email', 'get-templates', 'verify-delivery']
      }
    ];
  };
  
  // Filter workflows based on search query and filters
  const filteredWorkflows = workflows.filter(workflow => {
    const searchMatch = !searchQuery || 
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.trigger.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workflow.tags && workflow.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const categoryMatch = !categoryFilter || workflow.category === categoryFilter;
    const statusMatch = !statusFilter || workflow.status === statusFilter;
    
    return searchMatch && categoryMatch && statusMatch;
  });
  
  // Open workflow details
  const handleOpenWorkflowDetails = (workflow: AutomationWorkflow) => {
    setSelectedWorkflow(workflow);
    setIsWorkflowDetailsOpen(true);
  };
  
  // Open execution details
  const handleOpenExecutionDetails = (execution: WorkflowExecution) => {
    setSelectedExecution(execution);
    setIsExecutionDetailsOpen(true);
  };
  
  // Handle running a workflow
  const handleRunWorkflow = (workflow: AutomationWorkflow) => {
    setSelectedWorkflow(workflow);
    setIsRunWorkflowOpen(true);
  };
  
  // Execute workflow run
  const executeWorkflowRun = () => {
    if (!selectedWorkflow) return;
    
    setIsRunning(true);
    
    runWorkflowMutation.mutate({
      workflowId: selectedWorkflow.id,
      parameters: {}
    });
  };
  
  // Handle creating a new workflow
  const handleCreateWorkflow = () => {
    createWorkflowMutation.mutate({
      name: newWorkflow.name,
      description: newWorkflow.description,
      category: newWorkflow.category,
      trigger: newWorkflow.trigger,
      steps: []
    });
  };
  
  // Get category badge with appropriate color
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'response':
        return <Badge className="bg-red-600">{category}</Badge>;
      case 'remediation':
        return <Badge className="bg-orange-600">{category}</Badge>;
      case 'compliance':
        return <Badge className="bg-blue-600">{category}</Badge>;
      case 'monitoring':
        return <Badge className="bg-green-600">{category}</Badge>;
      case 'integration':
        return <Badge className="bg-purple-600">{category}</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };
  
  // Get status badge with appropriate color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">{status}</Badge>;
      case 'disabled':
        return <Badge variant="outline">{status}</Badge>;
      case 'draft':
        return <Badge className="bg-amber-600">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get execution status badge with appropriate color
  const getExecutionStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-600">
            <AlertCircle className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
      case 'running':
        return (
          <Badge className="bg-blue-600">
            <Activity className="mr-1 h-3 w-3 animate-pulse" />
            {status}
          </Badge>
        );
      case 'canceled':
        return (
          <Badge className="bg-amber-600">
            <ZapOff className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
      case 'queued':
        return (
          <Badge className="bg-purple-600">
            <Clock className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get step status badge with appropriate color
  const getStepStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-600">
            <Check className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-600">
            <AlertCircle className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
      case 'running':
        return (
          <Badge className="bg-blue-600">
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
            {status}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
      case 'skipped':
        return (
          <Badge className="bg-gray-600">
            <ArrowRight className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get integration status badge with appropriate color
  const getIntegrationStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-green-600">
            <Check className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="outline">
            <PowerOff className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-600">
            <AlertCircle className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };
  
  // Format time ago for display
  const formatTimeAgo = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
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
      return dateString;
    }
  };
  
  // Format duration for display
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'N/A';
    
    if (seconds < 60) return `${seconds} sec`;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
  };
  
  // Get appropriate icon for integration
  const getIntegrationIcon = (iconName: string): React.ReactNode => {
    switch (iconName) {
      case 'shield':
        return <Shield className="h-5 w-5" />;
      case 'message-square':
        return <MessageSquare className="h-5 w-5" />;
      case 'ticket':
        return <FileText className="h-5 w-5" />;
      case 'search':
        return <Search className="h-5 w-5" />;
      case 'mail':
        return <Mail className="h-5 w-5" />;
      default:
        return <Puzzle className="h-5 w-5" />;
    }
  };
  
  // Render workflows tab content
  const renderWorkflowsTab = () => {
    if (isLoadingWorkflows) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (filteredWorkflows.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Workflow className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No workflows found</h3>
          <p className="text-gray-400 mt-2">
            {searchQuery || categoryFilter || statusFilter
              ? 'Try adjusting your filters to see more results'
              : 'Create a workflow to automate security tasks'}
          </p>
          <Button className="mt-4" onClick={() => setIsCreateWorkflowOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => (
          <Card 
            key={workflow.id} 
            className="cursor-pointer hover:bg-gray-800/50"
            onClick={() => handleOpenWorkflowDetails(workflow)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{workflow.name}</h3>
                    {getCategoryBadge(workflow.category)}
                    {getStatusBadge(workflow.status)}
                  </div>
                  <p className="text-gray-400 mt-1">{workflow.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="flex items-center">
                      {workflow.trigger.type === 'event' && <Zap className="mr-1 h-3 w-3" />}
                      {workflow.trigger.type === 'schedule' && <Clock className="mr-1 h-3 w-3" />}
                      {workflow.trigger.type === 'manual' && <Play className="mr-1 h-3 w-3" />}
                      {workflow.trigger.details}
                    </Badge>
                    {workflow.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400 mr-2">Last run:</span>
                    {workflow.lastRun ? (
                      <>
                        {workflow.lastRunStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
                        {workflow.lastRunStatus === 'failed' && <AlertCircle className="h-4 w-4 text-red-500 mr-1" />}
                        {workflow.lastRunStatus === 'partial' && <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />}
                        <span className="text-sm">{formatTimeAgo(workflow.lastRun)}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">Never</span>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunWorkflow(workflow);
                    }}
                    disabled={workflow.status !== 'active'}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Run Now
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Success Rate</span>
                  <span>
                    {workflow.totalRuns > 0
                      ? `${Math.round((workflow.successfulRuns / workflow.totalRuns) * 100)}%`
                      : 'N/A'}
                  </span>
                </div>
                {workflow.totalRuns > 0 ? (
                  <Progress 
                    value={(workflow.successfulRuns / workflow.totalRuns) * 100} 
                    className="h-2" 
                  />
                ) : (
                  <Progress value={0} className="h-2" />
                )}
                
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                  <div className="flex items-center">
                    <Workflow className="h-4 w-4 mr-1" />
                    {workflow.steps.length} Steps
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    {workflow.successfulRuns} Successful
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                    {workflow.failedRuns} Failed
                  </div>
                  <div className="flex items-center">
                    <History className="h-4 w-4 mr-1" />
                    {workflow.totalRuns} Total Runs
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render actions tab content
  const renderActionsTab = () => {
    if (isLoadingTemplates) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Available Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge variant="outline">{template.category}</Badge>
                  <Badge>{template.type}</Badge>
                </div>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription>
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs text-gray-400 mb-2">Required Parameters:</div>
                <div className="space-y-1">
                  {template.parameters
                    .filter(param => param.required)
                    .map((param, index) => (
                      <div key={index} className="bg-gray-800 rounded p-1 flex items-center">
                        <code className="text-xs font-mono text-blue-400">{param.name}</code>
                        <span className="text-xs text-gray-400 ml-2">({param.type})</span>
                      </div>
                    ))}
                </div>
                <div className="mt-3 text-xs text-gray-400">Integrations:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.integrations.map((integration, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {integration}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <div className="text-xs font-mono bg-gray-800 p-2 rounded overflow-x-auto">
                    <code className="text-green-400">{template.exampleUsage}</code>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  // Render integrations tab content
  const renderIntegrationsTab = () => {
    if (isLoadingIntegrations) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Available Integrations</h3>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Integration
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardContent className="p-6">
                <div className="flex">
                  <div className="bg-gray-800 p-4 rounded-full">
                    {getIntegrationIcon(integration.icon)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{integration.name}</h3>
                      {getIntegrationStatusBadge(integration.status)}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{integration.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-xs text-gray-400">
                        Last connected: {integration.lastConnected ? formatTimeAgo(integration.lastConnected) : 'Never'}
                      </div>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  // Render dashboard tab content
  const renderDashboardTab = () => {
    // Calculate overall workflow stats
    const totalWorkflows = workflows.length;
    const activeWorkflows = workflows.filter(w => w.status === 'active').length;
    const eventTriggered = workflows.filter(w => w.trigger.type === 'event').length;
    const scheduled = workflows.filter(w => w.trigger.type === 'schedule').length;
    const manual = workflows.filter(w => w.trigger.type === 'manual').length;
    
    // Calculate execution stats
    const totalExecutions = workflows.reduce((sum, w) => sum + w.totalRuns, 0);
    const successfulExecutions = workflows.reduce((sum, w) => sum + w.successfulRuns, 0);
    const failedExecutions = workflows.reduce((sum, w) => sum + w.failedRuns, 0);
    const successRate = totalExecutions > 0 
      ? Math.round((successfulExecutions / totalExecutions) * 100)
      : 0;
    
    // Find recently run workflows
    const recentWorkflows = [...workflows]
      .filter(w => w.lastRun)
      .sort((a, b) => {
        if (!a.lastRun || !b.lastRun) return 0;
        return new Date(b.lastRun).getTime() - new Date(a.lastRun).getTime();
      })
      .slice(0, 5);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Workflow stats overview */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Workflow Overview</CardTitle>
            <CardDescription>
              Summary of automation workflows and executions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold">{totalWorkflows}</div>
                <div className="text-xs text-gray-400">Total Workflows</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-500">{activeWorkflows}</div>
                <div className="text-xs text-gray-400">Active</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-500">{totalExecutions}</div>
                <div className="text-xs text-gray-400">Total Runs</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-amber-500">{successRate}%</div>
                <div className="text-xs text-gray-400">Success Rate</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Trigger Types</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-amber-400 mr-1" />
                      <span>Event-based</span>
                    </div>
                    <span>{eventTriggered} workflows</span>
                  </div>
                  <Progress 
                    value={(eventTriggered / totalWorkflows) * 100} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-400 mr-1" />
                      <span>Scheduled</span>
                    </div>
                    <span>{scheduled} workflows</span>
                  </div>
                  <Progress 
                    value={(scheduled / totalWorkflows) * 100} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <Play className="h-4 w-4 text-green-400 mr-1" />
                      <span>Manual</span>
                    </div>
                    <span>{manual} workflows</span>
                  </div>
                  <Progress 
                    value={(manual / totalWorkflows) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Execution Results</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span>Successful</span>
                    </div>
                    <span>{successfulExecutions} executions</span>
                  </div>
                  <Progress 
                    value={(successfulExecutions / totalExecutions) * 100} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span>Failed</span>
                    </div>
                    <span>{failedExecutions} executions</span>
                  </div>
                  <Progress 
                    value={(failedExecutions / totalExecutions) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Integration status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>
              Connected services and systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-800 p-2 rounded-full mr-2">
                      {getIntegrationIcon(integration.icon)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{integration.name}</div>
                      <div className="text-xs text-gray-400">{integration.type}</div>
                    </div>
                  </div>
                  {getIntegrationStatusBadge(integration.status)}
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Manage Integrations
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent workflow runs */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Recent Workflow Runs</CardTitle>
            <CardDescription>
              Latest automation workflow executions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Run Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentWorkflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-xs text-gray-400">ID: {workflow.id}</div>
                      </TableCell>
                      <TableCell>
                        {workflow.lastRunStatus && getExecutionStatusBadge(workflow.lastRunStatus)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center">
                          {workflow.trigger.type === 'event' && <Zap className="mr-1 h-3 w-3" />}
                          {workflow.trigger.type === 'schedule' && <Clock className="mr-1 h-3 w-3" />}
                          {workflow.trigger.type === 'manual' && <Play className="mr-1 h-3 w-3" />}
                          {workflow.trigger.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {workflow.lastRun ? formatTimeAgo(workflow.lastRun) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {workflow.lastRun ? formatDuration(120) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleRunWorkflow(workflow)}>
                          <Play className="h-4 w-4 mr-1" />
                          Run Again
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Workflow className="mr-2 h-6 w-6" />
            Security Automation Workflows
          </h2>
          <p className="text-gray-400">
            Create, manage, and run automated security response workflows
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsCreateWorkflowOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            AI Assistant
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select
              value={categoryFilter || ''}
              onValueChange={(value) => setCategoryFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="response">Response</SelectItem>
                <SelectItem value="remediation">Remediation</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="integration">Integration</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={statusFilter || ''}
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="lastRun">
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastRun">Last Run Time</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="successRate">Success Rate</SelectItem>
                <SelectItem value="runCount">Run Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Main navigation tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger 
                value="dashboard"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="workflows"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <Workflow className="mr-2 h-4 w-4" />
                Workflows
              </TabsTrigger>
              <TabsTrigger 
                value="actions"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <Zap className="mr-2 h-4 w-4" />
                Actions
              </TabsTrigger>
              <TabsTrigger 
                value="integrations"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <Link className="mr-2 h-4 w-4" />
                Integrations
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Tab content */}
      <div className="pt-2">
        {activeTab === 'dashboard' && renderDashboardTab()}
        {activeTab === 'workflows' && renderWorkflowsTab()}
        {activeTab === 'actions' && renderActionsTab()}
        {activeTab === 'integrations' && renderIntegrationsTab()}
      </div>
      
      {/* Workflow Details Dialog */}
      {selectedWorkflow && (
        <Dialog open={isWorkflowDetailsOpen} onOpenChange={setIsWorkflowDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                {getCategoryBadge(selectedWorkflow.category)}
                {getStatusBadge(selectedWorkflow.status)}
              </div>
              <DialogTitle className="text-xl mt-2">{selectedWorkflow.name}</DialogTitle>
              <DialogDescription>
                {selectedWorkflow.description}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="pt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">
                  <Info className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="executions">
                  <History className="mr-2 h-4 w-4" />
                  Executions
                </TabsTrigger>
                <TabsTrigger value="editor">
                  <FileCode className="mr-2 h-4 w-4" />
                  Workflow Editor
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">Trigger Information</h3>
                      <div className="bg-gray-700 p-3 rounded-lg mb-3">
                        <div className="flex items-center">
                          {selectedWorkflow.trigger.type === 'event' && <Zap className="h-5 w-5 mr-2 text-amber-400" />}
                          {selectedWorkflow.trigger.type === 'schedule' && <Clock className="h-5 w-5 mr-2 text-blue-400" />}
                          {selectedWorkflow.trigger.type === 'manual' && <Play className="h-5 w-5 mr-2 text-green-400" />}
                          <span className="font-medium capitalize">{selectedWorkflow.trigger.type} Trigger</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">
                          {selectedWorkflow.trigger.details}
                        </p>
                        {selectedWorkflow.trigger.type === 'schedule' && selectedWorkflow.trigger.schedule && (
                          <div className="mt-2 text-xs bg-gray-600 p-2 rounded font-mono">
                            Schedule: {selectedWorkflow.trigger.schedule}
                          </div>
                        )}
                        {selectedWorkflow.trigger.type === 'event' && selectedWorkflow.trigger.eventType && (
                          <div className="mt-2 text-xs bg-gray-600 p-2 rounded font-mono">
                            Event Type: {selectedWorkflow.trigger.eventType}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">Workflow Steps</h3>
                      
                      <div className="space-y-1 relative">
                        {/* Connector line */}
                        <div className="absolute left-3 top-8 bottom-8 w-0.5 bg-gray-700 z-0"></div>
                        
                        {selectedWorkflow.steps.map((step, index) => (
                          <div key={step.id} className="relative z-10">
                            <div 
                              className={`
                                bg-gray-700 p-3 rounded-lg mb-2 relative 
                                ${step.isConditional ? 'border-l-4 border-amber-500' : ''}
                              `}
                            >
                              <div className="flex items-center">
                                <div className="bg-gray-900 h-6 w-6 rounded-full flex items-center justify-center text-xs mr-2">
                                  {index + 1}
                                </div>
                                <div className="font-medium">{step.name}</div>
                                {step.type === 'action' && (
                                  <Badge className="ml-2 bg-blue-600">{step.type}</Badge>
                                )}
                                {step.type === 'condition' && (
                                  <Badge className="ml-2 bg-amber-600">{step.type}</Badge>
                                )}
                                {step.type === 'trigger' && (
                                  <Badge className="ml-2 bg-green-600">{step.type}</Badge>
                                )}
                                {step.type === 'integration' && (
                                  <Badge className="ml-2 bg-purple-600">{step.type}</Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-300 mt-1">
                                {step.description}
                              </p>
                              
                              {step.isConditional && step.conditionExpression && (
                                <div className="mt-2 bg-gray-600/50 p-2 rounded text-xs font-mono">
                                  <span className="text-orange-400">if</span>{' '}
                                  <span className="text-blue-300">{step.conditionExpression}</span>
                                </div>
                              )}
                              
                              {step.type === 'action' && step.action && (
                                <div className="mt-2 bg-gray-600/50 p-2 rounded text-xs font-mono">
                                  <span className="text-green-400">{step.action}</span>
                                  {step.parameters && (
                                    <span className="text-gray-300">
                                      {'('} 
                                      {Object.entries(step.parameters).map(([key, value], i, arr) => (
                                        <span key={key}>
                                          <span className="text-blue-300">{key}</span>
                                          <span className="text-gray-300">: </span>
                                          <span className="text-amber-300">"{value}"</span>
                                          {i < arr.length - 1 && <span className="text-gray-300">, </span>}
                                        </span>
                                      ))}
                                      {')'}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Show branch lines for conditions */}
                            {step.isConditional && step.nextSteps.length > 1 && (
                              <div className="ml-3 pl-4 border-l border-amber-500 pb-2">
                                <div className="flex gap-2 items-center">
                                  <div className="h-0.5 w-3 bg-amber-500"></div>
                                  <div className="text-xs text-amber-500">Conditional branches: {step.nextSteps.join(', ')}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">Workflow Information</h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          {getStatusBadge(selectedWorkflow.status)}
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Category:</span>
                          {getCategoryBadge(selectedWorkflow.category)}
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Created:</span>
                          <span>{formatDate(selectedWorkflow.createdAt)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Updated:</span>
                          <span>{formatDate(selectedWorkflow.updatedAt)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Created By:</span>
                          <span>{selectedWorkflow.creator}</span>
                        </div>
                        
                        {selectedWorkflow.lastRun && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Last Run:</span>
                            <span>{formatDate(selectedWorkflow.lastRun)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Runs:</span>
                          <span>{selectedWorkflow.totalRuns}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Success Rate:</span>
                          <span>
                            {selectedWorkflow.totalRuns > 0
                              ? `${Math.round((selectedWorkflow.successfulRuns / selectedWorkflow.totalRuns) * 100)}%`
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">Integrations</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorkflow.integrations.map((integration, index) => (
                          <Badge key={index} variant="outline" className="flex items-center">
                            <Link className="h-3 w-3 mr-1" />
                            {integration}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorkflow.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        onClick={() => {
                          setIsWorkflowDetailsOpen(false);
                          handleRunWorkflow(selectedWorkflow);
                        }}
                        disabled={selectedWorkflow.status !== 'active'}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Run Now
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="executions" className="mt-4 space-y-4">
                {isLoadingExecutions ? (
                  <div className="h-60 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : executions.length === 0 ? (
                  <div className="bg-gray-800 rounded-lg p-8 text-center">
                    <History className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium">No execution history</h3>
                    <p className="text-gray-400 mt-2">
                      This workflow has not been executed yet
                    </p>
                    <Button className="mt-4" onClick={() => handleRunWorkflow(selectedWorkflow)}>
                      <Play className="mr-2 h-4 w-4" />
                      Run Workflow
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md border-gray-800">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Trigger</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {executions.map((execution) => (
                          <TableRow 
                            key={execution.id}
                            className="cursor-pointer hover:bg-gray-800/50"
                            onClick={() => handleOpenExecutionDetails(execution)}
                          >
                            <TableCell>
                              <div className="font-mono text-xs">{execution.id}</div>
                            </TableCell>
                            <TableCell>
                              {getExecutionStatusBadge(execution.status)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{formatDate(execution.startTime)}</div>
                              <div className="text-xs text-gray-400">{formatTimeAgo(execution.startTime)}</div>
                            </TableCell>
                            <TableCell>
                              {execution.duration && formatDuration(execution.duration)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {execution.trigger === 'event' && <Zap className="mr-1 h-3 w-3" />}
                                {execution.trigger === 'scheduled' && <Clock className="mr-1 h-3 w-3" />}
                                {execution.trigger === 'manual' && <Play className="mr-1 h-3 w-3" />}
                                {execution.trigger}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenExecutionDetails(execution);
                                }}
                              >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="editor" className="mt-4">
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <FileCode className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">Workflow Editor</h3>
                  <p className="text-gray-400 mt-2">
                    Visual workflow editor allows you to build and modify automations
                  </p>
                  <Button className="mt-4">
                    <Edit className="mr-2 h-4 w-4" />
                    Open Editor
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Execution Details Dialog */}
      {selectedExecution && (
        <Dialog open={isExecutionDetailsOpen} onOpenChange={setIsExecutionDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="capitalize">
                  {selectedExecution.trigger === 'event' && <Zap className="mr-1 h-3 w-3" />}
                  {selectedExecution.trigger === 'scheduled' && <Clock className="mr-1 h-3 w-3" />}
                  {selectedExecution.trigger === 'manual' && <Play className="mr-1 h-3 w-3" />}
                  {selectedExecution.trigger} Trigger
                </Badge>
                {getExecutionStatusBadge(selectedExecution.status)}
              </div>
              <DialogTitle className="text-xl mt-2">
                Workflow Execution: {selectedExecution.workflowName}
              </DialogTitle>
              <DialogDescription>
                Execution started at {formatDate(selectedExecution.startTime)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-medium mb-3">Execution Steps</h3>
                    
                    <div className="space-y-3">
                      {selectedExecution.stepExecutions.map((step) => (
                        <Accordion
                          key={step.id}
                          type="single"
                          collapsible
                          className={`bg-gray-700 rounded-lg overflow-hidden ${
                            step.status === 'failed' ? 'border-l-4 border-red-600' : ''
                          }`}
                        >
                          <AccordionItem value="details" className="border-b-0">
                            <AccordionTrigger className="px-4 py-2 hover:bg-gray-600/50">
                              <div className="flex items-center text-left">
                                <div className="mr-2">
                                  {step.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                                  {step.status === 'failed' && <AlertCircle className="h-5 w-5 text-red-500" />}
                                  {step.status === 'running' && <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />}
                                  {step.status === 'pending' && <Clock className="h-5 w-5 text-gray-400" />}
                                  {step.status === 'skipped' && <ArrowRight className="h-5 w-5 text-gray-400" />}
                                </div>
                                <div>
                                  <div className="font-medium">{step.stepName}</div>
                                  <div className="text-xs text-gray-400 flex items-center">
                                    <Timer className="h-3 w-3 mr-1" />
                                    {step.duration && formatDuration(step.duration)}
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs text-gray-400 mb-1">Input:</div>
                                  <div className="bg-gray-800 p-2 rounded text-xs font-mono overflow-x-auto">
                                    {step.input ? JSON.stringify(step.input, null, 2) : 'No input data'}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-xs text-gray-400 mb-1">
                                    {step.status === 'failed' ? 'Error:' : 'Output:'}
                                  </div>
                                  <div className={`bg-gray-800 p-2 rounded text-xs font-mono overflow-x-auto ${
                                    step.status === 'failed' ? 'text-red-400' : ''
                                  }`}>
                                    {step.error 
                                      ? step.error 
                                      : step.output 
                                        ? JSON.stringify(step.output, null, 2) 
                                        : 'No output data'
                                    }
                                  </div>
                                </div>
                                
                                <div className="flex justify-between text-xs text-gray-400">
                                  <div>Started: {formatDate(step.startTime)}</div>
                                  {step.endTime && (
                                    <div>Finished: {formatDate(step.endTime)}</div>
                                  )}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-medium mb-2">Execution Details</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        {getExecutionStatusBadge(selectedExecution.status)}
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Started:</span>
                        <span>{formatDate(selectedExecution.startTime)}</span>
                      </div>
                      
                      {selectedExecution.endTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Completed:</span>
                          <span>{formatDate(selectedExecution.endTime)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span>{selectedExecution.duration && formatDuration(selectedExecution.duration)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Triggered By:</span>
                        <span>{selectedExecution.triggeredBy || 'System'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Workflow ID:</span>
                        <span className="font-mono text-xs">{selectedExecution.workflowId}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Execution ID:</span>
                        <span className="font-mono text-xs">{selectedExecution.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedExecution.variables && Object.keys(selectedExecution.variables).length > 0 && (
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">Execution Variables</h3>
                      <div className="bg-gray-700 p-2 rounded text-xs font-mono overflow-x-auto">
                        <pre className="whitespace-pre-wrap break-all">
                          {JSON.stringify(selectedExecution.variables, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {selectedExecution.result && (
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">Execution Result</h3>
                      <div className={`p-3 rounded-lg ${
                        selectedExecution.result.success 
                          ? 'bg-green-900/20 border border-green-800' 
                          : 'bg-red-900/20 border border-red-800'
                      }`}>
                        <div className="flex items-center">
                          {selectedExecution.result.success 
                            ? <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            : <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          }
                          <span className={selectedExecution.result.success ? 'text-green-400' : 'text-red-400'}>
                            {selectedExecution.result.success ? 'Success' : 'Failed'}
                          </span>
                        </div>
                        <div className="mt-1 text-sm">
                          {selectedExecution.result.summary}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <FileText className="mr-2 h-4 w-4" />
                      Export Logs
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        setIsExecutionDetailsOpen(false);
                        handleRunWorkflow(
                          workflows.find(w => w.id === selectedExecution.workflowId) 
                            || selectedWorkflow!
                        );
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Re-run
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Run Workflow Dialog */}
      <Dialog open={isRunWorkflowOpen} onOpenChange={setIsRunWorkflowOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Workflow</DialogTitle>
            <DialogDescription>
              Execute the workflow "{selectedWorkflow?.name}" manually
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center">
                  {getCategoryBadge(selectedWorkflow?.category || '')}
                  <h4 className="font-medium ml-2">{selectedWorkflow?.name}</h4>
                </div>
                <p className="text-sm text-gray-400 mt-1">{selectedWorkflow?.description}</p>
              </div>
              
              <div className="p-4 border border-gray-700 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Execution Parameters</h4>
                <p className="text-xs text-gray-400">
                  This workflow doesn't require any input parameters.
                </p>
              </div>
              
              <p className="text-sm text-gray-400">
                Running this workflow will execute all defined steps according to the workflow logic.
                You'll be able to view detailed execution results when completed.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRunWorkflowOpen(false)} disabled={isRunning}>
              Cancel
            </Button>
            <Button onClick={executeWorkflowRun} disabled={isRunning}>
              {isRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Workflow
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Workflow Dialog */}
      <Dialog open={isCreateWorkflowOpen} onOpenChange={setIsCreateWorkflowOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Create a new automation workflow to respond to security events
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="workflow-name">Name</Label>
              <Input 
                id="workflow-name" 
                placeholder="Enter workflow name" 
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea 
                id="workflow-description" 
                placeholder="Enter workflow description" 
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="workflow-category">Category</Label>
              <Select 
                value={newWorkflow.category}
                onValueChange={(value) => setNewWorkflow({ ...newWorkflow, category: value as any })}
              >
                <SelectTrigger id="workflow-category" className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="response">Response</SelectItem>
                  <SelectItem value="remediation">Remediation</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="workflow-trigger">Trigger Type</Label>
              <Select 
                value={newWorkflow.trigger.type}
                onValueChange={(value) => setNewWorkflow({ 
                  ...newWorkflow, 
                  trigger: { 
                    ...newWorkflow.trigger, 
                    type: value as any,
                    details: value === 'event' 
                      ? 'Triggered by a security event' 
                      : value === 'schedule' 
                        ? 'Runs on a schedule' 
                        : 'Triggered manually'
                  } 
                })}
              >
                <SelectTrigger id="workflow-trigger" className="mt-1">
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newWorkflow.trigger.type === 'event' && (
              <div>
                <Label htmlFor="event-type">Event Type</Label>
                <Select defaultValue="security_alert">
                  <SelectTrigger id="event-type" className="mt-1">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security_alert">Security Alert</SelectItem>
                    <SelectItem value="malware_detected">Malware Detected</SelectItem>
                    <SelectItem value="vulnerability_found">Vulnerability Found</SelectItem>
                    <SelectItem value="compliance_violation">Compliance Violation</SelectItem>
                    <SelectItem value="user_created">User Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {newWorkflow.trigger.type === 'schedule' && (
              <div>
                <Label htmlFor="schedule">Schedule (cron format)</Label>
                <Input 
                  id="schedule" 
                  placeholder="0 0 * * *" // Daily at midnight
                  className="mt-1"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Example: "0 0 * * *" runs daily at midnight
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateWorkflowOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkflow}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Mail } from 'lucide-react';