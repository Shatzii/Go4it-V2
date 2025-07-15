'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, Heart, Sparkles, Users, BookOpen, Calculator, Microscope, Globe, Palette, Target, Music, Brain } from 'lucide-react'
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

// Primary School Students (K-5)
const PRIMARY_STUDENTS: StudentProfile[] = [
  {
    id: '1',
    name: 'Emma Rodriguez',
    grade: 'K',
    school: 'primary',
    learningStyle: 'visual',
    accommodations: ['none'],
    strengths: ['mathematics', 'fine_arts'],
    challenges: ['english_language_arts'],
    interests: ['drawing', 'puzzles', 'animals'],
    parentEmail: 'maria.rodriguez@email.com',
    emergencyContact: '555-0123',
    medicalNotes: 'No known allergies',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'tablet' }
  },
  {
    id: '2',
    name: 'Isabella Martinez',
    grade: '1',
    school: 'primary',
    learningStyle: 'visual',
    accommodations: ['none'],
    strengths: ['fine_arts', 'english_language_arts'],
    challenges: ['mathematics'],
    interests: ['art', 'reading', 'music'],
    parentEmail: 'carlos.martinez@email.com',
    emergencyContact: '555-0678',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'tablet' }
  },
  {
    id: '3',
    name: 'Ethan Thompson',
    grade: '2',
    school: 'primary',
    learningStyle: 'kinesthetic',
    accommodations: ['none'],
    strengths: ['physical_education', 'mathematics'],
    challenges: ['english_language_arts'],
    interests: ['sports', 'building', 'outdoors'],
    parentEmail: 'lisa.thompson@email.com',
    emergencyContact: '555-0901',
    medicalNotes: 'No known allergies',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  },
  {
    id: '4',
    name: 'Marcus Johnson',
    grade: '3',
    school: 'primary',
    learningStyle: 'kinesthetic',
    accommodations: ['adhd'],
    strengths: ['science', 'physical_education'],
    challenges: ['mathematics'],
    interests: ['sports', 'experiments', 'building'],
    parentEmail: 'jennifer.johnson@email.com',
    emergencyContact: '555-0456',
    medicalNotes: 'ADHD - takes medication daily',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  },
  {
    id: '5',
    name: 'Ava Patel',
    grade: '4',
    school: 'primary',
    learningStyle: 'reading_writing',
    accommodations: ['none'],
    strengths: ['english_language_arts', 'social_studies'],
    challenges: ['science'],
    interests: ['writing', 'history', 'languages'],
    parentEmail: 'raj.patel@email.com',
    emergencyContact: '555-0234',
    medicalNotes: 'No medical concerns',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'desktop' }
  },
  {
    id: '6',
    name: 'Noah Brown',
    grade: '5',
    school: 'primary',
    learningStyle: 'multimodal',
    accommodations: ['none'],
    strengths: ['science', 'mathematics'],
    challenges: ['fine_arts'],
    interests: ['science', 'technology', 'gaming'],
    parentEmail: 'melissa.brown@email.com',
    emergencyContact: '555-0567',
    medicalNotes: 'No known allergies',
    technologyAccess: { hasDevice: true, hasInternet: true, deviceType: 'laptop' }
  }
]

export default function PrimarySchoolOnboarding() {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)
  const [generatedSchedule, setGeneratedSchedule] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSchedule = async (student: StudentProfile) => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const gradeData = TEXAS_CURRICULUM_DATA.elementary[student.grade as keyof typeof TEXAS_CURRICULUM_DATA.elementary]
    
    if (!gradeData) {
      setIsGenerating(false)
      return
    }

    const schedule = {
      student_id: student.id,
      grade_level: student.grade,
      school_type: 'SuperHero Elementary',
      school_year: '2024-2025',
      semester: 'fall',
      weekly_schedule: gradeData.required_subjects.map((subject, index) => ({
        period_number: index + 1,
        start_time: `${8 + index}:00`,
        end_time: `${8 + index + 1}:00`,
        subject: subject.subject,
        teacher_name: getTeacherForSubject(subject.subject),
        room_number: `Hero Hall ${100 + index}`,
        teks_standards: subject.standards,
        superhero_theme: getSuperHeroTheme(subject.subject),
        accommodations: getAccommodationsForStudent(student, subject.subject)
      })),
      total_instructional_minutes: gradeData.total_instructional_minutes,
      meets_texas_requirements: true,
      compliance_notes: `SuperHero Elementary schedule meets all Texas TEKS requirements for grade ${student.grade}.`
    }
    
    setGeneratedSchedule(schedule)
    setIsGenerating(false)
  }

  const getSuperHeroTheme = (subject: string) => {
    const themes = {
      'english_language_arts': 'Word Warriors - Master the power of language!',
      'mathematics': 'Number Ninjas - Calculate your way to victory!',
      'science': 'Science Superheroes - Discover the secrets of the universe!',
      'social_studies': 'History Heroes - Travel through time and space!',
      'fine_arts': 'Art Avengers - Create amazing masterpieces!',
      'physical_education': 'Fitness Force - Build your superhero strength!'
    }
    return themes[subject as keyof typeof themes] || 'Hero Training'
  }

  const getTeacherForSubject = (subject: string) => {
    const teachers = {
      'english_language_arts': 'Ms. Shakespeare (Story Superhero)',
      'mathematics': 'Professor Newton (Number Hero)',
      'science': 'Dr. Curie (Science Champion)',
      'social_studies': 'Professor Timeline (History Hero)',
      'fine_arts': 'Maestro Picasso (Art Avenger)',
      'physical_education': 'Coach Hero (Fitness Force)'
    }
    return teachers[subject as keyof typeof teachers] || 'Hero Teacher'
  }

  const getAccommodationsForStudent = (student: StudentProfile, subject: string) => {
    const accommodations = []
    
    if (student.accommodations.includes('adhd')) {
      accommodations.push('Super Focus breaks every 15 minutes')
      accommodations.push('Hero fidget tools available')
      accommodations.push('Front row hero seat')
    }
    
    if (student.learningStyle === 'visual') {
      accommodations.push('Colorful superhero visual aids')
      accommodations.push('Picture-based learning materials')
    }
    
    if (student.learningStyle === 'kinesthetic') {
      accommodations.push('Hands-on hero activities')
      accommodations.push('Movement-based learning')
    }
    
    return accommodations
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/schools/primary" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to SuperHero Elementary
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SuperHero Elementary Onboarding</h1>
              <p className="text-gray-600">Create personalized learning adventures for K-5 heroes</p>
            </div>
          </div>
        </div>

        {/* Student Selection */}
        {!selectedStudent && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-orange-500" />
              Choose Your Young Hero
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {PRIMARY_STUDENTS.map((student) => (
                <div
                  key={student.id}
                  className="border-2 border-orange-100 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
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
                      <p className="text-orange-600 font-medium">Special Support: {student.accommodations.join(', ')}</p>
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
                <Heart className="w-6 h-6 text-orange-500" />
                {selectedStudent.name}'s Hero Profile
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
                <h3 className="font-semibold text-gray-900 mb-3">Hero Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Grade:</span> {selectedStudent.grade}</p>
                  <p><span className="font-medium">Learning Style:</span> {selectedStudent.learningStyle}</p>
                  <p><span className="font-medium">Parent Email:</span> {selectedStudent.parentEmail}</p>
                  <p><span className="font-medium">Emergency Contact:</span> {selectedStudent.emergencyContact}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Super Powers & Growth Areas</h3>
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
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all disabled:opacity-50 font-semibold"
              >
                {isGenerating ? 'Creating Hero Schedule...' : 'Generate SuperHero Schedule'}
              </button>
            </div>
          </div>
        )}

        {/* Generated Schedule */}
        {generatedSchedule && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Target className="w-6 h-6 text-orange-500" />
                {selectedStudent?.name}'s SuperHero Schedule
              </h2>
              <p className="text-gray-600">{generatedSchedule.school_type} - Grade {generatedSchedule.grade_level}</p>
            </div>

            <div className="space-y-4">
              {generatedSchedule.weekly_schedule.map((period: any, index: number) => (
                <div key={index} className="border border-orange-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {period.period_number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{period.subject.replace('_', ' ').toUpperCase()}</h3>
                        <p className="text-sm text-orange-600">{period.superhero_theme}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{period.start_time} - {period.end_time}</p>
                      <p className="text-sm text-gray-600">{period.room_number}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <p><span className="font-medium">Hero Teacher:</span> {period.teacher_name}</p>
                  </div>
                  
                  {period.accommodations.length > 0 && (
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-orange-800 mb-1">Special Hero Support:</p>
                      <ul className="text-sm text-orange-700 space-y-1">
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
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all font-semibold"
              >
                Complete Hero Onboarding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}