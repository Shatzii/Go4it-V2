import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { AVAILABLE_LOCAL_MODELS } from '@/lib/ai-models'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Filter models suitable for coaching
    const coachingModels = AVAILABLE_LOCAL_MODELS.filter(model => 
      model.capabilities.includes('coaching') || 
      model.capabilities.includes('instruction') ||
      model.capabilities.includes('education')
    )

    // Add coaching-specific model information
    const modelsWithCoachingInfo = coachingModels.map(model => ({
      ...model,
      coachingCapabilities: {
        sportsKnowledge: model.capabilities.includes('sports'),
        skillDevelopment: model.capabilities.includes('instruction'),
        personalizedTraining: model.capabilities.includes('personalization'),
        progressTracking: model.capabilities.includes('analytics'),
        motivationalSupport: model.capabilities.includes('psychology')
      },
      suitableFor: {
        beginners: model.size === '1GB' || model.size === '2GB',
        intermediate: model.size === '4GB' || model.size === '7GB',
        advanced: model.size === '13GB' || model.size === '30GB'
      }
    }))

    return NextResponse.json({ 
      models: modelsWithCoachingInfo,
      defaultModel: 'llama3.1:8b',
      recommendedModel: 'llama3.1:8b'
    })

  } catch (error) {
    console.error('Error fetching coaching models:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch coaching models' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { modelName, action } = await request.json()

    if (action === 'download') {
      // Mock model download process
      return NextResponse.json({ 
        success: true,
        message: `Starting download of ${modelName}`,
        downloadId: Date.now().toString(),
        estimatedTime: '5-10 minutes'
      })
    }

    if (action === 'activate') {
      // Mock model activation
      return NextResponse.json({ 
        success: true,
        message: `${modelName} activated for coaching`,
        activeModel: modelName
      })
    }

    return NextResponse.json({ 
      error: 'Invalid action' 
    }, { status: 400 })

  } catch (error) {
    console.error('Error managing coaching model:', error)
    return NextResponse.json({ 
      error: 'Failed to manage coaching model' 
    }, { status: 500 })
  }
}