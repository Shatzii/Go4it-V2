import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/simplified-auth-context";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trophy, Award, Zap, Dumbbell, TrendingUp, Brain, Star } from "lucide-react";

// Skills and categories used in the StarPath system
interface Skill {
  id: number;
  name: string;
  category: "physical" | "technical" | "tactical" | "mental";
  description: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNextLevel: number;
  locked: boolean;
}

interface AchievementState {
  total: number;
  unlocked: number;
  recent: Array<{
    id: number;
    name: string;
    description: string;
    icon: string;
    date: string;
  }>;
}

// Mock StarPath data function - in real implementation, this would fetch from API
const fetchStarPathData = async (userId: number): Promise<{ skills: Skill[], achievements: AchievementState }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    skills: [
      {
        id: 1,
        name: "Speed",
        category: "physical",
        description: "Your ability to move quickly across the field/court",
        level: 3,
        maxLevel: 5,
        xp: 240,
        xpToNextLevel: 100,
        locked: false
      },
      {
        id: 2,
        name: "Strength",
        category: "physical",
        description: "Your physical power to overcome opposition",
        level: 2,
        maxLevel: 5,
        xp: 150,
        xpToNextLevel: 200,
        locked: false
      },
      {
        id: 3,
        name: "Shooting",
        category: "technical",
        description: "Your ability to score points accurately",
        level: 4,
        maxLevel: 5,
        xp: 320,
        xpToNextLevel: 180,
        locked: false
      },
      {
        id: 4,
        name: "Ball Handling",
        category: "technical",
        description: "Your control of the ball during movement",
        level: 3,
        maxLevel: 5,
        xp: 220,
        xpToNextLevel: 130,
        locked: false
      },
      {
        id: 5,
        name: "Game Awareness",
        category: "tactical",
        description: "Your ability to read the game and anticipate plays",
        level: 2,
        maxLevel: 5,
        xp: 180,
        xpToNextLevel: 170,
        locked: false
      },
      {
        id: 6,
        name: "Team Play",
        category: "tactical",
        description: "Your effectiveness working within a team strategy",
        level: 3,
        maxLevel: 5,
        xp: 210,
        xpToNextLevel: 140,
        locked: false
      },
      {
        id: 7,
        name: "Focus",
        category: "mental",
        description: "Your ability to maintain concentration during play",
        level: 3,
        maxLevel: 5,
        xp: 200,
        xpToNextLevel: 150,
        locked: false
      },
      {
        id: 8,
        name: "Resilience",
        category: "mental",
        description: "Your ability to bounce back from setbacks",
        level: 3,
        maxLevel: 5,
        xp: 230,
        xpToNextLevel: 120,
        locked: false
      },
      {
        id: 9,
        name: "Leadership",
        category: "mental",
        description: "Your ability to inspire and direct teammates",
        level: 1,
        maxLevel: 5,
        xp: 50,
        xpToNextLevel: 300,
        locked: false
      },
      {
        id: 10,
        name: "Elite Passing",
        category: "technical",
        description: "Master precision passes in high-pressure situations",
        level: 0,
        maxLevel: 5,
        xp: 0,
        xpToNextLevel: 500,
        locked: true
      }
    ],
    achievements: {
      total: 24,
      unlocked: 7,
      recent: [
        {
          id: 1,
          name: "Sharpshooter",
          description: "Score 10 three-pointers in practice sessions",
          icon: "🏆",
          date: "May 15, 2025"
        },
        {
          id: 2,
          name: "Endurance Master",
          description: "Complete 5 consecutive training sessions without missing a day",
          icon: "⚡",
          date: "May 10, 2025"
        },
        {
          id: 3,
          name: "Team Player",
          description: "Record 15 assists in game situations",
          icon: "🤝",
          date: "May 5, 2025"
        }
      ]
    }
  };
};

export const StarPathDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [starPathData, setStarPathData] = useState<{ skills: Skill[], achievements: AchievementState } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  useEffect(() => {
    const loadStarPathData = async () => {
      if (!user) return;
      
      try {
        const data = await fetchStarPathData(user.id);
        setStarPathData(data);
      } catch (error) {
        console.error("Error loading StarPath data:", error);
        toast({
          title: "StarPath Load Error",
          description: "Could not load your StarPath data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadStarPathData();
  }, [user, toast]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium text-gray-200">Loading StarPath data...</p>
      </div>
    );
  }
  
  if (!starPathData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-slate-900 rounded-xl p-6 text-white">
        <p className="text-xl font-bold mb-4">StarPath data unavailable</p>
        <p>Please try again later or contact support if the problem persists.</p>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "physical":
        return <Dumbbell className="h-5 w-5 text-green-400" />;
      case "technical":
        return <Zap className="h-5 w-5 text-blue-400" />;
      case "tactical":
        return <TrendingUp className="h-5 w-5 text-purple-400" />;
      case "mental":
        return <Brain className="h-5 w-5 text-yellow-400" />;
      default:
        return <Star className="h-5 w-5 text-white" />;
    }
  };
  
  const filteredSkills = selectedCategory === "all" 
    ? starPathData.skills 
    : starPathData.skills.filter(skill => skill.category === selectedCategory);
  
  return (
    <div className="w-full bg-slate-900 rounded-xl p-4 md:p-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">StarPath™ Dashboard</h2>
          <p className="text-slate-300 mt-1">Track your progression and unlock new skills</p>
        </div>
        
        {/* StarPath Level Overview */}
        <div className="flex items-center mt-4 md:mt-0 p-3 bg-slate-800 rounded-lg">
          <div className="mr-4 bg-blue-900/50 p-2 rounded-full">
            <Trophy className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-slate-300">StarPath Level</p>
            <p className="text-xl font-bold">{Math.floor(starPathData.skills.reduce((acc, skill) => acc + skill.level, 0) / 3)}</p>
          </div>
        </div>
      </div>
      
      {/* Achievements Summary */}
      <div className="mb-8 p-4 bg-slate-800/50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-400" />
            Achievements
          </h3>
          <span className="text-sm bg-slate-700 px-2 py-1 rounded">
            {starPathData.achievements.unlocked}/{starPathData.achievements.total}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {starPathData.achievements.recent.map(achievement => (
            <div key={achievement.id} className="bg-slate-700/50 p-3 rounded-lg flex items-start">
              <div className="text-2xl mr-3">{achievement.icon}</div>
              <div>
                <h4 className="font-medium text-white">{achievement.name}</h4>
                <p className="text-xs text-slate-300 mt-1">{achievement.description}</p>
                <p className="text-xs text-slate-400 mt-2">Unlocked: {achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Skills Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Skills & Abilities</h3>
          
          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                selectedCategory === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory("physical")}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap flex items-center ${
                selectedCategory === "physical" 
                  ? "bg-green-700 text-white" 
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <Dumbbell className="h-3 w-3 mr-1" />
              Physical
            </button>
            <button
              onClick={() => setSelectedCategory("technical")}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap flex items-center ${
                selectedCategory === "technical" 
                  ? "bg-blue-700 text-white" 
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <Zap className="h-3 w-3 mr-1" />
              Technical
            </button>
            <button
              onClick={() => setSelectedCategory("tactical")}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap flex items-center ${
                selectedCategory === "tactical" 
                  ? "bg-purple-700 text-white" 
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Tactical
            </button>
            <button
              onClick={() => setSelectedCategory("mental")}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap flex items-center ${
                selectedCategory === "mental" 
                  ? "bg-yellow-700 text-white" 
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <Brain className="h-3 w-3 mr-1" />
              Mental
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(skill => (
            <div 
              key={skill.id} 
              className={`p-4 rounded-lg relative ${
                skill.locked 
                  ? "bg-slate-800/30 opacity-70" 
                  : "bg-slate-800/60 hover:bg-slate-800/80 transition"
              }`}
            >
              {skill.locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-lg backdrop-blur-sm">
                  <div className="text-center p-4">
                    <span className="text-3xl">🔒</span>
                    <p className="mt-2 text-sm font-medium">Reach Level 4 to Unlock</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="mr-3">
                    {getCategoryIcon(skill.category)}
                  </div>
                  <div>
                    <h4 className="font-medium">{skill.name}</h4>
                    <p className="text-xs text-slate-400 capitalize">{skill.category}</p>
                  </div>
                </div>
                <div className="bg-slate-700 px-2 py-1 rounded text-xs font-medium">
                  Lv. {skill.level}
                </div>
              </div>
              
              <p className="text-xs text-slate-300 mb-3">{skill.description}</p>
              
              {/* XP Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>XP: {skill.xp}</span>
                  <span>Next: {skill.xp + skill.xpToNextLevel}</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      skill.category === "physical" ? "bg-green-500" :
                      skill.category === "technical" ? "bg-blue-500" :
                      skill.category === "tactical" ? "bg-purple-500" :
                      "bg-yellow-500"
                    }`}
                    style={{ width: `${(skill.xp / (skill.xp + skill.xpToNextLevel)) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-slate-400">
                    {skill.level}/{skill.maxLevel}
                  </span>
                  {skill.level < skill.maxLevel ? (
                    <span className="text-xs text-blue-400">
                      {skill.xpToNextLevel} XP to next level
                    </span>
                  ) : (
                    <span className="text-xs text-green-400">MAX LEVEL</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};