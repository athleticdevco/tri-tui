import { cachedApiRequest } from './client.js';
import { getMultipleAthleteDetails } from './athletes.js';
import type { RankingsResponse, AthleteDetail } from './types.js';

// WTCS Rankings IDs
const RANKING_IDS = {
  male: 15,
  female: 16,
} as const;

export interface RankingsData {
  men: AthleteDetail[];
  women: AthleteDetail[];
  title: string;
}

export async function fetchRankings(limit = 10): Promise<RankingsData> {
  // Fetch both rankings in parallel
  const [menResponse, womenResponse] = await Promise.all([
    cachedApiRequest<RankingsResponse>(`/rankings/${RANKING_IDS.male}`),
    cachedApiRequest<RankingsResponse>(`/rankings/${RANKING_IDS.female}`),
  ]);

  // Extract athlete IDs from rankings
  const menIds = menResponse.data.rankings.slice(0, limit).map(r => r.athlete_id);
  const womenIds = womenResponse.data.rankings.slice(0, limit).map(r => r.athlete_id);

  // Fetch detailed athlete data in parallel
  const [menAthletes, womenAthletes] = await Promise.all([
    getMultipleAthleteDetails(menIds),
    getMultipleAthleteDetails(womenIds),
  ]);

  return {
    men: menAthletes,
    women: womenAthletes,
    title: 'WTCS Rankings',
  };
}
