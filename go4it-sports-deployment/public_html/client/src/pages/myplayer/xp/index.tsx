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
  Users
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

export default function MyPlayerXP() {
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

  // If any data is loading, show skeleton UI
  const isLoading = isProgressLoading || isSkillsLoading || isBadgesLoading || 
                   isTransactionsLoading || isChallengesLoading || isLeaderboardLoading;
  
  // For daily login bonus - mutate to claim XP
  const claimDailyLoginMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/player/xp/daily-login', {});
    },
    onSuccess: () => {
      toast({
        title: 'Daily XP Claimed!',
        description: 'You\'ve received your daily login bonus',
      });
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/player/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/player/xp/transactions'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to claim XP',
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
      leaderboard: leaderboard || []
    };
  }, [progress, skills, badges, transactions, availableChallenges, activeChallenges, leaderboard, isLoading]);

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

  // Calculate percentage to next level
  const percentToNextLevel = (playerProgress.currentXp / playerProgress.xpToNextLevel) * 100;

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

  // Get icon for transaction type
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case "workout": return <Activity className="h-4 w-4" />;
      case "login": return <Clock className="h-4 w-4" />;
      case "challenge": return <Trophy className="h-4 w-4" />;
      case "film": return <BarChart3 className="h-4 w-4" />;
      case "game": return <TrendingUp className="h-4 w-4" />;
      case "assessment": return <CheckCircle2 className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Level {playerProgress.level}</CardTitle>
                  <CardDescription>
                    {formatXP(playerProgress.currentXp)} / {formatXP(playerProgress.xpToNextLevel)} XP
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  <Flame className="h-4 w-4 text-red-500" />
                  {playerProgress.streak} Day Streak
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={percentToNextLevel} className="h-3 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatXP(playerProgress.currentXp)} XP</span>
                <span>{formatXP(playerProgress.xpToNextLevel - playerProgress.currentXp)} XP to Level {playerProgress.level + 1}</span>
              </div>
              
              <div className="mt-6 flex justify-between">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">{formatXP(playerProgress.totalXp)}</span>
                  <span className="text-xs text-muted-foreground">Total XP</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">{playerProgress.level}</span>
                  <span className="text-xs text-muted-foreground">Level</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">{playerProgress.streak}</span>
                  <span className="text-xs text-muted-foreground">Day Streak</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                View MyPlayer Path
              </Button>
            </CardFooter>
          </Card>

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
              {playerProgress.skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">Level {skill.level}</span>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                </div>
              ))}
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

            <TabsContent value="history" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    XP Transactions
                  </CardTitle>
                  <CardDescription>
                    Recent activities and earned experience points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">XP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {playerProgress.recentTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getTransactionIcon(transaction.type)}
                              <span className="capitalize">{transaction.type}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            +{transaction.amount} XP
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

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
                              {badge.earned ? "Completed" : "In Progress"}
                            </Badge>
                            {badge.tier !== "None" && <Badge variant="outline">{badge.tier}</Badge>}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="challenges" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5" />
                    Available Challenges
                  </CardTitle>
                  <CardDescription>
                    Complete challenges to earn bonus XP
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {playerProgress.availableChallenges.map((challenge) => (
                      <Card key={challenge.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{challenge.name}</CardTitle>
                            <Badge 
                              variant={
                                challenge.difficulty === "Easy" ? "outline" :
                                challenge.difficulty === "Medium" ? "secondary" : "destructive"
                              }
                            >
                              {challenge.difficulty}
                            </Badge>
                          </div>
                          <CardDescription>{challenge.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-muted-foreground">{challenge.deadline}</span>
                            </div>
                            <div className="flex items-center text-sm font-medium">
                              <Zap className="h-4 w-4 mr-1 text-yellow-400" />
                              <span>{challenge.reward} XP Reward</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => acceptChallengeMutation.mutate(challenge.id)}
                            disabled={acceptChallengeMutation.isPending}
                          >
                            {acceptChallengeMutation.isPending ? (
                              <>
                                <span className="mr-2">Accepting...</span>
                                <Activity className="h-4 w-4 animate-spin" />
                              </>
                            ) : (
                              "Accept Challenge"
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    XP Leaderboard
                  </CardTitle>
                  <CardDescription>
                    See how you rank among other players
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Rank</TableHead>
                          <TableHead>Player</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead className="text-right">Total XP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 12 }, (_, i) => ({
                          id: i + 1,
                          name: i === 3 ? user?.name || "You" : `Player ${i + 1}`,
                          level: Math.floor(Math.random() * 10) + 20,
                          totalXp: Math.floor(Math.random() * 50000) + 120000,
                          isCurrentUser: i === 3
                        }))
                          .sort((a, b) => b.totalXp - a.totalXp)
                          .map((player, index) => (
                            <TableRow key={player.id} className={player.isCurrentUser ? "bg-muted/30" : ""}>
                              <TableCell className="font-medium">
                                {index < 3 ? (
                                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs">
                                    {index === 0 && <Trophy className="h-4 w-4 text-yellow-400" />}
                                    {index === 1 && <Trophy className="h-4 w-4 text-slate-400" />}
                                    {index === 2 && <Trophy className="h-4 w-4 text-amber-600" />}
                                  </div>
                                ) : (
                                  index + 1
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{player.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className={player.isCurrentUser ? "font-medium" : ""}>
                                    {player.name}
                                    {player.isCurrentUser && " (You)"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>Level {player.level}</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatXP(player.totalXp)} XP
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}