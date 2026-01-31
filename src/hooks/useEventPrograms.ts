import { useState, useEffect, useCallback } from 'react';
import { getEventPrograms, getEventDetails } from '../api/events.js';
import type { TriEvent, EventProgram } from '../api/types.js';

interface UseEventProgramsResult {
  event: TriEvent | null;
  programs: EventProgram[];
  isLoading: boolean;
  error: string | null;
  loadPrograms: (eventId: number, eventData?: TriEvent) => void;
  clear: () => void;
}

export function useEventPrograms(): UseEventProgramsResult {
  const [event, setEvent] = useState<TriEvent | null>(null);
  const [programs, setPrograms] = useState<EventProgram[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPrograms = useCallback(async (eventId: number, eventData?: TriEvent) => {
    setIsLoading(true);
    setError(null);

    try {
      // Load event details and programs in parallel
      const [eventDetails, eventPrograms] = await Promise.all([
        eventData ? Promise.resolve(eventData) : getEventDetails(eventId),
        getEventPrograms(eventId),
      ]);

      setEvent(eventDetails);

      // Filter to programs that have results
      const programsWithResults = eventPrograms.filter(
        p => p.results_status === 'published' || p.results_published
      );

      // If no programs with results, show all programs
      setPrograms(programsWithResults.length > 0 ? programsWithResults : eventPrograms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load programs');
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setEvent(null);
    setPrograms([]);
    setError(null);
  }, []);

  return {
    event,
    programs,
    isLoading,
    error,
    loadPrograms,
    clear,
  };
}
