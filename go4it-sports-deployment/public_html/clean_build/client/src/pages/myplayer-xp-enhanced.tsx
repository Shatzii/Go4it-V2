import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { 
  TrendingUp, 
  Trophy, 
  Activity, 
  Star, 
  BarChart3, 
  Clock, 
  Calendar, 
  Flame, 
  Medal, 
  Zap,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Users,
  Book,
  Sparkles
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LevelProgressCard from "@/components/my-player/LevelProgressCard";
import XpTransactionsCard from "@/components/my-player/XpTransactionsCard";
import StreakInfoCard from "@/components/my-player/StreakInfoCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MyPlayerXPEnhanced() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch player progress data
  const { data: progress, isLoading: isProgressLoading } = useQuery({
    queryKey: ['/api/player/progress'],
    enabled: !!user,
  });
  
  // Fetch player skills
  const { data: skills, isLoading: isSkillsLoading } = useQuery({
    queryKey: ['/api/player/skills'],
    enabled: !!user,
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
  
  // Fetch available challenges
  const { data: availableChallenges, isLoading: isChallengesLoading } = useQuery({
    queryKey: ['/api/player/challenges'],
    enabled: !!user,
  });
  
  // Fetch active challenges
  const { data: activeChallenges, isLoading: isActiveChallengesLoading } = useQuery({
    queryKey: ['/api/player/challenges/active'],
    enabled: !!user,
  });
  
  // Fetch leaderboard data
  const { data: leaderboard, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ['/api/player/leaderboard'],
    enabled: !!user,
  });
  
  // Fetch XP level information
  const { data: xpLevelInfo, isLoading: isXpLevelInfoLoading } = useQuery({
    queryKey: ['/api/myplayer/xp-levels'],
    enabled: !!user,
  });

  // If any data is loading, show skeleton UI
  const isLoading = isProgressLoading || isSkillsLoading || isBadgesLoading || 
                    isTransactionsLoading || isChallengesLoading || isLeaderboardLoading ||
                    isXpLevelInfoLoading;
  
  // For daily login bonus - mutate to claim XP
  const updateStreakMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', `/api/myplayer/update-streak/${user?.id}`, {});
    },
    onSuccess: (data) => {
      toast({
        title: data.xpAwarded ? 'Streak XP Claimed!' : 'Streak Updated!',
        description: data.message,
      });
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/player/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/player/xp/transactions'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update streak',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // For accepting challenges
  const acceptChallengeMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      return await apiRequest('POST', `/api/player/challenges/${challengeId}/accept`, {});
    },
    onSuccess: () => {
      toast({
        title: 'Challenge Accepted!',
        description: 'Good luck completing this challenge',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/player/challenges'] });
      queryClient.invalidateQueries({ queryKey: ['/api/player/challenges/active'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to accept challenge',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // For completing challenges
  const completeChallengeMutation = useMutation({
    mutationFn: async (activeId: number) => {
      return await apiRequest('POST', `/api/myplayer/complete-challenge/${activeId}`, {});
    },
    onSuccess: (data) => {
      if (data.alreadyCompleted) {
        toast({
          title: 'Challenge Already Completed',
          description: 'This challenge was already marked as complete',
        });
        return;
      }
      
      // Show level up celebration toast if player leveled up
      if (data.xp.leveledUp) {
        toast({
          title: data.xp.levelsGained > 1 ? `${data.xp.levelsGained} Levels Gained!` : 'Level Up!',
          description: `You've reached level ${data.xp.newLevel}${data.xp.newRank ? ` and earned ${data.xp.newRank} rank!` : '!'}`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Challenge Completed!',
          description: `You earned ${data.xp.earned} XP`,
        });
      }
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/player/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/player/xp/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/player/challenges/active'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to complete challenge',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Create a complete player progress object that merges the fetched data
  const playerProgress = useMemo(() => {
    if (isLoading || !progress) return null;
    
    return {
      ...progress,
      currentXp: progress.levelXp || 0,
      xpToNextLevel: progress.xpToNextLevel || 100,
      level: progress.currentLevel || 1,
      streak: progress.streakDays || 0,
      skills: skills || [],
      badges: badges || [],
      recentTransactions: transactions || [],
      availableChallenges: availableChallenges || [],
      activeChallenges: activeChallenges || [],
      leaderboard: leaderboard || [],
      streakBonuses: xpLevelInfo?.streakBonuses || []
    };
  }, [progress, skills, badges, transactions, availableChallenges, activeChallenges, leaderboard, xpLevelInfo, isLoading]);

  // Loading state
  if (isLoading || !playerProgress) {
    return (
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between mt-6">
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-10 w-16" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <Skeleton className="h-10 w-full mb-6" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Format XP numbers with commas
  const formatXP = (xp: number) => xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Get color based on badge tier
  const getBadgeColor = (tier: string) => {
    switch(tier) {
      case "Gold": return "text-yellow-400 fill-yellow-400";
      case "Silver": return "text-slate-400 fill-slate-400";
      case "Bronze": return "text-amber-600 fill-amber-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto py-6">
      {/* Daily Login Streak Update CTA */}
      <Alert className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30">
        <Flame className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <AlertTitle>Continue Your Streak!</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            You have a {playerProgress.streak} day streak. Log in daily to earn XP bonuses and rewards.
          </span>
          <Button 
            onClick={() => updateStreakMutation.mutate()}
            disabled={updateStreakMutation.isPending}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {updateStreakMutation.isPending ? "Updating..." : "Update Streak"}
          </Button>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* New Level Progress Card Component */}
          <LevelProgressCard
            level={playerProgress.currentLevel}
            totalXp={playerProgress.totalXp}
            levelXp={playerProgress.levelXp}
            xpToNextLevel={playerProgress.xpToNextLevel}
            streakDays={playerProgress.streakDays}
            rank={playerProgress.rank || "Rookie"}
          />

          {/* Streak Info Card */}
          <StreakInfoCard 
            streakDays={playerProgress.streakDays}
            streakBonuses={playerProgress.streakBonuses}
          />

          {/* Skill Progression Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Skill Progression
              </CardTitle>
              <CardDescription>
                Develop your player's attributes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {playerProgress.skills && playerProgress.skills.length > 0 ? (
                playerProgress.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">Level {skill.level}</span>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Book className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>No skills yet</p>
                  <p className="text-sm">Complete training to earn skills</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Skill Training <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <Tabs defaultValue="history">
            <TabsList className="mb-4">
              <TabsTrigger value="history">XP History</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>

            {/* XP History Tab */}
            <TabsContent value="history" className="m-0">
              <XpTransactionsCard transactions={playerProgress.recentTransactions} />
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Medal className="mr-2 h-5 w-5" />
                    Achievement Badges
                  </CardTitle>
                  <CardDescription>
                    Earn badges by reaching milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {playerProgress.badges && playerProgress.badges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {playerProgress.badges.map((badge) => (
                        <Card key={badge.id} className={badge.earned ? "border-2 border-primary" : ""}>
                          <CardHeader className="py-3 px-4">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base">{badge.name}</CardTitle>
                              {badge.tier !== "None" && (
                                <Medal className={`h-5 w-5 ${getBadgeColor(badge.tier)}`} />
                              )}
                            </div>
                            <CardDescription>{badge.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{badge.category}</span>
                              <span>{badge.progress}%</span>
                            </div>
                            <Progress value={badge.progress} className="h-1.5" />
                          </CardContent>
                          <CardFooter className="py-2 px-4 border-t">
                            <div className="w-full flex items-center justify-between">
                              <Badge variant={badge.earned ? "default" : "secondary"}>
                                {badge.earned ? (
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                {badge.earned ? "Earned" : "Locked"}
                              </Badge>
                              {badge.earned && badge.earnedAt && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(badge.earnedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Medal className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No badges yet</p>
                      <p className="text-sm">Complete challenges and earn XP to unlock badges</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Challenges Tab */}
            <TabsContent value="challenges" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    Active Challenges
                  </CardTitle>
                  <CardDescription>
                    Complete challenges to earn XP and unlock rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {playerProgress.activeChallenges && playerProgress.activeChallenges.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No active challenges</p>
                        <p className="text-sm">Accept challenges below to start earning XP</p>
                      </div>
                    ) : (
                      playerProgress.activeChallenges && playerProgress.activeChallenges.map((challenge) => (
                        <Card key={challenge.id} className="overflow-hidden">
                          <div className="bg-primary/10 border-b px-4 py-2 flex justify-between items-center">
                            <div className="font-medium">{challenge.title}</div>
                            <Badge>{challenge.xpReward} XP</Badge>
                          </div>
                          <CardContent className="py-3">
                            <div className="text-sm mb-3">{challenge.description}</div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{challenge.progress}%</span>
                            </div>
                            <Progress value={challenge.progress} className="h-2" />
                          </CardContent>
                          <CardFooter className="py-2 bg-muted/50 flex justify-between">
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(challenge.dueDate).toLocaleDateString()}
                            </div>
                            {challenge.isCompleted ? (
                              <Badge variant="secondary" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Completed
                              </Badge>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => completeChallengeMutation.mutate(challenge.id)}
                                disabled={completeChallengeMutation.isPending}
                              >
                                {completeChallengeMutation.isPending ? "Completing..." : "Complete Challenge"}
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>

                  {playerProgress.availableChallenges && playerProgress.availableChallenges.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">Available Challenges</h3>
                      <div className="space-y-3">
                        {playerProgress.availableChallenges.map((challenge) => (
                          <Card key={challenge.id} className="overflow-hidden">
                            <CardContent className="py-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{challenge.title}</h4>
                                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                                </div>
                                <Badge className="ml-2">{challenge.xpReward} XP</Badge>
                              </div>
                            </CardContent>
                            <CardFooter className="py-2 bg-muted/50 border-t flex justify-between">
                              <div className="text-xs text-muted-foreground">
                                {challenge.difficulty} • {challenge.category}
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => acceptChallengeMutation.mutate(challenge.id)}
                                disabled={acceptChallengeMutation.isPending}
                              >
                                Accept Challenge
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    XP Leaderboard
                  </CardTitle>
                  <CardDescription>
                    Top players by total XP earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {playerProgress.leaderboard && playerProgress.leaderboard.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {playerProgress.leaderboard.map((player, index) => (
                          <div key={player.id} className="flex items-center space-x-4">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0 ? "bg-yellow-400 text-yellow-950" :
                              index === 1 ? "bg-slate-300 text-slate-950" :
                              index === 2 ? "bg-amber-600 text-amber-50" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {index + 1}
                            </div>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={player.avatar} alt={player.name} />
                              <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{player.name}</p>
                              <p className="text-sm text-muted-foreground">Level {player.level}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatXP(player.totalXp)} XP</p>
                              <p className="text-xs text-muted-foreground">{player.rank}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No leaderboard data available</p>
                      <p className="text-sm">Be the first to earn XP and top the leaderboard</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}