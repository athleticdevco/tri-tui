import { apiRequest, cachedApiRequest } from './client.js';
import type {
  TriEvent,
  EventProgram,
  RaceResultEntry,
  EventSearchResponse,
  EventProgramsResponse,
  RaceResultsResponse,
} from './types.js';

export async function searchEvents(query: string): Promise<TriEvent[]> {
  if (!query.trim()) return [];

  // Search events from the last 2 years to current
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  const startDate = twoYearsAgo.toISOString().split('T')[0];

  const response = await apiRequest<EventSearchResponse>('/search/events', {
    params: {
      query,
      start_date: startDate,
      per_page: 15,
    },
  });

  return response.data;
}

export async function getEventPrograms(eventId: number): Promise<EventProgram[]> {
  try {
    const response = await cachedApiRequest<EventProgramsResponse>(
      `/events/${eventId}/programs`
    );
    return response.data || [];
  } catch {
    return [];
  }
}

export async function getRaceResults(
  eventId: number,
  programId: number
): Promise<RaceResultEntry[]> {
  try {
    const response = await cachedApiRequest<RaceResultsResponse>(
      `/events/${eventId}/programs/${programId}/results`
    );
    const results = response.data?.results || [];

    // Process results to extract split times from splits array
    // API returns splits as array of strings: [swim, T1, bike, T2, run]
    return results.map(result => {
      const splits = result.splits;
      return {
        ...result,
        swim_time: result.swim_time || (splits && splits[0]) || undefined,
        t1_time: result.t1_time || (splits && splits[1]) || undefined,
        bike_time: result.bike_time || (splits && splits[2]) || undefined,
        t2_time: result.t2_time || (splits && splits[3]) || undefined,
        run_time: result.run_time || (splits && splits[4]) || undefined,
      };
    });
  } catch {
    return [];
  }
}

export async function getEventDetails(eventId: number): Promise<TriEvent | null> {
  try {
    const response = await cachedApiRequest<{ data: TriEvent }>(
      `/events/${eventId}`
    );
    return response.data;
  } catch {
    return null;
  }
}
