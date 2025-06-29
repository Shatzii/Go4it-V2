import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface VideoUploaderProps {
  onVideoSelected: (file: File) => void;
  onUploadComplete?: (videoUrl: string) => void;
  sportTypes?: string[];
}

export function VideoUploader({ 
  onVideoSelected, 
  onUploadComplete,
  sportTypes = ['Basketball', 'Football', 'Soccer', 'Baseball', 'Volleyball', 'Track', 'Other']
}: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a video file');
      }
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a video file');
      }
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    if (!selectedSport) {
      setError('Please select a sport type');
      return;
    }

    setIsUploading(true);
    setError(null);

    // Simulate upload process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadComplete(true);
        
        // Call the onVideoSelected callback with the selected file
        onVideoSelected(selectedFile);
        
        // Simulate getting a URL back from the server
        const mockVideoUrl = URL.createObjectURL(selectedFile);
        if (onUploadComplete) {
          onUploadComplete(mockVideoUrl);
        }
      }
    }, 200);
  }, [selectedFile, selectedSport, onVideoSelected, onUploadComplete]);

  const resetUploader = useCallback(() => {
    setSelectedFile(null);
    setUploadProgress(0);
    setSelectedSport('');
    setError(null);
    setIsUploading(false);
    setUploadComplete(false);
  }, []);

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50 bg-opacity-10' 
              : 'border-gray-600 hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('video-input')?.click()}
        >
          <input
            id="video-input"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="w-10 h-10 mx-auto mb-3 text-blue-500" />
          <p className="font-medium mb-2">Drag and drop your video file here</p>
          <p className="text-sm text-gray-400">Or click to browse</p>
          <p className="text-xs mt-2 text-gray-500">
            Supported formats: MP4, MOV, AVI (max 500MB)
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-900 rounded flex items-center justify-center">
                <video width="100%" height="100%" className="rounded">
                  <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                </video>
              </div>
              <div>
                <p className="font-medium truncate max-w-[220px] sm:max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {!uploadComplete && (
              <button 
                onClick={resetUploader}
                className="p-1 text-gray-400 hover:text-white"
                aria-label="Remove file"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {!uploadComplete && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="sport-type">
                  Sport Type
                </label>
                <select
                  id="sport-type"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUploading}
                >
                  <option value="">Select a sport</option>
                  {sportTypes.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>

              {isUploading ? (
                <div>
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleUpload}
                  disabled={!selectedSport}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                    selectedSport
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-700 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Upload Video for Analysis
                </button>
              )}
            </>
          )}

          {uploadComplete && (
            <div className="flex items-center justify-center py-2 text-green-400 gap-2">
              <CheckCircle2 size={20} />
              <span>Upload complete! Preparing analysis...</span>
            </div>
          )}

          {error && (
            <div className="mt-3 text-red-500 flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}