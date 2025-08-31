'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Shield,
  Globe,
  User,
  BarChart3,
  Filter,
  Download,
  RefreshCw,
  Eye,
  X,
} from 'lucide-react';
import { ErrorTrackingService, ErrorLog, ErrorSeverity, ErrorCategory } from '@/lib/error-tracking';

export default function ErrorDashboard() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [filter, setFilter] = useState<{
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    resolved?: boolean;
  }>({});

  const errorTracker = ErrorTrackingService.getInstance();

  useEffect(() => {
    // Load initial errors
    setErrors(errorTracker.getErrors());

    // Listen for new errors
    const handleNewError = (error: ErrorLog) => {
      setErrors((prev) => [...prev, error]);
    };

    errorTracker.addListener(handleNewError);
    return () => errorTracker.removeListener(handleNewError);
  }, []);

  const analytics = errorTracker.getAnalytics();

  const filteredErrors = errors.filter((error) => {
    if (filter.severity && error.severity !== filter.severity) return false;
    if (filter.category && error.category !== filter.category) return false;
    if (filter.resolved !== undefined && error.resolved !== filter.resolved) return false;
    return true;
  });

  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return 'bg-red-500';
      case ErrorSeverity.HIGH:
        return 'bg-orange-500';
      case ErrorSeverity.MEDIUM:
        return 'bg-yellow-500';
      case ErrorSeverity.LOW:
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: ErrorCategory) => {
    switch (category) {
      case ErrorCategory.AUTHENTICATION:
        return Shield;
      case ErrorCategory.DATABASE:
        return Database;
      case ErrorCategory.API:
        return Globe;
      case ErrorCategory.UI:
        return User;
      default:
        return AlertTriangle;
    }
  };

  const resolveError = (errorId: string) => {
    errorTracker.resolveError(errorId, 'admin');
    setErrors((prev) =>
      prev.map((e) => (e.id === errorId ? { ...e, resolved: true, resolvedAt: new Date() } : e)),
    );
  };

  const exportErrors = () => {
    const dataStr = JSON.stringify(filteredErrors, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `errors_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Error Tracking Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setErrors(errorTracker.getErrors())} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportErrors} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unresolved</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.unresolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.resolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.resolutionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter.severity === undefined ? 'default' : 'outline'}
              onClick={() => setFilter((prev) => ({ ...prev, severity: undefined }))}
            >
              All Severities
            </Button>
            {Object.values(ErrorSeverity).map((severity) => (
              <Button
                key={severity}
                variant={filter.severity === severity ? 'default' : 'outline'}
                onClick={() => setFilter((prev) => ({ ...prev, severity }))}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button
              variant={filter.resolved === undefined ? 'default' : 'outline'}
              onClick={() => setFilter((prev) => ({ ...prev, resolved: undefined }))}
            >
              All Status
            </Button>
            <Button
              variant={filter.resolved === false ? 'default' : 'outline'}
              onClick={() => setFilter((prev) => ({ ...prev, resolved: false }))}
            >
              Unresolved
            </Button>
            <Button
              variant={filter.resolved === true ? 'default' : 'outline'}
              onClick={() => setFilter((prev) => ({ ...prev, resolved: true }))}
            >
              Resolved
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Error List ({filteredErrors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {filteredErrors.map((error) => {
                  const CategoryIcon = getCategoryIcon(error.category);
                  return (
                    <div
                      key={error.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedError(error)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="h-4 w-4" />
                          <div>
                            <div className="font-medium text-sm">{error.message}</div>
                            <div className="text-xs text-gray-500">
                              {error.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(error.severity)}>
                            {error.severity}
                          </Badge>
                          {error.resolved && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Error Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Error Details
              {selectedError && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedError(null)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedError ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getSeverityColor(selectedError.severity)}>
                    {selectedError.severity}
                  </Badge>
                  <Badge variant="outline">{selectedError.category}</Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Message</h4>
                  <p className="text-sm">{selectedError.message}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Timestamp</h4>
                  <p className="text-sm">{selectedError.timestamp.toLocaleString()}</p>
                </div>

                {selectedError.stack && (
                  <div>
                    <h4 className="font-medium mb-2">Stack Trace</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {selectedError.stack}
                    </pre>
                  </div>
                )}

                {selectedError.metadata && Object.keys(selectedError.metadata).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Metadata</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(selectedError.metadata, null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="flex items-center space-x-2">
                    {selectedError.resolved ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolved
                      </div>
                    ) : (
                      <div className="flex items-center text-orange-600">
                        <Clock className="h-4 w-4 mr-1" />
                        Unresolved
                      </div>
                    )}
                  </div>
                </div>

                {!selectedError.resolved && (
                  <Button
                    onClick={() => selectedError.id && resolveError(selectedError.id)}
                    className="w-full"
                  >
                    Mark as Resolved
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select an error to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
