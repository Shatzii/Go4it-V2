import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CacheStats } from '../types';
import { apiRequest } from '@/lib/queryClient';

/**
 * Hook for managing CMS cache operations
 * Provides access to cache statistics and operations for cache invalidation
 */
export function useCache() {
  const queryClient = useQueryClient();

  // Get cache statistics
  const { 
    data: cacheStats, 
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['/api/cms/cache/stats'],
    staleTime: 10000, // Refresh every 10 seconds 
  });

  // Invalidate content block
  const { mutate: invalidateContentBlock } = useMutation({
    mutationFn: async (identifier: string) => {
      return apiRequest(`/api/cms/cache/invalidate/block/${identifier}`, { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/cache/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
    }
  });

  // Invalidate content section
  const { mutate: invalidateContentSection } = useMutation({
    mutationFn: async (section: string) => {
      return apiRequest(`/api/cms/cache/invalidate/section/${section}`, { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/cache/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
    }
  });

  // Invalidate page
  const { mutate: invalidatePage } = useMutation({
    mutationFn: async (slug: string) => {
      return apiRequest(`/api/cms/cache/invalidate/page/${slug}`, { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/cache/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
    }
  });

  // Invalidate all cache
  const { mutate: invalidateAllCache, isPending: isInvalidatingAll } = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/cms/cache/invalidate/all', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/cache/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/content-blocks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
    }
  });

  // Reset cache statistics
  const { mutate: resetCacheStats, isPending: isResettingStats } = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/cms/cache/reset-stats', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/cache/stats'] });
    }
  });

  return {
    // Stats
    cacheStats: cacheStats as CacheStats,
    isLoadingStats,
    statsError,
    refetchStats,
    
    // Operations
    invalidateContentBlock,
    invalidateContentSection,
    invalidatePage,
    invalidateAllCache,
    isInvalidatingAll,
    resetCacheStats,
    isResettingStats
  };
}