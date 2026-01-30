import { useState, useEffect, useCallback } from 'react';
import { fetchRankings, type RankingsData } from '../api/rankings.js';

interface UseRankingsResult {
  rankings: RankingsData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useRankings(): UseRankingsResult {
  const [rankings, setRankings] = useState<RankingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRankings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchRankings(10);
      setRankings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rankings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRankings();
  }, [loadRankings]);

  return {
    rankings,
    isLoading,
    error,
    refresh: loadRankings,
  };
}
