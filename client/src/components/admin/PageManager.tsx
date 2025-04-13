import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Pencil, Trash2, Save, Calendar, ListTree } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageData, PageComponent } from "@/modules/cms/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageComponentEditor from "./PageComponentEditor";

// Form for creating/editing a page
const PageForm = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}: { 
  initialData?: PageData; 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
}) => {
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      slug: "",
      title: "",
      description: "",
      content: "",
      active: true,
      components: [],
      metadata: {}
    }
  });

  const [publishDate, setPublishDate] = useState<Date | undefined>(
    initialData?.publishDate ? new Date(initialData.publishDate) : undefined
  );
  
  const [components, setComponents] = useState<PageComponent[]>(
    initialData?.components || []
  );
  
  // Update components in the form data
  const handleComponentsChange = (newComponents: PageComponent[]) => {
    setComponents(newComponents);
    setValue("components", newComponents);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-1">
            <ListTree className="h-4 w-4" />
            Components {components.length > 0 && `(${components.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
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
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  {...register("slug", { 
                    required: "Slug is required",
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: "Slug can only contain lowercase letters, numbers, and hyphens"
                    }
                  })}
                  placeholder="page-url-slug"
                  className="mt-1"
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">{errors.slug.message as string}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description (SEO)</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  className="mt-1"
                  placeholder="A brief description for search engines and social media"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="className">CSS Class Name</Label>
                <Input
                  id="className"
                  {...register("className")}
                  placeholder="custom-page-class"
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {publishDate ? format(publishDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={publishDate}
                      onSelect={(date) => {
                        setPublishDate(date);
                        setValue("publishDate", date);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="active"
                  checked={watch("active")}
                  onCheckedChange={(checked) => setValue("active", checked)}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="pt-6">
          <div>
            <Label htmlFor="content">Main Content (HTML)</Label>
            <div className="mt-2 mb-4 text-sm text-muted-foreground">
              This is the main page content that appears before any components.
            </div>
            <Textarea
              id="content"
              {...register("content")}
              className="min-h-[400px] font-mono text-sm"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="components" className="pt-6">
          <div>
            <PageComponentEditor 
              components={components}
              onChange={handleComponentsChange}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Page
        </Button>
      </div>
    </form>
  );
};

// Main PageManager component
export default function PageManager() {
  const [editingPage, setEditingPage] = useState<PageData | null>(null);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const { toast } = useToast();

  // Query for pages
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['/api/pages'],
    queryFn: async () => {
      const response = await fetch('/api/pages');
      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }
      return response.json();
    }
  });

  // Mutation for creating a page
  const createPageMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/pages', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      setIsCreatingPage(false);
      toast({
        title: "Success",
        description: "Page created successfully"
      });
    }
  });

  // Mutation for updating a page
  const updatePageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest('PATCH', `/api/pages/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      setEditingPage(null);
      toast({
        title: "Success",
        description: "Page updated successfully"
      });
    }
  });

  // Mutation for deleting a page
  const deletePageMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      toast({
        title: "Success",
        description: "Page deleted successfully"
      });
    }
  });

  // Handle creating a new page
  const handleCreatePage = (data: any) => {
    createPageMutation.mutate(data);
  };

  // Handle updating a page
  const handleUpdatePage = (data: any) => {
    if (editingPage) {
      updatePageMutation.mutate({ id: editingPage.id, data });
    }
  };

  // Handle deleting a page
  const handleDeletePage = (id: number) => {
    if (confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      deletePageMutation.mutate(id);
    }
  };

  // Format date for display
  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      {isCreatingPage ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Page</CardTitle>
          </CardHeader>
          <CardContent>
            <PageForm
              initialData={undefined}
              onSubmit={handleCreatePage}
              onCancel={() => setIsCreatingPage(false)}
            />
          </CardContent>
        </Card>
      ) : editingPage ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Page</CardTitle>
          </CardHeader>
          <CardContent>
            <PageForm
              initialData={editingPage}
              onSubmit={handleUpdatePage}
              onCancel={() => setEditingPage(null)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Pages</h2>
            <Button onClick={() => setIsCreatingPage(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Page
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center p-6">Loading pages...</div>
          ) : pages.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Pages Found</CardTitle>
                <CardDescription>
                  Pages are the foundation of your site structure.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Create your first page to get started with the CMS system.
                </p>
                <Button onClick={() => setIsCreatingPage(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Page
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Pages</CardTitle>
                <CardDescription>
                  {pages.length} page{pages.length !== 1 && 's'} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Components</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages.map((page: PageData) => (
                      <TableRow key={page.id}>
                        <TableCell>{page.id}</TableCell>
                        <TableCell className="font-medium">{page.title || 'Untitled'}</TableCell>
                        <TableCell>{page.slug}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${page.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {page.active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(page.publishDate)}</TableCell>
                        <TableCell>{page.components?.length || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingPage(page)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePage(page.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}