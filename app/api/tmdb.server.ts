import axios from 'axios';
import {ENV} from '~/env';
import type {
  CreditDetails,
  MovieCredits,
  MovieDetails,
  PersonCombinedCredits,
  PersonDetails,
  SearchResults,
  TvCredits,
  TvDetails
} from '~/types';
import {queryString, wrapAndMap} from './utils.server';

interface MultiSearchOptions {
  language?: string; // ISO 639-1
  query: string;
  page?: number;
  include_adult?: boolean;
  region?: string; // ISO 3166-1
}

interface DetailsOptions {
  language?: string;
  append_to_response?: string;
}

const {TMDB_API_URL, TMDB_API_KEY} = ENV;

function qs(options: Record<string, any> = {}) {
  return queryString({...options, api_key: TMDB_API_KEY});
}

export const Tmdb = Object.freeze(
  wrapAndMap({
    async multiSearch(options: MultiSearchOptions): Promise<SearchResults> {
      const response = await axios.get(`${TMDB_API_URL}/search/multi?${qs(options)}`);
      return response.data;
    },
    async tvDetails(
      id: string,
      options: DetailsOptions = {append_to_response: 'credits'}
    ): Promise<TvDetails & {credits: TvCredits}> {
      const response = await axios.get(`${TMDB_API_URL}/tv/${id}?${qs(options)}`);
      return response.data;
    },
    async movieDetails(
      id: string,
      options: DetailsOptions = {append_to_response: 'credits'}
    ): Promise<MovieDetails & {credits: MovieCredits}> {
      const response = await axios.get(`${TMDB_API_URL}/movie/${id}?${qs(options)}`);
      return response.data;
    },
    async personDetails(
      id: string,
      options: DetailsOptions = {append_to_response: 'combined_credits'}
    ): Promise<PersonDetails & PersonCombinedCredits> {
      const response = await axios.get(`${TMDB_API_URL}/person/${id}?${qs(options)}`);
      return response.data;
    },
    async creditDetails(id: string): Promise<CreditDetails> {
      const response = await axios.get(`${TMDB_API_URL}/credit/${id}?${qs()}`);
      return response.data;
    }
  })
);
