'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Calendar, CheckCircle, Trophy, Target, Timer } from 'lucide-react'

export default function SportsAssignmentsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const assignments = [
    {
      id: 'fitness-test',
      title: 'Athletic Fitness Assessment',
      course: 'Athletic Fitness Foundations',
      dueDate: '2025-07-20',
      status: 'pending',
      priority: 'high',
      description: 'Complete comprehensive fitness testing including strength, endurance, and flexibility assessments.',
      coach: 'Coach Johnson',
      sport: '🏃‍♂️',
      grade: '10'
    },
    {
      id: 'team-strategy',
      title: 'Basketball Team Strategy Analysis',
      course: 'Team Sports Leadership',
      dueDate: '2025-07-18',
      status: 'completed',
      priority: 'medium',
      description: 'Analyze game footage and develop strategic playbook for upcoming championship game.',
      coach: 'Coach Martinez',
      sport: '🏀',
      grade: '10'
    },
    {
      id: 'swimming-technique',
      title: 'Swimming Technique Video Review',
      course: 'Individual Sports Excellence',
      dueDate: '2025-07-22',
      status: 'in-progress',
      priority: 'high',
      description: 'Record and analyze swimming technique for stroke improvement and time reduction.',
      coach: 'Coach Williams',
      sport: '🏊‍♂️',
      grade: '11'
    },
    {
      id: 'nutrition-plan',
      title: 'Personal Nutrition Plan',
      course: 'Sports Science & Nutrition',
      dueDate: '2025-07-25',
      status: 'pending',
      priority: 'medium',
      description: 'Create personalized nutrition plan based on training schedule and athletic goals.',
      coach: 'Dr. Chen',
      sport: '🥗',
      grade: '11'
    },
    {
      id: 'coaching-portfolio',
      title: 'Youth Coaching Portfolio',
      course: 'Coaching & Leadership',
      dueDate: '2025-07-28',
      status: 'pending',
      priority: 'high',
      description: 'Develop coaching portfolio with lesson plans and youth athletic program design.',
      coach: 'Coach Johnson',
      sport: '👨‍🏫',
      grade: '12'
    },
    {
      id: 'competition-prep',
      title: 'State Championship Preparation',
      course: 'Competitive Athletics',
      dueDate: '2025-07-30',
      status: 'in-progress',
      priority: 'urgent',
      description: 'Final preparation for state championship including mental conditioning and strategy review.',
      coach: 'Coach Elite',
      sport: '🏆',
      grade: '10-12'
    },
    {
      id: 'injury-prevention',
      title: 'Injury Prevention Protocol',
      course: 'Sports Medicine & Injury Prevention',
      dueDate: '2025-07-26',
      status: 'pending',
      priority: 'high',
      description: 'Design comprehensive injury prevention protocol for specific sport specialization.',
      coach: 'Dr. Rodriguez',
      sport: '🏥',
      grade: '12'
    }
  ]

  const filters = ['all', 'pending', 'in-progress', 'completed', 'urgent']

  const filteredAssignments = selectedFilter === 'all' 
    ? assignments 
    : assignments.filter(assignment => 
        assignment.status === selectedFilter || assignment.priority === selectedFilter
      )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏆 Sports Academy Assignments
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Athletic training assignments and performance assessments for championship excellence
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter)}
              className="min-w-[100px] capitalize"
            >
              {filter === 'all' ? 'All Assignments' : filter.replace('-', ' ')}
            </Button>
          ))}
        </div>

        {/* Assignment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    Grade {assignment.grade}
                  </Badge>
                  <div className="flex gap-2">
                    <Badge className={`${getStatusColor(assignment.status)} text-white text-xs`}>
                      {assignment.status}
                    </Badge>
                    <Badge className={`${getPriorityColor(assignment.priority)} text-white text-xs`}>
                      {assignment.priority}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="text-2xl">{assignment.sport}</span>
                  {assignment.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{assignment.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Course: {assignment.course}
                  </p>
                  <p className="text-sm text-gray-600">
                    Coach: {assignment.coach}
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {formatDate(assignment.dueDate)}
                  </div>
                </div>

                <div className="flex gap-2">
                  {assignment.status === 'completed' ? (
                    <Button className="flex-1" disabled>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </Button>
                  ) : (
                    <Button className="flex-1">
                      <Target className="w-4 h-4 mr-2" />
                      {assignment.status === 'in-progress' ? 'Continue' : 'Start'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {assignments.length}
              </h3>
              <p className="text-gray-600">Total Assignments</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {assignments.filter(a => a.status === 'completed').length}
              </h3>
              <p className="text-gray-600">Completed</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Timer className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {assignments.filter(a => a.status === 'in-progress').length}
              </h3>
              <p className="text-gray-600">In Progress</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {assignments.filter(a => a.status === 'pending').length}
              </h3>
              <p className="text-gray-600">Pending</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}