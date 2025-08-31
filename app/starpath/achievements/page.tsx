'use client';

import { useRouter } from 'next/navigation';
import { Trophy, Star, Target, Zap, Shield, Award, ArrowLeft, Lock } from 'lucide-react';

const achievements = [
  {
    id: 1,
    name: 'First Touch Master',
    description: 'Complete all ball control drills',
    icon: '⚽',
    earned: true,
    earnedDate: '2025-01-18',
    xpReward: 500,
    category: 'Technical',
  },
  {
    id: 2,
    name: 'Speed Demon',
    description: 'Achieve Level 5 in Agility & Speed',
    icon: '⚡',
    earned: true,
    earnedDate: '2025-01-15',
    xpReward: 750,
    category: 'Physical',
  },
  {
    id: 3,
    name: 'Consistency Streak',
    description: 'Train for 14 consecutive days',
    icon: '🔥',
    earned: true,
    earnedDate: '2025-01-10',
    xpReward: 300,
    category: 'Dedication',
  },
  {
    id: 4,
    name: 'Rising Star',
    description: 'Reach Tier 3 in StarPath',
    icon: '⭐',
    earned: true,
    earnedDate: '2025-01-05',
    xpReward: 1000,
    category: 'Progression',
  },
  {
    id: 5,
    name: 'Tactical Genius',
    description: 'Master all tactical awareness skills',
    icon: '🧠',
    earned: false,
    xpReward: 1200,
    category: 'Mental',
  },
  {
    id: 6,
    name: 'Elite Athlete',
    description: 'Reach Level 5 in all categories',
    icon: '🏆',
    earned: false,
    xpReward: 2500,
    category: 'Master',
  },
  {
    id: 7,
    name: 'Perfect Week',
    description: 'Complete all weekly challenges',
    icon: '✅',
    earned: false,
    xpReward: 600,
    category: 'Challenges',
  },
  {
    id: 8,
    name: 'Team Player',
    description: 'Unlock Team Leadership skills',
    icon: '🤝',
    earned: false,
    xpReward: 800,
    category: 'Leadership',
  },
];

const categories = [
  'All',
  'Technical',
  'Physical',
  'Mental',
  'Progression',
  'Dedication',
  'Master',
];

export default function AchievementsPage() {
  const router = useRouter();
  const earnedCount = achievements.filter((a) => a.earned).length;
  const totalXpEarned = achievements
    .filter((a) => a.earned)
    .reduce((sum, a) => sum + a.xpReward, 0);

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

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {earnedCount}/{achievements.length}
              </div>
              <div className="text-sm text-slate-400">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {totalXpEarned.toLocaleString()} XP
              </div>
              <div className="text-sm text-slate-400">Total Earned</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Achievements Gallery
          </h1>
          <p className="text-xl text-slate-300">Your journey to athletic excellence</p>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative rounded-xl p-6 transition-all duration-300 ${
                achievement.earned
                  ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-yellow-600/50 hover:scale-105'
                  : 'bg-slate-900/50 border border-slate-700 opacity-75'
              }`}
            >
              {/* Achievement Icon */}
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{achievement.icon}</div>
                {achievement.earned && (
                  <Star className="w-6 h-6 text-yellow-400 mx-auto" fill="currentColor" />
                )}
              </div>

              {/* Achievement Details */}
              <div className="text-center">
                <h3 className="text-lg font-bold mb-1">{achievement.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{achievement.description}</p>

                {/* Category Badge */}
                <span className="inline-block px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded mb-3">
                  {achievement.category}
                </span>

                {/* XP Reward */}
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">
                    +{achievement.xpReward} XP
                  </span>
                </div>

                {/* Earned Date */}
                {achievement.earned && achievement.earnedDate && (
                  <p className="text-xs text-slate-500 mt-2">
                    Earned: {new Date(achievement.earnedDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Lock Overlay for Unearned */}
              {!achievement.earned && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-900/60">
                  <Lock className="w-8 h-8 text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Overview */}
        <div className="mt-12 bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <h2 className="text-2xl font-bold mb-6">Achievement Progress</h2>

          <div className="space-y-6">
            {/* Overall Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Overall Completion</span>
                <span className="text-slate-400">
                  {Math.round((earnedCount / achievements.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(earnedCount / achievements.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Next Achievements */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-slate-300">Next Targets</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements
                  .filter((a) => !a.earned)
                  .slice(0, 3)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <p className="font-medium text-white">{achievement.name}</p>
                          <p className="text-xs text-slate-400">+{achievement.xpReward} XP</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Section */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 mb-4">
            Keep pushing your limits! Every achievement brings you closer to elite status.
          </p>
          <button
            onClick={() => router.push('/challenges')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
          >
            View Active Challenges
          </button>
        </div>
      </div>
    </div>
  );
}
