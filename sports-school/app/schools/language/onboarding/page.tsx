'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Globe, Languages, BookOpen, Users, Brain, Target } from 'lucide-react'
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

// Language School Students
const LANGUAGE_STUDENTS: StudentProfile[] = [
  {
    id: '14',
    name: 'Diego Hernandez',
    grade: '9',
    school: 'language',
    learningStyle: 'auditory',
    accommodations: ['none'],
    strengths: ['world_languages', 'english_language_arts'],
    challenges: ['mathematics'],
    interests: ['spanish', 'cultural_studies', 'international_relations'],
    parentEmail: 'lucia.hernandez@email.com',
    emergencyContact: '555-0987',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  },
  {
    id: '20',
    name: 'Mei Chen',
    grade: '10',
    school: 'language',
    learningStyle: 'visual',
    accommodations: ['none'],
    strengths: ['world_languages', 'fine_arts'],
    challenges: ['science'],
    interests: ['mandarin', 'chinese_culture', 'translation'],
    parentEmail: 'wei.chen@email.com',
    emergencyContact: '555-0432',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'tablet' }
  },
  {
    id: '21',
    name: 'Pierre Dubois',
    grade: '11',
    school: 'language',
    learningStyle: 'multimodal',
    accommodations: ['none'],
    strengths: ['world_languages', 'social_studies'],
    challenges: ['mathematics'],
    interests: ['french', 'european_history', 'diplomacy'],
    parentEmail: 'marie.dubois@email.com',
    emergencyContact: '555-0765',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  }
]

export default function LanguageSchoolOnboarding() {
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
      school_type: 'Liota Global Language Academy',
      school_year: '2024-2025',
      semester: 'fall',
      weekly_schedule: gradeData.required_subjects.map((subject, index) => ({
        period_number: index + 1,
        start_time: `${8 + index}:00`,
        end_time: `${8 + index + 1}:00`,
        subject: subject.subject,
        teacher_name: getTeacherForSubject(subject.subject),
        room_number: `Cultural Center ${100 + index}`,
        teks_standards: subject.standards,
        cultural_integration: getCulturalIntegration(subject.subject),
        target_language: getTargetLanguage(student),
        accommodations: getAccommodationsForStudent(student, subject.subject)
      })),
      total_instructional_minutes: gradeData.total_instructional_minutes,
      meets_texas_requirements: true,
      compliance_notes: `Liota Global Language Academy schedule meets all Texas TEKS requirements for grade ${student.grade} with cultural immersion.`
    }
    
    setGeneratedSchedule(schedule)
    setIsGenerating(false)
  }

  const getTargetLanguage = (student: StudentProfile) => {
    if (student.interests.includes('spanish')) return 'Spanish'
    if (student.interests.includes('mandarin')) return 'Mandarin Chinese'
    if (student.interests.includes('french')) return 'French'
    return 'Spanish' // Default
  }

  const getCulturalIntegration = (subject: string) => {
    const integrations = {
      'english_language_arts': 'Comparative literature and cross-cultural communication',
      'mathematics': 'International number systems and cultural mathematics',
      'science': 'Global scientific discoveries and cultural perspectives',
      'social_studies': 'World cultures and international relations',
      'fine_arts': 'Cultural arts and international artistic traditions',
      'physical_education': 'Traditional cultural games and global sports'
    }
    return integrations[subject as keyof typeof integrations] || 'Cultural perspective integration'
  }

  const getTeacherForSubject = (subject: string) => {
    const teachers = {
      'english_language_arts': 'Profesora Literatura (Cultural Literature)',
      'mathematics': 'Professor Numbers (International Math)',
      'science': 'Dr. Global (World Science)',
      'social_studies': 'Professor Mundo (World Cultures)',
      'fine_arts': 'Maestra Arts (Cultural Arts)',
      'physical_education': 'Coach Mundial (Global Sports)'
    }
    return teachers[subject as keyof typeof teachers] || 'Professor Global'
  }

  const getAccommodationsForStudent = (student: StudentProfile, subject: string) => {
    const accommodations = []
    
    if (student.learningStyle === 'auditory') {
      accommodations.push('Audio language immersion')
      accommodations.push('Cultural music integration')
      accommodations.push('Pronunciation practice sessions')
    }
    
    if (student.learningStyle === 'visual') {
      accommodations.push('Visual cultural materials')
      accommodations.push('Infographic learning aids')
      accommodations.push('Cultural art integration')
    }
    
    if (student.learningStyle === 'multimodal') {
      accommodations.push('Multi-sensory language learning')
      accommodations.push('Cultural experience activities')
      accommodations.push('Interactive language games')
    }
    
    if (student.interests.includes('cultural_studies')) {
      accommodations.push('Deep cultural context lessons')
      accommodations.push('Historical cultural connections')
    }
    
    if (student.interests.includes('translation')) {
      accommodations.push('Translation practice opportunities')
      accommodations.push('Bilingual text analysis')
    }
    
    return accommodations
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/schools/language" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Liota Global Language Academy
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Liota Global Language Academy Onboarding</h1>
              <p className="text-gray-600">Create immersive multilingual schedules for grades 9-12</p>
            </div>
          </div>
        </div>

        {/* Student Selection */}
        {!selectedStudent && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-green-500" />
              Select Your Global Language Student
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {LANGUAGE_STUDENTS.map((student) => (
                <div
                  key={student.id}
                  className="border-2 border-green-100 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Languages className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">Grade {student.grade}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">Learning Style: <span className="font-medium">{student.learningStyle}</span></p>
                    <p className="text-gray-600">Languages: <span className="font-medium">{student.interests.slice(0, 2).join(', ')}</span></p>
                    {student.accommodations[0] !== 'none' && (
                      <p className="text-green-600 font-medium">Special Support: {student.accommodations.join(', ')}</p>
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
                <Brain className="w-6 h-6 text-green-500" />
                {selectedStudent.name}'s Language Profile
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
                <h3 className="font-semibold text-gray-900 mb-3">Language Student Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Grade:</span> {selectedStudent.grade}</p>
                  <p><span className="font-medium">Learning Style:</span> {selectedStudent.learningStyle}</p>
                  <p><span className="font-medium">Parent Email:</span> {selectedStudent.parentEmail}</p>
                  <p><span className="font-medium">Emergency Contact:</span> {selectedStudent.emergencyContact}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Cultural & Language Interests</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Academic Strengths:</span> {selectedStudent.strengths.join(', ')}</p>
                  <p><span className="font-medium">Growth Areas:</span> {selectedStudent.challenges.join(', ')}</p>
                  <p><span className="font-medium">Cultural Interests:</span> {selectedStudent.interests.join(', ')}</p>
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
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-50 font-semibold"
              >
                {isGenerating ? 'Creating Language Schedule...' : 'Generate Global Schedule'}
              </button>
            </div>
          </div>
        )}

        {/* Generated Schedule */}
        {generatedSchedule && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Globe className="w-6 h-6 text-green-500" />
                {selectedStudent?.name}'s Global Language Schedule
              </h2>
              <p className="text-gray-600">{generatedSchedule.school_type} - Grade {generatedSchedule.grade_level}</p>
              <p className="text-green-600 font-medium">Target Language: {generatedSchedule.weekly_schedule[0]?.target_language}</p>
            </div>

            <div className="space-y-4">
              {generatedSchedule.weekly_schedule.map((period: any, index: number) => (
                <div key={index} className="border border-green-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                        {period.period_number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{period.subject.replace('_', ' ').toUpperCase()}</h3>
                        <p className="text-sm text-green-600">{period.cultural_integration}</p>
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
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800 mb-1">Cultural Learning Support:</p>
                      <ul className="text-sm text-green-700 space-y-1">
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
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all font-semibold"
              >
                Complete Language Onboarding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}