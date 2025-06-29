import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Dumbbell,
  Brain,
  LineChart,
  Trophy,
  ArrowRight,
  ArrowUp,
  BarChart,
  Activity,
  BookOpen,
  Lightbulb,
  TrendingUp,
  CalendarDays,
  LayoutGrid
} from 'lucide-react';

/**
 * Skill Development Tracker
 * A comprehensive tool for athletes to track their skill development across physical, mental, and technical domains
 */
export default function SkillDevelopmentTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const [sport, setSport] = useState("basketball");
  const [timeframe, setTimeframe] = useState("90days");

  const sportOptions = [
    { value: "basketball", label: "Basketball" },
    { value: "football", label: "Football" },
    { value: "soccer", label: "Soccer" },
    { value: "baseball", label: "Baseball" },
    { value: "volleyball", label: "Volleyball" }
  ];

  const timeframeOptions = [
    { value: "30days", label: "Past 30 Days" },
    { value: "90days", label: "Past 90 Days" },
    { value: "6months", label: "Past 6 Months" },
    { value: "1year", label: "Past Year" }
  ];

  // Sample data for physical skills
  const physicalSkills = [
    {
      id: 1,
      name: "Vertical Jump", 
      value: 32.5, // inches
      prevValue: 30.0,
      change: 2.5,
      target: 36,
      percentile: 78,
      recentWorkouts: 8,
      lastUpdated: "2 days ago",
      details: "Current: 32.5 inches (78th percentile)"
    },
    {
      id: 2,
      name: "40-Yard Sprint", 
      value: 4.7, // seconds
      prevValue: 4.8,
      change: -0.1,
      target: 4.5,
      percentile: 65,
      recentWorkouts: 5,
      lastUpdated: "1 week ago",
      details: "Current: 4.7 seconds (65th percentile)"
    },
    {
      id: 3,
      name: "Agility Test", 
      value: 10.2, // seconds
      prevValue: 10.5,
      change: -0.3,
      target: 9.8,
      percentile: 72,
      recentWorkouts: 6,
      lastUpdated: "3 days ago",
      details: "Current: 10.2 seconds (72nd percentile)"
    },
    {
      id: 4,
      name: "Bench Press", 
      value: 185, // pounds
      prevValue: 175,
      change: 10,
      target: 200,
      percentile: 68,
      recentWorkouts: 10,
      lastUpdated: "5 days ago",
      details: "Current: 185 lbs (68th percentile)"
    }
  ];

  // Sample data for technical skills
  const technicalSkills = [
    {
      id: 1,
      name: "Ball Handling", 
      value: 82, // score
      prevValue: 75,
      change: 7,
      target: 90,
      percentile: 75,
      recentWorkouts: 12,
      lastUpdated: "1 day ago",
      details: "Current: 82/100 (75th percentile)"
    },
    {
      id: 2,
      name: "Shooting Accuracy", 
      value: 68, // score
      prevValue: 62,
      change: 6,
      target: 80,
      percentile: 65,
      recentWorkouts: 14,
      lastUpdated: "2 days ago",
      details: "Current: 68% accuracy (65th percentile)"
    },
    {
      id: 3,
      name: "Passing Precision", 
      value: 77, // score
      prevValue: 72,
      change: 5,
      target: 85,
      percentile: 70,
      recentWorkouts: 9,
      lastUpdated: "4 days ago",
      details: "Current: 77/100 (70th percentile)"
    },
    {
      id: 4,
      name: "Defensive Footwork", 
      value: 65, // score
      prevValue: 58,
      change: 7,
      target: 75,
      percentile: 60,
      recentWorkouts: 7,
      lastUpdated: "1 week ago",
      details: "Current: 65/100 (60th percentile)"
    }
  ];

  // Sample data for mental skills
  const mentalSkills = [
    {
      id: 1,
      name: "Decision Making", 
      value: 75, // score
      prevValue: 70,
      change: 5,
      target: 85,
      percentile: 68,
      recentWorkouts: 6,
      lastUpdated: "3 days ago",
      details: "Current: 75/100 (68th percentile)"
    },
    {
      id: 2,
      name: "Focus Duration", 
      value: 82, // score
      prevValue: 75,
      change: 7,
      target: 90,
      percentile: 76,
      recentWorkouts: 8,
      lastUpdated: "5 days ago",
      details: "Current: 82/100 (76th percentile)"
    },
    {
      id: 3,
      name: "Pressure Response", 
      value: 68, // score
      prevValue: 62,
      change: 6,
      target: 80,
      percentile: 65,
      recentWorkouts: 4,
      lastUpdated: "1 week ago",
      details: "Current: 68/100 (65th percentile)"
    },
    {
      id: 4,
      name: "Game Awareness", 
      value: 79, // score
      prevValue: 74,
      change: 5,
      target: 85,
      percentile: 72,
      recentWorkouts: 5,
      lastUpdated: "4 days ago",
      details: "Current: 79/100 (72nd percentile)"
    }
  ];

  // Recommended workouts based on the athlete's areas for improvement
  const recommendedWorkouts = [
    {
      id: 1,
      title: "Explosive Leg Power Circuit",
      description: "Improve your vertical jump with this explosive leg workout",
      targetSkill: "Vertical Jump",
      duration: "45 min",
      difficulty: "Advanced",
      category: "physical",
      thumbnail: "/workout-thumbnails/vertical-jump.jpg"
    },
    {
      id: 2,
      title: "Elite Ball Handling Drills",
      description: "Master tight ball control with these advanced dribbling exercises",
      targetSkill: "Ball Handling",
      duration: "30 min",
      difficulty: "Intermediate",
      category: "technical",
      thumbnail: "/workout-thumbnails/ball-handling.jpg"
    },
    {
      id: 3,
      title: "Game Decision Making Scenarios",
      description: "Improve your basketball IQ with these decision-making drills",
      targetSkill: "Decision Making",
      duration: "40 min",
      difficulty: "Intermediate",
      category: "mental",
      thumbnail: "/workout-thumbnails/decision-making.jpg"
    }
  ];

  const skillImprovementHistory = [
    { month: "Jan", physical: 72, technical: 68, mental: 65 },
    { month: "Feb", physical: 74, technical: 70, mental: 67 },
    { month: "Mar", physical: 75, technical: 73, mental: 70 },
    { month: "Apr", physical: 78, technical: 75, mental: 72 },
    { month: "May", physical: 80, technical: 78, mental: 75 },
    { month: "Jun", physical: 83, technical: 80, mental: 79 }
  ];

  // Calculate overall GAR score
  const calculateGarScore = () => {
    const physicalAvg = physicalSkills.reduce((sum, skill) => sum + skill.percentile, 0) / physicalSkills.length;
    const technicalAvg = technicalSkills.reduce((sum, skill) => sum + skill.percentile, 0) / technicalSkills.length;
    const mentalAvg = mentalSkills.reduce((sum, skill) => sum + skill.percentile, 0) / mentalSkills.length;
    
    return Math.round((physicalAvg + technicalAvg + mentalAvg) / 3);
  };

  const garScore = calculateGarScore();

  // Handle starting a workout
  const handleStartWorkout = (workoutId: number) => {
    toast({
      title: "Workout Started",
      description: "Your workout session has been started"
    });
  };

  // Identify top skill and most improved skill
  const getTopSkill = () => {
    const allSkills = [...physicalSkills, ...technicalSkills, ...mentalSkills];
    return allSkills.reduce((top, skill) => skill.percentile > top.percentile ? skill : top, allSkills[0]);
  };

  const getMostImprovedSkill = () => {
    const allSkills = [...physicalSkills, ...technicalSkills, ...mentalSkills];
    return allSkills.reduce((top, skill) => skill.change > top.change ? skill : top, allSkills[0]);
  };

  const topSkill = getTopSkill();
  const mostImprovedSkill = getMostImprovedSkill();

  return (
    <>
      <Helmet>
        <title>Skill Development Tracker | Go4It Sports</title>
      </Helmet>
      
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Skill Development Tracker</h1>
            <p className="text-muted-foreground">
              Track your progress and follow personalized development plans
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={sport} onValueChange={setSport}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent>
                {sportOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-2 text-center">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/avatars/user.jpg" alt="Profile" />
                    <AvatarFallback>AP</AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-4">Alex Patterson</CardTitle>
                  <Badge className="mt-1">Basketball • Point Guard</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* GAR Score Display */}
                <div className="bg-primary/10 rounded-lg p-4 text-center mb-4">
                  <h3 className="text-sm font-semibold mb-1">Overall GAR Score</h3>
                  <div className="text-4xl font-bold text-primary">{garScore}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {garScore > 70 ? 'Great progress! Keep it up!' : 'Good progress. Room to improve!'}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Dumbbell className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">Physical</span>
                      </div>
                      <span className="text-sm">
                        {Math.round(physicalSkills.reduce((sum, skill) => sum + skill.percentile, 0) / physicalSkills.length)}
                      </span>
                    </div>
                    <Progress 
                      value={physicalSkills.reduce((sum, skill) => sum + skill.percentile, 0) / physicalSkills.length} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="text-sm font-medium">Technical</span>
                      </div>
                      <span className="text-sm">
                        {Math.round(technicalSkills.reduce((sum, skill) => sum + skill.percentile, 0) / technicalSkills.length)}
                      </span>
                    </div>
                    <Progress 
                      value={technicalSkills.reduce((sum, skill) => sum + skill.percentile, 0) / technicalSkills.length} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm font-medium">Mental</span>
                      </div>
                      <span className="text-sm">
                        {Math.round(mentalSkills.reduce((sum, skill) => sum + skill.percentile, 0) / mentalSkills.length)}
                      </span>
                    </div>
                    <Progress 
                      value={mentalSkills.reduce((sum, skill) => sum + skill.percentile, 0) / mentalSkills.length} 
                      className="h-2"
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Trophy className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Top Skill</h4>
                      <p className="text-xs text-muted-foreground">{topSkill.name} ({topSkill.percentile}th percentile)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Most Improved</h4>
                      <p className="text-xs text-muted-foreground">{mostImprovedSkill.name} (+{mostImprovedSkill.change} improvement)</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Recent Achievements</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Badge className="h-6 w-6 rounded-full bg-primary text-white p-1 mr-2 flex-shrink-0">
                        <ArrowUp className="h-4 w-4" />
                      </Badge>
                      <span className="text-sm">Improved vertical jump by 2.5 inches</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="h-6 w-6 rounded-full bg-primary text-white p-1 mr-2 flex-shrink-0">
                        <Trophy className="h-4 w-4" />
                      </Badge>
                      <span className="text-sm">Reached the 75th percentile in ball handling</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="h-6 w-6 rounded-full bg-primary text-white p-1 mr-2 flex-shrink-0">
                        <BarChart className="h-4 w-4" />
                      </Badge>
                      <span className="text-sm">Completed 15 skill development sessions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Development Focus</CardTitle>
                <CardDescription>Areas that need the most attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Defensive Footwork</span>
                    <span className="text-sm text-muted-foreground">Priority</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pressure Response</span>
                    <span className="text-sm text-muted-foreground">High</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Shooting Accuracy</span>
                    <span className="text-sm text-muted-foreground">Medium</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View Personalized Plan
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-9 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="overview">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="physical">
                  <Dumbbell className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Physical</span>
                </TabsTrigger>
                <TabsTrigger value="technical">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Technical</span>
                </TabsTrigger>
                <TabsTrigger value="mental">
                  <Brain className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Mental</span>
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <LineChart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Next Workout</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h3 className="font-semibold">Elite Ball Handling Circuit</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4 mr-2" />
                          <span>Today, 5:00 PM</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Activity className="h-4 w-4 mr-2" />
                          <span>Focused on technical skills</span>
                        </div>
                        <Button className="w-full">
                          Start Workout
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Progress Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-primary" />
                            <span>Skill Sessions</span>
                          </div>
                          <Badge>
                            24 of 30
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
                            <span>Skills Improved</span>
                          </div>
                          <Badge variant="outline">
                            8 of 12
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                            <span>Goals Reached</span>
                          </div>
                          <Badge variant="outline">
                            3 of 5
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Brain className="h-4 w-4 mr-2 text-purple-500" />
                            <span>Mental Drills</span>
                          </div>
                          <Badge variant="outline">
                            12 of 15
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Coach Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-primary/5 rounded-lg p-3">
                          <p className="text-sm italic">
                            "Alex has shown significant improvement in ball handling. Focus on defensive footwork 
                            and shooting under pressure should be the priority for the next few weeks."
                          </p>
                          <div className="text-xs text-muted-foreground mt-2 text-right">
                            - Coach Thompson, 3 days ago
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                          <p className="text-sm">
                            Complete the recommended defensive footwork drills at least 3 times a week
                          </p>
                        </div>
                        
                        <div className="flex items-start">
                          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                          <p className="text-sm">
                            Practice shooting with defensive pressure to improve game situations
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Workouts</CardTitle>
                    <CardDescription>
                      Personalized recommendations based on your development focus
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendedWorkouts.map((workout) => (
                        <Card key={workout.id}>
                          <div className="relative h-32 rounded-t-lg bg-gray-200 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40">
                              <Badge className={
                                workout.category === 'physical' ? 'bg-blue-500' : 
                                workout.category === 'technical' ? 'bg-purple-500' : 'bg-green-500'
                              }>
                                {workout.category.charAt(0).toUpperCase() + workout.category.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{workout.title}</CardTitle>
                            <CardDescription className="text-xs">
                              Target: {workout.targetSkill}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm text-muted-foreground">
                              {workout.description}
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs">
                              <span>Duration: {workout.duration}</span>
                              <span>Difficulty: {workout.difficulty}</span>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              className="w-full" 
                              onClick={() => handleStartWorkout(workout.id)}
                            >
                              Start Workout
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Improvement History</CardTitle>
                    <CardDescription>Progress across all skill categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {/* This is a placeholder for a chart that would be rendered with a proper library like recharts */}
                      <div className="h-full flex items-end justify-between px-2">
                        {skillImprovementHistory.map((month, index) => (
                          <div key={month.month} className="flex flex-col items-center">
                            <div className="relative flex gap-1">
                              <div 
                                className="w-5 bg-blue-500 rounded-t-md" 
                                style={{ height: `${month.physical * 2}px` }}
                              ></div>
                              <div 
                                className="w-5 bg-purple-500 rounded-t-md" 
                                style={{ height: `${month.technical * 2}px` }}
                              ></div>
                              <div 
                                className="w-5 bg-green-500 rounded-t-md" 
                                style={{ height: `${month.mental * 2}px` }}
                              ></div>
                            </div>
                            <span className="mt-2 text-xs text-muted-foreground">{month.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
                        <span className="text-sm">Physical</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></div>
                        <span className="text-sm">Technical</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
                        <span className="text-sm">Mental</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Physical Skills Tab */}
              <TabsContent value="physical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Dumbbell className="h-5 w-5 mr-2 text-blue-500" />
                      Physical Skill Development
                    </CardTitle>
                    <CardDescription>
                      Track and improve your physical athletic abilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {physicalSkills.map((skill) => (
                        <div key={skill.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">{skill.name}</h3>
                              <p className="text-sm text-muted-foreground">{skill.details}</p>
                              
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                  <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>Updated {skill.lastUpdated}</span>
                                </div>
                                <div className="flex items-center">
                                  <Activity className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{skill.recentWorkouts} recent workouts</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col items-center">
                                <div className="text-2xl font-bold">
                                  {skill.value}
                                  <span className="text-sm font-normal ml-1">
                                    {skill.name.includes("Jump") || skill.name.includes("Press") ? "" : "s"}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">Current</span>
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <div className={`flex items-center text-lg font-semibold ${skill.change > 0 ? 'text-emerald-500' : skill.change < 0 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                                  {skill.change > 0 ? '+' : ''}{skill.change}
                                  <ArrowUp className={`h-4 w-4 ml-1 ${skill.change >= 0 ? '' : 'rotate-180'}`} />
                                </div>
                                <span className="text-xs text-muted-foreground">Change</span>
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <div className="text-lg font-semibold">
                                  {skill.target}
                                </div>
                                <span className="text-xs text-muted-foreground">Target</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Progress to target</span>
                              <span className="text-sm text-muted-foreground">
                                {skill.name.includes("Sprint") || skill.name.includes("Agility") 
                                  ? Math.round(100 - ((skill.value - skill.target) / (skill.prevValue - skill.target) * 100))
                                  : Math.round((skill.value / skill.target) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-blue-500 h-full rounded-full" 
                                style={{ 
                                  width: `${skill.name.includes("Sprint") || skill.name.includes("Agility") 
                                    ? Math.round(100 - ((skill.value - skill.target) / (skill.prevValue - skill.target) * 100))
                                    : Math.round((skill.value / skill.target) * 100)}%` 
                                }} 
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" className="mr-2">View History</Button>
                            <Button size="sm">Update Measurement</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Technical Skills Tab */}
              <TabsContent value="technical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                      Technical Skill Development
                    </CardTitle>
                    <CardDescription>
                      Refine the specific skills needed for your sport
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {technicalSkills.map((skill) => (
                        <div key={skill.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">{skill.name}</h3>
                              <p className="text-sm text-muted-foreground">{skill.details}</p>
                              
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                  <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>Updated {skill.lastUpdated}</span>
                                </div>
                                <div className="flex items-center">
                                  <Activity className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{skill.recentWorkouts} recent workouts</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col items-center">
                                <div className="text-2xl font-bold">
                                  {skill.value}
                                </div>
                                <span className="text-xs text-muted-foreground">Current</span>
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <div className="flex items-center text-lg font-semibold text-emerald-500">
                                  +{skill.change}
                                  <ArrowUp className="h-4 w-4 ml-1" />
                                </div>
                                <span className="text-xs text-muted-foreground">Change</span>
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <div className="text-lg font-semibold">
                                  {skill.target}
                                </div>
                                <span className="text-xs text-muted-foreground">Target</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Progress to target</span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round((skill.value / skill.target) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-purple-500 h-full rounded-full" 
                                style={{ width: `${Math.round((skill.value / skill.target) * 100)}%` }} 
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" className="mr-2">View Drills</Button>
                            <Button size="sm">Update Skill</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Mental Skills Tab */}
              <TabsContent value="mental" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-green-500" />
                      Mental Skill Development
                    </CardTitle>
                    <CardDescription>
                      Build the mental aspects of your game
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {mentalSkills.map((skill) => (
                        <div key={skill.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">{skill.name}</h3>
                              <p className="text-sm text-muted-foreground">{skill.details}</p>
                              
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                  <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>Updated {skill.lastUpdated}</span>
                                </div>
                                <div className="flex items-center">
                                  <Activity className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{skill.recentWorkouts} recent workouts</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col items-center">
                                <div className="text-2xl font-bold">
                                  {skill.value}
                                </div>
                                <span className="text-xs text-muted-foreground">Current</span>
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <div className="flex items-center text-lg font-semibold text-emerald-500">
                                  +{skill.change}
                                  <ArrowUp className="h-4 w-4 ml-1" />
                                </div>
                                <span className="text-xs text-muted-foreground">Change</span>
                              </div>
                              
                              <div className="flex flex-col items-center">
                                <div className="text-lg font-semibold">
                                  {skill.target}
                                </div>
                                <span className="text-xs text-muted-foreground">Target</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Progress to target</span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round((skill.value / skill.target) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-green-500 h-full rounded-full" 
                                style={{ width: `${Math.round((skill.value / skill.target) * 100)}%` }} 
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" className="mr-2">Mental Exercises</Button>
                            <Button size="sm">Update Assessment</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LineChart className="h-5 w-5 mr-2" />
                      Performance Analytics
                    </CardTitle>
                    <CardDescription>
                      In-depth analysis of your skill development journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-semibold mb-4">Skill Development Over Time</h3>
                        <div className="h-[300px]">
                          {/* Placeholder for a line chart */}
                          <div className="h-full flex items-end justify-between px-2">
                            {skillImprovementHistory.map((month, index) => (
                              <div key={month.month} className="flex flex-col items-center">
                                <div className="relative flex gap-1">
                                  <div 
                                    className="w-5 bg-blue-500 rounded-t-md" 
                                    style={{ height: `${month.physical * 2}px` }}
                                  ></div>
                                  <div 
                                    className="w-5 bg-purple-500 rounded-t-md" 
                                    style={{ height: `${month.technical * 2}px` }}
                                  ></div>
                                  <div 
                                    className="w-5 bg-green-500 rounded-t-md" 
                                    style={{ height: `${month.mental * 2}px` }}
                                  ></div>
                                </div>
                                <span className="mt-2 text-xs text-muted-foreground">{month.month}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
                            <span className="text-sm">Physical</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></div>
                            <span className="text-sm">Technical</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
                            <span className="text-sm">Mental</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg border p-4">
                          <h3 className="text-lg font-semibold mb-4">Skill Distribution</h3>
                          <div className="h-[200px] flex items-center justify-center">
                            {/* Placeholder for a pie/radar chart */}
                            <div className="relative h-40 w-40 rounded-full border-8 border-gray-200 flex items-center justify-center">
                              <div className="absolute top-0 left-0 h-40 w-40 rounded-full border-t-8 border-l-8 border-blue-500 border-r-8 border-purple-500 border-b-8 border-green-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
                              <div className="text-lg font-bold">{garScore}</div>
                            </div>
                          </div>
                          <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
                              <span className="text-sm">Physical</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></div>
                              <span className="text-sm">Technical</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
                              <span className="text-sm">Mental</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="rounded-lg border p-4">
                          <h3 className="text-lg font-semibold mb-4">Workout Effectiveness</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Ball Handling Drills</span>
                                <span className="font-medium">Very Effective</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '90%' }}></div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Vertical Jump Training</span>
                                <span className="font-medium">Effective</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }}></div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Defensive Footwork</span>
                                <span className="font-medium">Moderate</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full">
                                <div className="bg-yellow-500 h-full rounded-full" style={{ width: '50%' }}></div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Pressure Response</span>
                                <span className="font-medium">Needs Focus</span>
                              </div>
                              <div className="w-full bg-gray-200 h-2 rounded-full">
                                <div className="bg-red-500 h-full rounded-full" style={{ width: '35%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-semibold mb-4">Comparison to Peers</h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="w-20 text-sm">Overall</div>
                            <div className="flex-1 ml-4">
                              <div className="w-full bg-gray-200 h-3 rounded-full relative">
                                <div className="absolute inset-y-0 bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                                <div className="absolute inset-y-0 left-1/2 w-0.5 h-full bg-gray-400"></div>
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">Average</div>
                                <div className="absolute -bottom-6 left-[75%] transform -translate-x-1/2 text-xs font-medium">You</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="w-20 text-sm">Physical</div>
                            <div className="flex-1 ml-4">
                              <div className="w-full bg-gray-200 h-3 rounded-full relative">
                                <div className="absolute inset-y-0 bg-blue-500 h-full rounded-full" style={{ width: '80%' }}></div>
                                <div className="absolute inset-y-0 left-1/2 w-0.5 h-full bg-gray-400"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="w-20 text-sm">Technical</div>
                            <div className="flex-1 ml-4">
                              <div className="w-full bg-gray-200 h-3 rounded-full relative">
                                <div className="absolute inset-y-0 bg-purple-500 h-full rounded-full" style={{ width: '70%' }}></div>
                                <div className="absolute inset-y-0 left-1/2 w-0.5 h-full bg-gray-400"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="w-20 text-sm">Mental</div>
                            <div className="flex-1 ml-4">
                              <div className="w-full bg-gray-200 h-3 rounded-full relative">
                                <div className="absolute inset-y-0 bg-green-500 h-full rounded-full" style={{ width: '68%' }}></div>
                                <div className="absolute inset-y-0 left-1/2 w-0.5 h-full bg-gray-400"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center mt-6">
                            <p className="text-sm text-muted-foreground">
                              Based on 247 athletes in your age group and sport
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <Button className="mr-2">
                          Export Report
                        </Button>
                        <Button variant="outline">
                          Share with Coach
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}