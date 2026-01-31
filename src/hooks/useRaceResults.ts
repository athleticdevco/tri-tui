import { useState, useCallback } from 'react';
import { getRaceResults } from '../api/events.js';
import type { TriEvent, EventProgram, RaceResultEntry } from '../api/types.js';

interface UseRaceResultsResult {
  event: TriEvent | null;
  program: EventProgram | null;
  results: RaceResultEntry[];
  isLoading: boolean;
  error: string | null;
  loadResults: (eventId: number, programId: number, eventData?: TriEvent, programData?: EventProgram) => void;
  clear: () => void;
}

export function useRaceResults(): UseRaceResultsResult {
  const [event, setEvent] = useState<TriEvent | null>(null);
  const [program, setProgram] = useState<EventProgram | null>(null);
  const [results, setResults] = useState<RaceResultEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadResults = useCallback(async (
    eventId: number,
    programId: number,
    eventData?: TriEvent,
    programData?: EventProgram
  ) => {
    setIsLoading(true);
    setError(null);

    // Set event/program info immediately if provided
    if (eventData) setEvent(eventData);
    if (programData) setProgram(programData);

    try {
      const raceResults = await getRaceResults(eventId, programId);
      setResults(raceResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setEvent(null);
    setProgram(null);
    setResults([]);
    setError(null);
  }, []);

  return {
    event,
    program,
    results,
    isLoading,
    error,
    loadResults,
    clear,
  };
}
