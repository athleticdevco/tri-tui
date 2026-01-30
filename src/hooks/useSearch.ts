import { useState, useEffect, useRef, useCallback } from 'react';
import { searchAthletes } from '../api/athletes.js';
import type { AthleteDetail } from '../api/types.js';

interface UseSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: AthleteDetail[];
  isLoading: boolean;
  error: string | null;
  clearSearch: () => void;
}

export function useSearch(debounceMs = 300): UseSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AthleteDetail[]>([]);
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
      const athletes = await searchAthletes(searchQuery);
      setResults(athletes);
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
