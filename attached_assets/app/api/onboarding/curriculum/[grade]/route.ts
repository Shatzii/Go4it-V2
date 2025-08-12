import { NextRequest, NextResponse } from 'next/server'
import { TEXAS_CURRICULUM_DATA } from '@/shared/texas-curriculum-schema'

export async function GET(
  request: NextRequest,
  { params }: { params: { grade: string } }
) {
  try {
    const grade = params.grade
    
    // Get curriculum data for the specified grade
    let gradeData = TEXAS_CURRICULUM_DATA.elementary[grade as keyof typeof TEXAS_CURRICULUM_DATA.elementary] ||
                    TEXAS_CURRICULUM_DATA.middle_school[grade as keyof typeof TEXAS_CURRICULUM_DATA.middle_school] ||
                    TEXAS_CURRICULUM_DATA.high_school[grade as keyof typeof TEXAS_CURRICULUM_DATA.high_school]
    
    if (!gradeData) {
      return NextResponse.json({ error: 'Grade not found' }, { status: 404 })
    }
    
    // Enhance the data with additional details
    const enhancedData = {
      ...gradeData,
      grade_level: grade,
      school_level: getSchoolLevel(grade),
      detailed_subjects: gradeData.required_subjects.map(subject => ({
        ...subject,
        description: getSubjectDescription(subject.subject),
        key_skills: getKeySkills(subject.subject, grade),
        assessment_methods: getAssessmentMethods(subject.subject, grade)
      }))
    }
    
    return NextResponse.json(enhancedData)
  } catch (error) {
    console.error('Error fetching curriculum data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getSchoolLevel(grade: string): string {
  const elementaryGrades = ['K', '1', '2', '3', '4', '5']
  const middleGrades = ['6', '7', '8']
  const highGrades = ['9', '10', '11', '12']
  
  if (elementaryGrades.includes(grade)) return 'elementary'
  if (middleGrades.includes(grade)) return 'middle_school'
  if (highGrades.includes(grade)) return 'high_school'
  
  return 'unknown'
}

function getSubjectDescription(subject: string): string {
  const descriptions = {
    'english_language_arts': 'Comprehensive language arts including reading, writing, speaking, and listening skills',
    'mathematics': 'Mathematical concepts, problem-solving, and computational skills',
    'science': 'Scientific inquiry, experimentation, and understanding of natural phenomena',
    'social_studies': 'History, geography, civics, and cultural understanding',
    'fine_arts': 'Creative expression through visual arts, music, theater, and dance',
    'physical_education': 'Physical fitness, motor skills, and healthy lifestyle habits',
    'health': 'Health education, nutrition, and personal wellness',
    'technology_applications': 'Digital literacy, computer skills, and technology integration',
    'world_languages': 'Foreign language acquisition and cultural competency',
    'career_technical_education': 'Career preparation and technical skills development'
  }
  
  return descriptions[subject as keyof typeof descriptions] || 'General academic subject'
}

function getKeySkills(subject: string, grade: string): string[] {
  const skillsBySubject = {
    'english_language_arts': {
      'K': ['Letter recognition', 'Phonics', 'Basic vocabulary', 'Listening comprehension'],
      '1': ['Reading fluency', 'Sight words', 'Simple sentences', 'Story sequencing'],
      '2': ['Reading comprehension', 'Writing paragraphs', 'Grammar basics', 'Vocabulary building'],
      '3': ['Reading strategies', 'Research skills', 'Essay writing', 'Literary analysis'],
      '4': ['Critical thinking', 'Advanced grammar', 'Persuasive writing', 'Text analysis'],
      '5': ['Complex texts', 'Research projects', 'Public speaking', 'Media literacy'],
      '6': ['Genre analysis', 'Argumentative writing', 'Citation skills', 'Presentation skills'],
      '7': ['Literary devices', 'Research methods', 'Debate skills', 'Creative writing'],
      '8': ['Advanced analysis', 'Thesis development', 'Peer review', 'Digital literacy'],
      '9': ['Critical analysis', 'Academic writing', 'Research papers', 'Literature appreciation'],
      '10': ['Advanced composition', 'Rhetorical analysis', 'Independent research', 'Critical thinking'],
      '11': ['Advanced literature', 'AP preparation', 'College writing', 'Advanced research'],
      '12': ['College readiness', 'Advanced rhetoric', 'Independent study', 'Portfolio development']
    },
    'mathematics': {
      'K': ['Number recognition', 'Counting', 'Basic shapes', 'Simple patterns'],
      '1': ['Addition/subtraction', 'Number bonds', 'Measurement', 'Data collection'],
      '2': ['Place value', 'Mental math', 'Geometry basics', 'Time and money'],
      '3': ['Multiplication/division', 'Fractions', 'Area and perimeter', 'Problem solving'],
      '4': ['Multi-digit operations', 'Equivalent fractions', 'Decimal notation', 'Data analysis'],
      '5': ['Fraction operations', 'Decimal operations', 'Coordinate plane', 'Volume'],
      '6': ['Ratios and rates', 'Integers', 'Algebraic expressions', 'Statistics'],
      '7': ['Proportional reasoning', 'Linear equations', 'Geometry proofs', 'Probability'],
      '8': ['Functions', 'Systems of equations', 'Pythagorean theorem', 'Data modeling'],
      '9': ['Algebra I', 'Quadratic functions', 'Exponential functions', 'Data analysis'],
      '10': ['Geometry', 'Trigonometry', 'Proof writing', 'Coordinate geometry'],
      '11': ['Algebra II', 'Polynomial functions', 'Logarithms', 'Sequences and series'],
      '12': ['Pre-calculus', 'Limits', 'Trigonometric identities', 'Conic sections']
    },
    'science': {
      'K': ['Observation skills', 'Scientific inquiry', 'Living/non-living', 'Weather patterns'],
      '1': ['Animal needs', 'Plant life cycles', 'Sound and light', 'Scientific method'],
      '2': ['Properties of matter', 'Life cycles', 'Forces and motion', 'Earth materials'],
      '3': ['Ecosystems', 'Matter and energy', 'Inherited traits', 'Weather systems'],
      '4': ['Energy transfer', 'Rock cycle', 'Animal behavior', 'Simple machines'],
      '5': ['Properties of matter', 'Earth systems', 'Ecosystems', 'Space science'],
      '6': ['Cell structure', 'Plate tectonics', 'Energy and matter', 'Scientific process'],
      '7': ['Human body systems', 'Genetics', 'Chemistry basics', 'Environmental science'],
      '8': ['Physics concepts', 'Chemical reactions', 'Evolution', 'Astronomy'],
      '9': ['Biology', 'Cellular processes', 'Genetics', 'Ecology'],
      '10': ['Chemistry', 'Atomic structure', 'Chemical bonding', 'Stoichiometry'],
      '11': ['Physics', 'Mechanics', 'Waves', 'Electricity and magnetism'],
      '12': ['Advanced biology/chemistry/physics', 'AP preparation', 'Research methods', 'Laboratory skills']
    },
    'social_studies': {
      'K': ['Community helpers', 'Rules and laws', 'Holidays and traditions', 'Maps and globes'],
      '1': ['Family and community', 'Past and present', 'Geographic features', 'American symbols'],
      '2': ['Local history', 'Citizenship', 'Economic concepts', 'Cultural diversity'],
      '3': ['Communities worldwide', 'Government basics', 'Economic systems', 'Geographic regions'],
      '4': ['Texas history', 'Native Americans', 'Colonial period', 'State government'],
      '5': ['U.S. history', 'Colonial America', 'Revolutionary War', 'Constitution'],
      '6': ['World cultures', 'Ancient civilizations', 'Geography skills', 'Cultural analysis'],
      '7': ['Texas history', 'Spanish colonization', 'Republic of Texas', 'Civil War'],
      '8': ['U.S. history', 'Constitution', 'Civil War', 'Reconstruction'],
      '9': ['World geography', 'Physical geography', 'Human geography', 'Cultural regions'],
      '10': ['World history', 'Ancient civilizations', 'Medieval period', 'Renaissance'],
      '11': ['U.S. history', 'Industrial Revolution', 'World Wars', 'Modern America'],
      '12': ['Government', 'Economics', 'Political systems', 'Current events']
    }
  }
  
  const subjectSkills = skillsBySubject[subject as keyof typeof skillsBySubject]
  return subjectSkills?.[grade as keyof typeof subjectSkills] || ['General skills for this subject']
}

function getAssessmentMethods(subject: string, grade: string): string[] {
  const isElementary = ['K', '1', '2', '3', '4', '5'].includes(grade)
  const isMiddle = ['6', '7', '8'].includes(grade)
  const isHigh = ['9', '10', '11', '12'].includes(grade)
  
  const baseAssessments = {
    'english_language_arts': ['Reading assessments', 'Writing portfolios', 'Oral presentations'],
    'mathematics': ['Problem-solving tasks', 'Mathematical reasoning', 'Computational fluency'],
    'science': ['Science experiments', 'Lab reports', 'Scientific inquiry projects'],
    'social_studies': ['Research projects', 'Map skills', 'Historical analysis'],
    'fine_arts': ['Portfolio assessment', 'Performance evaluation', 'Creative projects'],
    'physical_education': ['Fitness assessments', 'Skill demonstrations', 'Game performance'],
    'health': ['Health knowledge tests', 'Wellness plans', 'Behavior assessments']
  }
  
  let assessments = baseAssessments[subject as keyof typeof baseAssessments] || ['General assessments']
  
  if (isElementary) {
    assessments.push('Formative assessments', 'Observation checklists', 'Student conferences')
  } else if (isMiddle) {
    assessments.push('STAAR assessments', 'Project-based assessments', 'Peer evaluations')
  } else if (isHigh) {
    assessments.push('STAAR End-of-Course', 'Advanced Placement exams', 'College readiness assessments')
  }
  
  return assessments
}