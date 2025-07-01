import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      setMatches(media.matches);

      const listener = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
      };

      // Add the listener to handle changes
      media.addEventListener('change', listener);

      // Clean up
      return () => media.removeEventListener('change', listener);
    }
    return undefined;
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}