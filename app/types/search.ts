export interface SearchResults {
  page: number;
  results: Result[];
  total_results: number;
  total_pages: number;
}

export interface Result {
  poster_path?: string;
  popularity: number;
  id: number;
  overview?: string;
  backdrop_path?: string;
  vote_average?: number;
  media_type: string;
  first_air_date?: string;
  origin_country?: string[];
  genre_ids?: number[];
  original_language?: string;
  vote_count?: number;
  name?: string;
  original_name?: string;
  adult?: boolean;
  release_date?: string;
  original_title?: string;
  title?: string;
  video?: boolean;
  profile_path?: string;
  known_for?: KnownFor[];
}

export interface KnownFor {
  poster_path: string;
  adult?: boolean;
  overview: string;
  release_date?: string;
  original_title?: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  title?: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video?: boolean;
  vote_average: number;
  first_air_date?: string;
  origin_country?: string[];
  name?: string;
  original_name?: string;
}
