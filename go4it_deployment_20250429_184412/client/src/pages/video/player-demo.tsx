import React, { useState } from 'react';
import { Link } from 'wouter';
import { PageHeader } from '@/components/ui/page-header';
import AIVideoPlayer, { VideoPlayerMode } from '@/components/video-analysis/AIVideoPlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

import { Activity, Camera, FileVideo, Zap, FileBadge, PlaySquare } from 'lucide-react';

/**
 * AI Video Player Demo Page
 * 
 * This page demonstrates the unified AIVideoPlayer component that can be used for:
 * - Workout verification
 * - Video analysis with GAR scoring
 * - Sports match analysis
 * - Highlight films
 * - Live streaming
 */
const AIVideoPlayerDemo: React.FC = () => {
  const [activeMode, setActiveMode] = useState<VideoPlayerMode>('analysis');

  // Mock data for demo purposes
  const mockVideo = {
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://i.vimeocdn.com/video/851483542-8502970cfbac6e26f06a7391ab2475b43bb271c903a90b1a1e47a0570740f78c-d_640x360.jpg',
    metadata: {
      title: 'Basketball Training Session',
      description: 'Advanced basketball drills for improving ball handling and shooting',
      uploadDate: new Date(2023, 5, 15),
      sport: 'basketball',
      tags: ['training', 'shooting', 'ball handling'],
      views: 1245
    },
    keyFrameTimestamps: [5, 15, 25, 40],
    analysisPoints: [
      { timestamp: 5, label: 'Shooting Form', description: 'Good elbow alignment and follow-through' },
      { timestamp: 15, label: 'Footwork', description: 'Need to improve foot positioning on landing' },
      { timestamp: 25, label: 'Ball Handling', description: 'Excellent control and low dribble' },
      { timestamp: 40, label: 'Defense Stance', description: 'Keep the center of gravity lower' }
    ],
    garScore: 7.8,
    scoreBreakdown: {
      categories: [
        {
          category: 'Physical',
          overallScore: 8.2,
          attributes: [
            { name: 'Speed', score: 8.5, comments: 'Good acceleration and top speed' },
            { name: 'Strength', score: 7.9, comments: 'Good upper body strength' },
            { name: 'Endurance', score: 8.3, comments: 'Maintained high energy throughout' }
          ]
        },
        {
          category: 'Technical',
          overallScore: 7.5,
          attributes: [
            { name: 'Ball Handling', score: 8.0, comments: 'Confident dribbling' },
            { name: 'Shooting', score: 7.2, comments: 'Consistent form, room to improve accuracy' },
            { name: 'Passing', score: 7.3, comments: 'Good vision, could improve precision' }
          ]
        },
        {
          category: 'Psychological',
          overallScore: 7.6,
          attributes: [
            { name: 'Decision Making', score: 7.8, comments: 'Makes good choices under pressure' },
            { name: 'Focus', score: 7.1, comments: 'Maintains concentration most of the time' },
            { name: 'Confidence', score: 8.0, comments: 'Shows self-assurance in abilities' }
          ]
        }
      ],
      strengths: [
        'Excellent ball handling skills with both hands',
        'Good shooting form with consistent release point',
        'High level of court awareness',
        'Strong defensive positioning'
      ],
      improvementAreas: [
        'Work on shooting consistency from mid-range',
        'Improve lateral quickness for defense',
        'Develop more varied passing techniques',
        'Focus on maintaining balance when changing direction'
      ]
    },
    motionMarkers: [
      { x: 0.35, y: 0.45, name: 'Elbow Position', color: 'green-500' },
      { x: 0.4, y: 0.6, name: 'Knee Alignment', color: 'amber-500' },
      { x: 0.65, y: 0.5, name: 'Wrist Snap', color: 'blue-500' }
    ]
  };

  const handleModeChange = (mode: VideoPlayerMode) => {
    setActiveMode(mode);
    toast({
      title: `Switched to ${mode} mode`,
      description: `Now viewing the AI Video Player in ${mode} mode.`
    });
  };

  const handleAnalyze = () => {
    toast({
      title: 'Analysis Started',
      description: 'The AI is analyzing your video...'
    });
  };

  const handleVerify = (data: any) => {
    console.log('Workout verification data:', data);
    toast({
      title: 'Workout Verified',
      description: `Accuracy: ${data.accuracy}%. ${data.feedback}`
    });
  };

  return (
    <div className="container mx-auto pt-8 pb-16">
      <PageHeader
        title="AI Video Analysis Platform"
        description="Unified video player for workout verification, sports analysis, highlights, and live streaming"
      />

      <Tabs value={activeMode} onValueChange={(value) => handleModeChange(value as VideoPlayerMode)} className="my-8">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="analysis" className="flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="workout" className="flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Workout
          </TabsTrigger>
          <TabsTrigger value="match" className="flex items-center">
            <FileBadge className="w-4 h-4 mr-2" />
            Match
          </TabsTrigger>
          <TabsTrigger value="highlights" className="flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            Highlights
          </TabsTrigger>
          <TabsTrigger value="stream" className="flex items-center">
            <PlaySquare className="w-4 h-4 mr-2" />
            Live Stream
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <AIVideoPlayer
            src={mockVideo.src}
            thumbnail={mockVideo.thumbnail}
            mode={activeMode}
            metadata={mockVideo.metadata}
            keyFrameTimestamps={mockVideo.keyFrameTimestamps}
            analysisPoints={mockVideo.analysisPoints}
            garScore={mockVideo.garScore}
            scoreBreakdown={mockVideo.scoreBreakdown}
            motionMarkers={mockVideo.motionMarkers}
            onAnalyze={handleAnalyze}
            onVerify={handleVerify}
            controls={{
              showFullscreen: true,
              showShare: true,
              showAnalysisPanel: true
            }}
          />
        </div>
      </Tabs>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileVideo className="w-5 h-5 mr-2 text-primary" />
              About the AI Video Player
            </CardTitle>
            <CardDescription>
              A unified video component for all video-related features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The AI Video Player is a comprehensive component that provides a consistent experience
              across different video-related features in the Go4It Sports platform. This unified
              approach ensures that users have a familiar interface regardless of whether they're:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Verifying workouts</strong> - AI analysis to confirm exercises were completed correctly</li>
              <li><strong>Analyzing performances</strong> - Full GAR scoring with technical breakdown</li>
              <li><strong>Watching match footage</strong> - With detailed play-by-play analysis</li>
              <li><strong>Viewing highlights</strong> - Auto-generated or manually created highlight films</li>
              <li><strong>Streaming live</strong> - For remote coaching or event broadcasts</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              Key Features
            </CardTitle>
            <CardDescription>
              Advanced functionality for coaches and athletes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Motion tracking</strong> - Visual markers to analyze form and technique</li>
              <li><strong>Frame capture</strong> - Save specific moments for deeper analysis</li>
              <li><strong>Key moment navigation</strong> - Quickly jump to important timestamps</li>
              <li><strong>GAR scoring integration</strong> - Complete performance analytics</li>
              <li><strong>ADHD-specific insights</strong> - Focus strategies and attention patterns</li>
              <li><strong>Workout verification</strong> - AI-powered form checking</li>
              <li><strong>Split screen comparison</strong> - Compare technique with professional examples</li>
            </ul>
            <div className="pt-4">
              <Link href="/video-analysis">
                <Button variant="outline" className="w-full">
                  <FileVideo className="w-4 h-4 mr-2" />
                  Go to Video Analysis
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIVideoPlayerDemo;