import { apiRequest, cachedApiRequest } from './client.js';
import type { SearchResponse, AthleteResponse, AthleteDetail } from './types.js';

export async function searchAthletes(query: string): Promise<AthleteDetail[]> {
  if (!query.trim()) return [];

  const response = await apiRequest<SearchResponse>('/search/athletes', {
    params: {
      query,
      per_page: 10,
    },
  });

  return response.data.map(athlete => ({
    ...athlete,
    athlete_full_name: athlete.athlete_title,
  }));
}

export async function getAthleteDetails(
  athleteId: number
): Promise<AthleteDetail | null> {
  try {
    const response = await cachedApiRequest<AthleteResponse>(
      `/athletes/${athleteId}`
    );
    return {
      ...response.data,
      athlete_full_name: response.data.athlete_title,
    };
  } catch {
    return null;
  }
}

export async function getMultipleAthleteDetails(
  athleteIds: number[]
): Promise<AthleteDetail[]> {
  const results = await Promise.all(
    athleteIds.map(id => getAthleteDetails(id))
  );
  return results.filter((a): a is AthleteDetail => a !== null);
}
