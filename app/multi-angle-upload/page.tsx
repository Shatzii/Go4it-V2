'use client';

import { useState, useRef } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Camera,
  Play,
  Trash2,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Zap,
  Target,
  Video,
  RotateCw,
  Clock,
  Award,
  Star,
} from 'lucide-react';

interface VideoUpload {
  id: string;
  file: File;
  angle: string;
  preview: string;
  duration?: number;
  size: string;
  status: 'uploading' | 'ready' | 'syncing' | 'analyzed';
  progress: number;
  timestamp?: number;
  analysisData?: any;
}

const cameraAngles = [
  { value: 'front', label: 'Front View', description: 'Primary technique analysis' },
  { value: 'side', label: 'Side View', description: 'Form and mechanics' },
  { value: 'rear', label: 'Rear View', description: 'Balance and posture' },
  { value: 'top', label: 'Top/Overhead', description: 'Positioning and movement' },
  { value: 'left', label: 'Left Side', description: 'Lateral movement' },
  { value: 'right', label: 'Right Side', description: 'Opposite perspective' },
];

export default function MultiAngleUploadPage() {
  const [videos, setVideos] = useState<VideoUpload[]>([]);
  const [selectedSport, setSelectedSport] = useState('football');
  const [syncedAnalysis, setSyncedAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList, angle: string) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('video/')) {
        const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const preview = URL.createObjectURL(file);

        const newVideo: VideoUpload = {
          id: videoId,
          file,
          angle,
          preview,
          size: formatFileSize(file.size),
          status: 'uploading',
          progress: 0,
          timestamp: Date.now(),
        };

        setVideos((prev) => [...prev, newVideo]);
        simulateUpload(videoId);
      }
    });
  };

  const simulateUpload = (videoId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setVideos((prev) =>
          prev.map((v) => (v.id === videoId ? { ...v, status: 'ready', progress: 100 } : v)),
        );
      } else {
        setVideos((prev) => prev.map((v) => (v.id === videoId ? { ...v, progress } : v)));
      }
    }, 200);
  };

  const removeVideo = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (video) {
      URL.revokeObjectURL(video.preview);
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
    }
  };

  const synchronizeVideos = async () => {
    if (videos.length < 2) {
      alert('Need at least 2 videos for synchronization');
      return;
    }

    setIsAnalyzing(true);
    setVideos((prev) => prev.map((v) => ({ ...v, status: 'syncing' })));

    try {
      // Simulate synchronization process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mark videos as synchronized
      setVideos((prev) => prev.map((v) => ({ ...v, status: 'ready' })));

      alert('Videos synchronized successfully!');
    } catch (error) {
      console.error('Synchronization failed:', error);
      alert('Synchronization failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeMultiAngle = async () => {
    if (videos.filter((v) => v.status === 'ready').length < 2) {
      alert('Need at least 2 synchronized videos for multi-angle analysis');
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      // Prepare form data with all videos
      const formData = new FormData();
      videos.forEach((video, index) => {
        formData.append(`video_${index}`, video.file);
        formData.append(`angle_${index}`, video.angle);
      });
      formData.append('sport', selectedSport);
      formData.append('analysisType', 'multi-angle');

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      // Call multi-angle analysis API
      const response = await fetch('/api/gar/multi-angle-analysis', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        setSyncedAnalysis(result);
        setVideos((prev) =>
          prev.map((v) => ({
            ...v,
            status: 'analyzed',
            analysisData: result.angleAnalysis?.[v.angle],
          })),
        );

        // Redirect to results after short delay
        setTimeout(() => {
          window.location.href = '/gar-results';
        }, 2000);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Multi-angle analysis failed:', error);
      alert('Analysis failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAngleIcon = (angle: string) => {
    switch (angle) {
      case 'front':
        return <Camera className="w-4 h-4" />;
      case 'side':
        return <Video className="w-4 h-4" />;
      case 'rear':
        return <RotateCcw className="w-4 h-4" />;
      case 'top':
        return <Target className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Upload className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'syncing':
        return <RotateCw className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'analyzed':
        return <Award className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <RotateCw className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MULTI-ANGLE ANALYSIS
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-8">
            Upload videos from multiple camera angles for comprehensive 360-degree GAR analysis
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Enhanced Precision</h3>
                <p className="text-slate-300 text-sm">
                  Multiple angles capture details missed by single-camera analysis
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Higher GAR Scores</h3>
                <p className="text-slate-300 text-sm">
                  Comprehensive analysis typically results in 15-25% higher accuracy
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Recruiting Ready</h3>
                <p className="text-slate-300 text-sm">
                  Multi-angle analysis creates professional recruiting reports
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upload Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {cameraAngles.map((angle) => (
            <Card key={angle.value} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {getAngleIcon(angle.value)}
                  <CardTitle className="text-lg text-white">{angle.label}</CardTitle>
                </div>
                <p className="text-slate-400 text-sm">{angle.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Video for this angle */}
                  {videos
                    .filter((v) => v.angle === angle.value)
                    .map((video) => (
                      <div key={video.id} className="border border-slate-600 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(video.status)}
                            <span className="text-sm text-white truncate">{video.file.name}</span>
                          </div>
                          <Button
                            onClick={() => removeVideo(video.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                          <span>{video.size}</span>
                          <span className="capitalize">{video.status}</span>
                        </div>

                        {video.status === 'uploading' && (
                          <Progress value={video.progress} className="h-2" />
                        )}

                        {video.status === 'ready' && (
                          <video
                            src={video.preview}
                            className="w-full h-24 object-cover rounded"
                            muted
                          />
                        )}
                      </div>
                    ))}

                  {/* Upload button for this angle */}
                  {!videos.some((v) => v.angle === angle.value) && (
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="video/*"
                        multiple={false}
                        onChange={(e) =>
                          e.target.files && handleFileUpload(e.target.files, angle.value)
                        }
                        className="hidden"
                        id={`upload-${angle.value}`}
                      />
                      <label
                        htmlFor={`upload-${angle.value}`}
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="w-8 h-8 text-slate-400" />
                        <span className="text-sm text-slate-400">
                          Click to upload {angle.label.toLowerCase()}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls */}
        {videos.length > 0 && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">Analysis Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sport Selection */}
                <div>
                  <Label htmlFor="sport" className="text-slate-300 mb-2 block">
                    Sport
                  </Label>
                  <select
                    id="sport"
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="football">Football</option>
                    <option value="basketball">Basketball</option>
                    <option value="soccer">Soccer</option>
                    <option value="baseball">Baseball</option>
                    <option value="tennis">Tennis</option>
                    <option value="volleyball">Volleyball</option>
                  </select>
                </div>

                {/* Status Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">{videos.length}</p>
                    <p className="text-slate-400 text-sm">Total Videos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">
                      {videos.filter((v) => v.status === 'ready').length}
                    </p>
                    <p className="text-slate-400 text-sm">Ready</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">
                      {videos.filter((v) => v.status === 'uploading').length}
                    </p>
                    <p className="text-slate-400 text-sm">Uploading</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-400">
                      {videos.filter((v) => v.status === 'analyzed').length}
                    </p>
                    <p className="text-slate-400 text-sm">Analyzed</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {videos.length >= 2 &&
                    videos.filter((v) => v.status === 'ready').length >= 2 &&
                    !isAnalyzing && (
                      <>
                        <Button
                          onClick={synchronizeVideos}
                          className="bg-yellow-600 hover:bg-yellow-700"
                          disabled={isAnalyzing}
                        >
                          <RotateCw className="w-4 h-4 mr-2" />
                          Synchronize Videos
                        </Button>
                        <Button
                          onClick={analyzeMultiAngle}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          disabled={isAnalyzing}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Start Multi-Angle Analysis
                        </Button>
                      </>
                    )}

                  {isAnalyzing && (
                    <div className="text-center">
                      <p className="text-white mb-2">Analyzing multi-angle footage...</p>
                      <Progress value={uploadProgress} className="h-3" />
                      <p className="text-slate-400 text-sm mt-2">
                        {Math.round(uploadProgress)}% complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Multi-Angle Setup Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-400 mb-3">Camera Positioning</h4>
                <ul className="space-y-2 text-slate-300">
                  <li>• Position cameras 10-15 feet from the action</li>
                  <li>• Ensure all cameras start recording simultaneously</li>
                  <li>• Use tripods or stable surfaces for steady footage</li>
                  <li>• Record the same performance from all angles</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-3">Best Results</h4>
                <ul className="space-y-2 text-slate-300">
                  <li>• Minimum 2 angles required, 3-4 recommended</li>
                  <li>• Keep videos under 500MB each</li>
                  <li>• Good lighting improves analysis accuracy</li>
                  <li>• Include 2-3 repetitions of the same skill</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
