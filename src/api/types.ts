// Types based on World Triathlon API responses

export interface Athlete {
  athlete_id: number;
  athlete_title: string;
  athlete_first: string;
  athlete_last: string;
  athlete_full_name?: string;
  athlete_country_id: number;
  athlete_gender: 'male' | 'female';
  athlete_yob: string | null;
  validated: boolean;
  athlete_profile_image: string | null;
  athlete_noc: string;
  athlete_country_name: string;
  athlete_country_isoa2: string;
  athlete_listing: string;
  athlete_flag: string;
  athlete_api_listing: string;
  athlete_categories: string[];
  points_list_ranking: number | null;
}

export interface AthleteDetail extends Athlete {
  race_wins?: number;
  race_podiums?: number;
  latest_results?: RaceResult[];
  latest_images?: AthleteImage[];
}

export interface RaceResult {
  event_id: number;
  event_title: string;
  event_date: string;
  prog_id: number;
  prog_name: string;
  position: string | number;
  result_listing?: string;
  total_time?: string;
  swim_time?: string;
  bike_time?: string;
  run_time?: string;
}

export interface AthleteImage {
  image_url: string;
  thumbnail?: string;
}

export interface RankingEntry {
  athlete_id: number;
  rank: number;
  points: number;
  athlete_title?: string;
  athlete_noc?: string;
}

export interface RankingsResponse {
  code: number;
  status: string;
  data: {
    ranking_id: number;
    ranking_name: string;
    rankings: RankingEntry[];
  };
}

export interface SearchResponse {
  code: number;
  status: string;
  current_page: number;
  data: Athlete[];
  total: number;
}

export interface AthleteResponse {
  code: number;
  status: string;
  data: AthleteDetail;
}

export type View = 'rankings' | 'search' | 'athlete' | 'events' | 'event-programs' | 'race-results';
export type Column = 'men' | 'women';
export type SearchContext = 'athletes' | 'events';

// Event types
export interface TriEvent {
  event_id: number;
  event_title: string;
  event_date: string;
  event_venue: string | null;
  event_country: string | null;
  event_country_noc?: string;
  event_listing?: string;
  event_categories?: string[];
}

export interface EventProgram {
  prog_id: number;
  prog_name: string;
  prog_date?: string;
  prog_distance?: string;
  results_status?: string;
  results_published?: boolean;
}

export interface RaceResultEntry {
  position: number | string;
  athlete_id: number;
  athlete_title: string;
  athlete_noc: string;
  total_time?: string;
  swim_time?: string;
  t1_time?: string;
  bike_time?: string;
  t2_time?: string;
  run_time?: string;
  // API returns splits as array of time strings: [swim, T1, bike, T2, run]
  splits?: string[];
}

export interface EventSearchResponse {
  code: number;
  status: string;
  current_page: number;
  data: TriEvent[];
  total: number;
}

export interface EventProgramsResponse {
  code: number;
  status: string;
  data: EventProgram[];
}

export interface RaceResultsResponse {
  code: number;
  status: string;
  data: {
    prog_id: number;
    prog_name: string;
    results: RaceResultEntry[];
  };
}
