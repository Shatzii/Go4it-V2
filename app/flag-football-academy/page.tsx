'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AICoachWidget } from '@/components/ai-coach/AICoachWidget';
import { 
  Zap, Trophy, Users, Target, PlayCircle, BookOpen, 
  Calendar, Star, Crown, Flag, Timer, MapPin, Mic,
  TrendingUp, Award, Shield, Compass, Lightbulb
} from 'lucide-react';

export default function FlagFootballAcademyPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('10-12');
  const [selectedPosition, setSelectedPosition] = useState('quarterback');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [gameType, setGameType] = useState('7v7');

  const ageGroups = [
    { value: '6-8', label: '6-8 Years (Rookie)' },
    { value: '9-11', label: '9-11 Years (Junior)' },
    { value: '12-14', label: '12-14 Years (Varsity)' },
    { value: '15-17', label: '15-17 Years (Elite)' },
    { value: 'adult', label: 'Adult League' }
  ];

  const positions = [
    { value: 'quarterback', label: 'Quarterback', icon: Target },
    { value: 'receiver', label: 'Wide Receiver', icon: Zap },
    { value: 'rusher', label: 'Pass Rusher', icon: Shield },
    { value: 'defender', label: 'Defender', icon: Users },
    { value: 'center', label: 'Center', icon: Flag }
  ];

  const gameTypes = [
    { value: '5v5', label: '5v5 (Small Field)' },
    { value: '7v7', label: '7v7 (Standard)' },
    { value: '9v9', label: '9v9 (Large Field)' }
  ];

  const drillsByPosition = {
    quarterback: [
      {
        name: 'Pocket Presence',
        description: 'Maintain calm in the pocket while scanning the field',
        difficulty: 'Intermediate',
        duration: '10 minutes',
        equipment: ['Cones', 'Flags', 'Football']
      },
      {
        name: '3-Step Drop',
        description: 'Perfect the quick 3-step drop for timing routes',
        difficulty: 'Beginner',
        duration: '15 minutes',
        equipment: ['Football', 'Markers']
      },
      {
        name: 'Accuracy Challenge',
        description: 'Target practice for precision passing',
        difficulty: 'All Levels',
        duration: '20 minutes',
        equipment: ['Targets', 'Football', 'Cones']
      }
    ],
    receiver: [
      {
        name: 'Route Running',
        description: 'Sharp cuts and precise route execution',
        difficulty: 'Intermediate',
        duration: '15 minutes',
        equipment: ['Cones', 'Flags']
      },
      {
        name: 'Catching Drills',
        description: 'Secure catches in various situations',
        difficulty: 'Beginner',
        duration: '12 minutes',
        equipment: ['Football', 'Gloves']
      },
      {
        name: 'Release Techniques',
        description: 'Beat press coverage at the line',
        difficulty: 'Advanced',
        duration: '10 minutes',
        equipment: ['Cones', 'Partner']
      }
    ],
    rusher: [
      {
        name: 'Rush Lanes',
        description: 'Stay in designated rush lanes',
        difficulty: 'Beginner',
        duration: '8 minutes',
        equipment: ['Cones', 'Markers']
      },
      {
        name: 'Flag Pulling',
        description: 'Clean flag pulling technique',
        difficulty: 'All Levels',
        duration: '12 minutes',
        equipment: ['Flags', 'Belts']
      },
      {
        name: 'Speed Rush',
        description: 'Beat blockers with speed moves',
        difficulty: 'Advanced',
        duration: '15 minutes',
        equipment: ['Cones', 'Timer']
      }
    ]
  };

  const playbook = {
    offensive: [
      {
        name: 'Quick Slant',
        formation: 'Spread',
        description: 'Fast-developing slant route for quick completions',
        personnel: '1 QB, 3 WR, 1 RB',
        success_rate: '85%',
        best_situations: ['3rd and short', '2-minute drill']
      },
      {
        name: 'Fade Route',
        formation: 'Trips Right',
        description: 'Back-shoulder fade for red zone scoring',
        personnel: '1 QB, 3 WR, 1 RB',
        success_rate: '65%',
        best_situations: ['Red zone', 'Single coverage']
      },
      {
        name: 'Screen Pass',
        formation: 'I-Formation',
        description: 'Running back screen with blockers',
        personnel: '1 QB, 2 WR, 1 RB, 1 C',
        success_rate: '70%',
        best_situations: ['Long yardage', 'Blitz defense']
      },
      {
        name: 'Crossing Routes',
        formation: 'Bunch',
        description: 'Pick plays and crossing patterns',
        personnel: '1 QB, 3 WR, 1 RB',
        success_rate: '75%',
        best_situations: ['Short yardage', 'Zone defense']
      }
    ],
    defensive: [
      {
        name: 'Cover 2',
        description: 'Two deep safeties cover the deep zones',
        personnel: '7 defensive players',
        strengths: ['Deep pass protection', 'Run support'],
        weaknesses: ['Middle zones vulnerable']
      },
      {
        name: 'Man Coverage',
        description: 'Each defender covers a specific receiver',
        personnel: '7 defensive players',
        strengths: ['Tight coverage', 'Blitz opportunities'],
        weaknesses: ['Requires athletic defenders']
      },
      {
        name: 'Zone Blitz',
        description: 'Send extra rushers while dropping coverage',
        personnel: '7 defensive players',
        strengths: ['Pressure on QB', 'Confusion'],
        weaknesses: ['Coverage gaps']
      }
    ]
  };

  const coachingProgram = {
    beginner: {
      focus: 'Fundamentals and Fun',
      duration: '8 weeks',
      sessions: [
        { week: 1, topic: 'Basic Rules and Safety', drills: ['Flag pulling basics', 'Catching', 'Throwing form'] },
        { week: 2, topic: 'Positions and Roles', drills: ['Position alignment', 'Basic routes', 'Defensive stance'] },
        { week: 3, topic: 'Simple Plays', drills: ['Quick passes', 'Basic defense', 'Team communication'] },
        { week: 4, topic: 'Game Situations', drills: ['Red zone plays', 'Two-minute drill', 'Special situations'] },
        { week: 5, topic: 'Advanced Skills', drills: ['Route combinations', 'Coverage concepts', 'Blitz packages'] },
        { week: 6, topic: 'Strategy and Tactics', drills: ['Game planning', 'Adjustments', 'Leadership'] },
        { week: 7, topic: 'Competition Prep', drills: ['Scrimmages', 'Pressure situations', 'Mental toughness'] },
        { week: 8, topic: 'Tournament Play', drills: ['Championship mindset', 'Team chemistry', 'Celebration'] }
      ]
    },
    intermediate: {
      focus: 'Skill Development and Strategy',
      duration: '10 weeks',
      sessions: [
        { week: 1, topic: 'Advanced Techniques', drills: ['Complex routes', 'Coverage reads', 'Rush techniques'] },
        { week: 2, topic: 'Formation Mastery', drills: ['Multiple formations', 'Motion plays', 'Shifts'] },
        { week: 3, topic: 'Situational Football', drills: ['Down and distance', 'Field position', 'Clock management'] }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Flag className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Flag Football Academy
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-4">
            Complete flag football training with AI-powered coaching
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Youth Development
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Tournament Ready
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              AI Coach Integrated
            </Badge>
          </div>
        </div>

        {/* Configuration Panel */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Customize Your Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Age Group</label>
                <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroups.map((group) => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Position</label>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.value} value={pos.value}>
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Skill Level</label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Game Type</label>
                <Select value={gameType} onValueChange={setGameType}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gameTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="coaching" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="coaching">AI Coaching</TabsTrigger>
            <TabsTrigger value="drills">Training Drills</TabsTrigger>
            <TabsTrigger value="playbook">Playbook</TabsTrigger>
            <TabsTrigger value="program">Coaching Program</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
          </TabsList>

          <TabsContent value="coaching" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Flag Football AI Coach */}
              <AICoachWidget 
                feature="flag_football"
                context={{
                  position: selectedPosition,
                  ageGroup: selectedAgeGroup,
                  skillLevel: skillLevel,
                  gameType: gameType
                }}
                className="h-full"
              />

              {/* Quick Stats */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-1">12</div>
                      <p className="text-sm text-slate-300">Drills Completed</p>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400 mb-1">85%</div>
                      <p className="text-sm text-slate-300">Accuracy Rate</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">3</div>
                      <p className="text-sm text-slate-300">Skills Mastered</p>
                    </div>
                    <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400 mb-1">Level 2</div>
                      <p className="text-sm text-slate-300">Current Rank</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-white mb-3">Recent Achievements</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-slate-300">Route Running Mastery</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded">
                        <Trophy className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-slate-300">Flag Pulling Expert</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="drills" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(drillsByPosition[selectedPosition] || drillsByPosition.quarterback).map((drill, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{drill.name}</CardTitle>
                      <Badge 
                        variant={drill.difficulty === 'Beginner' ? 'secondary' : 
                               drill.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                      >
                        {drill.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300 text-sm">{drill.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Timer className="w-4 h-4" />
                      <span>{drill.duration}</span>
                    </div>

                    <div>
                      <h5 className="font-medium text-white text-sm mb-2">Equipment:</h5>
                      <div className="flex flex-wrap gap-1">
                        {drill.equipment.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Drill
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playbook" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Offensive Plays */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    Offensive Playbook
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {playbook.offensive.map((play, index) => (
                    <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{play.name}</h4>
                        <Badge className="bg-green-500/20 text-green-400">
                          {play.success_rate} Success
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{play.description}</p>
                      <div className="text-xs text-slate-400 space-y-1">
                        <p><strong>Formation:</strong> {play.formation}</p>
                        <p><strong>Personnel:</strong> {play.personnel}</p>
                        <p><strong>Best for:</strong> {play.best_situations.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Defensive Schemes */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Defensive Schemes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {playbook.defensive.map((scheme, index) => (
                    <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">{scheme.name}</h4>
                      <p className="text-slate-300 text-sm mb-3">{scheme.description}</p>
                      <div className="text-xs text-slate-400 space-y-1">
                        <p><strong>Personnel:</strong> {scheme.personnel}</p>
                        <p><strong>Strengths:</strong> {scheme.strengths.join(', ')}</p>
                        <p><strong>Weaknesses:</strong> {scheme.weaknesses.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* AI Playbook Creator */}
            <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Create Custom Playbook</h3>
                <p className="text-slate-300 text-lg mb-6">
                  Use AI to generate personalized plays for your team
                </p>
                <Button 
                  onClick={() => window.location.href = '/ai-coach-dashboard'}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  AI Playbook Creator
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="program" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(coachingProgram).map(([level, program]) => (
                <Card key={level} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white capitalize flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      {level} Program
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{program.focus}</span>
                      <span>•</span>
                      <span>{program.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {program.sessions.map((session, index) => (
                        <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">Week {session.week}</span>
                            <Badge variant="outline" className="text-xs">
                              {session.topic}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-400">
                            <strong>Drills:</strong> {session.drills.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tournament Creator */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    Tournament Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Create and manage flag football tournaments with AI assistance.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">Bracket Generation</p>
                        <p className="text-slate-400 text-sm">Automated tournament brackets</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                      <Users className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">Team Management</p>
                        <p className="text-slate-400 text-sm">Roster and scheduling tools</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                      <Mic className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">AI Coaching</p>
                        <p className="text-slate-400 text-sm">Game strategy and analysis</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/ai-coach-dashboard'}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Tournament
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Tournaments */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-400" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">Youth Championship</h4>
                      <Badge className="bg-green-500/20 text-green-400">Registered</Badge>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">8-team single elimination</p>
                    <div className="text-xs text-slate-400">
                      <p>📅 March 15, 2024</p>
                      <p>📍 Local Sports Complex</p>
                      <p>🎯 Ages 10-12</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">Spring League</h4>
                      <Badge variant="outline">Open</Badge>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">Round robin format</p>
                    <div className="text-xs text-slate-400">
                      <p>📅 April 1-30, 2024</p>
                      <p>📍 Multiple Venues</p>
                      <p>🎯 All Ages</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-slate-600">
                    <Crown className="w-4 h-4 mr-2" />
                    View All Events
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}