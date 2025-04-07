import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Video, VideoAnalysis, videoAnalyses, videos } from "@shared/schema";
import { PlayAnalysisResult } from "@shared/schema";
import { useQueryClient } from "@/lib/query-client";
import { apiRequest } from "@/lib/api";
import { Card as VideoCard } from "lucide-react";
import { Loader2 } from "lucide-react";
import { ChevronRight, BarChart2, Medal, FileVideo, Activity, Play, CheckCircle2, Dumbbell, Brain, GitBranch } from "lucide-react";

// Component for the GAR score visualization
function GARScoreVisualization({ garScores }: { garScores: any }) {
  const physicalScores = [
    { subject: "Speed", value: garScores?.physical?.speed || 0 },
    { subject: "Strength", value: garScores?.physical?.strength || 0 },
    { subject: "Endurance", value: garScores?.physical?.endurance || 0 },
    { subject: "Agility", value: garScores?.physical?.agility || 0 },
    { subject: "Balance", value: garScores?.physical?.balance || 0 },
    { subject: "Coordination", value: garScores?.physical?.coordination || 0 },
  ];

  const psychologicalScores = [
    { subject: "Focus", value: garScores?.psychological?.focus || 0 },
    { subject: "Confidence", value: garScores?.psychological?.confidence || 0 },
    { subject: "Resilience", value: garScores?.psychological?.resilience || 0 },
    { subject: "Determination", value: garScores?.psychological?.determination || 0 },
    { subject: "Teamwork", value: garScores?.psychological?.teamwork || 0 },
    { subject: "Leadership", value: garScores?.psychological?.leadership || 0 },
  ];

  const technicalScores = [
    { subject: "Technique", value: garScores?.technical?.technique || 0 },
    { subject: "Skill", value: garScores?.technical?.skill || 0 },
    { subject: "Game IQ", value: garScores?.technical?.gameIQ || 0 },
    { subject: "Decision Making", value: garScores?.technical?.decisionMaking || 0 },
    { subject: "Positioning", value: garScores?.technical?.positioning || 0 },
    { subject: "Execution", value: garScores?.technical?.execution || 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-cyan-500" />
            Physical (60%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} width={350} height={250} data={physicalScores}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--cyan-8)', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Physical" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Psychological (20%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} width={350} height={250} data={psychologicalScores}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--purple-8)', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Psychological" dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-green-500" />
            Technical (20%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} width={350} height={250} data={technicalScores}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--green-8)', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="Technical" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component for the play strategy visualization
function PlayStrategyVisualization({ playAnalysis }: { playAnalysis: PlayAnalysisResult }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Play Strategy Analysis
          </CardTitle>
          <CardDescription>
            {playAnalysis.playType} - {playAnalysis.formation}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Key Movements</h4>
            <ul className="space-y-1">
              {playAnalysis.keyMovements.map((movement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 text-cyan-500 shrink-0" />
                  <span className="text-sm">{movement}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Strengths</h4>
              <ul className="space-y-1">
                {playAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Weaknesses</h4>
              <ul className="space-y-1">
                {playAnalysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Activity className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                    <span className="text-sm">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Tactical Insights</h4>
            <p className="text-sm">{playAnalysis.tacticalInsights}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Coaching Points</h4>
            <ul className="space-y-1">
              {playAnalysis.coachingPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Medal className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                  <span className="text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {playAnalysis.diagrams && playAnalysis.diagrams.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Play Diagrams</h4>
              <div className="space-y-4">
                {playAnalysis.diagrams.map((diagram, index) => (
                  <div key={index} className="border border-border rounded-md p-3">
                    <h5 className="text-sm font-medium mb-2">{diagram.description}</h5>
                    <div className="relative h-[200px] w-full border border-border rounded-md bg-[#192227]">
                      {diagram.positions.map((pos, pIndex) => (
                        <div 
                          key={pIndex}
                          className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold transform -translate-x-1/2 -translate-y-1/2"
                          style={{ 
                            left: `${pos.x * 100}%`, 
                            top: `${pos.y * 100}%`,
                            background: pos.role.includes('offense') ? '#22c55e' : '#ec4899'
                          }}
                          title={`${pos.player} (${pos.role})`}
                        >
                          {pos.player.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {diagram.positions.map((pos, pIndex) => (
                        <Badge 
                          key={pIndex} 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            borderColor: pos.role.includes('offense') ? '#22c55e' : '#ec4899',
                            color: pos.role.includes('offense') ? '#22c55e' : '#ec4899'
                          }}  
                        >
                          {pos.player}: {pos.role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main component
export default function VideoAnalysisDetail() {
  const { id } = useParams<{ id: string }>();
  const videoId = parseInt(id);
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();

  // Fetch video data
  const { data: video = {}, isLoading: isLoadingVideo } = useQuery({
    queryKey: ['/api/videos', videoId],
    queryFn: () => apiRequest<Video>(`/api/videos/${videoId}`),
    enabled: !isNaN(videoId)
  });

  // Fetch analysis data
  const { data: analysis = {}, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: ['/api/videos', videoId, 'analysis'],
    queryFn: () => apiRequest<VideoAnalysis>(`/api/videos/${videoId}/analysis`),
    enabled: !isNaN(videoId)
  });

  // Fetch play analysis data
  const { data: playAnalysis, isLoading: isLoadingPlayAnalysis } = useQuery({
    queryKey: ['/api/videos', videoId, 'analyze-play'],
    queryFn: () => apiRequest<PlayAnalysisResult>(`/api/videos/${videoId}/analyze-play`),
    enabled: !isNaN(videoId) && activeTab === "playStrategy"
  });

  if (isLoadingVideo || isLoadingAnalysis) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={video.filePath}
              poster={video.thumbnailPath || undefined}
              controls
              preload="metadata"
            />

            {video.keyFrameTimestamps && video.keyFrameTimestamps.length > 0 && (
              <div className="absolute bottom-16 left-0 right-0 overflow-x-auto flex px-4 gap-2 pb-2">
                {video.keyFrameTimestamps.map((timestamp, index) => (
                  <button
                    key={index}
                    className="shrink-0 bg-background/80 backdrop-blur-sm border border-border rounded-md p-1 hover:bg-primary/20"
                    title={`Key moment at ${timestamp.toFixed(1)}s`}
                    onClick={() => {
                      const videoElement = document.querySelector('video');
                      if (videoElement) videoElement.currentTime = timestamp;
                    }}
                  >
                    <div className="w-16 h-12 rounded bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium">{timestamp.toFixed(1)}s</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Performance Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 flex items-center justify-center">
                  <span className="text-primary">{analysis.overallScore}</span>
                  <span className="text-sm text-muted-foreground ml-2">/100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${analysis.overallScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Analysis Feedback</h3>
                <p className="text-sm">{analysis.feedback}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Improvement Tips</h3>
                <ul className="space-y-1">
                  {analysis.improvementTips?.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="overview">Motion Analysis</TabsTrigger>
          <TabsTrigger value="playStrategy">Play Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <h2 className="text-2xl font-bold">Motion Analysis</h2>
          
          {analysis.motionData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analysis.motionData).map(([key, value]) => (
                <Card key={key} className="overflow-hidden">
                  <CardHeader className="bg-muted p-4 pb-3">
                    <CardTitle className="text-lg capitalize">{key.replace(/([A-Z])/g, ' $1')}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-3">
                    <pre className="text-xs text-muted-foreground bg-background/50 p-2 rounded-md overflow-x-auto">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {analysis.garScores && <GARScoreVisualization garScores={analysis.garScores} />}
        </TabsContent>

        <TabsContent value="playStrategy" className="space-y-6">
          <h2 className="text-2xl font-bold">Play Strategy Analysis</h2>
          
          {isLoadingPlayAnalysis ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : playAnalysis ? (
            <PlayStrategyVisualization playAnalysis={playAnalysis} />
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <VideoCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Play analysis not available for this video.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">Title</dt>
              <dd>{video.title}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Description</dt>
              <dd>{video.description || "No description"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Sport Type</dt>
              <dd>{video.sportType || "Not specified"}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Upload Date</dt>
              <dd>
                {video.uploadDate 
                  ? format(new Date(video.uploadDate), "MMMM d, yyyy") 
                  : "Unknown"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Analysis Date</dt>
              <dd>
                {analysis.analysisDate 
                  ? format(new Date(analysis.analysisDate), "MMMM d, yyyy") 
                  : "Unknown"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">GAR Scores</dt>
              <dd className="flex gap-2">
                {analysis.garScores ? (
                  <div className="space-x-1">
                    <Badge variant="outline" className="text-cyan-500 border-cyan-500">Physical: {analysis.garScores.physical?.overall || 0}</Badge>
                    <Badge variant="outline" className="text-purple-500 border-purple-500">Mental: {analysis.garScores.psychological?.overall || 0}</Badge>
                    <Badge variant="outline" className="text-green-500 border-green-500">Technical: {analysis.garScores.technical?.overall || 0}</Badge>
                  </div>
                ) : (
                  "No GAR scores"
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}