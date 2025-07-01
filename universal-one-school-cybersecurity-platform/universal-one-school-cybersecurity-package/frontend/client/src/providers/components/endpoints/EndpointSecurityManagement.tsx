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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ArrowDownUp,
  ArrowUpDown,
  Battery,
  BatteryCharging,
  BatteryFull,
  Clock,
  Cloud,
  Computer,
  Cpu,
  Database,
  DownloadCloud,
  FileBarChart,
  FileText,
  Filter,
  HardDrive,
  History,
  Laptop,
  LayoutDashboard,
  Lock,
  LockKeyhole,
  MapPin,
  MoreVertical,
  Network,
  Play,
  Plus,
  RefreshCw,
  Router,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
  Upload,
  WifiOff
} from 'lucide-react';

// Endpoint interface
interface Endpoint {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  macAddress: string;
  deviceType: 'workstation' | 'server' | 'laptop' | 'mobile' | 'network' | 'iot';
  operatingSystem: string;
  osVersion: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  agentVersion: string;
  locationId?: string;
  locationName?: string;
  owner?: string;
  department?: string;
  criticalityLevel: 'low' | 'medium' | 'high' | 'critical';
  policyId: string;
  policyName: string;
  complianceStatus: 'compliant' | 'non-compliant' | 'pending';
  tags: string[];
  specs?: {
    cpuModel?: string;
    cpuCores?: number;
    memoryTotal?: number;
    diskTotal?: number;
    diskFree?: number;
  };
  vulnerabilities?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

// Security policy interface
interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'draft' | 'deprecated';
  createdAt: string;
  updatedAt: string;
  controls: SecurityControl[];
  applicableDeviceTypes: string[];
  assignedEndpoints: number;
  complianceRate: number;
}

// Security control interface
interface SecurityControl {
  id: string;
  policyId: string;
  name: string;
  description: string;
  category: 'configuration' | 'protection' | 'detection' | 'response';
  type: 'software' | 'hardware' | 'policy' | 'procedure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  remediationInstructions?: string;
  verification: string;
  enabled: boolean;
  enforced: boolean;
}

// Endpoint issue interface
interface EndpointIssue {
  id: string;
  endpointId: string;
  title: string;
  description: string;
  category: 'vulnerability' | 'malware' | 'configuration' | 'compliance' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  detectedAt: string;
  resolvedAt?: string;
  cveid?: string;
  assignedTo?: string;
  remediation?: string;
}

// Location interface
interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  type: 'office' | 'datacenter' | 'branch' | 'home' | 'cloud';
  endpointCount: number;
}

// Compliance status count interface
interface ComplianceCount {
  compliant: number;
  nonCompliant: number;
  pending: number;
}

export function EndpointSecurityManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('endpoints');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<SecurityPolicy | null>(null);
  const [isEndpointDetailsOpen, setIsEndpointDetailsOpen] = useState(false);
  const [isPolicyDetailsOpen, setIsPolicyDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string | null>(null);
  const [complianceFilter, setComplianceFilter] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [isActionInProgress, setIsActionInProgress] = useState(false);

  // Fetch endpoints
  const { data: endpoints = [], isLoading: isLoadingEndpoints, refetch: refetchEndpoints } = useQuery<Endpoint[]>({
    queryKey: ['/api/endpoints'],
    queryFn: async () => {
      try {
        const url = new URL('/api/endpoints', window.location.origin);
        
        if (user?.clientId) {
          url.searchParams.append('clientId', user.clientId.toString());
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch endpoints');
        return await response.json();
      } catch (error) {
        console.error('Error fetching endpoints:', error);
        // Return sample data for demo
        return generateSampleEndpoints();
      }
    }
  });
  
  // Fetch security policies
  const { data: policies = [], isLoading: isLoadingPolicies } = useQuery<SecurityPolicy[]>({
    queryKey: ['/api/security-policies'],
    queryFn: async () => {
      try {
        const url = new URL('/api/security-policies', window.location.origin);
        
        if (user?.clientId) {
          url.searchParams.append('clientId', user.clientId.toString());
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch security policies');
        return await response.json();
      } catch (error) {
        console.error('Error fetching security policies:', error);
        // Return sample data for demo
        return generateSamplePolicies();
      }
    }
  });
  
  // Fetch endpoint issues
  const { data: endpointIssues = [], isLoading: isLoadingIssues } = useQuery<EndpointIssue[]>({
    queryKey: ['/api/endpoint-issues', selectedEndpoint?.id],
    enabled: !!selectedEndpoint,
    queryFn: async () => {
      try {
        const url = new URL('/api/endpoint-issues', window.location.origin);
        
        url.searchParams.append('endpointId', selectedEndpoint?.id || '');
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch endpoint issues');
        return await response.json();
      } catch (error) {
        console.error('Error fetching endpoint issues:', error);
        // Return sample data for demo
        return generateSampleIssues(selectedEndpoint?.id || '');
      }
    }
  });
  
  // Fetch locations
  const { data: locations = [], isLoading: isLoadingLocations } = useQuery<Location[]>({
    queryKey: ['/api/locations'],
    queryFn: async () => {
      try {
        const url = new URL('/api/locations', window.location.origin);
        
        if (user?.clientId) {
          url.searchParams.append('clientId', user.clientId.toString());
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch locations');
        return await response.json();
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Return sample data for demo
        return generateSampleLocations();
      }
    }
  });
  
  // Execute endpoint action mutation
  const executeActionMutation = useMutation({
    mutationFn: async ({ endpointId, action, params }: { endpointId: string, action: string, params?: any }) => {
      try {
        const response = await fetch(`/api/endpoints/${endpointId}/actions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, params })
        });
        
        if (!response.ok) throw new Error(`Failed to execute action: ${action}`);
        return await response.json();
      } catch (error) {
        console.error(`Error executing action ${action}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/endpoints'] });
      toast({
        title: 'Action Executed',
        description: `The ${selectedAction} action was executed successfully.`
      });
      setIsActionInProgress(false);
      setIsActionDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Action Failed',
        description: error.message,
        variant: 'destructive'
      });
      setIsActionInProgress(false);
    }
  });
  
  // Generate sample endpoints for demo
  const generateSampleEndpoints = (): Endpoint[] => {
    return [
      {
        id: 'endpoint-1',
        name: 'DESKTOP-ENG01',
        hostname: 'desktop-eng01.example.com',
        ipAddress: '192.168.1.101',
        macAddress: '00:1A:2B:3C:4D:5E',
        deviceType: 'workstation',
        operatingSystem: 'Windows',
        osVersion: '11 Pro',
        status: 'online',
        lastSeen: new Date().toISOString(),
        agentVersion: '5.2.1',
        locationId: 'location-1',
        locationName: 'Headquarters',
        owner: 'John Smith',
        department: 'Engineering',
        criticalityLevel: 'high',
        policyId: 'policy-1',
        policyName: 'Standard Workstation Policy',
        complianceStatus: 'compliant',
        tags: ['engineering', 'development', 'windows'],
        specs: {
          cpuModel: 'Intel Core i7-11700K',
          cpuCores: 8,
          memoryTotal: 32,
          diskTotal: 1000,
          diskFree: 650
        },
        vulnerabilities: {
          critical: 0,
          high: 1,
          medium: 3,
          low: 5
        }
      },
      {
        id: 'endpoint-2',
        name: 'SRV-DB01',
        hostname: 'srv-db01.example.com',
        ipAddress: '192.168.1.5',
        macAddress: '00:1A:2B:3C:4D:5F',
        deviceType: 'server',
        operatingSystem: 'Windows',
        osVersion: 'Server 2022',
        status: 'online',
        lastSeen: new Date().toISOString(),
        agentVersion: '5.2.1',
        locationId: 'location-2',
        locationName: 'Primary Datacenter',
        owner: 'Database Team',
        department: 'IT',
        criticalityLevel: 'critical',
        policyId: 'policy-2',
        policyName: 'Database Server Policy',
        complianceStatus: 'non-compliant',
        tags: ['database', 'production', 'windows-server'],
        specs: {
          cpuModel: 'Intel Xeon E5-2680',
          cpuCores: 28,
          memoryTotal: 256,
          diskTotal: 4000,
          diskFree: 1200
        },
        vulnerabilities: {
          critical: 1,
          high: 2,
          medium: 4,
          low: 6
        }
      },
      {
        id: 'endpoint-3',
        name: 'LAPTOP-SALES12',
        hostname: 'laptop-sales12.example.com',
        ipAddress: '10.10.30.22',
        macAddress: '00:1A:2B:3C:4D:60',
        deviceType: 'laptop',
        operatingSystem: 'macOS',
        osVersion: 'Ventura 13.2',
        status: 'offline',
        lastSeen: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        agentVersion: '5.2.0',
        locationId: 'location-3',
        locationName: 'Remote',
        owner: 'Sarah Johnson',
        department: 'Sales',
        criticalityLevel: 'medium',
        policyId: 'policy-3',
        policyName: 'Mobile Device Policy',
        complianceStatus: 'pending',
        tags: ['sales', 'mobile', 'macos'],
        specs: {
          cpuModel: 'Apple M1 Pro',
          cpuCores: 10,
          memoryTotal: 16,
          diskTotal: 512,
          diskFree: 324
        },
        vulnerabilities: {
          critical: 0,
          high: 0,
          medium: 2,
          low: 3
        }
      },
      {
        id: 'endpoint-4',
        name: 'FIREWALL-EDGE01',
        hostname: 'firewall-edge01.example.com',
        ipAddress: '192.168.0.1',
        macAddress: '00:1A:2B:3C:4D:61',
        deviceType: 'network',
        operatingSystem: 'Cisco IOS',
        osVersion: '17.3.1',
        status: 'online',
        lastSeen: new Date().toISOString(),
        agentVersion: '4.9.2',
        locationId: 'location-1',
        locationName: 'Headquarters',
        owner: 'Network Team',
        department: 'IT',
        criticalityLevel: 'critical',
        policyId: 'policy-4',
        policyName: 'Network Device Policy',
        complianceStatus: 'compliant',
        tags: ['network', 'firewall', 'edge'],
        specs: {
          cpuModel: 'Cisco ASR Custom',
          cpuCores: 12,
          memoryTotal: 64,
          diskTotal: 240,
          diskFree: 180
        },
        vulnerabilities: {
          critical: 0,
          high: 1,
          medium: 1,
          low: 2
        }
      },
      {
        id: 'endpoint-5',
        name: 'IPHONE-CEO',
        hostname: 'N/A',
        ipAddress: '10.10.40.15',
        macAddress: 'A1:B2:C3:D4:E5:F6',
        deviceType: 'mobile',
        operatingSystem: 'iOS',
        osVersion: '16.3',
        status: 'warning',
        lastSeen: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        agentVersion: '5.1.3',
        locationId: 'location-3',
        locationName: 'Remote',
        owner: 'Alex Thompson',
        department: 'Executive',
        criticalityLevel: 'high',
        policyId: 'policy-5',
        policyName: 'Executive Mobile Policy',
        complianceStatus: 'non-compliant',
        tags: ['mobile', 'executive', 'ios'],
        specs: {
          memoryTotal: 8,
          diskTotal: 512,
          diskFree: 256
        },
        vulnerabilities: {
          critical: 0,
          high: 1,
          medium: 0,
          low: 1
        }
      }
    ];
  };
  
  // Generate sample security policies for demo
  const generateSamplePolicies = (): SecurityPolicy[] => {
    return [
      {
        id: 'policy-1',
        name: 'Standard Workstation Policy',
        description: 'Default security policy for workstations with standard security controls.',
        priority: 'high',
        status: 'active',
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-04-20T00:00:00Z',
        controls: [
          {
            id: 'control-1',
            policyId: 'policy-1',
            name: 'Antivirus Enabled',
            description: 'Ensure antivirus software is installed, enabled, and up-to-date.',
            category: 'protection',
            type: 'software',
            severity: 'critical',
            verification: 'Check antivirus service status and definition date.',
            enabled: true,
            enforced: true
          },
          {
            id: 'control-2',
            policyId: 'policy-1',
            name: 'OS Patching',
            description: 'Operating system must be patched with the latest security updates.',
            category: 'protection',
            type: 'software',
            severity: 'high',
            verification: 'Check last update date and missing patches.',
            enabled: true,
            enforced: true
          },
          {
            id: 'control-3',
            policyId: 'policy-1',
            name: 'Firewall Enabled',
            description: 'Local firewall must be enabled with standard ruleset.',
            category: 'protection',
            type: 'software',
            severity: 'high',
            verification: 'Check firewall status and configuration.',
            enabled: true,
            enforced: true
          }
        ],
        applicableDeviceTypes: ['workstation', 'laptop'],
        assignedEndpoints: 456,
        complianceRate: 89
      },
      {
        id: 'policy-2',
        name: 'Database Server Policy',
        description: 'Enhanced security policy for database servers with strict controls.',
        priority: 'critical',
        status: 'active',
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-05-01T00:00:00Z',
        controls: [
          {
            id: 'control-4',
            policyId: 'policy-2',
            name: 'Backup Verification',
            description: 'Regular backups must be configured and verified.',
            category: 'protection',
            type: 'procedure',
            severity: 'critical',
            verification: 'Check backup logs and last successful backup date.',
            enabled: true,
            enforced: true
          },
          {
            id: 'control-5',
            policyId: 'policy-2',
            name: 'Database Encryption',
            description: 'Sensitive data must be encrypted at rest.',
            category: 'protection',
            type: 'software',
            severity: 'critical',
            verification: 'Check encryption settings on database.',
            enabled: true,
            enforced: true
          }
        ],
        applicableDeviceTypes: ['server'],
        assignedEndpoints: 58,
        complianceRate: 76
      },
      {
        id: 'policy-3',
        name: 'Mobile Device Policy',
        description: 'Security policy for mobile devices including laptops, tablets, and phones.',
        priority: 'medium',
        status: 'active',
        createdAt: '2025-02-05T00:00:00Z',
        updatedAt: '2025-04-15T00:00:00Z',
        controls: [
          {
            id: 'control-6',
            policyId: 'policy-3',
            name: 'Screen Lock',
            description: 'Device must have screen lock enabled with maximum 5 minute timeout.',
            category: 'configuration',
            type: 'policy',
            severity: 'medium',
            verification: 'Check screen lock settings.',
            enabled: true,
            enforced: true
          },
          {
            id: 'control-7',
            policyId: 'policy-3',
            name: 'Disk Encryption',
            description: 'Full disk encryption must be enabled.',
            category: 'protection',
            type: 'software',
            severity: 'high',
            verification: 'Check disk encryption status.',
            enabled: true,
            enforced: true
          }
        ],
        applicableDeviceTypes: ['laptop', 'mobile'],
        assignedEndpoints: 324,
        complianceRate: 82
      },
      {
        id: 'policy-4',
        name: 'Network Device Policy',
        description: 'Security policy for network infrastructure devices.',
        priority: 'critical',
        status: 'active',
        createdAt: '2025-01-08T00:00:00Z',
        updatedAt: '2025-03-25T00:00:00Z',
        controls: [
          {
            id: 'control-8',
            policyId: 'policy-4',
            name: 'Secure Management',
            description: 'Management interfaces must use encrypted protocols (SSH/HTTPS).',
            category: 'configuration',
            type: 'policy',
            severity: 'high',
            verification: 'Check enabled protocols on management interfaces.',
            enabled: true,
            enforced: true
          },
          {
            id: 'control-9',
            policyId: 'policy-4',
            name: 'Access Control Lists',
            description: 'ACLs must be implemented according to standard template.',
            category: 'protection',
            type: 'policy',
            severity: 'high',
            verification: 'Validate ACL configuration against template.',
            enabled: true,
            enforced: true
          }
        ],
        applicableDeviceTypes: ['network'],
        assignedEndpoints: 47,
        complianceRate: 91
      },
      {
        id: 'policy-5',
        name: 'Executive Mobile Policy',
        description: 'Enhanced security policy for executive mobile devices.',
        priority: 'high',
        status: 'active',
        createdAt: '2025-02-10T00:00:00Z',
        updatedAt: '2025-04-30T00:00:00Z',
        controls: [
          {
            id: 'control-10',
            policyId: 'policy-5',
            name: 'Application Control',
            description: 'Only approved applications can be installed.',
            category: 'protection',
            type: 'software',
            severity: 'high',
            verification: 'Check application inventory against approved list.',
            enabled: true,
            enforced: true
          },
          {
            id: 'control-11',
            policyId: 'policy-5',
            name: 'Biometric Authentication',
            description: 'Biometric authentication must be enabled.',
            category: 'configuration',
            type: 'policy',
            severity: 'medium',
            verification: 'Check authentication settings.',
            enabled: true,
            enforced: true
          }
        ],
        applicableDeviceTypes: ['mobile', 'laptop'],
        assignedEndpoints: 12,
        complianceRate: 83
      }
    ];
  };
  
  // Generate sample endpoint issues for demo
  const generateSampleIssues = (endpointId: string): EndpointIssue[] => {
    if (endpointId === 'endpoint-1') {
      return [
        {
          id: 'issue-1',
          endpointId: 'endpoint-1',
          title: 'Outdated Browser Version',
          description: 'Chrome browser is running an outdated version with known vulnerabilities.',
          category: 'vulnerability',
          severity: 'high',
          status: 'open',
          detectedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
          cveid: 'CVE-2025-1234',
          remediation: 'Update Chrome browser to the latest version.'
        },
        {
          id: 'issue-2',
          endpointId: 'endpoint-1',
          title: 'Unnecessary Service Running',
          description: 'Remote Registry service is enabled but not required by policy.',
          category: 'configuration',
          severity: 'medium',
          status: 'open',
          detectedAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
        },
        {
          id: 'issue-3',
          endpointId: 'endpoint-1',
          title: 'Encryption Compliance',
          description: 'Full disk encryption is using an outdated algorithm.',
          category: 'compliance',
          severity: 'medium',
          status: 'in-progress',
          detectedAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
          assignedTo: 'security-team'
        }
      ];
    } else if (endpointId === 'endpoint-2') {
      return [
        {
          id: 'issue-4',
          endpointId: 'endpoint-2',
          title: 'Critical SQL Vulnerability',
          description: 'SQL Server instance has a critical vulnerability that requires patching.',
          category: 'vulnerability',
          severity: 'critical',
          status: 'open',
          detectedAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
          cveid: 'CVE-2025-5678',
          remediation: 'Apply Microsoft SQL Server security patch KB5001234.'
        },
        {
          id: 'issue-5',
          endpointId: 'endpoint-2',
          title: 'Database Backup Failure',
          description: 'Scheduled database backup failed for the last 3 days.',
          category: 'compliance',
          severity: 'high',
          status: 'in-progress',
          detectedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
          assignedTo: 'db-admin'
        }
      ];
    }
    
    return [];
  };
  
  // Generate sample locations for demo
  const generateSampleLocations = (): Location[] => {
    return [
      {
        id: 'location-1',
        name: 'Headquarters',
        address: '100 Main Street',
        city: 'Boston',
        country: 'USA',
        type: 'office',
        endpointCount: 183
      },
      {
        id: 'location-2',
        name: 'Primary Datacenter',
        address: '200 Tech Drive',
        city: 'Dallas',
        country: 'USA',
        type: 'datacenter',
        endpointCount: 146
      },
      {
        id: 'location-3',
        name: 'Remote',
        address: 'Various',
        city: 'N/A',
        country: 'Global',
        type: 'home',
        endpointCount: 267
      },
      {
        id: 'location-4',
        name: 'West Coast Office',
        address: '500 Innovation Blvd',
        city: 'San Francisco',
        country: 'USA',
        type: 'office',
        endpointCount: 109
      },
      {
        id: 'location-5',
        name: 'AWS US-East-1',
        address: 'N/A',
        city: 'N/A',
        country: 'USA',
        type: 'cloud',
        endpointCount: 92
      }
    ];
  };
  
  // Filter endpoints based on search query and filters
  const filteredEndpoints = endpoints.filter(endpoint => {
    const searchMatch = !searchQuery || 
      endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (endpoint.owner && endpoint.owner.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (endpoint.tags && endpoint.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const statusMatch = !statusFilter || endpoint.status === statusFilter;
    const deviceTypeMatch = !deviceTypeFilter || endpoint.deviceType === deviceTypeFilter;
    const complianceMatch = !complianceFilter || endpoint.complianceStatus === complianceFilter;
    
    return searchMatch && statusMatch && deviceTypeMatch && complianceMatch;
  });
  
  // Calculate counts by compliance status
  const complianceCounts: ComplianceCount = {
    compliant: endpoints.filter(e => e.complianceStatus === 'compliant').length,
    nonCompliant: endpoints.filter(e => e.complianceStatus === 'non-compliant').length,
    pending: endpoints.filter(e => e.complianceStatus === 'pending').length
  };
  
  // Calculate counts by device type
  const deviceTypeCounts = endpoints.reduce((acc, endpoint) => {
    acc[endpoint.deviceType] = (acc[endpoint.deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Open endpoint details
  const handleOpenEndpointDetails = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setIsEndpointDetailsOpen(true);
  };
  
  // Open policy details
  const handleOpenPolicyDetails = (policy: SecurityPolicy) => {
    setSelectedPolicy(policy);
    setIsPolicyDetailsOpen(true);
  };
  
  // Handle endpoint action selection
  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    setIsActionDialogOpen(true);
  };
  
  // Execute endpoint action
  const handleExecuteAction = () => {
    if (!selectedEndpoint || !selectedAction) return;
    
    setIsActionInProgress(true);
    
    executeActionMutation.mutate({
      endpointId: selectedEndpoint.id,
      action: selectedAction
    });
  };
  
  // Get device type icon
  const getDeviceTypeIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'workstation':
        return <Computer className="h-4 w-4" />;
      case 'server':
        return <Server className="h-4 w-4" />;
      case 'laptop':
        return <Laptop className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'network':
        return <Network className="h-4 w-4" />;
      case 'iot':
        return <HardDrive className="h-4 w-4" />;
      default:
        return <Computer className="h-4 w-4" />;
    }
  };
  
  // Get status badge with appropriate color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge className="bg-green-600 font-normal">
            <BatteryFull className="mr-1 h-3 w-3" />
            Online
          </Badge>
        );
      case 'offline':
        return (
          <Badge variant="outline" className="font-normal">
            <WifiOff className="mr-1 h-3 w-3" />
            Offline
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-amber-600 font-normal">
            <AlertCircle className="mr-1 h-3 w-3" />
            Warning
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get compliance badge with appropriate color
  const getComplianceBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return (
          <Badge className="bg-green-600 font-normal">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Compliant
          </Badge>
        );
      case 'non-compliant':
        return (
          <Badge className="bg-red-600 font-normal">
            <ShieldAlert className="mr-1 h-3 w-3" />
            Non-Compliant
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-600 font-normal">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
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
  
  // Calculate time since last seen in relative format
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
  
  // Get criticality level badge with appropriate color
  const getCriticalityBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return <Badge className="bg-red-600">{level}</Badge>;
      case 'high':
        return <Badge className="bg-orange-600">{level}</Badge>;
      case 'medium':
        return <Badge className="bg-amber-600">{level}</Badge>;
      case 'low':
        return <Badge className="bg-green-600">{level}</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };
  
  // Render endpoints tab content
  const renderEndpointsTab = () => {
    if (isLoadingEndpoints) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (filteredEndpoints.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Computer className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No endpoints found</h3>
          <p className="text-gray-400 mt-2">
            {searchQuery || statusFilter || deviceTypeFilter || complianceFilter
              ? 'Try adjusting your filters to see more results'
              : 'No endpoints have been registered in the system'}
          </p>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Endpoint
          </Button>
        </div>
      );
    }
    
    return (
      <div className="border rounded-md border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Device Type</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEndpoints.map((endpoint) => (
              <TableRow 
                key={endpoint.id} 
                className="cursor-pointer hover:bg-gray-800/50"
                onClick={() => handleOpenEndpointDetails(endpoint)}
              >
                <TableCell>
                  <div className="font-medium">{endpoint.name}</div>
                  <div className="text-xs text-gray-400">
                    {endpoint.hostname}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(endpoint.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getDeviceTypeIcon(endpoint.deviceType)}
                    <span className="ml-2 capitalize">
                      {endpoint.deviceType}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>{endpoint.operatingSystem}</div>
                  <div className="text-xs text-gray-400">
                    {endpoint.osVersion}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm">
                    {endpoint.ipAddress}
                  </div>
                </TableCell>
                <TableCell>
                  {getComplianceBadge(endpoint.complianceStatus)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {getTimeSince(endpoint.lastSeen)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEndpointDetails(endpoint);
                      }}>
                        <Shield className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEndpoint(endpoint);
                        handleActionSelect('scan');
                      }}>
                        <Search className="mr-2 h-4 w-4" />
                        Run Security Scan
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEndpoint(endpoint);
                        handleActionSelect('update');
                      }}>
                        <DownloadCloud className="mr-2 h-4 w-4" />
                        Update Agent
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled={endpoint.status === 'offline'} onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEndpoint(endpoint);
                        handleActionSelect('isolate');
                      }}>
                        <Lock className="mr-2 h-4 w-4" />
                        Isolate Endpoint
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  // Render policies tab content
  const renderPoliciesTab = () => {
    if (isLoadingPolicies) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (policies.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No security policies found</h3>
          <p className="text-gray-400 mt-2">
            Create a security policy to define compliance standards for your endpoints
          </p>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create Policy
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {policies.map((policy) => (
          <Card 
            key={policy.id} 
            className="cursor-pointer hover:bg-gray-800/50"
            onClick={() => handleOpenPolicyDetails(policy)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{policy.name}</h3>
                    {getCriticalityBadge(policy.priority)}
                    {policy.status === 'active' ? (
                      <Badge className="bg-green-600">Active</Badge>
                    ) : policy.status === 'draft' ? (
                      <Badge className="bg-amber-600">Draft</Badge>
                    ) : (
                      <Badge variant="outline">Deprecated</Badge>
                    )}
                  </div>
                  <p className="text-gray-400 mt-1">{policy.description}</p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center">
                    <Computer className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="font-medium">{policy.assignedEndpoints} Endpoints</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Percent className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="font-medium">{policy.complianceRate}% Compliance</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Compliance Rate</span>
                  <span>{policy.complianceRate}%</span>
                </div>
                <Progress 
                  value={policy.complianceRate} 
                  className="h-2" 
                  indicatorClassName={
                    policy.complianceRate >= 90 ? 'bg-green-600' :
                    policy.complianceRate >= 70 ? 'bg-amber-600' :
                    'bg-red-600'
                  }
                />
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">
                    <Shield className="mr-1 h-3 w-3" />
                    {policy.controls.length} Controls
                  </Badge>
                  
                  {policy.applicableDeviceTypes.map((type, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {getDeviceTypeIcon(type)}
                      <span className="ml-1">{type}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render locations tab content
  const renderLocationsTab = () => {
    if (isLoadingLocations) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (locations.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No locations found</h3>
          <p className="text-gray-400 mt-2">
            Define locations to organize and manage your endpoints by geographic area
          </p>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <Badge variant="outline" className="capitalize">
                  {location.type}
                </Badge>
                <Badge>
                  {location.endpointCount} Endpoints
                </Badge>
              </div>
              <CardTitle>{location.name}</CardTitle>
              <CardDescription>
                {location.city}, {location.country}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              {location.address !== 'N/A' && (
                <p className="text-sm text-gray-400">{location.address}</p>
              )}
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  View Security
                </Button>
                <Button size="sm">
                  <Computer className="mr-2 h-4 w-4" />
                  View Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render dashboard tab content
  const renderDashboardTab = () => {
    // Calculate overall compliance percentage
    const overallCompliance = endpoints.length
      ? Math.round((complianceCounts.compliant / endpoints.length) * 100)
      : 0;
    
    // Calculate endpoints by status
    const statusCounts = {
      online: endpoints.filter(e => e.status === 'online').length,
      offline: endpoints.filter(e => e.status === 'offline').length,
      warning: endpoints.filter(e => e.status === 'warning').length
    };
    
    // Calculate total vulnerabilities
    const totalVulnerabilities = endpoints.reduce((sum, endpoint) => {
      if (!endpoint.vulnerabilities) return sum;
      return sum + endpoint.vulnerabilities.critical + endpoint.vulnerabilities.high + 
        endpoint.vulnerabilities.medium + endpoint.vulnerabilities.low;
    }, 0);
    
    // Calculate critical and high vulnerabilities
    const criticalVulnerabilities = endpoints.reduce((sum, endpoint) => {
      if (!endpoint.vulnerabilities) return sum;
      return sum + endpoint.vulnerabilities.critical + endpoint.vulnerabilities.high;
    }, 0);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Compliance overview */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Compliance Overview</CardTitle>
            <CardDescription>
              Endpoint security policy compliance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-bold">{overallCompliance}%</span>
                <Badge className={
                  overallCompliance >= 80 ? 'bg-green-600' :
                  overallCompliance >= 60 ? 'bg-amber-600' :
                  'bg-red-600'
                }>
                  {overallCompliance >= 80 ? 'Good' : overallCompliance >= 60 ? 'Needs Improvement' : 'At Risk'}
                </Badge>
              </div>
              <Progress 
                value={overallCompliance} 
                className="h-3" 
                indicatorClassName={
                  overallCompliance >= 80 ? 'bg-green-600' :
                  overallCompliance >= 60 ? 'bg-amber-600' :
                  'bg-red-600'
                }
              />
              <div className="text-sm text-gray-400 mt-2">
                Based on {endpoints.length} managed endpoints
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center text-green-600 mb-1">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-xl font-bold">{complianceCounts.compliant}</div>
                <div className="text-xs text-gray-400">Compliant</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center text-red-600 mb-1">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="text-xl font-bold">{complianceCounts.nonCompliant}</div>
                <div className="text-xs text-gray-400">Non-Compliant</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center text-amber-600 mb-1">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="text-xl font-bold">{complianceCounts.pending}</div>
                <div className="text-xs text-gray-400">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Status overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Endpoint Status</CardTitle>
            <CardDescription>
              Current connection status of endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <BatteryFull className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Online</span>
                </div>
                <span className="text-green-600">
                  {statusCounts.online}
                  <span className="text-gray-400 text-xs ml-1">
                    ({Math.round((statusCounts.online / endpoints.length) * 100)}%)
                  </span>
                </span>
              </div>
              <Progress value={(statusCounts.online / endpoints.length) * 100} className="h-2" indicatorClassName="bg-green-600" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                  <span className="text-sm">Warning</span>
                </div>
                <span className="text-amber-600">
                  {statusCounts.warning}
                  <span className="text-gray-400 text-xs ml-1">
                    ({Math.round((statusCounts.warning / endpoints.length) * 100)}%)
                  </span>
                </span>
              </div>
              <Progress value={(statusCounts.warning / endpoints.length) * 100} className="h-2" indicatorClassName="bg-amber-600" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <WifiOff className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm">Offline</span>
                </div>
                <span className="text-gray-400">
                  {statusCounts.offline}
                  <span className="text-gray-400 text-xs ml-1">
                    ({Math.round((statusCounts.offline / endpoints.length) * 100)}%)
                  </span>
                </span>
              </div>
              <Progress value={(statusCounts.offline / endpoints.length) * 100} className="h-2" indicatorClassName="bg-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        {/* Device types breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Device Types</CardTitle>
            <CardDescription>
              Endpoints by device category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(deviceTypeCounts).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getDeviceTypeIcon(type)}
                    <span className="ml-2 capitalize">{type}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Vulnerabilities overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Vulnerability Status</CardTitle>
            <CardDescription>
              Security vulnerabilities across endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center">
                <div className="text-3xl font-bold">{totalVulnerabilities}</div>
                <div className="text-sm text-gray-400 ml-2">Total Vulnerabilities</div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-red-600">
                    {criticalVulnerabilities}
                  </div>
                  <div className="text-xs text-gray-400">Critical/High</div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-amber-600">
                    {totalVulnerabilities - criticalVulnerabilities}
                  </div>
                  <div className="text-xs text-gray-400">Medium/Low</div>
                </div>
              </div>
              
              <Button variant="outline" className="mt-2">
                <FileBarChart className="mr-2 h-4 w-4" />
                View Vulnerability Report
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent high-risk endpoints */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Critical Endpoints</CardTitle>
            <CardDescription>
              High-risk endpoints requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {endpoints.filter(e => 
              e.criticalityLevel === 'critical' || 
              e.complianceStatus === 'non-compliant' ||
              (e.vulnerabilities && e.vulnerabilities.critical > 0)
            ).length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <ShieldCheck className="h-10 w-10 mx-auto text-green-500 mb-2" />
                <p className="text-gray-400">No critical endpoints requiring attention</p>
              </div>
            ) : (
              <div className="border rounded-md border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Compliance</TableHead>
                      <TableHead>Vulnerabilities</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {endpoints
                      .filter(e => 
                        e.criticalityLevel === 'critical' || 
                        e.complianceStatus === 'non-compliant' ||
                        (e.vulnerabilities && e.vulnerabilities.critical > 0)
                      )
                      .slice(0, 5)
                      .map(endpoint => (
                        <TableRow key={endpoint.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {getDeviceTypeIcon(endpoint.deviceType)}
                              <div className="ml-2">
                                <div className="font-medium">{endpoint.name}</div>
                                <div className="text-xs text-gray-400">{endpoint.hostname}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getComplianceBadge(endpoint.complianceStatus)}
                          </TableCell>
                          <TableCell>
                            {endpoint.vulnerabilities ? (
                              <div className="flex items-center">
                                {endpoint.vulnerabilities.critical > 0 && (
                                  <Badge className="bg-red-600 mr-1">
                                    {endpoint.vulnerabilities.critical} Critical
                                  </Badge>
                                )}
                                {endpoint.vulnerabilities.high > 0 && (
                                  <Badge className="bg-orange-600">
                                    {endpoint.vulnerabilities.high} High
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">No data</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(endpoint.status)}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => handleOpenEndpointDetails(endpoint)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Details
                            </Button>
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
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            Endpoint Security Management
          </h2>
          <p className="text-gray-400">
            Monitor, manage, and secure your network endpoints
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => refetchEndpoints()}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingEndpoints ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Endpoint
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
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select
              value={statusFilter || ''}
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={deviceTypeFilter || ''}
              onValueChange={(value) => setDeviceTypeFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Device Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Devices</SelectItem>
                <SelectItem value="workstation">Workstation</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="iot">IoT</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={complianceFilter || ''}
              onValueChange={(value) => setComplianceFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Compliance</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
                value="endpoints"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <Computer className="mr-2 h-4 w-4" />
                Endpoints
              </TabsTrigger>
              <TabsTrigger 
                value="policies"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <FileText className="mr-2 h-4 w-4" />
                Policies
              </TabsTrigger>
              <TabsTrigger 
                value="locations"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Locations
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Tab content */}
      <div className="pt-2">
        {activeTab === 'dashboard' && renderDashboardTab()}
        {activeTab === 'endpoints' && renderEndpointsTab()}
        {activeTab === 'policies' && renderPoliciesTab()}
        {activeTab === 'locations' && renderLocationsTab()}
      </div>
      
      {/* Endpoint Details Dialog */}
      {selectedEndpoint && (
        <Dialog open={isEndpointDetailsOpen} onOpenChange={setIsEndpointDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <Badge className="capitalize">
                  {getDeviceTypeIcon(selectedEndpoint.deviceType)}
                  <span className="ml-1">{selectedEndpoint.deviceType}</span>
                </Badge>
                {getStatusBadge(selectedEndpoint.status)}
              </div>
              <DialogTitle className="text-xl mt-2">{selectedEndpoint.name}</DialogTitle>
              <DialogDescription>
                {selectedEndpoint.hostname} &bull; {selectedEndpoint.ipAddress}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="pt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="issues">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Issues
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="mr-2 h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">System Information</h3>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div>
                          <span className="text-sm text-gray-400">Operating System:</span>
                          <div className="font-medium">
                            {selectedEndpoint.operatingSystem} {selectedEndpoint.osVersion}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Agent Version:</span>
                          <div className="font-medium">{selectedEndpoint.agentVersion}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">IP Address:</span>
                          <div className="font-mono">{selectedEndpoint.ipAddress}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">MAC Address:</span>
                          <div className="font-mono">{selectedEndpoint.macAddress}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Last Seen:</span>
                          <div>{formatDate(selectedEndpoint.lastSeen)}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Location:</span>
                          <div>{selectedEndpoint.locationName || 'Unknown'}</div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedEndpoint.specs && (
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <h3 className="font-medium mb-2">Hardware Specifications</h3>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                          {selectedEndpoint.specs.cpuModel && (
                            <div>
                              <div className="flex items-center">
                                <Cpu className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-400">CPU:</span>
                              </div>
                              <div className="font-medium">
                                {selectedEndpoint.specs.cpuModel}
                                {selectedEndpoint.specs.cpuCores && ` (${selectedEndpoint.specs.cpuCores} cores)`}
                              </div>
                            </div>
                          )}
                          
                          {selectedEndpoint.specs.memoryTotal && (
                            <div>
                              <div className="flex items-center">
                                <Database className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-400">Memory:</span>
                              </div>
                              <div className="font-medium">
                                {selectedEndpoint.specs.memoryTotal} GB
                              </div>
                            </div>
                          )}
                          
                          {selectedEndpoint.specs.diskTotal && (
                            <div>
                              <div className="flex items-center">
                                <HardDrive className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-400">Storage:</span>
                              </div>
                              <div className="font-medium">
                                {selectedEndpoint.specs.diskTotal} GB Total
                                {selectedEndpoint.specs.diskFree && ` / ${selectedEndpoint.specs.diskFree} GB Free`}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Compliance Status</h3>
                        {getComplianceBadge(selectedEndpoint.complianceStatus)}
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-400">Applied Policy:</span>
                          </div>
                          <div className="font-medium">{selectedEndpoint.policyName}</div>
                        </div>
                        
                        <div className="mt-3">
                          <Button size="sm" variant="outline" className="mr-2">
                            <FileBarChart className="mr-2 h-4 w-4" />
                            Compliance Report
                          </Button>
                          <Button size="sm">
                            <Play className="mr-2 h-4 w-4" />
                            Run Compliance Check
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">Status</h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Status:</span>
                          {getStatusBadge(selectedEndpoint.status)}
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Compliance:</span>
                          {getComplianceBadge(selectedEndpoint.complianceStatus)}
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Criticality:</span>
                          {getCriticalityBadge(selectedEndpoint.criticalityLevel)}
                        </div>
                        
                        {selectedEndpoint.owner && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Owner:</span>
                            <span>{selectedEndpoint.owner}</span>
                          </div>
                        )}
                        
                        {selectedEndpoint.department && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Department:</span>
                            <span>{selectedEndpoint.department}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedEndpoint.vulnerabilities && (
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <h3 className="font-medium mb-2">Vulnerabilities</h3>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                              <span>Critical</span>
                            </div>
                            <Badge className="bg-red-600">{selectedEndpoint.vulnerabilities.critical}</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
                              <span>High</span>
                            </div>
                            <Badge className="bg-orange-600">{selectedEndpoint.vulnerabilities.high}</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-amber-600 rounded-full mr-2"></div>
                              <span>Medium</span>
                            </div>
                            <Badge className="bg-amber-600">{selectedEndpoint.vulnerabilities.medium}</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                              <span>Low</span>
                            </div>
                            <Badge className="bg-green-600">{selectedEndpoint.vulnerabilities.low}</Badge>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <Button size="sm" className="w-full">
                            <Search className="mr-2 h-4 w-4" />
                            Scan for Vulnerabilities
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {selectedEndpoint.tags && selectedEndpoint.tags.length > 0 && (
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <h3 className="font-medium mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedEndpoint.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      <Button>
                        <Shield className="mr-2 h-4 w-4" />
                        Security Actions
                      </Button>
                      <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Endpoint
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="issues" className="mt-4">
                {isLoadingIssues ? (
                  <div className="h-60 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : endpointIssues.length === 0 ? (
                  <div className="bg-gray-800 rounded-lg p-8 text-center">
                    <ShieldCheck className="h-16 w-16 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-medium">No issues detected</h3>
                    <p className="text-gray-400 mt-2">
                      This endpoint has no active security or compliance issues
                    </p>
                    <Button className="mt-4">
                      <Search className="mr-2 h-4 w-4" />
                      Run Security Scan
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md border-gray-800">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Issue</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Detected</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {endpointIssues.map((issue) => (
                          <TableRow key={issue.id}>
                            <TableCell>
                              <div className="font-medium">{issue.title}</div>
                              <div className="text-sm text-gray-400 truncate max-w-xs">
                                {issue.description}
                              </div>
                              {issue.cveid && (
                                <Badge variant="outline" className="mt-1">
                                  {issue.cveid}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {issue.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                issue.severity === 'critical' ? 'bg-red-600' :
                                issue.severity === 'high' ? 'bg-orange-600' :
                                issue.severity === 'medium' ? 'bg-amber-600' :
                                'bg-green-600'
                              }>
                                {issue.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                issue.status === 'open' ? 'border-red-500 text-red-500' :
                                issue.status === 'in-progress' ? 'border-amber-500 text-amber-500' :
                                issue.status === 'resolved' ? 'border-green-500 text-green-500' :
                                'border-gray-500 text-gray-500'
                              }>
                                {issue.status.replace('-', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {getTimeSince(issue.detectedAt)}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" className="mr-2">
                                <Search className="h-4 w-4" />
                              </Button>
                              <Button size="sm">
                                <Play className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <History className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">Endpoint History</h3>
                  <p className="text-gray-400 mt-2">
                    Historical data and activity logs for this endpoint will be displayed here
                  </p>
                  <Button className="mt-4">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Activity Report
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEndpointDetailsOpen(false)}>
                    Close
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Shield className="mr-2 h-4 w-4" />
                        Actions
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Security Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleActionSelect('scan')}>
                        <Search className="mr-2 h-4 w-4" />
                        Run Security Scan
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionSelect('update')}>
                        <DownloadCloud className="mr-2 h-4 w-4" />
                        Update Agent
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={selectedEndpoint.status === 'offline'} onClick={() => handleActionSelect('isolate')}>
                        <Lock className="mr-2 h-4 w-4" />
                        Isolate Endpoint
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionSelect('policy')}>
                        <FileText className="mr-2 h-4 w-4" />
                        Change Policy
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Deploy Security Update
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Security Policy Details Dialog */}
      {selectedPolicy && (
        <Dialog open={isPolicyDetailsOpen} onOpenChange={setIsPolicyDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                {getCriticalityBadge(selectedPolicy.priority)}
                {selectedPolicy.status === 'active' ? (
                  <Badge className="bg-green-600">Active</Badge>
                ) : selectedPolicy.status === 'draft' ? (
                  <Badge className="bg-amber-600">Draft</Badge>
                ) : (
                  <Badge variant="outline">Deprecated</Badge>
                )}
              </div>
              <DialogTitle className="text-xl mt-2">{selectedPolicy.name}</DialogTitle>
              <DialogDescription>
                {selectedPolicy.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-medium mb-3">Security Controls</h3>
                    
                    <div className="space-y-3">
                      {selectedPolicy.controls.map((control) => (
                        <div key={control.id} className="bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="font-medium">{control.name}</h4>
                                <Badge className="ml-2 capitalize">{control.category}</Badge>
                                {getCriticalityBadge(control.severity)}
                              </div>
                              <p className="text-sm text-gray-300 mt-1">
                                {control.description}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {control.enabled ? (
                                <Badge className="bg-green-600">Enabled</Badge>
                              ) : (
                                <Badge variant="outline">Disabled</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-2 text-xs">
                            <span className="text-gray-400">Verification: </span>
                            <span className="text-gray-300">{control.verification}</span>
                          </div>
                          
                          {control.remediationInstructions && (
                            <div className="mt-1 text-xs">
                              <span className="text-gray-400">Remediation: </span>
                              <span className="text-gray-300">{control.remediationInstructions}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-medium mb-2">Policy Information</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        {selectedPolicy.status === 'active' ? (
                          <Badge className="bg-green-600">Active</Badge>
                        ) : selectedPolicy.status === 'draft' ? (
                          <Badge className="bg-amber-600">Draft</Badge>
                        ) : (
                          <Badge variant="outline">Deprecated</Badge>
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Priority:</span>
                        {getCriticalityBadge(selectedPolicy.priority)}
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span>{new Date(selectedPolicy.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Updated:</span>
                        <span>{new Date(selectedPolicy.updatedAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Controls:</span>
                        <span>{selectedPolicy.controls.length}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Endpoints:</span>
                        <span>{selectedPolicy.assignedEndpoints}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Compliance Rate:</span>
                        <span>{selectedPolicy.complianceRate}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-medium mb-2">Applicable To</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPolicy.applicableDeviceTypes.map((deviceType, index) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          {getDeviceTypeIcon(deviceType)}
                          <span className="ml-1">{deviceType}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button>
                      <Computer className="mr-2 h-4 w-4" />
                      View Endpoints
                    </Button>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Policy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Endpoint Action Dialog */}
      {selectedEndpoint && selectedAction && (
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedAction === 'scan' && 'Run Security Scan'}
                {selectedAction === 'update' && 'Update Security Agent'}
                {selectedAction === 'isolate' && 'Isolate Endpoint'}
                {selectedAction === 'policy' && 'Change Security Policy'}
              </DialogTitle>
              <DialogDescription>
                {selectedAction === 'scan' && 'This will initiate a comprehensive security scan on the endpoint.'}
                {selectedAction === 'update' && 'Update the security agent software to the latest version.'}
                {selectedAction === 'isolate' && 'This will isolate the endpoint from the network to prevent potential threat spread.'}
                {selectedAction === 'policy' && 'Select a different security policy to apply to this endpoint.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center">
                  {getDeviceTypeIcon(selectedEndpoint.deviceType)}
                  <div className="ml-2">
                    <div className="font-medium">{selectedEndpoint.name}</div>
                    <div className="text-sm text-gray-400">{selectedEndpoint.hostname}</div>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <div>{getStatusBadge(selectedEndpoint.status)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">IP Address:</span>
                    <div className="font-mono">{selectedEndpoint.ipAddress}</div>
                  </div>
                </div>
              </div>
              
              {selectedAction === 'policy' && (
                <div className="mt-4">
                  <Label htmlFor="policy-select">Select Security Policy</Label>
                  <Select>
                    <SelectTrigger id="policy-select" className="mt-1">
                      <SelectValue placeholder="Select a policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {policies.map((policy) => (
                        <SelectItem key={policy.id} value={policy.id}>
                          {policy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {selectedAction === 'isolate' && (
                <div className="mt-4 bg-amber-900/30 border border-amber-700 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-500">Warning</h4>
                      <p className="text-sm text-amber-400/80">
                        Isolating this endpoint will disconnect it from the network except for secure communications with the security console. This action should only be used when a security incident is suspected.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsActionDialogOpen(false)} disabled={isActionInProgress}>
                Cancel
              </Button>
              <Button onClick={handleExecuteAction} disabled={isActionInProgress}>
                {isActionInProgress ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Execute
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}