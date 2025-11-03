import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';

interface ProfilePictureUploadProps {
  currentImageUrl?: string | null;
  onUploadSuccess?: (imageUrl: string) => void;
  onDeleteSuccess?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function ProfilePictureUpload({
  currentImageUrl,
  onUploadSuccess,
  onDeleteSuccess,
  size = 'lg',
  className = ''
}: ProfilePictureUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  };

  // Upload file to server
  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      if (imageUrl) {
        formData.append('oldImageUrl', imageUrl);
      }

      const response = await fetch('/api/profile/upload-picture', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setImageUrl(data.imageUrl);
      setPreviewUrl(null);
      setSuccess(true);
      
      if (onUploadSuccess) {
        onUploadSuccess(data.imageUrl);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Delete profile picture
  const handleDelete = async () => {
    if (!imageUrl) return;

    if (!confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile/delete-picture', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Delete failed');
      }

      setImageUrl(null);
      setSuccess(true);
      
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Profile Picture Display */}
      <div className="relative group">
        <div
          className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative`}
        >
          {previewUrl || imageUrl ? (
            <img
              src={previewUrl || imageUrl || ''}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera size={iconSizes[size]} className="text-gray-400" />
          )}

          {/* Upload overlay */}
          {!uploading && (
            <div
              onClick={handleClick}
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <Upload size={iconSizes[size]} className="text-white" />
            </div>
          )}

          {/* Uploading spinner */}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Delete button */}
        {imageUrl && !uploading && (
          <button
            onClick={handleDelete}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
            aria-label="Delete profile picture"
          >
            <X size={16} />
          </button>
        )}

        {/* Success indicator */}
        {success && (
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
            <Check size={16} />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload profile picture"
      />

      {/* Upload button */}
      <button
        onClick={handleClick}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Uploading...
          </>
        ) : (
          <>
            <Upload size={18} />
            {imageUrl ? 'Change Picture' : 'Upload Picture'}
          </>
        )}
      </button>

      {/* Instructions */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
        JPEG, PNG, GIF, or WebP
        <br />
        Maximum size: 5MB
      </p>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg text-sm max-w-xs text-center">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && !error && (
        <div className="px-4 py-2 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-lg text-sm max-w-xs text-center flex items-center gap-2">
          <Check size={16} />
          {imageUrl ? 'Picture updated!' : 'Picture deleted!'}
        </div>
      )}
    </div>
  );
}
