'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, Users, Award, Brain, TrendingUp, Calendar } from 'lucide-react'

export default function AcademyPage() {
  const [studentStats, setStudentStats] = useState({
    totalStudents: 0,
    activeClasses: 0,
    completedAssignments: 0,
    averageGrade: 0
  })

  useEffect(() => {
    // Simulate loading academy stats
    const loadStats = async () => {
      // In real implementation, this would fetch from API
      setStudentStats({
        totalStudents: 147,
        activeClasses: 12,
        completedAssignments: 1284,
        averageGrade: 87.5
      })
    }
    loadStats()
  }, [])

  const aiTeachers = [
    {
      name: "Professor Newton",
      subject: "Mathematics & Sports Analytics",
      description: "Specialized in teaching math concepts through sports statistics and performance analysis",
      icon: "🔢",
      color: "bg-blue-500"
    },
    {
      name: "Dr. Curie",
      subject: "Sports Science & Performance",
      description: "Expert in sports physiology, nutrition, and performance enhancement",
      icon: "🔬",
      color: "bg-green-500"
    },
    {
      name: "Ms. Shakespeare",
      subject: "Communication & Leadership",
      description: "Develops communication skills essential for athletic leadership",
      icon: "📚",
      color: "bg-purple-500"
    },
    {
      name: "Professor Timeline",
      subject: "Sports History & Strategy",
      description: "Teaches sports history and strategic thinking through historical analysis",
      icon: "⏰",
      color: "bg-orange-500"
    },
    {
      name: "Maestro Picasso",
      subject: "Creative Expression & Mental Wellness",
      description: "Focuses on creativity and mental health for peak athletic performance",
      icon: "🎨",
      color: "bg-pink-500"
    },
    {
      name: "Dr. Inclusive",
      subject: "Adaptive Learning & Accessibility",
      description: "Specializes in adaptive learning techniques for neurodivergent athletes",
      icon: "🧠",
      color: "bg-teal-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Go4It Sports Academy</h1>
              <p className="text-slate-300 mt-2">AI-Powered Education for Student Athletes</p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                Enroll Now
              </button>
              <button className="border border-slate-600 hover:border-slate-500 text-white px-6 py-2 rounded-lg transition-colors">
                Parent Portal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-white">{studentStats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Classes</p>
                <p className="text-2xl font-bold text-white">{studentStats.activeClasses}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Assignments Completed</p>
                <p className="text-2xl font-bold text-white">{studentStats.completedAssignments}</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Average Grade</p>
                <p className="text-2xl font-bold text-white">{studentStats.averageGrade}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* AI Teachers Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Meet Your AI Teachers</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Our specialized AI teachers are designed specifically for student-athletes, combining academic excellence with athletic understanding.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTeachers.map((teacher, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${teacher.color} rounded-full flex items-center justify-center text-2xl mr-4`}>
                    {teacher.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{teacher.name}</h3>
                    <p className="text-slate-400 text-sm">{teacher.subject}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-4">{teacher.description}</p>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors">
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700">
            <Brain className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Personalized Learning</h3>
            <p className="text-slate-300 mb-4">
              Our AI adapts to each student's learning style, athletic schedule, and individual needs to provide the most effective education.
            </p>
            <ul className="text-slate-300 space-y-2">
              <li>• Adaptive pacing based on athletic commitments</li>
              <li>• Neurodivergent-friendly learning approaches</li>
              <li>• Sports-integrated academic content</li>
              <li>• Real-time progress tracking</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700">
            <Calendar className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Flexible Scheduling</h3>
            <p className="text-slate-300 mb-4">
              Learn around your training schedule with 24/7 access to AI teachers and flexible assignment deadlines.
            </p>
            <ul className="text-slate-300 space-y-2">
              <li>• 24/7 AI teacher availability</li>
              <li>• Mobile-friendly learning platform</li>
              <li>• Flexible assignment deadlines</li>
              <li>• Competition travel accommodations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}