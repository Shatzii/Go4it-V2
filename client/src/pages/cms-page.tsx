import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, Trash2, AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Redirect } from "wouter";

interface Image {
  url: string;
  path: string;
  filename: string;
  category: string;
}

function ImageUploader({ category = 'images', onUploadSuccess }: { category?: string, onUploadSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        setFile(null);
        return;
      }
      
      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);
      
      // Simulated progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      const response = await fetch('/api/cms/images/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      setUploadProgress(100);
      setSuccess(true);
      
      // Clear the form after success
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
        setSuccess(false);
        setUploading(false);
        
        // Invalidate query cache
        queryClient.invalidateQueries({ queryKey: ['/api/cms/images'] });
        
        // Call onUploadSuccess callback if provided
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully.",
        });
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
      setUploading(false);
      setUploadProgress(0);
      
      toast({
        title: "Upload failed",
        description: err.message || 'Failed to upload image',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border border-gray-800 rounded-md p-4 bg-gray-950">
      <div className="mb-4">
        <Label htmlFor="image-upload">Select Image</Label>
        <div className="mt-2 flex items-center">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1 bg-gray-900 text-gray-300"
            disabled={uploading}
          />
        </div>
      </div>
      
      {file && (
        <div className="mb-4">
          <p className="text-sm text-gray-400">
            {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
          <div className="mt-1 h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 flex items-center text-red-500">
          <AlertCircle className="h-4 w-4 mr-2" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 flex items-center text-green-500">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          <p className="text-sm">Upload successful!</p>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button
          onClick={uploadFile}
          disabled={!file || uploading}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function ImageGallery({ category }: { category?: string }) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();

  const { 
    data: images = [], 
    isLoading, 
    error,
    refetch
  } = useQuery<Image[]>({
    queryKey: ['/api/cms/images', category],
    queryFn: async () => {
      const url = category 
        ? `/api/cms/images?category=${encodeURIComponent(category)}`
        : '/api/cms/images';
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      return response.json();
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imagePath: string) => {
      const response = await fetch(`/api/cms/images/${imagePath}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete image');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Image deleted",
        description: "The image has been deleted successfully.",
      });
      
      // Refetch the images list
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message || 'Failed to delete image',
        variant: "destructive",
      });
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(true);
        toast({
          title: "Copied to clipboard",
          description: "Image URL has been copied to clipboard.",
        });
        
        setTimeout(() => setCopySuccess(false), 2000);
      },
      () => {
        toast({
          title: "Copy failed",
          description: "Failed to copy URL to clipboard.",
          variant: "destructive",
        });
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40 text-red-500">
        <AlertCircle className="h-6 w-6 mr-2" />
        <p>Error loading images: {error.message}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-40 border border-dashed border-gray-700 rounded-md bg-gray-950/50">
        <ImageIcon className="h-10 w-10 text-gray-600 mb-2" />
        <p className="text-gray-400">No images found in this category</p>
        <p className="text-gray-500 text-sm">Upload images to see them here</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div 
            key={image.url} 
            className="relative group overflow-hidden border border-gray-800 rounded-md bg-gray-950 hover:border-blue-500 transition-all"
          >
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={image.url} 
                alt={image.filename} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedImage(image)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-xs text-white truncate w-full">{image.filename}</p>
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => deleteImageMutation.mutate(image.path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <Dialog open={Boolean(selectedImage)} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="bg-gray-950 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Image Details</DialogTitle>
              <DialogDescription>
                View and manage the selected image
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col space-y-4">
              <div className="overflow-hidden rounded-md border border-gray-800">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.filename} 
                  className="w-full h-auto max-h-64 object-contain"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image-url">Image URL</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="image-url" 
                    value={selectedImage.url} 
                    readOnly 
                    className="bg-gray-900 text-gray-300"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(selectedImage.url)}
                    className="border-gray-700 hover:bg-gray-800"
                  >
                    {copySuccess ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  <p>Category: {selectedImage.category}</p>
                  <p>Filename: {selectedImage.filename}</p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                onClick={() => {
                  deleteImageMutation.mutate(selectedImage.path);
                  setSelectedImage(null);
                }}
                disabled={deleteImageMutation.isPending}
              >
                {deleteImageMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function CMSPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("profiles");
  
  // Redirect if not authenticated or not admin
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  if (user.role !== "admin") {
    return <Redirect to="/" />;
  }

  return (
    <div className="container max-w-6xl pt-6 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Content Management System
        </h1>
        <p className="text-gray-400">
          Upload and manage images for your website. These images can be used for athlete profiles, blog posts, and featured content.
        </p>
      </div>
      
      <Tabs defaultValue="image-manager" className="w-full">
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger 
            value="image-manager" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
          >
            Image Manager
          </TabsTrigger>
          <TabsTrigger 
            value="athlete-profiles" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
          >
            Athlete Profiles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="image-manager" className="space-y-6">
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Upload Images</CardTitle>
              <CardDescription>
                Upload images for different sections of the website
              </CardDescription>
              
              <div className="mt-4">
                <Label htmlFor="category-select">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category-select" className="bg-gray-900 border-gray-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="profiles">Athlete Profiles</SelectItem>
                    <SelectItem value="athlete_headshots">Athlete Headshots</SelectItem>
                    <SelectItem value="athlete_action">Athlete Action Shots</SelectItem>
                    <SelectItem value="blog">Blog Posts</SelectItem>
                    <SelectItem value="featured">Featured Content</SelectItem>
                    <SelectItem value="banners">Banners</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              <ImageUploader category={selectedCategory} />
            </CardContent>
          </Card>
          
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Image Gallery</CardTitle>
              <CardDescription>
                View, copy, and manage your uploaded images
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <ImageGallery category={selectedCategory} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="athlete-profiles" className="space-y-6">
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Athlete Profile Images</CardTitle>
              <CardDescription>
                Manage profile and action images for featured athletes
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Profile Headshots</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Upload high-quality headshots for athlete profiles. Recommended size: 500x500px, square format.
                  </p>
                  <ImageUploader category="athlete_headshots" />
                  <div className="mt-6">
                    <ImageGallery category="athlete_headshots" />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-medium text-white mb-2">Action Shots</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Upload action photos for athlete profile banners. Recommended size: 1200x400px, landscape format.
                  </p>
                  <ImageUploader category="athlete_action" />
                  <div className="mt-6">
                    <ImageGallery category="athlete_action" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-950 border-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Manage Featured Athletes</CardTitle>
              <CardDescription>
                Update featured athletes displayed on the homepage
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col space-y-4">
                <p className="text-gray-400">
                  Select which athletes to feature on the homepage carousel. You can feature up to 8 athletes.
                </p>
                
                <div className="bg-gray-900 border border-gray-800 rounded-md p-6 flex flex-col items-center justify-center">
                  <div className="text-gray-500 mb-4 flex flex-col items-center">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 mb-2"
                    >
                      Manage Featured Athletes
                    </Button>
                    <p className="text-sm">Use the dedicated interface to select and order featured athletes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}