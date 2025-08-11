'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Play, Pause, RotateCw, Check, X } from 'lucide-react';

interface MobileVideoRecorderProps {
  onVideoRecorded: (videoBlob: Blob) => void;
  onCancel: () => void;
}

export function MobileVideoRecorder({ onVideoRecorded, onCancel }: MobileVideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true
      });
      
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  const startRecording = () => {
    if (!mediaStream) return;

    const mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: 'video/mp4; codecs=avc1.42E01E,mp4a.40.2'
    });
    
    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      setRecordedVideo(blob);
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    
    // Start timer
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    if (recordedVideo) {
      onVideoRecorded(recordedVideo);
    }
  };

  const handleRetake = () => {
    setRecordedVideo(null);
    setRecordingTime(0);
    startCamera();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-white">
          <X className="w-5 h-5" />
        </Button>
        <div className="text-white font-medium">
          {recordedVideo ? 'Review Video' : 'Record Video'}
        </div>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Video Preview */}
      <div className="flex-1 relative overflow-hidden">
        {recordedVideo ? (
          <video
            src={URL.createObjectURL(recordedVideo)}
            className="w-full h-full object-cover"
            controls
            playsInline
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        )}
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">REC {formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/50">
        {recordedVideo ? (
          <div className="flex items-center justify-center gap-6">
            <Button
              variant="outline"
              size="lg"
              onClick={handleRetake}
              className="bg-white/10 border-white/20 text-white"
            >
              <RotateCw className="w-5 h-5 mr-2" />
              Retake
            </Button>
            <Button
              size="lg"
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="w-5 h-5 mr-2" />
              Use Video
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-8">
            <Button
              variant="outline"
              size="lg"
              onClick={toggleCamera}
              className="bg-white/10 border-white/20 text-white"
            >
              <RotateCw className="w-6 h-6" />
            </Button>
            
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRecording ? (
                <div className="w-6 h-6 bg-white rounded-sm" />
              ) : (
                <div className="w-8 h-8 bg-white rounded-full" />
              )}
            </Button>
            
            <div className="w-16" /> {/* Spacer for symmetry */}
          </div>
        )}
      </div>
    </div>
  );
}

// Mobile-optimized video upload component
export function MobileVideoUpload({ onVideoUploaded }: { onVideoUploaded: (file: File) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onVideoUploaded(file);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6 text-center space-y-4">
        <div className="text-slate-400 mb-4">
          <Upload className="w-12 h-12 mx-auto mb-2" />
          <p>Upload a video from your device</p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Choose Video File
        </Button>
      </CardContent>
    </Card>
  );
}

// Mobile-friendly progress indicator
export function MobileProgressIndicator({ steps, currentStep }: { steps: string[], currentStep: number }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            index < currentStep 
              ? 'bg-green-500 text-white' 
              : index === currentStep 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-600 text-slate-300'
          }`}>
            {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-8 h-0.5 ${
              index < currentStep ? 'bg-green-500' : 'bg-slate-600'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}