import {cleanEnv, port, str} from 'envalid';
export const ENV = cleanEnv(process.env, {
  NEO4J_USER: str(),
  NEO4J_URI: str(),
  NEO4J_PASSWORD: str(),
  TMDB_API_KEY: str(),
  TMDB_API_URL: str(),
  BING_API_KEY: str(),
  BING_API_URL: str()
});
