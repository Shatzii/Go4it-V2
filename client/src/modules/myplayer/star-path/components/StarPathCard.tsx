/**
 * StarPathCard Component
 * 
 * Displays an athlete's progress through the Star Path system with a visual indicator
 * of their current star level and progress toward the next level.
 */

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StarIcon, Trophy, Award, Medal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "wouter";
import { Button } from "@/components/ui/button";

// Define interface for component props
export interface StarPathCardProps {
  userId: number;
  currentStarLevel: number;
  targetStarLevel: number;
  progress: number;
  sportType: string;
  position?: string;
  streakDays?: number;
  xpTotal?: number;
  completedDrills?: number;
  verifiedWorkouts?: number;
  nextMilestone?: string;
  className?: string;
}

/**
 * Maps star level to its display name
 */
const getStarLevelName = (level: number): string => {
  switch (level) {
    case 1:
      return "Rising Prospect";
    case 2:
      return "Emerging Talent";
    case 3:
      return "Standout Performer";
    case 4:
      return "Elite Prospect";
    case 5:
      return "Five-Star Athlete";
    default:
      return "Rookie";
  }
};

/**
 * Returns color based on star level
 */
const getStarColor = (level: number): string => {
  switch (level) {
    case 1:
      return "text-blue-400";
    case 2:
      return "text-cyan-400";
    case 3:
      return "text-emerald-400";
    case 4:
      return "text-amber-400";
    case 5:
      return "text-purple-400";
    default:
      return "text-slate-400";
  }
};

export const StarPathCard = ({
  userId,
  currentStarLevel,
  targetStarLevel,
  progress,
  sportType,
  position,
  streakDays = 0,
  xpTotal = 0,
  completedDrills = 0,
  verifiedWorkouts = 0,
  nextMilestone = "",
  className = "",
}: StarPathCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  // Navigate to detailed star path page for this user
  const handleViewDetails = () => {
    navigate(`/myplayer/star-path/${userId}`);
  };

  // Display stars based on current level
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-5 w-5 ${i <= currentStarLevel ? getStarColor(currentStarLevel) : "text-gray-300"}`}
          fill={i <= currentStarLevel ? "currentColor" : "none"}
        />
      );
    }
    return stars;
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Star Path</CardTitle>
          <Badge variant="outline" className="bg-blue-900/20">
            {sportType} {position && `| ${position}`}
          </Badge>
        </div>
        <CardDescription>Your path to athletic excellence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1">{renderStars()}</div>
          <Badge className="bg-blue-600 hover:bg-blue-700">
            {getStarLevelName(currentStarLevel)}
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1 text-sm font-medium">
              <span>Progress to {getStarLevelName(currentStarLevel + 1)}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {showDetails && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex flex-col items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Trophy className="h-5 w-5 text-amber-500 mb-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">XP Total</span>
                <span className="font-bold">{xpTotal.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Award className="h-5 w-5 text-emerald-500 mb-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Drills</span>
                <span className="font-bold">{completedDrills}</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Medal className="h-5 w-5 text-blue-500 mb-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Workouts</span>
                <span className="font-bold">{verifiedWorkouts}</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center justify-center h-5 w-5 text-red-500 mb-1">
                  🔥
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Streak</span>
                <span className="font-bold">{streakDays} days</span>
              </div>
            </div>
          )}

          {nextMilestone && (
            <div className="mt-2 text-sm">
              <span className="font-semibold">Next milestone:</span> {nextMilestone}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide" : "Show"} Details
        </Button>
        <Button size="sm" onClick={handleViewDetails}>
          View Full Path
        </Button>
      </CardFooter>
    </Card>
  );
};