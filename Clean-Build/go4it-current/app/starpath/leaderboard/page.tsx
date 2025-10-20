'use client';

import { useRouter } from 'next/navigation';
import { Trophy, Star, TrendingUp, Medal, Crown, ArrowLeft } from 'lucide-react';

const leaderboardData = [
  {
    rank: 1,
    name: 'Alex Johnson',
    school: 'Lincoln High',
    xp: 12500,
    tier: 5,
    avatar: '👤',
    trend: 'up',
  },
  {
    rank: 2,
    name: 'Maria Garcia',
    school: 'Central Academy',
    xp: 11800,
    tier: 5,
    avatar: '👤',
    trend: 'same',
  },
  {
    rank: 3,
    name: 'David Chen',
    school: 'East Side Prep',
    xp: 10900,
    tier: 4,
    avatar: '👤',
    trend: 'up',
  },
  {
    rank: 4,
    name: 'You',
    school: 'Your School',
    xp: 9850,
    tier: 3,
    avatar: '⭐',
    trend: 'up',
    isCurrentUser: true,
  },
  {
    rank: 5,
    name: 'Sarah Williams',
    school: 'West High',
    xp: 9200,
    tier: 3,
    avatar: '👤',
    trend: 'down',
  },
  {
    rank: 6,
    name: 'James Miller',
    school: 'North Academy',
    xp: 8750,
    tier: 3,
    avatar: '👤',
    trend: 'up',
  },
  {
    rank: 7,
    name: 'Emma Davis',
    school: 'South Prep',
    xp: 8400,
    tier: 3,
    avatar: '👤',
    trend: 'same',
  },
  {
    rank: 8,
    name: 'Michael Brown',
    school: 'Valley High',
    xp: 7900,
    tier: 2,
    avatar: '👤',
    trend: 'up',
  },
  {
    rank: 9,
    name: 'Lisa Anderson',
    school: 'Hill Academy',
    xp: 7500,
    tier: 2,
    avatar: '👤',
    trend: 'down',
  },
  {
    rank: 10,
    name: 'Chris Wilson',
    school: 'River School',
    xp: 7100,
    tier: 2,
    avatar: '👤',
    trend: 'same',
  },
];

export default function LeaderboardPage() {
  const router = useRouter();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="text-slate-400">#{rank}</span>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default:
        return <span className="w-4 h-4 text-slate-500">—</span>;
    }
  };

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

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              Weekly
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              All Time
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            StarPath Leaderboard
          </h1>
          <p className="text-xl text-slate-300">Compete with athletes nationwide</p>
        </div>

        {/* Top 3 Showcase */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {leaderboardData.slice(0, 3).map((player, index) => (
            <div
              key={player.rank}
              className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border-2 ${
                index === 0
                  ? 'border-yellow-600 order-2 transform scale-105'
                  : index === 1
                    ? 'border-slate-400 order-1'
                    : 'border-orange-600 order-3'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{player.avatar}</div>
                <div className="mb-2">{getRankIcon(player.rank)}</div>
                <h3 className="text-lg font-bold mb-1">{player.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{player.school}</p>
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {player.xp.toLocaleString()} XP
                </div>
                <div className="flex items-center justify-center gap-1">
                  {Array.from({ length: player.tier }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold">Complete Rankings</h2>
          </div>

          <div className="divide-y divide-slate-700">
            {leaderboardData.map((player) => (
              <div
                key={player.rank}
                className={`p-4 hover:bg-slate-700/30 transition-colors ${
                  player.isCurrentUser ? 'bg-blue-900/20 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 text-center">{getRankIcon(player.rank)}</div>
                    <div className="text-2xl">{player.avatar}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white">{player.name}</p>
                        {player.isCurrentUser && (
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{player.school}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: player.tier }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-yellow-400">
                        {player.xp.toLocaleString()} XP
                      </div>
                      <div className="text-sm text-slate-400">Tier {player.tier}</div>
                    </div>
                    <div className="w-8">{getTrendIcon(player.trend)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Stats */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-700/50">
          <h3 className="text-xl font-bold mb-4">Your Progress</h3>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-400 mb-1">Current Rank</p>
              <p className="text-2xl font-bold text-white">#4</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Total XP</p>
              <p className="text-2xl font-bold text-yellow-400">9,850</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">To Next Rank</p>
              <p className="text-2xl font-bold text-blue-400">1,050 XP</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Weekly Change</p>
              <p className="text-2xl font-bold text-green-400">+3 ↑</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push('/challenges')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            View Challenges
          </button>
          <button
            onClick={() => router.push('/starpath')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Continue Training
          </button>
        </div>
      </div>
    </div>
  );
}
