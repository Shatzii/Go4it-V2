'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Users, GraduationCap, Calendar, Video, FileText, Trophy, Brain, Clock, Target, CheckCircle } from 'lucide-react'

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
  const [student, setStudent] = useState<Student | null>(null)
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentData()
    fetchAvailableCourses()
  }, [])

  const fetchStudentData = async () => {
    try {
      const response = await fetch('/api/academy/student')
      if (response.ok) {
        const data = await response.json()
        setStudent(data.student)
      }
    } catch (error) {
      console.error('Failed to fetch student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableCourses = async () => {
    try {
      const response = await fetch('/api/academy/courses')
      if (response.ok) {
        const data = await response.json()
        setAvailableCourses(data.courses)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const enrollInCourse = async (courseId: string) => {
    try {
      const response = await fetch('/api/academy/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })
      if (response.ok) {
        await fetchStudentData()
      }
    } catch (error) {
      console.error('Failed to enroll in course:', error)
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Student Overview */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-4 mb-4">
          <GraduationCap className="w-8 h-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-white">{student?.name}</h2>
            <p className="text-slate-400">Grade {student?.grade} • {student?.sport}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{student?.gpa.toFixed(2)}</div>
            <div className="text-sm text-slate-400">Current GPA</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{student?.credits}</div>
            <div className="text-sm text-slate-400">Credits Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{student?.courses.length}</div>
            <div className="text-sm text-slate-400">Active Courses</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${student?.ncaaEligible ? 'text-green-500' : 'text-red-500'}`}>
              {student?.ncaaEligible ? 'YES' : 'NO'}
            </div>
            <div className="text-sm text-slate-400">NCAA Eligible</div>
          </div>
        </div>
      </div>

      {/* Current Courses */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Current Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student?.courses.map((course) => (
            <div key={course.id} className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{course.title}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  course.isNCAAEligible ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                }`}>
                  {course.isNCAAEligible ? 'NCAA' : 'Elective'}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-2">
                {course.subject} • {course.credits} credits
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-sm text-slate-400">{course.progress}%</span>
              </div>
              <p className="text-xs text-slate-500">
                Instructor: {course.instructor} • {course.schedule}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Upcoming Assignments</h3>
        <div className="space-y-3">
          {student?.courses.flatMap(course => 
            course.assignments.filter(a => a.status === 'pending')
          ).slice(0, 5).map((assignment) => (
            <div key={assignment.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{assignment.title}</h4>
                <p className="text-sm text-slate-400">Due: {assignment.dueDate}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                assignment.type === 'exam' ? 'bg-red-600' : 'bg-blue-600'
              } text-white`}>
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
        <h2 className="text-2xl font-bold text-white">Available Courses</h2>
        <div className="flex gap-2">
          <select className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>English</option>
            <option>Science</option>
            <option>Social Studies</option>
            <option>Sports Science</option>
          </select>
          <select className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white">
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
          <div key={course.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">{course.title}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                course.isNCAAEligible ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
              }`}>
                {course.isNCAAEligible ? 'NCAA' : 'Elective'}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-3">
              {course.subject} • Grade {course.grade} • {course.credits} credits
            </p>
            <p className="text-slate-300 text-sm mb-4">
              Instructor: {course.instructor}
            </p>
            <p className="text-slate-300 text-sm mb-4">
              Schedule: {course.schedule}
            </p>
            <button
              onClick={() => enrollInCourse(course.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
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
      <h2 className="text-2xl font-bold text-white">Class Schedule</h2>
      
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <div key={day} className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3">{day}</h3>
              <div className="space-y-2">
                {student?.courses.slice(0, 3).map((course, index) => (
                  <div key={index} className="bg-slate-600 rounded p-2">
                    <p className="text-sm text-white font-medium">{course.title}</p>
                    <p className="text-xs text-slate-400">9:00 AM - 10:30 AM</p>
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
      <h2 className="text-2xl font-bold text-white">Grades & Progress</h2>
      
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="space-y-4">
          {student?.courses.map((course) => (
            <div key={course.id} className="border-b border-slate-700 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">{course.title}</h3>
                <span className="text-lg font-bold text-white">
                  {course.assignments.filter(a => a.status === 'graded').length > 0 
                    ? (course.assignments.filter(a => a.status === 'graded')
                        .reduce((sum, a) => sum + (a.score || 0), 0) / 
                       course.assignments.filter(a => a.status === 'graded').length).toFixed(1)
                    : '--'}%
                </span>
              </div>
              
              <div className="space-y-2">
                {course.assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                    <div>
                      <p className="text-sm text-white font-medium">{assignment.title}</p>
                      <p className="text-xs text-slate-400">{assignment.type} • Due: {assignment.dueDate}</p>
                    </div>
                    <div className="text-right">
                      {assignment.status === 'graded' ? (
                        <span className="text-sm text-white">
                          {assignment.score}/{assignment.maxScore}
                        </span>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded ${
                          assignment.status === 'submitted' ? 'bg-yellow-600' : 'bg-red-600'
                        } text-white`}>
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Go4It Sports Academy</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                Academic Year 2024-2025
              </span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {student?.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-900 border-b border-slate-700">
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
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-slate-400 hover:text-white'
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