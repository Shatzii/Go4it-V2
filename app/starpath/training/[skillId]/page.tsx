'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Target, Trophy, Play, CheckCircle } from 'lucide-react';

const skillData: Record<string, any> = {
  'ball-control': {
    name: 'Ball Control Mastery',
    category: 'TECHNICAL',
    color: 'blue',
    currentLevel: 3,
    maxLevel: 5,
    xp: 750,
    maxXp: 1000,
    description: 'Master fundamental ball handling and control techniques',
    drills: [
      {
        id: 1,
        name: 'Stationary Dribbling',
        duration: '5 minutes',
        difficulty: 'Beginner',
        completed: true,
        xpReward: 50,
        instructions: [
          'Start with ball at waist height',
          'Dribble with fingertips, not palm',
          'Keep eyes up, not looking at ball',
          'Alternate between right and left hand',
        ],
      },
      {
        id: 2,
        name: 'Figure-8 Dribbling',
        duration: '10 minutes',
        difficulty: 'Intermediate',
        completed: false,
        xpReward: 100,
        instructions: [
          'Stand with feet shoulder-width apart',
          'Dribble ball in figure-8 pattern around legs',
          'Keep ball low and controlled',
          'Increase speed as you improve',
        ],
      },
      {
        id: 3,
        name: 'Speed Dribbling',
        duration: '15 minutes',
        difficulty: 'Advanced',
        completed: false,
        xpReward: 150,
        instructions: [
          'Start at baseline',
          'Sprint while maintaining dribble control',
          'Use alternating hands',
          'Focus on ball control at high speed',
        ],
      },
    ],
  },
  'agility-speed': {
    name: 'Agility & Speed',
    category: 'PHYSICAL',
    color: 'green',
    currentLevel: 2,
    maxLevel: 5,
    xp: 450,
    maxXp: 600,
    description: 'Develop explosive movement and directional changes',
    drills: [
      {
        id: 1,
        name: 'Ladder Drills',
        duration: '10 minutes',
        difficulty: 'Beginner',
        completed: true,
        xpReward: 75,
        instructions: [
          'Set up agility ladder',
          'High knees through each box',
          'Quick feet, stay on balls of feet',
          'Arms at 90 degrees, pump naturally',
        ],
      },
      {
        id: 2,
        name: 'Cone Sprints',
        duration: '15 minutes',
        difficulty: 'Intermediate',
        completed: false,
        xpReward: 125,
        instructions: [
          'Set up 5 cones in zigzag pattern',
          'Sprint to each cone',
          'Sharp cuts at each turn',
          'Focus on acceleration out of cuts',
        ],
      },
    ],
  },
  'tactical-awareness': {
    name: 'Tactical Awareness',
    category: 'MENTAL',
    color: 'purple',
    currentLevel: 4,
    maxLevel: 5,
    xp: 920,
    maxXp: 1200,
    description: 'Understand game situations and decision making',
    drills: [
      {
        id: 1,
        name: 'Film Study',
        duration: '20 minutes',
        difficulty: 'All Levels',
        completed: true,
        xpReward: 100,
        instructions: [
          'Watch professional game footage',
          'Identify tactical patterns',
          'Note player positioning',
          'Analyze decision-making moments',
        ],
      },
      {
        id: 2,
        name: 'Situational Awareness',
        duration: '15 minutes',
        difficulty: 'Advanced',
        completed: false,
        xpReward: 150,
        instructions: [
          'Practice head-up scanning',
          'Count teammates before receiving',
          'Identify open spaces',
          'Quick decision execution',
        ],
      },
    ],
  },
  'clinical-finishing': {
    name: 'Clinical Finishing',
    category: 'TECHNICAL',
    color: 'orange',
    currentLevel: 1,
    maxLevel: 5,
    xp: 150,
    maxXp: 400,
    description: 'Master shooting accuracy and composure',
    drills: [
      {
        id: 1,
        name: 'Target Practice',
        duration: '10 minutes',
        difficulty: 'Beginner',
        completed: false,
        xpReward: 60,
        instructions: [
          'Set up targets in goal corners',
          'Practice placement over power',
          'Use inside foot for accuracy',
          'Follow through toward target',
        ],
      },
      {
        id: 2,
        name: 'One-Touch Finishing',
        duration: '15 minutes',
        difficulty: 'Intermediate',
        completed: false,
        xpReward: 100,
        instructions: [
          'Receive passes from different angles',
          'Shoot with first touch',
          'Focus on technique not power',
          'Vary shot placement',
        ],
      },
    ],
  },
};

export default function SkillTrainingPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.skillId as string;
  const skill = skillData[skillId] || skillData['ball-control'];

  const [selectedDrill, setSelectedDrill] = useState<any>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [completedDrills, setCompletedDrills] = useState<number[]>([]);

  const handleStartDrill = (drill: any) => {
    setSelectedDrill(drill);
    setIsTraining(true);
    // Simulate training completion after 3 seconds
    setTimeout(() => {
      setIsTraining(false);
      if (!completedDrills.includes(drill.id)) {
        setCompletedDrills([...completedDrills, drill.id]);
      }
    }, 3000);
  };

  const totalXpEarned = skill.drills
    .filter((d: any) => d.completed || completedDrills.includes(d.id))
    .reduce((sum: number, d: any) => sum + d.xpReward, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/starpath')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to StarPath
          </button>
          <div className="text-right">
            <div className="text-sm text-slate-400">Total XP Earned</div>
            <div className="text-2xl font-bold text-yellow-400">+{totalXpEarned} XP</div>
          </div>
        </div>

        {/* Skill Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 mb-8 border border-slate-700">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{skill.name}</h1>
              <span
                className={`inline-block px-3 py-1 text-sm bg-${skill.color}-500 text-white rounded`}
              >
                {skill.category}
              </span>
              <p className="text-slate-300 mt-4">{skill.description}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                Level {skill.currentLevel}/{skill.maxLevel}
              </div>
              <div className="text-sm text-slate-400">
                {skill.xp}/{skill.maxXp} XP
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className={`bg-${skill.color}-400 h-3 rounded-full transition-all duration-500`}
              style={{ width: `${(skill.xp / skill.maxXp) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Training Drills */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Training Drills</h2>

          {skill.drills.map((drill: any) => {
            const isCompleted = drill.completed || completedDrills.includes(drill.id);

            return (
              <div
                key={drill.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
                  isCompleted ? 'border-green-600' : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{drill.name}</h3>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {drill.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {drill.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />+{drill.xpReward} XP
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartDrill(drill)}
                    disabled={isTraining}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      isCompleted
                        ? 'bg-green-600/20 text-green-400 border border-green-600'
                        : isTraining
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isCompleted ? 'Completed' : isTraining ? 'Training...' : 'Start Drill'}
                  </button>
                </div>

                {selectedDrill?.id === drill.id && (
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <h4 className="font-medium mb-3 text-slate-300">Instructions:</h4>
                    <ol className="space-y-2">
                      {drill.instructions.map((instruction: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 text-slate-400">
                          <span className="flex-shrink-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Coach Suggestion */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI Coach Recommendation
              </h3>
              <p className="text-slate-300">
                Based on your progress, try combining speed drills with ball control for maximum
                improvement.
              </p>
            </div>
            <button
              onClick={() => router.push('/ai-coach')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Get AI Coaching
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
