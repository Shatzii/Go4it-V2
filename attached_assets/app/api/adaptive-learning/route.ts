import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../server/storage'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, courseId, assessmentData, performanceData } = body

    switch (action) {
      case 'analyze-performance':
        if (!userId || !courseId) {
          return NextResponse.json({ error: 'User ID and course ID required' }, { status: 400 })
        }

        const analysis = await analyzeStudentPerformance(userId, courseId, performanceData)
        return NextResponse.json(analysis)

      case 'adjust-difficulty':
        if (!userId || !courseId) {
          return NextResponse.json({ error: 'User ID and course ID required' }, { status: 400 })
        }

        const adjustments = await adjustCourseDifficulty(userId, courseId, assessmentData)
        return NextResponse.json(adjustments)

      case 'generate-recommendations':
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        const recommendations = await generateLearningRecommendations(userId)
        return NextResponse.json(recommendations)

      case 'update-learning-path':
        const { learningPath } = body
        if (!userId || !learningPath) {
          return NextResponse.json({ error: 'User ID and learning path required' }, { status: 400 })
        }

        await storage.updateLearningPath(userId, learningPath)
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Adaptive learning error:', error)
    return NextResponse.json({ error: 'Adaptive learning operation failed' }, { status: 500 })
  }
}

async function analyzeStudentPerformance(userId: string, courseId: string, performanceData: any) {
  try {
    // Get student's historical performance data
    const studentProgress = await storage.getStudentProgress(userId, courseId)
    const assessmentHistory = await storage.getStudentAssessments(userId, courseId)
    const learningPreferences = await storage.getUserLearningPreferences(userId)

    // Analyze performance patterns using AI
    const prompt = `
    Analyze this student's performance data and provide adaptive learning recommendations:
    
    Student Progress: ${JSON.stringify(studentProgress)}
    Assessment History: ${JSON.stringify(assessmentHistory)}
    Learning Preferences: ${JSON.stringify(learningPreferences)}
    Recent Performance: ${JSON.stringify(performanceData)}
    
    Provide analysis in the following JSON format:
    {
      "overallPerformance": "excellent|good|average|needs_improvement",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "learningPattern": "visual|auditory|kinesthetic|mixed",
      "difficultyAdjustment": "increase|maintain|decrease",
      "recommendedActivities": ["activity1", "activity2"],
      "nextLessonSuggestions": ["lesson1", "lesson2"],
      "estimatedMasteryTime": "timeInHours",
      "confidenceLevel": "percentage"
    }
    `

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1500,
      system: "You are an AI learning analyst specializing in adaptive education. Provide detailed, actionable insights based on student performance data.",
      messages: [{ role: 'user', content: prompt }]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '{}'
    
    let analysis
    try {
      analysis = JSON.parse(responseText)
    } catch {
      analysis = createFallbackAnalysis(performanceData)
    }

    // Store analysis results
    await storage.createPerformanceAnalysis({
      id: `analysis_${Date.now()}`,
      userId,
      courseId,
      analysis,
      performanceData,
      createdAt: new Date().toISOString()
    })

    return analysis
  } catch (error) {
    console.error('Performance analysis failed:', error)
    return createFallbackAnalysis(performanceData)
  }
}

async function adjustCourseDifficulty(userId: string, courseId: string, assessmentData: any) {
  try {
    const currentDifficulty = await storage.getCurrentDifficulty(userId, courseId)
    const performanceScore = calculatePerformanceScore(assessmentData)

    let newDifficulty = currentDifficulty
    let adjustmentReason = ''

    if (performanceScore >= 90) {
      newDifficulty = Math.min(currentDifficulty + 1, 10)
      adjustmentReason = 'High performance - increasing difficulty'
    } else if (performanceScore <= 60) {
      newDifficulty = Math.max(currentDifficulty - 1, 1)
      adjustmentReason = 'Low performance - decreasing difficulty'
    } else {
      adjustmentReason = 'Performance within range - maintaining difficulty'
    }

    const adjustment = {
      previousDifficulty: currentDifficulty,
      newDifficulty,
      adjustmentReason,
      performanceScore,
      timestamp: new Date().toISOString()
    }

    await storage.updateCourseDifficulty(userId, courseId, newDifficulty)
    await storage.logDifficultyAdjustment(userId, courseId, adjustment)

    return adjustment
  } catch (error) {
    console.error('Difficulty adjustment failed:', error)
    return {
      previousDifficulty: 5,
      newDifficulty: 5,
      adjustmentReason: 'Error occurred - maintaining current difficulty',
      performanceScore: 0,
      timestamp: new Date().toISOString()
    }
  }
}

async function generateLearningRecommendations(userId: string) {
  try {
    const userProfile = await storage.getUserProfile(userId)
    const learningHistory = await storage.getLearningHistory(userId)
    const currentCourses = await storage.getUserCourses(userId)

    const prompt = `
    Generate personalized learning recommendations for this student:
    
    User Profile: ${JSON.stringify(userProfile)}
    Learning History: ${JSON.stringify(learningHistory)}
    Current Courses: ${JSON.stringify(currentCourses)}
    
    Provide recommendations in JSON format:
    {
      "shortTermGoals": ["goal1", "goal2"],
      "longTermGoals": ["goal1", "goal2"],
      "recommendedCourses": [{"id": "courseId", "title": "title", "reason": "why"}],
      "studySchedule": {"daily": "hours", "optimal_times": ["time1", "time2"]},
      "learningStrategies": ["strategy1", "strategy2"],
      "resourceRecommendations": ["resource1", "resource2"],
      "skillsToFocus": ["skill1", "skill2"],
      "motivationalTips": ["tip1", "tip2"]
    }
    `

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2000,
      system: "You are an AI educational advisor specializing in personalized learning recommendations.",
      messages: [{ role: 'user', content: prompt }]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '{}'
    
    let recommendations
    try {
      recommendations = JSON.parse(responseText)
    } catch {
      recommendations = createFallbackRecommendations()
    }

    await storage.saveRecommendations(userId, recommendations)
    return recommendations
  } catch (error) {
    console.error('Recommendations generation failed:', error)
    return createFallbackRecommendations()
  }
}

function calculatePerformanceScore(assessmentData: any): number {
  if (!assessmentData || !assessmentData.scores) {
    return 75 // Default score
  }

  const scores = assessmentData.scores
  const totalScore = scores.reduce((sum: number, score: number) => sum + score, 0)
  return Math.round(totalScore / scores.length)
}

function createFallbackAnalysis(performanceData: any) {
  return {
    overallPerformance: 'average',
    strengths: ['Consistent effort', 'Active participation'],
    weaknesses: ['Time management', 'Complex problem solving'],
    learningPattern: 'mixed',
    difficultyAdjustment: 'maintain',
    recommendedActivities: ['Practice exercises', 'Review sessions'],
    nextLessonSuggestions: ['Foundation review', 'Skill building'],
    estimatedMasteryTime: '2-3 hours',
    confidenceLevel: '75%'
  }
}

function createFallbackRecommendations() {
  return {
    shortTermGoals: ['Complete current assignments', 'Improve weak areas'],
    longTermGoals: ['Master core concepts', 'Prepare for advanced topics'],
    recommendedCourses: [],
    studySchedule: { daily: '1-2', optimal_times: ['morning', 'afternoon'] },
    learningStrategies: ['Active recall', 'Spaced repetition'],
    resourceRecommendations: ['Practice problems', 'Video tutorials'],
    skillsToFocus: ['Problem solving', 'Critical thinking'],
    motivationalTips: ['Set small goals', 'Celebrate progress']
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const adaptiveData = await storage.getAdaptiveLearningData(userId, courseId)
    return NextResponse.json(adaptiveData)
  } catch (error) {
    console.error('Error fetching adaptive learning data:', error)
    return NextResponse.json({ error: 'Failed to fetch adaptive learning data' }, { status: 500 })
  }
}