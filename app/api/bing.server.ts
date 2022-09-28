import axios from 'axios';
import {ENV} from '~/env';
import type {BingSearchResponse, BingSearchValue} from '~/types';
import {queryString, wrapAndMap} from './utils.server';

const {BING_API_KEY, BING_API_URL} = ENV;

const axiosClient = axios.create({
  headers: {
    'Ocp-Apim-Subscription-Key': BING_API_KEY
  }
});

export const Bing = wrapAndMap({
  async imageSearch(term: string): Promise<BingSearchValue[]> {
    const response = await axiosClient.get(`${BING_API_URL}?${queryString({q: term, count: 8})}`);
    const data = response.data as BingSearchResponse;
    return data.value;
  }
});
