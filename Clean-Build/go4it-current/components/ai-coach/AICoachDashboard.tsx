'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Target,
  Trophy,
  Star,
  Clock,
  CheckCircle,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  Settings,
  Cpu,
} from 'lucide-react';
import { ModelManagement } from './ModelManagement';

interface Drill {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  equipment: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  repetitions: string;
  keyPoints: string[];
  successMetrics: string[];
  xpReward: number;
  completed: boolean;
  performance?: {
    accuracy?: number;
    speed?: number;
    consistency?: number;
    form?: number;
  };
}

interface CoachingSession {
  id: string;
  sessionSummary: string;
  drills: Drill[];
  starPathProgress: string;
  nextSteps: string;
  sport: string;
  currentLevel: string;
  timestamp: string;
}

interface StarPathStatus {
  currentLevel: string;
  totalXP: number;
  nextLevelXP: number;
  progress: number;
  unlockedSkills: string[];
  nextSkill: string;
  achievements: string[];
}

export function AICoachDashboard() {
  const [activeTab, setActiveTab] = useState<'coaching' | 'models' | 'progress'>('coaching');
  const [activeSession, setActiveSession] = useState<CoachingSession | null>(null);
  const [starPathStatus, setStarPathStatus] = useState<StarPathStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [sessionConfig, setSessionConfig] = useState({
    sport: 'Basketball',
    currentLevel: 'Intermediate',
    goals: 'Improve shooting accuracy and ball handling',
    weaknesses: 'Inconsistent shooting form, slow dribbling',
    strengths: 'Good court vision, strong defensive positioning',
    sessionType: 'Skill Development',
  });

  const supportedSports = [
    // Top 10 global sports
    'Soccer',
    'Basketball',
    'Tennis',
    'Volleyball',
    'Table Tennis',
    'Badminton',
    'Golf',
    'Field Hockey',
    'Cricket',
    'Rugby',
    // Additional requested sports
    'Baseball',
    'Football',
    'Ski Jumping',
  ];

  useEffect(() => {
    fetchStarPathStatus();
  }, []);

  const fetchStarPathStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/starpath/progress', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStarPathStatus({
          currentLevel: `Level ${data.stats.currentTier}`,
          totalXP: data.stats.totalXp,
          nextLevelXP: data.stats.totalXp + 1000,
          progress: (data.stats.totalXp % 1000) / 10,
          unlockedSkills: data.progress.map((p) => p.skillName),
          nextSkill: 'Advanced Techniques',
          achievements: data.progress.filter((p) => p.isUnlocked).map((p) => p.skillName),
        });
      }
    } catch (error) {
      console.error('Failed to fetch StarPath status:', error);
    }
  };

  const generateCoachingSession = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in to use AI Coach');
        return;
      }

      const response = await fetch('/api/ai-coach/generate-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sport: sessionConfig.sport.toLowerCase(),
          level: sessionConfig.currentLevel.toLowerCase(),
          focus_areas: sessionConfig.goals.split(',').map((s) => s.trim()),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Convert skills to coaching session format
        const coachingSession: CoachingSession = {
          id: Date.now().toString(),
          sessionSummary: `${sessionConfig.sport} training session focusing on ${sessionConfig.goals}`,
          drills: data.skills.map((skill: any, index: number) => ({
            id: index.toString(),
            name: skill.name,
            description: skill.description,
            instructions: skill.instructions || [],
            equipment: skill.equipment || [],
            difficulty: skill.difficulty || 'Intermediate',
            duration: skill.duration || '10 minutes',
            repetitions: skill.repetitions || '3 sets',
            keyPoints: skill.keyPoints || [],
            successMetrics: skill.successMetrics || [],
            xpReward: skill.xpReward || 50,
            completed: false,
          })),
          starPathProgress: 'Skills generated successfully',
          nextSteps: 'Complete the drills to progress in your StarPath journey',
          sport: sessionConfig.sport,
          currentLevel: sessionConfig.currentLevel,
          timestamp: new Date().toISOString(),
        };
        setActiveSession(coachingSession);
      } else {
        console.error('Failed to generate coaching session');
      }
    } catch (error) {
      console.error('Error generating coaching session:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeDrill = async (drillId: string, performance: any) => {
    try {
      const response = await fetch('/api/ai-coach/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          sessionId: activeSession?.id,
          drillId,
          completed: true,
          performance,
          notes: 'Drill completed successfully',
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update active session
        if (activeSession) {
          const updatedSession = {
            ...activeSession,
            drills: activeSession.drills.map((drill) =>
              drill.id === drillId ? { ...drill, completed: true, performance } : drill,
            ),
          };
          setActiveSession(updatedSession);
        }

        // Update StarPath status
        setStarPathStatus((prev) =>
          prev
            ? {
                ...prev,
                totalXP: prev.totalXP + data.starPathUpdate.xpGained,
                progress: (prev.totalXP + data.starPathUpdate.xpGained) / prev.nextLevelXP,
              }
            : null,
        );
      }
    } catch (error) {
      console.error('Error completing drill:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-100';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'Advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Bot className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI Coach</h1>
                <p className="text-muted-foreground">
                  Personalized training with AI-powered guidance
                </p>
              </div>
            </div>

            {starPathStatus && (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {starPathStatus.currentLevel}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{starPathStatus.totalXP}</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">
                      {Math.round(starPathStatus.progress * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${starPathStatus.progress * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('coaching')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'coaching'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bot className="w-4 h-4" />
            Coaching Session
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'models'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Cpu className="w-4 h-4" />
            AI Models
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'progress'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Progress Tracking
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'coaching' && (
          <div className="space-y-6">
            {/* Session Configuration */}
            {!activeSession && (
              <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Configure Training Session
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sport</label>
                    <select
                      className="w-full p-3 border border-border rounded-lg bg-background"
                      value={sessionConfig.sport}
                      onChange={(e) =>
                        setSessionConfig({ ...sessionConfig, sport: e.target.value })
                      }
                    >
                      <optgroup label="Top 10 Global Sports">
                        <option value="Soccer">Soccer</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Table Tennis">Table Tennis</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Golf">Golf</option>
                        <option value="Field Hockey">Field Hockey</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Rugby">Rugby</option>
                      </optgroup>
                      <optgroup label="Additional Sports">
                        <option value="Baseball">Baseball</option>
                        <option value="Football">Football (American)</option>
                        <option value="Ski Jumping">Ski Jumping</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Current Level</label>
                    <select
                      className="w-full p-3 border border-border rounded-lg bg-background"
                      value={sessionConfig.currentLevel}
                      onChange={(e) =>
                        setSessionConfig({ ...sessionConfig, currentLevel: e.target.value })
                      }
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Training Goals</label>
                    <textarea
                      className="w-full p-3 border border-border rounded-lg bg-background"
                      rows={3}
                      value={sessionConfig.goals}
                      onChange={(e) =>
                        setSessionConfig({ ...sessionConfig, goals: e.target.value })
                      }
                      placeholder="What do you want to improve?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Areas to Improve</label>
                    <textarea
                      className="w-full p-3 border border-border rounded-lg bg-background"
                      rows={3}
                      value={sessionConfig.weaknesses}
                      onChange={(e) =>
                        setSessionConfig({ ...sessionConfig, weaknesses: e.target.value })
                      }
                      placeholder="What skills need work?"
                    />
                  </div>
                </div>

                <button
                  onClick={generateCoachingSession}
                  disabled={loading}
                  className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating Session...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      Generate AI Coaching Session
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Active Session */}
            {activeSession && (
              <div className="space-y-6">
                {/* Session Overview */}
                <div className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Active Training Session
                    </h2>
                    <button
                      onClick={() => setActiveSession(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      End Session
                    </button>
                  </div>

                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-2">Session Summary</h3>
                    <p className="text-muted-foreground">{activeSession.sessionSummary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {activeSession.drills.filter((d) => d.completed).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed Drills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {activeSession.drills.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Drills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {activeSession.drills.filter((d) => d.completed).length * 25}
                      </div>
                      <div className="text-sm text-muted-foreground">XP Earned</div>
                    </div>
                  </div>
                </div>

                {/* Drills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeSession.drills.map((drill) => (
                    <div
                      key={drill.id}
                      className={`bg-card rounded-lg p-6 border transition-all cursor-pointer hover:shadow-lg ${
                        drill.completed
                          ? 'border-green-500 bg-green-50'
                          : selectedDrill?.id === drill.id
                            ? 'border-primary'
                            : 'border-border'
                      }`}
                      onClick={() => setSelectedDrill(drill)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{drill.name}</h3>
                        {drill.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>

                      <p className="text-muted-foreground text-sm mb-3">{drill.description}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}
                        >
                          {drill.difficulty}
                        </span>
                        <span className="text-sm text-muted-foreground">{drill.duration}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">{drill.xpReward} XP</span>
                        </div>
                        {!drill.completed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              completeDrill(drill.id, { accuracy: 85, speed: 80, consistency: 88 });
                            }}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* StarPath Progress */}
            {starPathStatus && (
              <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  StarPath Progress
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Unlocked Skills</h3>
                    <div className="space-y-2">
                      {starPathStatus.unlockedSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{skill}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Next Skill</span>
                      </div>
                      <span className="text-sm text-blue-700">{starPathStatus.nextSkill}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Achievements</h3>
                    <div className="space-y-2">
                      {starPathStatus.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Models Tab */}
        {activeTab === 'models' && <ModelManagement />}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Training Progress Analytics
            </h2>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Detailed progress analytics will be displayed here once you complete some training
                sessions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
