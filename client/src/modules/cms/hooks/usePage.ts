import { useQuery } from '@tanstack/react-query';
import { PageData } from '../types';
import { getPage } from '../services/contentService';

/**
 * Hook to fetch a page from the CMS by its slug
 * @param slug The unique page slug/identifier
 * @param options Additional react-query options
 * @returns Query result with the page data
 */
export function usePage(
  slug: string,
  options: { enabled?: boolean } = {}
) {
  return useQuery<PageData>({
    queryKey: ['/api/cms/pages', slug],
    queryFn: async () => {
      const response = await getPage(slug);
      return response;
    },
    ...options,
  });
}