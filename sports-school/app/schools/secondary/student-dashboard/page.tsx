'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GraduationCap,
  BookOpen,
  Calculator,
  Microscope,
  Star,
  Trophy,
  Calendar,
  School,
  Users,
  Target,
  Brain,
  CheckCircle,
  Award,
  MessageSquare,
  Clock,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function SecondaryStudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentGrade, setCurrentGrade] = useState('10');

  const academicProgress = {
    level: 'Honor Student',
    achievementPoints: 1847,
    nextLevel: 'Academic Excellence',
    nextLevelPoints: 2500,
    specialties: ['Advanced Mathematics', 'Science Research', 'Literature Analysis', 'Leadership'],
  };

  const currentProjects = [
    {
      title: 'Science Fair Research Project',
      role: 'Lead Researcher',
      sessions: 12,
      progress: 75,
      nextSession: 'Today, 3:30 PM',
    },
    {
      title: 'Advanced Mathematics Competition',
      role: 'Team Member',
      sessions: 8,
      progress: 45,
      nextSession: 'Tomorrow, 4:00 PM',
    },
    {
      title: 'Model UN Conference',
      role: 'Delegate',
      sessions: 5,
      progress: 30,
      nextSession: 'Friday, 2:00 PM',
    },
  ];

  const subjectProgress = [
    { subject: 'English Literature', grade: 'A-', progress: 88, teacher: 'Ms. Shakespeare' },
    { subject: 'Advanced Mathematics', grade: 'A', progress: 92, teacher: 'Professor Newton' },
    { subject: 'Chemistry', grade: 'B+', progress: 85, teacher: 'Dr. Curie' },
    { subject: 'World History', grade: 'A-', progress: 87, teacher: 'Professor Timeline' },
  ];

  const upcomingEvents = [
    { title: 'Science Fair Presentations', date: 'March 15, 7:00 PM', type: 'Main Hall' },
    { title: 'Academic Achievement Showcase', date: 'March 20, 2:00 PM', type: 'Auditorium' },
    { title: 'Math Competition Finals', date: 'March 25, 3:30 PM', type: 'Conference Room' },
    { title: 'Senior Capstone Presentations', date: 'April 1, 10:00 AM', type: 'Main Hall' },
  ];

  const achievements = [
    {
      title: 'Outstanding Scholar',
      description: 'Exceptional work in advanced mathematics',
      icon: Star,
      earned: true,
    },
    {
      title: 'Research Excellence',
      description: 'Mastered scientific research methodology',
      icon: Trophy,
      earned: true,
    },
    {
      title: 'Academic Leadership',
      description: 'Led student study groups',
      icon: GraduationCap,
      earned: false,
    },
    {
      title: 'Community Service Award',
      description: 'Mentored younger students',
      icon: Award,
      earned: true,
    },
  ];

  const aiTeachersAvailable = [
    {
      name: 'Ms. Shakespeare',
      subject: 'Literature & Writing',
      status: 'online',
      personality: 'Passionate about storytelling and critical analysis',
    },
    {
      name: 'Professor Newton',
      subject: 'Mathematics & Physics',
      status: 'online',
      personality: 'Methodical approach to problem-solving',
    },
    {
      name: 'Dr. Curie',
      subject: 'Science & Research',
      status: 'busy',
      personality: 'Encourages scientific curiosity and experimentation',
    },
    {
      name: 'Dr. Inclusive',
      subject: 'Learning Support',
      status: 'online',
      personality: 'Helps with study strategies and academic confidence',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Academic Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome to S.T.A.G.E Prep! 📚</h1>
              <p className="text-purple-100 mt-1">
                Strategic Teaching for Academic Growth & Excellence - Grade {currentGrade}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{academicProgress.level}</div>
                <div className="text-sm text-purple-100">Academic Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{academicProgress.achievementPoints}</div>
                <div className="text-sm text-purple-100">Achievement Points</div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress to {academicProgress.nextLevel}</span>
              <span>
                {academicProgress.achievementPoints}/{academicProgress.nextLevelPoints} Points
              </span>
            </div>
            <Progress
              value={(academicProgress.achievementPoints / academicProgress.nextLevelPoints) * 100}
              className="h-2 bg-purple-800"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Academic Overview</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <School className="h-5 w-5" />
                    Quick Academic Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/ai-teachers">
                      <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                        <Brain className="h-4 w-4 mr-2" />
                        Chat with AI Teachers
                      </Button>
                    </Link>
                    <Link href="/virtual-classroom">
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Virtual Study Room
                      </Button>
                    </Link>
                    <Link href="/assignments">
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Assignments & Projects
                      </Button>
                    </Link>
                    <Link href="/study-buddy">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        <Users className="h-4 w-4 mr-2" />
                        Find Study Partners
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Specialties */}
              <Card className="border-2 border-pink-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-pink-800">
                    <Target className="h-5 w-5" />
                    My Academic Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {academicProgress.specialties.map((specialty, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg"
                      >
                        <CheckCircle className="h-4 w-4 text-pink-600" />
                        <span className="text-sm font-medium text-pink-800">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Academic Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Academic Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
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

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Current Academic Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentProjects.map((project, index) => (
                    <div
                      key={index}
                      className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-purple-800">{project.title}</h3>
                        <Badge className="bg-purple-100 text-purple-800">{project.role}</Badge>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Sessions Attended</span>
                          <span>{project.sessions}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          Next: {project.nextSession}
                        </div>
                        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Academic Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectProgress.map((subject, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{subject.subject}</h3>
                        <Badge variant="secondary">{subject.grade}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Teacher: {subject.teacher}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Teachers */}
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
                    <div
                      key={index}
                      className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-purple-800">{teacher.name}</h3>
                        <Badge variant={teacher.status === 'online' ? 'default' : 'secondary'}>
                          {teacher.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-700 font-medium mb-2">{teacher.subject}</p>
                      <p className="text-xs text-purple-600 mb-3">{teacher.personality}</p>
                      <Link href="/ai-teachers">
                        <Button
                          size="sm"
                          className="w-full bg-purple-500 hover:bg-purple-600"
                          disabled={teacher.status !== 'online'}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat with {teacher.name.split(' ')[1]}
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
                  Academic Achievements
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
