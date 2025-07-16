'use client';

import { useState } from 'react';
import { Upload, Play, BarChart3, Target, Brain, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TestResult {
  type: 'basic' | 'advanced' | 'real-time' | 'predictive';
  status: 'pending' | 'running' | 'completed' | 'error';
  data?: any;
  error?: string;
  duration?: number;
}

export default function TestVideoAnalysis() {
  const [selectedSport, setSelectedSport] = useState('basketball');
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({});
  const [isRunning, setIsRunning] = useState(false);

  const sports = [
    'basketball', 'football', 'soccer', 'tennis', 'track_field', 
    'swimming', 'golf', 'wrestling', 'volleyball', 'lacrosse'
  ];

  const runBasicAnalysis = async () => {
    setTestResults(prev => ({ ...prev, basic: { type: 'basic', status: 'running' } }));
    
    try {
      const response = await fetch('/api/gar/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: selectedSport,
          testMode: true,
          analysisType: 'basic'
        })
      });
      
      const data = await response.json();
      
      setTestResults(prev => ({ 
        ...prev, 
        basic: { 
          type: 'basic', 
          status: response.ok ? 'completed' : 'error',
          data: response.ok ? data : undefined,
          error: response.ok ? undefined : data.error
        }
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        basic: { 
          type: 'basic', 
          status: 'error',
          error: 'Network error or server unavailable'
        }
      }));
    }
  };

  const runAdvancedAnalysis = async () => {
    setTestResults(prev => ({ ...prev, advanced: { type: 'advanced', status: 'running' } }));
    
    try {
      const response = await fetch('/api/gar/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: selectedSport,
          testMode: true,
          analysisType: 'advanced',
          enableBiomechanics: true,
          enableMovementAnalysis: true,
          enableTacticalAnalysis: true,
          enableMentalAnalysis: true
        })
      });
      
      const data = await response.json();
      
      setTestResults(prev => ({ 
        ...prev, 
        advanced: { 
          type: 'advanced', 
          status: response.ok ? 'completed' : 'error',
          data: response.ok ? data : undefined,
          error: response.ok ? undefined : data.error
        }
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        advanced: { 
          type: 'advanced', 
          status: 'error',
          error: 'Network error or server unavailable'
        }
      }));
    }
  };

  const runRealTimeTest = async () => {
    setTestResults(prev => ({ ...prev, realTime: { type: 'real-time', status: 'running' } }));
    
    try {
      const response = await fetch('/api/gar/real-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          sport: selectedSport,
          quality: 'balanced'
        })
      });
      
      const data = await response.json();
      
      // Simulate real-time analysis for 5 seconds
      setTimeout(async () => {
        const statusResponse = await fetch('/api/gar/real-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'status' })
        });
        
        const statusData = await statusResponse.json();
        
        setTestResults(prev => ({ 
          ...prev, 
          realTime: { 
            type: 'real-time', 
            status: 'completed',
            data: { ...data, status: statusData }
          }
        }));
        
        // Stop the analysis
        await fetch('/api/gar/real-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'stop' })
        });
      }, 5000);
      
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        realTime: { 
          type: 'real-time', 
          status: 'error',
          error: 'Network error or server unavailable'
        }
      }));
    }
  };

  const runPredictiveAnalysis = async () => {
    setTestResults(prev => ({ ...prev, predictive: { type: 'predictive', status: 'running' } }));
    
    try {
      const response = await fetch('/api/gar/predictive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comprehensive_report',
          sport: selectedSport,
          timeframes: ['6 months', '1 year', '2 years'],
          athleteProfile: {
            age: 16,
            experience_years: 3,
            position: 'guard',
            grade_level: 'junior'
          }
        })
      });
      
      const data = await response.json();
      
      setTestResults(prev => ({ 
        ...prev, 
        predictive: { 
          type: 'predictive', 
          status: response.ok ? 'completed' : 'error',
          data: response.ok ? data : undefined,
          error: response.ok ? undefined : data.error
        }
      }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        predictive: { 
          type: 'predictive', 
          status: 'error',
          error: 'Network error or server unavailable'
        }
      }));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    await runBasicAnalysis();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await runAdvancedAnalysis();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await runRealTimeTest();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await runPredictiveAnalysis();
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderTestResult = (result: TestResult) => {
    if (result.status === 'pending') return null;
    
    if (result.status === 'running') {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Running...</span>
        </div>
      );
    }
    
    if (result.status === 'error') {
      return (
        <div className="text-red-500 text-sm">
          <AlertTriangle className="inline h-4 w-4 mr-1" />
          {result.error}
        </div>
      );
    }
    
    return (
      <div className="text-green-500 text-sm">
        ✓ Completed successfully
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Video Analysis Testing Suite
          </h1>
          <p className="text-slate-300 text-lg">
            Test all advanced video analysis capabilities for Go4It Sports Platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Target className="h-5 w-5" />
                <span>Sport Selection</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
              >
                {sports.map(sport => (
                  <option key={sport} value={sport}>
                    {sport.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Activity className="h-5 w-5" />
                <span>Test Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runAllTests}
                disabled={isRunning}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <BarChart3 className="h-5 w-5" />
                <span>Test Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(testResults).map(([key, result]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(result.status)}`}></div>
                    <span className="text-sm text-white capitalize">{key}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
            <TabsTrigger value="individual" className="text-white">Individual Tests</TabsTrigger>
            <TabsTrigger value="results" className="text-white">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Play className="h-5 w-5" />
                    <span>Basic GAR Analysis</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Test standard Growth and Ability Rating analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={runBasicAnalysis}
                    disabled={testResults.basic?.status === 'running'}
                    className="w-full mb-3"
                  >
                    Run Basic Test
                  </Button>
                  {testResults.basic && renderTestResult(testResults.basic)}
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Brain className="h-5 w-5" />
                    <span>Advanced Analysis</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Test biomechanics, movement, and tactical analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={runAdvancedAnalysis}
                    disabled={testResults.advanced?.status === 'running'}
                    className="w-full mb-3"
                  >
                    Run Advanced Test
                  </Button>
                  {testResults.advanced && renderTestResult(testResults.advanced)}
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Activity className="h-5 w-5" />
                    <span>Real-time Analysis</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Test live video processing capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={runRealTimeTest}
                    disabled={testResults.realTime?.status === 'running'}
                    className="w-full mb-3"
                  >
                    Run Real-time Test
                  </Button>
                  {testResults.realTime && renderTestResult(testResults.realTime)}
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <TrendingUp className="h-5 w-5" />
                    <span>Predictive Analytics</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Test performance forecasting and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={runPredictiveAnalysis}
                    disabled={testResults.predictive?.status === 'running'}
                    className="w-full mb-3"
                  >
                    Run Predictive Test
                  </Button>
                  {testResults.predictive && renderTestResult(testResults.predictive)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {Object.entries(testResults).map(([key, result]) => (
              <Card key={key} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white capitalize">{key} Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {result.status === 'completed' && result.data ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {result.data.overallScore && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{result.data.overallScore}</div>
                            <div className="text-sm text-slate-300">Overall Score</div>
                          </div>
                        )}
                        {result.data.technicalSkills && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{result.data.technicalSkills}</div>
                            <div className="text-sm text-slate-300">Technical Skills</div>
                          </div>
                        )}
                        {result.data.athleticism && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{result.data.athleticism}</div>
                            <div className="text-sm text-slate-300">Athleticism</div>
                          </div>
                        )}
                        {result.data.gameAwareness && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">{result.data.gameAwareness}</div>
                            <div className="text-sm text-slate-300">Game Awareness</div>
                          </div>
                        )}
                      </div>
                      
                      {result.data.breakdown && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-white">Analysis Breakdown</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.data.breakdown.strengths && (
                              <div>
                                <h5 className="text-green-400 font-medium">Strengths</h5>
                                <ul className="text-sm text-slate-300 list-disc list-inside">
                                  {result.data.breakdown.strengths.map((strength: string, idx: number) => (
                                    <li key={idx}>{strength}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {result.data.breakdown.weaknesses && (
                              <div>
                                <h5 className="text-red-400 font-medium">Areas for Improvement</h5>
                                <ul className="text-sm text-slate-300 list-disc list-inside">
                                  {result.data.breakdown.weaknesses.map((weakness: string, idx: number) => (
                                    <li key={idx}>{weakness}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {result.data.breakdown.recommendations && (
                              <div>
                                <h5 className="text-blue-400 font-medium">Recommendations</h5>
                                <ul className="text-sm text-slate-300 list-disc list-inside">
                                  {result.data.breakdown.recommendations.map((rec: string, idx: number) => (
                                    <li key={idx}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : result.status === 'running' ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-slate-300">Running analysis...</p>
                    </div>
                  ) : result.status === 'error' ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                      <p className="text-red-400">{result.error}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-300">Click "Run Test" to start analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}