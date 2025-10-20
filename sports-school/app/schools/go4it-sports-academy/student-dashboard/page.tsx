'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Target,
  Users,
  Calendar,
  Activity,
  Award,
  Timer,
  Star,
  TrendingUp,
  Heart,
  Zap,
  Medal,
  PlayCircle,
  Clock,
  BookOpen,
  Brain,
  Play,
  MessageSquare,
  Dumbbell,
} from 'lucide-react';
import Link from 'next/link';

export default function Go4itSportsStudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentSport, setCurrentSport] = useState('Basketball');

  const athleticProgress = {
    level: 'Varsity Athlete',
    skillPoints: 2340,
    nextLevel: 'Elite Competitor',
    nextLevelPoints: 3000,
    specialties: ['Basketball', 'Track & Field', 'Swimming', 'Tennis'],
  };

  const currentTraining = [
    {
      sport: 'Basketball',
      session: 'Advanced Shooting',
      progress: 85,
      nextSession: 'Today, 4:00 PM',
      coach: 'Coach Johnson',
    },
    {
      sport: 'Track & Field',
      session: 'Sprint Training',
      progress: 70,
      nextSession: 'Tomorrow, 3:00 PM',
      coach: 'Coach Williams',
    },
    {
      sport: 'Swimming',
      session: 'Stroke Technique',
      progress: 60,
      nextSession: 'Friday, 2:00 PM',
      coach: 'Coach Davis',
    },
  ];

  const fitnessMetrics = [
    { metric: 'Cardiovascular Endurance', score: 92, improvement: '+8%' },
    { metric: 'Strength Training', score: 88, improvement: '+12%' },
    { metric: 'Flexibility', score: 85, improvement: '+5%' },
    { metric: 'Speed & Agility', score: 90, improvement: '+15%' },
  ];

  const upcomingEvents = [
    { title: 'Basketball Tournament', date: 'March 18, 6:00 PM', type: 'Competition' },
    { title: 'Track Meet', date: 'March 22, 10:00 AM', type: 'Competition' },
    { title: 'Swimming Championships', date: 'March 25, 2:00 PM', type: 'Championship' },
    { title: 'Athletic Scholarship Fair', date: 'April 1, 1:00 PM', type: 'Opportunity' },
  ];

  const achievements = [
    {
      title: 'MVP Award',
      description: 'Outstanding performance in basketball',
      icon: Trophy,
      earned: true,
    },
    {
      title: 'Speed Demon',
      description: 'Broke personal record in 100m dash',
      icon: Zap,
      earned: true,
    },
    {
      title: 'Team Captain',
      description: 'Leadership excellence in team sports',
      icon: Star,
      earned: false,
    },
    {
      title: 'Academic Athlete',
      description: 'Maintained 3.5+ GPA while competing',
      icon: BookOpen,
      earned: true,
    },
  ];

  const aiCoachesAvailable = [
    {
      name: 'Coach AI Newton',
      subject: 'Sports Physics',
      status: 'online',
      personality: 'Analyzes biomechanics and performance optimization',
    },
    {
      name: 'Dr. Sports Curie',
      subject: 'Sports Science',
      status: 'online',
      personality: 'Nutrition and recovery specialist',
    },
    {
      name: 'Coach Mind',
      subject: 'Mental Performance',
      status: 'busy',
      personality: 'Sports psychology and mental toughness',
    },
    {
      name: 'Dr. Inclusive Sports',
      subject: 'Adaptive Athletics',
      status: 'online',
      personality: 'Inclusive sports and accessibility adaptations',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Athletic Header */}
        <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Go4it Sports Academy! 🏆</h1>
              <p className="text-yellow-100 mt-1">Athletic Excellence Program - {currentSport}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{athleticProgress.level}</div>
                <div className="text-sm text-yellow-100">Athletic Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{athleticProgress.skillPoints}</div>
                <div className="text-sm text-yellow-100">Skill Points</div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress to {athleticProgress.nextLevel}</span>
              <span>
                {athleticProgress.skillPoints}/{athleticProgress.nextLevelPoints} Points
              </span>
            </div>
            <Progress
              value={(athleticProgress.skillPoints / athleticProgress.nextLevelPoints) * 100}
              className="h-2 bg-yellow-800"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Athletic Overview</TabsTrigger>
            <TabsTrigger value="training">My Training</TabsTrigger>
            <TabsTrigger value="fitness">Fitness Metrics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="border-2 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <Dumbbell className="h-5 w-5" />
                    Quick Athletic Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/ai-teachers">
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                        <Brain className="h-4 w-4 mr-2" />
                        Chat with AI Coaches
                      </Button>
                    </Link>
                    <Link href="/virtual-classroom">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Virtual Training Room
                      </Button>
                    </Link>
                    <Link href="/assignments">
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Training Plans
                      </Button>
                    </Link>
                    <Link href="/study-buddy">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        <Users className="h-4 w-4 mr-2" />
                        Find Training Partners
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Athletic Specialties */}
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Trophy className="h-5 w-5" />
                    My Sports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {athleticProgress.specialties.map((sport, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg"
                      >
                        <Medal className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">{sport}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Competitions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Calendar className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.date}</p>
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Current Training Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentTraining.map((training, index) => (
                    <div
                      key={index}
                      className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-yellow-800">{training.sport}</h3>
                        <Badge className="bg-yellow-100 text-yellow-800">{training.session}</Badge>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{training.progress}%</span>
                        </div>
                        <Progress value={training.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          Next: {training.nextSession}
                        </div>
                        <div className="text-sm text-gray-600">Coach: {training.coach}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fitness" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Fitness Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fitnessMetrics.map((metric, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{metric.metric}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {metric.improvement}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Score</span>
                          <span>{metric.score}/100</span>
                        </div>
                        <Progress value={metric.score} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Coaches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Coaches Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiCoachesAvailable.map((coach, index) => (
                    <div
                      key={index}
                      className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-yellow-800">{coach.name}</h3>
                        <Badge variant={coach.status === 'online' ? 'default' : 'secondary'}>
                          {coach.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-yellow-700 font-medium mb-2">{coach.subject}</p>
                      <p className="text-xs text-yellow-600 mb-3">{coach.personality}</p>
                      <Link href="/ai-teachers">
                        <Button
                          size="sm"
                          className="w-full bg-yellow-500 hover:bg-yellow-600"
                          disabled={coach.status !== 'online'}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat with Coach
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Athletic Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={index}
                        className={`border-2 rounded-lg p-4 ${
                          achievement.earned
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`p-2 rounded-full ${
                              achievement.earned ? 'bg-yellow-200' : 'bg-gray-200'
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${
                                achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                              }`}
                            />
                          </div>
                          <div>
                            <h3
                              className={`font-medium ${
                                achievement.earned ? 'text-yellow-800' : 'text-gray-500'
                              }`}
                            >
                              {achievement.title}
                            </h3>
                            <p className="text-xs text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        {achievement.earned && (
                          <Badge className="bg-yellow-100 text-yellow-800">🏆 Earned!</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
