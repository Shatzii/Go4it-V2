import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

// UI Components
import TopNav from '@/components/layout/TopNav';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Types
interface SelfHealingEvent {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'error';
  timestamp: string;
  status?: 'complete' | 'in-progress' | 'pending';
  commands?: Array<{
    command: string;
    purpose: string;
    risk: 'low' | 'medium' | 'high';
  }>;
  affectedService?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  autoResolved?: boolean;
  resolutionTime?: number; // in seconds
  impact?: string;
  category?: string;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: string;
    condition: string;
    threshold?: number;
  };
  actions: Array<{
    command: string;
    description: string;
  }>;
  enabled: boolean;
  lastTriggered?: string;
  createdAt: string;
  category: string;
}

interface LogEntry {
  id: string;
  message: string;
  level: 'info' | 'warning' | 'error';
  source: string;
  timestamp: string;
}

const SelfHealing = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedEvent, setSelectedEvent] = useState<SelfHealingEvent | null>(null);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isAutoHealEnabled, setIsAutoHealEnabled] = useState(true);
  const [logFilter, setLogFilter] = useState('all');
  
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch self-healing events
  const { 
    data: healingEvents = [],
    isLoading: isLoadingEvents,
    refetch: refetchEvents
  } = useQuery({
    queryKey: ['/api/healing-events', timeRange],
    retry: 1
  });

  // Fetch automation rules
  const { 
    data: automationRules = [],
    isLoading: isLoadingRules,
    refetch: refetchRules
  } = useQuery({
    queryKey: ['/api/automation-rules'],
    retry: 1
  });

  // Fetch system logs
  const { 
    data: systemLogs = [],
    isLoading: isLoadingLogs 
  } = useQuery({
    queryKey: ['/api/monitoring/logs', logFilter],
    retry: 1
  });

  // Update healing event status mutation
  const updateEventStatusMutation = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: string }) => {
      const response = await apiRequest('PATCH', `/api/healing-events/${eventId}/status`, {
        status
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update event status');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/healing-events'] });
      toast({
        title: 'Event updated',
        description: 'The healing event status has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Toggle automation rule mutation
  const toggleRuleMutation = useMutation({
    mutationFn: async ({ ruleId, enabled }: { ruleId: string; enabled: boolean }) => {
      const response = await apiRequest('PATCH', `/api/automation-rules/${ruleId}`, {
        enabled
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update automation rule');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation-rules'] });
      toast({
        title: 'Rule updated',
        description: 'The automation rule has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Execute healing commands mutation
  const executeHealingMutation = useMutation({
    mutationFn: async ({ eventId, autoFix = false }: { eventId: string; autoFix?: boolean }) => {
      const response = await apiRequest('POST', `/api/ai/self-heal`, {
        eventId,
        autoFix
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to execute healing commands');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/healing-events'] });
      toast({
        title: 'Healing initiated',
        description: 'The healing process has been initiated successfully.',
      });
      setSelectedEvent(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Healing failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Toggle global auto-heal setting
  const toggleAutoHealMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const response = await apiRequest('PATCH', `/api/settings/auto-heal`, {
        enabled
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update auto-heal setting');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Setting updated',
        description: `Automatic healing has been ${isAutoHealEnabled ? 'enabled' : 'disabled'}.`,
      });
    },
    onError: (error: Error) => {
      // Revert the toggle if the API call fails
      setIsAutoHealEnabled(!isAutoHealEnabled);
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Filter events based on search, category, and severity
  const filteredEvents = healingEvents.filter((event: SelfHealingEvent) => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    
    // Severity filter
    const matchesSeverity = selectedSeverity === 'all' || event.severity === selectedSeverity;
    
    // Active filter
    const matchesActiveStatus = !showOnlyActive || 
      (event.status === 'in-progress' || event.status === 'pending');
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesActiveStatus;
  });

  // Filter rules based on search and category
  const filteredRules = automationRules.filter((rule: AutomationRule) => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || rule.category === categoryFilter;
    
    // Active filter
    const matchesActiveStatus = !showOnlyActive || rule.enabled;
    
    return matchesSearch && matchesCategory && matchesActiveStatus;
  });

  // Filter logs based on level
  const filteredLogs = systemLogs.filter((log: LogEntry) => {
    return logFilter === 'all' || log.level === logFilter;
  });

  // Get unique categories for filter dropdown
  const getCategories = () => {
    const categories = new Set<string>();
    
    healingEvents.forEach((event: SelfHealingEvent) => {
      if (event.category) {
        categories.add(event.category);
      }
    });
    
    automationRules.forEach((rule: AutomationRule) => {
      categories.add(rule.category);
    });
    
    return Array.from(categories);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format time duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} seconds`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} minutes`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hours ${minutes} minutes`;
    }
  };

  // Get color class for severity
  const getSeverityColorClass = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-900/50 text-blue-300 border-blue-800';
      case 'medium':
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-800';
      case 'high':
        return 'bg-orange-900/50 text-orange-300 border-orange-800';
      case 'critical':
        return 'bg-red-900/50 text-red-300 border-red-800';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  // Get color class for event type
  const getEventTypeColorClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/30 text-green-400';
      case 'warning':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'error':
        return 'bg-red-900/30 text-red-400';
      default:
        return 'bg-gray-800 text-gray-400';
    }
  };

  // Loading state
  const isLoading = isLoadingEvents || isLoadingRules || isLoadingLogs;

  // Render event details dialog
  const renderEventDetailsDialog = () => {
    if (!selectedEvent) return null;

    return (
      <Dialog 
        open={!!selectedEvent} 
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
      >
        <DialogContent className="bg-dark-900 border-dark-700 text-white max-w-4xl overflow-hidden">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                getEventTypeColorClass(selectedEvent.type)
              }`}>
                <span className="material-icons">
                  {selectedEvent.type === 'success' 
                    ? 'check_circle' 
                    : selectedEvent.type === 'warning'
                      ? 'warning'
                      : 'error'}
                </span>
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-semibold">{selectedEvent.title}</DialogTitle>
                <DialogDescription className="text-gray-400 flex items-center gap-2 mt-1">
                  <span>{formatDate(selectedEvent.timestamp)}</span>
                  {selectedEvent.severity && (
                    <Badge className={getSeverityColorClass(selectedEvent.severity)}>
                      {selectedEvent.severity.charAt(0).toUpperCase() + selectedEvent.severity.slice(1)} Severity
                    </Badge>
                  )}
                  {selectedEvent.status && (
                    <Badge className={
                      selectedEvent.status === 'complete' 
                        ? 'bg-green-900/50 text-green-300 border-green-800' 
                        : selectedEvent.status === 'in-progress'
                          ? 'bg-blue-900/50 text-blue-300 border-blue-800'
                          : 'bg-gray-800 text-gray-400 border-gray-700'
                    }>
                      {selectedEvent.status === 'complete' 
                        ? 'Resolved' 
                        : selectedEvent.status === 'in-progress'
                          ? 'In Progress'
                          : 'Pending'}
                    </Badge>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4 text-white">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
              <p className="text-white">{selectedEvent.description}</p>
            </div>

            {selectedEvent.affectedService && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Affected Service</h4>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-blue-400">devices</span>
                  <p>{selectedEvent.affectedService}</p>
                </div>
              </div>
            )}
            
            {selectedEvent.impact && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Business Impact</h4>
                <p className="text-white">{selectedEvent.impact}</p>
              </div>
            )}

            {selectedEvent.commands && selectedEvent.commands.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Recommended Actions</h4>
                <div className="bg-dark-950 rounded-md border border-dark-800 divide-y divide-dark-800">
                  {selectedEvent.commands.map((cmd, index) => (
                    <div key={index} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="font-mono bg-dark-900 text-primary-400 p-2 rounded leading-none overflow-x-auto flex-1 mr-2">
                          <code>{cmd.command}</code>
                        </div>
                        <Badge className={`${
                          cmd.risk === 'low'
                            ? 'bg-green-900/50 text-green-300 border-green-800'
                            : cmd.risk === 'medium'
                              ? 'bg-yellow-900/50 text-yellow-300 border-yellow-800'
                              : 'bg-red-900/50 text-red-300 border-red-800'
                        }`}>
                          {cmd.risk} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{cmd.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEvent.resolutionTime && selectedEvent.status === 'complete' && (
              <div className="bg-dark-800 rounded-md p-3">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-green-400">timer</span>
                  <div>
                    <p className="text-white font-medium">Resolution Time</p>
                    <p className="text-gray-400 text-sm">{formatDuration(selectedEvent.resolutionTime)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {selectedEvent.status !== 'complete' ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    updateEventStatusMutation.mutate({
                      eventId: selectedEvent.id,
                      status: 'complete'
                    });
                  }}
                  disabled={updateEventStatusMutation.isPending}
                >
                  Mark as Resolved
                </Button>
                <Button
                  onClick={() => {
                    executeHealingMutation.mutate({
                      eventId: selectedEvent.id,
                      autoFix: user?.plan !== 'free' // Auto-fix for premium users
                    });
                  }}
                  disabled={executeHealingMutation.isPending}
                >
                  {executeHealingMutation.isPending ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Healing...
                    </>
                  ) : (
                    <>
                      <span className="material-icons mr-2 text-sm">healing</span>
                      Apply Healing
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Render automation rule details dialog
  const renderRuleDetailsDialog = () => {
    if (!selectedRule) return null;

    return (
      <Dialog 
        open={!!selectedRule} 
        onOpenChange={(open) => {
          if (!open) setSelectedRule(null);
        }}
      >
        <DialogContent className="bg-dark-900 border-dark-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{selectedRule.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Created {formatDate(selectedRule.createdAt)}
              {selectedRule.lastTriggered && (
                <span> • Last triggered {formatDate(selectedRule.lastTriggered)}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
              <p className="text-white">{selectedRule.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Trigger Condition</h4>
              <div className="bg-dark-800 rounded-md p-3">
                <div className="flex items-center mb-2">
                  <span className="material-icons text-primary-400 mr-2">bolt</span>
                  <span className="font-medium text-white">{selectedRule.trigger.type}</span>
                </div>
                <p className="text-gray-300">{selectedRule.trigger.condition}</p>
                {selectedRule.trigger.threshold && (
                  <div className="mt-2 flex items-center">
                    <span className="text-gray-400 mr-2">Threshold:</span>
                    <Badge>{selectedRule.trigger.threshold}</Badge>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Actions</h4>
              <div className="bg-dark-950 rounded-md border border-dark-800 divide-y divide-dark-800">
                {selectedRule.actions.map((action, index) => (
                  <div key={index} className="p-3">
                    <div className="font-mono bg-dark-900 text-primary-400 p-2 rounded leading-none overflow-x-auto">
                      <code>{action.command}</code>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{action.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Switch
                id="rule-status"
                checked={selectedRule.enabled}
                onCheckedChange={(checked) => {
                  toggleRuleMutation.mutate({
                    ruleId: selectedRule.id,
                    enabled: checked
                  });
                }}
              />
              <Label htmlFor="rule-status">
                {selectedRule.enabled ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedRule(null)}>
                Close
              </Button>
              <Button variant="outline" className="border-primary-700 text-primary-400 hover:bg-primary-900/20">
                <span className="material-icons mr-2 text-sm">edit</span>
                Edit
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex h-screen bg-dark-1000 text-white overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">AI Self-Healing</h1>
                <p className="text-gray-400">Automated diagnostics and resolution for server issues</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-dark-900 border border-dark-800 rounded-md p-2 mr-2">
                  <Label htmlFor="auto-heal" className="text-sm">Automatic Healing:</Label>
                  <Switch
                    id="auto-heal"
                    checked={isAutoHealEnabled}
                    onCheckedChange={(checked) => {
                      setIsAutoHealEnabled(checked);
                      toggleAutoHealMutation.mutate(checked);
                    }}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="material-icons text-gray-400 text-sm cursor-help">help_outline</span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-dark-800 border-dark-700 text-white">
                        <p className="max-w-xs">
                          When enabled, the system will automatically apply recommended fixes for low-risk issues.
                          {user?.plan !== 'free' ? ' Premium plans can auto-fix medium and high risk issues.' : ''}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <Button
                  variant="outline"
                  className="border-primary-700 text-primary-400 hover:text-primary-300 hover:bg-primary-900/20"
                  onClick={() => {
                    refetchEvents();
                    refetchRules();
                  }}
                >
                  <span className="material-icons mr-1 text-sm">refresh</span>
                  Refresh
                </Button>
                
                <Button
                  onClick={() => setLocation('/ai-analyzer')}
                >
                  <span className="material-icons mr-1 text-sm">psychology</span>
                  AI Analysis
                </Button>
              </div>
            </div>
            
            {/* Self-Healing Summary */}
            <div className="bg-gradient-to-r from-dark-900 to-secondary-900/20 rounded-lg border border-dark-700 p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">AI Self-Healing Status</h2>
                  <p className="text-secondary-400">
                    {isAutoHealEnabled ? 'Automated healing active' : 'Manual healing mode'}
                  </p>
                </div>

                <div className="mt-4 md:mt-0 bg-dark-950/50 rounded-md p-4 backdrop-blur-sm">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-gray-400 text-sm">Issues Detected</div>
                      <div className="text-xl font-bold text-white">24</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Auto-Resolved</div>
                      <div className="text-xl font-bold text-green-400">18</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Avg. Resolution</div>
                      <div className="text-xl font-bold text-white">3.2 min</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content Tabs */}
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
                <TabsList className="bg-dark-800">
                  <TabsTrigger value="events" className="relative">
                    Healing Events
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      3
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="automation">Automation Rules</TabsTrigger>
                  <TabsTrigger value="logs">System Logs</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                  {/* Filter controls based on active tab */}
                  {activeTab === 'events' && (
                    <>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[120px] bg-dark-900 border-dark-700 text-white">
                          <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-800 border-dark-700 text-white">
                          <SelectItem value="1h">Last Hour</SelectItem>
                          <SelectItem value="24h">Last 24 Hours</SelectItem>
                          <SelectItem value="7d">Last 7 Days</SelectItem>
                          <SelectItem value="30d">Last 30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                        <SelectTrigger className="w-[130px] bg-dark-900 border-dark-700 text-white">
                          <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-800 border-dark-700 text-white">
                          <SelectItem value="all">All Severities</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                  
                  {activeTab === 'logs' && (
                    <Select value={logFilter} onValueChange={setLogFilter}>
                      <SelectTrigger className="w-[130px] bg-dark-900 border-dark-700 text-white">
                        <SelectValue placeholder="Log Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-800 border-dark-700 text-white">
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[140px] bg-dark-900 border-dark-700 text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-800 border-dark-700 text-white">
                      <SelectItem value="all">All Categories</SelectItem>
                      {getCategories().map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-2 bg-dark-900 border border-dark-700 rounded-md px-3 py-2">
                    <Label htmlFor="active-only" className="text-sm">Active Only</Label>
                    <Switch
                      id="active-only"
                      checked={showOnlyActive}
                      onCheckedChange={setShowOnlyActive}
                    />
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-96 mb-4 bg-dark-800 border-dark-700 rounded-md py-2 pl-10 pr-4 text-white placeholder:text-gray-500 focus:border-primary-600 focus:ring-primary-600"
                />
                <span className="absolute left-3 top-2.5 text-gray-500 material-icons text-lg">search</span>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <Spinner size="lg" className="text-primary-500 mb-4" />
                    <p className="text-gray-400">Loading...</p>
                  </div>
                </div>
              ) : (
                <>
                  <TabsContent value="events" className="m-0">
                    {filteredEvents.length === 0 ? (
                      <div className="text-center p-12 border border-dark-700 rounded-md bg-dark-900">
                        <div className="bg-dark-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="material-icons text-3xl text-gray-400">healing</span>
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No healing events found</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                          {searchQuery || categoryFilter !== 'all' || selectedSeverity !== 'all' || showOnlyActive 
                            ? "No events match your current filters. Try adjusting your search criteria."
                            : "No self-healing events have been detected. Your server is healthy!"
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="border border-dark-700 rounded-md overflow-hidden">
                        <div className="bg-dark-800 p-3 text-sm text-gray-400 grid grid-cols-12 gap-4">
                          <div className="col-span-5">Event</div>
                          <div className="col-span-2">Category</div>
                          <div className="col-span-2">Severity</div>
                          <div className="col-span-2">Status</div>
                          <div className="col-span-1">Actions</div>
                        </div>
                        <div className="divide-y divide-dark-700">
                          {filteredEvents.map((event: SelfHealingEvent) => (
                            <div 
                              key={event.id} 
                              className="p-4 bg-dark-900 grid grid-cols-12 gap-4 items-center hover:bg-dark-850 transition-colors cursor-pointer"
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="col-span-5 flex items-start">
                                <div className={`mt-0.5 mr-3 h-8 w-8 rounded-full flex items-center justify-center ${
                                  getEventTypeColorClass(event.type)
                                }`}>
                                  <span className="material-icons">
                                    {event.type === 'success' 
                                      ? 'check_circle' 
                                      : event.type === 'warning'
                                        ? 'warning'
                                        : 'error'}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-white">{event.title}</h4>
                                  <p className="text-xs text-gray-400 mt-1">{formatDate(event.timestamp)}</p>
                                </div>
                              </div>
                              <div className="col-span-2">
                                {event.category ? (
                                  <Badge variant="outline" className="bg-dark-800">
                                    {event.category}
                                  </Badge>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </div>
                              <div className="col-span-2">
                                {event.severity ? (
                                  <Badge className={getSeverityColorClass(event.severity)}>
                                    {event.severity}
                                  </Badge>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </div>
                              <div className="col-span-2">
                                <Badge className={
                                  event.status === 'complete' 
                                    ? 'bg-green-900/50 text-green-300 border-green-800' 
                                    : event.status === 'in-progress'
                                      ? 'bg-blue-900/50 text-blue-300 border-blue-800'
                                      : 'bg-gray-800 text-gray-400 border-gray-700'
                                }>
                                  {event.status === 'complete' 
                                    ? 'Resolved' 
                                    : event.status === 'in-progress'
                                      ? 'In Progress'
                                      : 'Pending'}
                                </Badge>
                              </div>
                              <div className="col-span-1 flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(event);
                                  }}
                                >
                                  <span className="material-icons text-gray-400">more_vert</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="automation" className="m-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-white">Automation Rules</h3>
                      <Button 
                        size="sm" 
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                      >
                        <span className="material-icons mr-1 text-sm">add</span>
                        New Rule
                      </Button>
                    </div>
                    
                    {filteredRules.length === 0 ? (
                      <div className="text-center p-12 border border-dark-700 rounded-md bg-dark-900">
                        <div className="bg-dark-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="material-icons text-3xl text-gray-400">auto_fix_high</span>
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No automation rules found</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                          {searchQuery || categoryFilter !== 'all' || showOnlyActive 
                            ? "No rules match your current filters. Try adjusting your search criteria."
                            : "You haven't created any automation rules yet. Create a rule to automate your server maintenance tasks."
                          }
                        </p>
                        <Button className="mt-4">
                          <span className="material-icons mr-1 text-sm">add</span>
                          Create First Rule
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredRules.map((rule: AutomationRule) => (
                          <Card 
                            key={rule.id} 
                            className={`bg-dark-900 border-dark-700 hover:border-dark-600 cursor-pointer transition-colors h-full ${
                              !rule.enabled ? 'opacity-70' : ''
                            }`}
                            onClick={() => setSelectedRule(rule)}
                          >
                            <CardHeader className="pb-2 relative">
                              <div className="absolute top-3 right-3">
                                <Switch
                                  checked={rule.enabled}
                                  onCheckedChange={(checked) => {
                                    toggleRuleMutation.mutate({
                                      ruleId: rule.id,
                                      enabled: checked
                                    });
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <CardTitle className="text-base font-medium text-white pr-12">{rule.name}</CardTitle>
                              <CardDescription className="text-xs text-gray-400">
                                <Badge variant="outline" className="bg-dark-800 mr-1">
                                  {rule.category}
                                </Badge>
                                {rule.lastTriggered && (
                                  <span>• Last ran {new Date(rule.lastTriggered).toLocaleDateString()}</span>
                                )}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-0">
                              <p className="text-sm text-gray-300 line-clamp-2">{rule.description}</p>
                            </CardContent>
                            <CardFooter className="pt-4">
                              <div className="bg-dark-800 rounded-md p-2 w-full">
                                <div className="flex items-center mb-1">
                                  <span className="material-icons text-sm text-primary-400 mr-1">bolt</span>
                                  <p className="text-xs text-white font-medium">Trigger: {rule.trigger.type}</p>
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-1">{rule.trigger.condition}</p>
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="logs" className="m-0">
                    <div className="border border-dark-700 rounded-md overflow-hidden">
                      <div className="bg-dark-800 p-3 text-sm text-gray-400 grid grid-cols-12 gap-4">
                        <div className="col-span-2">Time</div>
                        <div className="col-span-1">Level</div>
                        <div className="col-span-2">Source</div>
                        <div className="col-span-7">Message</div>
                      </div>
                      
                      {filteredLogs.length === 0 ? (
                        <div className="p-8 text-center bg-dark-900">
                          <p className="text-gray-400">No log entries match your criteria</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-dark-700 max-h-[500px] overflow-y-auto">
                          {filteredLogs.map((log: LogEntry) => (
                            <div key={log.id} className="p-3 bg-dark-900 grid grid-cols-12 gap-4 items-start">
                              <div className="col-span-2 text-xs text-gray-400">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </div>
                              <div className="col-span-1">
                                <Badge className={
                                  log.level === 'error'
                                    ? 'bg-red-900/50 text-red-300 border-red-800'
                                    : log.level === 'warning'
                                      ? 'bg-yellow-900/50 text-yellow-300 border-yellow-800'
                                      : 'bg-blue-900/50 text-blue-300 border-blue-800'
                                }>
                                  {log.level}
                                </Badge>
                              </div>
                              <div className="col-span-2 text-xs text-primary-400">
                                {log.source}
                              </div>
                              <div className="col-span-7 text-sm text-white font-mono overflow-x-auto">
                                {log.message}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </main>
      </div>
      
      {renderEventDetailsDialog()}
      {renderRuleDetailsDialog()}
    </div>
  );
};

export default SelfHealing;