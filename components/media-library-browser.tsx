'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Image, Video, FileText, Download, Eye, Star } from 'lucide-react';
import {
  mediaLibrary,
  documentLibrary,
  MediaAsset,
  getAssetsByCategory,
  getAssetsByType,
  searchAssets,
} from '../lib/media-library';

interface MediaLibraryBrowserProps {
  onAssetSelect?: (asset: MediaAsset) => void;
  selectedAssets?: string[];
  multiSelect?: boolean;
  categoryFilter?: MediaAsset['category'];
  typeFilter?: MediaAsset['type'];
}

export function MediaLibraryBrowser({
  onAssetSelect,
  selectedAssets = [],
  multiSelect = false,
  categoryFilter,
  typeFilter,
}: MediaLibraryBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MediaAsset['category'] | 'all'>(
    categoryFilter || 'all',
  );
  const [selectedType, setSelectedType] = useState<MediaAsset['type'] | 'all'>(typeFilter || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const allAssets = useMemo(() => [...mediaLibrary, ...documentLibrary], []);

  const filteredAssets = useMemo(() => {
    let assets = allAssets;

    // Apply search filter
    if (searchQuery) {
      assets = searchAssets(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      assets = assets.filter((asset) => asset.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      assets = assets.filter((asset) => asset.type === selectedType);
    }

    return assets;
  }, [allAssets, searchQuery, selectedCategory, selectedType]);

  const getTypeIcon = (type: MediaAsset['type']) => {
    switch (type) {
      case 'image':
      case 'logo':
        return <Image className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const handleAssetClick = (asset: MediaAsset) => {
    if (onAssetSelect) {
      onAssetSelect(asset);
    }
  };

  const isSelected = (assetId: string) => selectedAssets.includes(assetId);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Media Library</h2>
        <div className="text-slate-400 text-sm">{filteredAssets.length} assets</div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Filter Row */}
        <div className="flex gap-4 flex-wrap">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as MediaAsset['category'] | 'all')}
            className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="branding">Branding</option>
            <option value="events">Events</option>
            <option value="camps">Camps</option>
            <option value="documentation">Documentation</option>
            <option value="promotional">Promotional</option>
            <option value="athlete-content">Athlete Content</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as MediaAsset['type'] | 'all')}
            className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="logo">Logos</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-900 border border-slate-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Assets Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => handleAssetClick(asset)}
              className={`relative bg-slate-900 rounded-lg border cursor-pointer transition-all hover:border-blue-500 hover:scale-105 ${
                isSelected(asset.id)
                  ? 'border-blue-500 ring-2 ring-blue-500/50'
                  : 'border-slate-600'
              }`}
            >
              {/* Asset Preview */}
              <div className="aspect-square p-4 flex items-center justify-center bg-slate-800 rounded-t-lg">
                {asset.type === 'image' || asset.type === 'logo' ? (
                  <div className="w-full h-full bg-slate-700 rounded flex items-center justify-center">
                    <Image className="w-8 h-8 text-slate-400" />
                  </div>
                ) : asset.type === 'video' ? (
                  <div className="w-full h-full bg-slate-700 rounded flex items-center justify-center">
                    <Video className="w-8 h-8 text-slate-400" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-700 rounded flex items-center justify-center">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Asset Info */}
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  {getTypeIcon(asset.type)}
                  <span className="text-xs text-slate-400 uppercase tracking-wide">
                    {asset.type}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-white truncate mb-1">
                  {asset.originalName}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {asset.description || 'No description'}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {asset.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {asset.tags.length > 2 && (
                    <span className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded">
                      +{asset.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected(asset.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => handleAssetClick(asset)}
              className={`flex items-center gap-4 p-4 bg-slate-900 rounded-lg border cursor-pointer transition-all hover:border-blue-500 ${
                isSelected(asset.id)
                  ? 'border-blue-500 ring-2 ring-blue-500/50'
                  : 'border-slate-600'
              }`}
            >
              <div className="flex-shrink-0">{getTypeIcon(asset.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium truncate">{asset.originalName}</h3>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">
                    {asset.type}
                  </span>
                </div>
                <p className="text-sm text-slate-400 truncate">
                  {asset.description || 'No description'}
                </p>
                <div className="flex gap-1 mt-1">
                  {asset.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{asset.category}</span>
                {isSelected(asset.id) && <Star className="w-5 h-5 text-blue-500 fill-current" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No assets found</h3>
          <p className="text-slate-500">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'No assets match the current filters'}
          </p>
        </div>
      )}
    </div>
  );
}

export default MediaLibraryBrowser;
