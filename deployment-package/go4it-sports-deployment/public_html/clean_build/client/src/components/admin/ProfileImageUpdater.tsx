import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { apiRequest } from '@/lib/queryClient';

interface ProfileImageUpdaterProps {
  userId: number;
  username: string;
  currentImageUrl?: string;
  onSuccess?: (updatedUser: any) => void;
}

const ProfileImageUpdater = ({ userId, username, currentImageUrl, onSuccess }: ProfileImageUpdaterProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a valid image file (JPEG, PNG, JPG, GIF)',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image file smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Reset status
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select an image file to upload',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create form data
      const formData = new FormData();
      formData.append('profileImage', selectedFile);
      formData.append('userId', userId.toString());

      // Make API request
      const response = await axios.post(
        '/api/admin/users/profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Handle success
      setUploadSuccess(true);
      toast({
        title: 'Profile image updated',
        description: `Successfully updated profile image for ${username}`,
        variant: 'default',
      });

      // Call onSuccess callback if provided
      if (onSuccess && response.data.user) {
        onSuccess(response.data.user);
      }
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'Failed to upload profile image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const imageUrl = previewUrl || currentImageUrl || '/assets/images/default-profile.png';

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Update Profile Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary mb-4">
            <img 
              src={imageUrl} 
              alt={`${username}'s profile`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = '/assets/images/default-profile.png';
              }}
            />
            {uploadSuccess && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <Check className="text-green-500 w-10 h-10" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">{username}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-image">Select new profile image</Label>
          <Input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-xs text-gray-500">
            Supported formats: JPEG, PNG, GIF. Max size: 5MB.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading || uploadSuccess}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : uploadSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Uploaded
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileImageUpdater;