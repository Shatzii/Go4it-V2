'use client';

import React, { useState } from 'react';
import { Play, Image as ImageIcon, Video, FileText, Star, Eye, Plus, X } from 'lucide-react';

interface MediaAsset {
  id: string;
  originalName: string;
  type: 'image' | 'video' | 'logo' | 'document';
  category: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  isActive: boolean;
}

interface MediaIntegrationProps {
  mediaAssets: MediaAsset[];
  onSelectAsset: (asset: MediaAsset) => void;
  selectedAssetId?: string;
  categories?: string[];
  showVideos?: boolean;
  showImages?: boolean;
  maxSelection?: number;
}

export function MediaIntegration({
  mediaAssets = [],
  onSelectAsset,
  selectedAssetId,
  categories = ['all'],
  showVideos = true,
  showImages = true,
  maxSelection = 1
}: MediaIntegrationProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  const filteredAssets = mediaAssets.filter(asset => {
    const categoryMatch = selectedCategory === 'all' || asset.category === selectedCategory;
    const typeMatch = (showVideos && asset.type === 'video') || 
                      (showImages && (asset.type === 'image' || asset.type === 'logo'));
    return categoryMatch && typeMatch && asset.isActive;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'image':
      case 'logo':
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const availableCategories = [
    'all',
    ...Array.from(new Set(mediaAssets.map(asset => asset.category)))
  ];

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Media Library</h3>
        <div className="text-sm text-slate-400">
          {filteredAssets.length} assets available
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
        >
          {availableCategories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1 text-sm rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
        >
          Grid
        </button>
        <button
          onClick={() => setViewMode('compact')}
          className={`px-3 py-1 text-sm rounded ${viewMode === 'compact' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
        >
          List
        </button>
      </div>

      {/* Assets Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`relative cursor-pointer border rounded-lg overflow-hidden transition-all hover:border-blue-500 ${
                selectedAssetId === asset.id ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-slate-600'
              }`}
            >
              <div className="aspect-video bg-slate-700 flex items-center justify-center">
                {asset.type === 'video' ? (
                  <div className="relative">
                    <Play className="w-8 h-8 text-blue-400" />
                    {asset.thumbnailUrl && (
                      <img 
                        src={asset.thumbnailUrl} 
                        alt={asset.originalName}
                        className="absolute inset-0 w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {asset.url.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
                      <img 
                        src={asset.url} 
                        alt={asset.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getTypeIcon(asset.type)
                    )}
                  </div>
                )}
              </div>

              <div className="p-2">
                <div className="flex items-center gap-1 mb-1">
                  {getTypeIcon(asset.type)}
                  <span className="text-xs text-slate-400 uppercase tracking-wide">
                    {asset.type}
                  </span>
                </div>
                <p className="text-sm text-white truncate" title={asset.originalName}>
                  {asset.originalName}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {asset.description || 'No description'}
                </p>
              </div>

              {selectedAssetId === asset.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`flex items-center gap-3 p-3 cursor-pointer border rounded-lg transition-all hover:border-blue-500 ${
                selectedAssetId === asset.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600'
              }`}
            >
              <div className="flex-shrink-0">
                {getTypeIcon(asset.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {asset.originalName}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {asset.description || 'No description'}
                </p>
                <div className="flex gap-1 mt-1">
                  {asset.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-1 py-0.5 bg-slate-700 text-xs text-slate-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 capitalize">
                  {asset.category}
                </span>
                {selectedAssetId === asset.id && (
                  <Star className="w-4 h-4 text-blue-500 fill-current" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 mb-2">No media assets found</p>
          <p className="text-slate-500 text-sm">
            Try selecting a different category or upload new media
          </p>
        </div>
      )}
    </div>
  );
}

// Featured Media Section Component for CMS
export function FeaturedMediaSection({
  mediaAssets,
  featuredAssets = [],
  onUpdateFeatured
}: {
  mediaAssets: MediaAsset[];
  featuredAssets: string[];
  onUpdateFeatured: (assetIds: string[]) => void;
}) {
  const [selectedAssets, setSelectedAssets] = useState<string[]>(featuredAssets);

  const toggleAsset = (assetId: string) => {
    const newSelection = selectedAssets.includes(assetId)
      ? selectedAssets.filter(id => id !== assetId)
      : [...selectedAssets, assetId];
    
    setSelectedAssets(newSelection);
    onUpdateFeatured(newSelection);
  };

  const featuredMediaAssets = mediaAssets.filter(asset => 
    selectedAssets.includes(asset.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Featured Media</h3>
        <div className="text-sm text-slate-400">
          {selectedAssets.length}/6 selected
        </div>
      </div>

      {/* Featured Assets Display */}
      {featuredMediaAssets.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {featuredMediaAssets.map(asset => (
            <div key={asset.id} className="relative group">
              <div className="aspect-video bg-slate-700 rounded-lg overflow-hidden">
                {asset.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <Play className="w-8 h-8 text-blue-400" />
                  </div>
                ) : (
                  <img 
                    src={asset.url} 
                    alt={asset.originalName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button
                onClick={() => toggleAsset(asset.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <p className="text-sm text-white mt-2 truncate">{asset.originalName}</p>
            </div>
          ))}
        </div>
      )}

      {/* Asset Selection */}
      <MediaIntegration
        mediaAssets={mediaAssets}
        onSelectAsset={(asset) => toggleAsset(asset.id)}
        selectedAssetId={selectedAssets.length > 0 ? selectedAssets[selectedAssets.length - 1] : undefined}
        showVideos={true}
        showImages={true}
        maxSelection={6}
      />
    </div>
  );
}

export default MediaIntegration;