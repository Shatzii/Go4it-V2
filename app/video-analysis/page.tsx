'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Upload, BarChart3, Target, TrendingUp, Clock, Medal } from 'lucide-react';

export default function VideoAnalysisPage() {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockAnalysisData = {
    garScore: 8.5,
    improvements: [
      { category: 'Footwork', score: 7.2, improvement: '+0.8' },
      { category: 'Ball Handling', score: 8.9, improvement: '+0.3' },
      { category: 'Shooting Form', score: 9.1, improvement: '+0.2' },
      { category: 'Court Vision', score: 7.8, improvement: '+1.2' }
    ],
    keyFrames: [
      { timestamp: '0:23', description: 'Excellent crossover technique', score: 9.2 },
      { timestamp: '1:45', description: 'Improved defensive stance', score: 8.7 },
      { timestamp: '2:31', description: 'Perfect shooting form', score: 9.5 },
      { timestamp: '3:12', description: 'Good court awareness', score: 8.3 }
    ]
  };

  const handleAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Analysis</h1>
          <p className="text-gray-600">AI-powered performance analysis for athletic improvement</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Upload Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Video for Analysis
              </CardTitle>
              <CardDescription>
                Upload your performance video to get AI-powered analysis and GAR scoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Drop your video here</p>
                <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
                <Button onClick={handleAnalysis} disabled={isAnalyzing}>
                  {isAnalyzing ? 'Analyzing...' : 'Upload Video'}
                </Button>
              </div>
              
              {isAnalyzing && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Analysis Progress</span>
                    <span className="text-sm text-gray-500">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* GAR Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5" />
                GAR Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {mockAnalysisData.garScore}
                </div>
                <div className="text-sm text-gray-600 mb-4">Growth & Ability Rating</div>
                <Badge variant="secondary" className="mb-4">
                  Above Average
                </Badge>
                <div className="space-y-2">
                  {mockAnalysisData.improvements.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.score}</span>
                        <span className="text-xs text-green-600">{item.improvement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="keyframes">Key Frames</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Accuracy</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Improvement</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">+12%</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Reaction Time</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">0.23s</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Medal className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">Consistency</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">91%</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="keyframes" className="space-y-4">
                <div className="space-y-3">
                  {mockAnalysisData.keyFrames.map((frame, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        {frame.timestamp}
                      </Button>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{frame.description}</p>
                      </div>
                      <Badge variant="secondary">{frame.score}</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Technical Skills</h3>
                    <div className="space-y-3">
                      {mockAnalysisData.improvements.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{skill.category}</span>
                            <span className="text-sm font-medium">{skill.score}/10</span>
                          </div>
                          <Progress value={skill.score * 10} className="w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Performance Trends</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">
                        Your performance has improved by an average of 15% over the last month.
                      </p>
                      <p className="text-sm text-gray-600">
                        Focus areas: Footwork and court vision show the most potential for improvement.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Immediate Actions</h3>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                      <li>Practice crossover drills for 15 minutes daily</li>
                      <li>Focus on maintaining low stance during defensive plays</li>
                      <li>Work on follow-through consistency in shooting</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">Long-term Development</h3>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                      <li>Develop peripheral vision through specific drills</li>
                      <li>Increase agility training to improve reaction times</li>
                      <li>Study game film to enhance decision-making</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}