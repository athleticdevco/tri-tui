import { useState, useEffect } from 'react';
import { apiRequest } from '../api/client.js';
import type { TriEvent, EventSearchResponse } from '../api/types.js';

interface UseRecentEventsResult {
  events: TriEvent[];
  isLoading: boolean;
  error: string | null;
}

export function useRecentEvents(): UseRecentEventsResult {
  const [events, setEvents] = useState<TriEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentEvents() {
      try {
        // Fetch past events - use end_date as today to get completed events
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const endDate = today.toISOString().split('T')[0];
        const startDate = sixMonthsAgo.toISOString().split('T')[0];

        const response = await apiRequest<EventSearchResponse>('/events', {
          params: {
            start_date: startDate,
            end_date: endDate,
            per_page: 15,
            order: 'desc',
          },
        });

        // Sort by date descending (most recent first) and filter out future events
        const now = new Date();
        const pastEvents = (response.data || []).filter(e => {
          const eventDate = new Date(e.event_date || 0);
          return eventDate <= now;
        });
        
        const sorted = pastEvents.sort((a, b) => {
          const dateA = new Date(a.event_date || 0);
          const dateB = new Date(b.event_date || 0);
          return dateB.getTime() - dateA.getTime();
        });

        setEvents(sorted.slice(0, 10));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentEvents();
  }, []);

  return { events, isLoading, error };
}
