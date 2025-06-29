import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video, Camera, StopCircle, RefreshCw, Upload, Film } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoRecorderProps {
  onVideoSaved?: (videoBlob: Blob, metadata: { title: string; description: string }) => void;
  showControls?: boolean;
}

export default function VideoRecorder({ onVideoSaved, showControls = true }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedCamera, setSelectedCamera] = useState<string>('user');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  // Get available cameras
  useEffect(() => {
    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(cameras);
      } catch (error) {
        console.error('Error getting cameras:', error);
      }
    }
    getCameras();
  }, []);

  // Initialize camera
  useEffect(() => {
    if (!isPreviewing) {
      initializeCamera();
    }

    return () => {
      stopMediaTracks();
    };
  }, [selectedCamera, isPreviewing]);

  // Initialize camera
  const initializeCamera = async () => {
    try {
      stopMediaTracks();
      setCameraError(null);

      const constraints = {
        audio: true,
        video: {
          facingMode: selectedCamera
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setCameraError('Failed to access camera. Please ensure you have given camera permissions.');
      stopMediaTracks();
    }
  };

  // Stop media tracks
  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start recording countdown
  const startCountdown = () => {
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          startRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start recording
  const startRecording = () => {
    if (!streamRef.current) {
      toast({
        title: "Camera Error",
        description: "Camera not available. Please refresh and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsRecording(true);
    setRecordingTime(0);

    // Start timer
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    chunksRef.current = [];
    const options = { mimeType: 'video/webm; codecs=vp9' };
    
    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
    } catch (e) {
      // Fallback for unsupported mimeType
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
    }

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setVideoBlob(blob);
      setIsPreviewing(true);
      
      if (previewRef.current) {
        previewRef.current.src = URL.createObjectURL(blob);
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    mediaRecorderRef.current.start();
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Reset recording
  const resetRecording = () => {
    setIsPreviewing(false);
    setVideoBlob(null);
    setVideoTitle('');
    setVideoDescription('');
    setIsRecording(false);
    setRecordingTime(0);
    
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current.src);
      previewRef.current.src = '';
    }
  };

  // Save recording
  const saveRecording = async () => {
    if (!videoBlob) {
      toast({
        title: "Error",
        description: "No video recorded yet.",
        variant: "destructive"
      });
      return;
    }

    if (!videoTitle.trim()) {
      toast({
        title: "Missing Info",
        description: "Please enter a title for your video.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      if (onVideoSaved) {
        onVideoSaved(videoBlob, {
          title: videoTitle,
          description: videoDescription
        });
      }

      toast({
        title: "Success",
        description: "Video saved successfully!",
        variant: "default"
      });

      // Reset after successful save
      resetRecording();
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        title: "Error",
        description: "Failed to save video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    setSelectedCamera(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Film className="mr-2 h-5 w-5" />
          {isPreviewing ? 'Video Preview' : 'Record Video'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cameraError && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-4">
            <p>{cameraError}</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={initializeCamera}
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-lg">
          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <span className="text-white text-7xl font-bold animate-pulse">{countdown}</span>
            </div>
          )}

          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black bg-opacity-50 px-3 py-1 rounded-full z-10">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">{formatTime(recordingTime)}</span>
            </div>
          )}

          {/* Main video display */}
          {!isPreviewing ? (
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover" 
              autoPlay 
              playsInline 
              muted
            />
          ) : (
            <video 
              ref={previewRef} 
              className="w-full h-full" 
              controls
              playsInline
            />
          )}
        </div>

        {isPreviewing && showControls && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-title">Video Title</Label>
              <Input 
                id="video-title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter a title for your video"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="video-description">Description (Optional)</Label>
              <Input 
                id="video-description"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Add a description"
                className="mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isPreviewing ? (
          <>
            <div className="flex gap-2">
              {availableCameras.length > 1 && (
                <Button 
                  variant="outline" 
                  onClick={toggleCamera}
                  disabled={isRecording || countdown !== null}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Switch Camera
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {isRecording ? (
                <Button 
                  variant="destructive" 
                  onClick={stopRecording}
                >
                  <StopCircle className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  onClick={startCountdown}
                  disabled={countdown !== null}
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Record
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={resetRecording}
              disabled={isUploading}
            >
              <Camera className="h-4 w-4 mr-1" />
              New Recording
            </Button>
            {showControls && (
              <Button 
                variant="default" 
                onClick={saveRecording}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-1" />
                {isUploading ? 'Saving...' : 'Save Video'}
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}