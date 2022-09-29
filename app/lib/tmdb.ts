import type {BackdropSize, LogoSize, PosterSize, ProfileSize, StillSize} from '~/types';

// const BASE_URL = 'http://image.tmdb.org/t/p/';
const BASE_URL = 'https://image.tmdb.org/t/p/';

export function posterUrl(path?: string | null, size: PosterSize = 'original'): string {
  if (!path) {
    return '';
  }
  return `${BASE_URL}${size}${path}`;
}

export function backdropUrl(path?: string | null, size: BackdropSize = 'original'): string {
  if (!path) {
    return '';
  }
  return `${BASE_URL}${size}${path}`;
}

export function logoUrl(path?: string | null, size: LogoSize = 'original'): string {
  if (!path) {
    return '';
  }
  return `${BASE_URL}${size}${path}`;
}

export function profileUrl(path?: string | null, size: ProfileSize = 'original'): string {
  if (!path) {
    return '';
  }
  return `${BASE_URL}${size}${path}`;
}

export function stillUrl(path?: string | null, size: StillSize = 'original'): string {
  if (!path) {
    return '';
  }
  return `${BASE_URL}${size}${path}`;
}

function getPosterSize(width: number, _height: number): PosterSize {
  if (width <= 92) {
    return 'w92';
  }
  if (width <= 154) {
    return 'w154';
  }
  if (width <= 185) {
    return 'w185';
  }
  if (width <= 342) {
    return 'w342';
  }
  if (width <= 500) {
    return 'w500';
  }
  return 'original';
}

function getProfileSize(width: number, height: number): ProfileSize {
  if (width <= 45) {
    return 'w45';
  }
  if (width <= 185) {
    return 'w185';
  }
  if (height <= 632) {
    return 'h632';
  }
  return 'original';
}

function getBackdropSize(width: number, _height: number): BackdropSize {
  if (width <= 300) {
    return 'w300';
  }
  if (width <= 780) {
    return 'w780';
  }
  if (width <= 1280) {
    return 'w1280';
  }
  return 'original';
}

function getLogoSize(width: number, _height: number): LogoSize {
  if (width <= 45) {
    return 'w45';
  }
  if (width <= 92) {
    return 'w92';
  }
  if (width <= 154) {
    return 'w154';
  }
  if (width <= 185) {
    return 'w185';
  }
  if (width <= 300) {
    return 'w300';
  }
  if (width <= 500) {
    return 'w500';
  }
  return 'original';
}

function getStillSize(width: number, _height: number): StillSize {
  if (width <= 92) {
    return 'w92';
  }
  if (width <= 185) {
    return 'w185';
  }
  if (width <= 300) {
    return 'w300';
  }
  return 'original';
}

export type ModelWithImages = Partial<
  Record<'backdrop_path' | 'profile_path' | 'poster_path' | 'logo_path' | 'still_path', string | null>
>;

export function getImageUrl(model: ModelWithImages, width: number, height: number): string {
  if ('poster_path' in model && model.poster_path) {
    const size = getPosterSize(width, height);
    return posterUrl(model.poster_path, size);
  }
  if ('profile_path' in model && model.profile_path) {
    const size = getProfileSize(width, height);
    return profileUrl(model.profile_path, size);
  }
  if ('backdrop_path' in model && model.backdrop_path) {
    const size = getBackdropSize(width, height);
    return backdropUrl(model.backdrop_path, size);
  }
  if ('logo_path' in model && model.logo_path) {
    const size = getLogoSize(width, height);
    return logoUrl(model.logo_path, size);
  }
  if ('still_path' in model && model.still_path) {
    const size = getStillSize(width, height);
    return stillUrl(model.still_path, size);
  }
  return '';
}
