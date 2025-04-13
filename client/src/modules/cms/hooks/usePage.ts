import { useQuery } from '@tanstack/react-query';
import type { PageData } from '../types';

/**
 * Hook to fetch page data from the CMS
 * @param slug The page slug to fetch
 */
export function usePage(slug: string) {
  return useQuery({
    queryKey: ['/api/cms/pages', slug],
    queryFn: async () => {
      const response = await fetch(`/api/cms/pages/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch page data: ${response.statusText}`);
      }
      
      return await response.json() as PageData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}