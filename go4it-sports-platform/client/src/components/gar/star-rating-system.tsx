import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Star, Trophy, TrendingUp, Award, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRating {
  stars: number;
  title: string;
  description: string;
  garRange: { min: number; max: number };
  color: string;
  bgColor: string;
  requirements: string[];
}

interface AthleteProfile {
  id: string;
  name: string;
  sport: string;
  garScore: number;
  starRating: number;
  level: string;
  achievements: string[];
  avatar: string;
  specialties: string[];
  recentImprovement: number;
}

const starRatingSystem: StarRating[] = [
  {
    stars: 1,
    title: "Developing Athlete",
    description: "Building foundational skills and understanding basic techniques",
    garRange: { min: 0, max: 20 },
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    requirements: [
      "Shows interest and effort in training",
      "Learning basic skills and rules",
      "Demonstrates coachability",
      "Consistent attendance at practice"
    ]
  },
  {
    stars: 2,
    title: "Emerging Talent",
    description: "Showing improvement and grasping fundamental concepts",
    garRange: { min: 21, max: 40 },
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    requirements: [
      "Consistent execution of basic skills",
      "Understanding of game fundamentals",
      "Positive attitude towards learning",
      "Beginning to show athletic potential"
    ]
  },
  {
    stars: 3,
    title: "Skilled Competitor",
    description: "Solid fundamentals with growing tactical awareness",
    garRange: { min: 41, max: 60 },
    color: "text-orange-500",
    bgColor: "bg-orange-100",
    requirements: [
      "Proficient in core sport skills",
      "Good tactical understanding",
      "Competitive performance in games",
      "Leadership qualities emerging"
    ]
  },
  {
    stars: 4,
    title: "Advanced Athlete",
    description: "Strong technical skills with strategic thinking abilities",
    garRange: { min: 61, max: 80 },
    color: "text-cyan-500",
    bgColor: "bg-cyan-100",
    requirements: [
      "Advanced technical proficiency",
      "Strategic game awareness",
      "Consistent high-level performance",
      "Mentors younger athletes"
    ]
  },
  {
    stars: 5,
    title: "Elite Performer",
    description: "Exceptional skills with potential for collegiate/professional level",
    garRange: { min: 81, max: 100 },
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    requirements: [
      "Elite technical and tactical skills",
      "Outstanding game performance",
      "Leadership and sportsmanship",
      "College/professional potential"
    ]
  }
];

const sampleProfiles: AthleteProfile[] = [
  {
    id: "1",
    name: "Alex Johnson",
    sport: "Basketball",
    garScore: 87.5,
    starRating: 5,
    level: "Elite",
    achievements: ["State Championship MVP", "All-Conference First Team", "3-Point Contest Winner"],
    avatar: "AJ",
    specialties: ["Three-Point Shooting", "Court Vision", "Leadership"],
    recentImprovement: 8.2
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    sport: "Soccer",
    garScore: 72.3,
    starRating: 4,
    level: "Advanced",
    achievements: ["Regional Tournament MVP", "Team Captain", "Golden Boot Winner"],
    avatar: "MR",
    specialties: ["Goal Scoring", "Ball Control", "Team Strategy"],
    recentImprovement: 6.5
  },
  {
    id: "3",
    name: "David Chen",
    sport: "Tennis",
    garScore: 58.7,
    starRating: 3,
    level: "Skilled",
    achievements: ["District Doubles Champion", "Most Improved Player", "Sportsmanship Award"],
    avatar: "DC",
    specialties: ["Serve Accuracy", "Mental Toughness", "Doubles Play"],
    recentImprovement: 12.4
  },
  {
    id: "4",
    name: "Emma Thompson",
    sport: "Swimming",
    garScore: 34.2,
    starRating: 2,
    level: "Emerging",
    achievements: ["Personal Best Improvements", "Team Spirit Award", "Perfect Attendance"],
    avatar: "ET",
    specialties: ["Freestyle Technique", "Training Dedication", "Goal Setting"],
    recentImprovement: 15.8
  },
  {
    id: "5",
    name: "Jordan Williams",
    sport: "Track & Field",
    garScore: 15.6,
    starRating: 1,
    level: "Developing",
    achievements: ["Most Enthusiastic Athlete", "Effort Award", "Coaching Excellence"],
    avatar: "JW",
    specialties: ["Sprint Potential", "Work Ethic", "Team Support"],
    recentImprovement: 8.9
  },
  {
    id: "6",
    name: "Sofia Patel",
    sport: "Volleyball",
    garScore: 65.8,
    starRating: 4,
    level: "Advanced",
    achievements: ["All-State Honorable Mention", "Block Leader", "Academic All-Star"],
    avatar: "SP",
    specialties: ["Blocking", "Court Awareness", "Academic Excellence"],
    recentImprovement: 4.7
  }
];

export function getStarRatingFromGAR(garScore: number): StarRating {
  return starRatingSystem.find(rating => 
    garScore >= rating.garRange.min && garScore <= rating.garRange.max
  ) || starRatingSystem[0];
}

export function StarDisplay({ rating, size = "md", showLabel = false }: { 
  rating: number; 
  size?: "sm" | "md" | "lg"; 
  showLabel?: boolean;
}) {
  const starSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4";
  const starRating = getStarRatingFromGAR(rating);
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= starRating.stars
                ? "fill-cyan-400 text-cyan-400"
                : "fill-slate-700 text-slate-700"
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className={cn("text-sm font-medium", starRating.color)}>
          {starRating.title}
        </span>
      )}
    </div>
  );
}

export default function StarRatingSystem() {
  const [selectedProfile, setSelectedProfile] = useState<AthleteProfile | null>(null);

  const renderStarRatingGuide = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">GAR Star Rating System</h3>
      {starRatingSystem.map((rating, index) => (
        <motion.div
          key={rating.stars}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={cn("border-2", rating.bgColor)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-5 h-5",
                          star <= rating.stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{rating.title}</h4>
                    <p className="text-sm text-gray-600">{rating.description}</p>
                  </div>
                </div>
                <Badge className={cn("font-medium", rating.color, rating.bgColor)}>
                  GAR {rating.garRange.min}-{rating.garRange.max}
                </Badge>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Key Requirements:</h5>
                <ul className="space-y-1">
                  {rating.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderAthleteProfiles = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Sample Athlete Profiles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleProfiles.map((profile, index) => {
          const starRating = getStarRatingFromGAR(profile.garScore);
          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300"
                onClick={() => setSelectedProfile(profile)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {profile.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold">{profile.name}</h4>
                        <p className="text-sm text-gray-600">{profile.sport}</p>
                      </div>
                    </div>
                    <Badge className={cn("text-xs", starRating.color, starRating.bgColor)}>
                      {profile.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* GAR Score and Stars */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{profile.garScore}</div>
                        <div className="text-xs text-gray-500">GAR Score</div>
                      </div>
                      <div className="text-right">
                        <StarDisplay rating={profile.garScore} size="md" />
                        <div className="text-xs text-gray-500 mt-1">{starRating.title}</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress to Next Level</span>
                        <span>+{profile.recentImprovement}%</span>
                      </div>
                      <Progress 
                        value={((profile.garScore - starRating.garRange.min) / (starRating.garRange.max - starRating.garRange.min)) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Specialties */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Specialties</div>
                      <div className="flex flex-wrap gap-1">
                        {profile.specialties.slice(0, 2).map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {profile.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Recent Achievement */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Latest Achievement</div>
                      <div className="text-sm font-medium">{profile.achievements[0]}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderProfileDetail = () => {
    if (!selectedProfile) return null;
    
    const starRating = getStarRatingFromGAR(selectedProfile.garScore);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => setSelectedProfile(null)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {selectedProfile.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedProfile.name}</h2>
                <p className="text-gray-600">{selectedProfile.sport} Athlete</p>
                <StarDisplay rating={selectedProfile.garScore} size="lg" showLabel />
              </div>
            </div>
            <button
              onClick={() => setSelectedProfile(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{selectedProfile.garScore}</div>
                    <div className="text-sm text-gray-600">Current GAR Score</div>
                    <div className="mt-2">
                      <StarDisplay rating={selectedProfile.garScore} size="md" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">+{selectedProfile.recentImprovement}%</div>
                      <div className="text-xs text-gray-600">Recent Growth</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">{selectedProfile.starRating}/5</div>
                      <div className="text-xs text-gray-600">Star Rating</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Progress to Next Level</div>
                    <Progress 
                      value={((selectedProfile.garScore - starRating.garRange.min) / (starRating.garRange.max - starRating.garRange.min)) * 100} 
                      className="h-3"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(((selectedProfile.garScore - starRating.garRange.min) / (starRating.garRange.max - starRating.garRange.min)) * 100)}% to {starRating.stars < 5 ? `${starRating.stars + 1} stars` : 'Elite Maximum'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements & Specialties */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements & Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      Achievements
                    </h4>
                    <div className="space-y-2">
                      {selectedProfile.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Award className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Development Level
                    </h4>
                    <Badge className={cn("text-sm", starRating.color, starRating.bgColor)}>
                      {starRating.title}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">{starRating.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="go4it-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6" />
            GAR Star Rating System
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="bg-white rounded-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {renderStarRatingGuide()}
          </div>
          <div>
            {renderAthleteProfiles()}
          </div>
        </div>
      </div>

      {renderProfileDetail()}
    </div>
  );
}