'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  AlertTriangle, 
  X, 
  Eye, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { ErrorTrackingService, ErrorLog, ErrorSeverity } from '@/lib/error-tracking'
import Link from 'next/link'

export default function ErrorWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const errorTracker = ErrorTrackingService.getInstance()

  useEffect(() => {
    // Load initial errors
    const allErrors = errorTracker.getErrors()
    setErrors(allErrors)
    setUnreadCount(errorTracker.getUnresolvedErrors().length)

    // Listen for new errors
    const handleNewError = (error: ErrorLog) => {
      setErrors(prev => [error, ...prev.slice(0, 49)]) // Keep last 50 errors
      setUnreadCount(prev => prev + 1)
    }

    errorTracker.addListener(handleNewError)
    return () => errorTracker.removeListener(handleNewError)
  }, [])

  const recentErrors = errors.slice(0, 5)
  const criticalErrors = errors.filter(e => e.severity === ErrorSeverity.CRITICAL && !e.resolved)
  const analytics = errorTracker.getAnalytics()

  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.CRITICAL: return 'text-red-600 bg-red-50'
      case ErrorSeverity.HIGH: return 'text-orange-600 bg-orange-50'
      case ErrorSeverity.MEDIUM: return 'text-yellow-600 bg-yellow-50'
      case ErrorSeverity.LOW: return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getSeverityIcon = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return AlertTriangle
      case ErrorSeverity.MEDIUM:
        return AlertCircle
      case ErrorSeverity.LOW:
        return Clock
      default:
        return AlertCircle
    }
  }

  if (criticalErrors.length === 0 && !isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="relative"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Errors ({unreadCount})
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {(criticalErrors.length > 0 || isOpen) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-96"
          >
            <Card className="border-red-200 bg-white shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Error Monitor
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Critical Errors Alert */}
                {criticalErrors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-800">
                        🚨 Critical Errors Detected
                      </span>
                      <Badge variant="destructive">
                        {criticalErrors.length}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {criticalErrors.slice(0, 2).map((error) => (
                        <div key={error.id} className="text-sm text-red-700">
                          • {error.message}
                        </div>
                      ))}
                      {criticalErrors.length > 2 && (
                        <div className="text-sm text-red-600">
                          + {criticalErrors.length - 2} more critical errors
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-gray-50 rounded">
                    <div className="font-semibold text-lg">{analytics.total}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="p-2 bg-orange-50 rounded">
                    <div className="font-semibold text-lg">{analytics.unresolved}</div>
                    <div className="text-xs text-gray-600">Unresolved</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <div className="font-semibold text-lg">{analytics.resolutionRate.toFixed(0)}%</div>
                    <div className="text-xs text-gray-600">Resolution</div>
                  </div>
                </div>

                {/* Recent Errors */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Recent Errors
                  </h4>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {recentErrors.map((error) => {
                        const SeverityIcon = getSeverityIcon(error.severity)
                        return (
                          <div
                            key={error.id}
                            className="flex items-start space-x-2 p-2 rounded text-sm"
                          >
                            <SeverityIcon className="h-4 w-4 mt-0.5 text-gray-500" />
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{error.message}</div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getSeverityColor(error.severity)}`}
                                >
                                  {error.severity}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {error.timestamp.toLocaleTimeString()}
                                </span>
                                {error.resolved && (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link href="/error-dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => setErrors(errorTracker.getErrors())}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}