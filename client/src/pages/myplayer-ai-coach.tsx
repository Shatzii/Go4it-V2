import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft, 
  Send, 
  Brain, 
  Dumbbell, 
  Video, 
  Calendar, 
  Medal, 
  ClipboardList,
  Sparkles,
  BarChart3,
  Zap,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  FileText,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  XCircle,
  Clock,
  LayoutGrid,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useMeasurement } from "@/contexts/measurement-context";
import { convertWeight, convertHeight } from "@/lib/unit-conversion";

// Types
interface CoachMessage {
  id: string;
  role: "user" | "coach";
  content: string;
  timestamp: Date;
  type: "text" | "workout" | "analysis" | "assessment" | "recommendation";
  metadata?: {
    title?: string;
    items?: string[];
    imageUrl?: string;
    videoUrl?: string;
    score?: number;
    actionUrl?: string;
    actionLabel?: string;
  };
}

interface CoachState {
  personality: string;
  specialization: string;
  activeTab: string;
  knowledgeAreas: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced";
  lastInteraction: Date | null;
}

interface AssessmentResult {
  id: string;
  title: string;
  date: Date;
  overall: number;
  categories: {
    name: string;
    score: number;
    feedback: string;
  }[];
  recommendations: string[];
}

interface TrainingPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  target: string;
  createdAt: Date;
  workouts: {
    day: number;
    title: string;
    focus: string;
    completed: boolean;
    imageUrl?: string;
  }[];
}

export default function MyPlayerAICoach() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { system, toggleSystem } = useMeasurement();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<TrainingPlan | null>(null);
  
  // Fetch player data
  const { data: playerProfile, isLoading: isPlayerLoading } = useQuery({
    queryKey: ['/api/player/profile'],
    enabled: !!user,
  });
  
  // Fetch coach data
  const { data: coachState, isLoading: isCoachLoading } = useQuery({
    queryKey: ['/api/player/ai-coach/state'],
    enabled: !!user,
  });
  
  // Fetch conversation history
  const { data: messageHistory, isLoading: isMessagesLoading } = useQuery({
    queryKey: ['/api/player/ai-coach/messages'],
    enabled: !!user,
  });
  
  // Fetch assessments
  const { data: assessments, isLoading: isAssessmentsLoading } = useQuery({
    queryKey: ['/api/player/assessments'],
    enabled: !!user,
  });
  
  // Fetch training plans
  const { data: trainingPlans, isLoading: isPlansLoading } = useQuery({
    queryKey: ['/api/player/training-plans'],
    enabled: !!user,
  });
  
  const isLoading = isPlayerLoading || isCoachLoading || isMessagesLoading || isAssessmentsLoading || isPlansLoading;
  
  // Default data if API endpoints not fully implemented yet
  const defaultCoachState: CoachState = {
    personality: "Supportive and motivational",
    specialization: "Performance Development",
    activeTab: "chat",
    knowledgeAreas: ["Technique Analysis", "Training Programs", "Recovery", "Nutrition", "Sports Psychology"],
    experienceLevel: "intermediate",
    lastInteraction: new Date(),
  };
  
  const defaultMessages: CoachMessage[] = [
    {
      id: "1",
      role: "coach",
      content: "Hey there! I'm your AI Coach. I'm here to help you improve your performance, analyze your technique, and create personalized training plans.",
      timestamp: new Date(Date.now() - 86400000),
      type: "text"
    },
    {
      id: "2", 
      role: "coach",
      content: "What would you like to work on today?",
      timestamp: new Date(Date.now() - 86400000),
      type: "text"
    },
    {
      id: "3",
      role: "user",
      content: "Can you help me with my workout plan?",
      timestamp: new Date(Date.now() - 85400000),
      type: "text"
    },
    {
      id: "4",
      role: "coach",
      content: "Absolutely! I've analyzed your recent activity and created a customized workout plan focused on improving your explosiveness and speed.",
      timestamp: new Date(Date.now() - 85300000),
      type: "workout",
      metadata: {
        title: "Speed & Explosiveness Program",
        items: [
          "Plyometric exercises 3x per week",
          "Sprint intervals on Tuesdays and Fridays",
          "Core stability work daily",
          "Rest and recovery on Sundays"
        ],
        actionUrl: "/weight-room",
        actionLabel: "View Full Workout"
      }
    }
  ];
  
  const defaultAssessments: AssessmentResult[] = [
    {
      id: "1",
      title: "Initial Athletic Assessment",
      date: new Date(Date.now() - 604800000),
      overall: 72,
      categories: [
        { name: "Speed", score: 78, feedback: "Good acceleration, work on top-end speed" },
        { name: "Strength", score: 65, feedback: "Develop core and lower body strength" },
        { name: "Agility", score: 82, feedback: "Excellent lateral movement" },
        { name: "Endurance", score: 68, feedback: "Increase stamina for late-game performance" }
      ],
      recommendations: [
        "Focus on explosive power training",
        "Add interval training 2x per week",
        "Incorporate more unilateral exercises",
        "Improve nutrition around training sessions"
      ]
    }
  ];
  
  const defaultTrainingPlans: TrainingPlan[] = [
    {
      id: "1",
      title: "Pre-Season Conditioning",
      description: "A comprehensive 4-week plan to prepare for the upcoming season",
      duration: "4 weeks",
      target: "Overall conditioning and sport-specific skills",
      createdAt: new Date(Date.now() - 1209600000),
      workouts: [
        { day: 1, title: "Explosive Power", focus: "Lower body", completed: true, imageUrl: "/assets/workout-1.jpg" },
        { day: 2, title: "Agility Drills", focus: "Footwork and coordination", completed: true, imageUrl: "/assets/workout-2.jpg" },
        { day: 3, title: "Recovery", focus: "Mobility and flexibility", completed: true, imageUrl: "/assets/workout-3.jpg" },
        { day: 4, title: "Strength Training", focus: "Full body", completed: false, imageUrl: "/assets/workout-4.jpg" },
        { day: 5, title: "Sport Skills", focus: "Technique and fundamentals", completed: false, imageUrl: "/assets/workout-5.jpg" }
      ]
    }
  ];
  
  // Use data from API if available, otherwise use defaults
  const activeCoachState = coachState || defaultCoachState;
  const activeMessages = messageHistory || defaultMessages;
  const activeAssessments = assessments || defaultAssessments;
  const activeTrainingPlans = trainingPlans || defaultTrainingPlans;
  
  // Set the first training plan as current
  useEffect(() => {
    if (activeTrainingPlans && activeTrainingPlans.length > 0 && !currentPlan) {
      setCurrentPlan(activeTrainingPlans[0]);
    }
  }, [activeTrainingPlans, currentPlan]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages, isTyping]);
  
  // Send message to AI coach
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest('POST', '/api/player/ai-coach/messages', { content: message });
    },
    onMutate: (newMessage) => {
      // Optimistic update
      const newMsg: CoachMessage = {
        id: Date.now().toString(),
        role: "user",
        content: newMessage,
        timestamp: new Date(),
        type: "text"
      };
      
      queryClient.setQueryData(['/api/player/ai-coach/messages'], (old: CoachMessage[] | undefined) => {
        return [...(old || []), newMsg];
      });
      
      setUserInput("");
      setIsTyping(true);
      
      // Simulate AI typing for demo purposes
      setTimeout(() => {
        const responses = [
          {
            content: "Based on your recent workouts, I'd recommend focusing on recovery today. Your training intensity has been high, and allowing proper recovery will help prevent injuries and promote muscle growth.",
            type: "text"
          },
          {
            content: "I've analyzed your shooting technique from your last uploaded video. Your form is looking much improved!",
            type: "analysis",
            metadata: {
              title: "Shooting Technique Analysis",
              score: 82,
              items: [
                "Great elbow alignment at 85° angle",
                "Improved follow-through motion",
                "Consider adjusting your foot positioning"
              ]
            }
          },
          {
            content: "I've created a new workout plan based on your goals to increase vertical jump.",
            type: "workout",
            metadata: {
              title: "Vertical Jump Improvement Plan",
              items: [
                "Plyometric exercises 3x per week",
                "Weighted squat variations",
                "Core stability exercises",
                "Mobility work for ankle flexibility"
              ],
              actionUrl: "/weight-room",
              actionLabel: "Start Workout"
            }
          }
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const aiResponse: CoachMessage = {
          id: (Date.now() + 1).toString(),
          role: "coach",
          content: randomResponse.content,
          timestamp: new Date(),
          type: randomResponse.type as any,
          metadata: randomResponse.metadata
        };
        
        queryClient.setQueryData(['/api/player/ai-coach/messages'], (old: CoachMessage[] | undefined) => {
          return [...(old || []), aiResponse];
        });
        
        setIsTyping(false);
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      });
      setIsTyping(false);
    }
  });
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === "") return;
    
    sendMessageMutation.mutate(userInput);
  };
  
  // Rate feedback
  const rateFeedbackMutation = useMutation({
    mutationFn: async ({ messageId, isHelpful }: { messageId: string, isHelpful: boolean }) => {
      return await apiRequest('POST', `/api/player/ai-coach/messages/${messageId}/rate`, { isHelpful });
    },
    onSuccess: () => {
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback",
      });
    }
  });
  
  // Format timestamp for messages
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    if (now.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
             ' at ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  // Loading states
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-16 w-full rounded-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="h-[500px]">
                <div className="space-y-4">
                  <Skeleton className="h-20 w-3/4" />
                  <Skeleton className="h-20 w-3/4 ml-auto" />
                  <Skeleton className="h-20 w-3/4" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Coach</h1>
          <p className="text-muted-foreground">Your personalized training assistant</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/myplayer-xp")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to MyPlayer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                Coach Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/assets/ai-coach.png" alt="AI Coach" />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      <Brain className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    className="absolute -inset-1 rounded-full opacity-75"
                    initial={{ boxShadow: "0 0 0px 0px rgba(var(--primary), 0)" }}
                    animate={{ boxShadow: "0 0 15px 5px rgba(var(--primary), 0.3)" }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
                <h3 className="font-semibold text-lg mt-3">Coach AI</h3>
                <p className="text-sm text-muted-foreground">{activeCoachState.personality}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {activeCoachState.knowledgeAreas.map((area, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <Button className="w-full" variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Coach Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <ClipboardList className="mr-2 h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="justify-start w-full">
                <Video className="mr-2 h-4 w-4" />
                Request Video Analysis
              </Button>
              <Button variant="ghost" className="justify-start w-full">
                <Dumbbell className="mr-2 h-4 w-4" />
                Generate Workout Plan
              </Button>
              <Button variant="ghost" className="justify-start w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                Track Progress
              </Button>
              <Button variant="ghost" className="justify-start w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="chat" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Coach Chat
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center">
                <Dumbbell className="h-4 w-4 mr-2" />
                Training Plans
              </TabsTrigger>
              <TabsTrigger value="assessments" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Assessments
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Knowledge
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col h-full m-0">
              <Card className="flex-1 flex flex-col h-full">
                <CardContent className="flex-1 pt-6 pb-0 overflow-hidden">
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {activeMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "coach" ? "justify-start" : "justify-end"}`}
                        >
                          <div className={`flex flex-col max-w-[80%] space-y-2 ${message.role === "coach" ? "" : "items-end"}`}>
                            <div className="flex items-center space-x-2">
                              {message.role === "coach" && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="/assets/ai-coach.png" alt="AI Coach" />
                                  <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                              )}
                              <div className={`text-xs text-muted-foreground ${message.role === "coach" ? "" : "text-right"}`}>
                                {message.role === "coach" ? "AI Coach" : "You"} • {formatTimestamp(new Date(message.timestamp))}
                              </div>
                              {message.role === "user" && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user?.profileImage} alt={user?.name} />
                                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                            
                            {/* Standard text message */}
                            {message.type === "text" && (
                              <div className={`rounded-lg px-4 py-2 ${
                                message.role === "coach" 
                                  ? "bg-secondary text-secondary-foreground" 
                                  : "bg-primary text-primary-foreground"
                              }`}>
                                <p>{message.content}</p>
                              </div>
                            )}
                            
                            {/* Workout recommendation */}
                            {message.type === "workout" && (
                              <Card className="border-primary shadow-sm">
                                <CardHeader className="py-3 px-4">
                                  <div className="flex items-center">
                                    <Dumbbell className="h-4 w-4 mr-2 text-primary" />
                                    <CardTitle className="text-base">{message.metadata?.title || "Workout Plan"}</CardTitle>
                                  </div>
                                  <CardDescription>{message.content}</CardDescription>
                                </CardHeader>
                                <CardContent className="py-0 px-4">
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    {message.metadata?.items?.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                </CardContent>
                                <CardFooter className="py-3 px-4">
                                  {message.metadata?.actionUrl && (
                                    <Button size="sm" asChild>
                                      <Link to={message.metadata.actionUrl}>
                                        {message.metadata.actionLabel || "View Details"}
                                      </Link>
                                    </Button>
                                  )}
                                </CardFooter>
                              </Card>
                            )}
                            
                            {/* Video/technique analysis */}
                            {message.type === "analysis" && (
                              <Card className="border-cyan-500 shadow-sm">
                                <CardHeader className="py-3 px-4">
                                  <div className="flex items-center">
                                    <Video className="h-4 w-4 mr-2 text-cyan-500" />
                                    <CardTitle className="text-base">{message.metadata?.title || "Technique Analysis"}</CardTitle>
                                  </div>
                                  <CardDescription>{message.content}</CardDescription>
                                </CardHeader>
                                <CardContent className="py-0 px-4">
                                  {message.metadata?.score !== undefined && (
                                    <div className="mb-2">
                                      <div className="flex justify-between mb-1 text-sm">
                                        <span>Overall Score</span>
                                        <span className="font-medium">{message.metadata.score}/100</span>
                                      </div>
                                      <Progress value={message.metadata.score} className="h-2" />
                                    </div>
                                  )}
                                  {message.metadata?.items && (
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      {message.metadata.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                      ))}
                                    </ul>
                                  )}
                                </CardContent>
                                <CardFooter className="py-3 px-4">
                                  <Button size="sm" variant="outline">View Full Analysis</Button>
                                </CardFooter>
                              </Card>
                            )}
                            
                            {/* Assessment results */}
                            {message.type === "assessment" && (
                              <Card className="border-amber-500 shadow-sm">
                                <CardHeader className="py-3 px-4">
                                  <div className="flex items-center">
                                    <BarChart3 className="h-4 w-4 mr-2 text-amber-500" />
                                    <CardTitle className="text-base">{message.metadata?.title || "Assessment Results"}</CardTitle>
                                  </div>
                                  <CardDescription>{message.content}</CardDescription>
                                </CardHeader>
                                <CardContent className="py-0 px-4">
                                  {message.metadata?.items && (
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      {message.metadata.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                      ))}
                                    </ul>
                                  )}
                                </CardContent>
                                <CardFooter className="py-3 px-4">
                                  <Button size="sm" variant="outline">View Details</Button>
                                </CardFooter>
                              </Card>
                            )}
                            
                            {/* Sport recommendation */}
                            {message.type === "recommendation" && (
                              <Card className="border-green-500 shadow-sm">
                                <CardHeader className="py-3 px-4">
                                  <div className="flex items-center">
                                    <Lightbulb className="h-4 w-4 mr-2 text-green-500" />
                                    <CardTitle className="text-base">{message.metadata?.title || "Recommendation"}</CardTitle>
                                  </div>
                                  <CardDescription>{message.content}</CardDescription>
                                </CardHeader>
                                <CardContent className="py-0 px-4">
                                  {message.metadata?.items && (
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                      {message.metadata.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                      ))}
                                    </ul>
                                  )}
                                </CardContent>
                                <CardFooter className="py-3 px-4">
                                  {message.metadata?.actionUrl && (
                                    <Button size="sm" asChild>
                                      <Link to={message.metadata.actionUrl}>
                                        {message.metadata.actionLabel || "Learn More"}
                                      </Link>
                                    </Button>
                                  )}
                                </CardFooter>
                              </Card>
                            )}
                            
                            {/* Only show feedback options for coach messages */}
                            {message.role === "coach" && message.type !== "text" && (
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground ml-12">
                                <button 
                                  className="hover:text-primary flex items-center"
                                  onClick={() => rateFeedbackMutation.mutate({ messageId: message.id, isHelpful: true })}
                                >
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  Helpful
                                </button>
                                <button 
                                  className="hover:text-destructive flex items-center"
                                  onClick={() => rateFeedbackMutation.mutate({ messageId: message.id, isHelpful: false })}
                                >
                                  <ThumbsDown className="h-3 w-3 mr-1" />
                                  Not helpful
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-start space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/assets/ai-coach.png" alt="AI Coach" />
                              <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg px-4 py-2 bg-secondary text-secondary-foreground">
                              <div className="flex items-center space-x-1">
                                <motion.div
                                  className="h-2 w-2 bg-current rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 1, repeatType: "loop" }}
                                />
                                <motion.div
                                  className="h-2 w-2 bg-current rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 1, repeatType: "loop", delay: 0.2 }}
                                />
                                <motion.div
                                  className="h-2 w-2 bg-current rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 1, repeatType: "loop", delay: 0.4 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Invisible element to scroll to */}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="mt-auto pt-6">
                  <form onSubmit={handleSendMessage} className="w-full">
                    <div className="flex items-center space-x-2">
                      <Textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask me anything about your training..."
                        className="min-h-10 flex-1"
                      />
                      <Button type="submit" size="icon" disabled={isTyping || !userInput.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="training" className="m-0">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Training Plans</CardTitle>
                    <Button variant="outline" size="sm">
                      <Zap className="mr-2 h-4 w-4" />
                      Generate New Plan
                    </Button>
                  </div>
                  <CardDescription>Your personalized training schedules</CardDescription>
                </CardHeader>
                <CardContent>
                  {activeTrainingPlans.length === 0 ? (
                    <div className="py-8 text-center">
                      <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">No Training Plans Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Generate your first training plan to get started
                      </p>
                      <Button>
                        <Zap className="mr-2 h-4 w-4" />
                        Create Training Plan
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex overflow-x-auto pb-2 gap-4">
                        {activeTrainingPlans.map((plan) => (
                          <Card 
                            key={plan.id} 
                            className={`border flex-shrink-0 w-64 ${plan === currentPlan ? "border-primary" : ""}`}
                            onClick={() => setCurrentPlan(plan)}
                          >
                            <CardHeader className="p-4">
                              <CardTitle className="text-base truncate">{plan.title}</CardTitle>
                              <CardDescription className="text-xs">{plan.duration} • {plan.target}</CardDescription>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                              <div className="text-xs text-muted-foreground">
                                {new Date(plan.createdAt).toLocaleDateString()}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {plan.workouts.filter(w => w.completed).length}/{plan.workouts.length}
                              </Badge>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                      
                      {currentPlan && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">{currentPlan.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{currentPlan.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentPlan.workouts.map((workout, idx) => (
                              <Card key={idx} className={`overflow-hidden ${workout.completed ? "border-green-500" : ""}`}>
                                <div className="aspect-video bg-muted relative">
                                  {workout.imageUrl ? (
                                    <img 
                                      src={workout.imageUrl} 
                                      alt={workout.title} 
                                      className="object-cover w-full h-full" 
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full">
                                      <Dumbbell className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  )}
                                  <Badge 
                                    className={`absolute top-2 right-2 ${workout.completed ? "bg-green-500" : ""}`}
                                  >
                                    Day {workout.day}
                                  </Badge>
                                </div>
                                <CardHeader className="py-3 px-4">
                                  <CardTitle className="text-base flex items-center">
                                    {workout.completed && (
                                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                    )}
                                    {workout.title}
                                  </CardTitle>
                                  <CardDescription>Focus: {workout.focus}</CardDescription>
                                </CardHeader>
                                <CardFooter className="py-3 px-4 flex justify-between">
                                  {workout.completed ? (
                                    <Button variant="outline" size="sm">View Details</Button>
                                  ) : (
                                    <Button size="sm">Start Workout</Button>
                                  )}
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="assessments" className="m-0">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Athletic Assessments</CardTitle>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      New Assessment
                    </Button>
                  </div>
                  <CardDescription>Track your performance metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {activeAssessments.length === 0 ? (
                    <div className="py-8 text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">No Assessments Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete your first assessment to track your progress
                      </p>
                      <Button>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Start Assessment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {activeAssessments.map((assessment) => (
                        <Card key={assessment.id} className="border">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{assessment.title}</CardTitle>
                                <CardDescription>
                                  {new Date(assessment.date).toLocaleDateString()} • Overall Score: {assessment.overall}/100
                                </CardDescription>
                              </div>
                              <Badge variant="outline" className="px-3 py-1 flex items-center">
                                <Medal className={`h-4 w-4 mr-1 ${assessment.overall >= 80 ? "text-amber-500" : assessment.overall >= 60 ? "text-emerald-500" : "text-blue-500"}`} />
                                {assessment.overall >= 80 ? "Elite" : assessment.overall >= 60 ? "Advanced" : "Developing"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-medium mb-3 flex items-center">
                                  <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                                  Performance Metrics
                                </h4>
                                <div className="space-y-3">
                                  {assessment.categories.map((category, i) => (
                                    <div key={i}>
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm">{category.name}</span>
                                        <span className="text-sm font-medium">{category.score}/100</span>
                                      </div>
                                      <Progress value={category.score} className="h-2" />
                                      <p className="text-xs text-muted-foreground mt-1">{category.feedback}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-3 flex items-center">
                                  <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                                  Recommendations
                                </h4>
                                <ul className="space-y-2">
                                  {assessment.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start space-x-2 text-sm">
                                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline">View Full Report</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="library" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Library</CardTitle>
                  <CardDescription>Learn about performance, nutrition, and recovery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Recovery Techniques</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Learn about the latest recovery methods to optimize your performance and prevent injuries.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm" className="w-full">View Articles</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Nutrition Fundamentals</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Discover the right fuel for your body before, during, and after training sessions.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm" className="w-full">View Articles</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Mental Training</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Techniques to improve focus, confidence, and performance under pressure.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm" className="w-full">View Articles</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Injury Prevention</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Strategies and exercises to reduce your risk of common sports injuries.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm" className="w-full">View Articles</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Athletic Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Advanced techniques to take your performance to the next level.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm" className="w-full">View Articles</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Sport-Specific Training</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">
                          Tailored advice for your primary and recommended sports.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm" className="w-full">View Articles</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}