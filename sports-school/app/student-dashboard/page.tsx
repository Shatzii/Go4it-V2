'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Brain,
  Calendar,
  Trophy,
  MessageSquare,
  Target,
  Clock,
  Star,
  User,
  Settings,
  Play,
  FileText,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('learning');

  const learningPaths = [
    {
      title: 'Mathematics Mastery',
      progress: 68,
      nextLesson: 'Quadratic Equations',
      difficulty: 'Intermediate',
      estimatedTime: '45 mins',
    },
    {
      title: 'Science Explorer',
      progress: 82,
      nextLesson: 'Chemical Reactions',
      difficulty: 'Advanced',
      estimatedTime: '60 mins',
    },
    {
      title: 'English Literature',
      progress: 55,
      nextLesson: 'Poetry Analysis',
      difficulty: 'Beginner',
      estimatedTime: '30 mins',
    },
  ];

  const aiTeachersAvailable = [
    {
      name: 'Professor Newton',
      subject: 'Mathematics',
      status: 'online',
      lastHelped: '2 hours ago',
    },
    { name: 'Dr. Curie', subject: 'Science', status: 'online', lastHelped: '1 day ago' },
    { name: 'Ms. Shakespeare', subject: 'English', status: 'busy', lastHelped: '3 hours ago' },
    { name: 'Professor Timeline', subject: 'History', status: 'online', lastHelped: '5 hours ago' },
  ];

  const achievements = [
    {
      title: 'Math Wizard',
      description: 'Solved 50 algebra problems',
      icon: Trophy,
      color: 'text-yellow-600',
    },
    {
      title: 'Science Explorer',
      description: 'Completed 10 experiments',
      icon: Star,
      color: 'text-blue-600',
    },
    {
      title: 'Reading Champion',
      description: 'Read 5 books this month',
      icon: BookOpen,
      color: 'text-green-600',
    },
    {
      title: 'Consistent Learner',
      description: '7-day learning streak',
      icon: Target,
      color: 'text-purple-600',
    },
  ];

  const todaysGoals = [
    { title: 'Complete Math Assignment', completed: true, subject: 'Mathematics' },
    { title: 'Read Chapter 5 - History', completed: false, subject: 'History' },
    { title: 'Practice Spanish Vocabulary', completed: false, subject: 'Language' },
    { title: 'Submit Science Lab Report', completed: true, subject: 'Science' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Student Learning Hub</h1>
              <p className="text-blue-100 mt-1">Your personalized learning journey</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">Level 12</div>
                <div className="text-sm text-blue-100">Learning Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">2,847</div>
                <div className="text-sm text-blue-100">XP Points</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="learning">Learning Paths</TabsTrigger>
            <TabsTrigger value="ai-teachers">AI Teachers</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="goals">Daily Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Paths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Active Learning Paths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningPaths.map((path, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{path.title}</h3>
                          <Badge variant="secondary">{path.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Next: {path.nextLesson}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{path.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${path.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {path.estimatedTime}
                          </span>
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Study Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Quick Study Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/ai-teachers">
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat with AI Teachers
                      </Button>
                    </Link>
                    <Link href="/study-buddy">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Find Study Buddy
                      </Button>
                    </Link>
                    <Link href="/virtual-classroom">
                      <Button variant="outline" className="w-full justify-start">
                        <Play className="h-4 w-4 mr-2" />
                        Join Virtual Class
                      </Button>
                    </Link>
                    <Link href="/adaptive-assessment">
                      <Button variant="outline" className="w-full justify-start">
                        <Target className="h-4 w-4 mr-2" />
                        Take Practice Test
                      </Button>
                    </Link>
                    <Link href="/course-management">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        View Assignments
                      </Button>
                    </Link>
                    <Link href="/block-scheduling">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Check Schedule
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-teachers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Teachers Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiTeachersAvailable.map((teacher, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{teacher.name}</h3>
                        <Badge variant={teacher.status === 'online' ? 'default' : 'secondary'}>
                          {teacher.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{teacher.subject}</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Last helped: {teacher.lastHelped}
                      </p>
                      <Link href="/ai-teachers">
                        <Button size="sm" className="w-full" disabled={teacher.status !== 'online'}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat Now
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
                  <Trophy className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className={`p-2 bg-white rounded-full ${achievement.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Today's Learning Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaysGoals.map((goal, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        goal.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      } border`}
                    >
                      <div
                        className={`p-1 rounded-full ${
                          goal.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${goal.completed ? 'line-through text-gray-500' : ''}`}
                        >
                          {goal.title}
                        </h3>
                        <p className="text-sm text-gray-600">{goal.subject}</p>
                      </div>
                      {goal.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
