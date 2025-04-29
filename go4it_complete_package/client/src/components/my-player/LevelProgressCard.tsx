import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Sparkles, Trophy, Star, Award, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface LevelProgressCardProps {
  level: number;
  totalXp: number;
  levelXp: number;
  xpToNextLevel: number;
  streakDays: number;
  rank: string;
  levelUps?: Array<{ level: number; rank: string; isRankUp: boolean }>;
}

export default function LevelProgressCard({
  level,
  totalXp,
  levelXp,
  xpToNextLevel,
  streakDays,
  rank,
  levelUps,
}: LevelProgressCardProps) {
  // Calculate percentage to next level
  const percentToNextLevel = useMemo(() => {
    return (levelXp / xpToNextLevel) * 100;
  }, [levelXp, xpToNextLevel]);

  // Format XP with commas
  const formatXP = (xp: number) => {
    return xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get rank icon
  const getRankIcon = (rankName: string) => {
    switch(rankName) {
      case "Rookie": return <Star className="h-5 w-5 text-blue-400" />;
      case "Prospect": return <Star className="h-5 w-5 text-green-400" />;
      case "Rising Star": return <Star className="h-5 w-5 text-yellow-400" />;
      case "All-Star": return <Award className="h-5 w-5 text-orange-400" />;
      case "MVP": return <Trophy className="h-5 w-5 text-purple-400" />;
      case "Legend": return <Award className="h-5 w-5 text-red-400" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  // Get streak color
  const getStreakColor = () => {
    if (streakDays >= 30) return "text-red-500";
    if (streakDays >= 14) return "text-orange-500";
    if (streakDays >= 7) return "text-yellow-500";
    if (streakDays >= 3) return "text-blue-500";
    return "text-gray-500";
  };

  return (
    <Card className="overflow-hidden">
      {/* Show level up celebration if exists */}
      {levelUps && levelUps.length > 0 && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="font-medium">
              {levelUps.length === 1 
                ? "Level Up!" 
                : `${levelUps.length} Levels Gained!`}
            </span>
          </div>
          <Badge className="bg-white/20 hover:bg-white/30 text-white">
            {levelUps[levelUps.length - 1].rank}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getRankIcon(rank)}
            <div className="ml-2">
              <CardTitle className="text-2xl">Level {level}</CardTitle>
              <CardDescription className="flex items-center">
                {rank} Rank
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 px-3 py-1 ${getStreakColor()}`}
          >
            <Flame className={`h-4 w-4 ${getStreakColor()}`} />
            {streakDays} Day Streak
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Progress value={percentToNextLevel} className="h-3 mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatXP(levelXp)} XP</span>
          <span>{formatXP(xpToNextLevel - levelXp)} XP to Level {level + 1}</span>
        </div>
        
        <div className="mt-6 flex justify-between">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{formatXP(totalXp)}</span>
            <span className="text-xs text-muted-foreground">Total XP</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{level}</span>
            <span className="text-xs text-muted-foreground">Level</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{streakDays}</span>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href="/myplayer/star-path">
          <Button className="w-full" variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Star Path
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}