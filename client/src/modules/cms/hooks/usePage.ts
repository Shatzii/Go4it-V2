/**
 * usePage Hook
 * 
 * Custom hook for fetching and managing complete page data from the CMS.
 */

import { useQuery } from '@tanstack/react-query';
import { getPageData } from '../services/contentService';

/**
 * Hook to fetch complete page data for a given slug
 * @param slug The page slug/URL to fetch data for
 */
export function usePage(slug: string) {
  return useQuery({
    queryKey: ['/api/page', slug],
    queryFn: () => getPageData(slug),
    enabled: !!slug,
    // Add a stale time to prevent excessive refetching
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}