import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, getQueryFn, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { 
  StarPathCard, 
  StarPathFlow, 
  AchievementDisplay, 
  RewardDisplay 
} from "@/modules/myplayer/star-path/components";
import { 
  shareAchievement, 
  shareReward 
} from "@/modules/myplayer/star-path/services/starPathService";
import {
  AchievementCategory,
  RewardType
} from "@/modules/myplayer/star-path/types";
import {
  Star,
  Trophy,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  Zap,
  Medal,
  Dumbbell,
  Brain,
  Share2,
  Calendar,
  ActivitySquare,
  BarChart3,
  LineChart,
  History,
  HelpCircle,
  Info,
  ListChecks,
  Rocket,
  Flame,
  RefreshCw,
  Users,
  Video,
  UserCheck,
  BookOpen
} from "lucide-react";

export default function EnhancedStarPath() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [displayStarAnimation, setDisplayStarAnimation] = useState(false);
  
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
          await apiRequest('POST', '/api/player/star-path', { 
            userId: user.id,
            sportType: 'basketball', // Default sport type
            position: '' // Default position
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
  
  // Fetch achievements
  const { data: achievements, isLoading: isAchievementsLoading } = useQuery({
    queryKey: ['/api/achievements', user?.id],
    enabled: !!user,
  });
  
  // Fetch rewards
  const { data: rewards, isLoading: isRewardsLoading } = useQuery({
    queryKey: ['/api/rewards', user?.id],
    enabled: !!user,
  });
  
  // If any data is loading, show skeleton UI
  const isLoading = isProgressLoading || isStarPathLoading || isBadgesLoading || isTransactionsLoading;
  
  // Daily check-in mutation
  const checkInMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const response = await apiRequest('POST', '/api/player/daily-check-in');
      return response.data;
    },
    onSuccess: (data) => {
      // Show success message
      toast({
        title: "Daily Check-In Complete!",
        description: `+${data.xpGained} XP earned. Streak: ${data.newStreakCount} days`,
        variant: "default",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({queryKey: ['/api/player/star-path', user?.id]});
      queryClient.invalidateQueries({queryKey: ['/api/player/progress']});
      
      // Maybe show streak animation if streak milestone reached
      if (data.streakMilestoneReached) {
        // Show streak milestone celebration
        setDisplayStarAnimation(true);
        setTimeout(() => setDisplayStarAnimation(false), 3000);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to check in. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Level up mutation
  const levelUpMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const response = await apiRequest('POST', `/api/player/star-path/${user.id}/level-up`);
      return response.data;
    },
    onSuccess: (data) => {
      // Show success message
      toast({
        title: "Level Up!",
        description: data.message || `You've reached ${data.newLevel || 'next'} stars!`,
        variant: "default",
      });
      
      // Animate the star
      setDisplayStarAnimation(true);
      setTimeout(() => setDisplayStarAnimation(false), 3000);
      
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
  
  // Handle daily check-in
  const handleDailyCheckIn = () => {
    if (checkInMutation.isPending) return;
    checkInMutation.mutate();
  };
  
  // Handle level up
  const handleLevelUp = () => {
    if (levelUpMutation.isPending) return;
    levelUpMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full col-span-2" />
        </div>
        
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  // Safely get player progress with defaults
  const playerProgress = progress ? {
    ...progress,
    currentXp: progress?.levelXp ?? 0,
    xpToNextLevel: progress?.xpToNextLevel ?? 100,
    level: progress?.currentLevel ?? 1,
    streak: progress?.streakDays ?? 0,
    totalXp: progress?.totalXp ?? 0,
    badges: badges || [],
    recentTransactions: transactions || [],
    starPath: starPath || null,
  } : null;
  
  // If we don't have player progress, show an error
  if (!playerProgress) {
    return (
      <div className="container max-w-6xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Star Path</h2>
        <p className="text-muted-foreground mb-6">Unable to load your progress data. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    );
  }
  
  // Function to check if a player can level up
  const canLevelUp = () => {
    if (!playerProgress || !playerProgress.starPath) return false;
    
    const currentStarLevel = playerProgress.starPath?.currentStarLevel || 1;
    const totalXp = playerProgress.totalXp || 0;
    
    // Star level XP requirements
    const starLevelRequirements = [0, 1000, 5000, 10000, 25000];
    
    // If current level is 5 (max), no level up possible
    if (currentStarLevel >= 5) return false;
    
    // Check if player has enough XP for next level
    return totalXp >= starLevelRequirements[currentStarLevel];
  };
  
  // Star level display names
  const getStarLevelName = (level: number): string => {
    const names = [
      "Rising Prospect",
      "Emerging Talent",
      "Standout Performer",
      "Elite Prospect",
      "Five-Star Athlete"
    ];
    return level > 0 && level <= names.length ? names[level - 1] : "Unknown";
  };
  
  // Current star level
  const currentStarLevel = playerProgress.starPath?.currentStarLevel || 1;
  
  // Helper functions for achievement and reward displays
  // Icon mapping for different achievement categories
  const getCategoryIcon = (category: AchievementCategory, rarity: string) => {
    const iconProps = { 
      className: `h-6 w-6 ${getRarityColor(rarity)}`,
      strokeWidth: 1.5
    };

    switch (category) {
      case AchievementCategory.Performance:
        return <Trophy {...iconProps} />;
      case AchievementCategory.Training:
        return <Dumbbell {...iconProps} />;
      case AchievementCategory.Academics:
        return <BookOpen {...iconProps} />;
      case AchievementCategory.Community:
        return <Users {...iconProps} />;
      case AchievementCategory.Milestone:
        return <Star {...iconProps} />;
      case AchievementCategory.Special:
        return <Award {...iconProps} />;
      default:
        return <Medal {...iconProps} />;
    }
  };

  // Helper function to get color based on rarity
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-400';
      case 'uncommon':
        return 'text-green-500';
      case 'rare':
        return 'text-blue-500';
      case 'epic':
        return 'text-purple-500';
      case 'legendary':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };

  // Helper function to get background based on rarity for UI elements
  const getRarityBackground = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 dark:bg-gray-800';
      case 'uncommon':
        return 'bg-green-100 dark:bg-green-900/40';
      case 'rare':
        return 'bg-blue-100 dark:bg-blue-900/40';
      case 'epic':
        return 'bg-purple-100 dark:bg-purple-900/40';
      case 'legendary':
        return 'bg-yellow-100 dark:bg-yellow-900/40';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };
  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      {/* Star Explosion Animation */}
      <AnimatePresence>
        {displayStarAnimation && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Star background glow */}
              <motion.div 
                className="absolute rounded-full bg-yellow-500"
                initial={{ width: 0, height: 0, opacity: 0.7 }}
                animate={{ 
                  width: 300, 
                  height: 300,
                  opacity: [0.7, 0.4, 0],
                }}
                transition={{ duration: 1.5 }}
              />
              
              {/* Main star */}
              <motion.div
                className="relative z-10 text-yellow-400"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Star size={120} fill="currentColor" strokeWidth={1} />
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center text-white font-bold text-4xl"
                >
                  {currentStarLevel}
                </motion.div>
              </motion.div>
              
              {/* Particle effects */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-yellow-300"
                  style={{ 
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 300,
                    y: (Math.random() - 0.5) * 300,
                    opacity: 0 
                  }}
                  transition={{ 
                    duration: Math.random() * 1 + 1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
            
            {/* Level Up Text */}
            <motion.div
              className="absolute bottom-1/4 left-0 right-0 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                Level Up!
              </h2>
              <p className="text-xl text-yellow-300 font-medium mt-2 drop-shadow-md">
                {getStarLevelName(currentStarLevel)}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Star Path Header */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            Star Path Journey
          </h1>
          <p className="text-muted-foreground mt-1">
            Your journey from Rising Prospect to Five-Star Athlete
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate('/myplayer/star-path')}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Classic View
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1">
                <Info className="h-4 w-4" />
                Star Path Help
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Star Path Guide</SheetTitle>
                <SheetDescription>
                  Learn how to progress in your athletic Star Path journey
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    What is Star Path?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Star Path is your journey from a Rising Prospect (1-star) to a Five-Star Athlete (5-star).
                    Each level represents your growth as an athlete, unlocking new features and opportunities.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Star Levels
                  </h3>
                  <div className="space-y-3 pl-2 border-l-2 border-muted">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div key={level} className="space-y-1">
                        <h4 className="font-medium flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                            {level}
                          </span>
                          {getStarLevelName(level)}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {level === 1 && "Beginning your athletic journey with fundamental skills and training."}
                          {level === 2 && "Developing consistent habits and sport-specific skills."}
                          {level === 3 && "Demonstrating advanced skills and competitive abilities."}
                          {level === 4 && "Recognized for exceptional performance and leadership."}
                          {level === 5 && "National recognition and top prospect status."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    How to Level Up
                  </h3>
                  <ul className="text-sm space-y-2 pl-5 list-disc text-muted-foreground">
                    <li>Complete workouts and training sessions</li>
                    <li>Upload performance videos for analysis</li>
                    <li>Maintain daily check-in streaks</li>
                    <li>Complete skill tree achievements</li>
                    <li>Participate in competitions and events</li>
                    <li>Improve your GAR scores across categories</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Medal className="h-5 w-5 text-purple-500" />
                    Star Path Benefits
                  </h3>
                  <ul className="text-sm space-y-2 pl-5 list-disc text-muted-foreground">
                    <li>Unlock advanced training programs</li>
                    <li>Increase visibility to coaches and scouts</li>
                    <li>Access to advanced skill development tools</li>
                    <li>Compete for scholarships and opportunities</li>
                    <li>Build a complete athletic portfolio</li>
                  </ul>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button 
            variant={canLevelUp() ? "default" : "secondary"}
            size="sm"
            disabled={!canLevelUp() || levelUpMutation.isPending}
            onClick={handleLevelUp}
            className="gap-1"
          >
            {levelUpMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            {canLevelUp() ? "Level Up" : "Next Level Locked"}
          </Button>
        </div>
      </div>
      
      {/* Star Path Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Status Card */}
        <Card className="shadow-lg border-primary/20 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current star level */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Star Level</span>
                <div className="flex items-center gap-1 text-xl font-semibold">
                  {currentStarLevel}
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {getStarLevelName(currentStarLevel)}
              </Badge>
            </div>
            
            {/* XP Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>XP Progress</span>
                <span className="text-muted-foreground">{playerProgress.totalXp.toLocaleString()} XP Total</span>
              </div>
              <Progress value={(playerProgress.currentXp / playerProgress.xpToNextLevel) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Level {playerProgress.level}</span>
                <span>{playerProgress.currentXp}/{playerProgress.xpToNextLevel} to Next Level</span>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                  <div className="text-sm font-medium">{playerProgress.streak} days</div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-2">
                <ActivitySquare className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Drills</div>
                  <div className="text-sm font-medium">{playerProgress.starPath?.completedDrills || 0}</div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-2">
                <Dumbbell className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Workouts</div>
                  <div className="text-sm font-medium">{playerProgress.starPath?.verifiedWorkouts || 0}</div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3 flex items-center space-x-2">
                <Medal className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                  <div className="text-sm font-medium">{badges?.length || 0}</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleDailyCheckIn}
              disabled={checkInMutation.isPending}
            >
              {checkInMutation.isPending ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Calendar className="mr-2 h-4 w-4" />
              )}
              Daily Check-In
            </Button>
          </CardFooter>
        </Card>
        
        {/* Star Path progression visualization */}
        <Card className="shadow-lg border-primary/20 col-span-2 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Star Path Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[350px] relative">
              <StarPathFlow 
                progress={playerProgress.starPath || {
                  id: 0,
                  userId: user?.id || 0,
                  currentStarLevel: 1,
                  position: '',
                  sportType: 'basketball',
                  completedDrills: 0,
                  verifiedWorkouts: 0,
                  streakDays: 0,
                  skillTreeProgress: 0,
                  xpTotal: 0,
                  level: 1,
                  achievements: [],
                  lastUpdated: null,
                  progress: 0,
                  starXp: 0,
                  storylinePhase: '',
                  targetStarLevel: null,
                  nextMilestone: null,
                  roadmapItems: null,
                  longestStreak: 0,
                  currentGoal: null,
                  levelThresholds: []
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Star Path Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
          <TabsTrigger value="overview" className="gap-1">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-1">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-1">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Badges</span>
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="gap-1">
            <ListChecks className="h-4 w-4" />
            <span className="hidden sm:inline">Roadmap</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Star Level Requirements</CardTitle>
                <CardDescription>XP requirements for each star level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { level: 1, name: "Rising Prospect", xp: 0, color: "#3b82f6" },
                    { level: 2, name: "Emerging Talent", xp: 1000, color: "#10b981" },
                    { level: 3, name: "Standout Performer", xp: 5000, color: "#8b5cf6" },
                    { level: 4, name: "Elite Prospect", xp: 10000, color: "#f59e0b" },
                    { level: 5, name: "Five-Star Athlete", xp: 25000, color: "#ef4444" }
                  ].map((level, i) => (
                    <div key={level.level} className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: level.color }}
                      >
                        {level.level}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{level.name}</span>
                          <span className="text-sm text-muted-foreground">{level.xp.toLocaleString()} XP</span>
                        </div>
                        <Progress 
                          value={Math.min(100, (playerProgress.totalXp / level.xp) * 100)} 
                          className="h-2 mt-1" 
                          style={{ backgroundColor: "rgba(var(--muted), 0.5)" }}
                        />
                      </div>
                      <div>
                        {playerProgress.totalXp >= level.xp ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="text-sm font-medium">
                            {Math.max(0, level.xp - playerProgress.totalXp).toLocaleString()} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Star Path Stats</CardTitle>
                <CardDescription>Your performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {playerProgress.streak} <Flame className="h-4 w-4 text-orange-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Longest Streak</div>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {playerProgress.starPath?.longestStreak || 0} <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Completed Drills</div>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {playerProgress.starPath?.completedDrills || 0} <ActivitySquare className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Verified Workouts</div>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {playerProgress.starPath?.verifiedWorkouts || 0} <Dumbbell className="h-4 w-4 text-purple-500" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h4 className="font-medium mb-2">Skill Tree Progress</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Overall Completion</span>
                      <span>{playerProgress.starPath?.skillTreeProgress || 0}%</span>
                    </div>
                    <Progress 
                      value={playerProgress.starPath?.skillTreeProgress || 0} 
                      className="h-2"
                    />
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h4 className="font-medium mb-2">Current Goal</h4>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">
                      {playerProgress.starPath?.currentGoal || "No current goal set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Next Milestones</CardTitle>
                <CardDescription>Tasks to reach your next star level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Placeholder milestones - in real app would come from API */}
                  {[
                    {
                      id: 1,
                      title: "Complete 3 verified workouts",
                      xpReward: 300,
                      isCompleted: (playerProgress.starPath?.verifiedWorkouts || 0) >= 3
                    },
                    {
                      id: 2,
                      title: "Reach a 7-day streak",
                      xpReward: 500,
                      isCompleted: (playerProgress.streak || 0) >= 7
                    },
                    {
                      id: 3,
                      title: "Complete your player profile",
                      xpReward: 200,
                      isCompleted: !!(playerProgress.starPath?.position && playerProgress.starPath?.sportType)
                    },
                    {
                      id: 4,
                      title: "Complete GAR assessment",
                      xpReward: 400,
                      isCompleted: false
                    },
                    {
                      id: 5,
                      title: "Upload game highlight video",
                      xpReward: 350,
                      isCompleted: false
                    }
                  ].map(milestone => (
                    <div 
                      key={milestone.id}
                      className={`p-3 rounded-lg border flex justify-between items-center ${
                        milestone.isCompleted 
                          ? 'bg-green-900/10 border-green-700/30' 
                          : 'bg-muted/30 border-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {milestone.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground"></div>
                        )}
                        <span className={milestone.isCompleted ? 'text-green-500' : ''}>
                          {milestone.title}
                        </span>
                      </div>
                      <div className="text-sm font-medium">
                        +{milestone.xpReward} XP
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Star Path Achievements</CardTitle>
              <CardDescription>
                Complete these achievements to progress on your Star Path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    id: 1, 
                    title: "First Steps", 
                    description: "Complete your first workout", 
                    icon: <Dumbbell className="h-5 w-5" />,
                    isCompleted: (playerProgress.starPath?.verifiedWorkouts || 0) > 0,
                    starLevel: 1,
                    xpReward: 100
                  },
                  { 
                    id: 2, 
                    title: "Video Analysis", 
                    description: "Upload your first performance video", 
                    icon: <Video className="h-5 w-5" />,
                    isCompleted: false,
                    starLevel: 1,
                    xpReward: 150
                  },
                  { 
                    id: 3, 
                    title: "One Week Strong", 
                    description: "Maintain a 7-day streak", 
                    icon: <Calendar className="h-5 w-5" />,
                    isCompleted: (playerProgress.streak || 0) >= 7,
                    starLevel: 1,
                    xpReward: 250
                  },
                  { 
                    id: 4, 
                    title: "Skill Development", 
                    description: "Complete 10 skill drills", 
                    icon: <ActivitySquare className="h-5 w-5" />,
                    isCompleted: (playerProgress.starPath?.completedDrills || 0) >= 10,
                    starLevel: 2,
                    xpReward: 300
                  },
                  { 
                    id: 5, 
                    title: "Team Player", 
                    description: "Join a team or training group", 
                    icon: <Users className="h-5 w-5" />,
                    isCompleted: false,
                    starLevel: 2,
                    xpReward: 350
                  },
                  { 
                    id: 6, 
                    title: "Athletic Assessment", 
                    description: "Complete your first GAR assessment", 
                    icon: <BarChart3 className="h-5 w-5" />,
                    isCompleted: false,
                    starLevel: 2,
                    xpReward: 400
                  },
                  { 
                    id: 7, 
                    title: "Competition Ready", 
                    description: "Participate in your first competition", 
                    icon: <Trophy className="h-5 w-5" />,
                    isCompleted: false,
                    starLevel: 3,
                    xpReward: 500
                  },
                  { 
                    id: 8, 
                    title: "Skill Tree Progress", 
                    description: "Reach 50% on your skill tree", 
                    icon: <ListChecks className="h-5 w-5" />,
                    isCompleted: (playerProgress.starPath?.skillTreeProgress || 0) >= 50,
                    starLevel: 3,
                    xpReward: 450
                  },
                  { 
                    id: 9, 
                    title: "Recruitment Profile", 
                    description: "Set up your recruitment profile", 
                    icon: <UserCheck className="h-5 w-5" />,
                    isCompleted: false,
                    starLevel: 4,
                    xpReward: 600
                  }
                ].map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`
                      rounded-lg border p-4 transition-all duration-200
                      ${achievement.isCompleted 
                        ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30' 
                        : achievement.starLevel <= currentStarLevel
                          ? 'bg-card border-muted hover:border-muted-foreground/50' 
                          : 'bg-muted/20 border-muted/30 opacity-60'
                      }
                    `}
                  >
                    <div className="flex gap-3">
                      <div className={`
                        p-2 rounded-full flex-shrink-0
                        ${achievement.isCompleted 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        {achievement.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{achievement.title}</h4>
                          {achievement.starLevel > currentStarLevel && (
                            <Badge variant="outline" className="text-xs">
                              Star {achievement.starLevel}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-medium">+{achievement.xpReward} XP</span>
                          {achievement.isCompleted ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                              Completed
                            </Badge>
                          ) : achievement.starLevel <= currentStarLevel ? (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-muted">
                              Locked
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and XP transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {/* Would use transactions data from API here */}
                  {[
                    { id: 1, type: "daily-check-in", description: "Daily Check-In", xp: 50, date: new Date(Date.now() - 86400000), icon: <Calendar className="h-5 w-5 text-blue-500" /> },
                    { id: 2, type: "workout", description: "Completed Basketball Workout", xp: 200, date: new Date(Date.now() - 172800000), icon: <Dumbbell className="h-5 w-5 text-purple-500" /> },
                    { id: 3, type: "streak", description: "5-Day Streak Bonus", xp: 100, date: new Date(Date.now() - 259200000), icon: <Flame className="h-5 w-5 text-orange-500" /> },
                    { id: 4, type: "milestone", description: "First GAR Analysis", xp: 300, date: new Date(Date.now() - 345600000), icon: <BarChart3 className="h-5 w-5 text-green-500" /> },
                    { id: 5, type: "daily-check-in", description: "Daily Check-In", xp: 50, date: new Date(Date.now() - 432000000), icon: <Calendar className="h-5 w-5 text-blue-500" /> },
                    { id: 6, type: "drill", description: "Completed Shooting Drill", xp: 75, date: new Date(Date.now() - 518400000), icon: <ActivitySquare className="h-5 w-5 text-amber-500" /> },
                  ].map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b">
                      <div className="bg-muted/50 rounded-full p-2">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.date.toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'short', 
                            day: 'numeric', 
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded font-medium text-sm">
                        +{activity.xp} XP
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="badges" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Star Path Badges</CardTitle>
              <CardDescription>Earn badges to showcase your achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                  { id: 1, name: "Early Riser", icon: <Flame className="h-8 w-8" />, description: "Check in for 5 consecutive days", isEarned: true, category: "Consistency" },
                  { id: 2, name: "Training Pro", icon: <Dumbbell className="h-8 w-8" />, description: "Complete 10 verified workouts", isEarned: true, category: "Training" },
                  { id: 3, name: "Video Star", icon: <Video className="h-8 w-8" />, description: "Upload 5 performance videos", isEarned: false, category: "Video" },
                  { id: 4, name: "Skill Master", icon: <Brain className="h-8 w-8" />, description: "Reach 50% on skill tree", isEarned: false, category: "Skills" },
                  { id: 5, name: "Team Leader", icon: <Users className="h-8 w-8" />, description: "Mentor another athlete", isEarned: false, category: "Leadership" },
                  { id: 6, name: "Competitor", icon: <Trophy className="h-8 w-8" />, description: "Participate in 3 competitions", isEarned: false, category: "Competition" },
                  { id: 7, name: "Analytics Pro", icon: <BarChart3 className="h-8 w-8" />, description: "Improve GAR score by 10%", isEarned: true, category: "Analytics" },
                  { id: 8, name: "Net Worker", icon: <Share2 className="h-8 w-8" />, description: "Connect with 5 coaches", isEarned: false, category: "Networking" },
                  { id: 9, name: "Star Athlete", icon: <Star className="h-8 w-8" />, description: "Reach 3-star level", isEarned: false, category: "Star Path" },
                  { id: 10, name: "Month Streak", icon: <Calendar className="h-8 w-8" />, description: "30 day check-in streak", isEarned: false, category: "Consistency" },
                ].map(badge => (
                  <div 
                    key={badge.id}
                    className={`
                      flex flex-col items-center text-center p-4 rounded-lg border
                      ${badge.isEarned 
                        ? 'bg-gradient-to-b from-primary/20 to-primary/5 border-primary/30' 
                        : 'bg-muted/20 border-muted opacity-70'
                      }
                    `}
                  >
                    <div className={`
                      p-3 mb-2 rounded-full
                      ${badge.isEarned 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted/50 text-muted-foreground'
                      }
                    `}>
                      {badge.icon}
                    </div>
                    <h4 className="font-medium text-sm">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {badge.description}
                    </p>
                    <Badge 
                      variant="outline" 
                      className="mt-2 text-xs"
                    >
                      {badge.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roadmap" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Star Path Roadmap</CardTitle>
              <CardDescription>Your journey to becoming a five-star athlete</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Path connector line */}
                <div className="absolute left-6 top-8 bottom-0 w-1 bg-muted-foreground/20" />
                
                <div className="space-y-8 relative">
                  {[
                    {
                      id: 1,
                      title: "Beginning Your Journey",
                      description: "Complete your profile and start training consistently",
                      tasks: [
                        "Set up your athlete profile",
                        "Complete your first verified workout",
                        "Start your daily check-in streak"
                      ],
                      isCompleted: true,
                      currentTask: false,
                      icon: <Star className="h-5 w-5" />
                    },
                    {
                      id: 2,
                      title: "Building Fundamentals",
                      description: "Develop core athletic abilities and sport-specific skills",
                      tasks: [
                        "Complete 10 training sessions",
                        "Upload 3 performance videos for analysis",
                        "Receive feedback from a coach or trainer"
                      ],
                      isCompleted: false,
                      currentTask: true,
                      icon: <Brain className="h-5 w-5" />
                    },
                    {
                      id: 3,
                      title: "Performance Analysis",
                      description: "Track your athletic performance with analytics",
                      tasks: [
                        "Complete your first full GAR analysis",
                        "Set performance goals based on analysis",
                        "Identify areas for improvement"
                      ],
                      isCompleted: false,
                      currentTask: false,
                      icon: <BarChart3 className="h-5 w-5" />
                    },
                    {
                      id: 4,
                      title: "Competitive Experience",
                      description: "Gain experience in competitive settings",
                      tasks: [
                        "Participate in your first competition",
                        "Upload competition highlights",
                        "Receive a competition performance evaluation"
                      ],
                      isCompleted: false,
                      currentTask: false,
                      icon: <Trophy className="h-5 w-5" />
                    },
                    {
                      id: 5,
                      title: "Recruitment Readiness",
                      description: "Prepare for college recruitment opportunities",
                      tasks: [
                        "Create a recruitment profile",
                        "Connect with coaches and scouts",
                        "Understand NCAA eligibility requirements"
                      ],
                      isCompleted: false,
                      currentTask: false,
                      icon: <Users className="h-5 w-5" />
                    }
                  ].map((step, index) => (
                    <div key={step.id} className="relative flex">
                      {/* Step indicator */}
                      <div className="absolute left-0 flex items-center justify-center z-10">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center border-2
                          ${step.isCompleted 
                            ? 'bg-green-500 border-green-600 text-white' 
                            : step.currentTask
                              ? 'bg-blue-500 border-blue-600 text-white animate-pulse'
                              : 'bg-muted border-muted-foreground/30 text-muted-foreground/70'
                          }
                        `}>
                          {step.isCompleted ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : (
                            step.icon
                          )}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="ml-16 pb-8">
                        <div className={`
                          p-4 rounded-lg border
                          ${step.isCompleted 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : step.currentTask
                              ? 'bg-blue-500/10 border-blue-500/30'
                              : 'bg-muted/50 border-muted'
                          }
                        `}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">
                              {step.title}
                            </h3>
                            {step.isCompleted ? (
                              <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                            ) : step.currentTask ? (
                              <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
                            ) : (
                              <Badge variant="outline">Upcoming</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mt-1">
                            {step.description}
                          </p>
                          
                          <div className="mt-4 space-y-2">
                            {step.tasks.map((task, i) => (
                              <div key={i} className="flex items-center gap-2">
                                {step.isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : step.currentTask && i === 0 ? (
                                  <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-muted-foreground/50"></div>
                                )}
                                <span className={`
                                  text-sm
                                  ${step.isCompleted ? 'text-muted-foreground line-through' : ''}
                                  ${step.currentTask && i === 0 ? 'font-medium' : ''}
                                `}>
                                  {task}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}