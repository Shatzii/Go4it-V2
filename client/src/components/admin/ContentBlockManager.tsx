import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Pencil, Trash2, Save, Eye } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { ContentBlock } from "@/modules/cms/types";

// Form schema for content blocks
const contentBlockSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  title: z.string().min(1, "Title is required"),
  section: z.string().optional(),
  content: z.string().optional(),
  active: z.boolean().default(true),
  type: z.string().default("text"),
  className: z.string().optional(),
  metadata: z.any().optional()
});

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
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(contentBlockSchema),
    defaultValues: initialData || {
      identifier: "",
      title: "",
      section: "",
      content: "",
      active: true,
      type: "text",
      className: "",
      metadata: {}
    }
  });

  const contentType = watch("type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="identifier">Identifier</Label>
          <Input
            id="identifier"
            {...register("identifier")}
            className="mt-1"
            placeholder="unique-content-identifier"
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm mt-1">{errors.identifier.message as string}</p>
          )}
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title")}
            className="mt-1"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>
          )}
        </div>

        <div>
          <Label htmlFor="section">Section</Label>
          <Input
            id="section"
            {...register("section")}
            className="mt-1"
            placeholder="section-name"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Group content blocks by section for easier organization
          </p>
        </div>

        <div>
          <Label htmlFor="type">Content Type</Label>
          <Select 
            value={contentType} 
            onValueChange={(value) => setValue("type", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Content</SelectItem>
              <SelectItem value="html">HTML Content</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="component">React Component</SelectItem>
              <SelectItem value="json">JSON Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="className">CSS Class</Label>
          <Input
            id="className"
            {...register("className")}
            className="mt-1"
            placeholder="custom-block-class"
          />
        </div>

        <div className="flex items-center space-x-2 mt-6">
          <Switch
            id="active"
            checked={watch("active")}
            onCheckedChange={(checked) => setValue("active", checked)}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <div className="mt-2 mb-1 text-sm text-muted-foreground">
          {contentType === "text" && "Plain text content"}
          {contentType === "html" && "HTML content with tags"}
          {contentType === "markdown" && "Markdown formatted content"}
          {contentType === "image" && "Image URL or base64 data"}
          {contentType === "video" && "Video URL or embed code"}
          {contentType === "component" && "Component name or reference"}
          {contentType === "json" && "JSON structured data"}
        </div>
        <Textarea
          id="content"
          {...register("content")}
          className={`mt-1 min-h-[200px] ${contentType === "json" ? "font-mono text-sm" : ""}`}
        />
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

// Content block preview component
const ContentBlockPreview = ({ block }: { block: ContentBlock }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Identifier:</span> {block.identifier}
        </div>
        <div>
          <span className="font-medium">Title:</span> {block.title}
        </div>
        <div>
          <span className="font-medium">Section:</span> {block.section || "None"}
        </div>
        <div>
          <span className="font-medium">Type:</span> {block.type || "text"}
        </div>
        <div>
          <span className="font-medium">Status:</span>{" "}
          <span className={`px-2 py-1 rounded-full text-xs ${block.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {block.active ? "Active" : "Inactive"}
          </span>
        </div>
        {block.className && (
          <div>
            <span className="font-medium">CSS Class:</span> {block.className}
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Content Preview:</h4>
        <div className="border rounded-md p-3 bg-muted/30 overflow-auto max-h-[300px]">
          {block.type === "html" ? (
            <div dangerouslySetInnerHTML={{ __html: block.content || "" }} />
          ) : block.type === "image" ? (
            <img src={block.content} alt={block.title} className="max-w-full h-auto" />
          ) : block.type === "json" ? (
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(JSON.parse(block.content || "{}"), null, 2)}
            </pre>
          ) : (
            <pre className="whitespace-pre-wrap">{block.content}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

// Main ContentBlockManager component
export default function ContentBlockManager() {
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [isCreatingBlock, setIsCreatingBlock] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [filterSection, setFilterSection] = useState<string>("all");
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

  // Get unique sections for filtering
  const sections = ["all", ...Array.from(new Set(contentBlocks.map((block: ContentBlock) => block.section).filter(Boolean)))];

  // Filter blocks by section
  const filteredBlocks = filterSection === "all" 
    ? contentBlocks 
    : contentBlocks.filter((block: ContentBlock) => block.section === filterSection);

  // Mutation for creating a content block
  const createBlockMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/content-blocks', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
      setIsCreatingBlock(false);
      toast({
        title: "Success",
        description: "Content block created successfully"
      });
    }
  });

  // Mutation for updating a content block
  const updateBlockMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest('PATCH', `/api/content-blocks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
      setEditingBlock(null);
      toast({
        title: "Success",
        description: "Content block updated successfully"
      });
    }
  });

  // Mutation for deleting a content block
  const deleteBlockMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/content-blocks/${id}`);
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
  const handleCreateBlock = (data: any) => {
    createBlockMutation.mutate(data);
  };

  // Handle updating a content block
  const handleUpdateBlock = (data: any) => {
    if (editingBlock) {
      updateBlockMutation.mutate({ id: editingBlock.id, data });
    }
  };

  // Handle deleting a content block
  const handleDeleteBlock = (id: number) => {
    if (confirm("Are you sure you want to delete this content block? This action cannot be undone.")) {
      deleteBlockMutation.mutate(id);
    }
  };

  // Open preview dialog
  const handleOpenPreview = (block: ContentBlock) => {
    setSelectedBlock(block);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Block Preview</DialogTitle>
            <DialogDescription>
              Viewing content block: {selectedBlock?.identifier}
            </DialogDescription>
          </DialogHeader>
          {selectedBlock && <ContentBlockPreview block={selectedBlock} />}
        </DialogContent>
      </Dialog>

      {isCreatingBlock ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Content Block</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentBlockForm
              onSubmit={handleCreateBlock}
              onCancel={() => setIsCreatingBlock(false)}
            />
          </CardContent>
        </Card>
      ) : editingBlock ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Content Block</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentBlockForm
              initialData={editingBlock}
              onSubmit={handleUpdateBlock}
              onCancel={() => setEditingBlock(null)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Content Blocks</h2>
              <p className="text-muted-foreground">
                Manage reusable content pieces for your site
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={filterSection} onValueChange={setFilterSection}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section === "all" ? "All Sections" : section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setIsCreatingBlock(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Block
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center p-6">Loading content blocks...</div>
          ) : filteredBlocks.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Content Blocks Found</CardTitle>
                <CardDescription>
                  {filterSection !== "all" 
                    ? `No content blocks found in section "${filterSection}"`
                    : "Start creating content blocks to populate your site"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Button onClick={() => setIsCreatingBlock(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Content Block
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Identifier</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlocks.map((block: ContentBlock) => (
                      <TableRow key={block.id}>
                        <TableCell>{block.id}</TableCell>
                        <TableCell className="font-medium">{block.identifier}</TableCell>
                        <TableCell>{block.title}</TableCell>
                        <TableCell>{block.section || "-"}</TableCell>
                        <TableCell>{block.type || "text"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${block.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {block.active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenPreview(block)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingBlock(block)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteBlock(block.id)}
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