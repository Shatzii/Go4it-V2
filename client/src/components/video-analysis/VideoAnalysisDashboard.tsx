import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Play, BarChart2, LightbulbIcon, Brain, LineChart, Video, FileText } from 'lucide-react';
import { GARScorecard, GARScoreBreakdown } from './GARScorecard';

interface VideoAnalysisDashboardProps {
  videoId: number;
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  sportType: string;
  analysisData: {
    garScoreBreakdown: GARScoreBreakdown;
    keyFrameTimestamps?: number[];
    detectedObjects?: string[];
    feedback?: string[];
    improvementTips?: string[];
  };
  highlights: Array<{
    id: number;
    title: string;
    description: string;
    startTime: number;
    endTime: number;
    thumbnailPath: string;
    highlightPath: string;
    tags: string[];
    qualityScore?: number;
    garScore?: number;
    aiGenerated: boolean;
  }>;
  isLoading?: boolean;
}

// Helper to format time in MM:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const VideoAnalysisDashboard: React.FC<VideoAnalysisDashboardProps> = ({
  videoId,
  videoTitle,
  videoUrl,
  thumbnailUrl,
  sportType,
  analysisData,
  highlights,
  isLoading = false,
}) => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [selectedHighlight, setSelectedHighlight] = useState<number | null>(null);
  
  const currentVideo = selectedHighlight 
    ? highlights.find(h => h.id === selectedHighlight)?.highlightPath 
    : videoUrl;
  
  const currentThumbnail = selectedHighlight
    ? highlights.find(h => h.id === selectedHighlight)?.thumbnailPath
    : thumbnailUrl;

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Analyzing video performance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#12141E] text-white rounded-xl overflow-hidden">
      {/* Main Header */}
      <div className="p-6 border-b border-[#2A3142]">
        <h2 className="text-2xl font-bold">{videoTitle}</h2>
        <p className="text-gray-400">
          Video analysis and GAR score breakdown for {sportType.charAt(0).toUpperCase() + sportType.slice(1)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Column - Video Player Section */}
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden bg-[#1A2033] border border-[#2A3142]">
            {/* Video Player */}
            <div className="aspect-video bg-black relative">
              {currentVideo ? (
                <video 
                  src={currentVideo}
                  poster={currentThumbnail}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1A2033]">
                  <div className="text-center">
                    <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Video not available</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Video Controls and Info */}
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">
                    {selectedHighlight ? 
                      highlights.find(h => h.id === selectedHighlight)?.title : 
                      'Full Video'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {selectedHighlight ? 
                      `Highlight (${formatTime(highlights.find(h => h.id === selectedHighlight)?.startTime || 0)} - ${formatTime(highlights.find(h => h.id === selectedHighlight)?.endTime || 0)})` : 
                      'Complete performance analysis'}
                  </p>
                </div>
                {selectedHighlight && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedHighlight(null)}
                  >
                    Back to Full Video
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-6">
            <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="highlights" className="data-[state=active]:bg-blue-600">
                  <Play className="h-4 w-4 mr-2" />
                  Highlights
                </TabsTrigger>
                <TabsTrigger value="insights" className="data-[state=active]:bg-blue-600">
                  <LightbulbIcon className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-600">
                  <Brain className="h-4 w-4 mr-2" />
                  ADHD Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <Card className="border-[#2A3142] bg-[#171C2C]">
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>
                      Summary of your performance metrics and key insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-[#1A2033] p-4 rounded-lg border border-[#2A3142]">
                        <div className="text-gray-400 text-sm mb-1">Overall GAR Score</div>
                        <div className="text-3xl font-bold text-blue-500">
                          {analysisData.garScoreBreakdown.overall_gar_score}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Compared to your sport average
                        </div>
                      </div>
                      
                      <div className="bg-[#1A2033] p-4 rounded-lg border border-[#2A3142]">
                        <div className="text-gray-400 text-sm mb-1">Key Strengths</div>
                        <div className="text-xl font-medium text-green-500">
                          {Math.max(
                            analysisData.garScoreBreakdown.physical.overall,
                            analysisData.garScoreBreakdown.psychological.overall,
                            analysisData.garScoreBreakdown.technical.overall
                          ) === analysisData.garScoreBreakdown.physical.overall
                            ? 'Physical'
                            : Math.max(
                                analysisData.garScoreBreakdown.psychological.overall,
                                analysisData.garScoreBreakdown.technical.overall
                              ) === analysisData.garScoreBreakdown.psychological.overall
                              ? 'Psychological'
                              : 'Technical'
                          }
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Your highest scoring category
                        </div>
                      </div>
                      
                      <div className="bg-[#1A2033] p-4 rounded-lg border border-[#2A3142]">
                        <div className="text-gray-400 text-sm mb-1">Improvement Areas</div>
                        <div className="text-xl font-medium text-amber-500">
                          {Math.min(
                            analysisData.garScoreBreakdown.physical.overall,
                            analysisData.garScoreBreakdown.psychological.overall,
                            analysisData.garScoreBreakdown.technical.overall
                          ) === analysisData.garScoreBreakdown.physical.overall
                            ? 'Physical'
                            : Math.min(
                                analysisData.garScoreBreakdown.psychological.overall,
                                analysisData.garScoreBreakdown.technical.overall
                              ) === analysisData.garScoreBreakdown.psychological.overall
                              ? 'Psychological'
                              : 'Technical'
                          }
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Area with most growth potential
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Development Focus</h4>
                        <p className="text-gray-300">
                          {analysisData.garScoreBreakdown.tailored_development_path}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Key Highlights</h4>
                        <ul className="list-disc pl-5 text-gray-300 space-y-1">
                          {analysisData.garScoreBreakdown.key_highlights.map((highlight, idx) => (
                            <li key={idx}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="highlights" className="mt-0">
                <Card className="border-[#2A3142] bg-[#171C2C]">
                  <CardHeader>
                    <CardTitle>Video Highlights</CardTitle>
                    <CardDescription>
                      Key moments and skills demonstrated in your video
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {highlights.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>GAR</TableHead>
                              <TableHead>Quality</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {highlights.map((highlight) => (
                              <TableRow key={highlight.id}>
                                <TableCell className="font-medium">
                                  {highlight.title}
                                  <div className="text-xs text-gray-400 truncate max-w-xs">
                                    {highlight.description}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {formatTime(highlight.startTime)} - {formatTime(highlight.endTime)}
                                </TableCell>
                                <TableCell>
                                  {highlight.garScore ? (
                                    <span className="font-medium text-blue-500">{highlight.garScore}</span>
                                  ) : (
                                    <span className="text-gray-500">N/A</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {highlight.qualityScore ? (
                                    <span className="font-medium text-green-500">{highlight.qualityScore}</span>
                                  ) : (
                                    <span className="text-gray-500">N/A</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => setSelectedHighlight(highlight.id)}
                                  >
                                    <Play className="h-4 w-4 mr-1" /> Play
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <LineChart className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                        <p>No highlights have been generated for this video yet.</p>
                        <Button className="mt-4" variant="secondary">
                          Generate Highlights
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="mt-0">
                <Card className="border-[#2A3142] bg-[#171C2C]">
                  <CardHeader>
                    <CardTitle>Performance Insights</CardTitle>
                    <CardDescription>
                      Detailed analysis and coaching points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Physical Skills */}
                      <div className="p-4 bg-[#1A2033] rounded-lg border border-[#2A3142]">
                        <h3 className="font-medium text-blue-400 mb-2">Physical Analysis</h3>
                        
                        <div className="space-y-3">
                          {Object.entries(analysisData.garScoreBreakdown.physical).map(([key, value]) => {
                            if (key === 'overall') return null;
                            const category = value as any;
                            return (
                              <div key={key} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{key.replace('_', ' ').charAt(0).toUpperCase() + key.slice(1)}</h4>
                                  <div className="flex items-center">
                                    <span className="text-sm mr-2">Score: {category.score}</span>
                                    <span className="text-xs text-gray-400">Confidence: {Math.round(category.confidence * 100)}%</span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                  <div className="bg-[#171C2C] p-3 rounded border border-green-900">
                                    <div className="text-xs text-green-400 mb-1">STRENGTHS</div>
                                    <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                                      {category.strengths.map((s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="bg-[#171C2C] p-3 rounded border border-amber-900">
                                    <div className="text-xs text-amber-400 mb-1">AREAS TO IMPROVE</div>
                                    <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                                      {category.areas_to_improve.map((s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="bg-[#171C2C] p-3 rounded border border-blue-900">
                                    <div className="text-xs text-blue-400 mb-1">COACHING POINTS</div>
                                    <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                                      {category.coaching_points.map((s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Psychological Skills */}
                      <div className="p-4 bg-[#1A2033] rounded-lg border border-[#2A3142]">
                        <h3 className="font-medium text-purple-400 mb-2">Psychological Analysis</h3>
                        
                        <div className="space-y-3">
                          {Object.entries(analysisData.garScoreBreakdown.psychological).map(([key, value]) => {
                            if (key === 'overall') return null;
                            const category = value as any;
                            return (
                              <div key={key} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{key.replace('_', ' ').charAt(0).toUpperCase() + key.slice(1)}</h4>
                                  <div className="flex items-center">
                                    <span className="text-sm mr-2">Score: {category.score}</span>
                                    <span className="text-xs text-gray-400">Confidence: {Math.round(category.confidence * 100)}%</span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                  <div className="bg-[#171C2C] p-3 rounded border border-green-900">
                                    <div className="text-xs text-green-400 mb-1">STRENGTHS</div>
                                    <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                                      {category.strengths.map((s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="bg-[#171C2C] p-3 rounded border border-amber-900">
                                    <div className="text-xs text-amber-400 mb-1">AREAS TO IMPROVE</div>
                                    <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                                      {category.areas_to_improve.map((s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="bg-[#171C2C] p-3 rounded border border-blue-900">
                                    <div className="text-xs text-blue-400 mb-1">COACHING POINTS</div>
                                    <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                                      {category.coaching_points.map((s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Technical Skills */}
                      <div className="p-4 bg-[#1A2033] rounded-lg border border-[#2A3142]">
                        <h3 className="font-medium text-cyan-400 mb-2">Technical Analysis</h3>
                        
                        <div className="space-y-3">
                          {Object.entries(analysisData.garScoreBreakdown.technical).map(([key, value]) => {
                            if (key === 'overall') return null;
                            const category = value as any;
                            return (
                              <div key={key} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">{key.replace('_', ' ').charAt(0).toUpperCase() + key.slice(1)}</h4>
                                  <div className="flex items-center">
                                    <span className="text-sm mr-2">Score: {category.score}</span>
                                    <span className="text-xs text-gray-400">Confidence: {Math.round(category.confidence * 100)}%</span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                  <div className="bg-[#171C2C] p-3 rounded border border-green-900">
                                    <div className="text-xs text-green-400 mb-1">STRENGTHS</div>
                                    <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                                      {category.strengths.map((s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="bg-[#171C2C] p-3 rounded border border-amber-900">
                                    <div className="text-xs text-amber-400 mb-1">AREAS TO IMPROVE</div>
                                    <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                                      {category.areas_to_improve.map((s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="bg-[#171C2C] p-3 rounded border border-blue-900">
                                    <div className="text-xs text-blue-400 mb-1">COACHING POINTS</div>
                                    <ul className="text-xs text-gray-300 space-y-1 list-disc pl-4">
                                      {category.coaching_points.map((s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Additional feedback */}
                      {analysisData.improvementTips && analysisData.improvementTips.length > 0 && (
                        <div className="p-4 bg-[#1A2033] rounded-lg border border-[#2A3142]">
                          <h3 className="font-medium text-white mb-2">Improvement Tips</h3>
                          <ul className="list-disc pl-5 text-gray-300 space-y-1">
                            {analysisData.improvementTips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="mt-0">
                <Card className="border-[#2A3142] bg-[#171C2C]">
                  <CardHeader>
                    <CardTitle>ADHD-Specific Analysis</CardTitle>
                    <CardDescription>
                      Personalized insights for athletes with ADHD
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-[#1A2033] rounded-lg border border-[#2A3142]">
                        <h3 className="font-medium text-indigo-400 mb-2">Neurodivergent Athlete Insights</h3>
                        <p className="text-gray-300 mb-4">
                          {analysisData.garScoreBreakdown.adhd_specific_insights}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-[#171C2C] p-4 rounded border border-indigo-900">
                            <h4 className="text-indigo-400 text-sm font-medium mb-2">Focus & Attention Strategies</h4>
                            <ul className="text-gray-300 space-y-2 list-disc pl-5 text-sm">
                              <li>Create structured training sessions with clear goals</li>
                              <li>Use visual cues and demonstrations rather than long verbal instructions</li>
                              <li>Break skills into smaller, manageable components</li>
                              <li>Implement regular breaks during long practice sessions</li>
                            </ul>
                          </div>
                          
                          <div className="bg-[#171C2C] p-4 rounded border border-indigo-900">
                            <h4 className="text-indigo-400 text-sm font-medium mb-2">Leveraging ADHD Strengths</h4>
                            <ul className="text-gray-300 space-y-2 list-disc pl-5 text-sm">
                              <li>Utilize hyperfocus periods for skill mastery</li>
                              <li>Channel spontaneity into creative play solutions</li>
                              <li>Embrace adaptive thinking during changing game situations</li>
                              <li>Build routines that support consistency while allowing flexibility</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-[#1A2033] rounded-lg border border-[#2A3142]">
                        <h3 className="font-medium text-blue-400 mb-2">Performance Environment Recommendations</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-[#171C2C] p-3 rounded border border-blue-900">
                            <h4 className="text-blue-400 text-sm font-medium mb-2">Training Environment</h4>
                            <ul className="text-gray-300 space-y-1 list-disc pl-4 text-sm">
                              <li>Minimize distractions during skill development</li>
                              <li>Create consistent routines and clear expectations</li>
                              <li>Use visual timers and structured transitions</li>
                              <li>Incorporate movement breaks between activities</li>
                            </ul>
                          </div>
                          
                          <div className="bg-[#171C2C] p-3 rounded border border-blue-900">
                            <h4 className="text-blue-400 text-sm font-medium mb-2">Coaching Approach</h4>
                            <ul className="text-gray-300 space-y-1 list-disc pl-4 text-sm">
                              <li>Provide frequent, positive feedback</li>
                              <li>Use clear, concise instructions</li>
                              <li>Demonstrate rather than explain when possible</li>
                              <li>Set challenging but achievable goals</li>
                            </ul>
                          </div>
                          
                          <div className="bg-[#171C2C] p-3 rounded border border-blue-900">
                            <h4 className="text-blue-400 text-sm font-medium mb-2">Recovery Strategies</h4>
                            <ul className="text-gray-300 space-y-1 list-disc pl-4 text-sm">
                              <li>Establish consistent sleep routines</li>
                              <li>Practice mindfulness techniques between sessions</li>
                              <li>Create a post-training wind-down ritual</li>
                              <li>Use journaling to process training experiences</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Column - GAR Scorecard and Actions */}
        <div>
          {/* GAR Scorecard */}
          <GARScorecard 
            scoreBreakdown={analysisData.garScoreBreakdown}
            sportType={sportType}
            compact={true}
          />
          
          {/* Actions Card */}
          <Card className="mt-6 border-[#2A3142] bg-[#171C2C]">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Detailed Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Play className="mr-2 h-4 w-4" />
                  Create New Highlights
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Compare to Previous
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="mr-2 h-4 w-4" />
                  Get AI Coaching Tips
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisDashboard;