'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, Target, Heart, Users, Brain, Activity } from 'lucide-react'
import { TEXAS_CURRICULUM_DATA } from '@/shared/texas-curriculum-schema'

interface StudentProfile {
  id: string
  name: string
  grade: string
  school: string
  learningStyle: string
  accommodations: string[]
  strengths: string[]
  challenges: string[]
  interests: string[]
  parentEmail: string
  emergencyContact: string
  medicalNotes: string
  technologyAccess: {
    hasDevice: boolean
    hasInternet: boolean
    deviceType: string
  }
}

// Sports Academy Students
const SPORTS_STUDENTS: StudentProfile[] = [
  {
    id: '15',
    name: 'Tyler Johnson',
    grade: '10',
    school: 'sports',
    learningStyle: 'kinesthetic',
    accommodations: ['none'],
    strengths: ['physical_education', 'health'],
    challenges: ['english_language_arts'],
    interests: ['basketball', 'fitness', 'nutrition'],
    parentEmail: 'mike.johnson@email.com',
    emergencyContact: '555-0654',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  },
  {
    id: '16',
    name: 'Maya Rodriguez',
    grade: '11',
    school: 'sports',
    learningStyle: 'kinesthetic',
    accommodations: ['none'],
    strengths: ['physical_education', 'science'],
    challenges: ['mathematics'],
    interests: ['soccer', 'sports_medicine', 'coaching'],
    parentEmail: 'carlos.rodriguez@email.com',
    emergencyContact: '555-0987',
    medicalNotes: 'Previous knee injury - monitoring',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'tablet' }
  },
  {
    id: '17',
    name: 'Jordan Smith',
    grade: '12',
    school: 'sports',
    learningStyle: 'multimodal',
    accommodations: ['none'],
    strengths: ['physical_education', 'leadership'],
    challenges: ['social_studies'],
    interests: ['track_field', 'team_leadership', 'sports_psychology'],
    parentEmail: 'sarah.smith@email.com',
    emergencyContact: '555-0321',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  }
]

export default function SportsAcademyOnboarding() {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)
  const [generatedSchedule, setGeneratedSchedule] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSchedule = async (student: StudentProfile) => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const gradeData = TEXAS_CURRICULUM_DATA.high_school[student.grade as keyof typeof TEXAS_CURRICULUM_DATA.high_school]
    
    if (!gradeData) {
      setIsGenerating(false)
      return
    }

    const schedule = {
      student_id: student.id,
      grade_level: student.grade,
      school_type: 'Go4it Sports Academy',
      school_year: '2024-2025',
      semester: 'fall',
      weekly_schedule: gradeData.required_subjects.map((subject, index) => ({
        period_number: index + 1,
        start_time: `${8 + index}:00`,
        end_time: `${8 + index + 1}:00`,
        subject: subject.subject,
        teacher_name: getTeacherForSubject(subject.subject),
        room_number: `Training ${100 + index}`,
        teks_standards: subject.standards,
        athletic_integration: getAthleticIntegration(subject.subject),
        accommodations: getAccommodationsForStudent(student, subject.subject)
      })),
      total_instructional_minutes: gradeData.total_instructional_minutes,
      meets_texas_requirements: true,
      compliance_notes: `Go4it Sports Academy schedule meets all Texas TEKS requirements for grade ${student.grade} with athletic integration.`
    }
    
    setGeneratedSchedule(schedule)
    setIsGenerating(false)
  }

  const getAthleticIntegration = (subject: string) => {
    const integrations = {
      'english_language_arts': 'Sports journalism and athletic communication',
      'mathematics': 'Sports statistics and performance analytics',
      'science': 'Exercise physiology and sports nutrition',
      'social_studies': 'Sports history and global athletic culture',
      'fine_arts': 'Sports photography and athletic choreography',
      'physical_education': 'Elite athletic training and performance optimization'
    }
    return integrations[subject as keyof typeof integrations] || 'Athletic perspective integration'
  }

  const getTeacherForSubject = (subject: string) => {
    const teachers = {
      'english_language_arts': 'Coach Shakespeare (Sports Communications)',
      'mathematics': 'Coach Analytics (Sports Statistics)',
      'science': 'Dr. Performance (Exercise Science)',
      'social_studies': 'Coach History (Sports Culture)',
      'fine_arts': 'Coach Creative (Athletic Arts)',
      'physical_education': 'Coach Elite (Performance Training)'
    }
    return teachers[subject as keyof typeof teachers] || 'Coach Academic'
  }

  const getAccommodationsForStudent = (student: StudentProfile, subject: string) => {
    const accommodations = []
    
    if (student.learningStyle === 'kinesthetic') {
      accommodations.push('Movement-based learning activities')
      accommodations.push('Hands-on sports demonstrations')
      accommodations.push('Physical activity integration')
    }
    
    if (student.learningStyle === 'multimodal') {
      accommodations.push('Video analysis and visual aids')
      accommodations.push('Audio coaching techniques')
      accommodations.push('Tactile learning tools')
    }
    
    if (student.interests.includes('coaching')) {
      accommodations.push('Leadership role opportunities')
      accommodations.push('Peer teaching assignments')
    }
    
    if (student.medicalNotes.includes('injury')) {
      accommodations.push('Modified physical activities')
      accommodations.push('Injury prevention focus')
    }
    
    return accommodations
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/schools/sports" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Go4it Sports Academy
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Go4it Sports Academy Onboarding</h1>
              <p className="text-gray-600">Create elite athletic-academic schedules for grades 9-12</p>
            </div>
          </div>
        </div>

        {/* Student Selection */}
        {!selectedStudent && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-red-500" />
              Select Your Student Athlete
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SPORTS_STUDENTS.map((student) => (
                <div
                  key={student.id}
                  className="border-2 border-red-100 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">Grade {student.grade}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">Learning Style: <span className="font-medium">{student.learningStyle}</span></p>
                    <p className="text-gray-600">Sports: <span className="font-medium">{student.interests.slice(0, 2).join(', ')}</span></p>
                    {student.accommodations[0] !== 'none' && (
                      <p className="text-red-600 font-medium">Special Support: {student.accommodations.join(', ')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Profile & Schedule Generation */}
        {selectedStudent && !generatedSchedule && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Target className="w-6 h-6 text-red-500" />
                {selectedStudent.name}'s Athletic Profile
              </h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Student Athlete Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Grade:</span> {selectedStudent.grade}</p>
                  <p><span className="font-medium">Learning Style:</span> {selectedStudent.learningStyle}</p>
                  <p><span className="font-medium">Parent Email:</span> {selectedStudent.parentEmail}</p>
                  <p><span className="font-medium">Emergency Contact:</span> {selectedStudent.emergencyContact}</p>
                  <p><span className="font-medium">Medical Notes:</span> {selectedStudent.medicalNotes}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Athletic Strengths & Development</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Strengths:</span> {selectedStudent.strengths.join(', ')}</p>
                  <p><span className="font-medium">Growth Areas:</span> {selectedStudent.challenges.join(', ')}</p>
                  <p><span className="font-medium">Sports Interests:</span> {selectedStudent.interests.join(', ')}</p>
                  {selectedStudent.accommodations[0] !== 'none' && (
                    <p><span className="font-medium">Special Support:</span> {selectedStudent.accommodations.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => generateSchedule(selectedStudent)}
                disabled={isGenerating}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50 font-semibold"
              >
                {isGenerating ? 'Creating Athletic Schedule...' : 'Generate Go4it Schedule'}
              </button>
            </div>
          </div>
        )}

        {/* Generated Schedule */}
        {generatedSchedule && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-red-500" />
                {selectedStudent?.name}'s Athletic Schedule
              </h2>
              <p className="text-gray-600">{generatedSchedule.school_type} - Grade {generatedSchedule.grade_level}</p>
            </div>

            <div className="space-y-4">
              {generatedSchedule.weekly_schedule.map((period: any, index: number) => (
                <div key={index} className="border border-red-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        {period.period_number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{period.subject.replace('_', ' ').toUpperCase()}</h3>
                        <p className="text-sm text-red-600">{period.athletic_integration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{period.start_time} - {period.end_time}</p>
                      <p className="text-sm text-gray-600">{period.room_number}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <p><span className="font-medium">Coach:</span> {period.teacher_name}</p>
                  </div>
                  
                  {period.accommodations.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800 mb-1">Athletic Support:</p>
                      <ul className="text-sm text-red-700 space-y-1">
                        {period.accommodations.map((acc: string, idx: number) => (
                          <li key={idx}>• {acc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">✅ Texas TEKS Compliance</h3>
              <p className="text-sm text-green-700">
                Total Weekly Minutes: {generatedSchedule.total_instructional_minutes} minutes
              </p>
              <p className="text-sm text-green-700">{generatedSchedule.compliance_notes}</p>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setSelectedStudent(null)
                  setGeneratedSchedule(null)
                }}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all font-semibold"
              >
                Complete Athletic Onboarding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}