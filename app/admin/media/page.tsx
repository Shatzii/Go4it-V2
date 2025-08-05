'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, Image, FileText, Video, Trash2, 
  Search, Filter, Grid, List, Download,
  Plus, Folder, Copy, Edit, Eye
} from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: string;
  uploadDate: string;
  category: string;
  description?: string;
  tags: string[];
}

const initialMediaItems: MediaItem[] = [
  {
    id: '1',
    name: 'GAR Rating System Flyer',
    type: 'image',
    url: '/assets/Navy Blue and Gray Modern Baseball Camp Promotion Flyer_1754370606998.png',
    size: '2.4 MB',
    uploadDate: '2025-01-05',
    category: 'marketing',
    description: 'Comprehensive GAR rating system breakdown showing Physical (80%), Cognitive (20%), and Psychological (20%) components',
    tags: ['GAR', 'rating', 'system', 'marketing', 'flyer', 'athletes']
  },
  {
    id: '2',
    name: 'Get Verified Combine Tour 2025',
    type: 'image',
    url: '/assets/BAF0A0B9-87A6-4585-A0BA-E095DC5D3B1B_1754370606998.png',
    size: '1.8 MB',
    uploadDate: '2025-01-05',
    category: 'events',
    description: 'International combine tour map showing Atlanta, Vienna, Mexico City, and Paris locations',
    tags: ['combine', 'tour', '2025', 'international', 'verification', 'events']
  },
  {
    id: '3',
    name: 'Top Verified Athletes',
    type: 'image',
    url: '/assets/F29318E4-70D2-4A43-A255-0E7DB9354C3B_1754370606998.png',
    size: '2.1 MB',
    uploadDate: '2025-01-05',
    category: 'athletes',
    description: 'Showcase of top verified athletes with GAR scores: 94, 96, 98, and 95',
    tags: ['athletes', 'verified', 'GAR', 'scores', 'top', 'performers']
  },
  {
    id: '4',
    name: 'Go4It Sports Logo',
    type: 'image',
    url: '/assets/Go4it Logo_1752616197577.jpeg',
    size: '456 KB',
    uploadDate: '2024-12-15',
    category: 'branding',
    description: 'Official Go4It Sports platform logo',
    tags: ['logo', 'branding', 'go4it', 'sports']
  },
  {
    id: '5',
    name: 'Mexico Team Camp 2025',
    type: 'image',
    url: '/assets/TeamCamp2025_1754351477369.jpg',
    size: '1.2 MB',
    uploadDate: '2024-12-20',
    category: 'events',
    description: 'Mexico team camp promotional image',
    tags: ['mexico', 'camp', '2025', 'team', 'training']
  },
  {
    id: '6',
    name: 'EWS 2025 Program',
    type: 'image',
    url: '/assets/EWS 2025 - 1_1754352865747.jpeg',
    size: '890 KB',
    uploadDate: '2024-12-18',
    category: 'programs',
    description: 'Elite Winter Sports 2025 program details',
    tags: ['EWS', '2025', 'winter', 'sports', 'elite']
  }
];

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const categories = ['all', 'marketing', 'events', 'athletes', 'branding', 'programs'];

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const newItem: MediaItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        url: URL.createObjectURL(file),
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        category: 'uncategorized',
        tags: []
      };
      setMediaItems(prev => [newItem, ...prev]);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const deleteItem = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Media Library
          </h1>
          <p className="text-slate-300 text-lg">
            Manage all media assets for the Go4It Sports platform
          </p>
        </div>

        {/* Upload Section */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Media
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx"
                multiple
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white mb-2">
                      Click to upload files
                    </p>
                    <p className="text-slate-400 text-sm">
                      Support for images, videos, and documents (Max 10MB each)
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search media files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{mediaItems.length}</div>
              <div className="text-slate-400 text-sm">Total Files</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{mediaItems.filter(item => item.type === 'image').length}</div>
              <div className="text-slate-400 text-sm">Images</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{mediaItems.filter(item => item.type === 'video').length}</div>
              <div className="text-slate-400 text-sm">Videos</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{selectedItems.length}</div>
              <div className="text-slate-400 text-sm">Selected</div>
            </CardContent>
          </Card>
        </div>

        {/* Media Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className={`bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer ${
                  selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => toggleSelectItem(item.id)}
              >
                <CardContent className="p-4">
                  {/* Preview */}
                  <div className="aspect-video bg-slate-700 rounded-lg mb-4 relative overflow-hidden">
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className={`${item.type === 'image' ? 'bg-green-500' : item.type === 'video' ? 'bg-blue-500' : 'bg-purple-500'} text-white`}>
                        {item.type}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-white truncate" title={item.name}>
                      {item.name}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-slate-400">
                      <span>{item.size}</span>
                      <span>{item.uploadDate}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-300">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-400 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredItems.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-4 p-4 hover:bg-slate-700/50 cursor-pointer ${
                      index > 0 ? 'border-t border-slate-700' : ''
                    } ${selectedItems.includes(item.id) ? 'bg-blue-500/10' : ''}`}
                    onClick={() => toggleSelectItem(item.id)}
                  >
                    <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-sm text-slate-400">{item.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span>{item.size}</span>
                        <span>{item.uploadDate}</span>
                        <span className="capitalize">{item.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${item.type === 'image' ? 'bg-green-500' : item.type === 'video' ? 'bg-blue-500' : 'bg-purple-500'} text-white`}>
                        {item.type}
                      </Badge>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-300">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-400 hover:text-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <Folder className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Media Found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No files match your current search criteria.' 
                  : 'Upload your first media files to get started.'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  variant="outline"
                  className="border-slate-600"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Selected Actions */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">
                {selectedItems.length} selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-red-500 text-red-400 hover:bg-red-500/10"
                  onClick={() => {
                    selectedItems.forEach(deleteItem);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setSelectedItems([])}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}