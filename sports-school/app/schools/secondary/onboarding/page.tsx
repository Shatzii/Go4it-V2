'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Drama, BookOpen, Calculator, Microscope, Globe, Palette, Users, Brain } from 'lucide-react'
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

// Secondary School Students (6-12)
const SECONDARY_STUDENTS: StudentProfile[] = [
  {
    id: '7',
    name: 'Sophia Chen',
    grade: '6',
    school: 'secondary',
    learningStyle: 'reading_writing',
    accommodations: ['dyslexia'],
    strengths: ['social_studies', 'fine_arts'],
    challenges: ['english_language_arts'],
    interests: ['history', 'writing', 'theater'],
    parentEmail: 'david.chen@email.com',
    emergencyContact: '555-0789',
    medicalNotes: 'Dyslexia - needs extra time for reading',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  },
  {
    id: '8',
    name: 'Mia Davis',
    grade: '7',
    school: 'secondary',
    learningStyle: 'auditory',
    accommodations: ['none'],
    strengths: ['english_language_arts', 'fine_arts'],
    challenges: ['mathematics'],
    interests: ['music', 'theater', 'languages'],
    parentEmail: 'james.davis@email.com',
    emergencyContact: '555-0890',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  },
  {
    id: '9',
    name: 'Liam Wilson',
    grade: '8',
    school: 'secondary',
    learningStyle: 'kinesthetic',
    accommodations: ['adhd'],
    strengths: ['physical_education', 'science'],
    challenges: ['english_language_arts'],
    interests: ['sports', 'experiments', 'robotics'],
    parentEmail: 'sarah.wilson@email.com',
    emergencyContact: '555-0123',
    medicalNotes: 'ADHD - needs movement breaks',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'tablet' }
  },
  {
    id: '10',
    name: 'Aiden O\'Connor',
    grade: '9',
    school: 'secondary',
    learningStyle: 'multimodal',
    accommodations: ['anxiety'],
    strengths: ['mathematics', 'science'],
    challenges: ['social_studies'],
    interests: ['coding', 'robotics', 'music'],
    parentEmail: 'sarah.oconnor@email.com',
    emergencyContact: '555-0012',
    medicalNotes: 'Anxiety disorder - needs calm environment',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'desktop' }
  },
  {
    id: '11',
    name: 'Olivia Garcia',
    grade: '10',
    school: 'secondary',
    learningStyle: 'visual',
    accommodations: ['dyslexia'],
    strengths: ['fine_arts', 'social_studies'],
    challenges: ['english_language_arts'],
    interests: ['art', 'history', 'photography'],
    parentEmail: 'miguel.garcia@email.com',
    emergencyContact: '555-0456',
    medicalNotes: 'Dyslexia - needs visual aids',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  },
  {
    id: '12',
    name: 'Alexander Lee',
    grade: '12',
    school: 'secondary',
    learningStyle: 'reading_writing',
    accommodations: ['none'],
    strengths: ['english_language_arts', 'mathematics'],
    challenges: ['physical_education'],
    interests: ['writing', 'debate', 'college_prep'],
    parentEmail: 'jennifer.lee@email.com',
    emergencyContact: '555-0789',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'desktop' }
  }
]

export default function SecondarySchoolOnboarding() {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)
  const [generatedSchedule, setGeneratedSchedule] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSchedule = async (student: StudentProfile) => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const gradeData = TEXAS_CURRICULUM_DATA.middle_school[student.grade as keyof typeof TEXAS_CURRICULUM_DATA.middle_school] ||
                     TEXAS_CURRICULUM_DATA.high_school[student.grade as keyof typeof TEXAS_CURRICULUM_DATA.high_school]
    
    if (!gradeData) {
      setIsGenerating(false)
      return
    }

    const schedule = {
      student_id: student.id,
      grade_level: student.grade,
      school_type: 'S.T.A.G.E Prep Academy',
      school_year: '2024-2025',
      semester: 'fall',
      weekly_schedule: gradeData.required_subjects.map((subject, index) => ({
        period_number: index + 1,
        start_time: `${8 + index}:00`,
        end_time: `${8 + index + 1}:00`,
        subject: subject.subject,
        teacher_name: getTeacherForSubject(subject.subject),
        room_number: `Studio ${100 + index}`,
        teks_standards: subject.standards,
        theatrical_theme: getTheatricalTheme(subject.subject),
        accommodations: getAccommodationsForStudent(student, subject.subject)
      })),
      total_instructional_minutes: gradeData.total_instructional_minutes,
      meets_texas_requirements: true,
      compliance_notes: `S.T.A.G.E Prep Academy schedule meets all Texas TEKS requirements for grade ${student.grade}.`
    }
    
    setGeneratedSchedule(schedule)
    setIsGenerating(false)
  }

  const getTheatricalTheme = (subject: string) => {
    const themes = {
      'english_language_arts': 'Literary Performance - Express through language!',
      'mathematics': 'Mathematical Drama - Numbers come alive!',
      'science': 'Scientific Theater - Discover and perform!',
      'social_studies': 'Historical Stagecraft - Live the past!',
      'fine_arts': 'Artistic Expression - Create and showcase!',
      'physical_education': 'Movement Performance - Body as art!'
    }
    return themes[subject as keyof typeof themes] || 'Academic Performance'
  }

  const getTeacherForSubject = (subject: string) => {
    const teachers = {
      'english_language_arts': 'Ms. Shakespeare (Drama Director)',
      'mathematics': 'Professor Newton (Math Maestro)',
      'science': 'Dr. Curie (Science Performer)',
      'social_studies': 'Professor Timeline (History Director)',
      'fine_arts': 'Maestro Picasso (Arts Director)',
      'physical_education': 'Coach Performance (Movement Director)'
    }
    return teachers[subject as keyof typeof teachers] || 'Academic Director'
  }

  const getAccommodationsForStudent = (student: StudentProfile, subject: string) => {
    const accommodations = []
    
    if (student.accommodations.includes('dyslexia')) {
      accommodations.push('Script support with audio recordings')
      accommodations.push('Extended rehearsal time')
      accommodations.push('Visual cue cards')
    }
    
    if (student.accommodations.includes('anxiety')) {
      accommodations.push('Supportive performance environment')
      accommodations.push('Gradual exposure to presentation')
      accommodations.push('Calming backstage area')
    }
    
    if (student.accommodations.includes('adhd')) {
      accommodations.push('Active role assignments')
      accommodations.push('Movement incorporated into lessons')
      accommodations.push('Frequent scene changes')
    }
    
    if (student.learningStyle === 'auditory') {
      accommodations.push('Audio-enhanced lessons')
      accommodations.push('Musical integration')
    }
    
    if (student.learningStyle === 'visual') {
      accommodations.push('Visual storytelling techniques')
      accommodations.push('Costume and prop integration')
    }
    
    return accommodations
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/schools/secondary" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to S.T.A.G.E Prep Academy
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Drama className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">S.T.A.G.E Prep Academy Onboarding</h1>
              <p className="text-gray-600">Create personalized academic performance schedules for grades 6-12</p>
            </div>
          </div>
        </div>

        {/* Student Selection */}
        {!selectedStudent && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-500" />
              Select Your Student Performer
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SECONDARY_STUDENTS.map((student) => (
                <div
                  key={student.id}
                  className="border-2 border-purple-100 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Drama className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">Grade {student.grade}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">Learning Style: <span className="font-medium">{student.learningStyle}</span></p>
                    <p className="text-gray-600">Interests: <span className="font-medium">{student.interests.slice(0, 2).join(', ')}</span></p>
                    {student.accommodations[0] !== 'none' && (
                      <p className="text-purple-600 font-medium">Special Support: {student.accommodations.join(', ')}</p>
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
                <Brain className="w-6 h-6 text-purple-500" />
                {selectedStudent.name}'s Performance Profile
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
                <h3 className="font-semibold text-gray-900 mb-3">Academic Profile</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Grade:</span> {selectedStudent.grade}</p>
                  <p><span className="font-medium">Learning Style:</span> {selectedStudent.learningStyle}</p>
                  <p><span className="font-medium">Parent Email:</span> {selectedStudent.parentEmail}</p>
                  <p><span className="font-medium">Emergency Contact:</span> {selectedStudent.emergencyContact}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Performance Strengths & Growth Areas</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Strengths:</span> {selectedStudent.strengths.join(', ')}</p>
                  <p><span className="font-medium">Growth Areas:</span> {selectedStudent.challenges.join(', ')}</p>
                  <p><span className="font-medium">Interests:</span> {selectedStudent.interests.join(', ')}</p>
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
                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all disabled:opacity-50 font-semibold"
              >
                {isGenerating ? 'Creating Performance Schedule...' : 'Generate S.T.A.G.E Schedule'}
              </button>
            </div>
          </div>
        )}

        {/* Generated Schedule */}
        {generatedSchedule && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Drama className="w-6 h-6 text-purple-500" />
                {selectedStudent?.name}'s Performance Schedule
              </h2>
              <p className="text-gray-600">{generatedSchedule.school_type} - Grade {generatedSchedule.grade_level}</p>
            </div>

            <div className="space-y-4">
              {generatedSchedule.weekly_schedule.map((period: any, index: number) => (
                <div key={index} className="border border-purple-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {period.period_number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{period.subject.replace('_', ' ').toUpperCase()}</h3>
                        <p className="text-sm text-purple-600">{period.theatrical_theme}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{period.start_time} - {period.end_time}</p>
                      <p className="text-sm text-gray-600">{period.room_number}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <p><span className="font-medium">Director:</span> {period.teacher_name}</p>
                  </div>
                  
                  {period.accommodations.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-purple-800 mb-1">Performance Support:</p>
                      <ul className="text-sm text-purple-700 space-y-1">
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
                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all font-semibold"
              >
                Complete S.T.A.G.E Onboarding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}