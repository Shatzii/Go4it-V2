import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AlertCircle,
  Brain,
  CalendarClock,
  Cloud,
  Code,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Globe,
  Hash,
  HardDrive,
  Info,
  Link2,
  MapPin,
  Network,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  Target,
  Trash2,
  Unlink,
  UserX,
  Virus,
  Zap
} from 'lucide-react';

// Threat actor interface
interface ThreatActor {
  id: string;
  name: string;
  aliases?: string[];
  description: string;
  motivation: string[];
  sophistication: 'low' | 'medium' | 'high' | 'advanced';
  firstSeen: string;
  lastSeen?: string;
  targets: string[];
  countries: string[];
  ttps: string[];
  associatedGroups?: string[];
  tags: string[];
  indicators?: IndicatorOfCompromise[];
  reports?: IntelligenceReport[];
}

// Indicator of compromise interface
interface IndicatorOfCompromise {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'file_hash' | 'email' | 'malware_name';
  value: string;
  description?: string;
  confidence: 'low' | 'medium' | 'high';
  validFrom: string;
  validUntil?: string;
  source: string;
  relatedThreatActors?: string[];
  tags: string[];
  lastUpdated: string;
  active: boolean;
}

// Intelligence report interface
interface IntelligenceReport {
  id: string;
  title: string;
  summary: string;
  publishDate: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impactScope: string[];
  affectedSystems: string[];
  mitigation: string[];
  indicators?: string[];
  relatedThreats?: string[];
  source: string;
  tags: string[];
  url?: string;
}

// Vulnerability interface
interface Vulnerability {
  id: string;
  cveId: string;
  title: string;
  description: string;
  publishDate: string;
  lastModified: string;
  cvssScore: number;
  cvssVector: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'confirmed' | 'patched';
  affectedProducts: string[];
  affectedVersions: string[];
  patchAvailable: boolean;
  exploitAvailable: boolean;
  exploitationLikelihood: 'unlikely' | 'possible' | 'likely' | 'very likely';
  mitigation: string[];
  references: string[];
  tags: string[];
}

export function ThreatIntelligenceHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [activeTab, setActiveTab] = useState('threats');
  const [selectedThreatActor, setSelectedThreatActor] = useState<ThreatActor | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorOfCompromise | null>(null);
  const [selectedReport, setSelectedReport] = useState<IntelligenceReport | null>(null);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Fetch threat actors
  const { data: threatActors = [], isLoading: isLoadingThreats } = useQuery<ThreatActor[]>({
    queryKey: ['/api/intelligence/threat-actors', selectedCategory, timeRange],
    queryFn: async () => {
      try {
        const url = new URL('/api/intelligence/threat-actors', window.location.origin);
        
        if (selectedCategory !== 'all') {
          url.searchParams.append('category', selectedCategory);
        }
        
        url.searchParams.append('timeRange', timeRange);
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch threat actors');
        return await response.json();
      } catch (error) {
        console.error('Error fetching threat actors:', error);
        // Return sample data for demo
        return generateSampleThreatActors();
      }
    }
  });
  
  // Fetch indicators of compromise
  const { data: indicators = [], isLoading: isLoadingIndicators } = useQuery<IndicatorOfCompromise[]>({
    queryKey: ['/api/intelligence/indicators', selectedCategory, timeRange],
    queryFn: async () => {
      try {
        const url = new URL('/api/intelligence/indicators', window.location.origin);
        
        if (selectedCategory !== 'all') {
          url.searchParams.append('type', selectedCategory);
        }
        
        url.searchParams.append('timeRange', timeRange);
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch indicators');
        return await response.json();
      } catch (error) {
        console.error('Error fetching indicators:', error);
        // Return sample data for demo
        return generateSampleIndicators();
      }
    }
  });
  
  // Fetch intelligence reports
  const { data: reports = [], isLoading: isLoadingReports } = useQuery<IntelligenceReport[]>({
    queryKey: ['/api/intelligence/reports', selectedCategory, timeRange],
    queryFn: async () => {
      try {
        const url = new URL('/api/intelligence/reports', window.location.origin);
        
        if (selectedCategory !== 'all') {
          url.searchParams.append('severity', selectedCategory);
        }
        
        url.searchParams.append('timeRange', timeRange);
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch reports');
        return await response.json();
      } catch (error) {
        console.error('Error fetching reports:', error);
        // Return sample data for demo
        return generateSampleReports();
      }
    }
  });
  
  // Fetch vulnerabilities
  const { data: vulnerabilities = [], isLoading: isLoadingVulnerabilities } = useQuery<Vulnerability[]>({
    queryKey: ['/api/intelligence/vulnerabilities', selectedCategory, timeRange],
    queryFn: async () => {
      try {
        const url = new URL('/api/intelligence/vulnerabilities', window.location.origin);
        
        if (selectedCategory !== 'all') {
          url.searchParams.append('severity', selectedCategory);
        }
        
        url.searchParams.append('timeRange', timeRange);
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Failed to fetch vulnerabilities');
        return await response.json();
      } catch (error) {
        console.error('Error fetching vulnerabilities:', error);
        // Return sample data for demo
        return generateSampleVulnerabilities();
      }
    }
  });
  
  // Generate sample threat actors for demo
  const generateSampleThreatActors = (): ThreatActor[] => {
    return [
      {
        id: 'TA001',
        name: 'APT-Chimera',
        aliases: ['Dragon Spider', 'TwoFace Group'],
        description: 'Advanced persistent threat group targeting critical infrastructure and financial institutions.',
        motivation: ['espionage', 'financial gain'],
        sophistication: 'advanced',
        firstSeen: '2019-03-15',
        lastSeen: '2025-04-02',
        targets: ['energy sector', 'financial institutions', 'defense contractors'],
        countries: ['North America', 'Europe', 'Asia'],
        ttps: ['spear phishing', 'supply chain compromise', 'zero-day exploitation'],
        associatedGroups: ['UNC2452'],
        tags: ['espionage', 'ransomware', 'nation-state']
      },
      {
        id: 'TA002',
        name: 'CobraByte',
        aliases: ['Venom Group', 'Digital Serpent'],
        description: 'Financially motivated threat actor focusing on ransomware attacks against healthcare and education sectors.',
        motivation: ['financial gain'],
        sophistication: 'high',
        firstSeen: '2020-09-12',
        lastSeen: '2025-05-10',
        targets: ['healthcare', 'education', 'local government'],
        countries: ['Global'],
        ttps: ['ransomware', 'credential theft', 'lateral movement'],
        tags: ['ransomware', 'data theft', 'financial']
      },
      {
        id: 'TA003',
        name: 'LazyShadow',
        aliases: ['Silent Panther'],
        description: 'Cyber espionage group targeting intellectual property in technology and manufacturing sectors.',
        motivation: ['espionage', 'intellectual property theft'],
        sophistication: 'medium',
        firstSeen: '2022-01-05',
        lastSeen: '2025-04-28',
        targets: ['technology firms', 'manufacturing', 'research institutions'],
        countries: ['Asia', 'Europe'],
        ttps: ['social engineering', 'watering hole attacks', 'custom malware'],
        tags: ['espionage', 'intellectual property']
      },
      {
        id: 'TA004',
        name: 'FrostPhoenix',
        aliases: ['Arctic Flame', 'Winter Hawk'],
        description: 'Sophisticated threat actor targeting government and diplomatic entities.',
        motivation: ['espionage', 'political'],
        sophistication: 'advanced',
        firstSeen: '2018-07-20',
        lastSeen: '2025-03-15',
        targets: ['government agencies', 'diplomatic missions', 'policy think tanks'],
        countries: ['North America', 'Europe', 'Middle East'],
        ttps: ['spear phishing', 'custom implants', 'credential harvesting'],
        associatedGroups: ['IceForge'],
        tags: ['espionage', 'nation-state', 'targeted']
      }
    ];
  };
  
  // Generate sample indicators for demo
  const generateSampleIndicators = (): IndicatorOfCompromise[] => {
    return [
      {
        id: 'IOC001',
        type: 'ip',
        value: '198.51.100.23',
        description: 'Command and control server for Chimera malware variant',
        confidence: 'high',
        validFrom: '2025-03-10',
        validUntil: '2025-09-10',
        source: 'Security Vendor Analysis',
        relatedThreatActors: ['TA001'],
        tags: ['c2', 'APT-Chimera'],
        lastUpdated: '2025-05-01',
        active: true
      },
      {
        id: 'IOC002',
        type: 'domain',
        value: 'secure-update-cdn.net',
        description: 'Malicious domain delivering CobraByte ransomware',
        confidence: 'high',
        validFrom: '2025-04-15',
        source: 'Incident Response Team',
        relatedThreatActors: ['TA002'],
        tags: ['ransomware', 'CobraByte'],
        lastUpdated: '2025-05-05',
        active: true
      },
      {
        id: 'IOC003',
        type: 'file_hash',
        value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        description: 'SHA-256 hash of LazyShadow data exfiltration tool',
        confidence: 'medium',
        validFrom: '2025-02-28',
        source: 'Threat Intelligence Platform',
        relatedThreatActors: ['TA003'],
        tags: ['malware', 'LazyShadow', 'exfiltration'],
        lastUpdated: '2025-04-20',
        active: true
      },
      {
        id: 'IOC004',
        type: 'url',
        value: 'https://legitimate-site.com/resources/document.pdf',
        description: 'Compromised URL hosting FrostPhoenix phishing document',
        confidence: 'high',
        validFrom: '2025-05-01',
        source: 'Security Researcher',
        relatedThreatActors: ['TA004'],
        tags: ['phishing', 'FrostPhoenix'],
        lastUpdated: '2025-05-08',
        active: true
      },
      {
        id: 'IOC005',
        type: 'email',
        value: 'support@security-update-team.com',
        description: 'Sender email used in CobraByte phishing campaign',
        confidence: 'high',
        validFrom: '2025-04-10',
        validUntil: '2025-05-10',
        source: 'CERT Analysis',
        relatedThreatActors: ['TA002'],
        tags: ['phishing', 'CobraByte'],
        lastUpdated: '2025-05-02',
        active: false
      }
    ];
  };
  
  // Generate sample reports for demo
  const generateSampleReports = (): IntelligenceReport[] => {
    return [
      {
        id: 'REP001',
        title: 'APT-Chimera Campaign Targeting Energy Sector',
        summary: 'Analysis of recent APT-Chimera activities targeting energy infrastructure in North America and Europe.',
        publishDate: '2025-04-15',
        severity: 'high',
        impactScope: ['energy sector', 'utility providers'],
        affectedSystems: ['SCADA systems', 'operational technology networks'],
        mitigation: ['Patch critical vulnerabilities', 'Implement network segmentation', 'Deploy EDR solutions'],
        indicators: ['IOC001'],
        relatedThreats: ['TA001'],
        source: 'CyberSecurity Research Lab',
        tags: ['APT', 'critical infrastructure', 'targeted attack'],
        url: 'https://example.com/reports/apt-chimera-energy-sector'
      },
      {
        id: 'REP002',
        title: 'CobraByte Ransomware Evolution',
        summary: 'Technical analysis of the evolving CobraByte ransomware family with new evasion capabilities.',
        publishDate: '2025-05-03',
        severity: 'critical',
        impactScope: ['healthcare', 'education'],
        affectedSystems: ['Windows servers', 'backup systems'],
        mitigation: ['Implement application whitelisting', 'Deploy next-gen AV', 'Secure backup strategies'],
        indicators: ['IOC002', 'IOC005'],
        relatedThreats: ['TA002'],
        source: 'Ransomware Task Force',
        tags: ['ransomware', 'encryption', 'data theft'],
        url: 'https://example.com/reports/cobrabyte-evolution'
      },
      {
        id: 'REP003',
        title: 'Zero-Day Vulnerability Exploited by Multiple Threat Actors',
        summary: 'Analysis of newly discovered zero-day vulnerability affecting widely used enterprise software.',
        publishDate: '2025-05-10',
        severity: 'critical',
        impactScope: ['global', 'multiple sectors'],
        affectedSystems: ['enterprise management software'],
        mitigation: ['Apply emergency patch', 'Monitor for indicators of compromise', 'Network traffic analysis'],
        relatedThreats: ['TA001', 'TA004'],
        source: 'Security Vendor Research',
        tags: ['zero-day', 'multiple actors', 'widespread impact'],
        url: 'https://example.com/reports/zero-day-multiple-actors'
      }
    ];
  };
  
  // Generate sample vulnerabilities for demo
  const generateSampleVulnerabilities = (): Vulnerability[] => {
    return [
      {
        id: 'VUL001',
        cveId: 'CVE-2025-12345',
        title: 'Remote Code Execution in Enterprise CMS',
        description: 'A critical vulnerability in the file upload component of Enterprise CMS allows remote attackers to execute arbitrary code.',
        publishDate: '2025-04-20',
        lastModified: '2025-05-01',
        cvssScore: 9.8,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        severity: 'critical',
        status: 'confirmed',
        affectedProducts: ['Enterprise CMS'],
        affectedVersions: ['4.5.0-4.8.3', '5.0.0-5.2.1'],
        patchAvailable: true,
        exploitAvailable: true,
        exploitationLikelihood: 'very likely',
        mitigation: [
          'Update to version 4.8.4 or 5.2.2 or later',
          'Implement WAF rules to block malicious file uploads',
          'Monitor for suspicious file upload activities'
        ],
        references: [
          'https://example.com/security/cve-2025-12345',
          'https://enterprise-cms.example.com/security/patches'
        ],
        tags: ['rce', 'file upload', 'web application']
      },
      {
        id: 'VUL002',
        cveId: 'CVE-2025-67890',
        title: 'Authentication Bypass in Network Device API',
        description: 'A vulnerability in the API authentication mechanism of Network Devices allows attackers to bypass authentication and gain administrative access.',
        publishDate: '2025-05-05',
        lastModified: '2025-05-07',
        cvssScore: 8.6,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:N',
        severity: 'high',
        status: 'confirmed',
        affectedProducts: ['Network Device Manager'],
        affectedVersions: ['10.0-10.5'],
        patchAvailable: true,
        exploitAvailable: false,
        exploitationLikelihood: 'likely',
        mitigation: [
          'Update to version 10.6 or later',
          'Implement network segmentation',
          'Use IP-based access restrictions'
        ],
        references: [
          'https://example.com/security/cve-2025-67890',
          'https://security.example.com/advisories/network-device-auth-bypass'
        ],
        tags: ['authentication', 'api', 'network device']
      },
      {
        id: 'VUL003',
        cveId: 'CVE-2025-54321',
        title: 'SQL Injection in Cloud Management Platform',
        description: 'A SQL injection vulnerability in the reporting module of Cloud Management Platform allows attackers to access or modify database content.',
        publishDate: '2025-03-15',
        lastModified: '2025-04-10',
        cvssScore: 7.2,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:H/UI:N/S:U/C:H/I:H/A:H',
        severity: 'high',
        status: 'patched',
        affectedProducts: ['Cloud Management Platform'],
        affectedVersions: ['2.0.0-2.4.5'],
        patchAvailable: true,
        exploitAvailable: true,
        exploitationLikelihood: 'likely',
        mitigation: [
          'Update to version 2.5.0 or later',
          'Implement prepared statements',
          'Use input validation'
        ],
        references: [
          'https://example.com/security/cve-2025-54321',
          'https://cloud-platform.example.com/security/patches'
        ],
        tags: ['sql injection', 'cloud', 'database']
      },
      {
        id: 'VUL004',
        cveId: 'CVE-2025-98765',
        title: 'Privilege Escalation in Container Platform',
        description: 'A vulnerability in container isolation mechanism allows attackers to escape the container and gain elevated privileges on the host system.',
        publishDate: '2025-05-08',
        lastModified: '2025-05-09',
        cvssScore: 8.8,
        cvssVector: 'CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H',
        severity: 'high',
        status: 'new',
        affectedProducts: ['Container Platform'],
        affectedVersions: ['3.0.0-3.2.1'],
        patchAvailable: false,
        exploitAvailable: false,
        exploitationLikelihood: 'possible',
        mitigation: [
          'Apply provided workaround configuration',
          'Monitor for suspicious container activities',
          'Implement additional host-based security controls'
        ],
        references: [
          'https://example.com/security/cve-2025-98765',
          'https://container-platform.example.com/security/advisories'
        ],
        tags: ['container', 'privilege escalation', 'isolation']
      }
    ];
  };
  
  // Filter data based on search query
  const filterData = <T extends { id: string; [key: string]: any }>(
    data: T[],
    searchFields: (keyof T)[]
  ): T[] => {
    if (!searchQuery) return data;
    
    return data.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        if (Array.isArray(value)) {
          return value.some(v => 
            v.toString().toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else if (value) {
          return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      })
    );
  };
  
  // Apply filters
  const filteredThreatActors = filterData(threatActors, ['name', 'aliases', 'description', 'targets', 'ttps', 'tags']);
  const filteredIndicators = filterData(indicators, ['type', 'value', 'description', 'tags']);
  const filteredReports = filterData(reports, ['title', 'summary', 'impactScope', 'affectedSystems', 'tags']);
  const filteredVulnerabilities = filterData(vulnerabilities, ['cveId', 'title', 'description', 'affectedProducts', 'tags']);
  
  // Get severity badge with appropriate color
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <Badge className="bg-red-600">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-600">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
  // Get confidence badge with appropriate color
  const getConfidenceBadge = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high':
        return <Badge className="bg-green-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-orange-600">Low</Badge>;
      default:
        return <Badge>{confidence}</Badge>;
    }
  };
  
  // Get indicator type icon
  const getIndicatorTypeIcon = (type: string) => {
    switch (type) {
      case 'ip':
        return <Globe className="h-4 w-4" />;
      case 'domain':
        return <Link2 className="h-4 w-4" />;
      case 'url':
        return <ExternalLink className="h-4 w-4" />;
      case 'file_hash':
        return <Hash className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'malware_name':
        return <Virus className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Format date nicely
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle opening details dialogs
  const openThreatActorDetails = (actor: ThreatActor) => {
    setSelectedThreatActor(actor);
    setSelectedIndicator(null);
    setSelectedReport(null);
    setSelectedVulnerability(null);
    setIsDetailsDialogOpen(true);
  };
  
  const openIndicatorDetails = (indicator: IndicatorOfCompromise) => {
    setSelectedThreatActor(null);
    setSelectedIndicator(indicator);
    setSelectedReport(null);
    setSelectedVulnerability(null);
    setIsDetailsDialogOpen(true);
  };
  
  const openReportDetails = (report: IntelligenceReport) => {
    setSelectedThreatActor(null);
    setSelectedIndicator(null);
    setSelectedReport(report);
    setSelectedVulnerability(null);
    setIsDetailsDialogOpen(true);
  };
  
  const openVulnerabilityDetails = (vulnerability: Vulnerability) => {
    setSelectedThreatActor(null);
    setSelectedIndicator(null);
    setSelectedReport(null);
    setSelectedVulnerability(vulnerability);
    setIsDetailsDialogOpen(true);
  };
  
  // Render content for the threat actors tab
  const renderThreatActorsTab = () => {
    if (isLoadingThreats) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (filteredThreatActors.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <UserX className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No threat actors found</h3>
          <p className="text-gray-400 mt-2">
            {searchQuery ? 'Try adjusting your search criteria' : 'No threat actors match your current filters'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="border rounded-md border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sophistication</TableHead>
              <TableHead>Motivation</TableHead>
              <TableHead>First Seen</TableHead>
              <TableHead>Primary Targets</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredThreatActors.map((actor) => (
              <TableRow key={actor.id} className="cursor-pointer hover:bg-gray-800/50" onClick={() => openThreatActorDetails(actor)}>
                <TableCell>
                  <div className="font-medium">{actor.name}</div>
                  {actor.aliases && actor.aliases.length > 0 && (
                    <div className="text-sm text-gray-400">
                      AKA: {actor.aliases.join(', ')}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={
                    actor.sophistication === 'advanced' ? 'bg-red-600' :
                    actor.sophistication === 'high' ? 'bg-orange-600' :
                    actor.sophistication === 'medium' ? 'bg-amber-600' : 'bg-green-600'
                  }>
                    {actor.sophistication.charAt(0).toUpperCase() + actor.sophistication.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {actor.motivation.map((motive, index) => (
                      <Badge key={index} variant="outline">
                        {motive}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{formatDate(actor.firstSeen)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {actor.targets.slice(0, 2).map((target, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-800">
                        {target}
                      </Badge>
                    ))}
                    {actor.targets.length > 2 && (
                      <Badge variant="outline" className="bg-gray-800">
                        +{actor.targets.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    openThreatActorDetails(actor);
                  }}>
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  // Render content for the indicators tab
  const renderIndicatorsTab = () => {
    if (isLoadingIndicators) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (filteredIndicators.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <Unlink className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No indicators found</h3>
          <p className="text-gray-400 mt-2">
            {searchQuery ? 'Try adjusting your search criteria' : 'No indicators match your current filters'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="border rounded-md border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Valid From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIndicators.map((indicator) => (
              <TableRow key={indicator.id} className="cursor-pointer hover:bg-gray-800/50" onClick={() => openIndicatorDetails(indicator)}>
                <TableCell>
                  <div className="flex items-center">
                    {getIndicatorTypeIcon(indicator.type)}
                    <span className="ml-2 capitalize">{indicator.type.replace('_', ' ')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm max-w-md truncate">
                    {indicator.value}
                  </div>
                </TableCell>
                <TableCell>
                  {getConfidenceBadge(indicator.confidence)}
                </TableCell>
                <TableCell>{formatDate(indicator.validFrom)}</TableCell>
                <TableCell>
                  {indicator.active ? (
                    <Badge className="bg-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    openIndicatorDetails(indicator);
                  }}>
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  // Render content for the reports tab
  const renderReportsTab = () => {
    if (isLoadingReports) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (filteredReports.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No reports found</h3>
          <p className="text-gray-400 mt-2">
            {searchQuery ? 'Try adjusting your search criteria' : 'No reports match your current filters'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="cursor-pointer hover:bg-gray-800/50" onClick={() => openReportDetails(report)}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <Badge variant="outline" className="mb-2">{report.source}</Badge>
                {getSeverityBadge(report.severity)}
              </div>
              <CardTitle className="text-base leading-tight">{report.title}</CardTitle>
              <CardDescription className="text-xs">
                Published {formatDate(report.publishDate)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-300 line-clamp-3">
                {report.summary}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex flex-wrap gap-1">
                {report.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {report.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{report.tags.length - 3}
                  </Badge>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={(e) => {
                e.stopPropagation();
                openReportDetails(report);
              }}>
                <Eye className="h-4 w-4 mr-1" />
                Read
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render content for the vulnerabilities tab
  const renderVulnerabilitiesTab = () => {
    if (isLoadingVulnerabilities) {
      return (
        <div className="h-60 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }
    
    if (filteredVulnerabilities.length === 0) {
      return (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <ShieldAlert className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No vulnerabilities found</h3>
          <p className="text-gray-400 mt-2">
            {searchQuery ? 'Try adjusting your search criteria' : 'No vulnerabilities match your current filters'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="border rounded-md border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CVE ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>CVSS</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVulnerabilities.map((vuln) => (
              <TableRow key={vuln.id} className="cursor-pointer hover:bg-gray-800/50" onClick={() => openVulnerabilityDetails(vuln)}>
                <TableCell>
                  <div className="font-mono">{vuln.cveId}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{vuln.title}</div>
                  <div className="text-sm text-gray-400 truncate max-w-xs">
                    {vuln.affectedProducts.join(', ')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center mr-2
                      ${vuln.cvssScore >= 9.0 ? 'bg-red-900 text-red-200' : 
                        vuln.cvssScore >= 7.0 ? 'bg-orange-900 text-orange-200' : 
                        vuln.cvssScore >= 4.0 ? 'bg-amber-900 text-amber-200' : 
                        'bg-green-900 text-green-200'}
                    `}>
                      {vuln.cvssScore.toFixed(1)}
                    </div>
                    {getSeverityBadge(vuln.severity)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={
                    vuln.status === 'new' ? 'bg-blue-600' :
                    vuln.status === 'confirmed' ? 'bg-amber-600' :
                    'bg-green-600'
                  }>
                    {vuln.status.charAt(0).toUpperCase() + vuln.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(vuln.publishDate)}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    openVulnerabilityDetails(vuln);
                  }}>
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  // Render the details content in dialog based on selected item
  const renderDetailsContent = () => {
    if (selectedThreatActor) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserX className="h-5 w-5 mr-2" />
              Threat Actor: {selectedThreatActor.name}
            </DialogTitle>
            <DialogDescription>
              {selectedThreatActor.aliases && selectedThreatActor.aliases.length > 0 &&
                <>Also known as: {selectedThreatActor.aliases.join(', ')}</>
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="md:col-span-2 space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-300">
                  {selectedThreatActor.description}
                </p>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Tactics, Techniques & Procedures</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedThreatActor.ttps.map((ttp, index) => (
                    <Badge key={index} className="bg-gray-700">
                      {ttp}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Geographic Targeting</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedThreatActor.countries.map((country, index) => (
                    <div key={index} className="flex items-center bg-gray-700 rounded-md px-2 py-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="text-sm">{country}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Profile Information</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sophistication:</span>
                    <Badge className={
                      selectedThreatActor.sophistication === 'advanced' ? 'bg-red-600' :
                      selectedThreatActor.sophistication === 'high' ? 'bg-orange-600' :
                      selectedThreatActor.sophistication === 'medium' ? 'bg-amber-600' : 'bg-green-600'
                    }>
                      {selectedThreatActor.sophistication.charAt(0).toUpperCase() + selectedThreatActor.sophistication.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">First Seen:</span>
                    <span>{formatDate(selectedThreatActor.firstSeen)}</span>
                  </div>
                  
                  {selectedThreatActor.lastSeen && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Seen:</span>
                      <span>{formatDate(selectedThreatActor.lastSeen)}</span>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <span className="text-gray-400">Motivation:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedThreatActor.motivation.map((motive, index) => (
                        <Badge key={index} variant="outline">
                          {motive}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Primary Targets</h3>
                <div className="flex flex-col gap-1">
                  {selectedThreatActor.targets.map((target, index) => (
                    <div key={index} className="flex items-center bg-gray-700 rounded-md px-2 py-1">
                      <Target className="h-3 w-3 mr-2" />
                      <span className="text-sm">{target}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedThreatActor.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    
    if (selectedIndicator) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {getIndicatorTypeIcon(selectedIndicator.type)}
              <span className="ml-2 capitalize">{selectedIndicator.type.replace('_', ' ')} Indicator</span>
            </DialogTitle>
            <DialogDescription>
              {selectedIndicator.active ? 
                <Badge className="bg-green-600">Active</Badge> : 
                <Badge variant="outline">Inactive</Badge>
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="md:col-span-2 space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Indicator Value</h3>
                <div className="bg-gray-900 p-3 rounded-md font-mono break-all">
                  {selectedIndicator.value}
                </div>
                {selectedIndicator.description && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-gray-300">
                      {selectedIndicator.description}
                    </p>
                  </div>
                )}
              </div>
              
              {selectedIndicator.relatedThreatActors && selectedIndicator.relatedThreatActors.length > 0 && (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Related Threat Actors</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIndicator.relatedThreatActors.map((actorId, index) => {
                      const actor = threatActors.find(a => a.id === actorId);
                      return (
                        <Button key={index} variant="outline" size="sm" className="gap-1">
                          <UserX className="h-3 w-3" />
                          {actor ? actor.name : actorId}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Indicator Details</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confidence:</span>
                    {getConfidenceBadge(selectedIndicator.confidence)}
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valid From:</span>
                    <span>{formatDate(selectedIndicator.validFrom)}</span>
                  </div>
                  
                  {selectedIndicator.validUntil && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Valid Until:</span>
                      <span>{formatDate(selectedIndicator.validUntil)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Source:</span>
                    <span>{selectedIndicator.source}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Updated:</span>
                    <span>{formatDate(selectedIndicator.lastUpdated)}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedIndicator.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <Button variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Check Sightings
                </Button>
                
                <Button variant="outline">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Add to Blocklist
                </Button>
              </div>
            </div>
          </div>
        </>
      );
    }
    
    if (selectedReport) {
      return (
        <>
          <DialogHeader>
            <div className="flex justify-between">
              <Badge variant="outline">{selectedReport.source}</Badge>
              {getSeverityBadge(selectedReport.severity)}
            </div>
            <DialogTitle className="mt-2">{selectedReport.title}</DialogTitle>
            <DialogDescription>
              Published {formatDate(selectedReport.publishDate)}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="py-4 space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Summary</h3>
                <p className="text-gray-300">
                  {selectedReport.summary}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Impact Scope</h3>
                  <div className="flex flex-col gap-1">
                    {selectedReport.impactScope.map((scope, index) => (
                      <div key={index} className="flex items-center">
                        <Target className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{scope}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Affected Systems</h3>
                  <div className="flex flex-col gap-1">
                    {selectedReport.affectedSystems.map((system, index) => (
                      <div key={index} className="flex items-center">
                        <Server className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{system}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Recommended Mitigation</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {selectedReport.mitigation.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedReport.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            {selectedReport.url && (
              <Button variant="outline" asChild>
                <a href={selectedReport.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Original Report
                </a>
              </Button>
            )}
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </DialogFooter>
        </>
      );
    }
    
    if (selectedVulnerability) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShieldAlert className="h-5 w-5 mr-2" />
              {selectedVulnerability.cveId}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <span>CVSS: {selectedVulnerability.cvssScore.toFixed(1)}</span>
              {getSeverityBadge(selectedVulnerability.severity)}
              <Badge className={
                selectedVulnerability.status === 'new' ? 'bg-blue-600' :
                selectedVulnerability.status === 'confirmed' ? 'bg-amber-600' :
                'bg-green-600'
              }>
                {selectedVulnerability.status.charAt(0).toUpperCase() + selectedVulnerability.status.slice(1)}
              </Badge>
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="py-4 space-y-4">
              <div>
                <h2 className="text-xl font-medium">{selectedVulnerability.title}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Published: {formatDate(selectedVulnerability.publishDate)} | 
                  Last Updated: {formatDate(selectedVulnerability.lastModified)}
                </p>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-300">
                  {selectedVulnerability.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Affected Products</h3>
                  <div className="flex flex-col gap-1">
                    {selectedVulnerability.affectedProducts.map((product, index) => (
                      <div key={index} className="flex items-center">
                        <Server className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{product}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h4 className="font-medium mt-4 mb-1">Affected Versions</h4>
                  <div className="flex flex-col gap-1">
                    {selectedVulnerability.affectedVersions.map((version, index) => (
                      <div key={index} className="flex items-center">
                        <Code className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{version}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-medium mb-2">Vulnerability Status</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-32 text-gray-400">Patch Available:</div>
                      {selectedVulnerability.patchAvailable ? (
                        <Badge className="bg-green-600">Yes</Badge>
                      ) : (
                        <Badge className="bg-red-600">No</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-32 text-gray-400">Exploit Available:</div>
                      {selectedVulnerability.exploitAvailable ? (
                        <Badge className="bg-red-600">Yes</Badge>
                      ) : (
                        <Badge className="bg-green-600">No</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-32 text-gray-400">Exploit Likelihood:</div>
                      <Badge className={
                        selectedVulnerability.exploitationLikelihood === 'very likely' ? 'bg-red-600' :
                        selectedVulnerability.exploitationLikelihood === 'likely' ? 'bg-orange-600' :
                        selectedVulnerability.exploitationLikelihood === 'possible' ? 'bg-amber-600' :
                        'bg-green-600'
                      }>
                        {selectedVulnerability.exploitationLikelihood.charAt(0).toUpperCase() + 
                         selectedVulnerability.exploitationLikelihood.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-gray-400 mb-1">CVSS Vector:</div>
                      <div className="font-mono text-sm bg-gray-900 p-2 rounded-md">
                        {selectedVulnerability.cvssVector}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Recommended Mitigation</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {selectedVulnerability.mitigation.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">References</h3>
                <ul className="space-y-1">
                  {selectedVulnerability.references.map((ref, index) => (
                    <li key={index}>
                      <a 
                        href={ref} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        {ref.length > 60 ? ref.substring(0, 60) + '...' : ref}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedVulnerability.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </ScrollArea>
        </>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Brain className="mr-2 h-6 w-6" />
            Threat Intelligence Hub
          </h2>
          <p className="text-gray-400">
            Track and analyze threat actors, indicators, and vulnerabilities
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[140px]">
              <CalendarClock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Filters and search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
                <TabsTrigger value="threats" className="flex items-center">
                  <UserX className="mr-2 h-4 w-4" />
                  Threat Actors
                </TabsTrigger>
                <TabsTrigger value="indicators" className="flex items-center">
                  <Link2 className="mr-2 h-4 w-4" />
                  Indicators
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Reports
                </TabsTrigger>
                <TabsTrigger value="vulnerabilities" className="flex items-center">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Vulnerabilities
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search intelligence..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              
              <Button variant="outline" size="icon" onClick={() => setSearchQuery('')}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tab content */}
      <TabsContent value="threats" className="mt-0">
        {renderThreatActorsTab()}
      </TabsContent>
      
      <TabsContent value="indicators" className="mt-0">
        {renderIndicatorsTab()}
      </TabsContent>
      
      <TabsContent value="reports" className="mt-0">
        {renderReportsTab()}
      </TabsContent>
      
      <TabsContent value="vulnerabilities" className="mt-0">
        {renderVulnerabilitiesTab()}
      </TabsContent>
      
      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          {renderDetailsContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Mail, FileSpreadsheet } from 'lucide-react';