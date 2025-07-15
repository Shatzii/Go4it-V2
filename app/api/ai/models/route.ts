import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Mock AI models data - in production, this would come from database
    const models = [
      {
        id: '1',
        name: 'SportsAnalyzer Pro',
        type: 'local',
        provider: 'custom',
        size: '2.3 GB',
        capabilities: ['video_analysis', 'performance_metrics', 'technique_evaluation'],
        requirements: {
          ram: '8 GB',
          storage: '4 GB',
          gpu: 'GTX 1060 or better'
        },
        isDownloaded: true,
        isActive: true,
        isEncrypted: true,
        license: {
          id: 'lic_001',
          type: 'premium',
          expirationDate: new Date('2025-01-15'),
          activations: 1,
          maxActivations: 3
        },
        performance: {
          speed: 85,
          accuracy: 92,
          resourceUsage: 65
        },
        lastUsed: new Date('2024-07-15T14:30:00Z')
      },
      {
        id: '2',
        name: 'ADHD Learning Assistant',
        type: 'local',
        provider: 'custom',
        size: '1.8 GB',
        capabilities: ['adaptive_learning', 'attention_focus', 'task_breakdown'],
        requirements: {
          ram: '6 GB',
          storage: '3 GB'
        },
        isDownloaded: true,
        isActive: false,
        isEncrypted: true,
        license: {
          id: 'lic_002',
          type: 'standard',
          expirationDate: new Date('2024-12-31'),
          activations: 2,
          maxActivations: 5
        },
        performance: {
          speed: 78,
          accuracy: 88,
          resourceUsage: 45
        },
        lastUsed: new Date('2024-07-10T09:15:00Z')
      },
      {
        id: '3',
        name: 'GPT-4 Turbo',
        type: 'cloud',
        provider: 'openai',
        size: 'Cloud-based',
        capabilities: ['text_generation', 'analysis', 'tutoring', 'coaching'],
        requirements: {
          ram: '2 GB',
          storage: '100 MB'
        },
        isDownloaded: false,
        isActive: true,
        isEncrypted: false,
        performance: {
          speed: 95,
          accuracy: 96,
          resourceUsage: 20
        },
        lastUsed: new Date('2024-07-15T16:45:00Z')
      },
      {
        id: '4',
        name: 'Claude Sonnet',
        type: 'cloud',
        provider: 'anthropic',
        size: 'Cloud-based',
        capabilities: ['analysis', 'reasoning', 'academic_help', 'coaching'],
        requirements: {
          ram: '2 GB',
          storage: '100 MB'
        },
        isDownloaded: false,
        isActive: false,
        isEncrypted: false,
        performance: {
          speed: 90,
          accuracy: 94,
          resourceUsage: 25
        },
        lastUsed: new Date('2024-07-12T11:20:00Z')
      },
      {
        id: '5',
        name: 'Llama 3 Sports',
        type: 'hybrid',
        provider: 'ollama',
        size: '4.1 GB',
        capabilities: ['sports_analysis', 'strategy_planning', 'performance_coaching'],
        requirements: {
          ram: '16 GB',
          storage: '8 GB',
          gpu: 'RTX 3070 or better'
        },
        isDownloaded: false,
        isActive: false,
        isEncrypted: false,
        performance: {
          speed: 70,
          accuracy: 85,
          resourceUsage: 80
        }
      }
    ]

    return NextResponse.json({ models })
  } catch (error) {
    console.error('Failed to fetch AI models:', error)
    return NextResponse.json({ error: 'Failed to fetch AI models' }, { status: 500 })
  }
}