import React, { useState } from 'react';
import { useAuth } from "@/contexts/auth-context";
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'wouter';
import { EnhancedGarScoreVisualization } from '@/components/gar/enhanced-gar-score-visualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  BarChart2, 
  TrendingUp, 
  User, 
  Users, 
  Medal, 
  Clock, 
  ChevronRight,
  LineChart,
  Brain,
  Dumbbell,
  Target,
  UserCheck, 
  SquareCode as Football,
  Share2,
  Download,
  Printer,
  MoreHorizontal
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function GarScoreEnhancedPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const userId = user?.id || 0;
  
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showingFullHistory, setShowingFullHistory] = useState(false);
  const [showingInsights, setShowingInsights] = useState(false);
  
  // Mock sport type - in a real app, this would come from the user's profile
  const sportType = 'basketball';
  
  // Mock coaches - in a real app, these would come from the API
  const coaches = [
    { id: 1, name: 'Coach Davis', role: 'Head Coach', lastNote: '2 days ago' },
    { id: 2, name: 'Coach Williams', role: 'Skills Coach', lastNote: '1 week ago' },
  ];
  
  // Mock insights - in a real app, these would be generated from the GAR data
  const insights = [
    { 
      id: 1, 
      category: 'Physical', 
      title: 'Speed improvement opportunity', 
      description: 'Your sprint speed has room for improvement. Consider adding plyometric exercises to your routine.',
      impact: 'high',
      timeToAddress: 'medium'
    },
    { 
      id: 2, 
      category: 'Mental', 
      title: 'Excellent focus under pressure', 
      description: 'You maintain focus exceptionally well during high-pressure situations - a key strength.',
      impact: 'high',
      timeToAddress: null,
      isStrength: true
    },
    { 
      id: 3, 
      category: 'Technical', 
      title: 'Ball handling consistency', 
      description: 'Ball handling shows inconsistency between right and left hand. Work on weak-hand drills.',
      impact: 'medium',
      timeToAddress: 'short'
    },
  ];
  
  // Handle exporting or sharing the GAR report
  const handleExport = (type: 'pdf' | 'share' | 'print') => {
    switch (type) {
      case 'pdf':
        // Code to export as PDF
        alert('PDF export functionality would go here');
        break;
      case 'share':
        // Code to share the report
        alert('Share functionality would go here');
        break;
      case 'print':
        window.print();
        break;
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto p-4 max-w-5xl">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please sign in to view your GAR scores</h2>
            <Button onClick={() => setLocation('/login')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Helmet>
        <title>GAR Score Dashboard | Go4It Sports</title>
      </Helmet>
      
      {/* Header with navigation and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Growth & Ability Rating</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your athletic development across key performance categories
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                className="cursor-pointer flex items-center text-gray-200 focus:text-white focus:bg-gray-700"
                onClick={() => handleExport('pdf')}
              >
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center text-gray-200 focus:text-white focus:bg-gray-700"
                onClick={() => handleExport('share')}
              >
                <Share2 className="mr-2 h-4 w-4" /> Share Report
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center text-gray-200 focus:text-white focus:bg-gray-700"
                onClick={() => handleExport('print')}
              >
                <Printer className="mr-2 h-4 w-4" /> Print Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button>
            <TrendingUp className="mr-2 h-4 w-4" /> Set Goals
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Athlete Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {user.name ? user.name.charAt(0) : user.username.charAt(0)}
                  </div>
                  <Badge className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none">
                    4★
                  </Badge>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{user.name || user.username}</h3>
                <p className="text-gray-400 text-sm">{sportType.charAt(0).toUpperCase() + sportType.slice(1)} • Point Guard</p>
                
                <div className="grid grid-cols-3 gap-2 w-full mt-4">
                  <div className="text-center p-2 bg-gray-800 rounded-md">
                    <p className="text-xl font-bold text-blue-400">87</p>
                    <p className="text-xs text-gray-400">Overall</p>
                  </div>
                  <div className="text-center p-2 bg-gray-800 rounded-md">
                    <p className="text-xl font-bold text-purple-400">92</p>
                    <p className="text-xs text-gray-400">Mental</p>
                  </div>
                  <div className="text-center p-2 bg-gray-800 rounded-md">
                    <p className="text-xl font-bold text-green-400">83</p>
                    <p className="text-xs text-gray-400">Physical</p>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="secondary">
                  View Full Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Coaches Card */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Coaches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {coaches.map(coach => (
                  <div key={coach.id} className="flex items-center p-2 bg-gray-800 rounded-md">
                    <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-white font-bold mr-3">
                      {coach.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{coach.name}</p>
                      <p className="text-xs text-gray-400">{coach.role} • Note {coach.lastNote}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button className="w-full mt-2" variant="outline">
                  <Users className="mr-2 h-4 w-4" /> View All Coaches
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Links */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Medal className="mr-2 h-4 w-4" /> Skill Badges & Achievements
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" /> Historical GAR Progression
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" /> GAR Improvement Plan
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <UserCheck className="mr-2 h-4 w-4" /> Compare with Teammates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs Navigation */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                <BarChart2 className="h-4 w-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="physical" className="data-[state=active]:bg-green-600">
                <Dumbbell className="h-4 w-4 mr-2" /> Physical
              </TabsTrigger>
              <TabsTrigger value="mental" className="data-[state=active]:bg-purple-600">
                <Brain className="h-4 w-4 mr-2" /> Mental
              </TabsTrigger>
              <TabsTrigger value="technical" className="data-[state=active]:bg-cyan-600">
                <Football className="h-4 w-4 mr-2" /> Technical
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-amber-600">
                <LineChart className="h-4 w-4 mr-2" /> Progress
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              {/* Enhanced GAR Visualization */}
              <EnhancedGarScoreVisualization userId={userId} sportType={sportType} />
              
              {/* Insights Section */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">GAR Insights & Opportunities</h3>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowingInsights(!showingInsights)}
                  >
                    {showingInsights ? 'Show Less' : 'Show All'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {insights.slice(0, showingInsights ? insights.length : 2).map(insight => (
                    <Card key={insight.id} className={`bg-gradient-to-br ${
                      insight.isStrength 
                        ? 'from-green-900/20 to-gray-800 border-green-800' 
                        : 'from-gray-900 to-gray-800 border-gray-700'
                    }`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge className={`${
                            insight.category === 'Physical' 
                              ? 'bg-green-600' 
                              : insight.category === 'Mental' 
                                ? 'bg-purple-600' 
                                : 'bg-cyan-600'
                          } hover:${insight.category.toLowerCase()}-500`}>
                            {insight.category}
                          </Badge>
                          {insight.isStrength && (
                            <Badge variant="outline" className="bg-transparent border-green-500 text-green-400">
                              Strength
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-md mt-2">{insight.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400 mb-3">{insight.description}</p>
                        
                        {!insight.isStrength && (
                          <div className="flex items-center justify-between text-xs">
                            <div>
                              <span className="text-gray-500">Impact: </span>
                              <span className={`font-semibold ${
                                insight.impact === 'high' 
                                  ? 'text-red-400' 
                                  : insight.impact === 'medium' 
                                    ? 'text-amber-400' 
                                    : 'text-blue-400'
                              }`}>
                                {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)}
                              </span>
                            </div>
                            
                            {insight.timeToAddress && (
                              <div>
                                <span className="text-gray-500">Time: </span>
                                <span className="font-semibold text-gray-300">
                                  {insight.timeToAddress.charAt(0).toUpperCase() + insight.timeToAddress.slice(1)} term
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Physical Tab */}
            <TabsContent value="physical" className="mt-4">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2 text-green-500" /> Physical GAR Breakdown
                  </CardTitle>
                  <CardDescription>
                    Detailed analysis of your physical capabilities and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Physical Chart would go here */}
                  <p>Physical GAR components will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Mental Tab */}
            <TabsContent value="mental" className="mt-4">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" /> Mental GAR Breakdown
                  </CardTitle>
                  <CardDescription>
                    Detailed analysis of your mental toughness, focus, and game intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Mental Chart would go here */}
                  <p>Mental GAR components will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Technical Tab */}
            <TabsContent value="technical" className="mt-4">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Football className="h-5 w-5 mr-2 text-cyan-500" /> Technical GAR Breakdown
                  </CardTitle>
                  <CardDescription>
                    Detailed analysis of your sport-specific skills and techniques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Technical Chart would go here */}
                  <p>Technical GAR components will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Progress Tab */}
            <TabsContent value="progress" className="mt-4">
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-amber-500" /> GAR Progress Timeline
                  </CardTitle>
                  <CardDescription>
                    Track your growth and development over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Progress Chart would go here */}
                  <p>Progress timeline will be displayed here</p>
                  
                  <Button 
                    className="mt-4" 
                    variant="outline"
                    onClick={() => setShowingFullHistory(!showingFullHistory)}
                  >
                    {showingFullHistory ? 'Show Less' : 'View Complete History'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}