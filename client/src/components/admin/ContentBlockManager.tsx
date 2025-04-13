import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Filter, PlusCircle, Search, Eye, Edit, Copy, Trash, MoreVertical, FileText, ArrowUpDown, Code, Image, Hash, Tag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Define ContentBlock type
interface ContentBlock {
  id: number;
  title: string;
  identifier: string;
  section: string;
  content: string;
  type: 'html' | 'text' | 'markdown' | 'json' | 'image';
  createdAt: string;
  updatedAt: string;
  lastUpdatedBy: number;
  published: boolean;
  position: number;
  metadata?: any;
  author?: {
    id: number;
    name: string;
  };
}

export default function ContentBlockManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string | undefined>(undefined);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [newBlock, setNewBlock] = useState({
    title: '',
    identifier: '',
    section: 'global',
    content: '',
    type: 'text' as const,
    published: true,
    metadata: {},
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch content blocks
  const { data: contentBlocks = [], isLoading } = useQuery({
    queryKey: ['/api/content-blocks'],
    queryFn: async () => {
      try {
        // This is a temporary mock for development
        return [
          {
            id: 1,
            title: 'Homepage Hero',
            identifier: 'home-hero',
            section: 'homepage',
            content: '<h1>Train Like a Champion</h1><p>Go4It Sports helps athletes of all abilities reach their full potential</p>',
            type: 'html',
            createdAt: '2024-01-05T00:00:00Z',
            updatedAt: '2024-02-10T00:00:00Z',
            lastUpdatedBy: 1,
            published: true,
            position: 1,
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
          {
            id: 2,
            title: 'About Us Intro',
            identifier: 'about-intro',
            section: 'about',
            content: 'Go4It Sports is dedicated to helping neurodivergent student athletes reach their full potential through personalized training and support.',
            type: 'text',
            createdAt: '2024-01-06T00:00:00Z',
            updatedAt: '2024-01-06T00:00:00Z',
            lastUpdatedBy: 1,
            published: true,
            position: 1,
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
          {
            id: 3,
            title: 'Footer Contact Info',
            identifier: 'footer-contact',
            section: 'global',
            content: '{"email":"info@go4itsports.org","phone":"(555) 123-4567","address":"123 Sports Way, Athletic City, AC 12345"}',
            type: 'json',
            createdAt: '2024-01-07T00:00:00Z',
            updatedAt: '2024-02-15T00:00:00Z',
            lastUpdatedBy: 1,
            published: true,
            position: 1,
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
          {
            id: 4,
            title: 'Privacy Policy',
            identifier: 'privacy-policy',
            section: 'legal',
            content: '# Privacy Policy\n\nLast updated: January 1, 2024\n\n## Introduction\n\nGo4It Sports is committed to protecting your privacy...',
            type: 'markdown',
            createdAt: '2024-01-10T00:00:00Z',
            updatedAt: '2024-01-10T00:00:00Z',
            lastUpdatedBy: 1,
            published: true,
            position: 1,
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
          {
            id: 5,
            title: 'Homepage Hero Image',
            identifier: 'home-hero-image',
            section: 'homepage',
            content: '/assets/images/hero-image.jpg',
            type: 'image',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-02-20T00:00:00Z',
            lastUpdatedBy: 1,
            published: true,
            position: 2,
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
          {
            id: 6,
            title: 'New Feature Announcement',
            identifier: 'feature-announcement',
            section: 'global',
            content: '<div class="announcement">Exciting new features coming soon! Stay tuned for our enhanced training modules.</div>',
            type: 'html',
            createdAt: '2024-02-20T00:00:00Z',
            updatedAt: '2024-02-20T00:00:00Z',
            lastUpdatedBy: 1,
            published: false,
            position: 2,
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
        ] as ContentBlock[];
      } catch (error) {
        console.error('Failed to fetch content blocks:', error);
        return [];
      }
    }
  });

  // Get unique sections
  const uniqueSections = React.useMemo(() => {
    if (!contentBlocks.length) return [];
    
    const sections = new Set<string>();
    contentBlocks.forEach(block => {
      sections.add(block.section);
    });
    
    return Array.from(sections);
  }, [contentBlocks]);

  // Create content block mutation
  const createContentBlockMutation = useMutation({
    mutationFn: async (block: typeof newBlock) => {
      try {
        // This is a placeholder for the actual API request
        console.log('Creating new content block:', block);
        // return await apiRequest('/api/content-blocks', { method: 'POST', data: block });
        
        // Mock response for development
        return {
          id: Math.floor(Math.random() * 1000),
          ...block,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastUpdatedBy: 1,
          position: 1, // Would be determined by server
          author: {
            id: 1,
            name: 'Admin User',
          },
        };
      } catch (error) {
        console.error('Failed to create content block:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
      setIsCreateDialogOpen(false);
      setNewBlock({
        title: '',
        identifier: '',
        section: 'global',
        content: '',
        type: 'text',
        published: true,
        metadata: {},
      });
      toast({
        title: "Success!",
        description: "Content block created successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to create content block. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update content block mutation
  const updateContentBlockMutation = useMutation({
    mutationFn: async (block: ContentBlock) => {
      try {
        // This is a placeholder for the actual API request
        console.log('Updating content block:', block);
        // return await apiRequest(`/api/content-blocks/${block.id}`, { method: 'PATCH', data: block });
        
        // Mock response for development
        return {
          ...block,
          updatedAt: new Date().toISOString(),
          lastUpdatedBy: 1,
        };
      } catch (error) {
        console.error('Failed to update content block:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
      setIsEditDialogOpen(false);
      setSelectedBlock(null);
      toast({
        title: "Success!",
        description: "Content block updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to update content block. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete content block mutation
  const deleteContentBlockMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        // This is a placeholder for the actual API request
        console.log('Deleting content block:', id);
        // return await apiRequest(`/api/content-blocks/${id}`, { method: 'DELETE' });
        
        // Mock response for development
        return { success: true };
      } catch (error) {
        console.error('Failed to delete content block:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
      toast({
        title: "Success!",
        description: "Content block deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to delete content block. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Toggle publish status mutation
  const togglePublishStatusMutation = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      try {
        // This is a placeholder for the actual API request
        console.log('Toggling publish status:', { id, published });
        // return await apiRequest(`/api/content-blocks/${id}/publish`, {
        //   method: 'PATCH',
        //   data: { published },
        // });
        
        // Mock response for development
        return {
          success: true,
          published,
        };
      } catch (error) {
        console.error('Failed to toggle publish status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
      toast({
        title: "Success!",
        description: "Content block status updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to update content block status. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Generate identifier from title
  const generateIdentifier = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Filter content blocks based on search query and section filter
  const filteredBlocks = contentBlocks.filter(block => {
    const matchesSearch = 
      block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSection = !sectionFilter || block.section === sectionFilter;
    
    return matchesSearch && matchesSection;
  });

  // Handle create content block
  const handleCreateContentBlock = (e: React.FormEvent) => {
    e.preventDefault();
    createContentBlockMutation.mutate(newBlock);
  };

  // Handle edit content block
  const handleEditContentBlock = (block: ContentBlock) => {
    setSelectedBlock(block);
    setIsEditDialogOpen(true);
  };

  // Handle update content block
  const handleUpdateContentBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBlock) {
      updateContentBlockMutation.mutate(selectedBlock);
    }
  };

  // Handle delete content block
  const handleDeleteContentBlock = (id: number) => {
    if (window.confirm("Are you sure you want to delete this content block?")) {
      deleteContentBlockMutation.mutate(id);
    }
  };

  // Handle toggle publish status
  const handleTogglePublishStatus = (id: number, currentStatus: boolean) => {
    togglePublishStatusMutation.mutate({
      id,
      published: !currentStatus,
    });
  };

  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'html':
        return <Code className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'markdown':
        return <Hash className="h-4 w-4" />;
      case 'json':
        return <Tag className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get publish status badge
  const getPublishStatusBadge = (published: boolean) => {
    return published ? (
      <Badge variant="success">Published</Badge>
    ) : (
      <Badge variant="outline">Draft</Badge>
    );
  };

  // Preview content based on type
  const renderContentPreview = (block: ContentBlock) => {
    const maxPreviewLength = 100;
    
    switch (block.type) {
      case 'html':
        return <div className="text-xs font-mono bg-muted p-1 overflow-hidden text-ellipsis whitespace-nowrap">{block.content.length > maxPreviewLength ? `${block.content.substring(0, maxPreviewLength)}...` : block.content}</div>;
      case 'text':
        return <div className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">{block.content.length > maxPreviewLength ? `${block.content.substring(0, maxPreviewLength)}...` : block.content}</div>;
      case 'markdown':
        return <div className="text-xs font-mono bg-muted p-1 overflow-hidden text-ellipsis whitespace-nowrap">{block.content.length > maxPreviewLength ? `${block.content.substring(0, maxPreviewLength)}...` : block.content}</div>;
      case 'json':
        return <div className="text-xs font-mono bg-muted p-1 overflow-hidden text-ellipsis whitespace-nowrap">{block.content.length > maxPreviewLength ? `${block.content.substring(0, maxPreviewLength)}...` : block.content}</div>;
      case 'image':
        return <div className="text-xs text-muted-foreground italic">{block.content}</div>;
      default:
        return <div className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">{block.content.length > maxPreviewLength ? `${block.content.substring(0, maxPreviewLength)}...` : block.content}</div>;
    }
  };

  // Content editor based on type
  const renderContentEditor = (type: string, content: string, onChange: (value: string) => void) => {
    switch (type) {
      case 'html':
      case 'markdown':
      case 'json':
        return (
          <Textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono h-48"
          />
        );
      case 'text':
        return (
          <Textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="h-48"
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              type="text"
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Image URL or path"
            />
            <Button variant="outline" type="button" size="sm">
              Choose Image
            </Button>
          </div>
        );
      default:
        return (
          <Textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="h-48"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-2/3">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search content blocks..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="md:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{sectionFilter || 'All sections'}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>All sections</SelectItem>
              {uniqueSections.map(section => (
                <SelectItem key={section} value={section}>{section}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Content Block
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">Loading content blocks...</div>
          ) : filteredBlocks.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Title</TableHead>
                    <TableHead className="w-[150px]">Identifier</TableHead>
                    <TableHead className="w-[120px]">Section</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Content Preview</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[120px]">
                      <div className="flex items-center">
                        Last Updated
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlocks.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell className="font-medium">{block.title}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {block.identifier}
                        </code>
                      </TableCell>
                      <TableCell>{block.section}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getContentTypeIcon(block.type)}
                          <span className="text-xs">{block.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{renderContentPreview(block)}</TableCell>
                      <TableCell>{getPublishStatusBadge(block.published)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{new Date(block.updatedAt).toLocaleDateString()}</span>
                          <span className="text-xs text-muted-foreground">
                            by {block.author?.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditContentBlock(block)}>
                              <Edit className="w-4 h-4 mr-2" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              <span>Preview</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              <span>Duplicate</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleTogglePublishStatus(block.id, block.published)}
                            >
                              {block.published ? (
                                <>
                                  <span>Unpublish</span>
                                </>
                              ) : (
                                <>
                                  <span>Publish</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteContentBlock(block.id)}
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-2">No content blocks found</p>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create your first content block
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Content Block Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Create New Content Block</DialogTitle>
            <DialogDescription>
              Add a new content block to your site. Content blocks can be reused across multiple pages.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateContentBlock}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Homepage Hero Text"
                  value={newBlock.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setNewBlock({
                      ...newBlock,
                      title,
                      identifier: newBlock.identifier || generateIdentifier(title),
                    });
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="identifier">Identifier</Label>
                  <Input
                    id="identifier"
                    placeholder="e.g. homepage-hero-text"
                    value={newBlock.identifier}
                    onChange={(e) =>
                      setNewBlock({ ...newBlock, identifier: e.target.value })
                    }
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Used to reference this content in code
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    placeholder="e.g. homepage, global, about"
                    value={newBlock.section}
                    onChange={(e) =>
                      setNewBlock({ ...newBlock, section: e.target.value })
                    }
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Used to organize content blocks
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Content Type</Label>
                <Select
                  value={newBlock.type}
                  onValueChange={(value: 'html' | 'text' | 'markdown' | 'json' | 'image') =>
                    setNewBlock({ ...newBlock, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select a content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                {renderContentEditor(newBlock.type, newBlock.content, (value) =>
                  setNewBlock({ ...newBlock, content: value })
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={newBlock.published}
                  onCheckedChange={(checked) =>
                    setNewBlock({ ...newBlock, published: checked })
                  }
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createContentBlockMutation.isPending}>
                {createContentBlockMutation.isPending ? "Creating..." : "Create Block"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Content Block Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Edit Content Block</DialogTitle>
            <DialogDescription>
              Edit the content block details and content.
            </DialogDescription>
          </DialogHeader>
          {selectedBlock && (
            <form onSubmit={handleUpdateContentBlock}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={selectedBlock.title}
                    onChange={(e) =>
                      setSelectedBlock({ ...selectedBlock, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-identifier">Identifier</Label>
                    <Input
                      id="edit-identifier"
                      value={selectedBlock.identifier}
                      onChange={(e) =>
                        setSelectedBlock({ ...selectedBlock, identifier: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-section">Section</Label>
                    <Input
                      id="edit-section"
                      value={selectedBlock.section}
                      onChange={(e) =>
                        setSelectedBlock({ ...selectedBlock, section: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Content Type</Label>
                  <Select
                    value={selectedBlock.type}
                    onValueChange={(value: 'html' | 'text' | 'markdown' | 'json' | 'image') =>
                      setSelectedBlock({ ...selectedBlock, type: value })
                    }
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select a content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Plain Text</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-content">Content</Label>
                  {renderContentEditor(selectedBlock.type, selectedBlock.content, (value) =>
                    setSelectedBlock({ ...selectedBlock, content: value })
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-published"
                    checked={selectedBlock.published}
                    onCheckedChange={(checked) =>
                      setSelectedBlock({ ...selectedBlock, published: checked })
                    }
                  />
                  <Label htmlFor="edit-published">Published</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateContentBlockMutation.isPending}>
                  {updateContentBlockMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}