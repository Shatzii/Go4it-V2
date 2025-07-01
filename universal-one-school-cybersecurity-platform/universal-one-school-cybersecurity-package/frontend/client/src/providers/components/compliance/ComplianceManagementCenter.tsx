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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  CheckSquare,
  ChevronDown,
  ClipboardList,
  Download,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  HelpCircle,
  Info,
  Layers,
  LayoutDashboard,
  ListChecks,
  PenSquare,
  Percent,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Tag,
  XCircle,
  Zap
} from 'lucide-react';

// Compliance framework interface
interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  totalControls: number;
  relevantControls: number;
  implementedControls: number;
  partialControls: number;
  notImplementedControls: number;
  notApplicableControls: number;
  lastAssessment?: string;
  nextAssessment?: string;
  status: 'active' | 'pending' | 'inactive';
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  tags: string[];
}

// Control interface
interface ComplianceControl {
  id: string;
  frameworkId: string;
  controlId: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  status: 'implemented' | 'partial' | 'not-implemented' | 'not-applicable';
  priority: 'low' | 'medium' | 'high' | 'critical';
  implementation?: string;
  evidence?: Evidence[];
  lastAssessment?: string;
  nextAssessment?: string;
  assignedTo?: string;
  relatedControls?: string[];
  tags: string[];
  notes?: string;
}

// Evidence interface
interface Evidence {
  id: string;
  controlId: string;
  title: string;
  description: string;
  type: 'document' | 'screenshot' | 'log' | 'attestation' | 'other';
  url?: string;
  uploadDate: string;
  uploadedBy: string;
  expiryDate?: string;
  status: 'valid' | 'expired' | 'pending-review';
  tags: string[];
}

// Assessment interface
interface ComplianceAssessment {
  id: string;
  frameworkId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed';
  assignedTo: string;
  completedBy?: string;
  completionDate?: string;
  totalControls: number;
  assessedControls: number;
  passedControls: number;
  failedControls: number;
  naControls: number;
  findings: AssessmentFinding[];
  attachments?: string[];
  notes?: string;
}

// Assessment finding interface
interface AssessmentFinding {
  id: string;
  assessmentId: string;
  controlId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'remediated' | 'accepted';
  remediationPlan?: string;
  dueDate?: string;
  assignedTo?: string;
  createdDate: string;
  closedDate?: string;
  tags: string[];
}

export function ComplianceManagementCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | null>(null);
  const [selectedControl, setSelectedControl] = useState<ComplianceControl | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<ComplianceAssessment | null>(null);
  const [isFrameworkDetailsOpen, setIsFrameworkDetailsOpen] = useState(false);
  const [isControlDetailsOpen, setIsControlDetailsOpen] = useState(false);
  const [isAssessmentDetailsOpen, setIsAssessmentDetailsOpen] = useState(false);
  const [isAssessmentCreationOpen, setIsAssessmentCreationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Fetch compliance frameworks
  const { data: frameworks = [], isLoading: isLoadingFrameworks } = useQuery<ComplianceFramework[]>({
    queryKey: ['/api/compliance/frameworks'],
    queryFn: async () => {
      try {
        const url = new URL('/api/compliance/frameworks', window.location.origin);
        
        if (user?.clientId) {
          url.searchParams.append('clientId', user.clientId.toString());
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch compliance frameworks');
        return await response.json();
      } catch (error) {
        console.error('Error fetching compliance frameworks:', error);
        // Return sample data for demo
        return generateSampleFrameworks();
      }
    }
  });
  
  // Fetch controls for the selected framework
  const { data: controls = [], isLoading: isLoadingControls } = useQuery<ComplianceControl[]>({
    queryKey: ['/api/compliance/controls', selectedFramework?.id],
    enabled: !!selectedFramework,
    queryFn: async () => {
      try {
        const url = new URL('/api/compliance/controls', window.location.origin);
        
        url.searchParams.append('frameworkId', selectedFramework?.id || '');
        
        if (user?.clientId) {
          url.searchParams.append('clientId', user.clientId.toString());
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch compliance controls');
        return await response.json();
      } catch (error) {
        console.error('Error fetching compliance controls:', error);
        // Return sample data for demo
        return generateSampleControls(selectedFramework?.id || '');
      }
    }
  });
  
  // Fetch assessments
  const { data: assessments = [], isLoading: isLoadingAssessments } = useQuery<ComplianceAssessment[]>({
    queryKey: ['/api/compliance/assessments'],
    queryFn: async () => {
      try {
        const url = new URL('/api/compliance/assessments', window.location.origin);
        
        if (user?.clientId) {
          url.searchParams.append('clientId', user.clientId.toString());
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch compliance assessments');
        return await response.json();
      } catch (error) {
        console.error('Error fetching compliance assessments:', error);
        // Return sample data for demo
        return generateSampleAssessments();
      }
    }
  });
  
  // Fetch evidence for a control
  const { data: evidence = [], isLoading: isLoadingEvidence } = useQuery<Evidence[]>({
    queryKey: ['/api/compliance/evidence', selectedControl?.id],
    enabled: !!selectedControl,
    queryFn: async () => {
      try {
        const url = new URL('/api/compliance/evidence', window.location.origin);
        
        url.searchParams.append('controlId', selectedControl?.id || '');
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch evidence');
        return await response.json();
      } catch (error) {
        console.error('Error fetching evidence:', error);
        // Return sample data for demo
        return generateSampleEvidence(selectedControl?.id || '');
      }
    }
  });
  
  // Update control status mutation
  const updateControlStatusMutation = useMutation({
    mutationFn: async ({ controlId, status, notes }: { controlId: string, status: string, notes?: string }) => {
      try {
        const response = await fetch(`/api/compliance/controls/${controlId}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, notes })
        });
        
        if (!response.ok) throw new Error('Failed to update control status');
        return await response.json();
      } catch (error) {
        console.error('Error updating control status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/controls'] });
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/frameworks'] });
      toast({
        title: 'Control Updated',
        description: 'The control status has been updated successfully.'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Generate sample frameworks for demo
  const generateSampleFrameworks = (): ComplianceFramework[] => {
    return [
      {
        id: 'framework-1',
        name: 'NIST Cybersecurity Framework',
        description: 'The National Institute of Standards and Technology Framework for Improving Critical Infrastructure Cybersecurity.',
        category: 'Cybersecurity',
        version: '1.1',
        totalControls: 108,
        relevantControls: 98,
        implementedControls: 52,
        partialControls: 28,
        notImplementedControls: 18,
        notApplicableControls: 10,
        lastAssessment: '2025-03-15',
        nextAssessment: '2025-09-15',
        status: 'active',
        complianceScore: 68,
        riskLevel: 'medium',
        assignedTo: 'security-team',
        tags: ['critical-infrastructure', 'federal', 'cybersecurity']
      },
      {
        id: 'framework-2',
        name: 'ISO 27001',
        description: 'International standard for information security management systems (ISMS).',
        category: 'Information Security',
        version: '2022',
        totalControls: 114,
        relevantControls: 114,
        implementedControls: 75,
        partialControls: 22,
        notImplementedControls: 17,
        notApplicableControls: 0,
        lastAssessment: '2025-01-20',
        nextAssessment: '2026-01-20',
        status: 'active',
        complianceScore: 76,
        riskLevel: 'low',
        assignedTo: 'compliance-team',
        tags: ['isms', 'certification', 'international']
      },
      {
        id: 'framework-3',
        name: 'HIPAA Security Rule',
        description: 'Health Insurance Portability and Accountability Act Security Standards for the Protection of Electronic Protected Health Information.',
        category: 'Healthcare',
        version: '2013',
        totalControls: 75,
        relevantControls: 72,
        implementedControls: 41,
        partialControls: 19,
        notImplementedControls: 12,
        notApplicableControls: 3,
        lastAssessment: '2025-02-10',
        nextAssessment: '2025-08-10',
        status: 'active',
        complianceScore: 63,
        riskLevel: 'high',
        assignedTo: 'healthcare-compliance',
        tags: ['healthcare', 'phi', 'regulatory']
      },
      {
        id: 'framework-4',
        name: 'PCI DSS',
        description: 'Payment Card Industry Data Security Standard for organizations that handle credit card data.',
        category: 'Financial',
        version: '4.0',
        totalControls: 86,
        relevantControls: 86,
        implementedControls: 67,
        partialControls: 14,
        notImplementedControls: 5,
        notApplicableControls: 0,
        lastAssessment: '2025-04-05',
        nextAssessment: '2025-10-05',
        status: 'active',
        complianceScore: 82,
        riskLevel: 'medium',
        assignedTo: 'finance-security',
        tags: ['payment', 'cardholder-data', 'financial']
      },
      {
        id: 'framework-5',
        name: 'GDPR',
        description: 'General Data Protection Regulation for data protection and privacy in the European Union.',
        category: 'Privacy',
        version: '2018',
        totalControls: 92,
        relevantControls: 88,
        implementedControls: 56,
        partialControls: 20,
        notImplementedControls: 12,
        notApplicableControls: 4,
        lastAssessment: '2025-01-30',
        nextAssessment: '2025-07-30',
        status: 'active',
        complianceScore: 71,
        riskLevel: 'medium',
        assignedTo: 'privacy-office',
        tags: ['privacy', 'eu', 'data-protection']
      }
    ];
  };
  
  // Generate sample controls for demo
  const generateSampleControls = (frameworkId: string): ComplianceControl[] => {
    const controls: ComplianceControl[] = [];
    
    if (frameworkId === 'framework-1') {
      // NIST CSF controls
      controls.push(
        {
          id: 'control-1',
          frameworkId: 'framework-1',
          controlId: 'ID.AM-1',
          title: 'Physical devices and systems inventory',
          description: 'Physical devices and systems within the organization are inventoried.',
          category: 'Identify',
          subcategory: 'Asset Management',
          status: 'implemented',
          priority: 'high',
          implementation: 'Asset management system with automated discovery implemented.',
          lastAssessment: '2025-03-15',
          nextAssessment: '2025-09-15',
          assignedTo: 'asset-team',
          tags: ['assets', 'inventory']
        },
        {
          id: 'control-2',
          frameworkId: 'framework-1',
          controlId: 'PR.AC-1',
          title: 'Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users, and processes',
          description: 'Access to assets and associated facilities is limited to authorized users, processes, and devices, and to authorized activities and transactions.',
          category: 'Protect',
          subcategory: 'Access Control',
          status: 'partial',
          priority: 'critical',
          implementation: 'Identity management system implemented, but lacking regular audit processes.',
          lastAssessment: '2025-03-15',
          nextAssessment: '2025-06-15',
          assignedTo: 'identity-team',
          tags: ['access-control', 'identity']
        },
        {
          id: 'control-3',
          frameworkId: 'framework-1',
          controlId: 'DE.CM-1',
          title: 'Network monitoring',
          description: 'The network is monitored to detect potential cybersecurity events.',
          category: 'Detect',
          subcategory: 'Continuous Monitoring',
          status: 'implemented',
          priority: 'high',
          implementation: 'Network monitoring solution with 24/7 SOC coverage implemented.',
          lastAssessment: '2025-03-10',
          nextAssessment: '2025-09-10',
          assignedTo: 'security-operations',
          tags: ['monitoring', 'network']
        },
        {
          id: 'control-4',
          frameworkId: 'framework-1',
          controlId: 'RS.CO-1',
          title: 'Response planning',
          description: 'Response processes and procedures are executed and maintained to ensure response to detected cybersecurity incidents.',
          category: 'Respond',
          subcategory: 'Response Planning',
          status: 'partial',
          priority: 'high',
          implementation: 'Incident response plan documented but lacking regular testing.',
          lastAssessment: '2025-02-20',
          nextAssessment: '2025-05-20',
          assignedTo: 'incident-response',
          tags: ['incident-response', 'planning']
        },
        {
          id: 'control-5',
          frameworkId: 'framework-1',
          controlId: 'RC.RP-1',
          title: 'Recovery planning',
          description: 'Recovery processes and procedures are executed and maintained to ensure restoration of systems or assets affected by cybersecurity incidents.',
          category: 'Recover',
          subcategory: 'Recovery Planning',
          status: 'not-implemented',
          priority: 'medium',
          implementation: 'Recovery planning needs to be developed.',
          lastAssessment: '2025-03-15',
          nextAssessment: '2025-06-15',
          assignedTo: 'disaster-recovery',
          tags: ['recovery', 'continuity']
        }
      );
    } else if (frameworkId === 'framework-2') {
      // ISO 27001 controls
      controls.push(
        {
          id: 'control-6',
          frameworkId: 'framework-2',
          controlId: 'A.5.1.1',
          title: 'Information Security Policies',
          description: 'A set of policies for information security shall be defined, approved by management, published and communicated to employees and relevant external parties.',
          category: 'Information Security Policies',
          status: 'implemented',
          priority: 'high',
          implementation: 'Comprehensive security policy documented and communicated.',
          lastAssessment: '2025-01-20',
          nextAssessment: '2025-07-20',
          assignedTo: 'security-policy',
          tags: ['policy', 'documentation']
        },
        {
          id: 'control-7',
          frameworkId: 'framework-2',
          controlId: 'A.6.1.1',
          title: 'Information security roles and responsibilities',
          description: 'All information security responsibilities shall be defined and allocated.',
          category: 'Organization of Information Security',
          status: 'implemented',
          priority: 'high',
          implementation: 'Roles and responsibilities clearly defined in security documentation.',
          lastAssessment: '2025-01-20',
          nextAssessment: '2025-07-20',
          assignedTo: 'security-leadership',
          tags: ['roles', 'responsibilities']
        }
      );
    }
    
    return controls;
  };
  
  // Generate sample evidence for demo
  const generateSampleEvidence = (controlId: string): Evidence[] => {
    if (controlId === 'control-1') {
      return [
        {
          id: 'evidence-1',
          controlId: 'control-1',
          title: 'Asset Inventory Report',
          description: 'Quarterly asset inventory report from automated discovery system.',
          type: 'document',
          url: '/documents/asset-inventory-q1-2025.pdf',
          uploadDate: '2025-04-01',
          uploadedBy: 'asset-manager',
          status: 'valid',
          tags: ['quarterly-report', 'automated']
        },
        {
          id: 'evidence-2',
          controlId: 'control-1',
          title: 'Asset Management Policy',
          description: 'Current asset management policy document.',
          type: 'document',
          url: '/documents/asset-policy-v3.1.pdf',
          uploadDate: '2024-11-15',
          uploadedBy: 'policy-manager',
          status: 'valid',
          tags: ['policy', 'procedures']
        }
      ];
    } else if (controlId === 'control-2') {
      return [
        {
          id: 'evidence-3',
          controlId: 'control-2',
          title: 'Identity Management Dashboard',
          description: 'Screenshot of identity management system dashboard showing active users and access levels.',
          type: 'screenshot',
          url: '/documents/idm-dashboard-2025-03.png',
          uploadDate: '2025-03-10',
          uploadedBy: 'identity-admin',
          status: 'valid',
          tags: ['screenshot', 'dashboard']
        }
      ];
    }
    
    return [];
  };
  
  // Generate sample assessments for demo
  const generateSampleAssessments = (): ComplianceAssessment[] => {
    return [
      {
        id: 'assessment-1',
        frameworkId: 'framework-1',
        title: 'NIST CSF Annual Assessment',
        description: 'Annual comprehensive assessment of NIST Cybersecurity Framework implementation.',
        startDate: '2025-03-01',
        endDate: '2025-03-15',
        status: 'completed',
        assignedTo: 'security-team',
        completedBy: 'security-lead',
        completionDate: '2025-03-15',
        totalControls: 108,
        assessedControls: 108,
        passedControls: 80,
        failedControls: 28,
        naControls: 0,
        findings: [
          {
            id: 'finding-1',
            assessmentId: 'assessment-1',
            controlId: 'PR.AC-1',
            title: 'Incomplete Identity Auditing Process',
            description: 'Regular user access review process is not consistently performed across all systems.',
            severity: 'high',
            status: 'in-progress',
            remediationPlan: 'Implement quarterly user access reviews across all critical systems.',
            dueDate: '2025-06-15',
            assignedTo: 'identity-team',
            createdDate: '2025-03-15',
            tags: ['identity', 'audit']
          },
          {
            id: 'finding-2',
            assessmentId: 'assessment-1',
            controlId: 'RC.RP-1',
            title: 'Recovery Plan Not Developed',
            description: 'Formal recovery processes after security incidents have not been documented.',
            severity: 'high',
            status: 'open',
            remediationPlan: 'Develop and document comprehensive recovery procedures.',
            dueDate: '2025-07-01',
            assignedTo: 'disaster-recovery',
            createdDate: '2025-03-15',
            tags: ['recovery', 'documentation']
          }
        ]
      },
      {
        id: 'assessment-2',
        frameworkId: 'framework-2',
        title: 'ISO 27001 Internal Audit',
        description: 'Internal audit in preparation for ISO 27001 recertification.',
        startDate: '2025-01-10',
        endDate: '2025-01-20',
        status: 'completed',
        assignedTo: 'audit-team',
        completedBy: 'lead-auditor',
        completionDate: '2025-01-20',
        totalControls: 114,
        assessedControls: 114,
        passedControls: 97,
        failedControls: 17,
        naControls: 0,
        findings: [
          {
            id: 'finding-3',
            assessmentId: 'assessment-2',
            controlId: 'A.12.6.1',
            title: 'Vulnerability Management Issues',
            description: 'Vulnerabilities are not being remediated within the timeframes specified in policy.',
            severity: 'medium',
            status: 'in-progress',
            remediationPlan: 'Review and improve vulnerability management process with clear SLAs.',
            dueDate: '2025-03-30',
            assignedTo: 'vulnerability-team',
            createdDate: '2025-01-20',
            tags: ['vulnerabilities', 'remediation']
          }
        ]
      },
      {
        id: 'assessment-3',
        frameworkId: 'framework-4',
        title: 'PCI DSS Pre-Assessment',
        description: 'Internal pre-assessment before formal PCI DSS audit.',
        startDate: '2025-03-20',
        endDate: '2025-04-05',
        status: 'completed',
        assignedTo: 'pci-team',
        completedBy: 'security-consultant',
        completionDate: '2025-04-05',
        totalControls: 86,
        assessedControls: 86,
        passedControls: 81,
        failedControls: 5,
        naControls: 0,
        findings: [
          {
            id: 'finding-4',
            assessmentId: 'assessment-3',
            controlId: 'Req-3.5.1',
            title: 'Encryption Key Management',
            description: 'Encryption key management procedures not fully documented or tested.',
            severity: 'high',
            status: 'open',
            remediationPlan: 'Develop formal key management procedures and implement regular testing.',
            dueDate: '2025-05-30',
            assignedTo: 'crypto-team',
            createdDate: '2025-04-05',
            tags: ['encryption', 'key-management']
          }
        ]
      },
      {
        id: 'assessment-4',
        frameworkId: 'framework-5',
        title: 'GDPR Readiness Assessment',
        description: 'Assessment of GDPR compliance and data protection practices.',
        startDate: '2025-01-15',
        endDate: '2025-01-30',
        status: 'completed',
        assignedTo: 'privacy-team',
        completedBy: 'privacy-officer',
        completionDate: '2025-01-30',
        totalControls: 88,
        assessedControls: 88,
        passedControls: 76,
        failedControls: 12,
        naControls: 0,
        findings: [
          {
            id: 'finding-5',
            assessmentId: 'assessment-4',
            controlId: 'Art-30',
            title: 'Incomplete Records of Processing',
            description: 'Records of processing activities are not comprehensive for all data processing systems.',
            severity: 'high',
            status: 'in-progress',
            remediationPlan: 'Complete data mapping exercise and update records of processing.',
            dueDate: '2025-03-15',
            assignedTo: 'data-protection',
            createdDate: '2025-01-30',
            tags: ['gdpr', 'documentation']
          }
        ]
      }
    ];
  };
  
  // Filter data based on search query and filters
  const filteredFrameworks = frameworks.filter(framework => {
    const searchMatch = !searchQuery || 
      framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      framework.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      framework.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (framework.tags && framework.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const statusMatch = !statusFilter || framework.status === statusFilter;
    
    return searchMatch && statusMatch;
  });
  
  // Open framework details
  const handleOpenFrameworkDetails = (framework: ComplianceFramework) => {
    setSelectedFramework(framework);
    setIsFrameworkDetailsOpen(true);
  };
  
  // Open control details
  const handleOpenControlDetails = (control: ComplianceControl) => {
    setSelectedControl(control);
    setIsControlDetailsOpen(true);
  };
  
  // Open assessment details
  const handleOpenAssessmentDetails = (assessment: ComplianceAssessment) => {
    setSelectedAssessment(assessment);
    setIsAssessmentDetailsOpen(true);
  };
  
  // Handle status change for a control
  const handleControlStatusChange = (control: ComplianceControl, newStatus: string) => {
    updateControlStatusMutation.mutate({
      controlId: control.id,
      status: newStatus,
      notes: `Status changed to ${newStatus}`
    });
  };
  
  // Get risk level badge with appropriate color
  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
        return <Badge className="bg-red-600">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-600">Low</Badge>;
      default:
        return <Badge>{riskLevel}</Badge>;
    }
  };
  
  // Get control status badge with appropriate color
  const getControlStatusBadge = (status: string) => {
    switch (status) {
      case 'implemented':
        return <Badge className="bg-green-600">Implemented</Badge>;
      case 'partial':
        return <Badge className="bg-amber-600">Partial</Badge>;
      case 'not-implemented':
        return <Badge className="bg-red-600">Not Implemented</Badge>;
      case 'not-applicable':
        return <Badge variant="outline">Not Applicable</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Calculate days until next assessment
  const getDaysUntilNextAssessment = (nextAssessmentDate?: string): number => {
    if (!nextAssessmentDate) return 0;
    
    const today = new Date();
    const nextDate = new Date(nextAssessmentDate);
    const diffTime = nextDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Get status color for days remaining
  const getStatusColorForDaysRemaining = (days: number): string => {
    if (days < 0) return 'text-red-600';
    if (days < 15) return 'text-orange-600';
    if (days < 30) return 'text-amber-600';
    return 'text-green-600';
  };
  
  // Render dashboard tab content
  const renderDashboardTab = () => {
    // Calculate overall compliance score
    const overallScore = frameworks.length
      ? Math.round(frameworks.reduce((sum, fw) => sum + fw.complianceScore, 0) / frameworks.length)
      : 0;
    
    // Count frameworks by risk level
    const frameworksByRisk = {
      critical: frameworks.filter(f => f.riskLevel === 'critical').length,
      high: frameworks.filter(f => f.riskLevel === 'high').length,
      medium: frameworks.filter(f => f.riskLevel === 'medium').length,
      low: frameworks.filter(f => f.riskLevel === 'low').length
    };
    
    // Calculate control implementation stats across all frameworks
    const controlStats = {
      total: frameworks.reduce((sum, fw) => sum + fw.totalControls, 0),
      implemented: frameworks.reduce((sum, fw) => sum + fw.implementedControls, 0),
      partial: frameworks.reduce((sum, fw) => sum + fw.partialControls, 0),
      notImplemented: frameworks.reduce((sum, fw) => sum + fw.notImplementedControls, 0),
      notApplicable: frameworks.reduce((sum, fw) => sum + fw.notApplicableControls, 0)
    };
    
    // Find upcoming assessments
    const upcomingAssessments = [...frameworks]
      .filter(fw => fw.nextAssessment)
      .sort((a, b) => {
        if (!a.nextAssessment || !b.nextAssessment) return 0;
        return new Date(a.nextAssessment).getTime() - new Date(b.nextAssessment).getTime();
      })
      .slice(0, 3);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall compliance score */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Overall Compliance Status</CardTitle>
            <CardDescription>
              Aggregated compliance score across all frameworks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-bold">{overallScore}%</span>
                <Badge className={
                  overallScore >= 80 ? 'bg-green-600' :
                  overallScore >= 60 ? 'bg-amber-600' :
                  'bg-red-600'
                }>
                  {overallScore >= 80 ? 'Good' : overallScore >= 60 ? 'Needs Improvement' : 'At Risk'}
                </Badge>
              </div>
              <Progress 
                value={overallScore} 
                className="h-3" 
                indicatorClassName={
                  overallScore >= 80 ? 'bg-green-600' :
                  overallScore >= 60 ? 'bg-amber-600' :
                  'bg-red-600'
                }
              />
              <div className="text-sm text-gray-400 mt-2">
                Based on {frameworks.length} active compliance frameworks
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-400">Critical Risk</div>
                <div className="text-red-600 text-xl font-bold">{frameworksByRisk.critical}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-400">High Risk</div>
                <div className="text-orange-600 text-xl font-bold">{frameworksByRisk.high}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-400">Medium Risk</div>
                <div className="text-amber-600 text-xl font-bold">{frameworksByRisk.medium}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-400">Low Risk</div>
                <div className="text-green-600 text-xl font-bold">{frameworksByRisk.low}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Control implementation status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Control Status</CardTitle>
            <CardDescription>
              Implementation status of controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Implemented</span>
                <span className="text-green-600">
                  {controlStats.implemented} 
                  <span className="text-gray-400 text-xs ml-1">
                    ({Math.round((controlStats.implemented / controlStats.total) * 100)}%)
                  </span>
                </span>
              </div>
              <Progress value={(controlStats.implemented / controlStats.total) * 100} className="h-2" indicatorClassName="bg-green-600" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Partial</span>
                <span className="text-amber-600">
                  {controlStats.partial}
                  <span className="text-gray-400 text-xs ml-1">
                    ({Math.round((controlStats.partial / controlStats.total) * 100)}%)
                  </span>
                </span>
              </div>
              <Progress value={(controlStats.partial / controlStats.total) * 100} className="h-2" indicatorClassName="bg-amber-600" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Not Implemented</span>
                <span className="text-red-600">
                  {controlStats.notImplemented}
                  <span className="text-gray-400 text-xs ml-1">
                    ({Math.round((controlStats.notImplemented / controlStats.total) * 100)}%)
                  </span>
                </span>
              </div>
              <Progress value={(controlStats.notImplemented / controlStats.total) * 100} className="h-2" indicatorClassName="bg-red-600" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Not Applicable</span>
                <span className="text-gray-400">
                  {controlStats.notApplicable}
                  <span className="text-gray-400 text-xs ml-1">
                    ({Math.round((controlStats.notApplicable / controlStats.total) * 100)}%)
                  </span>
                </span>
              </div>
              <Progress value={(controlStats.notApplicable / controlStats.total) * 100} className="h-2" indicatorClassName="bg-gray-600" />
              
              <div className="text-xs text-gray-400 mt-2 text-center">
                Total: {controlStats.total} controls across all frameworks
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming assessments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>
              Next scheduled compliance assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAssessments.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-400">No upcoming assessments scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAssessments.map((framework) => {
                  const daysUntil = getDaysUntilNextAssessment(framework.nextAssessment);
                  return (
                    <div key={framework.id} className="bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between">
                        <div className="font-medium">{framework.name}</div>
                        {getRiskLevelBadge(framework.riskLevel)}
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-400">Due Date:</span>
                        <span>{formatDate(framework.nextAssessment)}</span>
                      </div>
                      <div className="flex justify-between mt-1 text-sm">
                        <span className="text-gray-400">Days Remaining:</span>
                        <span className={getStatusColorForDaysRemaining(daysUntil)}>
                          {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent assessment findings */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Recent Assessment Findings</CardTitle>
            <CardDescription>
              Latest findings from compliance assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <ClipboardList className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-400">No assessment findings available</p>
              </div>
            ) : (
              <div className="border rounded-md border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Finding</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments
                      .flatMap(a => a.findings)
                      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
                      .slice(0, 5)
                      .map(finding => (
                        <TableRow key={finding.id}>
                          <TableCell>
                            <div className="font-medium">{finding.title}</div>
                            <div className="text-xs text-gray-400">
                              {assessments.find(a => a.id === finding.assessmentId)?.title || 'Unknown Assessment'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              finding.severity === 'critical' ? 'bg-red-600' :
                              finding.severity === 'high' ? 'bg-orange-600' :
                              finding.severity === 'medium' ? 'bg-amber-600' :
                              'bg-green-600'
                            }>
                              {finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              finding.status === 'open' ? 'border-red-500 text-red-500' :
                              finding.status === 'in-progress' ? 'border-amber-500 text-amber-500' :
                              finding.status === 'remediated' ? 'border-green-500 text-green-500' :
                              'border-blue-500 text-blue-500'
                            }>
                              {finding.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {finding.dueDate ? (
                              <div className={getStatusColorForDaysRemaining(getDaysUntilNextAssessment(finding.dueDate))}>
                                {formatDate(finding.dueDate)}
                              </div>
                            ) : (
                              <span className="text-gray-400">Not set</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render frameworks tab content
  const renderFrameworksTab = () => {
    if (isLoadingFrameworks) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (filteredFrameworks.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No compliance frameworks found</h3>
          <p className="text-gray-400 mt-2">
            {searchQuery || statusFilter ? 'Try adjusting your filters' : 'Add a compliance framework to get started'}
          </p>
          <Button className="mt-4">
            <Zap className="mr-2 h-4 w-4" />
            Add Framework
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {filteredFrameworks.map((framework) => (
          <Card 
            key={framework.id} 
            className="cursor-pointer hover:bg-gray-800/50"
            onClick={() => handleOpenFrameworkDetails(framework)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{framework.name}</h3>
                    <Badge variant="outline">v{framework.version}</Badge>
                    {framework.status === 'active' ? (
                      <Badge className="bg-green-600">Active</Badge>
                    ) : framework.status === 'pending' ? (
                      <Badge className="bg-amber-600">Pending</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-gray-400 mt-1">{framework.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {framework.category}
                    </Badge>
                    {framework.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center">
                    <Percent className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="font-medium">{framework.complianceScore}% Compliant</span>
                    {getRiskLevelBadge(framework.riskLevel)}
                  </div>
                  
                  {framework.nextAssessment && (
                    <div className="text-sm">
                      <span className="text-gray-400">Next Assessment:</span>{' '}
                      <span className={getStatusColorForDaysRemaining(getDaysUntilNextAssessment(framework.nextAssessment))}>
                        {formatDate(framework.nextAssessment)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Implementation Progress</span>
                  <span>
                    {framework.implementedControls + framework.partialControls} of {framework.relevantControls} controls
                  </span>
                </div>
                <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div 
                      className="bg-green-600 h-full" 
                      style={{ width: `${(framework.implementedControls / framework.relevantControls) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-amber-600 h-full" 
                      style={{ width: `${(framework.partialControls / framework.relevantControls) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-gray-400">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full mr-1"></div>
                    Implemented: {framework.implementedControls}
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-600 rounded-full mr-1"></div>
                    Partial: {framework.partialControls}
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-600 rounded-full mr-1"></div>
                    Not Implemented: {framework.notImplementedControls}
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-600 rounded-full mr-1"></div>
                    N/A: {framework.notApplicableControls}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render controls tab content when a framework is selected
  const renderControlsTab = () => {
    if (!selectedFramework) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <ListChecks className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Select a framework to view controls</h3>
          <p className="text-gray-400 mt-2">
            Controls are shown for the selected compliance framework
          </p>
          <Button className="mt-4" onClick={() => setActiveTab('frameworks')}>
            <Shield className="mr-2 h-4 w-4" />
            View Frameworks
          </Button>
        </div>
      );
    }
    
    if (isLoadingControls) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (controls.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <ListChecks className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No controls found</h3>
          <p className="text-gray-400 mt-2">
            No controls have been defined for this framework
          </p>
          <Button className="mt-4">
            <PenSquare className="mr-2 h-4 w-4" />
            Add Control
          </Button>
        </div>
      );
    }
    
    // Group controls by category
    const controlsByCategory = controls.reduce((acc, control) => {
      if (!acc[control.category]) {
        acc[control.category] = [];
      }
      acc[control.category].push(control);
      return acc;
    }, {} as Record<string, ComplianceControl[]>);
    
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium">{selectedFramework.name}</h3>
              <p className="text-gray-400 text-sm">{selectedFramework.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedFramework(null)}>
                <Shield className="mr-2 h-4 w-4" />
                Change Framework
              </Button>
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Controls
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="bg-gray-700 rounded-lg p-2 text-center min-w-[100px]">
              <div className="text-2xl font-bold">
                {selectedFramework.implementedControls}
                <span className="text-xs text-gray-400 ml-1">
                  /{selectedFramework.relevantControls}
                </span>
              </div>
              <div className="text-xs text-gray-400">Implemented</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-2 text-center min-w-[100px]">
              <div className="text-2xl font-bold text-amber-600">
                {selectedFramework.partialControls}
              </div>
              <div className="text-xs text-gray-400">Partial</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-2 text-center min-w-[100px]">
              <div className="text-2xl font-bold text-red-600">
                {selectedFramework.notImplementedControls}
              </div>
              <div className="text-xs text-gray-400">Not Implemented</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-2 text-center min-w-[100px]">
              <div className="text-2xl font-bold text-gray-500">
                {selectedFramework.notApplicableControls}
              </div>
              <div className="text-xs text-gray-400">Not Applicable</div>
            </div>
          </div>
        </div>
        
        {Object.entries(controlsByCategory).map(([category, categoryControls]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-medium flex items-center">
              <Layers className="mr-2 h-5 w-5" />
              {category}
              <Badge className="ml-2">{categoryControls.length}</Badge>
            </h3>
            
            <div className="border rounded-md border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control ID</TableHead>
                    <TableHead className="w-full">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Last Assessed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryControls.map((control) => (
                    <TableRow 
                      key={control.id} 
                      className="cursor-pointer hover:bg-gray-800/50"
                      onClick={() => handleOpenControlDetails(control)}
                    >
                      <TableCell>
                        <div className="font-mono">
                          {control.controlId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{control.title}</div>
                        {control.subcategory && (
                          <div className="text-xs text-gray-400">{control.subcategory}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getControlStatusBadge(control.status)}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          control.priority === 'critical' ? 'bg-red-600' :
                          control.priority === 'high' ? 'bg-orange-600' :
                          control.priority === 'medium' ? 'bg-amber-600' :
                          'bg-green-600'
                        }>
                          {control.priority.charAt(0).toUpperCase() + control.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {control.lastAssessment ? (
                          <div className="text-sm">
                            {formatDate(control.lastAssessment)}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">Never</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenControlDetails(control);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render assessments tab content
  const renderAssessmentsTab = () => {
    if (isLoadingAssessments) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (assessments.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <ClipboardList className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No assessments found</h3>
          <p className="text-gray-400 mt-2">
            Create an assessment to evaluate compliance with your frameworks
          </p>
          <Button className="mt-4" onClick={() => setIsAssessmentCreationOpen(true)}>
            <FileCheck className="mr-2 h-4 w-4" />
            Create Assessment
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">Compliance Assessments</h3>
          <Button onClick={() => setIsAssessmentCreationOpen(true)}>
            <FileCheck className="mr-2 h-4 w-4" />
            Create Assessment
          </Button>
        </div>
        
        <div className="border rounded-md border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => {
                const framework = frameworks.find(f => f.id === assessment.frameworkId);
                const completionPercentage = Math.round((assessment.assessedControls / assessment.totalControls) * 100);
                
                return (
                  <TableRow 
                    key={assessment.id} 
                    className="cursor-pointer hover:bg-gray-800/50"
                    onClick={() => handleOpenAssessmentDetails(assessment)}
                  >
                    <TableCell>
                      <div className="font-medium">{assessment.title}</div>
                      <div className="text-xs text-gray-400">{assessment.description}</div>
                    </TableCell>
                    <TableCell>
                      {framework?.name || 'Unknown Framework'}
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        assessment.status === 'completed' ? 'bg-green-600' :
                        assessment.status === 'in-progress' ? 'bg-amber-600' :
                        'bg-blue-600'
                      }>
                        {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(assessment.startDate)}
                        {' to '}
                        {formatDate(assessment.endDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={completionPercentage} 
                          className="h-2 w-24" 
                          indicatorClassName={
                            assessment.status === 'completed' ? 'bg-green-600' : 'bg-amber-600'
                          } 
                        />
                        <span className="text-sm">
                          {completionPercentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAssessmentDetails(assessment);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        {assessment.status === 'completed' && (
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle report generation
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            Compliance Management Center
          </h2>
          <p className="text-gray-400">
            Track, monitor, and manage compliance with security frameworks and regulations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter || ''}
            onValueChange={(value) => setStatusFilter(value || null)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full md:w-auto"
            />
          </div>
        </div>
      </div>
      
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
                value="frameworks"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <Shield className="mr-2 h-4 w-4" />
                Frameworks
              </TabsTrigger>
              <TabsTrigger 
                value="controls"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <ListChecks className="mr-2 h-4 w-4" />
                Controls
              </TabsTrigger>
              <TabsTrigger 
                value="assessments"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Assessments
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Tab content */}
      <div className="pt-2">
        {activeTab === 'dashboard' && renderDashboardTab()}
        {activeTab === 'frameworks' && renderFrameworksTab()}
        {activeTab === 'controls' && renderControlsTab()}
        {activeTab === 'assessments' && renderAssessmentsTab()}
      </div>
      
      {/* Framework Details Dialog */}
      {selectedFramework && (
        <Dialog open={isFrameworkDetailsOpen} onOpenChange={setIsFrameworkDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Badge className="mr-2">{selectedFramework.category}</Badge>
                  <Badge variant="outline">v{selectedFramework.version}</Badge>
                </div>
                {getRiskLevelBadge(selectedFramework.riskLevel)}
              </div>
              <DialogTitle className="text-xl mt-2">{selectedFramework.name}</DialogTitle>
              <DialogDescription>
                {selectedFramework.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Compliance Score</h3>
                  
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold">
                      {selectedFramework.complianceScore}%
                    </div>
                    <div className={`text-sm ${
                      selectedFramework.complianceScore >= 80 ? 'text-green-400' :
                      selectedFramework.complianceScore >= 60 ? 'text-amber-400' :
                      'text-red-400'
                    }`}>
                      {selectedFramework.complianceScore >= 80 ? 'Good' : 
                       selectedFramework.complianceScore >= 60 ? 'Needs Improvement' : 
                       'At Risk'}
                    </div>
                  </div>
                  
                  <Progress 
                    value={selectedFramework.complianceScore} 
                    className="h-2 mt-2" 
                    indicatorClassName={
                      selectedFramework.complianceScore >= 80 ? 'bg-green-600' :
                      selectedFramework.complianceScore >= 60 ? 'bg-amber-600' :
                      'bg-red-600'
                    }
                  />
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-green-500 text-xl font-bold">
                        {selectedFramework.implementedControls}
                      </div>
                      <div className="text-xs text-gray-400">Implemented</div>
                    </div>
                    <div className="text-center">
                      <div className="text-amber-500 text-xl font-bold">
                        {selectedFramework.partialControls}
                      </div>
                      <div className="text-xs text-gray-400">Partial</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-500 text-xl font-bold">
                        {selectedFramework.notImplementedControls}
                      </div>
                      <div className="text-xs text-gray-400">Not Implemented</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xl font-bold">
                        {selectedFramework.notApplicableControls}
                      </div>
                      <div className="text-xs text-gray-400">Not Applicable</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Recent Assessments</h3>
                  
                  {assessments.filter(a => a.frameworkId === selectedFramework.id).length === 0 ? (
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400">No assessments available for this framework</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assessments
                        .filter(a => a.frameworkId === selectedFramework.id)
                        .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
                        .slice(0, 3)
                        .map(assessment => (
                          <div key={assessment.id} className="bg-gray-700 rounded-lg p-3">
                            <div className="flex justify-between">
                              <div className="font-medium">{assessment.title}</div>
                              <Badge className={
                                assessment.status === 'completed' ? 'bg-green-600' :
                                assessment.status === 'in-progress' ? 'bg-amber-600' :
                                'bg-blue-600'
                              }>
                                {assessment.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between mt-2 text-sm">
                              <span className="text-gray-400">Date:</span>
                              <span>{formatDate(assessment.endDate)}</span>
                            </div>
                            <div className="flex justify-between mt-1 text-sm">
                              <span className="text-gray-400">Completion:</span>
                              <span>
                                {assessment.passedControls} of {assessment.totalControls} passed
                                {' '}
                                ({Math.round((assessment.passedControls / assessment.totalControls) * 100)}%)
                              </span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2"
                              onClick={() => {
                                setSelectedAssessment(assessment);
                                setIsAssessmentDetailsOpen(true);
                                setIsFrameworkDetailsOpen(false);
                              }}
                            >
                              <Eye className="mr-2 h-3 w-3" />
                              View Details
                            </Button>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Framework Information</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      {selectedFramework.status === 'active' ? (
                        <Badge className="bg-green-600">Active</Badge>
                      ) : selectedFramework.status === 'pending' ? (
                        <Badge className="bg-amber-600">Pending</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span>{selectedFramework.category}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Version:</span>
                      <span>{selectedFramework.version}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Controls:</span>
                      <span>{selectedFramework.totalControls}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Relevant Controls:</span>
                      <span>{selectedFramework.relevantControls}</span>
                    </div>
                    
                    {selectedFramework.assignedTo && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Assigned To:</span>
                        <span>{selectedFramework.assignedTo}</span>
                      </div>
                    )}
                    
                    {selectedFramework.lastAssessment && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Assessment:</span>
                        <span>{formatDate(selectedFramework.lastAssessment)}</span>
                      </div>
                    )}
                    
                    {selectedFramework.nextAssessment && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Assessment:</span>
                        <span className={getStatusColorForDaysRemaining(getDaysUntilNextAssessment(selectedFramework.nextAssessment))}>
                          {formatDate(selectedFramework.nextAssessment)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedFramework.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => {
                    setActiveTab('controls');
                    setIsFrameworkDetailsOpen(false);
                  }}>
                    <ListChecks className="mr-2 h-4 w-4" />
                    View Controls
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {
                    // Start assessment for this framework
                    setIsFrameworkDetailsOpen(false);
                    setIsAssessmentCreationOpen(true);
                  }}>
                    <FileCheck className="mr-2 h-4 w-4" />
                    New Assessment
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Control Details Dialog */}
      {selectedControl && (
        <Dialog open={isControlDetailsOpen} onOpenChange={setIsControlDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <Badge>
                  {selectedControl.category}
                  {selectedControl.subcategory && ` - ${selectedControl.subcategory}`}
                </Badge>
                <Badge className={
                  selectedControl.priority === 'critical' ? 'bg-red-600' :
                  selectedControl.priority === 'high' ? 'bg-orange-600' :
                  selectedControl.priority === 'medium' ? 'bg-amber-600' :
                  'bg-green-600'
                }>
                  {selectedControl.priority.charAt(0).toUpperCase() + selectedControl.priority.slice(1)} Priority
                </Badge>
              </div>
              <DialogTitle className="flex items-center mt-2">
                <span className="font-mono mr-2">{selectedControl.controlId}</span>
                <span>{selectedControl.title}</span>
              </DialogTitle>
              <DialogDescription>
                Control status: {getControlStatusBadge(selectedControl.status)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-300">
                    {selectedControl.description}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Implementation Details</h3>
                  {selectedControl.implementation ? (
                    <p className="text-gray-300">
                      {selectedControl.implementation}
                    </p>
                  ) : (
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <Info className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400">No implementation details provided</p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Evidence</h3>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Upload Evidence
                    </Button>
                  </div>
                  
                  {isLoadingEvidence ? (
                    <div className="h-20 flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  ) : evidence.length === 0 ? (
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400">No evidence has been uploaded for this control</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {evidence.map((item) => (
                        <div key={item.id} className="bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between">
                            <div className="font-medium">{item.title}</div>
                            <Badge className={
                              item.status === 'valid' ? 'bg-green-600' :
                              item.status === 'expired' ? 'bg-red-600' :
                              'bg-amber-600'
                            }>
                              {item.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">
                            {item.description}
                          </p>
                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Type: {item.type}</span>
                            <span>Uploaded: {formatDate(item.uploadDate)}</span>
                          </div>
                          {item.url && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2"
                              asChild
                            >
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-3 w-3" />
                                View Evidence
                              </a>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Control Status</h3>
                  
                  <RadioGroup defaultValue={selectedControl.status} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="implemented" 
                        id="implemented"
                        onClick={() => handleControlStatusChange(selectedControl, 'implemented')}
                      />
                      <Label htmlFor="implemented" className="flex items-center cursor-pointer">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Implemented
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="partial" 
                        id="partial"
                        onClick={() => handleControlStatusChange(selectedControl, 'partial')}
                      />
                      <Label htmlFor="partial" className="flex items-center cursor-pointer">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                        Partial
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="not-implemented" 
                        id="not-implemented"
                        onClick={() => handleControlStatusChange(selectedControl, 'not-implemented')}
                      />
                      <Label htmlFor="not-implemented" className="flex items-center cursor-pointer">
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        Not Implemented
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="not-applicable" 
                        id="not-applicable"
                        onClick={() => handleControlStatusChange(selectedControl, 'not-applicable')}
                      />
                      <Label htmlFor="not-applicable" className="flex items-center cursor-pointer">
                        <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                        Not Applicable
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2 text-sm">
                    {selectedControl.lastAssessment && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Assessment:</span>
                        <span>{formatDate(selectedControl.lastAssessment)}</span>
                      </div>
                    )}
                    
                    {selectedControl.nextAssessment && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Assessment:</span>
                        <span className={getStatusColorForDaysRemaining(getDaysUntilNextAssessment(selectedControl.nextAssessment))}>
                          {formatDate(selectedControl.nextAssessment)}
                        </span>
                      </div>
                    )}
                    
                    {selectedControl.assignedTo && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Assigned To:</span>
                        <span>{selectedControl.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedControl.tags && selectedControl.tags.length > 0 && (
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedControl.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Add Implementation Plan
                  </Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Control
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Assessment Details Dialog */}
      {selectedAssessment && (
        <Dialog open={isAssessmentDetailsOpen} onOpenChange={setIsAssessmentDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <Badge className={
                  selectedAssessment.status === 'completed' ? 'bg-green-600' :
                  selectedAssessment.status === 'in-progress' ? 'bg-amber-600' :
                  'bg-blue-600'
                }>
                  {selectedAssessment.status.charAt(0).toUpperCase() + selectedAssessment.status.slice(1).replace('-', ' ')}
                </Badge>
                <div className="text-sm text-gray-400">
                  {formatDate(selectedAssessment.startDate)} to {formatDate(selectedAssessment.endDate)}
                </div>
              </div>
              <DialogTitle>{selectedAssessment.title}</DialogTitle>
              <DialogDescription>
                {selectedAssessment.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Tabs defaultValue="summary">
                <TabsList className="w-full">
                  <TabsTrigger value="summary">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="findings">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Findings
                    <Badge className="ml-2">{selectedAssessment.findings.length}</Badge>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <h3 className="font-medium mb-2">Assessment Results</h3>
                          
                          <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold">
                              {Math.round((selectedAssessment.passedControls / selectedAssessment.assessedControls) * 100)}%
                            </div>
                            <div className="text-sm">
                              <span className="text-green-500">{selectedAssessment.passedControls}</span>
                              <span className="text-gray-400">/</span>
                              <span className="text-gray-300">{selectedAssessment.assessedControls}</span>
                              <span className="text-gray-400 ml-1">controls passed</span>
                            </div>
                          </div>
                          
                          <Progress 
                            value={(selectedAssessment.passedControls / selectedAssessment.assessedControls) * 100} 
                            className="h-2 mt-2" 
                          />
                          
                          <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="text-center">
                              <div className="text-green-500 text-xl font-bold">
                                {selectedAssessment.passedControls}
                              </div>
                              <div className="text-xs text-gray-400">Passed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-red-500 text-xl font-bold">
                                {selectedAssessment.failedControls}
                              </div>
                              <div className="text-xs text-gray-400">Failed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-500 text-xl font-bold">
                                {selectedAssessment.naControls}
                              </div>
                              <div className="text-xs text-gray-400">N/A</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <h3 className="font-medium mb-2">Findings by Severity</h3>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Critical:</span>
                                <span>{selectedAssessment.findings.filter(f => f.severity === 'critical').length}</span>
                              </div>
                              <Progress 
                                value={(selectedAssessment.findings.filter(f => f.severity === 'critical').length / selectedAssessment.findings.length) * 100} 
                                className="h-2"
                                indicatorClassName="bg-red-600"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">High:</span>
                                <span>{selectedAssessment.findings.filter(f => f.severity === 'high').length}</span>
                              </div>
                              <Progress 
                                value={(selectedAssessment.findings.filter(f => f.severity === 'high').length / selectedAssessment.findings.length) * 100} 
                                className="h-2"
                                indicatorClassName="bg-orange-600"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Medium:</span>
                                <span>{selectedAssessment.findings.filter(f => f.severity === 'medium').length}</span>
                              </div>
                              <Progress 
                                value={(selectedAssessment.findings.filter(f => f.severity === 'medium').length / selectedAssessment.findings.length) * 100} 
                                className="h-2"
                                indicatorClassName="bg-amber-600"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Low:</span>
                                <span>{selectedAssessment.findings.filter(f => f.severity === 'low').length}</span>
                              </div>
                              <Progress 
                                value={(selectedAssessment.findings.filter(f => f.severity === 'low').length / selectedAssessment.findings.length) * 100} 
                                className="h-2"
                                indicatorClassName="bg-green-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <h3 className="font-medium mb-2">Assessment Information</h3>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Framework:</span>
                            <span>{frameworks.find(f => f.id === selectedAssessment.frameworkId)?.name || 'Unknown'}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <Badge className={
                              selectedAssessment.status === 'completed' ? 'bg-green-600' :
                              selectedAssessment.status === 'in-progress' ? 'bg-amber-600' :
                              'bg-blue-600'
                            }>
                              {selectedAssessment.status.charAt(0).toUpperCase() + selectedAssessment.status.slice(1).replace('-', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">Start Date:</span>
                            <span>{formatDate(selectedAssessment.startDate)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">End Date:</span>
                            <span>{formatDate(selectedAssessment.endDate)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">Assigned To:</span>
                            <span>{selectedAssessment.assignedTo}</span>
                          </div>
                          
                          {selectedAssessment.completedBy && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Completed By:</span>
                              <span>{selectedAssessment.completedBy}</span>
                            </div>
                          )}
                          
                          {selectedAssessment.completionDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Completion Date:</span>
                              <span>{formatDate(selectedAssessment.completionDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {selectedAssessment.status === 'completed' && (
                          <Button>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Report
                          </Button>
                        )}
                        
                        {selectedAssessment.status === 'in-progress' && (
                          <Button>
                            <CheckSquare className="mr-2 h-4 w-4" />
                            Continue Assessment
                          </Button>
                        )}
                        
                        {selectedAssessment.status === 'planned' && (
                          <Button>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Start Assessment
                          </Button>
                        )}
                        
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Export Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="findings" className="pt-4">
                  {selectedAssessment.findings.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-8 text-center">
                      <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                      <h3 className="text-lg font-medium">No findings were identified</h3>
                      <p className="text-gray-400 mt-2">
                        All controls passed the assessment with no issues found
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-md border-gray-800">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Finding</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Assigned To</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedAssessment.findings.map((finding) => (
                            <TableRow key={finding.id} className="cursor-pointer hover:bg-gray-800/50">
                              <TableCell>
                                <div className="font-medium">{finding.title}</div>
                                <div className="text-sm text-gray-400 truncate max-w-xs">
                                  {finding.description}
                                </div>
                                {finding.tags && finding.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {finding.tags.map((tag, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  finding.severity === 'critical' ? 'bg-red-600' :
                                  finding.severity === 'high' ? 'bg-orange-600' :
                                  finding.severity === 'medium' ? 'bg-amber-600' :
                                  'bg-green-600'
                                }>
                                  {finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  finding.status === 'open' ? 'border-red-500 text-red-500' :
                                  finding.status === 'in-progress' ? 'border-amber-500 text-amber-500' :
                                  finding.status === 'remediated' ? 'border-green-500 text-green-500' :
                                  'border-blue-500 text-blue-500'
                                }>
                                  {finding.status.replace('-', ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {finding.dueDate ? (
                                  <div className={getStatusColorForDaysRemaining(getDaysUntilNextAssessment(finding.dueDate))}>
                                    {formatDate(finding.dueDate)}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Not set</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {finding.assignedTo || <span className="text-gray-400">Unassigned</span>}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssessmentDetailsOpen(false)}>
                Close
              </Button>
              {selectedAssessment.status === 'completed' && (
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}