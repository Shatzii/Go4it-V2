import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Link } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  Trophy, 
  Star, 
  Zap, 
  Dumbbell, 
  Brain, 
  Activity, 
  BookOpen, 
  MapPin, 
  Video, 
  Clock,
  Flame,
  BarChart,
} from 'lucide-react';
import PlayerAnimation from '@/components/my-player/PlayerAnimation';

interface PlayerStats {
  physical: {
    strength: number;
    speed: number;
    agility: number;
    endurance: number;
    verticalJump: number;
  };
  technical: {
    technique: number;
    ballControl: number;
    accuracy: number;
    gameIQ: number;
  };
  mental: {
    focus: number;
    confidence: number;
    determination: number;
    teamwork: number;
  };
}

interface PlayerProgress {
  level: number;
  xp: number;
  xpForNextLevel: number;
  rank: string;
  streakDays: number;
  avatar?: string;
  playerStats: PlayerStats;
  achievements: Array<{id: number, name: string, description: string, earned: boolean}>;
  sportType: string;
  position: string;
  starPath: {
    level: number;
    title: string;
    progress: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    xpGained: number;
    timestamp: string;
  }>;
}

export default function MyPlayerInterface() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeMode, setActiveMode] = useState<'field' | 'locker'>('field');
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false);
  const [trainingFocus, setTrainingFocus] = useState('');
  const [animationState, setAnimationState] = useState('idle');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Fetch player progress data
  const { data: progress, isLoading } = useQuery<PlayerProgress>({
    queryKey: ['/api/player/progress'],
    enabled: !!user,
  });
  
  // Animation effects
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setAnimationState('idle');
        
        toast({
          title: "Training Complete!",
          description: `You gained +25 XP for ${trainingFocus} training`,
          variant: "default",
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating, toast, trainingFocus]);
  
  // Start training session
  const startTraining = () => {
    setIsTrainingDialogOpen(false);
    setIsAnimating(true);
    setAnimationState(
      trainingFocus === 'Speed' || trainingFocus === 'Agility' 
        ? 'running' 
        : trainingFocus === 'Strength' 
          ? 'lifting' 
          : 'dribbling'
    );
  };
  
  // Placeholder data if still loading
  const playerData = progress || {
    level: 1,
    xp: 0,
    xpForNextLevel: 100,
    rank: "Rookie",
    streakDays: 0,
    playerStats: {
      physical: { strength: 60, speed: 65, agility: 70, endurance: 60, verticalJump: 50 },
      technical: { technique: 55, ballControl: 60, accuracy: 50, gameIQ: 45 },
      mental: { focus: 65, confidence: 60, determination: 75, teamwork: 70 }
    },
    achievements: [],
    sportType: "basketball",
    position: "guard",
    starPath: { level: 1, title: "Rising Prospect", progress: 30 },
    recentActivity: []
  };
  
  // Function to get stat color based on value
  const getStatColor = (value: number): string => {
    if (value >= 90) return 'text-purple-500';
    if (value >= 80) return 'text-blue-500';
    if (value >= 70) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    if (value >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  // Calculate overall rating
  const calculateOverall = (stats: PlayerStats): number => {
    const physicalAvg = Object.values(stats.physical).reduce((a, b) => a + b, 0) / Object.values(stats.physical).length;
    const technicalAvg = Object.values(stats.technical).reduce((a, b) => a + b, 0) / Object.values(stats.technical).length;
    const mentalAvg = Object.values(stats.mental).reduce((a, b) => a + b, 0) / Object.values(stats.mental).length;
    
    return Math.round((physicalAvg * 0.4) + (technicalAvg * 0.4) + (mentalAvg * 0.2));
  };
  
  const overall = playerData ? calculateOverall(playerData.playerStats) : 0;
  
  // Background colors for different sport types
  const sportBgColors = {
    basketball: "from-orange-900/80 to-orange-700/50",
    football: "from-green-900/80 to-green-700/50",
    soccer: "from-emerald-900/80 to-emerald-700/50",
    baseball: "from-blue-900/80 to-blue-700/50",
    volleyball: "from-pink-900/80 to-pink-700/50",
    default: "from-slate-900/80 to-slate-700/50"
  };
  
  const bgColor = playerData?.sportType 
    ? sportBgColors[playerData.sportType as keyof typeof sportBgColors] || sportBgColors.default
    : sportBgColors.default;
  
  // Format large numbers
  const formatNumber = (num: number): string => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
  };
  
  // Handler for clicking on a stat to train
  const handleStatClick = (statCategory: string, statName: string) => {
    setTrainingFocus(`${statName}`);
    setIsTrainingDialogOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-[80vh]">
        <div className="text-center animate-pulse">
          <h2 className="text-2xl font-bold mb-4">Loading Player Data...</h2>
          <div className="h-4 w-48 bg-gray-300 rounded mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-gray-300 rounded mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      {/* Main Tabs for switching between modes */}
      <Tabs 
        defaultValue="field" 
        className="mb-8"
        onValueChange={(value) => setActiveMode(value as 'field' | 'locker')}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">MyPlayer</h1>
            <p className="text-muted-foreground mt-1">
              Level up your skills and track your development
            </p>
          </div>
          
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="field" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>On the Field</span>
            </TabsTrigger>
            <TabsTrigger value="locker" className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              <span>Locker Room</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Field View - Game visualization */}
        <TabsContent value="field" className="m-0">
          <div className="grid grid-cols-1 gap-6">
            <div className={`relative h-[500px] rounded-xl overflow-hidden bg-gradient-to-b ${bgColor} shadow-lg mb-6`}>
              <div className="absolute top-6 left-6 z-10">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                      {overall}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{playerData.rank}</h3>
                      <p className="text-white/70 text-sm capitalize">{playerData.position} • {playerData.sportType}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mt-2">
                    <Badge variant="secondary" className="bg-white/10 text-white border-none">
                      <Star className="w-3 h-3 mr-1 text-yellow-400" />
                      {playerData.starPath.title}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white border-none">
                      Level {playerData.level}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/10 text-white border-none">
                      <Flame className="w-3 h-3 mr-1 text-orange-400" />
                      {playerData.streakDays} day streak
                    </Badge>
                  </div>
                </motion.div>
              </div>
              
              {/* XP Progress */}
              <div className="absolute bottom-6 left-0 right-0 z-10 px-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10"
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-white text-sm">{formatNumber(playerData.xp)} / {formatNumber(playerData.xpForNextLevel)} XP</span>
                    <span className="text-white text-sm">{Math.round((playerData.xp / playerData.xpForNextLevel) * 100)}%</span>
                  </div>
                  <Progress value={(playerData.xp / playerData.xpForNextLevel) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-white/70 mt-1">
                    <span>Level {playerData.level}</span>
                    <span>Level {playerData.level + 1}</span>
                  </div>
                </motion.div>
              </div>
              
              {/* 3D Player Visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayerAnimation 
                  position={{ x: 0, y: 0 }} 
                  color="#3b82f6" 
                  isUser={true} 
                  size="lg"
                  animationState={animationState}
                  jersey={playerData.level.toString()}
                  name={user?.name || "Player"}
                />
              </div>
            </div>
            
            {/* Stat Categories */}
            <div className="grid grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                    <CardTitle className="flex items-center text-lg">
                      <Dumbbell className="w-5 h-5 mr-2" />
                      Physical
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Speed, strength and physical abilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {Object.entries(playerData.playerStats.physical).map(([key, value]) => (
                        <div key={key} onClick={() => handleStatClick('physical', key)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="capitalize font-medium">{key}</span>
                            <span className={`font-bold ${getStatColor(value)}`}>{value}</span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-900 to-green-700 text-white">
                    <CardTitle className="flex items-center text-lg">
                      <Activity className="w-5 h-5 mr-2" />
                      Technical
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Sport-specific skills and technique
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {Object.entries(playerData.playerStats.technical).map(([key, value]) => (
                        <div key={key} onClick={() => handleStatClick('technical', key)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="capitalize font-medium">{key}</span>
                            <span className={`font-bold ${getStatColor(value)}`}>{value}</span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-900 to-purple-700 text-white">
                    <CardTitle className="flex items-center text-lg">
                      <Brain className="w-5 h-5 mr-2" />
                      Mental
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Focus, confidence and mental toughness
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {Object.entries(playerData.playerStats.mental).map(([key, value]) => (
                        <div key={key} onClick={() => handleStatClick('mental', key)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="capitalize font-medium">{key}</span>
                            <span className={`font-bold ${getStatColor(value)}`}>{value}</span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button asChild>
                <Link href="/workout-verification">
                  <Video className="mr-2 h-4 w-4" />
                  Submit Workout for Verification
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Locker Room View - Stats and progress */}
        <TabsContent value="locker" className="m-0">
          <div className="grid grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="w-5 h-5 mr-2 text-primary" />
                  Development Progress
                </CardTitle>
                <CardDescription>
                  Track your growth across all skill areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Star Path Level</div>
                    <div className="text-2xl font-bold flex items-center">
                      <Star className="text-yellow-400 mr-2 h-5 w-5" />
                      {playerData.starPath.title}
                    </div>
                    <Progress value={playerData.starPath.progress} className="h-2 mt-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {playerData.starPath.progress}% to next level
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Overall Rating</div>
                    <div className="text-4xl font-bold">{overall}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Rank: {playerData.rank}
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Rating Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Physical</span>
                        <span className="text-sm font-medium">
                          {Math.round(Object.values(playerData.playerStats.physical).reduce((sum, val) => sum + val, 0) / 
                          Object.values(playerData.playerStats.physical).length)}
                        </span>
                      </div>
                      <Progress value={Object.values(playerData.playerStats.physical).reduce((sum, val) => sum + val, 0) / 
                        Object.values(playerData.playerStats.physical).length} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Technical</span>
                        <span className="text-sm font-medium">
                          {Math.round(Object.values(playerData.playerStats.technical).reduce((sum, val) => sum + val, 0) / 
                          Object.values(playerData.playerStats.technical).length)}
                        </span>
                      </div>
                      <Progress value={Object.values(playerData.playerStats.technical).reduce((sum, val) => sum + val, 0) / 
                        Object.values(playerData.playerStats.technical).length} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Mental</span>
                        <span className="text-sm font-medium">
                          {Math.round(Object.values(playerData.playerStats.mental).reduce((sum, val) => sum + val, 0) / 
                          Object.values(playerData.playerStats.mental).length)}
                        </span>
                      </div>
                      <Progress value={Object.values(playerData.playerStats.mental).reduce((sum, val) => sum + val, 0) / 
                        Object.values(playerData.playerStats.mental).length} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest training and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {playerData.recentActivity && playerData.recentActivity.length > 0 ? (
                    playerData.recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {activity.type === 'workout' && <Dumbbell className="h-4 w-4 text-primary" />}
                          {activity.type === 'achievement' && <Trophy className="h-4 w-4 text-yellow-500" />}
                          {activity.type === 'skill' && <Brain className="h-4 w-4 text-purple-500" />}
                          {activity.type === 'academic' && <BookOpen className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </span>
                            <Badge variant="outline" className="font-medium">
                              +{activity.xpGained} XP
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No recent activity</p>
                      <p className="text-xs text-muted-foreground mt-1">Complete workouts to see your progress here</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/myplayer-xp">View Full History</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mt-6">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-primary" />
                  Training Achievements
                </CardTitle>
                <CardDescription>
                  Skills mastered and milestones reached
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {playerData.achievements && playerData.achievements.length > 0 ? (
                    playerData.achievements.map(achievement => (
                      <Card key={achievement.id} className={`border ${achievement.earned ? 'border-yellow-400 dark:border-yellow-600' : 'border-gray-200 dark:border-gray-700 opacity-60'}`}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${achievement.earned ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                              {achievement.earned ? (
                                <Star className={`h-6 w-6 text-yellow-500`} />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <h4 className="font-medium">{achievement.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-6">
                      <Trophy className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="font-medium mb-1">No achievements yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete training and workouts to earn achievements
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Training Dialog */}
      <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Train {trainingFocus}</DialogTitle>
            <DialogDescription>
              Improve your {trainingFocus} attribute through targeted training drills
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" />
                <span className="font-medium">{trainingFocus} Drill</span>
              </div>
              <Badge>+25 XP</Badge>
            </div>
            
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm">
                {trainingFocus === 'Strength' && "Complete a series of resistance exercises focused on building muscle power and strength."}
                {trainingFocus === 'Speed' && "Train with high-intensity sprints and agility drills to improve your quickness."}
                {trainingFocus === 'Agility' && "Practice lateral movements and quick directional changes to enhance your agility."}
                {trainingFocus === 'Endurance' && "Build stamina through extended cardio workouts and interval training."}
                {trainingFocus === 'VerticalJump' && "Improve your vertical leap with plyometric exercises and jump training."}
                {trainingFocus === 'Technique' && "Focus on proper form and execution of sport-specific movements."}
                {trainingFocus === 'BallControl' && "Practice handling and controlling the ball with precision drills."}
                {trainingFocus === 'Accuracy' && "Enhance your precision with targeted shooting or passing exercises."}
                {trainingFocus === 'GameIQ' && "Develop your tactical understanding through film study and game scenarios."}
                {trainingFocus === 'Focus' && "Improve concentration with mindfulness and attention training exercises."}
                {trainingFocus === 'Confidence' && "Build self-belief through visualization and positive reinforcement techniques."}
                {trainingFocus === 'Determination' && "Strengthen mental toughness with challenging high-pressure drills."}
                {trainingFocus === 'Teamwork' && "Enhance collaboration skills through team-based exercises and communication drills."}
              </p>
              
              <div className="mt-4">
                <span className="text-xs text-muted-foreground">Estimated time: 15-30 minutes</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrainingDialogOpen(false)}>Cancel</Button>
            <Button onClick={startTraining}>Start Training</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}