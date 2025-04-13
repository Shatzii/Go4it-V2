import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import ContentBlockManager from "@/components/admin/ContentBlockManager";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Pencil, Trash2, FilePlus, FileImage, Upload, Save, ImageOff } from "lucide-react";

// Blog post interface
interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  coverImage: string | null;
  authorId: number;
  category: string;
  publishDate: string;
  featured: boolean;
  slug: string;
  tags: string[];
}

// Site image interface
interface SiteImage {
  id: number;
  name: string;
  path: string;
  alt: string;
  location: string; // "logo", "header", "background", etc.
  active: boolean;
  uploadDate: string;
}

// Form for creating/editing a blog post
const BlogPostForm = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}: { 
  initialData?: BlogPost; 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.coverImage || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: "",
      summary: "",
      content: "",
      category: "training",
      featured: false,
      tags: []
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      // First, handle image upload if there's a new image
      let coverImagePath = initialData?.coverImage || null;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('type', 'blog');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const result = await response.json();
        coverImagePath = result.path;
      }
      
      // Then submit the form data with the image path
      await onSubmit({
        ...data, 
        coverImage: coverImagePath,
        slug: data.slug || data.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
      });
    } catch (error) {
      console.error('Error submitting blog post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save blog post. Please try again."
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              className="mt-1"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              {...register("summary", { required: "Summary is required" })}
              className="mt-1"
            />
            {errors.summary && (
              <p className="text-red-500 text-sm mt-1">{errors.summary.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...register("content", { required: "Content is required" })}
              className="mt-1 min-h-[300px]"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message as string}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              defaultValue={initialData?.category || "training"} 
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="recruiting">Recruiting</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="ncaa">NCAA</SelectItem>
                <SelectItem value="success-stories">Success Stories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="slug">URL Slug (optional)</Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="auto-generated-from-title"
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Leave blank to auto-generate from title
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={watch("featured")}
              onCheckedChange={(checked) => setValue("featured", checked)}
            />
            <Label htmlFor="featured">Featured Post</Label>
          </div>

          <div>
            <Label>Cover Image</Label>
            <div className="mt-1 border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="mx-auto max-h-40 object-contain"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    <ImageOff className="h-4 w-4 mr-2" />
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <FileImage className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="text-sm text-gray-400">
                    Click to upload a cover image
                  </p>
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="coverImage"
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Image
                  </Label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Post
        </Button>
      </div>
    </form>
  );
};

// Form for creating/editing a site image
const SiteImageForm = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}: { 
  initialData?: SiteImage; 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.path || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: "",
      alt: "",
      location: "logo",
      active: true
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      // First, handle image upload if there's a new image
      let imagePath = initialData?.path || null;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('type', 'site');
        formData.append('location', data.location);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const result = await response.json();
        imagePath = result.path;
      }
      
      if (!imagePath) {
        throw new Error('Image is required');
      }
      
      // Then submit the form data with the image path
      await onSubmit({
        ...data, 
        path: imagePath
      });
    } catch (error) {
      console.error('Error submitting site image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save image. Please try again."
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              className="mt-1"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              {...register("alt", { required: "Alt text is required for accessibility" })}
              className="mt-1"
            />
            {errors.alt && (
              <p className="text-red-500 text-sm mt-1">{errors.alt.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Select 
              defaultValue={initialData?.location || "logo"} 
              onValueChange={(value) => setValue("location", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="logo">Main Logo</SelectItem>
                <SelectItem value="header">Header Image</SelectItem>
                <SelectItem value="background">Background Image</SelectItem>
                <SelectItem value="footer-logo">Footer Logo</SelectItem>
                <SelectItem value="banner">Banner Image</SelectItem>
                <SelectItem value="icon">Site Icon/Favicon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={watch("active")}
              onCheckedChange={(checked) => setValue("active", checked)}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </div>

        <div>
          <Label>Image</Label>
          <div className="mt-1 border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
            {imagePreview ? (
              <div className="space-y-2">
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="mx-auto max-h-40 object-contain"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                >
                  <ImageOff className="h-4 w-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <FileImage className="mx-auto h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-400">
                  Click to upload an image
                </p>
                <Input
                  id="siteImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label
                  htmlFor="siteImage"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Image
                </Label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Image
        </Button>
      </div>
    </form>
  );
};

export default function ContentManager() {
  const [activeTab, setActiveTab] = useState("blog-posts");
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [editingSiteImage, setEditingSiteImage] = useState<SiteImage | null>(null);
  const [isCreatingBlogPost, setIsCreatingBlogPost] = useState(false);
  const [isCreatingSiteImage, setIsCreatingSiteImage] = useState(false);

  // Query for blog posts
  const { data: blogPosts = [], isLoading: isLoadingBlogPosts } = useQuery({
    queryKey: ['/api/blog-posts', 'admin'],
    queryFn: async () => {
      const response = await fetch('/api/blog-posts?limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json();
    }
  });

  // Query for site images
  const { data: siteImages = [], isLoading: isLoadingSiteImages } = useQuery({
    queryKey: ['/api/site-images'],
    queryFn: async () => {
      const response = await fetch('/api/site-images');
      if (!response.ok) {
        throw new Error('Failed to fetch site images');
      }
      return response.json();
    }
  });

  // Mutation for creating a blog post
  const createBlogPostMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/blog-posts', {
        method: 'POST',
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setIsCreatingBlogPost(false);
      toast({
        title: "Success",
        description: "Blog post created successfully"
      });
    }
  });

  // Mutation for updating a blog post
  const updateBlogPostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/blog-posts/${id}`, {
        method: 'PATCH',
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setEditingBlogPost(null);
      toast({
        title: "Success",
        description: "Blog post updated successfully"
      });
    }
  });

  // Mutation for deleting a blog post
  const deleteBlogPostMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/blog-posts/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully"
      });
    }
  });

  // Mutation for creating a site image
  const createSiteImageMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/site-images', {
        method: 'POST',
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-images'] });
      setIsCreatingSiteImage(false);
      toast({
        title: "Success",
        description: "Site image created successfully"
      });
    }
  });

  // Mutation for updating a site image
  const updateSiteImageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/site-images/${id}`, {
        method: 'PATCH',
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-images'] });
      setEditingSiteImage(null);
      toast({
        title: "Success",
        description: "Site image updated successfully"
      });
    }
  });

  // Mutation for deleting a site image
  const deleteSiteImageMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/site-images/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-images'] });
      toast({
        title: "Success",
        description: "Site image deleted successfully"
      });
    }
  });

  // Handle creating a new blog post
  const handleCreateBlogPost = (data: any) => {
    createBlogPostMutation.mutate(data);
  };

  // Handle updating a blog post
  const handleUpdateBlogPost = (data: any) => {
    if (editingBlogPost) {
      updateBlogPostMutation.mutate({ id: editingBlogPost.id, data });
    }
  };

  // Handle creating a new site image
  const handleCreateSiteImage = (data: any) => {
    createSiteImageMutation.mutate(data);
  };

  // Handle updating a site image
  const handleUpdateSiteImage = (data: any) => {
    if (editingSiteImage) {
      updateSiteImageMutation.mutate({ id: editingSiteImage.id, data });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Management System</h1>
        <p className="text-lg text-muted-foreground">
          Manage your website content, blog posts, and images.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full bg-gray-900 border border-gray-800">
          <TabsTrigger value="blog-posts" className="flex-1">Blog Posts</TabsTrigger>
          <TabsTrigger value="content-blocks" className="flex-1">Content Blocks</TabsTrigger>
          <TabsTrigger value="site-images" className="flex-1">Site Images</TabsTrigger>
        </TabsList>

        {/* Blog Posts Tab */}
        <TabsContent value="blog-posts" className="space-y-6">
          {isCreatingBlogPost ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New Blog Post</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogPostForm
                  initialData={null}
                  onSubmit={handleCreateBlogPost}
                  onCancel={() => setIsCreatingBlogPost(false)}
                />
              </CardContent>
            </Card>
          ) : editingBlogPost ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Blog Post</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogPostForm
                  initialData={editingBlogPost}
                  onSubmit={handleUpdateBlogPost}
                  onCancel={() => setEditingBlogPost(null)}
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-end">
                <Button onClick={() => setIsCreatingBlogPost(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Post
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Blog Posts</CardTitle>
                  <CardDescription>
                    Manage and edit your blog posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingBlogPosts ? (
                    <div className="text-center py-4">Loading blog posts...</div>
                  ) : blogPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <FilePlus className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium mb-1">No Blog Posts Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create your first blog post to get started
                      </p>
                      <Button onClick={() => setIsCreatingBlogPost(true)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create New Post
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {blogPosts.map((post) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-medium">{post.title}</TableCell>
                              <TableCell>{post.category}</TableCell>
                              <TableCell>{formatDate(post.publishDate)}</TableCell>
                              <TableCell>{post.featured ? "Yes" : "No"}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingBlogPost(post)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm("Are you sure you want to delete this post?")) {
                                        deleteBlogPostMutation.mutate(post.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Site Images Tab */}
        <TabsContent value="site-images" className="space-y-6">
          {isCreatingSiteImage ? (
            <Card>
              <CardHeader>
                <CardTitle>Upload New Site Image</CardTitle>
              </CardHeader>
              <CardContent>
                <SiteImageForm
                  initialData={null}
                  onSubmit={handleCreateSiteImage}
                  onCancel={() => setIsCreatingSiteImage(false)}
                />
              </CardContent>
            </Card>
          ) : editingSiteImage ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Site Image</CardTitle>
              </CardHeader>
              <CardContent>
                <SiteImageForm
                  initialData={editingSiteImage}
                  onSubmit={handleUpdateSiteImage}
                  onCancel={() => setEditingSiteImage(null)}
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-end">
                <Button onClick={() => setIsCreatingSiteImage(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Upload New Image
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Site Images</CardTitle>
                  <CardDescription>
                    Manage logos, banners, and other site images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSiteImages ? (
                    <div className="text-center py-4">Loading site images...</div>
                  ) : siteImages.length === 0 ? (
                    <div className="text-center py-8">
                      <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium mb-1">No Site Images Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload your first image to get started
                      </p>
                      <Button onClick={() => setIsCreatingSiteImage(true)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Upload New Image
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {siteImages.map((image) => (
                        <Card key={image.id} className="overflow-hidden">
                          <div className="aspect-video flex items-center justify-center p-4 bg-gray-900">
                            <img
                              src={image.path}
                              alt={image.alt}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <CardContent className="pt-4">
                            <h3 className="font-medium">{image.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Location: {image.location}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                image.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                              }`}>
                                {image.active ? "Active" : "Inactive"}
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingSiteImage(image)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this image?")) {
                                      deleteSiteImageMutation.mutate(image.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Content Blocks Tab */}
        <TabsContent value="content-blocks" className="space-y-6">
          <ContentBlockManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}