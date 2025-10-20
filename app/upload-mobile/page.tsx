'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Camera,
  Upload,
  Video,
  Image as ImageIcon,
  FileText,
  Smartphone,
  Zap,
  CheckCircle,
  AlertCircle,
  X,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
// Simple toast implementation to avoid build errors
const useToast = () => ({
  toast: ({
    title,
    description,
    variant,
  }: {
    title: string;
    description: string;
    variant?: string;
  }) => {
    console.log(`Toast: ${title} - ${description}`);
    // In a real app, this would show a proper toast notification
  },
});

interface UploadFile {
  id: string;
  file: File;
  type: 'video' | 'image' | 'document';
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  sport?: string;
  description?: string;
}

const SPORTS_OPTIONS = [
  'Football',
  'Basketball',
  'Soccer',
  'Baseball',
  'Softball',
  'Tennis',
  'Golf',
  'Track & Field',
  'Swimming',
  'Wrestling',
  'Volleyball',
  'Hockey',
];

export default function MobileUploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadMethod, setUploadMethod] = useState<'camera' | 'file' | 'url'>('camera');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Start camera recording
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: true,
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: 'Camera Access Error',
        description: 'Please allow camera access to record videos',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Start recording
  const startRecording = useCallback(() => {
    if (!mediaStream) return;

    const mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: 'video/webm;codecs=vp8,opus',
    });

    mediaRecorderRef.current = mediaRecorder;
    setRecordedChunks([]);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
      addFileToUpload(file);
    };

    mediaRecorder.start();
    setIsRecording(true);

    // Start timer
    const timer = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    setTimeout(() => {
      if (mediaRecorderRef.current?.state === 'recording') {
        stopRecording();
      }
      clearInterval(timer);
    }, 300000); // 5 minute max recording
  }, [mediaStream, recordedChunks]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  }, [isRecording]);

  // Add file to upload queue
  const addFileToUpload = useCallback((file: File) => {
    const id = Math.random().toString(36).substr(2, 9);
    const type = file.type.startsWith('video')
      ? 'video'
      : file.type.startsWith('image')
        ? 'image'
        : 'document';

    let preview = '';
    if (type === 'image' || type === 'video') {
      preview = URL.createObjectURL(file);
    }

    const newFile: UploadFile = {
      id,
      file,
      type,
      preview,
      progress: 0,
      status: 'pending',
    };

    setFiles((prev) => [...prev, newFile]);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      selectedFiles.forEach(addFileToUpload);
    },
    [addFileToUpload],
  );

  // Handle drag and drop
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const droppedFiles = Array.from(event.dataTransfer.files);
      droppedFiles.forEach(addFileToUpload);
    },
    [addFileToUpload],
  );

  // Update file metadata
  const updateFileMetadata = useCallback((id: string, updates: Partial<UploadFile>) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, ...updates } : file)));
  }, []);

  // Remove file
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  // Upload files
  const uploadFiles = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');

    for (const file of pendingFiles) {
      try {
        updateFileMetadata(file.id, { status: 'uploading' });

        const formData = new FormData();
        formData.append('file', file.file);
        formData.append('sport', file.sport || '');
        formData.append('description', file.description || '');
        formData.append('type', file.type);

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            updateFileMetadata(file.id, { progress });
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            updateFileMetadata(file.id, { status: 'complete', progress: 100 });
            toast({
              title: 'Upload Complete',
              description: `${file.file.name} uploaded successfully`,
            });
          } else {
            updateFileMetadata(file.id, { status: 'error' });
            toast({
              title: 'Upload Failed',
              description: `Failed to upload ${file.file.name}`,
              variant: 'destructive',
            });
          }
        };

        xhr.onerror = () => {
          updateFileMetadata(file.id, { status: 'error' });
          toast({
            title: 'Upload Error',
            description: `Error uploading ${file.file.name}`,
            variant: 'destructive',
          });
        };

        xhr.open('POST', '/api/upload');
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('auth-token')}`);
        xhr.send(formData);
      } catch (error) {
        updateFileMetadata(file.id, { status: 'error' });
        toast({
          title: 'Upload Error',
          description: `Failed to upload ${file.file.name}`,
          variant: 'destructive',
        });
      }
    }
  }, [files, updateFileMetadata, toast]);

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mobile Content Upload</h1>
          <p className="text-slate-300">
            Upload videos, images, and documents directly from your phone
          </p>
        </div>

        {/* Upload Method Selection */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Upload Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={uploadMethod === 'camera' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('camera')}
                className="flex items-center gap-2 h-auto py-4"
              >
                <Camera className="w-5 h-5" />
                <div>
                  <div className="font-medium">Camera</div>
                  <div className="text-xs opacity-70">Record directly</div>
                </div>
              </Button>

              <Button
                variant={uploadMethod === 'file' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('file')}
                className="flex items-center gap-2 h-auto py-4"
              >
                <Upload className="w-5 h-5" />
                <div>
                  <div className="font-medium">File Upload</div>
                  <div className="text-xs opacity-70">Choose from gallery</div>
                </div>
              </Button>

              <Button
                variant={uploadMethod === 'url' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('url')}
                className="flex items-center gap-2 h-auto py-4"
              >
                <Zap className="w-5 h-5" />
                <div>
                  <div className="font-medium">Quick Share</div>
                  <div className="text-xs opacity-70">From other apps</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Camera Recording */}
        {uploadMethod === 'camera' && (
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Video className="w-5 h-5" />
                Camera Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative">
                  {mediaStream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                        <Camera className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                    </div>
                  )}

                  {isRecording && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      REC {formatTime(recordingTime)}
                    </div>
                  )}
                </div>

                {mediaStream && (
                  <div className="flex gap-4 justify-center">
                    {!isRecording ? (
                      <Button
                        onClick={startRecording}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button
                        onClick={stopRecording}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Recording
                      </Button>
                    )}

                    <Button
                      onClick={() => {
                        if (mediaStream) {
                          mediaStream.getTracks().forEach((track) => track.stop());
                          setMediaStream(null);
                        }
                      }}
                      variant="outline"
                      className="border-slate-600 text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Upload */}
        {uploadMethod === 'file' && (
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                File Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-500 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-300 mb-4">Drag and drop files here, or click to select</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="video/*,image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Queue */}
        {files.length > 0 && (
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Upload Queue ({files.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-slate-700 rounded-lg p-4 flex items-center gap-4"
                  >
                    {/* Preview */}
                    <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {file.preview ? (
                        file.type === 'video' ? (
                          <video
                            src={file.preview}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <img
                            src={file.preview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )
                      ) : (
                        <FileText className="w-8 h-8 text-slate-400" />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{file.file.name}</h3>
                      <p className="text-slate-400 text-sm">
                        {(file.file.size / 1024 / 1024).toFixed(1)} MB
                      </p>

                      {/* Progress */}
                      {file.status === 'uploading' && (
                        <Progress value={file.progress} className="mt-2" />
                      )}

                      {/* Metadata */}
                      <div className="flex gap-2 mt-2">
                        <Select
                          value={file.sport}
                          onValueChange={(value) => updateFileMetadata(file.id, { sport: value })}
                        >
                          <SelectTrigger className="w-32 h-8 bg-slate-600 border-slate-500">
                            <SelectValue placeholder="Sport" />
                          </SelectTrigger>
                          <SelectContent>
                            {SPORTS_OPTIONS.map((sport) => (
                              <SelectItem key={sport} value={sport}>
                                {sport}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          placeholder="Description"
                          value={file.description || ''}
                          onChange={(e) =>
                            updateFileMetadata(file.id, { description: e.target.value })
                          }
                          className="flex-1 h-8 bg-slate-600 border-slate-500"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {file.status === 'complete' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {file.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                      {file.status === 'pending' && (
                        <Button
                          onClick={() => removeFile(file.id)}
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {files.some((f) => f.status === 'pending') && (
                <div className="mt-4 flex gap-2">
                  <Button onClick={uploadFiles} className="bg-green-600 hover:bg-green-700 flex-1">
                    Upload All Files
                  </Button>
                  <Button
                    onClick={() => setFiles([])}
                    variant="outline"
                    className="border-slate-600 text-white"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Mobile Tips */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Mobile Upload Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-white">Video Recording</h4>
                <ul className="text-slate-300 space-y-1">
                  <li>• Hold phone horizontally for best quality</li>
                  <li>• Ensure good lighting</li>
                  <li>• Keep camera steady</li>
                  <li>• Maximum 5 minutes per recording</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-white">File Upload</h4>
                <ul className="text-slate-300 space-y-1">
                  <li>• Supported: MP4, MOV, JPG, PNG, PDF</li>
                  <li>• Maximum 100MB per file</li>
                  <li>• Add sport and description for better organization</li>
                  <li>• Multiple files can be uploaded together</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
