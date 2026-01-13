import { useState, useEffect } from 'react';

/**
 * A custom hook to detect if the current viewport matches a given media query.
 * @param {string} query - The media query to match.
 * @returns {boolean} - Whether the media query matches.
 */
export function useMediaQuery(query: string): boolean {
  // State to store whether the media query matches
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window !== 'undefined') {
      // Create a MediaQueryList object
      const mediaQuery = window.matchMedia(query);

      // Set the initial value
      setMatches(mediaQuery.matches);

      // Create a callback to handle changes to the media query
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add the listener for changes
      mediaQuery.addEventListener('change', listener);

      // Clean up the listener when the component unmounts
      return () => {
        mediaQuery.removeEventListener('change', listener);
      };
    }
  }, [query]);

  return matches;
}

// Common media queries
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 767px)');
export const useIsTablet = (): boolean => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = (): boolean => useMediaQuery('(min-width: 1024px)');
