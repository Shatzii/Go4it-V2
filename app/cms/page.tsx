'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  Plus, 
  Save, 
  Image, 
  Video, 
  Calendar, 
  Users, 
  Settings,
  Search,
  Filter,
  Upload,
  Download,
  Copy,
  ExternalLink,
  BarChart3,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  type: 'blog' | 'article' | 'announcement' | 'training' | 'news'
  content: string
  excerpt: string
  author: string
  status: 'draft' | 'published' | 'scheduled'
  publishDate: string
  lastModified: string
  tags: string[]
  category: string
  featured: boolean
  viewCount: number
  readTime: number
}

interface MediaItem {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  url: string
  size: number
  uploadDate: string
  description: string
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState('content')
  const [content, setContent] = useState<ContentItem[]>([])
  const [media, setMedia] = useState<MediaItem[]>([])
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  // Mock data for demonstration
  useEffect(() => {
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'Advanced Basketball Training Techniques',
        type: 'blog',
        content: 'Comprehensive guide to advanced basketball training methods...',
        excerpt: 'Learn advanced basketball techniques from professional coaches',
        author: 'Coach Martinez',
        status: 'published',
        publishDate: '2025-01-10',
        lastModified: '2025-01-12',
        tags: ['basketball', 'training', 'advanced'],
        category: 'Training',
        featured: true,
        viewCount: 1248,
        readTime: 8
      },
      {
        id: '2',
        title: 'NCAA Recruitment Timeline Guide',
        type: 'article',
        content: 'Essential timeline for NCAA recruitment process...',
        excerpt: 'Navigate the NCAA recruitment process with our comprehensive timeline',
        author: 'Recruitment Team',
        status: 'published',
        publishDate: '2025-01-08',
        lastModified: '2025-01-08',
        tags: ['ncaa', 'recruitment', 'timeline'],
        category: 'Recruitment',
        featured: false,
        viewCount: 892,
        readTime: 12
      },
      {
        id: '3',
        title: 'Platform Maintenance Notice',
        type: 'announcement',
        content: 'Scheduled maintenance on January 20th...',
        excerpt: 'Important system maintenance scheduled for this weekend',
        author: 'System Admin',
        status: 'scheduled',
        publishDate: '2025-01-18',
        lastModified: '2025-01-15',
        tags: ['maintenance', 'system'],
        category: 'System',
        featured: false,
        viewCount: 0,
        readTime: 2
      }
    ]

    const mockMedia: MediaItem[] = [
      {
        id: '1',
        name: 'basketball-training-hero.jpg',
        type: 'image',
        url: '/media/basketball-training-hero.jpg',
        size: 245760,
        uploadDate: '2025-01-10',
        description: 'Hero image for basketball training article'
      },
      {
        id: '2',
        name: 'recruitment-process-video.mp4',
        type: 'video',
        url: '/media/recruitment-process-video.mp4',
        size: 15728640,
        uploadDate: '2025-01-08',
        description: 'Video explaining NCAA recruitment process'
      }
    ]

    setContent(mockContent)
    setMedia(mockMedia)
  }, [])

  const handleCreateNew = () => {
    const newContent: ContentItem = {
      id: Date.now().toString(),
      title: 'New Content',
      type: 'blog',
      content: '',
      excerpt: '',
      author: 'Current User',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      tags: [],
      category: 'General',
      featured: false,
      viewCount: 0,
      readTime: 0
    }
    setSelectedContent(newContent)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!selectedContent) return
    
    const updatedContent = content.map(item => 
      item.id === selectedContent.id ? selectedContent : item
    )
    
    // If it's a new item, add it to the list
    if (!content.find(item => item.id === selectedContent.id)) {
      updatedContent.push(selectedContent)
    }
    
    setContent(updatedContent)
    setIsEditing(false)
  }

  const handleDelete = (id: string) => {
    setContent(content.filter(item => item.id !== id))
    if (selectedContent?.id === id) {
      setSelectedContent(null)
    }
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesType = filterType === 'all' || item.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />
      case 'draft': return <AlertCircle className="w-4 h-4" />
      case 'scheduled': return <Clock className="w-4 h-4" />
      default: return <XCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Content Management System</h1>
          <p className="text-lg text-muted-foreground">Manage blog posts, articles, announcements, and training resources</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Content List */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Content Library</CardTitle>
                      <Button onClick={handleCreateNew} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Content
                      </Button>
                    </div>
                    <CardDescription>
                      Manage your blog posts, articles, and announcements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search content..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="blog">Blog</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Content List */}
                    <div className="space-y-4">
                      {filteredContent.map((item) => (
                        <Card key={item.id} className={`cursor-pointer transition-all ${
                          selectedContent?.id === item.id ? 'ring-2 ring-primary' : ''
                        }`} onClick={() => setSelectedContent(item)}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                                  {item.featured && (
                                    <Badge variant="secondary">Featured</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{item.excerpt}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {item.author}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {item.publishDate}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {item.viewCount}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {item.readTime} min read
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(item.status)}>
                                  {getStatusIcon(item.status)}
                                  {item.status}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  {item.type}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content Editor */}
              <div className="space-y-4">
                {selectedContent ? (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>
                          {isEditing ? 'Edit Content' : 'Content Details'}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {!isEditing ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(selectedContent.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleSave}
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isEditing ? (
                        <>
                          <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={selectedContent.title}
                              onChange={(e) => setSelectedContent({
                                ...selectedContent,
                                title: e.target.value
                              })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                              id="excerpt"
                              value={selectedContent.excerpt}
                              onChange={(e) => setSelectedContent({
                                ...selectedContent,
                                excerpt: e.target.value
                              })}
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                              id="content"
                              value={selectedContent.content}
                              onChange={(e) => setSelectedContent({
                                ...selectedContent,
                                content: e.target.value
                              })}
                              rows={10}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="type">Type</Label>
                              <Select
                                value={selectedContent.type}
                                onValueChange={(value) => setSelectedContent({
                                  ...selectedContent,
                                  type: value as any
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="blog">Blog</SelectItem>
                                  <SelectItem value="article">Article</SelectItem>
                                  <SelectItem value="announcement">Announcement</SelectItem>
                                  <SelectItem value="training">Training</SelectItem>
                                  <SelectItem value="news">News</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="status">Status</Label>
                              <Select
                                value={selectedContent.status}
                                onValueChange={(value) => setSelectedContent({
                                  ...selectedContent,
                                  status: value as any
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="published">Published</SelectItem>
                                  <SelectItem value="scheduled">Scheduled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Content Preview</h3>
                            <p className="text-sm text-muted-foreground">{selectedContent.excerpt}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Details</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span>Type: {selectedContent.type}</span>
                              <span>Status: {selectedContent.status}</span>
                              <span>Author: {selectedContent.author}</span>
                              <span>Views: {selectedContent.viewCount}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedContent.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Select content to view details</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media Library</CardTitle>
                <CardDescription>
                  Manage images, videos, and documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Media library functionality coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Content Analytics</CardTitle>
                <CardDescription>
                  Track content performance and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>CMS Settings</CardTitle>
                <CardDescription>
                  Configure content management preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Settings panel coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}