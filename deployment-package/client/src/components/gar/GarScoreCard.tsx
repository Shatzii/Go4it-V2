import React from 'react';
import { 
  BarChart3, 
  BrainCircuit, 
  Dumbbell, 
  BookOpen,
  Heart, 
  Clock,
  Trophy,
  Activity
} from 'lucide-react';

interface GarScoreProps {
  overallScore: number;
  physicalScore: number;
  technicalScore: number;
  tacticalScore: number;
  mentalScore: number;
  academicScore: number;
  socialScore: number;
  athleteId?: number;
  sportType: string;
  showDetailedBreakdown?: boolean;
}

export function GarScoreCard({
  overallScore,
  physicalScore,
  technicalScore,
  tacticalScore,
  mentalScore,
  academicScore,
  socialScore,
  sportType,
  showDetailedBreakdown = false
}: GarScoreProps) {
  // Map scores to grades
  const getGrade = (score: number): string => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D+';
    if (score >= 45) return 'D';
    return 'F';
  };

  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Score items with icons
  const scoreItems = [
    { name: 'Physical', score: physicalScore, icon: <Dumbbell size={20} /> },
    { name: 'Technical', score: technicalScore, icon: <Activity size={20} /> },
    { name: 'Tactical', score: tacticalScore, icon: <BarChart3 size={20} /> },
    { name: 'Mental', score: mentalScore, icon: <BrainCircuit size={20} /> },
    { name: 'Academic', score: academicScore, icon: <BookOpen size={20} /> },
    { name: 'Social', score: socialScore, icon: <Heart size={20} /> },
  ];

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">GAR Score</h3>
            <p className="text-blue-200 text-sm">{sportType} Performance Rating</p>
          </div>
          <div className="flex items-center">
            <Trophy className="text-yellow-400 mr-2" size={20} />
            <div className="text-right">
              <p className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </p>
              <p className="text-sm text-white/80">{getGrade(overallScore)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Score bars */}
        <div className="space-y-3">
          {scoreItems.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                <div className={`${getScoreColor(item.score)} font-medium`}>
                  {item.score}
                </div>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    item.score >= 85 ? 'bg-green-500' : 
                    item.score >= 70 ? 'bg-blue-500' : 
                    item.score >= 50 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* NCAA eligibility indicator */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span className="text-sm">NCAA Eligibility</span>
            </div>
            <div className={academicScore >= 70 ? 'text-green-400' : 'text-yellow-400'}>
              {academicScore >= 70 ? 'On Track' : 'Needs Attention'}
            </div>
          </div>
        </div>

        {/* Additional detailed breakdown button */}
        {!showDetailedBreakdown && (
          <button className="w-full mt-4 text-center text-blue-400 text-sm hover:underline">
            View Detailed Breakdown
          </button>
        )}
      </div>
    </div>
  );
}