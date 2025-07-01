import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Plus, 
  Eye, 
  EyeOff, 
  Grip, 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp,
  Activity,
  Target,
  Zap,
  Brain,
  Shield,
  Globe,
  FileText,
  Calendar,
  Bell,
  Award,
  Crown,
  Power,
  Command,
  Server,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Note: Using placeholder for SpacePharaoh image - actual asset integration needed
const spacePharaohLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z'%3E%3C/path%3E%3Cpath d='M3 6h18'%3E%3C/path%3E%3Cpath d='M16 10a4 4 0 0 1-8 0'%3E%3C/path%3E%3C/svg%3E";

// Widget type interface
interface WidgetType {
  id: string;
  name: string;
  icon: any;
  defaultSize: { width: number; height: number };
  category: string;
  adminOnly?: boolean;
}

// Widget types and configurations
const WIDGET_TYPES: Record<string, WidgetType> = {
  PHARAOH_COMMAND: {
    id: 'pharaoh-command',
    name: 'SpacePharaoh Command Center',
    icon: Crown,
    defaultSize: { width: 4, height: 2 },
    category: 'Executive',
    adminOnly: true
  },
  EMPIRE_OVERVIEW: {
    id: 'empire-overview',
    name: 'AI Empire Status',
    icon: Globe,
    defaultSize: { width: 3, height: 2 },
    category: 'Executive',
    adminOnly: true
  },
  REVENUE_CHART: {
    id: 'revenue-chart',
    name: 'Revenue Analytics',
    icon: DollarSign,
    defaultSize: { width: 2, height: 2 },
    category: 'Analytics'
  },
  ACTIVE_AGENTS: {
    id: 'active-agents',
    name: 'Active AI Agents',
    icon: Brain,
    defaultSize: { width: 1, height: 1 },
    category: 'Monitoring'
  },
  LEAD_FUNNEL: {
    id: 'lead-funnel',
    name: 'Lead Conversion Funnel',
    icon: Target,
    defaultSize: { width: 2, height: 2 },
    category: 'Sales'
  },
  PERFORMANCE_METRICS: {
    id: 'performance-metrics',
    name: 'Performance Metrics',
    icon: Activity,
    defaultSize: { width: 2, height: 1 },
    category: 'Analytics'
  },
  INDUSTRY_BREAKDOWN: {
    id: 'industry-breakdown',
    name: 'Industry Breakdown',
    icon: BarChart3,
    defaultSize: { width: 1, height: 2 },
    category: 'Analytics'
  },
  RECENT_ACTIVITY: {
    id: 'recent-activity',
    name: 'Recent Activity',
    icon: Bell,
    defaultSize: { width: 1, height: 2 },
    category: 'Activity'
  },
  SECURITY_STATUS: {
    id: 'security-status',
    name: 'Security Status',
    icon: Shield,
    defaultSize: { width: 1, height: 1 },
    category: 'Security'
  },
  GLOBAL_MAP: {
    id: 'global-map',
    name: 'Global Deployment Map',
    icon: Globe,
    defaultSize: { width: 2, height: 2 },
    category: 'Geography'
  },
  QUICK_STATS: {
    id: 'quick-stats',
    name: 'Quick Statistics',
    icon: Zap,
    defaultSize: { width: 2, height: 1 },
    category: 'Overview'
  },
  CALENDAR: {
    id: 'calendar',
    name: 'Calendar & Events',
    icon: Calendar,
    defaultSize: { width: 1, height: 2 },
    category: 'Planning'
  },
  ACHIEVEMENTS: {
    id: 'achievements',
    name: 'Achievements & Goals',
    icon: Award,
    defaultSize: { width: 1, height: 1 },
    category: 'Goals'
  },
  REPORTS: {
    id: 'reports',
    name: 'Generated Reports',
    icon: FileText,
    defaultSize: { width: 1, height: 1 },
    category: 'Reports'
  }
};

interface Widget {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
  config: Record<string, any>;
}

interface DashboardLayout {
  id: string;
  name: string;
  widgets: Widget[];
  isDefault: boolean;
  theme: 'light' | 'dark' | 'pharaoh';
  userRole?: 'admin' | 'user';
}

const DEFAULT_LAYOUTS: DashboardLayout[] = [
  {
    id: 'spacepharaoh-throne',
    name: 'SpacePharaoh\'s Throne Room',
    isDefault: false,
    theme: 'pharaoh',
    userRole: 'admin',
    widgets: [
      {
        id: 'pharaoh-command-1',
        type: 'pharaoh-command',
        position: { x: 0, y: 0 },
        size: { width: 4, height: 2 },
        visible: true,
        config: { showAvatar: true, showStats: true }
      },
      {
        id: 'empire-overview-1',
        type: 'empire-overview',
        position: { x: 0, y: 2 },
        size: { width: 3, height: 2 },
        visible: true,
        config: { showVerticals: true, showRevenue: true }
      },
      {
        id: 'revenue-chart-1',
        type: 'revenue-chart',
        position: { x: 3, y: 2 },
        size: { width: 2, height: 2 },
        visible: true,
        config: { timeRange: '1y', showProjections: true }
      },
      {
        id: 'active-agents-1',
        type: 'active-agents',
        position: { x: 0, y: 4 },
        size: { width: 1, height: 1 },
        visible: true,
        config: { showLiveActivity: true }
      },
      {
        id: 'security-status-1',
        type: 'security-status',
        position: { x: 1, y: 4 },
        size: { width: 1, height: 1 },
        visible: true,
        config: { showThreatLevel: true }
      },
      {
        id: 'global-map-1',
        type: 'global-map',
        position: { x: 2, y: 4 },
        size: { width: 2, height: 2 },
        visible: true,
        config: { showDeployments: true, showPartners: true }
      },
      {
        id: 'achievements-1',
        type: 'achievements',
        position: { x: 4, y: 4 },
        size: { width: 1, height: 1 },
        visible: true,
        config: { showMilestones: true }
      }
    ]
  },
  {
    id: 'executive',
    name: 'Executive Overview',
    isDefault: true,
    theme: 'light',
    widgets: [
      {
        id: 'widget-1',
        type: 'revenue-chart',
        position: { x: 0, y: 0 },
        size: { width: 2, height: 2 },
        visible: true,
        config: { timeRange: '30d' }
      },
      {
        id: 'widget-2',
        type: 'quick-stats',
        position: { x: 2, y: 0 },
        size: { width: 2, height: 1 },
        visible: true,
        config: {}
      },
      {
        id: 'widget-3',
        type: 'active-agents',
        position: { x: 0, y: 2 },
        size: { width: 1, height: 1 },
        visible: true,
        config: {}
      },
      {
        id: 'widget-4',
        type: 'security-status',
        position: { x: 1, y: 2 },
        size: { width: 1, height: 1 },
        visible: true,
        config: {}
      },
      {
        id: 'widget-5',
        type: 'industry-breakdown',
        position: { x: 2, y: 1 },
        size: { width: 1, height: 2 },
        visible: true,
        config: {}
      },
      {
        id: 'widget-6',
        type: 'recent-activity',
        position: { x: 3, y: 1 },
        size: { width: 1, height: 2 },
        visible: true,
        config: {}
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics Focus',
    isDefault: false,
    theme: 'light',
    widgets: [
      {
        id: 'widget-1',
        type: 'revenue-chart',
        position: { x: 0, y: 0 },
        size: { width: 3, height: 2 },
        visible: true,
        config: { timeRange: '90d' }
      },
      {
        id: 'widget-2',
        type: 'lead-funnel',
        position: { x: 3, y: 0 },
        size: { width: 2, height: 2 },
        visible: true,
        config: {}
      },
      {
        id: 'widget-3',
        type: 'performance-metrics',
        position: { x: 0, y: 2 },
        size: { width: 3, height: 1 },
        visible: true,
        config: {}
      },
      {
        id: 'widget-4',
        type: 'industry-breakdown',
        position: { x: 3, y: 2 },
        size: { width: 2, height: 2 },
        visible: true,
        config: {}
      }
    ]
  }
];

// Simulated user role - in real app this would come from authentication
const CURRENT_USER = {
  id: 'spacepharaoh',
  name: 'SpacePharaoh',
  role: 'admin',
  avatar: spacePharaohLogo
};

export default function DashboardCustomizer() {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout>(
    CURRENT_USER.role === 'admin' ? DEFAULT_LAYOUTS[0] : DEFAULT_LAYOUTS[1]
  );
  const [layouts, setLayouts] = useState<DashboardLayout[]>(DEFAULT_LAYOUTS);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  const { toast } = useToast();

  // Load saved layouts from localStorage
  useEffect(() => {
    const savedLayouts = localStorage.getItem('dashboard-layouts');
    if (savedLayouts) {
      try {
        const parsed = JSON.parse(savedLayouts);
        setLayouts(parsed);
        const savedCurrentId = localStorage.getItem('current-dashboard-layout');
        if (savedCurrentId) {
          const current = parsed.find((l: DashboardLayout) => l.id === savedCurrentId);
          if (current) setCurrentLayout(current);
        }
      } catch (error) {
        console.warn('Failed to load saved layouts');
      }
    }
  }, []);

  // Save layouts to localStorage
  const saveLayouts = (newLayouts: DashboardLayout[]) => {
    setLayouts(newLayouts);
    localStorage.setItem('dashboard-layouts', JSON.stringify(newLayouts));
  };

  const saveCurrentLayout = (layout: DashboardLayout) => {
    setCurrentLayout(layout);
    localStorage.setItem('current-dashboard-layout', layout.id);
    const updatedLayouts = layouts.map(l => l.id === layout.id ? layout : l);
    saveLayouts(updatedLayouts);
  };

  const addWidget = (widgetType: string) => {
    const widgetConfig = WIDGET_TYPES[widgetType as keyof typeof WIDGET_TYPES];
    if (!widgetConfig) return;

    // Check admin permissions
    if (widgetConfig?.adminOnly && CURRENT_USER.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "This widget is only available to SpacePharaoh and administrators",
        variant: "destructive"
      });
      return;
    }

    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      position: { x: 0, y: 0 },
      size: widgetConfig.defaultSize,
      visible: true,
      config: {}
    };

    const updatedLayout = {
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget]
    };
    saveCurrentLayout(updatedLayout);
    setShowWidgetPicker(false);
    
    toast({
      title: "Widget Added",
      description: `${widgetConfig.name} has been added to your dashboard`
    });
  };

  const removeWidget = (widgetId: string) => {
    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.filter(w => w.id !== widgetId)
    };
    saveCurrentLayout(updatedLayout);
    
    toast({
      title: "Widget Removed",
      description: "Widget has been removed from your dashboard"
    });
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.map(w => 
        w.id === widgetId ? { ...w, visible: !w.visible } : w
      )
    };
    saveCurrentLayout(updatedLayout);
  };

  const createNewLayout = () => {
    const newLayout: DashboardLayout = {
      id: `layout-${Date.now()}`,
      name: `Custom Layout ${layouts.length + 1}`,
      isDefault: false,
      theme: 'light',
      widgets: []
    };
    
    const updatedLayouts = [...layouts, newLayout];
    saveLayouts(updatedLayouts);
    setCurrentLayout(newLayout);
    
    toast({
      title: "New Layout Created",
      description: "You can now customize your new dashboard layout"
    });
  };

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'pharaoh':
        return 'bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-900 text-amber-100';
      case 'dark':
        return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white';
      default:
        return 'bg-gray-50 text-gray-900';
    }
  };

  const getCardTheme = (theme: string) => {
    switch (theme) {
      case 'pharaoh':
        return 'bg-gradient-to-br from-amber-800/20 to-yellow-700/20 border-amber-400/30 backdrop-blur-sm';
      case 'dark':
        return 'bg-slate-800/50 border-slate-600 backdrop-blur-sm';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const renderWidget = (widget: Widget, index: number) => {
    const widgetConfig = WIDGET_TYPES[widget.type as keyof typeof WIDGET_TYPES];
    if (!widgetConfig || !widget.visible) return null;

    // Admin-only widget check
    if (widgetConfig?.adminOnly && CURRENT_USER.role !== 'admin') return null;

    const IconComponent = widgetConfig.icon;

    return (
      <div
        key={widget.id}
        className={`
          relative group
          ${isCustomizing ? 'cursor-move' : ''}
        `}
        style={{
          gridColumn: `span ${widget.size.width}`,
          gridRow: `span ${widget.size.height}`
        }}
      >
        <Card className={`h-full ${getCardTheme(currentLayout.theme)} ${isCustomizing ? 'border-2 border-dashed border-blue-300' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              {isCustomizing && <Grip className="h-4 w-4 text-gray-400" />}
              <IconComponent className={`h-4 w-4 ${currentLayout.theme === 'pharaoh' ? 'text-amber-300' : ''}`} />
              <CardTitle className="text-sm font-medium">{widgetConfig.name}</CardTitle>
              {widgetConfig?.adminOnly && (
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                  <Crown className="h-3 w-3 mr-1" />
                  Royal
                </Badge>
              )}
            </div>
            {isCustomizing && (
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="ghost" onClick={() => setSelectedWidget(widget)}>
                  <Settings className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleWidgetVisibility(widget.id)}>
                  {widget.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => removeWidget(widget.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <WidgetContent widget={widget} theme={currentLayout.theme} />
          </CardContent>
        </Card>
      </div>
    );
  };

  // Filter available layouts based on user role
  const availableLayouts = layouts.filter(layout => 
    !layout.userRole || layout.userRole === CURRENT_USER.role
  );

  // Filter available widgets based on user role
  const availableWidgets = Object.entries(WIDGET_TYPES).filter(([key, config]) => 
    !config.adminOnly || CURRENT_USER.role === 'admin'
  );

  return (
    <div className={`min-h-screen p-6 ${getThemeClasses(currentLayout.theme)}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {CURRENT_USER.role === 'admin' && (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400">
                  <img 
                    src={spacePharaohLogo} 
                    alt="SpacePharaoh" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold flex items-center space-x-2">
                    <Crown className="h-8 w-8 text-amber-400" />
                    <span>SpacePharaoh's Command Center</span>
                  </h1>
                  <p className="text-amber-200">Supreme ruler of the Shatzii AI Empire</p>
                </div>
              </div>
            )}
            {CURRENT_USER.role !== 'admin' && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Customizer</h1>
                <p className="text-gray-600">Personalize your workspace with drag-and-drop widgets</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Layout Selector */}
            <Select value={currentLayout.id} onValueChange={(value) => {
              const layout = layouts.find(l => l.id === value);
              if (layout) setCurrentLayout(layout);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableLayouts.map(layout => (
                  <SelectItem key={layout.id} value={layout.id}>
                    <div className="flex items-center space-x-2">
                      {layout.userRole === 'admin' && <Crown className="h-3 w-3 text-amber-500" />}
                      <span>{layout.name}</span>
                      {layout.isDefault && <Badge variant="secondary">Default</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <Button variant="outline" onClick={createNewLayout}>
              <Plus className="h-4 w-4 mr-2" />
              New Layout
            </Button>
            
            <Button 
              variant={isCustomizing ? "default" : "outline"}
              onClick={() => setIsCustomizing(!isCustomizing)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isCustomizing ? 'Done Customizing' : 'Customize'}
            </Button>
          </div>
        </div>

        {/* SpacePharaoh Welcome Message */}
        {CURRENT_USER.role === 'admin' && currentLayout.theme === 'pharaoh' && (
          <Alert className="bg-amber-900/30 border-amber-400 max-w-4xl mx-auto">
            <Crown className="h-4 w-4" />
            <AlertDescription className="text-amber-200">
              Welcome to your royal command center, SpacePharaoh. Your AI empire spans 13 industry verticals with 202+ autonomous agents generating $166.2M in revenue potential. Rule wisely.
            </AlertDescription>
          </Alert>
        )}

        {/* Customization Controls */}
        {isCustomizing && (
          <Card className={getCardTheme(currentLayout.theme)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">Customization Mode</Badge>
                  <span className="text-sm opacity-80">
                    Drag widgets to reorder, click settings to configure, or add new widgets
                  </span>
                </div>
                <Button onClick={() => setShowWidgetPicker(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Widget
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Grid */}
        <div
          className="grid grid-cols-5 gap-6 auto-rows-fr"
          style={{ minHeight: '600px' }}
        >
          {currentLayout.widgets.map((widget, index) => renderWidget(widget, index))}
        </div>

        {/* Widget Picker Dialog */}
        <Dialog open={showWidgetPicker} onOpenChange={setShowWidgetPicker}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add Widget to Dashboard</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {availableWidgets.map(([key, config]) => {
                const IconComponent = config.icon;
                return (
                  <Card 
                    key={key} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => addWidget(key)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <h3 className="font-medium">{config.name}</h3>
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        <Badge variant="outline">{config.category}</Badge>
                        {config?.adminOnly && (
                          <Badge variant="secondary" className="bg-amber-500/20 text-amber-700 border-amber-400/30">
                            <Crown className="h-3 w-3 mr-1" />
                            Royal
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Widget Content Component
function WidgetContent({ widget, theme }: { widget: Widget; theme: string }) {
  const widgetConfig = WIDGET_TYPES[widget.type as keyof typeof WIDGET_TYPES];
  
  // Mock content based on widget type
  switch (widget.type) {
    case 'pharaoh-command':
      return (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-amber-400">
              <img 
                src={spacePharaohLogo} 
                alt="SpacePharaoh" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-amber-200">Supreme Commander</h2>
            <p className="text-amber-300">AI Empire Status: ONLINE</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">$166.2M</div>
              <div className="text-sm text-amber-300">Revenue Potential</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">202</div>
              <div className="text-sm text-amber-300">AI Agents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">13</div>
              <div className="text-sm text-amber-300">Verticals</div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-2">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
              <Command className="h-3 w-3 mr-1" />
              Deploy Orders
            </Button>
            <Button size="sm" variant="outline" className="border-amber-400 text-amber-200">
              <Shield className="h-3 w-3 mr-1" />
              Empire Status
            </Button>
          </div>
        </div>
      );

    case 'empire-overview':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-amber-200">AI Empire Status</h3>
            <Badge className="bg-green-500/20 text-green-400 border-green-400/30">All Systems Online</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-sm text-amber-300">Transportation AI</div>
              <div className="w-full bg-amber-900/30 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-amber-300">Healthcare AI</div>
              <div className="w-full bg-amber-900/30 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-amber-300">Financial AI</div>
              <div className="w-full bg-amber-900/30 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-amber-300">Legal AI</div>
              <div className="w-full bg-amber-900/30 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-2">
            <div className="text-2xl font-bold text-amber-200">97% Platform Complete</div>
            <div className="text-sm text-amber-400">Ready for global deployment</div>
          </div>
        </div>
      );
    
    case 'revenue-chart':
      return (
        <div className="space-y-2">
          <div className={`text-2xl font-bold ${theme === 'pharaoh' ? 'text-green-400' : 'text-green-600'}`}>$2.4M</div>
          <div className={`text-sm ${theme === 'pharaoh' ? 'text-amber-300' : 'text-gray-500'}`}>Revenue this month</div>
          <div className={`w-full h-20 rounded ${theme === 'pharaoh' ? 'bg-gradient-to-r from-amber-800/30 to-green-600/30' : 'bg-gradient-to-r from-green-100 to-green-200'}`}></div>
        </div>
      );
    
    case 'active-agents':
      return (
        <div className="space-y-2">
          <div className={`text-2xl font-bold ${theme === 'pharaoh' ? 'text-blue-400' : 'text-blue-600'}`}>202</div>
          <div className={`text-sm ${theme === 'pharaoh' ? 'text-amber-300' : 'text-gray-500'}`}>Active AI Agents</div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-8 rounded animate-pulse ${theme === 'pharaoh' ? 'bg-blue-400/60' : 'bg-blue-300'}`}
                style={{ animationDelay: `${i * 200}ms` }}
              ></div>
            ))}
          </div>
        </div>
      );
    
    case 'lead-funnel':
      return (
        <div className="space-y-3">
          <div className={`text-lg font-semibold ${theme === 'pharaoh' ? 'text-amber-200' : ''}`}>Lead Conversion</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${theme === 'pharaoh' ? 'text-amber-300' : ''}`}>Leads</span>
              <span className="font-medium">1,247</span>
            </div>
            <div className={`w-full rounded-full h-2 ${theme === 'pharaoh' ? 'bg-amber-900/30' : 'bg-gray-200'}`}>
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${theme === 'pharaoh' ? 'text-amber-300' : ''}`}>Qualified</span>
              <span className="font-medium">892</span>
            </div>
            <div className={`w-full rounded-full h-2 ${theme === 'pharaoh' ? 'bg-amber-900/30' : 'bg-gray-200'}`}>
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '71%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${theme === 'pharaoh' ? 'text-amber-300' : ''}`}>Converted</span>
              <span className="font-medium">234</span>
            </div>
            <div className={`w-full rounded-full h-2 ${theme === 'pharaoh' ? 'bg-amber-900/30' : 'bg-gray-200'}`}>
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '26%' }}></div>
            </div>
          </div>
        </div>
      );
    
    default:
      return (
        <div className={`text-center py-8 ${theme === 'pharaoh' ? 'text-amber-300' : 'text-gray-500'}`}>
          <div className="text-sm">Widget content for</div>
          <div className="font-medium">{widgetConfig?.name}</div>
        </div>
      );
  }
}