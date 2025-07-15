'use client'

import { useState, useEffect } from 'react'
import { Smartphone, Activity, Share2, Link, Check, X, Settings, Zap, Heart, Clock, BarChart } from 'lucide-react'

interface Integration {
  id: string
  name: string
  type: 'fitness' | 'academic' | 'social' | 'analytics'
  icon: string
  description: string
  isConnected: boolean
  lastSync?: Date
  syncStatus: 'active' | 'paused' | 'error'
  features: string[]
  data?: any
}

interface ConnectedDevice {
  id: string
  name: string
  type: string
  batteryLevel?: number
  lastSync: Date
  dataTypes: string[]
  isActive: boolean
}

export function ThirdPartyIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [devices, setDevices] = useState<ConnectedDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('fitness')

  useEffect(() => {
    fetchIntegrations()
    fetchDevices()
  }, [])

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations')
      if (response.ok) {
        const data = await response.json()
        setIntegrations(data.integrations)
      }
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/integrations/devices')
      if (response.ok) {
        const data = await response.json()
        setDevices(data.devices)
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error)
    }
  }

  const connectIntegration = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/connect`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.authUrl) {
          window.open(data.authUrl, '_blank', 'width=600,height=400')
        }
        await fetchIntegrations()
      }
    } catch (error) {
      console.error('Failed to connect integration:', error)
    }
  }

  const disconnectIntegration = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/disconnect`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchIntegrations()
      }
    } catch (error) {
      console.error('Failed to disconnect integration:', error)
    }
  }

  const syncIntegration = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/sync`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchIntegrations()
      }
    } catch (error) {
      console.error('Failed to sync integration:', error)
    }
  }

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'fitness': return <Activity className="w-6 h-6" />
      case 'academic': return <BarChart className="w-6 h-6" />
      case 'social': return <Share2 className="w-6 h-6" />
      case 'analytics': return <Zap className="w-6 h-6" />
      default: return <Link className="w-6 h-6" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500'
      case 'paused': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const renderFitnessIntegrations = () => {
    const fitnessIntegrations = integrations.filter(i => i.type === 'fitness')
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fitnessIntegrations.map((integration) => (
            <div key={integration.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    {getIntegrationIcon(integration.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                    <p className="text-sm text-slate-400">{integration.description}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  integration.isConnected 
                    ? integration.syncStatus === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    : 'bg-gray-500'
                }`}></div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status</span>
                  <span className={`text-sm ${getStatusColor(integration.syncStatus)}`}>
                    {integration.isConnected ? integration.syncStatus : 'Disconnected'}
                  </span>
                </div>
                
                {integration.lastSync && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Last Sync</span>
                    <span className="text-sm text-white">
                      {new Date(integration.lastSync).toLocaleString()}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Features</span>
                  <span className="text-sm text-white">
                    {integration.features.length} available
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {integration.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>

              {integration.isConnected && integration.data && (
                <div className="bg-slate-700 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Recent Data</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(integration.data).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-white">{value as string}</div>
                        <div className="text-xs text-slate-400">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {integration.isConnected ? (
                  <>
                    <button
                      onClick={() => syncIntegration(integration.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Sync Now
                    </button>
                    <button
                      onClick={() => disconnectIntegration(integration.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => connectIntegration(integration.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Connected Devices */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Connected Devices</h3>
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-white">{device.name}</h4>
                    <p className="text-sm text-slate-400">{device.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {device.batteryLevel && (
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-3 border border-slate-500 rounded-sm">
                        <div 
                          className="h-full bg-green-500 rounded-sm"
                          style={{ width: `${device.batteryLevel}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{device.batteryLevel}%</span>
                    </div>
                  )}
                  <span className="text-sm text-slate-400">
                    {new Date(device.lastSync).toLocaleString()}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${device.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderAcademicIntegrations = () => {
    const academicIntegrations = integrations.filter(i => i.type === 'academic')
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {academicIntegrations.map((integration) => (
            <div key={integration.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    {getIntegrationIcon(integration.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                    <p className="text-sm text-slate-400">{integration.description}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  integration.isConnected 
                    ? integration.syncStatus === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    : 'bg-gray-500'
                }`}></div>
              </div>

              <div className="space-y-2 mb-4">
                {integration.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {integration.isConnected ? (
                  <>
                    <button
                      onClick={() => syncIntegration(integration.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Sync Now
                    </button>
                    <button
                      onClick={() => disconnectIntegration(integration.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => connectIntegration(integration.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSocialIntegrations = () => {
    const socialIntegrations = integrations.filter(i => i.type === 'social')
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Social Media Integration</h3>
          <p className="text-slate-400 mb-6">
            Connect your social media accounts to automatically share highlights and achievements.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialIntegrations.map((integration) => (
              <div key={integration.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                      {getIntegrationIcon(integration.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{integration.name}</h4>
                      <p className="text-sm text-slate-400">{integration.description}</p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    integration.isConnected ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                </div>

                <div className="space-y-2 mb-4">
                  {integration.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-3 h-3 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => integration.isConnected ? disconnectIntegration(integration.id) : connectIntegration(integration.id)}
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    integration.isConnected 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {integration.isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-slate-400 mt-1">Connect third-party services to enhance your experience</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'fitness', label: 'Fitness Trackers', icon: Activity },
              { id: 'academic', label: 'Academic Systems', icon: BarChart },
              { id: 'social', label: 'Social Media', icon: Share2 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'fitness' && renderFitnessIntegrations()}
        {activeTab === 'academic' && renderAcademicIntegrations()}
        {activeTab === 'social' && renderSocialIntegrations()}
      </div>
    </div>
  )
}