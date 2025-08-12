'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Clock, Star, Trophy, Target } from 'lucide-react'

export default function SportsCoursesPage() {
  const [selectedGrade, setSelectedGrade] = useState('all')

  const courses = [
    {
      id: 'fitness-foundations',
      title: 'Athletic Fitness Foundations',
      grade: '10',
      description: 'Build strength, endurance, and flexibility for athletic performance.',
      teacher: 'Coach Johnson',
      students: 28,
      duration: '90 min',
      difficulty: 'Intermediate',
      subjects: ['Strength Training', 'Cardio', 'Flexibility'],
      color: 'bg-red-500',
      sport: '🏃‍♂️'
    },
    {
      id: 'team-sports',
      title: 'Team Sports Leadership',
      grade: '10',
      description: 'Basketball, soccer, volleyball with leadership development.',
      teacher: 'Coach Martinez',
      students: 32,
      duration: '95 min',
      difficulty: 'Intermediate',
      subjects: ['Basketball', 'Soccer', 'Leadership'],
      color: 'bg-blue-500',
      sport: '🏀'
    },
    {
      id: 'individual-sports',
      title: 'Individual Sports Excellence',
      grade: '11',
      description: 'Track, tennis, golf, and swimming for personal achievement.',
      teacher: 'Coach Williams',
      students: 24,
      duration: '85 min',
      difficulty: 'Advanced',
      subjects: ['Track', 'Tennis', 'Swimming'],
      color: 'bg-green-500',
      sport: '🏊‍♂️'
    },
    {
      id: 'sports-science',
      title: 'Sports Science & Nutrition',
      grade: '11',
      description: 'Scientific approach to athletic performance and nutrition.',
      teacher: 'Dr. Chen',
      students: 22,
      duration: '70 min',
      difficulty: 'Advanced',
      subjects: ['Physiology', 'Nutrition', 'Recovery'],
      color: 'bg-purple-500',
      sport: '🧬'
    },
    {
      id: 'coaching-leadership',
      title: 'Coaching & Leadership',
      grade: '12',
      description: 'Develop coaching skills and sports leadership abilities.',
      teacher: 'Coach Johnson',
      students: 19,
      duration: '80 min',
      difficulty: 'Expert',
      subjects: ['Coaching', 'Leadership', 'Psychology'],
      color: 'bg-orange-500',
      sport: '👨‍🏫'
    },
    {
      id: 'competitive-athletics',
      title: 'Competitive Athletics',
      grade: '10-12',
      description: 'Elite training for competitive sports and championships.',
      teacher: 'Coach Elite',
      students: 40,
      duration: '120 min',
      difficulty: 'Expert',
      subjects: ['Competition', 'Strategy', 'Mental Game'],
      color: 'bg-yellow-500',
      sport: '🏆'
    },
    {
      id: 'sports-medicine',
      title: 'Sports Medicine & Injury Prevention',
      grade: '12',
      description: 'Understanding injuries, prevention, and rehabilitation.',
      teacher: 'Dr. Rodriguez',
      students: 18,
      duration: '75 min',
      difficulty: 'Expert',
      subjects: ['Medicine', 'Prevention', 'Rehabilitation'],
      color: 'bg-pink-500',
      sport: '🏥'
    }
  ]

  const grades = ['all', '10', '11', '12', '10-12']

  const filteredCourses = selectedGrade === 'all' 
    ? courses 
    : courses.filter(course => course.grade === selectedGrade || course.grade.includes(selectedGrade))

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏆 Go4it Sports Academy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elite athletic training and sports education for championship performance
          </p>
        </div>

        {/* Grade Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {grades.map((grade) => (
            <Button
              key={grade}
              variant={selectedGrade === grade ? "default" : "outline"}
              onClick={() => setSelectedGrade(grade)}
              className="min-w-[80px]"
            >
              {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
            </Button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    Grade {course.grade}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="text-2xl">{course.sport}</span>
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students} athletes
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Coach: {course.teacher}</p>
                  <div className="flex flex-wrap gap-1">
                    {course.subjects.map((subject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Join Team
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {courses.length}
              </h3>
              <p className="text-gray-600">Sports Programs</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {courses.reduce((total, course) => total + course.students, 0)}
              </h3>
              <p className="text-gray-600">Student Athletes</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                4.9/5
              </h3>
              <p className="text-gray-600">Program Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}