import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Medal, 
  Crown, 
  Flame, 
  Heart,
  Brain,
  Rocket,
  Shield,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'performance' | 'consistency' | 'improvement' | 'special';
  xpReward: number;
}

interface AchievementSystemProps {
  achievements: Achievement[];
  userLevel: number;
  totalXP: number;
}

export default function AchievementSystem({ achievements, userLevel, totalXP }: AchievementSystemProps) {
  const achievementIcons = {
    trophy: Trophy,
    star: Star,
    target: Target,
    zap: Zap,
    medal: Medal,
    crown: Crown,
    flame: Flame,
    heart: Heart,
    brain: Brain,
    rocket: Rocket,
    shield: Shield,
    sparkles: Sparkles
  };

  const typeColors = {
    bronze: 'text-amber-600 bg-amber-100 dark:bg-amber-900/20',
    silver: 'text-slate-600 bg-slate-100 dark:bg-slate-900/20',
    gold: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
    platinum: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
  };

  const categoryColors = {
    performance: 'border-blue-500/30 bg-blue-500/5',
    consistency: 'border-green-500/30 bg-green-500/5',
    improvement: 'border-purple-500/30 bg-purple-500/5',
    special: 'border-orange-500/30 bg-orange-500/5'
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const progressAchievements = achievements.filter(a => !a.unlocked && a.progress > 0);
  const lockedAchievements = achievements.filter(a => !a.unlocked && a.progress === 0);

  return (
    <div className="space-y-6">
      {/* Achievement Overview */}
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Achievement Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{unlockedAchievements.length}</div>
              <p className="text-sm text-muted-foreground">Unlocked</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{progressAchievements.length}</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{userLevel}</div>
              <p className="text-sm text-muted-foreground">Current Level</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{totalXP}</div>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Unlocks */}
      {unlockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Recently Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.slice(0, 6).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${categoryColors[achievement.category]}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${typeColors[achievement.type]}`}>
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          +{achievement.xpReward} XP
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${typeColors[achievement.type]}`}>
                          {achievement.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* In Progress */}
      {progressAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${categoryColors[achievement.category]}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${typeColors[achievement.type]}`}>
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <Badge variant="outline" className={`text-xs ${typeColors[achievement.type]}`}>
                          {achievement.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{achievement.progress} / {achievement.maxProgress}</span>
                          <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {achievement.maxProgress - achievement.progress} remaining
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            +{achievement.xpReward} XP
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-primary" />
            Achievement Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryColors).map(([category, colorClass]) => {
              const categoryAchievements = achievements.filter(a => a.category === category);
              const unlockedCount = categoryAchievements.filter(a => a.unlocked).length;
              
              return (
                <div key={category} className={`p-4 rounded-lg border ${colorClass}`}>
                  <h4 className="font-semibold capitalize mb-2">{category}</h4>
                  <div className="text-2xl font-bold mb-1">
                    {unlockedCount}/{categoryAchievements.length}
                  </div>
                  <Progress 
                    value={(unlockedCount / categoryAchievements.length) * 100} 
                    className="h-2"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Tips */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            Achievement Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <Heart className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <h4 className="font-medium">Take Your Time</h4>
                <p className="text-sm text-muted-foreground">
                  Achievements are about personal growth, not competition. Progress at your own pace.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <Flame className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <h4 className="font-medium">Consistency Matters</h4>
                <p className="text-sm text-muted-foreground">
                  Small, regular efforts are more valuable than occasional big pushes.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <Rocket className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-medium">Celebrate Success</h4>
                <p className="text-sm text-muted-foreground">
                  Every achievement unlocked is a step forward in your athletic journey.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}