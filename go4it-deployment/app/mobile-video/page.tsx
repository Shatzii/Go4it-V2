'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Camera,
  Video,
  Square,
  Play,
  Pause,
  RotateCcw,
  Upload,
  Check,
  AlertCircle,
} from 'lucide-react';

interface RecordingGuide {
  sport: string;
  technique: string;
  instructions: string[];
  keyFrames: number[];
  duration: number;
}

const recordingGuides: Record<string, RecordingGuide[]> = {
  flag_football: [
    {
      sport: 'flag_football',
      technique: 'Throwing Motion',
      instructions: [
        'Stand in athletic position',
        'Step forward with opposite foot',
        'Keep elbow high throughout motion',
        'Follow through toward target',
      ],
      keyFrames: [0, 0.3, 0.6, 1.0],
      duration: 3,
    },
    {
      sport: 'flag_football',
      technique: 'Route Running',
      instructions: [
        'Start in proper stance',
        'First three steps explosive',
        'Sharp cuts at break point',
        'Look for ball immediately',
      ],
      keyFrames: [0, 0.2, 0.7, 1.0],
      duration: 5,
    },
  ],
  soccer: [
    {
      sport: 'soccer',
      technique: 'Shooting Form',
      instructions: [
        'Plant foot beside ball',
        'Keep head over ball',
        'Strike with inside foot',
        'Follow through low',
      ],
      keyFrames: [0, 0.4, 0.7, 1.0],
      duration: 3,
    },
    {
      sport: 'soccer',
      technique: 'Dribbling',
      instructions: [
        'Keep ball close to feet',
        'Use both feet alternately',
        'Stay light on toes',
        'Look up frequently',
      ],
      keyFrames: [0, 0.25, 0.5, 0.75],
      duration: 6,
    },
  ],
  basketball: [
    {
      sport: 'basketball',
      technique: 'Shooting Form',
      instructions: [
        'Square feet to basket',
        'Elbow under ball',
        'Smooth upward motion',
        'Snap wrist on release',
      ],
      keyFrames: [0, 0.3, 0.8, 1.0],
      duration: 2,
    },
    {
      sport: 'basketball',
      technique: 'Dribbling',
      instructions: [
        'Keep head up',
        'Use fingertips not palm',
        'Stay low and controlled',
        'Protect ball with body',
      ],
      keyFrames: [0, 0.2, 0.6, 1.0],
      duration: 4,
    },
  ],
  track_field: [
    {
      sport: 'track_field',
      technique: 'Sprint Start',
      instructions: [
        'Set position - hands behind line',
        'Ready position - slight lift',
        'Drive with arms and legs',
        'Gradual body rise',
      ],
      keyFrames: [0, 0.2, 0.5, 1.0],
      duration: 3,
    },
    {
      sport: 'track_field',
      technique: 'Long Jump',
      instructions: [
        'Consistent approach speed',
        'Plant takeoff foot',
        'Drive knee and arms up',
        'Land with heels first',
      ],
      keyFrames: [0, 0.6, 0.8, 1.0],
      duration: 4,
    },
  ],
};

export default function MobileVideoPage() {
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedTechnique, setSelectedTechnique] = useState<RecordingGuide | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [qualityScore, setQualityScore] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (selectedTechnique && isRecording) {
      const stepDuration = (selectedTechnique.duration * 1000) / selectedTechnique.keyFrames.length;
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < selectedTechnique.keyFrames.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, stepDuration);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRecording, selectedTechnique]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = () => {
    if (!streamRef.current || !selectedTechnique) return;

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9',
    });

    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setRecordedBlob(blob);
      analyzeVideoQuality(blob);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingTime(0);
    setCurrentStep(0);

    const timer = setInterval(() => {
      setRecordingTime((prev) => {
        const newTime = prev + 0.1;
        if (newTime >= selectedTechnique.duration) {
          stopRecording();
          return selectedTechnique.duration;
        }
        return newTime;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(timer);
    }, selectedTechnique.duration * 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const analyzeVideoQuality = async (blob: Blob) => {
    // Simulate quality analysis
    const quality = Math.floor(Math.random() * 30) + 70; // 70-100
    setQualityScore(quality);
  };

  const uploadVideo = async () => {
    if (!recordedBlob || !selectedTechnique) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', recordedBlob, 'recording.webm');
    formData.append('sport', selectedTechnique.sport);
    formData.append('technique', selectedTechnique.technique);
    formData.append('qualityScore', qualityScore?.toString() || '0');

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      const response = await fetch('/api/mobile-tools/video-upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        setTimeout(() => {
          setRecordedBlob(null);
          setQualityScore(null);
          setUploadProgress(0);
          setIsUploading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setQualityScore(null);
    setRecordingTime(0);
    setCurrentStep(0);
  };

  const availableTechniques = selectedSport ? recordingGuides[selectedSport] || [] : [];

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-2xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Mobile Video Recording</h1>
        <p className="text-muted-foreground">Record technique videos with guided instructions</p>
      </div>

      {/* Sport and Technique Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Recording</CardTitle>
          <CardDescription>Choose your sport and technique to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Sport</label>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Select your sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flag_football">🏈 Flag Football</SelectItem>
                <SelectItem value="soccer">⚽ Soccer</SelectItem>
                <SelectItem value="basketball">🏀 Basketball</SelectItem>
                <SelectItem value="track_field">🏃‍♂️ Track & Field</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {availableTechniques.length > 0 && (
            <div>
              <label className="text-sm font-medium">Technique</label>
              <Select
                value={selectedTechnique?.technique || ''}
                onValueChange={(value) => {
                  const technique = availableTechniques.find((t) => t.technique === value);
                  setSelectedTechnique(technique || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technique to practice" />
                </SelectTrigger>
                <SelectContent>
                  {availableTechniques.map((technique) => (
                    <SelectItem key={technique.technique} value={technique.technique}>
                      {technique.technique}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Camera and Recording */}
      <Card>
        <CardContent className="p-0">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Recording Overlay */}
            {isRecording && (
              <div className="absolute inset-0 bg-black/20">
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">REC {recordingTime.toFixed(1)}s</span>
                </div>

                {selectedTechnique && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/80 rounded-lg p-4 text-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          Step {currentStep + 1} of {selectedTechnique.instructions.length}
                        </span>
                        <span className="text-sm">
                          {((recordingTime / selectedTechnique.duration) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm mb-2">{selectedTechnique.instructions[currentStep]}</p>
                      <Progress
                        value={(recordingTime / selectedTechnique.duration) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quality Score Overlay */}
            {qualityScore && !isRecording && (
              <div className="absolute top-4 right-4">
                <Badge
                  variant={
                    qualityScore >= 85
                      ? 'default'
                      : qualityScore >= 70
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  Quality: {qualityScore}%
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 justify-center">
            {!recordedBlob ? (
              <>
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!selectedTechnique}
                  size="lg"
                  variant={isRecording ? 'destructive' : 'default'}
                >
                  {isRecording ? (
                    <>
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Video className="h-5 w-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={resetRecording} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Record Again
                </Button>
                <Button onClick={uploadVideo} disabled={isUploading} className="flex-1">
                  {isUploading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Uploading {uploadProgress.toFixed(0)}%
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload for Analysis
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {isUploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technique Instructions */}
      {selectedTechnique && !isRecording && (
        <Card>
          <CardHeader>
            <CardTitle>Technique Guide: {selectedTechnique.technique}</CardTitle>
            <CardDescription>
              Recording Duration: {selectedTechnique.duration} seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedTechnique.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm">{instruction}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Recording Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Ensure good lighting for best analysis quality
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Keep phone steady and at appropriate distance
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Follow the step-by-step guidance for best results
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              Recording will stop automatically after technique duration
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
