import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
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
  Video,
  Users,
  ListChecks
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

interface AttributeSliderProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function MyPlayerStarPath() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedNode, setSelectedNode] = useState<StarPathNode | null>(null);
  const [animateStar, setAnimateStar] = useState(false);
  const [attributeType, setAttributeType] = useState<'physical' | 'technical' | 'mental'>('physical');
  const [attributeValues, setAttributeValues] = useState<Record<string, number>>({});
  const [isEditingAttributes, setIsEditingAttributes] = useState(false);
  
  // Fetch player progress data
  const { data: progress, isLoading: isProgressLoading } = useQuery({
    queryKey: ['/api/player/progress'],
    enabled: !!user,
  });
  
  // Fetch player star path
  const { data: starPath, isLoading: isStarPathLoading } = useQuery({
    queryKey: ['/api/player/star-path', user?.id],
    enabled: !!user,
    retry: 1,
    // Star Path handling is built into the error handler
    refetchOnWindowFocus: false,
  });
  
  // Create star path if it doesn't exist
  useEffect(() => {
    // Only run this effect if we have a user but no star path and we're not loading
    if (user && !starPath && !isStarPathLoading) {
      const createStarPath = async () => {
        try {
          await fetch('/api/player/star-path', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              userId: user.id,
              sportType: 'basketball', // Default sport type
              position: '' // Default position
            })
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
      
      // Call the function to create the star path
      createStarPath();
    }
  }, [user, starPath, isStarPathLoading, queryClient, toast]);
  
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
  
  // Fetch attribute data based on selected type
  const { data: attributeData, isLoading: isAttributesLoading } = useQuery({
    queryKey: ['/api/player/star-path', user?.id, 'attributes', attributeType],
    queryFn: () => apiRequest(`/api/player/star-path/${user?.id}/attributes/${attributeType}`),
    enabled: !!user && !!user.id,
    onSuccess: (data) => {
      if (data?.attributes) {
        setAttributeValues(data.attributes);
      }
    }
  });
  
  // Reset editing state when attribute type changes
  useEffect(() => {
    setIsEditingAttributes(false);
    if (attributeData?.attributes) {
      setAttributeValues(attributeData.attributes);
    }
  }, [attributeType, attributeData]);
  
  // Level up mutation
  const levelUpMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('User not authenticated');
      return apiRequest(`/api/player/star-path/${user.id}/level-up`, {
        method: 'POST'
      });
    },
    onSuccess: (data) => {
      // Show success message
      toast({
        title: "Level Up!",
        description: data.message || `You've reached ${data.newLevel} stars!`,
        variant: "default",
      });
      
      // Animate the star
      setAnimateStar(true);
      setTimeout(() => setAnimateStar(false), 1500);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({queryKey: ['/api/player/star-path', user?.id]});
      queryClient.invalidateQueries({queryKey: ['/api/player/progress']});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to level up. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Update attributes mutation
  const updateAttributesMutation = useMutation({
    mutationFn: (attributeData: any) => {
      if (!user) throw new Error('User not authenticated');
      return apiRequest(`/api/player/star-path/${user.id}/attributes`, {
        method: 'POST',
        data: attributeData
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Attributes Updated",
        description: "Your player attributes have been updated successfully",
        variant: "default",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({queryKey: ['/api/player/star-path', user?.id, 'attributes', attributeType]});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update attributes. Please try again.",
        variant: "destructive",
      });
    }
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
    const current = playerProgress.totalXp - currentMin;
    const percent = Math.min(100, Math.round((current / range) * 100));
    
    return {
      percent,
      current: currentStarLevel,
      next: currentStarLevel + 1,
      xpRemaining: nextMin - playerProgress.totalXp
    };
  }, [playerProgress, getCurrentStarLevel, starLevels]);

  // Handle fade in animations
  useEffect(() => {
    // Reset animation when we change pages or mount component
    setAnimateStar(false);
    
    // If we're at the page initially and the player has a high star level, animate
    const timer = setTimeout(() => {
      if (playerProgress && getCurrentStarLevel >= 3) {
        setAnimateStar(true);
        setTimeout(() => setAnimateStar(false), 1500);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [playerProgress, getCurrentStarLevel]);

  // Get dynamic styles based on current star level
  const getStarLevelStyles = (level: number) => {
    if (level < 1 || level > 5) return starLevels[0];
    return starLevels[level - 1];
  };

  const starLevelStyles = getStarLevelStyles(getCurrentStarLevel);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MyPlayer Star Path</h1>
          <p className="text-muted-foreground">Track your journey to becoming a five-star athlete</p>
        </div>
        
        {!isLoading && playerProgress && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Current Star Level:</span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < getCurrentStarLevel 
                        ? starLevelStyles.color
                        : "text-muted-foreground/30"
                    }`}
                    fill={i < getCurrentStarLevel ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
            
            <AnimatePresence>
              {animateStar && (
                <motion.div
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1.5, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <Star 
                    className={`h-24 w-24 ${starLevelStyles.color}`} 
                    fill="currentColor" 
                    strokeWidth={0.5}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {levelUpMutation.isPending ? (
              <Button disabled>
                <Hourglass className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </Button>
            ) : (
              <Button onClick={() => levelUpMutation.mutate()}>
                Level up (Debug)
              </Button>
            )}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid gap-4">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[200px] rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Star Path Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="pb-0">
                <CardTitle>Athletic Development Path</CardTitle>
                <CardDescription>Track your journey to becoming a five-star athlete</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className={`${starLevelStyles.borderColor} ${starLevelStyles.shadowColor} shadow-sm`}
                      >
                        <Star className={`mr-1 h-3 w-3 ${starLevelStyles.color}`} fill="currentColor" />
                        {getCurrentStarLevel} Star
                      </Badge>
                      <span className="ml-3 text-sm font-medium">
                        {starLevels[getCurrentStarLevel - 1].title}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {getStarProgress.current < 5 && `${formatXP(playerProgress?.totalXp || 0)} / ${formatXP(starLevels[getCurrentStarLevel].minXp)} XP`}
                    </span>
                  </div>
                  
                  <Progress
                    value={getStarProgress.percent}
                    className="h-2"
                  />
                  
                  {getStarProgress.current < 5 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatXP(getStarProgress.xpRemaining)} XP needed for next star level
                    </p>
                  )}
                </div>
                
                <ScrollArea className="h-[400px] pr-4 -mr-4 overflow-hidden">
                  <div className="relative">
                    {/* The Star Path Visualization */}
                    <div className="relative w-full h-[350px] border-b border-border">
                      {/* Path nodes */}
                      {pathNodes.map(node => (
                        <motion.div
                          key={node.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                          style={{
                            left: `${node.position.x}%`,
                            top: `${node.position.y}%`,
                          }}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setSelectedNode(node)}
                        >
                          <div 
                            className={`
                              flex items-center justify-center rounded-full 
                              p-3 border-2 transition-colors
                              ${node.isCompleted 
                                ? `bg-background border-primary text-primary` 
                                : `bg-muted/50 border-muted-foreground/20 text-muted-foreground/70`
                              }
                              ${node.isActive 
                                ? 'ring-2 ring-offset-2 ring-primary/20' 
                                : ''
                              }
                            `}
                          >
                            {node.iconComponent}
                          </div>
                          
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
                            <p className={`font-medium text-xs whitespace-nowrap ${node.isCompleted ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                              {node.title}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Connect nodes with lines */}
                      <svg
                        className="absolute inset-0 w-full h-full"
                        style={{ zIndex: -1 }}
                      >
                        {pathNodes.slice(0, -1).map((node, index) => {
                          const nextNode = pathNodes[index + 1];
                          return (
                            <line
                              key={`line-${node.id}-${nextNode.id}`}
                              x1={`${node.position.x}%`}
                              y1={`${node.position.y}%`}
                              x2={`${nextNode.position.x}%`}
                              y2={`${nextNode.position.y}%`}
                              stroke={
                                node.isCompleted && nextNode.isCompleted
                                  ? "var(--primary)"
                                  : node.isCompleted
                                  ? "var(--primary-foreground)"
                                  : "var(--border)"
                              }
                              strokeWidth={node.isCompleted ? 2 : 1}
                              strokeDasharray={!node.isCompleted && !nextNode.isCompleted ? "4 4" : ""}
                            />
                          );
                        })}
                      </svg>
                    </div>
                    
                    {/* Star levels legend */}
                    <div className="flex justify-between my-4">
                      {starLevels.map((level) => (
                        <div key={level.level} className="text-center">
                          <Badge
                            variant="outline"
                            className={`
                              ${getCurrentStarLevel >= level.level ? level.borderColor : 'border-muted-foreground/30'}
                              ${getCurrentStarLevel >= level.level ? level.shadowColor : ''}
                              shadow-sm
                            `}
                          >
                            <Star
                              className={`mr-1 h-3 w-3 ${
                                getCurrentStarLevel >= level.level
                                  ? level.color
                                  : "text-muted-foreground/30"
                              }`}
                              fill={getCurrentStarLevel >= level.level ? "currentColor" : "none"}
                            />
                            {level.level} Star
                          </Badge>
                          <p className={`text-xs mt-1 ${
                            getCurrentStarLevel >= level.level
                              ? ""
                              : "text-muted-foreground/50"
                          }`}>
                            {level.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
                       
            {/* Selected Node Details */}
            {selectedNode && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Level {selectedNode.starLevel} Milestone
                      </Badge>
                      <CardTitle className="flex items-center">
                        {selectedNode.title}
                        {selectedNode.isCompleted && (
                          <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
                        )}
                      </CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="mb-4">{selectedNode.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center">
                        <Award className="mr-2 h-4 w-4" />
                        Achievements
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        {selectedNode.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center">
                        <Zap className="mr-2 h-4 w-4" />
                        Unlocks
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        {selectedNode.unlocks.map((unlock, i) => (
                          <li key={i}>{unlock}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Star className="mr-1 h-4 w-4" />
                      {selectedNode.starLevel === 5 ? "Five-Star Level Milestone" : `Star Level ${selectedNode.starLevel} Milestone`}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Flame className="mr-1 h-4 w-4" />
                      {formatXP(selectedNode.xpRequired)} XP Required
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {selectedNode.isCompleted ? (
                    <div className="w-full flex items-center justify-between">
                      <span className="text-sm text-green-500 flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Completed
                      </span>
                      <Button size="sm" variant="ghost">
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full">
                      {selectedNode.isActive ? (
                        <Button className="w-full">
                          Start Milestone
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button className="w-full" variant="outline" disabled>
                          Locked - Complete Previous Milestones
                        </Button>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            )}
          </div>
          
          {/* Sidebar with Player Stats & Attributes */}
          <div className="space-y-6">
            {/* Star Level Card */}
            <Card className={`border-2 ${starLevelStyles.borderColor} ${starLevelStyles.shadowColor} shadow-sm`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      {starLevels[getCurrentStarLevel - 1].title}
                    </CardTitle>
                    <CardDescription>
                      {starLevels[getCurrentStarLevel - 1].description}
                    </CardDescription>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < getCurrentStarLevel 
                            ? starLevelStyles.color
                            : "text-muted-foreground/20"
                        }`}
                        fill={i < getCurrentStarLevel ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Total XP</span>
                      <span className="font-medium">{formatXP(playerProgress?.totalXp || 0)} XP</span>
                    </div>
                    <Progress value={getStarProgress.percent} className="h-2" />
                  </div>
                  
                  {getStarProgress.current < 5 && (
                    <div className="flex justify-between text-sm">
                      <span>Next Level</span>
                      <span className="font-medium">{formatXP(getStarProgress.xpRemaining)} XP needed</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Active Streak</span>
                    <span className="font-medium">{playerProgress?.streak || 0} days</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Achievements</span>
                    <span className="font-medium">{playerProgress?.badges?.length || 0} earned</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Attributes Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Player Attributes</CardTitle>
                <CardDescription>
                  Adjust and track your athlete attributes
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <Tabs 
                  value={attributeType} 
                  onValueChange={(v) => setAttributeType(v as 'physical' | 'technical' | 'mental')}
                  className="space-y-4"
                >
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="physical" className="flex items-center">
                      <Dumbbell className="mr-2 h-4 w-4" />
                      Physical
                    </TabsTrigger>
                    <TabsTrigger value="technical" className="flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Technical
                    </TabsTrigger>
                    <TabsTrigger value="mental" className="flex items-center">
                      <Brain className="mr-2 h-4 w-4" />
                      Mental
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="physical" className="space-y-4">
                    {isAttributesLoading ? (
                      <>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : (
                      <>
                        <AttributeSlider 
                          name="Speed" 
                          value={attributeValues.speed || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, speed: value})}
                          disabled={!isEditingAttributes}
                        />
                        <AttributeSlider 
                          name="Strength" 
                          value={attributeValues.strength || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, strength: value})}
                          disabled={!isEditingAttributes}
                        />
                        <AttributeSlider 
                          name="Agility" 
                          value={attributeValues.agility || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, agility: value})}
                          disabled={!isEditingAttributes}
                        />
                        <AttributeSlider 
                          name="Endurance" 
                          value={attributeValues.endurance || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, endurance: value})}
                          disabled={!isEditingAttributes}
                        />
                        <AttributeSlider 
                          name="Vertical Jump" 
                          value={attributeValues.verticalJump || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, verticalJump: value})}
                          disabled={!isEditingAttributes}
                        />
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="technical" className="space-y-4">
                    {isAttributesLoading ? (
                      <>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : (
                      <>
                        <AttributeSlider 
                          name="Technique" 
                          value={attributeValues.technique || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, technique: value})}
                          disabled={!isEditingAttributes}
                        />
                        <AttributeSlider 
                          name="Ball Control" 
                          value={attributeValues.ballControl || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, ballControl: value})}
                          disabled={!isEditingAttributes}
                        />
                        <AttributeSlider 
                          name="Accuracy" 
                          value={attributeValues.accuracy || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, accuracy: value})}
                          disabled={!isEditingAttributes}
                        />
                        <AttributeSlider 
                          name="Game IQ" 
                          value={attributeValues.gameIQ || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, gameIQ: value})}
                          disabled={!isEditingAttributes}
                        />
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="mental" className="space-y-4">
                    {isAttributesLoading ? (
                      <>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : (
                      <>
                        <AttributeSlider 
                          name="Focus" 
                          value={attributeValues.focus || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, focus: value})}
                          disabled={!isEditingAttributes}
                        />
                        <AttributeSlider 
                          name="Confidence" 
                          value={attributeValues.confidence || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, confidence: value})}
                          disabled={!isEditingAttributes}
                        />
                        <AttributeSlider 
                          name="Determination" 
                          value={attributeValues.determination || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, determination: value})}
                          disabled={!isEditingAttributes}
                        />
                        <AttributeSlider 
                          name="Teamwork" 
                          value={attributeValues.teamwork || 0} 
                          onChange={(value) => setAttributeValues({...attributeValues, teamwork: value})}
                          disabled={!isEditingAttributes}
                        />
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="pt-2">
                {isEditingAttributes ? (
                  <div className="flex w-full gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        // Reset form
                        if (attributeData?.attributes) {
                          setAttributeValues(attributeData.attributes);
                        }
                        setIsEditingAttributes(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        // Save changes
                        updateAttributesMutation.mutate({
                          type: attributeType,
                          attributes: attributeValues
                        });
                        setIsEditingAttributes(false);
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsEditingAttributes(true)}
                  >
                    Edit Attributes
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// Attribute slider component
function AttributeSlider({ name, value, onChange, disabled = false }: AttributeSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{name}</Label>
        <span className={`text-sm font-medium ${value >= 80 ? 'text-green-500' : value >= 60 ? 'text-amber-500' : 'text-muted-foreground'}`}>
          {value}
        </span>
      </div>
      <Slider
        defaultValue={[value]}
        max={100}
        min={0}
        step={1}
        className={disabled ? 'opacity-70' : ''}
        disabled={disabled}
        onValueChange={(values) => {
          if (!disabled && values.length > 0) {
            onChange(values[0]);
          }
        }}
      />
    </div>
  );
}