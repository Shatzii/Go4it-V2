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
import { PlusCircle, Pencil, Trash2, Save } from "lucide-react";
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
import { ContentBlock } from "@/modules/cms/types";

// Form for creating/editing a content block
const ContentBlockForm = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}: { 
  initialData?: ContentBlock; 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
}) => {
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      identifier: "",
      title: "",
      content: "",
      format: "html",
      section: "",
      active: true,
      sortOrder: 0
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <Label htmlFor="identifier">Identifier</Label>
            <Input
              id="identifier"
              {...register("identifier", { required: "Identifier is required" })}
              className="mt-1"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier.message as string}</p>
            )}
          </div>

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
            <Label htmlFor="format">Format</Label>
            <Select 
              defaultValue={initialData?.format || "html"} 
              onValueChange={(value) => setValue("format", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="section">Section</Label>
            <Input
              id="section"
              {...register("section", { required: "Section is required" })}
              placeholder="e.g., hero, features, testimonials"
              className="mt-1"
            />
            {errors.section && (
              <p className="text-red-500 text-sm mt-1">{errors.section.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
              placeholder="0"
              className="mt-1"
            />
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
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Content Block
        </Button>
      </div>
    </form>
  );
};

// Main ContentBlockManager component
export default function ContentBlockManager() {
  const [editingContentBlock, setEditingContentBlock] = useState<ContentBlock | null>(null);
  const [isCreatingContentBlock, setIsCreatingContentBlock] = useState(false);
  const { toast } = useToast();

  // Query for content blocks
  const { data: contentBlocks = [], isLoading } = useQuery({
    queryKey: ['/api/content-blocks'],
    queryFn: async () => {
      const response = await fetch('/api/content-blocks');
      if (!response.ok) {
        throw new Error('Failed to fetch content blocks');
      }
      return response.json();
    }
  });

  // Mutation for creating a content block
  const createContentBlockMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/content-blocks', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
      setIsCreatingContentBlock(false);
      toast({
        title: "Success",
        description: "Content block created successfully"
      });
    }
  });

  // Mutation for updating a content block
  const updateContentBlockMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/content-blocks/${id}`, {
        method: 'PATCH',
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
      setEditingContentBlock(null);
      toast({
        title: "Success",
        description: "Content block updated successfully"
      });
    }
  });

  // Mutation for deleting a content block
  const deleteContentBlockMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/content-blocks/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
      toast({
        title: "Success",
        description: "Content block deleted successfully"
      });
    }
  });

  // Handle creating a new content block
  const handleCreateContentBlock = (data: any) => {
    createContentBlockMutation.mutate(data);
  };

  // Handle updating a content block
  const handleUpdateContentBlock = (data: any) => {
    if (editingContentBlock) {
      updateContentBlockMutation.mutate({ id: editingContentBlock.id, data });
    }
  };

  // Handle deleting a content block
  const handleDeleteContentBlock = (id: number) => {
    if (confirm("Are you sure you want to delete this content block? This action cannot be undone.")) {
      deleteContentBlockMutation.mutate(id);
    }
  };

  // Group content blocks by section
  const contentBlocksBySection = contentBlocks.reduce((acc: Record<string, ContentBlock[]>, block: ContentBlock) => {
    const section = block.section || 'Uncategorized';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(block);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {isCreatingContentBlock ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Content Block</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentBlockForm
              initialData={undefined}
              onSubmit={handleCreateContentBlock}
              onCancel={() => setIsCreatingContentBlock(false)}
            />
          </CardContent>
        </Card>
      ) : editingContentBlock ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Content Block</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentBlockForm
              initialData={editingContentBlock}
              onSubmit={handleUpdateContentBlock}
              onCancel={() => setEditingContentBlock(null)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Content Blocks</h2>
            <Button onClick={() => setIsCreatingContentBlock(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Block
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center p-6">Loading content blocks...</div>
          ) : contentBlocks.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Content Blocks Found</CardTitle>
                <CardDescription>
                  Content blocks are reusable pieces of content that can be displayed anywhere on the site.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Create your first content block to get started with the CMS system.
                </p>
                <Button onClick={() => setIsCreatingContentBlock(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Content Block
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(contentBlocksBySection).map(([section, blocks]) => (
                <Card key={section}>
                  <CardHeader>
                    <CardTitle>{section}</CardTitle>
                    <CardDescription>
                      {blocks.length} content block{blocks.length !== 1 && 's'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Identifier</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Format</TableHead>
                          <TableHead>Active</TableHead>
                          <TableHead>Order</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blocks.map((block) => (
                          <TableRow key={block.id}>
                            <TableCell>{block.id}</TableCell>
                            <TableCell className="font-medium">{block.identifier}</TableCell>
                            <TableCell>{block.title}</TableCell>
                            <TableCell>{block.format}</TableCell>
                            <TableCell>{block.active ? "Yes" : "No"}</TableCell>
                            <TableCell>{block.sortOrder || 0}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingContentBlock(block)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteContentBlock(block.id)}
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
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}