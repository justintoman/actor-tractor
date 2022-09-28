import type {MovieCast, MovieDetails} from './movie';
import type {PersonDetails} from './person';
import type {TvCast, TvDetails} from './tv';

type KeysOf<T, K extends keyof T> = K;

type MovieIgnoredKeys = KeysOf<
  MovieDetails,
  | 'id'
  | 'title'
  | 'adult'
  | 'original_title'
  | 'belongs_to_collection'
  | 'homepage'
  | 'production_companies'
  | 'production_countries'
  | 'vote_average'
  | 'vote_count'
  | 'video'
  | 'genres'
  | 'spoken_languages'
>;
export interface MovieNode
  extends Omit<MovieDetails, MovieIgnoredKeys>,
    Record<string, string | number | string[] | number[]> {
  type: 'movie';
  id: string;
  name: string;
  original_name: string;
  backdrop_path: string;
  poster_path: string;
}

type TvIgnoredKeys = KeysOf<
  TvDetails,
  | 'id'
  | 'homepage'
  | 'networks'
  | 'production_companies'
  | 'production_countries'
  | 'last_episode_to_air'
  | 'vote_average'
  | 'vote_count'
  | 'created_by'
  | 'seasons'
  | 'spoken_languages'
  | 'genres'
  | 'in_production'
>;
export interface TvNode extends Omit<TvDetails, TvIgnoredKeys>, Record<string, string | number | string[] | number[]> {
  type: 'tv';
  id: string;
}

type PersonIgnoredKeys = KeysOf<PersonDetails, 'adult' | 'id'>;

export interface PersonNode extends Omit<PersonDetails | MovieCast | TvCast, PersonIgnoredKeys> {
  id: string;
}

type CreditIgnoredKeys = KeysOf<
  TvCast | MovieCast,
  | 'adult'
  | 'character'
  | 'gender'
  | 'id'
  | 'known_for_department'
  | 'name'
  | 'original_name'
  | 'popularity'
  | 'profile_path'
>;
export interface ActedInEdge
  extends Omit<TvCast | MovieCast, CreditIgnoredKeys>,
    Record<string, string | number | string[] | number[]> {
  credit_id: string;
  character_name: string;
  character_image: string;
  order: number;
}

export interface UserNode {
  id: string;
}

export type TitleResponse = {
  relatedRoles: Array<RelatedRoles>;
} & (MovieResponse | TvResponse);

export interface MovieResponse {
  title: MovieNode;
  cast: Array<{
    actor: PersonNode;
    role: ActedInEdge;
  }>;
}

export interface TvResponse {
  title: TvNode;
  cast: Array<{
    actor: PersonNode;
    role: ActedInEdge;
  }>;
}

export interface RelatedRoles {
  actor: PersonNode;
  roles: Array<{
    title: MovieNode | TvNode;
    role: ActedInEdge;
  }>;
}
