import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export interface AITeacher {
  id: string
  name: string
  subject: string
  personality: string
  expertise: string[]
  supportedNeeds: string[]
}

export const AI_TEACHERS: AITeacher[] = [
  {
    id: 'newton',
    name: 'Professor Newton',
    subject: 'Mathematics',
    personality: 'Patient, methodical, encouraging',
    expertise: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
    supportedNeeds: ['Dyscalculia', 'ADHD', 'Visual Learning']
  },
  {
    id: 'curie',
    name: 'Dr. Curie',
    subject: 'Science',
    personality: 'Curious, experimental, hands-on',
    expertise: ['Physics', 'Chemistry', 'Biology', 'Earth Science'],
    supportedNeeds: ['Autism', 'Kinesthetic Learning', 'ADHD']
  },
  {
    id: 'shakespeare',
    name: 'Ms. Shakespeare',
    subject: 'English Language Arts',
    personality: 'Creative, expressive, supportive',
    expertise: ['Literature', 'Writing', 'Grammar', 'Poetry'],
    supportedNeeds: ['Dyslexia', 'Autism', 'Anxiety']
  },
  {
    id: 'timeline',
    name: 'Professor Timeline',
    subject: 'Social Studies',
    personality: 'Storytelling, contextual, engaging',
    expertise: ['History', 'Geography', 'Civics', 'Economics'],
    supportedNeeds: ['Visual Learning', 'ADHD', 'Memory Support']
  },
  {
    id: 'picasso',
    name: 'Maestro Picasso',
    subject: 'Arts',
    personality: 'Creative, inspiring, multi-sensory',
    expertise: ['Visual Arts', 'Music', 'Drama', 'Digital Arts'],
    supportedNeeds: ['Autism', 'ADHD', 'Sensory Processing']
  },
  {
    id: 'inclusive',
    name: 'Dr. Inclusive',
    subject: 'Special Education',
    personality: 'Adaptive, patient, individualized',
    expertise: ['IEP Development', 'Accommodations', 'Behavioral Support'],
    supportedNeeds: ['All Learning Differences', 'Emotional Support']
  }
]

export async function generateAIResponse(
  teacherId: string,
  message: string,
  studentProfile?: any,
  context?: any
): Promise<string> {
  const teacher = AI_TEACHERS.find(t => t.id === teacherId)
  if (!teacher) {
    throw new Error('AI Teacher not found')
  }

  try {
    const prompt = `You are ${teacher.name}, a ${teacher.subject} teacher with a ${teacher.personality} personality. 
    You specialize in ${teacher.expertise.join(', ')} and support students with ${teacher.supportedNeeds.join(', ')}.
    
    Student message: "${message}"
    ${studentProfile ? `Student profile: ${JSON.stringify(studentProfile)}` : ''}
    ${context ? `Context: ${JSON.stringify(context)}` : ''}
    
    Respond as ${teacher.name} would, providing helpful, encouraging, and educational guidance.`

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    return response.content[0].type === 'text' ? response.content[0].text : 'I apologize, but I cannot provide a response at this time.'
  } catch (error) {
    console.error('AI response generation failed:', error)
    return `I'm ${teacher.name}, and I'm here to help you with ${teacher.subject}. Unfortunately, I'm having some technical difficulties right now. Please try again in a moment, or contact your teacher for immediate assistance.`
  }
}

export async function generateCurriculum(
  subject: string,
  gradeLevel: string,
  learningObjectives: string[],
  studentNeeds?: string[]
): Promise<any> {
  try {
    const prompt = `Generate a comprehensive curriculum for ${subject} at ${gradeLevel} level.
    
    Learning objectives:
    ${learningObjectives.map(obj => `- ${obj}`).join('\n')}
    
    ${studentNeeds ? `Special considerations for students with: ${studentNeeds.join(', ')}` : ''}
    
    Please provide:
    1. Unit breakdown with timelines
    2. Key concepts and skills
    3. Assessment methods
    4. Differentiation strategies
    5. Resources and materials needed
    
    Format as structured JSON.`

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const content = response.content[0].type === 'text' ? response.content[0].text : ''
    
    try {
      return JSON.parse(content)
    } catch {
      return { curriculum: content, format: 'text' }
    }
  } catch (error) {
    console.error('Curriculum generation failed:', error)
    return {
      error: 'Curriculum generation temporarily unavailable',
      fallback: `Please refer to standard ${subject} curriculum for ${gradeLevel} or contact your curriculum coordinator.`
    }
  }
}

import { getAIConfig } from './env-validation';

export async function validateAIKey(): Promise<boolean> {
  const aiConfig = getAIConfig();
  
  if (!aiConfig.anthropicApiKey) {
    console.error('ANTHROPIC_API_KEY not configured')
    return false
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 10,
      messages: [
        {
          role: 'user',
          content: 'Test message'
        }
      ]
    })
    
    return response.content.length > 0
  } catch (error) {
    console.error('AI key validation failed:', error)
    return false
  }
}