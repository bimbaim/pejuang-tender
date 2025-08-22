// src/hooks/use-media-query.ts
"use client"; // This hook uses browser APIs (window.matchMedia), so it must be a Client Component hook.

import { useState, useEffect } from 'react';

/**
 * Custom React Hook to detect if a CSS media query matches the current viewport.
 * Useful for responsive rendering based on screen size.
 *
 * @param query The media query string (e.g., '(min-width: 768px)').
 * @returns boolean - true if the media query matches, false otherwise.
 */
export function useMediaQuery(query: string): boolean {
  // Initialize state with a default value, or based on a direct match if possible
  // For SSR, initial render might not match, so client-side hydration will fix this.
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window.matchMedia is available (only in browser environments)
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQueryList = window.matchMedia(query);

      // Set initial match state
      setMatches(mediaQueryList.matches);

      // Define listener function
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add event listener for changes
      mediaQueryList.addEventListener('change', listener);

      // Cleanup function: remove event listener when component unmounts
      return () => {
        mediaQueryList.removeEventListener('change', listener);
      };
    }
  }, [query]); // Re-run effect if the query string changes

  return matches;
}
