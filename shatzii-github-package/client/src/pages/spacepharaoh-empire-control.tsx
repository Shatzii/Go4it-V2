import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown, Settings, DollarSign, TrendingUp, Users, Zap, 
  Shield, Target, BarChart3, Activity, Globe, Rocket,
  Truck, Home, Heart, GraduationCap, Calculator, Scale,
  Building, Factory, Car, Briefcase, Battery, Building2
} from "lucide-react";

interface VerticalControl {
  id: string;
  name: string;
  icon: React.ReactNode;
  monthlyRevenue: number;
  automationLevel: number;
  activeClients: number;
  status: 'active' | 'scaling' | 'optimizing';
  experienceMode: 'option1' | 'option3';
}

export default function SpacePharaohEmpireControl() {
  const [globalExperience, setGlobalExperience] = useState<'option1' | 'option3'>('option1');
  const [totalRevenue, setTotalRevenue] = useState(5847000);
  const [automationLevel, setAutomationLevel] = useState(96);
  
  const [verticals, setVerticals] = useState<VerticalControl[]>([
    {
      id: 'trucking',
      name: 'TruckFlow AI',
      icon: <Truck className="w-6 h-6" />,
      monthlyRevenue: 850000,
      automationLevel: 98,
      activeClients: 1250,
      status: 'active',
      experienceMode: 'option1'
    },
    {
      id: 'construction',
      name: 'RoofingFlow AI',
      icon: <Home className="w-6 h-6" />,
      monthlyRevenue: 675000,
      automationLevel: 95,
      activeClients: 890,
      status: 'scaling',
      experienceMode: 'option1'
    },
    {
      id: 'healthcare',
      name: 'HealthFlow AI',
      icon: <Heart className="w-6 h-6" />,
      monthlyRevenue: 425000,
      automationLevel: 92,
      activeClients: 650,
      status: 'active',
      experienceMode: 'option1'
    },
    {
      id: 'education',
      name: 'EduSafe AI',
      icon: <GraduationCap className="w-6 h-6" />,
      monthlyRevenue: 285000,
      automationLevel: 94,
      activeClients: 320,
      status: 'optimizing',
      experienceMode: 'option1'
    },
    {
      id: 'finance',
      name: 'FinanceFlow AI',
      icon: <Calculator className="w-6 h-6" />,
      monthlyRevenue: 520000,
      automationLevel: 97,
      activeClients: 1150,
      status: 'active',
      experienceMode: 'option1'
    },
    {
      id: 'legal',
      name: 'LegalFlow AI',
      icon: <Scale className="w-6 h-6" />,
      monthlyRevenue: 390000,
      automationLevel: 89,
      activeClients: 485,
      status: 'scaling',
      experienceMode: 'option1'
    },
    {
      id: 'realestate',
      name: 'RealtyFlow AI',
      icon: <Building className="w-6 h-6" />,
      monthlyRevenue: 445000,
      automationLevel: 91,
      activeClients: 720,
      status: 'active',
      experienceMode: 'option1'
    },
    {
      id: 'manufacturing',
      name: 'ManuFlow AI',
      icon: <Factory className="w-6 h-6" />,
      monthlyRevenue: 680000,
      automationLevel: 93,
      activeClients: 340,
      status: 'scaling',
      experienceMode: 'option1'
    },
    {
      id: 'insurance',
      name: 'InsureFlow AI',
      icon: <Shield className="w-6 h-6" />,
      monthlyRevenue: 365000,
      automationLevel: 88,
      activeClients: 560,
      status: 'optimizing',
      experienceMode: 'option1'
    },
    {
      id: 'government',
      name: 'GovFlow AI',
      icon: <Building2 className="w-6 h-6" />,
      monthlyRevenue: 295000,
      automationLevel: 85,
      activeClients: 85,
      status: 'active',
      experienceMode: 'option1'
    },
    {
      id: 'energy',
      name: 'EnergyFlow AI',
      icon: <Battery className="w-6 h-6" />,
      monthlyRevenue: 515000,
      automationLevel: 90,
      activeClients: 125,
      status: 'scaling',
      experienceMode: 'option1'
    },
    {
      id: 'transportation',
      name: 'TransFlow AI',
      icon: <Car className="w-6 h-6" />,
      monthlyRevenue: 380000,
      automationLevel: 87,
      activeClients: 420,
      status: 'optimizing',
      experienceMode: 'option1'
    },
    {
      id: 'professional',
      name: 'ProFlow AI',
      icon: <Briefcase className="w-6 h-6" />,
      monthlyRevenue: 455000,
      automationLevel: 93,
      activeClients: 890,
      status: 'active',
      experienceMode: 'option1'
    }
  ]);

  const totalClients = verticals.reduce((sum, v) => sum + v.activeClients, 0);
  const avgAutomation = verticals.reduce((sum, v) => sum + v.automationLevel, 0) / verticals.length;

  const handleGlobalExperienceChange = (mode: 'option1' | 'option3') => {
    setGlobalExperience(mode);
    setVerticals(prev => prev.map(v => ({ ...v, experienceMode: mode })));
  };

  const handleVerticalExperienceToggle = (verticalId: string, mode: 'option1' | 'option3') => {
    setVerticals(prev => prev.map(v => 
      v.id === verticalId ? { ...v, experienceMode: mode } : v
    ));
  };

  const handleVerticalControl = (verticalId: string, action: 'boost' | 'optimize' | 'scale') => {
    setVerticals(prev => prev.map(v => {
      if (v.id === verticalId) {
        switch (action) {
          case 'boost':
            return { ...v, monthlyRevenue: Math.floor(v.monthlyRevenue * 1.25), status: 'scaling' };
          case 'optimize':
            return { ...v, automationLevel: Math.min(99, v.automationLevel + 3), status: 'optimizing' };
          case 'scale':
            return { ...v, activeClients: Math.floor(v.activeClients * 1.4), status: 'scaling' };
          default:
            return v;
        }
      }
      return v;
    }));
  };

  useEffect(() => {
    const newTotal = verticals.reduce((sum, v) => sum + v.monthlyRevenue, 0);
    setTotalRevenue(newTotal);
    setAutomationLevel(avgAutomation);
  }, [verticals, avgAutomation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-16 h-16 text-yellow-500 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              SpacePharaoh Empire Control
            </h1>
          </div>
          <p className="text-xl text-blue-200 mb-6">
            Ultimate Command Center for 13-Vertical AI Empire
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            <Badge variant="secondary" className="px-6 py-3 text-lg bg-green-900/50 text-green-300">
              <DollarSign className="w-5 h-5 mr-2" />
              ${totalRevenue.toLocaleString()}/month
            </Badge>
            <Badge variant="secondary" className="px-6 py-3 text-lg bg-blue-900/50 text-blue-300">
              <Users className="w-5 h-5 mr-2" />
              {totalClients.toLocaleString()} clients
            </Badge>
            <Badge variant="secondary" className="px-6 py-3 text-lg bg-purple-900/50 text-purple-300">
              <Zap className="w-5 h-5 mr-2" />
              {automationLevel.toFixed(1)}% automated
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="empire" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="empire">Empire Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience Control</TabsTrigger>
            <TabsTrigger value="verticals">Vertical Management</TabsTrigger>
            <TabsTrigger value="automation">Automation Engine</TabsTrigger>
          </TabsList>

          {/* Empire Overview */}
          <TabsContent value="empire" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-300">
                    ${totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-green-200 text-sm">+23% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-400 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Active Clients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-300">
                    {totalClients.toLocaleString()}
                  </div>
                  <p className="text-blue-200 text-sm">Across 13 verticals</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-400 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Automation Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-300">
                    {automationLevel.toFixed(1)}%
                  </div>
                  <Progress value={automationLevel} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-orange-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-400 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Target: $6M/month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-300">
                    {((totalRevenue / 6000000) * 100).toFixed(1)}%
                  </div>
                  <Progress value={(totalRevenue / 6000000) * 100} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center">
                  <Rocket className="w-6 h-6 mr-2" />
                  Empire Command Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                    setVerticals(prev => prev.map(v => ({ 
                      ...v, 
                      monthlyRevenue: Math.floor(v.monthlyRevenue * 1.15),
                      status: 'scaling'
                    })));
                  }}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Boost All Verticals
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                    setVerticals(prev => prev.map(v => ({ 
                      ...v, 
                      automationLevel: Math.min(99, v.automationLevel + 2),
                      status: 'optimizing'
                    })));
                  }}>
                    <Zap className="w-4 h-4 mr-2" />
                    Optimize Automation
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => {
                    setVerticals(prev => prev.map(v => ({ 
                      ...v, 
                      activeClients: Math.floor(v.activeClients * 1.2),
                      status: 'scaling'
                    })));
                  }}>
                    <Users className="w-4 h-4 mr-2" />
                    Scale Client Base
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Control */}
          <TabsContent value="experience" className="space-y-6">
            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Settings className="w-6 h-6 mr-2" />
                  Customer Experience Mode Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Global Experience Mode</h3>
                    <p className="text-slate-300">Apply to all verticals simultaneously</p>
                  </div>
                  <div className="flex space-x-4">
                    <Button 
                      variant={globalExperience === 'option1' ? 'default' : 'outline'}
                      onClick={() => handleGlobalExperienceChange('option1')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Option 1: Industry-First + Customer Journey
                    </Button>
                    <Button 
                      variant={globalExperience === 'option3' ? 'default' : 'outline'}
                      onClick={() => handleGlobalExperienceChange('option3')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Option 3: Full Automation Empire
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-600 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Experience Mode Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-slate-700/50">
                      <CardHeader>
                        <CardTitle className="text-green-400">Option 1: Strategic Optimization</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-slate-300">
                          <li>• Industry-first navigation with mega menu</li>
                          <li>• Customer journey optimization</li>
                          <li>• Progressive disclosure of features</li>
                          <li>• ROI-focused messaging</li>
                          <li>• Professional service approach</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700/50">
                      <CardHeader>
                        <CardTitle className="text-blue-400">Option 3: Full Automation Empire</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-slate-300">
                          <li>• Complete automation showcase</li>
                          <li>• Real-time performance metrics</li>
                          <li>• Self-service onboarding</li>
                          <li>• Automated scaling demonstrations</li>
                          <li>• Minimal human intervention</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vertical Management */}
          <TabsContent value="verticals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verticals.map((vertical) => (
                <Card key={vertical.id} className="bg-slate-800/50 border-slate-600">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        {vertical.icon}
                        <span className="ml-2 text-white">{vertical.name}</span>
                      </div>
                      <Badge variant={
                        vertical.status === 'active' ? 'default' :
                        vertical.status === 'scaling' ? 'secondary' : 'outline'
                      }>
                        {vertical.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Monthly Revenue</span>
                        <span className="text-green-400 font-bold">
                          ${vertical.monthlyRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Automation</span>
                        <span className="text-blue-400 font-bold">
                          {vertical.automationLevel}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Clients</span>
                        <span className="text-purple-400 font-bold">
                          {vertical.activeClients.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Experience Mode</span>
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant={vertical.experienceMode === 'option1' ? 'default' : 'outline'}
                            onClick={() => handleVerticalExperienceToggle(vertical.id, 'option1')}
                            className="text-xs"
                          >
                            Opt 1
                          </Button>
                          <Button 
                            size="sm" 
                            variant={vertical.experienceMode === 'option3' ? 'default' : 'outline'}
                            onClick={() => handleVerticalExperienceToggle(vertical.id, 'option3')}
                            className="text-xs"
                          >
                            Opt 3
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        onClick={() => handleVerticalControl(vertical.id, 'boost')}
                        className="bg-green-600 hover:bg-green-700 text-xs"
                      >
                        Boost
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleVerticalControl(vertical.id, 'optimize')}
                        className="bg-blue-600 hover:bg-blue-700 text-xs"
                      >
                        Optimize
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleVerticalControl(vertical.id, 'scale')}
                        className="bg-purple-600 hover:bg-purple-700 text-xs"
                      >
                        Scale
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Automation Engine */}
          <TabsContent value="automation" className="space-y-6">
            <Card className="bg-slate-800/50 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center">
                  <Activity className="w-6 h-6 mr-2" />
                  Master Automation Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-yellow-400 text-lg">Emergency Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Emergency Stop All
                      </Button>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Pause Operations
                      </Button>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Resume All Systems
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-blue-400 text-lg">Performance Boost</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Turbo Mode (150%)
                      </Button>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Scale Operations
                      </Button>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Optimize All AI
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-green-400 text-lg">Revenue Acceleration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Launch Marketing Blitz
                      </Button>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">
                        Expand to New Markets
                      </Button>
                      <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                        Premium Upsell Wave
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}