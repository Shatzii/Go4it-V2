import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Zap, Star, TrendingUp, Calendar, Award, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface MotivationalDashboardProps {
  user: any;
  stats: {
    weeklyGoal: number;
    weeklyProgress: number;
    streak: number;
    totalXP: number;
    level: number;
    nextLevelXP: number;
    achievements: number;
    recentActivity: string[];
  };
}

export default function MotivationalDashboard({ user, stats }: MotivationalDashboardProps) {
  const motivationalMessages = [
    "You're crushing it! Keep up the amazing work!",
    "Every small step forward is progress!",
    "Your dedication is inspiring!",
    "You're stronger than you think!",
    "Focus on progress, not perfection!",
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-6 border border-primary/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Welcome back, {user?.firstName || "Champion"}! 🌟
            </h2>
            <p className="text-muted-foreground text-lg">{randomMessage}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-xl font-bold">Level {stats.level}</span>
            </div>
            <Badge variant="secondary" className="text-sm">
              {stats.totalXP} XP Total
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Target className="w-4 h-4 text-primary" />
                Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{stats.weeklyProgress}</span>
                  <span className="text-sm text-muted-foreground">/ {stats.weeklyGoal}</span>
                </div>
                <Progress 
                  value={(stats.weeklyProgress / stats.weeklyGoal) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}% complete
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Flame className="w-4 h-4 text-orange-500" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-orange-500">{stats.streak}</div>
                <p className="text-xs text-muted-foreground">days in a row</p>
                <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-500">
                  Keep it up!
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Zap className="w-4 h-4 text-purple-500" />
                Next Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">{stats.totalXP % 1000}</span>
                  <span className="text-sm text-muted-foreground">/ {stats.nextLevelXP}</span>
                </div>
                <Progress 
                  value={((stats.totalXP % 1000) / stats.nextLevelXP) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {stats.nextLevelXP - (stats.totalXP % 1000)} XP to level up
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-500">{stats.achievements}</div>
                <p className="text-xs text-muted-foreground">unlocked</p>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{activity}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity yet. Start your journey!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}