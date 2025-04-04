import { Achievement } from "@shared/schema";
import { 
  Award, 
  Trophy, 
  UserCheck, 
  FileCheck, 
  Star, 
  Zap,
  GraduationCap
} from "lucide-react";

interface AchievementsProps {
  achievements: Achievement[];
}

export function Achievements({ achievements }: AchievementsProps) {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  // Function to get the appropriate icon based on achievement type or icon type
  const getAchievementIcon = (achievement: Achievement) => {
    switch (achievement.iconType) {
      case "trophy":
        return <Trophy className="h-4 w-4 mr-1" />;
      case "profile":
        return <UserCheck className="h-4 w-4 mr-1" />;
      case "handshake":
        return <UserCheck className="h-4 w-4 mr-1" />;
      case "certificate":
        return <GraduationCap className="h-4 w-4 mr-1" />;
      default:
        // Fallback to achievement type if icon type is not specified
        switch (achievement.achievementType) {
          case "video":
            return <FileCheck className="h-4 w-4 mr-1" />;
          case "profile":
            return <UserCheck className="h-4 w-4 mr-1" />;
          case "ncaa":
            return <GraduationCap className="h-4 w-4 mr-1" />;
          case "connection":
            return <UserCheck className="h-4 w-4 mr-1" />;
          default:
            return <Award className="h-4 w-4 mr-1" />; // Default icon
        }
    }
  };

  // Function to get the appropriate color class based on achievement type
  const getAchievementColorClass = (achievement: Achievement) => {
    switch (achievement.achievementType) {
      case "video":
        return "bg-accent bg-opacity-10 text-accent";
      case "profile":
        return "bg-primary bg-opacity-10 text-primary";
      case "connection":
        return "bg-secondary bg-opacity-10 text-secondary";
      case "ncaa":
        return "bg-neutral bg-opacity-10 text-neutral";
      default:
        return "bg-primary bg-opacity-10 text-primary";
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-medium text-neutral mb-3">Recent Achievements</h3>
      <div className="flex flex-wrap gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`${getAchievementColorClass(achievement)} px-3 py-1.5 rounded-full text-sm font-medium flex items-center`}
            title={achievement.description}
          >
            {getAchievementIcon(achievement)}
            {achievement.title}
          </div>
        ))}
      </div>
    </div>
  );
}
