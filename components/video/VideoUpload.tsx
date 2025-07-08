'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Play, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoUploadProps {
  onUpload: (file: File) => Promise<void>;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
}

export function VideoUpload({ 
  onUpload, 
  maxSize = 100, 
  acceptedFormats = ['video/mp4', 'video/webm', 'video/quicktime'],
  className 
}: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setUploadStatus('error');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadStatus('error');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    setUploadStatus('idle');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
      console.error('Upload failed:', error);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-600 hover:border-slate-500'
          )}
        >
          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Upload your training video
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Drag and drop your video here, or click to select
          </p>
          <input
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileInput}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="inline-flex items-center px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors"
          >
            Select Video
          </label>
          <p className="text-xs text-slate-500 mt-2">
            Supports MP4, WebM, MOV up to {maxSize}MB
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Video Preview */}
          <div className="relative bg-slate-800 rounded-lg overflow-hidden">
            {previewUrl && (
              <video
                src={previewUrl}
                controls
                className="w-full h-64 object-cover"
              >
                Your browser does not support the video tag.
              </video>
            )}
            <button
              onClick={resetUpload}
              className="absolute top-2 right-2 p-1 bg-slate-900/80 rounded-full text-white hover:bg-slate-900 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* File Info */}
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">
                {selectedFile.name}
              </span>
              <span className="text-xs text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
            
            {/* Upload Progress */}
            {uploadStatus === 'uploading' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Uploading...</span>
                  <span className="text-xs text-slate-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploadStatus === 'uploading'}
              className={cn(
                'w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                uploadStatus === 'success'
                  ? 'bg-green-600 text-white'
                  : uploadStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
              )}
            >
              {uploadStatus === 'uploading' && (
                <span>Uploading...</span>
              )}
              {uploadStatus === 'success' && (
                <span className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Upload Complete
                </span>
              )}
              {uploadStatus === 'error' && (
                <span>Upload Failed - Try Again</span>
              )}
              {uploadStatus === 'idle' && (
                <span>Analyze Video</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}