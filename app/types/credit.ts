interface CreditDetailsBase {
  credit_type: string;
  department: string;
  job: string;
  id: string;
  person: CreditPerson;
}

export interface MovieCreditDetails extends CreditDetailsBase {
  media: MovieCreditMedia;
  media_type: 'movie';
}

export interface MovieCreditMedia {
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  poster_path: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  overview: string;
  release_date: string;
  id: number;
  title: string;
  adult: boolean;
  popularity: number;
  character: string;
}

export interface TvCreditDetails extends CreditDetailsBase {
  media: TvCreditMedia;
  media_type: 'tv';
}

export interface TvCreditMedia {
  id: number;
  name: string;
  original_name: string;
  character: string;
  episodes: any[];
  seasons: CreditSeason[];
}

export type CreditDetails = TvCreditDetails | MovieCreditDetails;

export interface CreditSeason {
  air_date: string;
  poster_path: string;
  season_number: number;
}

export interface CreditPerson {
  name: string;
  id: number;
}
