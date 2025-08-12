'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Scale, Gavel, BookOpen, Users, Brain, Target } from 'lucide-react'
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

// Law School Students
const LAW_STUDENTS: StudentProfile[] = [
  {
    id: '13',
    name: 'Zoe Williams',
    grade: '11',
    school: 'law',
    learningStyle: 'auditory',
    accommodations: ['none'],
    strengths: ['english_language_arts', 'social_studies'],
    challenges: ['mathematics'],
    interests: ['debate', 'law', 'public_speaking'],
    parentEmail: 'robert.williams@email.com',
    emergencyContact: '555-0345',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  },
  {
    id: '18',
    name: 'Marcus Thompson',
    grade: '12',
    school: 'law',
    learningStyle: 'reading_writing',
    accommodations: ['none'],
    strengths: ['english_language_arts', 'social_studies'],
    challenges: ['science'],
    interests: ['constitutional_law', 'civil_rights', 'legal_research'],
    parentEmail: 'linda.thompson@email.com',
    emergencyContact: '555-0876',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  },
  {
    id: '19',
    name: 'Isabella Chen',
    grade: '11',
    school: 'law',
    learningStyle: 'multimodal',
    accommodations: ['none'],
    strengths: ['english_language_arts', 'social_studies'],
    challenges: ['mathematics'],
    interests: ['criminal_justice', 'forensics', 'legal_advocacy'],
    parentEmail: 'david.chen@email.com',
    emergencyContact: '555-0543',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'desktop' }
  }
]

export default function LawSchoolOnboarding() {
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
      school_type: 'Future Legal Professionals',
      school_year: '2024-2025',
      semester: 'fall',
      weekly_schedule: gradeData.required_subjects.map((subject, index) => ({
        period_number: index + 1,
        start_time: `${8 + index}:00`,
        end_time: `${8 + index + 1}:00`,
        subject: subject.subject,
        teacher_name: getTeacherForSubject(subject.subject),
        room_number: `Courtroom ${100 + index}`,
        teks_standards: subject.standards,
        legal_application: getLegalApplication(subject.subject),
        accommodations: getAccommodationsForStudent(student, subject.subject)
      })),
      total_instructional_minutes: gradeData.total_instructional_minutes,
      meets_texas_requirements: true,
      compliance_notes: `Future Legal Professionals schedule meets all Texas TEKS requirements for grade ${student.grade} with legal focus.`
    }
    
    setGeneratedSchedule(schedule)
    setIsGenerating(false)
  }

  const getLegalApplication = (subject: string) => {
    const applications = {
      'english_language_arts': 'Legal writing and constitutional interpretation',
      'mathematics': 'Legal statistics and evidence analysis',
      'science': 'Forensic science and legal evidence',
      'social_studies': 'Constitutional law and legal history',
      'fine_arts': 'Legal presentation and courtroom advocacy',
      'physical_education': 'Stress management for legal professionals'
    }
    return applications[subject as keyof typeof applications] || 'Legal perspective integration'
  }

  const getTeacherForSubject = (subject: string) => {
    const teachers = {
      'english_language_arts': 'Professor Legal (Constitutional Writing)',
      'mathematics': 'Judge Analytics (Legal Statistics)',
      'science': 'Dr. Forensic (Legal Evidence)',
      'social_studies': 'Professor Constitution (Legal History)',
      'fine_arts': 'Attorney Advocate (Legal Presentation)',
      'physical_education': 'Coach Balance (Professional Wellness)'
    }
    return teachers[subject as keyof typeof teachers] || 'Professor Legal'
  }

  const getAccommodationsForStudent = (student: StudentProfile, subject: string) => {
    const accommodations = []
    
    if (student.learningStyle === 'auditory') {
      accommodations.push('Recorded legal lectures')
      accommodations.push('Oral argument practice')
      accommodations.push('Audio case studies')
    }
    
    if (student.learningStyle === 'reading_writing') {
      accommodations.push('Extensive legal writing practice')
      accommodations.push('Case brief assignments')
      accommodations.push('Legal research projects')
    }
    
    if (student.learningStyle === 'multimodal') {
      accommodations.push('Visual case presentations')
      accommodations.push('Interactive legal simulations')
      accommodations.push('Multi-format legal materials')
    }
    
    if (student.interests.includes('debate')) {
      accommodations.push('Mock trial participation')
      accommodations.push('Legal debate opportunities')
    }
    
    if (student.interests.includes('constitutional_law')) {
      accommodations.push('Constitutional case analysis')
      accommodations.push('Supreme Court decision studies')
    }
    
    return accommodations
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/schools/law" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Future Legal Professionals
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Future Legal Professionals Onboarding</h1>
              <p className="text-gray-600">Create pre-law academic schedules for grades 11-12</p>
            </div>
          </div>
        </div>

        {/* Student Selection */}
        {!selectedStudent && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-500" />
              Select Your Future Legal Professional
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {LAW_STUDENTS.map((student) => (
                <div
                  key={student.id}
                  className="border-2 border-blue-100 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-blue-700 rounded-full flex items-center justify-center">
                      <Gavel className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">Grade {student.grade}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">Learning Style: <span className="font-medium">{student.learningStyle}</span></p>
                    <p className="text-gray-600">Legal Interests: <span className="font-medium">{student.interests.slice(0, 2).join(', ')}</span></p>
                    {student.accommodations[0] !== 'none' && (
                      <p className="text-blue-600 font-medium">Special Support: {student.accommodations.join(', ')}</p>
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
                <Brain className="w-6 h-6 text-blue-500" />
                {selectedStudent.name}'s Legal Profile
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
                <h3 className="font-semibold text-gray-900 mb-3">Pre-Law Student Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Grade:</span> {selectedStudent.grade}</p>
                  <p><span className="font-medium">Learning Style:</span> {selectedStudent.learningStyle}</p>
                  <p><span className="font-medium">Parent Email:</span> {selectedStudent.parentEmail}</p>
                  <p><span className="font-medium">Emergency Contact:</span> {selectedStudent.emergencyContact}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Legal Aptitude & Interests</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Academic Strengths:</span> {selectedStudent.strengths.join(', ')}</p>
                  <p><span className="font-medium">Growth Areas:</span> {selectedStudent.challenges.join(', ')}</p>
                  <p><span className="font-medium">Legal Interests:</span> {selectedStudent.interests.join(', ')}</p>
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
                className="bg-gradient-to-r from-gray-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-gray-700 hover:to-blue-800 transition-all disabled:opacity-50 font-semibold"
              >
                {isGenerating ? 'Creating Legal Schedule...' : 'Generate Pre-Law Schedule'}
              </button>
            </div>
          </div>
        )}

        {/* Generated Schedule */}
        {generatedSchedule && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Scale className="w-6 h-6 text-blue-500" />
                {selectedStudent?.name}'s Legal Schedule
              </h2>
              <p className="text-gray-600">{generatedSchedule.school_type} - Grade {generatedSchedule.grade_level}</p>
            </div>

            <div className="space-y-4">
              {generatedSchedule.weekly_schedule.map((period: any, index: number) => (
                <div key={index} className="border border-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                        {period.period_number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{period.subject.replace('_', ' ').toUpperCase()}</h3>
                        <p className="text-sm text-blue-600">{period.legal_application}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{period.start_time} - {period.end_time}</p>
                      <p className="text-sm text-gray-600">{period.room_number}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <p><span className="font-medium">Instructor:</span> {period.teacher_name}</p>
                  </div>
                  
                  {period.accommodations.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-800 mb-1">Legal Learning Support:</p>
                      <ul className="text-sm text-blue-700 space-y-1">
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
                className="bg-gradient-to-r from-gray-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-gray-700 hover:to-blue-800 transition-all font-semibold"
              >
                Complete Legal Onboarding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}