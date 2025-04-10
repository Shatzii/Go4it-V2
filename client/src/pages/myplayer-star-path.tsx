import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  Trophy,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BarChart3,
  Flame,
  Sparkles,
  Award,
  Zap,
  Medal,
  Dumbbell,
  Brain,
  UserCheck,
  Lightbulb,
  Hourglass,
  Calendar,
  Clock,
  Video,
  Users,
  ListChecks,
  BadgeCheck
} from "lucide-react";

// Types for star path
interface StarPathNode {
  id: number;
  title: string;
  description: string;
  xpRequired: number;
  starLevel: number;
  isCompleted: boolean;
  isActive: boolean;
  achievements: string[];
  iconComponent: JSX.Element;
  unlocks: string[];
  position: { x: number; y: number };
}

interface StarLevel {
  level: number;
  title: string;
  description: string;
  minXp: number;
  color: string;
  borderColor: string;
  shadowColor: string;
  achievementTypes: string[];
}

export default function MyPlayerStarPath() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedNode, setSelectedNode] = useState<StarPathNode | null>(null);
  const [animateStar, setAnimateStar] = useState(false);
  
  // Fetch player progress data
  const { data: progress, isLoading: isProgressLoading } = useQuery({
    queryKey: ['/api/player/progress'],
    enabled: !!user,
  });
  
  // Fetch player star path
  const { data: starPath, isLoading: isStarPathLoading } = useQuery({
    queryKey: ['/api/player/star-path', user?.id],
    enabled: !!user,
    // If star path doesn't exist yet, create one
    onError: async (error) => {
      if (user && error.message.includes('not found')) {
        // Create star path for this user
        try {
          const data = await apiRequest('/api/player/star-path', {
            method: 'POST',
            data: { 
              userId: user.id,
              sportType: user.primarySport || 'basketball',
              position: user.position || null
            }
          });
          
          // Invalidate the star path query to trigger refetch
          queryClient.invalidateQueries({queryKey: ['/api/player/star-path', user.id]});
          
          toast({
            title: "Star Path Created",
            description: "Your athletic Star Path has been created! Start your journey to becoming a five-star athlete.",
          });
        } catch (err) {
          console.error('Failed to create star path:', err);
          toast({
            title: "Error",
            description: "Failed to create your Star Path. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  });
  
  // Fetch player badges
  const { data: badges, isLoading: isBadgesLoading } = useQuery({
    queryKey: ['/api/player/badges'],
    enabled: !!user,
  });
  
  // Fetch XP transactions
  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['/api/player/xp/transactions'],
    enabled: !!user,
  });
  
  // If any data is loading, show skeleton UI
  const isLoading = isProgressLoading || isStarPathLoading || isBadgesLoading || isTransactionsLoading;
  
  // Create a complete player progress object that merges the fetched data
  const playerProgress = useMemo(() => {
    if (isLoading || !progress) return null;
    
    return {
      ...progress,
      currentXp: progress.levelXp || 0,
      xpToNextLevel: progress.xpToNextLevel || 100,
      level: progress.currentLevel || 1,
      streak: progress.streakDays || 0,
      totalXp: progress.totalXp || 0,
      badges: badges || [],
      recentTransactions: transactions || [],
      // Include star path data if available
      starPath: starPath || null,
    };
  }, [progress, badges, transactions, starPath, isLoading]);

  // Define star levels and their requirements
  const starLevels: StarLevel[] = [
    {
      level: 1,
      title: "Rising Prospect",
      description: "Beginning of your athletic journey",
      minXp: 0,
      color: "text-blue-400",
      borderColor: "border-blue-400",
      shadowColor: "shadow-blue-400/20",
      achievementTypes: ["Training", "Basics"]
    },
    {
      level: 2,
      title: "Emerging Talent",
      description: "Developing core athletic abilities",
      minXp: 1000,
      color: "text-green-400",
      borderColor: "border-green-400",
      shadowColor: "shadow-green-400/20",
      achievementTypes: ["Skills", "Competition"]
    },
    {
      level: 3,
      title: "Standout Performer",
      description: "Elite skill development and performance",
      minXp: 5000,
      color: "text-purple-500",
      borderColor: "border-purple-500",
      shadowColor: "shadow-purple-500/20",
      achievementTypes: ["Advanced", "Team"]
    },
    {
      level: 4,
      title: "Elite Prospect",
      description: "College recruitment ready athlete",
      minXp: 10000,
      color: "text-amber-500",
      borderColor: "border-amber-500",
      shadowColor: "shadow-amber-500/20",
      achievementTypes: ["Recruitment", "Leadership"]
    },
    {
      level: 5,
      title: "Five-Star Athlete",
      description: "National recognition and top prospect status",
      minXp: 25000,
      color: "text-rose-500",
      borderColor: "border-rose-500",
      shadowColor: "shadow-rose-500/20",
      achievementTypes: ["National", "Elite"]
    }
  ];

  // Get current star level based on XP
  const getCurrentStarLevel = useMemo(() => {
    if (!playerProgress) return 1;
    
    // If we have star path data, use that as the source of truth
    if (playerProgress.starPath?.currentStarLevel) {
      return playerProgress.starPath.currentStarLevel;
    }
    
    // Fallback to calculating based on XP
    let currentLevel = 1;
    for (let i = starLevels.length - 1; i >= 0; i--) {
      if (playerProgress.totalXp >= starLevels[i].minXp) {
        currentLevel = starLevels[i].level;
        break;
      }
    }
    return currentLevel;
  }, [playerProgress, starLevels]);

  // Create path nodes
  const pathNodes: StarPathNode[] = useMemo(() => {
    // Ensure we have player progress data
    if (!playerProgress) return [];

    const totalXp = playerProgress.totalXp;
    
    return [
      // Star Level 1 Nodes
      {
        id: 1,
        title: "First Training",
        description: "Complete your first workout",
        xpRequired: 0,
        starLevel: 1,
        isCompleted: totalXp >= 0,
        isActive: totalXp < 250,
        achievements: ["First Workout Badge", "Training Basics"],
        iconComponent: <Dumbbell className="h-6 w-6" />,
        unlocks: ["Basic training module", "Daily XP bonus"],
        position: { x: 10, y: 80 }
      },
      {
        id: 2,
        title: "Motion Analysis",
        description: "Complete your first video analysis",
        xpRequired: 250,
        starLevel: 1,
        isCompleted: totalXp >= 250,
        isActive: totalXp >= 0 && totalXp < 500,
        achievements: ["Analyst Badge", "Form Check"],
        iconComponent: <Video className="h-6 w-6" />,
        unlocks: ["Video analysis tools", "Form feedback"],
        position: { x: 25, y: 70 }
      },
      {
        id: 3,
        title: "Athletic Assessment",
        description: "Complete core athletic measurements",
        xpRequired: 500,
        starLevel: 1,
        isCompleted: totalXp >= 500,
        isActive: totalXp >= 250 && totalXp < 1000,
        achievements: ["Baseline Established", "Self Awareness"],
        iconComponent: <BarChart3 className="h-6 w-6" />,
        unlocks: ["Sport recommendations", "Improvement tracking"],
        position: { x: 40, y: 80 }
      },
      
      // Star Level 2 Nodes
      {
        id: 4,
        title: "Skill Development",
        description: "Train specific sport skills",
        xpRequired: 1000,
        starLevel: 2,
        isCompleted: totalXp >= 1000,
        isActive: totalXp >= 500 && totalXp < 2500,
        achievements: ["Skill Specialist", "Sport Focus"],
        iconComponent: <Brain className="h-6 w-6" />,
        unlocks: ["Advanced training modules", "Skill progression tracking"],
        position: { x: 55, y: 70 }
      },
      {
        id: 5,
        title: "Team Connection",
        description: "Join a team or training group",
        xpRequired: 2500,
        starLevel: 2,
        isCompleted: totalXp >= 2500,
        isActive: totalXp >= 1000 && totalXp < 5000,
        achievements: ["Team Player", "Social Athlete"],
        iconComponent: <Users className="h-6 w-6" />,
        unlocks: ["Team challenges", "Group training sessions"],
        position: { x: 70, y: 80 }
      },
      
      // Star Level 3 Nodes
      {
        id: 6,
        title: "Competition Ready",
        description: "Participate in your first competition",
        xpRequired: 5000,
        starLevel: 3,
        isCompleted: totalXp >= 5000,
        isActive: totalXp >= 2500 && totalXp < 7500,
        achievements: ["Competitor Badge", "Game Time"],
        iconComponent: <Trophy className="h-6 w-6" />,
        unlocks: ["Game analysis tools", "Performance metrics"],
        position: { x: 85, y: 70 }
      },
      {
        id: 7,
        title: "Advanced Film Study",
        description: "Compare your technique with elite athletes",
        xpRequired: 7500,
        starLevel: 3,
        isCompleted: totalXp >= 7500,
        isActive: totalXp >= 5000 && totalXp < 10000,
        achievements: ["Film Guru", "Technical Expert"],
        iconComponent: <Video className="h-6 w-6" />,
        unlocks: ["Pro comparison tools", "Technique breakdown"],
        position: { x: 100, y: 80 }
      },
      
      // Star Level 4 Nodes
      {
        id: 8,
        title: "Recruiting Profile",
        description: "Create your college recruitment profile",
        xpRequired: 10000,
        starLevel: 4,
        isCompleted: totalXp >= 10000,
        isActive: totalXp >= 7500 && totalXp < 15000,
        achievements: ["Recruitment Ready", "Future Star"],
        iconComponent: <UserCheck className="h-6 w-6" />,
        unlocks: ["Coach connections", "Recruitment tracking"],
        position: { x: 115, y: 70 }
      },
      {
        id: 9,
        title: "NCAA Eligibility",
        description: "Complete academic requirements for NCAA",
        xpRequired: 15000,
        starLevel: 4,
        isCompleted: totalXp >= 15000,
        isActive: totalXp >= 10000 && totalXp < 20000,
        achievements: ["Academic Star", "Eligibility Expert"],
        iconComponent: <ListChecks className="h-6 w-6" />,
        unlocks: ["College pathway tools", "Academic tracking"],
        position: { x: 130, y: 80 }
      },
      {
        id: 10,
        title: "Combine Invitation",
        description: "Receive invitation to elite training combine",
        xpRequired: 20000,
        starLevel: 4,
        isCompleted: totalXp >= 20000,
        isActive: totalXp >= 15000 && totalXp < 25000,
        achievements: ["Elite Invitation", "Combine Ready"],
        iconComponent: <Calendar className="h-6 w-6" />,
        unlocks: ["Combine preparation", "Measurement predictions"],
        position: { x: 145, y: 70 }
      },
      
      // Star Level 5 Nodes
      {
        id: 11,
        title: "Five-Star Prospect",
        description: "Achieve five-star recruit status",
        xpRequired: 25000,
        starLevel: 5,
        isCompleted: totalXp >= 25000,
        isActive: totalXp >= 20000,
        achievements: ["Five Star Badge", "Elite Athlete"],
        iconComponent: <Award className="h-6 w-6" />,
        unlocks: ["National spotlight", "Recruitment prioritization"],
        position: { x: 160, y: 80 }
      },
    ];
  }, [playerProgress]);
  
  // Format XP numbers with commas
  const formatXP = (xp: number) => xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Generate percentage for next star level
  const getStarProgress = useMemo(() => {
    if (!playerProgress) return { percent: 0, current: 0, next: 1, xpRemaining: 0 };
    
    const currentStarLevel = getCurrentStarLevel;
    
    if (currentStarLevel >= 5) {
      return { 
        percent: 100, 
        current: 5, 
        next: 5,
        xpRemaining: 0
      };
    }
    
    const currentMin = starLevels[currentStarLevel - 1].minXp;
    const nextMin = starLevels[currentStarLevel].minXp;
    const range = nextMin - currentMin;
    const progress = playerProgress.totalXp - currentMin;
    const percent = Math.min(100, Math.floor((progress / range) * 100));
    
    return { 
      percent, 
      current: currentStarLevel, 
      next: currentStarLevel + 1,
      xpRemaining: Math.max(0, nextMin - playerProgress.totalXp)
    };
  }, [playerProgress, getCurrentStarLevel, starLevels]);
  
  // Function to get color classes based on star level
  const getStarLevelStyles = (level: number) => {
    const starLevel = starLevels[level - 1] || starLevels[0];
    return {
      color: starLevel.color,
      borderColor: starLevel.borderColor,
      shadowColor: starLevel.shadowColor
    };
  };

  // Create star animation effect
  useEffect(() => {
    // Animate star briefly when the component mounts
    setAnimateStar(true);
    const timer = setTimeout(() => setAnimateStar(false), 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Loading state
  if (isLoading || !playerProgress) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <Skeleton className="h-60 w-full rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const starLevelStyles = getStarLevelStyles(getCurrentStarLevel);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MyPlayer Star Path</h1>
          <p className="text-muted-foreground">Track your journey to becoming a five-star athlete</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/myplayer-xp")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to XP Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className={`border-2 ${starLevelStyles.borderColor} ${starLevelStyles.shadowColor} shadow-lg`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-2xl">
                <span className={`mr-2 ${starLevelStyles.color}`}>
                  {Array(getCurrentStarLevel).fill(0).map((_, i) => (
                    <Star key={i} className="inline h-6 w-6 fill-current" />
                  ))}
                </span>
                <AnimatePresence>
                  {animateStar && getCurrentStarLevel < 5 && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="inline-block relative"
                    >
                      <Star className="h-6 w-6 text-yellow-400" />
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        initial={{ boxShadow: "0 0 0px 0px rgba(250, 204, 21, 0)" }}
                        animate={{ boxShadow: "0 0 15px 5px rgba(250, 204, 21, 0.5)" }}
                        exit={{ boxShadow: "0 0 0px 0px rgba(250, 204, 21, 0)" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="ml-1">{starLevels[getCurrentStarLevel-1].title}</span>
              </CardTitle>
              <CardDescription>
                {starLevels[getCurrentStarLevel-1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress value={getStarProgress.percent} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{getStarProgress.current} Star</span>
                  <span>{getStarProgress.xpRemaining > 0 ? `${formatXP(getStarProgress.xpRemaining)} XP to ${getStarProgress.next} Star` : "Maximum Star Level Reached"}</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-3xl font-bold">{formatXP(playerProgress.totalXp)}</span>
                  <span className="text-xs text-muted-foreground">Total XP</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center text-3xl font-bold">
                    <span>{getCurrentStarLevel}</span>
                    <Star className={`h-5 w-5 ml-1 ${starLevelStyles.color}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">Star Level</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" />
                Next Achievements
              </CardTitle>
              <CardDescription>
                Milestones to reach your next star level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getCurrentStarLevel < 5 ? (
                pathNodes
                  .filter(node => node.starLevel === getCurrentStarLevel || node.starLevel === getCurrentStarLevel + 1)
                  .filter(node => !node.isCompleted)
                  .slice(0, 4)
                  .map((node) => (
                    <div key={node.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 p-1.5 ${node.isActive ? "bg-primary/10" : "bg-muted"} rounded-full`}>
                        {node.iconComponent}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{node.title}</h4>
                        <p className="text-xs text-muted-foreground">{node.description}</p>
                        <div className="mt-1 flex items-center text-xs">
                          <Zap className="h-3 w-3 mr-1 text-amber-500" />
                          <span>{formatXP(node.xpRequired)} XP required</span>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => setSelectedNode(node)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="py-4 text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">All Star Levels Completed!</h3>
                  <p className="text-sm text-muted-foreground">
                    You've reached the maximum 5-Star level. Continue to enhance your profile and maintain your elite status.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" onClick={() => navigate("/weight-room")}>
                Train to Earn XP <Dumbbell className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="col-span-12 lg:col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Medal className="mr-2 h-5 w-5" />
                Your Star Journey
              </CardTitle>
              <CardDescription>
                Navigate through your athletic development pathway
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-[400px] overflow-x-auto">
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-muted transform -translate-y-1/2" />
                
                {/* Path nodes */}
                <div className="relative" style={{ width: "800px", height: "400px" }}>
                  {pathNodes.map((node) => (
                    <motion.div
                      key={node.id}
                      className={`absolute cursor-pointer transition-all duration-300 transform-gpu ${node.isCompleted ? "scale-105" : ""}`}
                      style={{ 
                        left: `${node.position.x}%`, 
                        top: `${node.position.y}%`,
                      }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedNode(node)}
                    >
                      <div className={`
                        flex flex-col items-center 
                        ${node.isCompleted ? "opacity-100" : "opacity-70"}
                        ${node.isActive ? "border-primary" : "border-muted"}
                      `}>
                        <div className={`
                          h-12 w-12 rounded-full flex items-center justify-center border-2
                          ${node.isCompleted 
                            ? `bg-primary text-primary-foreground ${getStarLevelStyles(node.starLevel).borderColor} shadow-lg` 
                            : "bg-muted border-muted-foreground"
                          }
                        `}>
                          {node.iconComponent}
                          {node.isCompleted && (
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              initial={{ boxShadow: "0 0 0px 0px rgba(var(--primary), 0)" }}
                              animate={{ boxShadow: "0 0 10px 2px rgba(var(--primary), 0.3)" }}
                              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                            />
                          )}
                        </div>
                        <span className="text-xs font-medium mt-1 max-w-[80px] text-center leading-tight">
                          {node.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{formatXP(node.xpRequired)} XP</span>
                      </div>
                    </motion.div>
                  ))}
                
                  {/* Star level indicators */}
                  {starLevels.map((level, index) => (
                    <div 
                      key={index}
                      className="absolute flex flex-col items-center"
                      style={{ 
                        left: `${index * 20 + 10}%`, 
                        top: "20%" 
                      }}
                    >
                      <div className={`
                        h-10 w-10 rounded-full flex items-center justify-center
                        ${getCurrentStarLevel >= level.level ? level.color : "text-muted"}
                        ${getCurrentStarLevel >= level.level ? "bg-background border-2 " + level.borderColor : "bg-muted"}
                      `}>
                        <div className="relative">
                          <Star className={`h-6 w-6 ${getCurrentStarLevel >= level.level ? "fill-current" : ""}`} />
                          {getCurrentStarLevel >= level.level && (
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              initial={{ boxShadow: "0 0 0px 0px rgba(var(--primary), 0)" }}
                              animate={{ boxShadow: "0 0 10px 2px rgba(var(--primary), 0.3)" }}
                              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                            />
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-medium mt-1 ${getCurrentStarLevel >= level.level ? "text-foreground" : "text-muted-foreground"}`}>
                        {level.level} Star
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Selected node details */}
              {selectedNode && (
                <Card className="mt-6 border-2 border-primary">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <Badge className="mb-2">{`${selectedNode.starLevel} Star Path`}</Badge>
                        <CardTitle className="flex items-center text-xl">
                          {selectedNode.iconComponent}
                          <span className="ml-2">{selectedNode.title}</span>
                        </CardTitle>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setSelectedNode(null)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{selectedNode.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center">
                          <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                          Achievements Unlocked
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {selectedNode.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-center">
                              <CheckCircle2 className={`h-3 w-3 mr-2 ${selectedNode.isCompleted ? "text-green-500" : "text-muted-foreground"}`} />
                              <span className={selectedNode.isCompleted ? "" : "text-muted-foreground"}>
                                {achievement}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center">
                          <Zap className="h-4 w-4 mr-1 text-cyan-500" />
                          Features Unlocked
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {selectedNode.unlocks.map((feature, i) => (
                            <li key={i} className="flex items-center">
                              <BadgeCheck className={`h-3 w-3 mr-2 ${selectedNode.isCompleted ? "text-blue-500" : "text-muted-foreground"}`} />
                              <span className={selectedNode.isCompleted ? "" : "text-muted-foreground"}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm font-medium">
                          {selectedNode.isCompleted ? "Completed" : `${formatXP(Math.max(0, playerProgress.totalXp - selectedNode.xpRequired))} / ${formatXP(playerProgress.totalXp >= selectedNode.xpRequired ? playerProgress.totalXp : selectedNode.xpRequired)} XP`}
                        </span>
                      </div>
                      <Progress 
                        value={selectedNode.isCompleted ? 100 : Math.min(100, (playerProgress.totalXp / selectedNode.xpRequired) * 100)} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {selectedNode.isCompleted ? (
                      <Button className="w-full" variant="default">
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <>
                        <Button className="w-1/2" variant="outline">
                          How to Earn <Lightbulb className="ml-2 h-4 w-4" />
                        </Button>
                        <Button className="w-1/2" variant="default">
                          Start Training <Dumbbell className="ml-2 h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}