'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Zap, 
  Shield, 
  Star, 
  Trophy, 
  Book, 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Brain,
  Play,
  Award,
  Calendar,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

export default function PrimaryStudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentGrade, setCurrentGrade] = useState('5')

  const superheroProgress = {
    level: 12,
    xp: 2847,
    nextLevel: 3000,
    superPowers: ['Math Wizard', 'Reading Hero', 'Science Explorer', 'Art Creator']
  }

  const todaysQuests = [
    { title: 'Math Adventure: Multiplication Tables', subject: 'Math', progress: 75, difficulty: 'easy' },
    { title: 'Reading Quest: Chapter 3', subject: 'Reading', progress: 50, difficulty: 'medium' },
    { title: 'Science Mission: Plant Growth', subject: 'Science', progress: 90, difficulty: 'hard' },
    { title: 'Art Challenge: Color Mixing', subject: 'Art', progress: 25, difficulty: 'easy' }
  ]

  const achievements = [
    { title: 'Speed Reader', description: 'Read 10 books this month', icon: Book, earned: true },
    { title: 'Math Champion', description: 'Solved 100 problems', icon: Target, earned: true },
    { title: 'Science Detective', description: 'Completed 5 experiments', icon: Shield, earned: false },
    { title: 'Creative Artist', description: 'Finished 3 art projects', icon: Star, earned: true }
  ]

  const aiTeachersAvailable = [
    { name: 'Professor Newton', subject: 'Math Magic', status: 'online', personality: 'Patient teacher who makes math fun!' },
    { name: 'Dr. Curie', subject: 'Science Adventures', status: 'online', personality: 'Curious explorer who loves experiments!' },
    { name: 'Ms. Shakespeare', subject: 'Story Time', status: 'busy', personality: 'Creative writer who tells amazing stories!' },
    { name: 'Maestro Picasso', subject: 'Art Fun', status: 'online', personality: 'Colorful artist who teaches creativity!' }
  ]

  const upcomingEvents = [
    { title: 'Math Tournament', date: 'Today, 2:00 PM', type: 'competition' },
    { title: 'Science Fair Prep', date: 'Tomorrow, 10:00 AM', type: 'activity' },
    { title: 'Reading Circle', date: 'Friday, 1:00 PM', type: 'group' },
    { title: 'Art Showcase', date: 'Next Week', type: 'presentation' }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Superhero Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome, Young Hero! 🦸</h1>
              <p className="text-blue-100 mt-1">SuperHero Learning Academy - Grade {currentGrade}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">Level {superheroProgress.level}</div>
                <div className="text-sm text-blue-100">Hero Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{superheroProgress.xp}</div>
                <div className="text-sm text-blue-100">XP Points</div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress to Next Level</span>
              <span>{superheroProgress.xp}/{superheroProgress.nextLevel} XP</span>
            </div>
            <Progress value={(superheroProgress.xp / superheroProgress.nextLevel) * 100} className="h-2 bg-blue-800" />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">My Adventures</TabsTrigger>
            <TabsTrigger value="quests">Today's Quests</TabsTrigger>
            <TabsTrigger value="teachers">AI Teachers</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Zap className="h-5 w-5" />
                    Quick Adventures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/ai-teachers">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        <Brain className="h-4 w-4 mr-2" />
                        Chat with AI Teachers
                      </Button>
                    </Link>
                    <Link href="/virtual-classroom">
                      <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Join Virtual Classroom
                      </Button>
                    </Link>
                    <Link href="/assignments">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View My Assignments
                      </Button>
                    </Link>
                    <Link href="/study-buddy">
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                        <Users className="h-4 w-4 mr-2" />
                        Find Study Friends
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Super Powers */}
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Star className="h-5 w-5" />
                    My Super Powers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {superheroProgress.superPowers.map((power, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                        <Trophy className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">{power}</span>
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
                  Upcoming Adventures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Calendar className="h-4 w-4 text-blue-600" />
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

          <TabsContent value="quests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Today's Learning Quests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysQuests.map((quest, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{quest.title}</h3>
                        <Badge className={getDifficultyColor(quest.difficulty)}>
                          {quest.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{quest.subject}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{quest.progress}%</span>
                        </div>
                        <Progress value={quest.progress} className="h-2" />
                      </div>
                      <Button size="sm" className="mt-3 w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Continue Quest
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Teachers Ready to Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiTeachersAvailable.map((teacher, index) => (
                    <div key={index} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-blue-800">{teacher.name}</h3>
                        <Badge variant={teacher.status === 'online' ? 'default' : 'secondary'}>
                          {teacher.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-700 font-medium mb-2">{teacher.subject}</p>
                      <p className="text-xs text-blue-600 mb-3">{teacher.personality}</p>
                      <Link href="/ai-teachers">
                        <Button 
                          size="sm" 
                          className="w-full bg-blue-500 hover:bg-blue-600" 
                          disabled={teacher.status !== 'online'}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat with {teacher.name.split(' ')[0]}
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
                  My Achievement Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon
                    return (
                      <div key={index} className={`border-2 rounded-lg p-4 ${
                        achievement.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-full ${
                            achievement.earned ? 'bg-yellow-200' : 'bg-gray-200'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              achievement.earned ? 'text-yellow-800' : 'text-gray-500'
                            }`}>
                              {achievement.title}
                            </h3>
                            <p className="text-xs text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        {achievement.earned && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            ✨ Earned!
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}