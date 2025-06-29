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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, PlusCircle, Globe, Eye, Edit, Copy, Trash, MoreVertical, FileCode, ArrowUpDown, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Define Page type
interface Page {
  id: number;
  title: string;
  slug: string;
  layout: string;
  isPublished: boolean;
  publishDate: string | null;
  lastUpdated: string;
  lastUpdatedBy: number;
  createdAt: string;
  template: string;
  status: 'draft' | 'published' | 'archived';
  sections?: string[];
  author?: {
    id: number;
    name: string;
  };
}

export default function PageManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    layout: 'default',
    template: 'standard',
    status: 'draft' as const,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pages
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['/api/pages'],
    queryFn: async () => {
      try {
        // This is a temporary mock for development
        return [
          {
            id: 1,
            title: 'Home Page',
            slug: '/',
            layout: 'default',
            isPublished: true,
            publishDate: '2024-01-05T00:00:00Z',
            lastUpdated: '2024-02-10T00:00:00Z',
            lastUpdatedBy: 1,
            createdAt: '2024-01-01T00:00:00Z',
            template: 'standard',
            status: 'published',
            sections: ['hero', 'features', 'testimonials', 'cta'],
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
          {
            id: 2,
            title: 'About Us',
            slug: '/about',
            layout: 'default',
            isPublished: true,
            publishDate: '2024-01-05T00:00:00Z',
            lastUpdated: '2024-02-15T00:00:00Z',
            lastUpdatedBy: 1,
            createdAt: '2024-01-02T00:00:00Z',
            template: 'standard',
            status: 'published',
            sections: ['hero', 'content', 'team', 'cta'],
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
          {
            id: 3,
            title: 'Contact',
            slug: '/contact',
            layout: 'narrow',
            isPublished: true,
            publishDate: '2024-01-10T00:00:00Z',
            lastUpdated: '2024-02-05T00:00:00Z',
            lastUpdatedBy: 1,
            createdAt: '2024-01-05T00:00:00Z',
            template: 'form',
            status: 'published',
            sections: ['hero', 'contact-form', 'map'],
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
          {
            id: 4,
            title: 'Blog',
            slug: '/blog',
            layout: 'sidebar',
            isPublished: true,
            publishDate: '2024-01-15T00:00:00Z',
            lastUpdated: '2024-01-15T00:00:00Z',
            lastUpdatedBy: 1,
            createdAt: '2024-01-10T00:00:00Z',
            template: 'blog',
            status: 'published',
            sections: ['hero', 'post-list', 'sidebar'],
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
          {
            id: 5,
            title: 'New Feature Page',
            slug: '/new-feature',
            layout: 'default',
            isPublished: false,
            publishDate: null,
            lastUpdated: '2024-02-20T00:00:00Z',
            lastUpdatedBy: 1,
            createdAt: '2024-02-18T00:00:00Z',
            template: 'standard',
            status: 'draft',
            sections: ['hero', 'features'],
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
          {
            id: 6,
            title: 'Outdated Page',
            slug: '/outdated',
            layout: 'default',
            isPublished: false,
            publishDate: '2023-11-01T00:00:00Z',
            lastUpdated: '2023-11-01T00:00:00Z',
            lastUpdatedBy: 1,
            createdAt: '2023-10-28T00:00:00Z',
            template: 'standard',
            status: 'archived',
            sections: ['hero', 'content'],
            author: {
              id: 1,
              name: 'Admin User',
            },
          },
        ] as Page[];
      } catch (error) {
        console.error('Failed to fetch pages:', error);
        return [];
      }
    }
  });

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: async (page: typeof newPage) => {
      try {
        // This is a placeholder for the actual API request
        console.log('Creating new page:', page);
        // return await apiRequest('/api/pages', { method: 'POST', data: page });
        
        // Mock response for development
        return {
          id: Math.floor(Math.random() * 1000),
          ...page,
          isPublished: page.status === 'published',
          publishDate: page.status === 'published' ? new Date().toISOString() : null,
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: 1,
          createdAt: new Date().toISOString(),
          sections: [],
          author: {
            id: 1,
            name: 'Admin User',
          },
        };
      } catch (error) {
        console.error('Failed to create page:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      setIsCreateDialogOpen(false);
      setNewPage({
        title: '',
        slug: '',
        layout: 'default',
        template: 'standard',
        status: 'draft',
      });
      toast({
        title: "Success!",
        description: "Page created successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to create page. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete page mutation
  const deletePageMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        // This is a placeholder for the actual API request
        console.log('Deleting page:', id);
        // return await apiRequest(`/api/pages/${id}`, { method: 'DELETE' });
        
        // Mock response for development
        return { success: true };
      } catch (error) {
        console.error('Failed to delete page:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      toast({
        title: "Success!",
        description: "Page deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to delete page. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Publish/unpublish page mutation
  const updatePageStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'draft' | 'published' | 'archived' }) => {
      try {
        // This is a placeholder for the actual API request
        console.log('Updating page status:', { id, status });
        // return await apiRequest(`/api/pages/${id}/status`, {
        //   method: 'PATCH',
        //   data: { status },
        // });
        
        // Mock response for development
        return {
          success: true,
          isPublished: status === 'published',
          publishDate: status === 'published' ? new Date().toISOString() : null,
        };
      } catch (error) {
        console.error('Failed to update page status:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      toast({
        title: "Success!",
        description: `Page ${variables.status === 'published' ? 'published' : variables.status === 'draft' ? 'unpublished' : 'archived'} successfully.`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: "Failed to update page status. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Filter pages based on search query and status filter
  const filteredPages = pages.filter(page => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.template.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || page.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle create page
  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    createPageMutation.mutate(newPage);
  };

  // Handle delete page
  const handleDeletePage = (id: number) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      deletePageMutation.mutate(id);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
              placeholder="Search pages..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{statusFilter || 'All statuses'}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>All statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Page
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">Loading pages...</div>
          ) : filteredPages.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Page Title</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Last Updated
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {page.slug}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>{page.template}</TableCell>
                      <TableCell>{getStatusBadge(page.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{new Date(page.lastUpdated).toLocaleDateString()}</span>
                          <span className="text-xs text-muted-foreground">
                            by {page.author?.name}
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
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              <span>View Page</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileCode className="w-4 h-4 mr-2" />
                              <span>Edit Components</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              <span>Duplicate</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {page.status !== 'published' ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  updatePageStatusMutation.mutate({ id: page.id, status: 'published' })
                                }
                              >
                                <Globe className="w-4 h-4 mr-2" />
                                <span>Publish</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  updatePageStatusMutation.mutate({ id: page.id, status: 'draft' })
                                }
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>Unpublish</span>
                              </DropdownMenuItem>
                            )}
                            {page.status !== 'archived' ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  updatePageStatusMutation.mutate({ id: page.id, status: 'archived' })
                                }
                              >
                                <span>Archive</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  updatePageStatusMutation.mutate({ id: page.id, status: 'draft' })
                                }
                              >
                                <span>Restore</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeletePage(page.id)}
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
              <p className="text-muted-foreground mb-2">No pages found</p>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create your first page
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Page Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Add a new page to your site. You can edit its content later.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePage}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. About Us"
                  value={newPage.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setNewPage({
                      ...newPage,
                      title,
                      slug: newPage.slug || generateSlug(title),
                    });
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-1">/</span>
                  <Input
                    id="slug"
                    placeholder="e.g. about-us"
                    value={newPage.slug}
                    onChange={(e) =>
                      setNewPage({ ...newPage, slug: e.target.value })
                    }
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  The URL for this page on your site
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="template">Template</Label>
                  <Select
                    value={newPage.template}
                    onValueChange={(value) =>
                      setNewPage({ ...newPage, template: value })
                    }
                  >
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="form">Form</SelectItem>
                      <SelectItem value="landing">Landing Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="layout">Layout</Label>
                  <Select
                    value={newPage.layout}
                    onValueChange={(value) =>
                      setNewPage({ ...newPage, layout: value })
                    }
                  >
                    <SelectTrigger id="layout">
                      <SelectValue placeholder="Select a layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="narrow">Narrow</SelectItem>
                      <SelectItem value="sidebar">With Sidebar</SelectItem>
                      <SelectItem value="fullwidth">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newPage.status}
                  onValueChange={(value: 'draft' | 'published' | 'archived') =>
                    setNewPage({ ...newPage, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
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
              <Button type="submit" disabled={createPageMutation.isPending}>
                {createPageMutation.isPending ? "Creating..." : "Create Page"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}