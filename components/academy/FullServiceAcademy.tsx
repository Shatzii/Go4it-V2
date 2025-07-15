'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Users, GraduationCap, Calendar, Video, FileText, Trophy, Brain, Clock, Target, CheckCircle, Settings, BarChart3, MessageCircle } from 'lucide-react'

interface Course {
  id: string
  title: string
  subject: string
  grade: string
  credits: number
  instructor: string
  schedule: string
  progress: number
  assignments: Assignment[]
  isNCAAEligible: boolean
}

interface Assignment {
  id: string
  title: string
  type: 'quiz' | 'essay' | 'project' | 'exam'
  dueDate: string
  status: 'pending' | 'submitted' | 'graded'
  score?: number
  maxScore: number
}

interface Student {
  id: string
  name: string
  grade: string
  gpa: number
  credits: number
  sport: string
  ncaaEligible: boolean
  courses: Course[]
}

export function FullServiceAcademy() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userRole, setUserRole] = useState<'student' | 'parent' | 'admin'>('student')
  const [student, setStudent] = useState<Student | null>(null)
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentData()
    fetchAvailableCourses()
  }, [])

  const fetchStudentData = async () => {
    try {
      // Mock data for demonstration
      const mockStudent: Student = {
        id: '1',
        name: 'Alex Johnson',
        grade: '11th',
        gpa: 3.7,
        credits: 18,
        sport: 'Basketball',
        ncaaEligible: true,
        courses: [
          {
            id: '1',
            title: 'Advanced Placement Mathematics',
            subject: 'Mathematics',
            grade: '11th',
            credits: 4,
            instructor: 'Dr. Smith',
            schedule: 'Mon/Wed/Fri 10:00-11:00',
            progress: 75,
            isNCAAEligible: true,
            assignments: [
              {
                id: '1',
                title: 'Calculus Quiz 3',
                type: 'quiz',
                dueDate: '2024-04-15',
                status: 'pending',
                maxScore: 100
              }
            ]
          },
          {
            id: '2',
            title: 'English Literature',
            subject: 'English',
            grade: '11th',
            credits: 3,
            instructor: 'Ms. Johnson',
            schedule: 'Tue/Thu 9:00-10:30',
            progress: 82,
            isNCAAEligible: true,
            assignments: [
              {
                id: '2',
                title: 'Essay on Shakespeare',
                type: 'essay',
                dueDate: '2024-04-18',
                status: 'submitted',
                score: 85,
                maxScore: 100
              }
            ]
          }
        ]
      }
      setStudent(mockStudent)
    } catch (error) {
      console.error('Failed to fetch student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableCourses = async () => {
    try {
      // Mock data for demonstration
      const mockCourses: Course[] = [
        {
          id: '3',
          title: 'Advanced Biology',
          subject: 'Science',
          grade: '11th',
          credits: 4,
          instructor: 'Dr. Wilson',
          schedule: 'Mon/Wed/Fri 2:00-3:30',
          progress: 0,
          isNCAAEligible: true,
          assignments: []
        }
      ]
      setAvailableCourses(mockCourses)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const enrollInCourse = async (courseId: string) => {
    try {
      // Mock enrollment process
      console.log('Enrolling in course:', courseId)
      await fetchStudentData()
    } catch (error) {
      console.error('Failed to enroll in course:', error)
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Student Overview */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-center gap-4 mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">{student?.name}</h2>
            <p className="text-muted-foreground">Grade {student?.grade} • {student?.sport}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{student?.gpa.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Current GPA</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{student?.credits}</div>
            <div className="text-sm text-muted-foreground">Credits Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{student?.courses.length}</div>
            <div className="text-sm text-muted-foreground">Active Courses</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${student?.ncaaEligible ? 'text-green-500' : 'text-red-500'}`}>
              {student?.ncaaEligible ? 'YES' : 'NO'}
            </div>
            <div className="text-sm text-muted-foreground">NCAA Eligible</div>
          </div>
        </div>
      </div>

      {/* Current Courses */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student?.courses.map((course) => (
            <div key={course.id} className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{course.title}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  course.isNCAAEligible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.isNCAAEligible ? 'NCAA' : 'Elective'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {course.subject} • {course.credits} credits
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{course.progress}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Instructor: {course.instructor} • {course.schedule}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Assignments</h3>
        <div className="space-y-3">
          {student?.courses.flatMap(course => 
            course.assignments.filter(a => a.status === 'pending')
          ).slice(0, 5).map((assignment) => (
            <div key={assignment.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{assignment.title}</h4>
                <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                assignment.type === 'exam' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {assignment.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Available Courses</h2>
        <div className="flex gap-2">
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-foreground">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>English</option>
            <option>Science</option>
            <option>Social Studies</option>
            <option>Sports Science</option>
          </select>
          <select className="bg-background border border-border rounded-lg px-3 py-2 text-foreground">
            <option>All Grades</option>
            <option>9th Grade</option>
            <option>10th Grade</option>
            <option>11th Grade</option>
            <option>12th Grade</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableCourses.map((course) => (
          <div key={course.id} className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                course.isNCAAEligible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {course.isNCAAEligible ? 'NCAA' : 'Elective'}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Subject:</span> {course.subject}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Grade:</span> {course.grade}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Credits:</span> {course.credits}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Instructor:</span> {course.instructor}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Schedule:</span> {course.schedule}
              </p>
            </div>

            <button
              onClick={() => enrollInCourse(course.id)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Enroll Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSchedule = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Weekly Schedule</h2>
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
            <div key={day} className="space-y-2">
              <h3 className="font-semibold text-foreground text-center">{day}</h3>
              <div className="space-y-2">
                {student?.courses.map((course) => (
                  <div key={course.id} className="bg-muted p-2 rounded text-sm">
                    <p className="font-medium text-foreground">{course.title}</p>
                    <p className="text-muted-foreground">{course.schedule}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderGrades = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Grade Summary</h2>
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="space-y-4">
          {student?.courses.map((course) => (
            <div key={course.id} className="border-b border-border pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{course.title}</h3>
                <span className="text-lg font-bold text-foreground">
                  {course.assignments.filter(a => a.score).length > 0 
                    ? `${Math.round(course.assignments.filter(a => a.score).reduce((sum, a) => sum + (a.score || 0), 0) / course.assignments.filter(a => a.score).length)}%`
                    : 'N/A'
                  }
                </span>
              </div>
              
              <div className="space-y-2">
                {course.assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">{assignment.type} • Due: {assignment.dueDate}</p>
                    </div>
                    <div className="text-right">
                      {assignment.score !== undefined ? (
                        <span className={`text-sm font-medium ${
                          assignment.score >= 90 ? 'text-green-600' : 
                          assignment.score >= 80 ? 'text-blue-600' : 
                          assignment.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {assignment.score}/{assignment.maxScore}
                        </span>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded ${
                          assignment.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {assignment.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Go4It Sports Academy</h1>
              <div className="flex items-center gap-2">
                <select 
                  value={userRole} 
                  onChange={(e) => setUserRole(e.target.value as 'student' | 'parent' | 'admin')}
                  className="bg-background border border-border rounded px-2 py-1 text-sm"
                >
                  <option value="student">Student View</option>
                  <option value="parent">Parent View</option>
                  <option value="admin">Admin View</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Academic Year 2024-2025
              </span>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">
                  {student?.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Target },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'grades', label: 'Grades', icon: Trophy }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'grades' && renderGrades()}
      </div>
    </div>
  )
}