'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Calculator, 
  Microscope, 
  Globe, 
  Palette, 
  Trophy,
  Clock,
  Users,
  Star,
  Play
} from 'lucide-react'
import Link from 'next/link'

export default function Courses() {
  const courseCategories = [
    {
      title: 'Primary School (K-6)',
      description: 'SuperHero themed learning adventures',
      color: 'blue',
      courses: [
        { name: 'Math Heroes', students: 1240, rating: 4.9, icon: <Calculator className="h-5 w-5" /> },
        { name: 'Science Quest', students: 980, rating: 4.8, icon: <Microscope className="h-5 w-5" /> },
        { name: 'Reading Adventures', students: 1580, rating: 4.9, icon: <BookOpen className="h-5 w-5" /> },
        { name: 'Creative Arts', students: 750, rating: 4.7, icon: <Palette className="h-5 w-5" /> }
      ]
    },
    {
      title: 'Secondary School (7-12)',
      description: 'S.T.A.G.E Prep theatrical education',
      color: 'purple',
      courses: [
        { name: 'Drama & Theater', students: 340, rating: 4.9, icon: <Trophy className="h-5 w-5" /> },
        { name: 'Literature Analysis', students: 420, rating: 4.8, icon: <BookOpen className="h-5 w-5" /> },
        { name: 'Music Theory', students: 280, rating: 4.7, icon: <Palette className="h-5 w-5" /> },
        { name: 'Performance Arts', students: 310, rating: 4.9, icon: <Trophy className="h-5 w-5" /> }
      ]
    },
    {
      title: 'Law School',
      description: 'Future Legal Professionals',
      color: 'indigo',
      courses: [
        { name: 'Constitutional Law', students: 85, rating: 4.9, icon: <BookOpen className="h-5 w-5" /> },
        { name: 'Contract Law', students: 92, rating: 4.8, icon: <BookOpen className="h-5 w-5" /> },
        { name: 'Criminal Law', students: 78, rating: 4.7, icon: <BookOpen className="h-5 w-5" /> },
        { name: 'Legal Research', students: 95, rating: 4.9, icon: <BookOpen className="h-5 w-5" /> }
      ]
    },
    {
      title: 'Language School',
      description: 'Multilingual global education',
      color: 'green',
      courses: [
        { name: 'Spanish Immersion', students: 450, rating: 4.9, icon: <Globe className="h-5 w-5" /> },
        { name: 'French Culture', students: 320, rating: 4.8, icon: <Globe className="h-5 w-5" /> },
        { name: 'Mandarin Writing', students: 280, rating: 4.7, icon: <Globe className="h-5 w-5" /> },
        { name: 'ESL Advanced', students: 380, rating: 4.8, icon: <Globe className="h-5 w-5" /> }
      ]
    },
    {
      title: 'Go4it Sports Academy',
      description: 'Elite athletic training',
      color: 'orange',
      courses: [
        { name: 'Basketball Training', students: 180, rating: 4.9, icon: <Trophy className="h-5 w-5" /> },
        { name: 'Swimming Technique', students: 120, rating: 4.8, icon: <Trophy className="h-5 w-5" /> },
        { name: 'Track & Field', students: 150, rating: 4.7, icon: <Trophy className="h-5 w-5" /> },
        { name: 'Sports Psychology', students: 90, rating: 4.9, icon: <Trophy className="h-5 w-5" /> }
      ]
    }
  ]

  const featuredCourses = [
    {
      title: 'AI-Powered Math Mastery',
      school: 'Primary School',
      students: 1240,
      rating: 4.9,
      duration: '12 weeks',
      level: 'K-6',
      description: 'Revolutionary math program using AI to adapt to each student\'s learning pace'
    },
    {
      title: 'Constitutional Law Deep Dive',
      school: 'Law School',
      students: 85,
      rating: 4.9,
      duration: '16 weeks',
      level: 'Graduate',
      description: 'Comprehensive analysis of constitutional principles and landmark cases'
    },
    {
      title: 'Elite Athletic Performance',
      school: 'Sports Academy',
      students: 180,
      rating: 4.9,
      duration: 'Year-round',
      level: 'All Levels',
      description: 'Professional-grade training for competitive athletes'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold">Course Catalog - Universal One School 📚</h1>
          <p className="text-blue-100 mt-1">Explore our comprehensive educational programs across all schools</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">500+</div>
              <div className="text-sm text-blue-600">Total Courses</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">6,950+</div>
              <div className="text-sm text-green-600">Active Students</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">5</div>
              <div className="text-sm text-purple-600">Specialized Schools</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">4.8/5</div>
              <div className="text-sm text-yellow-600">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Courses */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Featured Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredCourses.map((course, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-blue-100 text-blue-800">{course.school}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Level:</span>
                        <span className="font-medium">{course.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Students:</span>
                        <span className="font-medium">{course.students}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Categories */}
        <div className="space-y-8">
          {courseCategories.map((category, index) => (
            <Card key={index} className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <Link href={`/schools/${category.title.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`}>
                    <Button variant="outline" size="sm">
                      View School
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.courses.map((course, courseIndex) => (
                    <Card key={courseIndex} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-full bg-${category.color}-100`}>
                            <div className={`text-${category.color}-600`}>
                              {course.icon}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{course.name}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{course.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>{course.students} students</span>
                          <Button size="sm" variant="outline">
                            Join
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-medium text-blue-800 mb-4">Ready to Start Learning?</h3>
              <div className="flex justify-center gap-4">
                <Link href="/ai-teachers">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Meet Your AI Teachers
                  </Button>
                </Link>
                <Link href="/virtual-classroom">
                  <Button variant="outline">
                    Join Virtual Classroom
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}