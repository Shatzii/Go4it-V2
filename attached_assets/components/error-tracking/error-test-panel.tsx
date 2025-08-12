'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { 
  Bug, 
  AlertTriangle, 
  Database, 
  Shield, 
  Globe, 
  User,
  Zap,
  TestTube
} from 'lucide-react'
import { ErrorSeverity, ErrorCategory } from '@/lib/error-tracking'
import { useErrorTracking } from '@/hooks/use-error-tracking'

export default function ErrorTestPanel() {
  const [customMessage, setCustomMessage] = useState('')
  const [customSeverity, setCustomSeverity] = useState<ErrorSeverity>(ErrorSeverity.MEDIUM)
  const [customCategory, setCustomCategory] = useState<ErrorCategory>(ErrorCategory.SYSTEM)
  const { logError } = useErrorTracking()

  const testScenarios = [
    {
      name: 'Database Connection Error',
      icon: Database,
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.DATABASE,
      message: 'Failed to connect to PostgreSQL database: Connection timeout after 30 seconds',
      metadata: { host: 'localhost', port: 5432, database: 'universal_school' }
    },
    {
      name: 'Authentication Failure',
      icon: Shield,
      severity: ErrorSeverity.CRITICAL,
      category: ErrorCategory.AUTHENTICATION,
      message: 'JWT token verification failed: Invalid signature',
      metadata: { userId: 'user_123', endpoint: '/api/auth/verify' }
    },
    {
      name: 'API Rate Limit Exceeded',
      icon: Globe,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.API,
      message: 'Rate limit exceeded for AI service: 100 requests per minute limit reached',
      metadata: { service: 'anthropic', limit: 100, current: 105 }
    },
    {
      name: 'UI Component Crash',
      icon: User,
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.UI,
      message: 'React component crashed: Cannot read property of undefined',
      metadata: { component: 'StudentDashboard', line: 45, file: 'dashboard.tsx' }
    },
    {
      name: 'Network Connection Lost',
      icon: AlertTriangle,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.NETWORK,
      message: 'Network connection lost: Unable to reach external services',
      metadata: { services: ['ai-api', 'storage-api'], retryCount: 3 }
    },
    {
      name: 'Memory Leak Detection',
      icon: Zap,
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.SYSTEM,
      message: 'Memory usage exceeded threshold: 2.5GB used of 4GB available',
      metadata: { memoryUsage: '2.5GB', threshold: '2GB', process: 'next-server' }
    }
  ]

  const triggerTestError = (scenario: typeof testScenarios[0]) => {
    logError({
      severity: scenario.severity,
      category: scenario.category,
      message: scenario.message,
      metadata: scenario.metadata
    })
  }

  const triggerCustomError = () => {
    if (!customMessage.trim()) return
    
    logError({
      severity: customSeverity,
      category: customCategory,
      message: customMessage,
      metadata: { type: 'custom_test_error', timestamp: new Date().toISOString() }
    })
    
    setCustomMessage('')
  }

  const triggerJavaScriptError = () => {
    // This will trigger the global error handler
    throw new Error('Test JavaScript error triggered manually')
  }

  const triggerUnhandledPromise = () => {
    // This will trigger the unhandled promise rejection handler
    Promise.reject(new Error('Test unhandled promise rejection'))
  }

  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.CRITICAL: return 'bg-red-500'
      case ErrorSeverity.HIGH: return 'bg-orange-500'
      case ErrorSeverity.MEDIUM: return 'bg-yellow-500'
      case ErrorSeverity.LOW: return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="h-5 w-5 mr-2" />
            Error Testing Panel
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test the error tracking system with various error scenarios
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Scenarios */}
          <div>
            <h4 className="font-medium mb-3">Predefined Test Scenarios</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {testScenarios.map((scenario, index) => {
                const Icon = scenario.icon
                return (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => triggerTestError(scenario)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="font-medium text-sm">{scenario.name}</span>
                      </div>
                      <Badge className={getSeverityColor(scenario.severity)}>
                        {scenario.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {scenario.message}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Custom Error */}
          <div>
            <h4 className="font-medium mb-3">Custom Error Test</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={customSeverity} onValueChange={(value) => setCustomSeverity(value as ErrorSeverity)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ErrorSeverity.LOW}>Low</SelectItem>
                      <SelectItem value={ErrorSeverity.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={ErrorSeverity.HIGH}>High</SelectItem>
                      <SelectItem value={ErrorSeverity.CRITICAL}>Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={customCategory} onValueChange={(value) => setCustomCategory(value as ErrorCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ErrorCategory).map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="message">Error Message</Label>
                <Textarea
                  id="message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter custom error message..."
                  rows={3}
                />
              </div>
              <Button 
                onClick={triggerCustomError}
                disabled={!customMessage.trim()}
                className="w-full"
              >
                Trigger Custom Error
              </Button>
            </div>
          </div>

          {/* Global Error Tests */}
          <div>
            <h4 className="font-medium mb-3">Global Error Handler Tests</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={triggerJavaScriptError}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Bug className="h-4 w-4 mr-2" />
                JavaScript Error
              </Button>
              <Button 
                onClick={triggerUnhandledPromise}
                variant="outline"
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Promise Rejection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}