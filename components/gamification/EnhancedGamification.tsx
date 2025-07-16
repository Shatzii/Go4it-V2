'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, Target, Zap, Award, Calendar, Users, TrendingUp, Gift, CheckCircle, Lock, Flame } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'performance' | 'training' | 'social' | 'academic' | 'milestone'
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress: number
  maxProgress: number
  isUnlocked: boolean
  unlockedAt?: Date
}

interface Challenge {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal'
  sport: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  points: number
  xp: number
  deadline: Date
  progress: number
  maxProgress: number
  isActive: boolean
  isCompleted: boolean
  participants: number
}

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar?: string
  sport: string
  level: number
  xp: number
  garScore: number
  achievements: number
  streak: number
}

interface UserStats {
  level: number
  xp: number
  totalXp: number
  xpToNextLevel: number
  achievements: Achievement[]
  currentStreak: number
  longestStreak: number
  totalPoints: number
  rank: number
  badges: string[]
}

export function EnhancedGamification() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchGamificationData()
  }, [])

  const fetchGamificationData = async () => {
    try {
      const [statsResponse, challengesResponse, leaderboardResponse] = await Promise.all([
        fetch('/api/gamification/stats'),
        fetch('/api/gamification/challenges'),
        fetch('/api/gamification/leaderboard')
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setUserStats(statsData.stats)
      }

      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json()
        setChallenges(challengesData.challenges)
      }

      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json()
        setLeaderboard(leaderboardData.leaderboard)
      }
    } catch (error) {
      console.error('Failed to fetch gamification data:', error)
    } finally {
      setLoading(false)
    }
  }

  const acceptChallenge = async (challengeId: string) => {
    try {
      const response = await fetch(`/api/gamification/challenges/${challengeId}/accept`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchGamificationData()
      }
    } catch (error) {
      console.error('Failed to accept challenge:', error)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-600'
      case 'rare': return 'text-blue-400 bg-blue-600'
      case 'epic': return 'text-purple-400 bg-purple-600'
      case 'legendary': return 'text-yellow-400 bg-yellow-600'
      default: return 'text-gray-400 bg-gray-600'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-600'
      case 'medium': return 'text-yellow-400 bg-yellow-600'
      case 'hard': return 'text-orange-400 bg-orange-600'
      case 'expert': return 'text-red-400 bg-red-600'
      default: return 'text-gray-400 bg-gray-600'
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* User Level Progress */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{userStats?.level}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Level {userStats?.level}</h3>
              <p className="text-blue-100">Rank #{userStats?.rank}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-white">{userStats?.xp.toLocaleString()} XP</p>
            <p className="text-blue-100">{userStats?.xpToNextLevel} to next level</p>
          </div>
        </div>
        
        <div className="bg-slate-700/50 rounded-full h-3 mb-2">
          <div 
            className="bg-slate-400 h-3 rounded-full transition-all duration-300"
            style={{ 
              width: `${userStats ? ((userStats.xp / (userStats.xp + userStats.xpToNextLevel)) * 100) : 0}%` 
            }}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{userStats?.achievements.length}</div>
            <div className="text-sm text-blue-100">Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
              <Flame className="w-5 h-5" />
              {userStats?.currentStreak}
            </div>
            <div className="text-sm text-blue-100">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{userStats?.totalPoints.toLocaleString()}</div>
            <div className="text-sm text-blue-100">Total Points</div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userStats?.achievements.slice(0, 4).map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{achievement.title}</h4>
                <p className="text-sm text-slate-400">{achievement.description}</p>
              </div>
              <div className={`px-2 py-1 rounded text-xs ${getRarityColor(achievement.rarity)}`}>
                {achievement.rarity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Challenges */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Active Challenges</h3>
        <div className="space-y-3">
          {challenges.filter(c => c.isActive).slice(0, 3).map((challenge) => (
            <div key={challenge.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{challenge.title}</h4>
                <p className="text-sm text-slate-400">{challenge.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-32 bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">
                    {challenge.progress}/{challenge.maxProgress}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white font-medium">+{challenge.points} pts</div>
                <div className="text-xs text-slate-400">+{challenge.xp} XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderChallenges = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Challenges</h2>
        <div className="flex gap-2">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Categories</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="seasonal">Seasonal</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{challenge.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                  {challenge.type}
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm mb-3">{challenge.description}</p>
            
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-white">{challenge.points} pts</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-white">{challenge.xp} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-green-500" />
                <span className="text-sm text-white">{challenge.participants}</span>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-400">Progress</span>
                <span className="text-sm text-white">
                  {challenge.progress}/{challenge.maxProgress}
                </span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Ends: {new Date(challenge.deadline).toLocaleDateString()}
              </span>
              {challenge.isActive ? (
                <div className="text-sm text-green-400">Active</div>
              ) : challenge.isCompleted ? (
                <div className="text-sm text-blue-400">Completed</div>
              ) : (
                <button
                  onClick={() => acceptChallenge(challenge.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Accept Challenge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Achievements</h2>
        <div className="flex gap-2">
          <select className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white">
            <option value="all">All Categories</option>
            <option value="performance">Performance</option>
            <option value="training">Training</option>
            <option value="social">Social</option>
            <option value="academic">Academic</option>
            <option value="milestone">Milestone</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userStats?.achievements.map((achievement) => (
          <div key={achievement.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl">{achievement.icon}</div>
              <div className={`px-2 py-1 rounded text-xs ${getRarityColor(achievement.rarity)}`}>
                {achievement.rarity}
              </div>
            </div>
            
            <h3 className="font-semibold text-white mb-1">{achievement.title}</h3>
            <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>
            
            {achievement.isUnlocked ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">
                  Unlocked {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : ''}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm text-white">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-slate-400">{achievement.category}</span>
              <span className="text-sm text-yellow-400">+{achievement.points} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
        <div className="flex gap-2">
          <select className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white">
            <option value="all">All Sports</option>
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="baseball">Baseball</option>
            <option value="soccer">Soccer</option>
          </select>
          <select className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="grid grid-cols-7 gap-4 text-sm font-medium text-slate-400">
            <div>Rank</div>
            <div>Player</div>
            <div>Sport</div>
            <div>Level</div>
            <div>XP</div>
            <div>GAR Score</div>
            <div>Achievements</div>
          </div>
        </div>
        
        <div className="divide-y divide-slate-700">
          {leaderboard.map((entry) => (
            <div key={entry.userId} className="p-4 hover:bg-slate-700 transition-colors">
              <div className="grid grid-cols-7 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1 ? 'bg-yellow-500 text-black' :
                    entry.rank === 2 ? 'bg-gray-400 text-black' :
                    entry.rank === 3 ? 'bg-orange-500 text-black' :
                    'bg-slate-600 text-white'
                  }`}>
                    {entry.rank}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {entry.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium">{entry.username}</span>
                </div>
                
                <div className="text-slate-400">{entry.sport}</div>
                <div className="text-white">{entry.level}</div>
                <div className="text-white">{entry.xp.toLocaleString()}</div>
                <div className="text-white">{entry.garScore.toFixed(1)}</div>
                <div className="text-white">{entry.achievements}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Gamification Hub</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'challenges', label: 'Challenges', icon: Trophy },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'challenges' && renderChallenges()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
      </div>
    </div>
  )
}