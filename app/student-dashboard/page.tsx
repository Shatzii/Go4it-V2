'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Calendar, 
  Bell, 
  PlayCircle,
  TrendingUp,
  Star,
  Clock,
  Award
} from 'lucide-react';

export default function StudentDashboardPage() {
  const studentData = {
    name: "Alex Johnson",
    sport: "Basketball",
    position: "Point Guard",
    garScore: 8.5,
    level: "Varsity",
    achievements: [
      { title: "First Triple-Double", date: "2 days ago", icon: Trophy },
      { title: "Improved Free Throw %", date: "1 week ago", icon: Target },
      { title: "Team Captain", date: "2 weeks ago", icon: Star }
    ],
    starPathProgress: {
      level: 12,
      xp: 2850,
      nextLevelXp: 3000,
      completedChallenges: 45,
      totalChallenges: 60
    },
    upcomingEvents: [
      { title: "Practice Session", time: "4:00 PM", type: "practice" },
      { title: "Game vs. Eagles", time: "Friday 6:00 PM", type: "game" },
      { title: "Video Analysis", time: "Saturday 2:00 PM", type: "analysis" }
    ],
    recentVideos: [
      { title: "Scrimmage Highlights", date: "Yesterday", score: 8.7 },
      { title: "Free Throw Practice", date: "3 days ago", score: 9.2 },
      { title: "Defensive Drills", date: "1 week ago", score: 7.8 }
    ],
    academicProgress: {
      gpa: 3.8,
      courses: [
        { name: "Mathematics", grade: "A-", progress: 92 },
        { name: "English", grade: "B+", progress: 88 },
        { name: "Science", grade: "A", progress: 95 },
        { name: "History", grade: "B", progress: 85 }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {studentData.name}! 👋
              </h1>
              <p className="text-gray-600">
                {studentData.position} • {studentData.sport} • {studentData.level}
              </p>
            </div>
            <Button onClick={() => window.location.href = '/starpath'} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <Star className="w-4 h-4 mr-2" />
              StarPath Hub
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{studentData.garScore}</p>
                  <p className="text-sm text-gray-600">GAR Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{studentData.starPathProgress.level}</p>
                  <p className="text-sm text-gray-600">StarPath Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{studentData.academicProgress.gpa}</p>
                  <p className="text-sm text-gray-600">GPA</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{studentData.starPathProgress.completedChallenges}</p>
                  <p className="text-sm text-gray-600">Challenges</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* StarPath Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  StarPath Progress
                </CardTitle>
                <CardDescription>
                  Level {studentData.starPathProgress.level} • {studentData.starPathProgress.xp}/{studentData.starPathProgress.nextLevelXp} XP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Level Progress</span>
                      <span className="text-sm text-gray-500">
                        {Math.round((studentData.starPathProgress.xp / studentData.starPathProgress.nextLevelXp) * 100)}%
                      </span>
                    </div>
                    <Progress value={(studentData.starPathProgress.xp / studentData.starPathProgress.nextLevelXp) * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Challenge Completion</span>
                      <span className="text-sm text-gray-500">
                        {studentData.starPathProgress.completedChallenges}/{studentData.starPathProgress.totalChallenges}
                      </span>
                    </div>
                    <Progress value={(studentData.starPathProgress.completedChallenges / studentData.starPathProgress.totalChallenges) * 100} />
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => window.location.href = '/starpath'}>
                    <Star className="w-4 h-4 mr-2" />
                    View Full StarPath
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Recent Video Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentData.recentVideos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="font-medium">{video.title}</p>
                          <p className="text-sm text-gray-600">{video.date}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{video.score}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Upload New Video
                </Button>
              </CardContent>
            </Card>

            {/* Academic Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Academic Progress
                </CardTitle>
                <CardDescription>
                  Current GPA: {studentData.academicProgress.gpa}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.academicProgress.courses.map((course, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{course.name}</span>
                        <Badge variant="outline">{course.grade}</Badge>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Full Academic Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <achievement.icon className="w-6 h-6 text-yellow-600" />
                      <div>
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-600">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentData.upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-gray-600">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* StarPath Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  StarPath Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/starpath'}>
                    <Star className="w-4 h-4 mr-2" />
                    View StarPath Hub
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/gar-upload'}>
                    <Target className="w-4 h-4 mr-2" />
                    Get GAR Analysis
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/ai-coach'}>
                    <Trophy className="w-4 h-4 mr-2" />
                    AI Coach Training
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/academy'}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Academy Courses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}