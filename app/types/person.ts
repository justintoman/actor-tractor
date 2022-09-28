export interface PersonDetails {
  birthday: string;
  known_for_department: string;
  deathday: any;
  id: number;
  name: string;
  also_known_as: string[];
  gender: number;
  biography: string;
  popularity: number;
  place_of_birth: string;
  profile_path?: string;
  adult: boolean;
  imdb_id: string;
  homepage: any;
}

export interface PersonCombinedCredits {
  cast: Array<PersonMovieCast | PersonTvCast>;
  crew: Array<PersonMovieCrew | PersonTvCrew>;
  id: number;
}

export interface PersonMovieCredits {
  cast: PersonMovieCast[];
  crew: PersonMovieCrew[];
  id: number;
}

export interface PersonMovieCast {
  character: string;
  credit_id: string;
  release_date: string;
  vote_count: number;
  video: boolean;
  adult: boolean;
  vote_average: number;
  title: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  id: number;
  backdrop_path?: string;
  overview: string;
  poster_path?: string;
}

export interface PersonMovieCrew {
  id: number;
  department: string;
  original_language: string;
  original_title: string;
  job: string;
  overview: string;
  vote_count: number;
  video: boolean;
  poster_path?: string;
  backdrop_path?: string;
  title: string;
  popularity: number;
  genre_ids: number[];
  vote_average: number;
  adult: boolean;
  release_date: string;
  credit_id: string;
}

export interface PersonTvCredits {
  cast: PersonTvCast[];
  crew: PersonTvCrew[];
  id: number;
}

export interface PersonTvCast {
  credit_id: string;
  original_name: string;
  id: number;
  genre_ids: number[];
  character: string;
  name: string;
  poster_path?: string;
  vote_count: number;
  vote_average: number;
  popularity: number;
  episode_count: number;
  original_language: string;
  first_air_date: string;
  backdrop_path?: string;
  overview: string;
  origin_country: string[];
}

export interface PersonTvCrew {
  id: number;
  department: string;
  original_language: string;
  episode_count: number;
  job: string;
  overview: string;
  origin_country: string[];
  original_name: string;
  genre_ids: number[];
  name: string;
  first_air_date: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
  poster_path: string;
  credit_id: string;
}
