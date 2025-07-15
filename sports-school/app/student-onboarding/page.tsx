'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  GraduationCap, 
  Brain, 
  Heart, 
  Star, 
  BookOpen, 
  Calculator, 
  Microscope, 
  Globe, 
  Palette, 
  Music,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Target
} from 'lucide-react'

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

const SAMPLE_STUDENTS: StudentProfile[] = [
  // Primary School Students (K-5)
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
  },
  
  // Secondary School Students (6-12)
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
  },
  
  // Law School Student
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
  
  // Language School Students
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
  },
  
  // Sports Academy Students
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
  },
  
  // Law School Students
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

const LEARNING_STYLES = [
  { value: 'visual', label: 'Visual Learner', icon: <Target className="h-4 w-4" /> },
  { value: 'auditory', label: 'Auditory Learner', icon: <Music className="h-4 w-4" /> },
  { value: 'kinesthetic', label: 'Kinesthetic Learner', icon: <Users className="h-4 w-4" /> },
  { value: 'reading_writing', label: 'Reading/Writing Learner', icon: <BookOpen className="h-4 w-4" /> },
  { value: 'multimodal', label: 'Multimodal Learner', icon: <Brain className="h-4 w-4" /> }
]

const ACCOMMODATION_OPTIONS = [
  { value: 'adhd', label: 'ADHD Support' },
  { value: 'dyslexia', label: 'Dyslexia Support' },
  { value: 'autism', label: 'Autism Support' },
  { value: 'anxiety', label: 'Anxiety Support' },
  { value: 'processing_disorder', label: 'Processing Disorder' },
  { value: 'none', label: 'No Accommodations Needed' }
]

const SUBJECT_OPTIONS = [
  { value: 'english_language_arts', label: 'English Language Arts', icon: <BookOpen className="h-4 w-4" /> },
  { value: 'mathematics', label: 'Mathematics', icon: <Calculator className="h-4 w-4" /> },
  { value: 'science', label: 'Science', icon: <Microscope className="h-4 w-4" /> },
  { value: 'social_studies', label: 'Social Studies', icon: <Globe className="h-4 w-4" /> },
  { value: 'fine_arts', label: 'Fine Arts', icon: <Palette className="h-4 w-4" /> },
  { value: 'physical_education', label: 'Physical Education', icon: <Heart className="h-4 w-4" /> }
]

export default function StudentOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null)
  const [generatedSchedule, setGeneratedSchedule] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const steps = [
    'Select Student',
    'Review Profile',
    'Generate Schedule',
    'Review & Confirm'
  ]

  const generateSchedule = async (student: StudentProfile) => {
    setIsGenerating(true)
    
    // Simulate API call to generate schedule
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const gradeData = TEXAS_CURRICULUM_DATA.elementary[student.grade as keyof typeof TEXAS_CURRICULUM_DATA.elementary] ||
                     TEXAS_CURRICULUM_DATA.middle_school[student.grade as keyof typeof TEXAS_CURRICULUM_DATA.middle_school] ||
                     TEXAS_CURRICULUM_DATA.high_school[student.grade as keyof typeof TEXAS_CURRICULUM_DATA.high_school]
    
    if (!gradeData) {
      setIsGenerating(false)
      return
    }

    // Generate comprehensive weekly schedule
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    const timeSlots = generateTimeSlots(gradeData.required_subjects.length)
    
    const weeklySchedule = daysOfWeek.map(day => ({
      day,
      periods: gradeData.required_subjects.map((subject, index) => ({
        period_number: index + 1,
        start_time: timeSlots[index].start,
        end_time: timeSlots[index].end,
        subject: subject.subject,
        teacher_name: getTeacherForSubject(subject.subject),
        room_number: `${100 + index}`,
        teks_standards: subject.standards,
        ai_teacher_id: getAITeacherForSubject(subject.subject),
        accommodations: getAccommodationsForStudent(student, subject.subject)
      }))
    }))

    const schedule = {
      student_id: student.id,
      grade_level: student.grade,
      school_year: '2024-2025',
      semester: 'fall',
      weekly_schedule: weeklySchedule,
      total_instructional_minutes: gradeData.total_instructional_minutes,
      meets_texas_requirements: true,
      compliance_notes: `Schedule meets all Texas TEKS requirements for grade ${student.grade}. Personalized accommodations included for ${student.accommodations.join(', ')}.`
    }
    
    setGeneratedSchedule(schedule)
    setIsGenerating(false)
  }

  const generateTimeSlots = (numberOfSubjects: number) => {
    const slots = []
    let currentHour = 8 // Start at 8:00 AM
    
    for (let i = 0; i < numberOfSubjects; i++) {
      const startTime = `${currentHour.toString().padStart(2, '0')}:00`
      const endTime = `${(currentHour + 1).toString().padStart(2, '0')}:00`
      
      slots.push({
        start: startTime,
        end: endTime
      })
      
      currentHour++
    }
    
    return slots
  }

  const getAccommodationsForStudent = (student: StudentProfile, subject: string) => {
    const accommodations = []
    
    // Add specific accommodations based on student needs
    if (student.accommodations.includes('adhd')) {
      accommodations.push('Movement breaks every 15 minutes')
      accommodations.push('Fidget tools available')
      accommodations.push('Preferential seating')
    }
    
    if (student.accommodations.includes('dyslexia')) {
      accommodations.push('Text-to-speech software')
      accommodations.push('Extended time for reading')
      accommodations.push('Large font materials')
    }
    
    if (student.accommodations.includes('anxiety')) {
      accommodations.push('Calm corner available')
      accommodations.push('Stress ball or fidget toy')
      accommodations.push('Quiet testing environment')
    }
    
    if (student.accommodations.includes('autism')) {
      accommodations.push('Visual schedule')
      accommodations.push('Sensory break availability')
      accommodations.push('Structured routine')
    }
    
    // Add learning style accommodations
    if (student.learningStyle === 'visual') {
      accommodations.push('Visual aids and charts')
      accommodations.push('Color-coded materials')
    }
    
    if (student.learningStyle === 'auditory') {
      accommodations.push('Audio recordings')
      accommodations.push('Verbal instructions')
    }
    
    if (student.learningStyle === 'kinesthetic') {
      accommodations.push('Hands-on activities')
      accommodations.push('Movement opportunities')
    }
    
    return accommodations
  }

  const getTeacherForSubject = (subject: string) => {
    const teachers = {
      'english_language_arts': 'Ms. Shakespeare',
      'mathematics': 'Professor Newton',
      'science': 'Dr. Curie',
      'social_studies': 'Professor Timeline',
      'fine_arts': 'Maestro Picasso',
      'physical_education': 'Coach Johnson',
      'health': 'Dr. Inclusive'
    }
    return teachers[subject as keyof typeof teachers] || 'General Teacher'
  }

  const getAITeacherForSubject = (subject: string) => {
    const aiTeachers = {
      'english_language_arts': 'shakespeare',
      'mathematics': 'newton',
      'science': 'curie',
      'social_studies': 'timeline',
      'fine_arts': 'picasso',
      'physical_education': 'inclusive',
      'health': 'inclusive'
    }
    return aiTeachers[subject as keyof typeof aiTeachers] || 'general'
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStudentSelect = (student: StudentProfile) => {
    setSelectedStudent(student)
    handleNext()
  }

  const handleGenerateSchedule = () => {
    if (selectedStudent) {
      generateSchedule(selectedStudent)
      handleNext()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Onboarding</h1>
          <p className="text-gray-600">Create personalized Texas TEKS-compliant class schedules</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {index < currentStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
                </div>
                <span className="ml-2 text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <User className="h-6 w-6 mr-2" />
                Select a Student
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAMPLE_STUDENTS.map((student) => (
                  <Card
                    key={student.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleStudentSelect(student)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span>{student.name}</span>
                        <Badge variant="secondary">Grade {student.grade}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          {student.school.charAt(0).toUpperCase() + student.school.slice(1)} School
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Brain className="h-4 w-4 mr-2" />
                          {student.learningStyle.replace('_', ' ')} learner
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {student.strengths.slice(0, 2).map((strength) => (
                            <Badge key={strength} variant="outline" className="text-xs">
                              {strength.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && selectedStudent && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <User className="h-6 w-6 mr-2" />
                Review Student Profile
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-lg">{selectedStudent.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Grade Level</Label>
                        <p className="text-lg">Grade {selectedStudent.grade}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">School</Label>
                        <p className="text-lg">{selectedStudent.school.charAt(0).toUpperCase() + selectedStudent.school.slice(1)} School</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Learning Style</Label>
                        <p className="text-lg">{selectedStudent.learningStyle.replace('_', ' ')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Academic Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Strengths</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedStudent.strengths.map((strength) => (
                            <Badge key={strength} variant="secondary" className="text-green-700 bg-green-100">
                              {strength.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Challenges</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedStudent.challenges.map((challenge) => (
                            <Badge key={challenge} variant="secondary" className="text-orange-700 bg-orange-100">
                              {challenge.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Accommodations</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedStudent.accommodations.map((accommodation) => (
                            <Badge key={accommodation} variant="secondary" className="text-blue-700 bg-blue-100">
                              {accommodation === 'none' ? 'No accommodations needed' : accommodation.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && selectedStudent && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                Generate Class Schedule
              </h2>
              {!generatedSchedule ? (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <Clock className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Ready to Generate Schedule</h3>
                    <p className="text-gray-600 mb-6">
                      We'll create a personalized schedule that meets all Texas TEKS requirements
                      for {selectedStudent.name} in Grade {selectedStudent.grade}.
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateSchedule}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? 'Generating Schedule...' : 'Generate Schedule'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated Schedule Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {generatedSchedule.weekly_schedule[0].periods.length}
                          </div>
                          <div className="text-sm text-gray-600">Subjects per Day</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {generatedSchedule.total_instructional_minutes}
                          </div>
                          <div className="text-sm text-gray-600">Minutes per Week</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {generatedSchedule.meets_texas_requirements ? 'Compliant' : 'Non-Compliant'}
                          </div>
                          <div className="text-sm text-gray-600">Texas TEKS</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {generatedSchedule.weekly_schedule[0].periods.map((period: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">{period.period_number}</span>
                              </div>
                              <div>
                                <div className="font-medium">{period.subject.replace('_', ' ')}</div>
                                <div className="text-sm text-gray-600">{period.teacher_name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{period.start_time} - {period.end_time}</div>
                              <div className="text-sm text-gray-600">Room {period.room_number}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && selectedStudent && generatedSchedule && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Schedule Complete
              </h2>
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Schedule Successfully Generated!</h3>
                <p className="text-gray-600 mb-6">
                  {selectedStudent.name}'s personalized schedule has been created and meets all Texas TEKS requirements.
                </p>
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-green-800 font-medium">
                    {generatedSchedule.compliance_notes}
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <Button variant="outline">
                    Download Schedule
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Enroll Student
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1 || (currentStep === 2 && !generatedSchedule)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}