import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  XCircle
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

  // This would be fetched from the API in a real implementation
  const playerProgress = {
    id: 1,
    userId: user?.id || 1,
    level: 24,
    currentXp: 7850,
    xpToNextLevel: 10000,
    totalXp: 157850,
    streak: 15,
    lastActive: new Date().toISOString(),
    skills: [
      { name: "Ball Handling", level: 28, progress: 70 },
      { name: "Shooting", level: 32, progress: 45 },
      { name: "Defense", level: 22, progress: 80 },
      { name: "Passing", level: 26, progress: 60 },
      { name: "Speed", level: 24, progress: 30 },
      { name: "Strength", level: 19, progress: 50 },
    ],
    badges: [
      { id: 1, name: "Workout Warrior", description: "Complete 50 workouts", category: "Consistency", tier: "Gold", earned: true, progress: 100 },
      { id: 2, name: "Film Student", description: "Watch 25 film comparison videos", category: "Analysis", tier: "Silver", earned: true, progress: 100 },
      { id: 3, name: "Point Machine", description: "Record 10 games with 20+ points", category: "Performance", tier: "Bronze", earned: true, progress: 100 },
      { id: 4, name: "Sharpshooter", description: "Maintain 40%+ 3PT shooting for a season", category: "Performance", tier: "None", earned: false, progress: 65 },
      { id: 5, name: "Perfect Attendance", description: "Attend all team practices for a month", category: "Consistency", tier: "None", earned: false, progress: 75 },
      { id: 6, name: "Highlight Reel", description: "Get featured in the weekly highlights", category: "Recognition", tier: "None", earned: false, progress: 40 },
    ],
    recentTransactions: [
      { id: 1, date: "2024-04-05T10:30:00Z", amount: 250, type: "workout", description: "Completed advanced shooting drill" },
      { id: 2, date: "2024-04-04T15:45:00Z", amount: 100, type: "login", description: "Daily login streak bonus (15 days)" },
      { id: 3, date: "2024-04-03T19:20:00Z", amount: 500, type: "challenge", description: "Won 1v1 challenge against teammate" },
      { id: 4, date: "2024-04-02T12:15:00Z", amount: 350, type: "film", description: "Analyzed game film and completed quiz" },
      { id: 5, date: "2024-04-01T09:00:00Z", amount: 1000, type: "game", description: "Game performance: 24 points, 8 assists" },
      { id: 6, date: "2024-03-31T16:30:00Z", amount: 150, type: "workout", description: "Completed leg day workout" },
      { id: 7, date: "2024-03-30T14:00:00Z", amount: 200, type: "assessment", description: "Passed ball handling assessment" },
    ],
    availableChallenges: [
      { id: 1, name: "Film Room Master", description: "Analyze 5 game films this week", reward: 500, difficulty: "Medium", deadline: "3 days left" },
      { id: 2, name: "Conditioning Test", description: "Complete the beep test with level 12", reward: 750, difficulty: "Hard", deadline: "5 days left" },
      { id: 3, name: "Free Throw Perfection", description: "Make 25 free throws in a row", reward: 300, difficulty: "Easy", deadline: "2 days left" },
    ]
  };

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
                          <Button className="w-full" size="sm">
                            Accept Challenge
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