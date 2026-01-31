import { useState, useEffect, useRef, useCallback } from 'react';
import { searchEvents } from '../api/events.js';
import type { TriEvent } from '../api/types.js';

interface UseEventSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: TriEvent[];
  isLoading: boolean;
  error: string | null;
  clearSearch: () => void;
}

export function useEventSearch(debounceMs = 300): UseEventSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TriEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const events = await searchEvents(searchQuery);
      setResults(events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    timeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, debounceMs, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clearSearch,
  };
}
