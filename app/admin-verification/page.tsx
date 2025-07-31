'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, RefreshCw, Users, Database, Settings, BarChart, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface VerificationResult {
  database: { connected: boolean; error: string | null }
  users: { count: number; error: string | null }
  videoAnalysis: { count: number; error: string | null }
  starPath: { count: number; error: string | null }
  features: Record<string, boolean>
  adminAccess: Record<string, boolean>
}

export default function AdminVerificationPage() {
  const [results, setResults] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const router = useRouter()

  const verifyFeatures = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/verify-features', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Verification failed')
      }
      
      const data = await response.json()
      setResults(data.verificationResults)
    } catch (error) {
      console.error('Verification error:', error)
    } finally {
      setLoading(false)
    }
  }

  const populateDemoUsers = async () => {
    setDemoLoading(true)
    try {
      const response = await fetch('/api/admin/populate-demo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Demo population failed')
      }
      
      const data = await response.json()
      
      if (data.success) {
        alert(`Successfully created ${data.users?.length || 0} real user accounts!`)
        verifyFeatures() // Refresh verification
      } else {
        alert(`User creation failed: ${data.message}`)
      }
    } catch (error) {
      console.error('User creation error:', error)
      alert('Failed to create real users')
    } finally {
      setDemoLoading(false)
    }
  }

  useEffect(() => {
    verifyFeatures()
  }, [])

  const StatusBadge = ({ status }: { status: boolean }) => (
    <Badge variant={status ? 'default' : 'destructive'} className="ml-2">
      {status ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
      {status ? 'Working' : 'Issue'}
    </Badge>
  )

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Admin Platform Verification
          </h1>
          <p className="text-xl text-slate-300">
            Comprehensive platform functionality and admin access verification
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              onClick={verifyFeatures}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
              {loading ? 'Verifying...' : 'Verify Platform'}
            </Button>
            
            <Button 
              onClick={populateDemoUsers}
              disabled={demoLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {demoLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
              {demoLoading ? 'Creating...' : 'Create Real Users'}
            </Button>
          </div>
        </div>

        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Database Status */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Database Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Connection</span>
                  <StatusBadge status={results.database.connected} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Users</span>
                  <Badge variant="outline">{results.users.count} users</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Video Analysis</span>
                  <Badge variant="outline">{results.videoAnalysis.count} videos</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">StarPath Progress</span>
                  <Badge variant="outline">{results.starPath.count} records</Badge>
                </div>
                {results.database.error && (
                  <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
                    Error: {results.database.error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Core Features */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Core Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(results.features).map(([feature, status]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-slate-300 capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <StatusBadge status={status} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Admin Access */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(results.adminAccess).map(([feature, status]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-slate-300 capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <StatusBadge status={status} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => router.push('/admin')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Go to Admin Dashboard
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Go to User Dashboard
                </Button>
                <Button 
                  onClick={() => router.push('/academy')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Go to Academy
                </Button>
                <Button 
                  onClick={() => router.push('/ai-coach')}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Go to AI Coach
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Demo Users Information */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Real User Accounts</CardTitle>
            <CardDescription>
              Functional test accounts for complete platform testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Athletes</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>athlete@test.com (Basketball)</li>
                  <li>soccer@test.com (Soccer)</li>
                  <li>football@test.com (Football QB)</li>
                  <li>free@test.com (Free Tier)</li>
                </ul>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Staff</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>coach@test.com (Coach)</li>
                  <li>recruiter@test.com (Recruiter)</li>
                </ul>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Parents</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>parent@test.com (Parent Access)</li>
                </ul>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Admin</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>admin@test.com (Full Access)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-300">
                <strong>Passwords:</strong> Each account uses {role}123 format<br/>
                <strong>Example:</strong> athlete@test.com uses password "athlete123"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}