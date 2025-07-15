'use client'

import React, { useState, useEffect } from 'react'
import { Download, Check, Settings, Cpu, HardDrive, Zap, AlertCircle, Play, Pause } from 'lucide-react'

interface AIModel {
  name: string
  size: string
  description: string
  downloadUrl: string
  modelFile: string
  requirements: {
    ram: string
    storage: string
    gpu?: string
  }
  capabilities: string[]
  coachingCapabilities: {
    sportsKnowledge: boolean
    skillDevelopment: boolean
    personalizedTraining: boolean
    progressTracking: boolean
    motivationalSupport: boolean
  }
  suitableFor: {
    beginners: boolean
    intermediate: boolean
    advanced: boolean
  }
  status: 'not_downloaded' | 'downloading' | 'downloaded' | 'active'
}

export function ModelManagement() {
  const [models, setModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingModel, setDownloadingModel] = useState<string | null>(null)
  const [activeModel, setActiveModel] = useState<string>('llama3.1:8b')

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/ai-coach/models', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setModels(data.models.map((model: any) => ({
          ...model,
          status: model.name === 'llama3.1:8b' ? 'active' : 'not_downloaded'
        })))
        setActiveModel(data.defaultModel)
      }
    } catch (error) {
      console.error('Failed to fetch models:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadModel = async (modelName: string) => {
    setDownloadingModel(modelName)
    try {
      const response = await fetch('/api/ai-coach/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          modelName,
          action: 'download'
        })
      })

      if (response.ok) {
        // Update model status to downloading
        setModels(prev => prev.map(model => 
          model.name === modelName 
            ? { ...model, status: 'downloading' }
            : model
        ))

        // Simulate download progress
        setTimeout(() => {
          setModels(prev => prev.map(model => 
            model.name === modelName 
              ? { ...model, status: 'downloaded' }
              : model
          ))
          setDownloadingModel(null)
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to download model:', error)
      setDownloadingModel(null)
    }
  }

  const activateModel = async (modelName: string) => {
    try {
      const response = await fetch('/api/ai-coach/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          modelName,
          action: 'activate'
        })
      })

      if (response.ok) {
        setActiveModel(modelName)
        setModels(prev => prev.map(model => ({
          ...model,
          status: model.name === modelName ? 'active' : 
                  model.status === 'active' ? 'downloaded' : model.status
        })))
      }
    } catch (error) {
      console.error('Failed to activate model:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'downloaded': return 'text-blue-600 bg-blue-100'
      case 'downloading': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />
      case 'downloaded': return <Check className="w-4 h-4" />
      case 'downloading': return <Download className="w-4 h-4 animate-pulse" />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Coach Models</h2>
          <p className="text-muted-foreground">Manage your self-hosted AI coaching models</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
          <Zap className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Active: {activeModel}
          </span>
        </div>
      </div>

      {/* System Requirements Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">System Requirements</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Self-hosted AI models require significant computational resources. 
              Ensure your server has adequate RAM and storage before downloading.
            </p>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div key={model.name} className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Model Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{model.name}</h3>
                <div className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(model.status)}`}>
                  {getStatusIcon(model.status)}
                  {model.status.replace('_', ' ')}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{model.description}</p>
            </div>

            {/* Model Details */}
            <div className="p-4 space-y-4">
              {/* Requirements */}
              <div>
                <h4 className="font-medium text-sm mb-2">Requirements</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Cpu className="w-4 h-4 text-muted-foreground" />
                    <span>RAM: {model.requirements.ram}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <HardDrive className="w-4 h-4 text-muted-foreground" />
                    <span>Storage: {model.requirements.storage}</span>
                  </div>
                  {model.requirements.gpu && (
                    <div className="flex items-center gap-2 text-sm">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span>GPU: {model.requirements.gpu}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coaching Capabilities */}
              <div>
                <h4 className="font-medium text-sm mb-2">Coaching Capabilities</h4>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {model.coachingCapabilities.sportsKnowledge && (
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      <span>Sports Knowledge</span>
                    </div>
                  )}
                  {model.coachingCapabilities.skillDevelopment && (
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      <span>Skill Development</span>
                    </div>
                  )}
                  {model.coachingCapabilities.personalizedTraining && (
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      <span>Personalized Training</span>
                    </div>
                  )}
                  {model.coachingCapabilities.progressTracking && (
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      <span>Progress Tracking</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Suitable For */}
              <div>
                <h4 className="font-medium text-sm mb-2">Suitable For</h4>
                <div className="flex flex-wrap gap-1">
                  {model.suitableFor.beginners && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Beginners
                    </span>
                  )}
                  {model.suitableFor.intermediate && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                      Intermediate
                    </span>
                  )}
                  {model.suitableFor.advanced && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                      Advanced
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-border">
              {model.status === 'not_downloaded' && (
                <button
                  onClick={() => downloadModel(model.name)}
                  disabled={downloadingModel === model.name}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {downloadingModel === model.name ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Model
                    </>
                  )}
                </button>
              )}
              
              {model.status === 'downloaded' && (
                <button
                  onClick={() => activateModel(model.name)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Activate Model
                </button>
              )}
              
              {model.status === 'active' && (
                <div className="w-full bg-green-100 text-green-800 py-2 px-4 rounded font-medium text-center">
                  Currently Active
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}