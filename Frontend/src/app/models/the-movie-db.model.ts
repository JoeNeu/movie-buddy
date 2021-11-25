export class tmdbModel {
  page: number;
  results: [tmdbMovie | tmdbTvShow];
  total_results: number;
  total_pages: number;
}


export class tmdbVideo {
  id: number;
  genre_ids: [number];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  path: string;
  backdrop_path?: string;
  poster_path?: string;
  overview: string;
  status: string;
  genres?: Genre[];
}


export class tmdbMovie extends tmdbVideo {
  adult: boolean;
  budget: number;
  release_date: string;
  original_title: string;
  title: string;
  video: boolean;
  runtime: number;
  revenue: number;
}

export class tmdbTvShow extends tmdbVideo {
  first_air_date: string;
  name: string;
  origin_country: [string];
  original_name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: [SeasonInfo];
  last_episode_to_air: EpisodeInfo;
  episode_run_time: [number];
  created_by: [Creator];
}

export class SeasonInfo {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path?: string;
  season_number: number;
}

export class EpisodeInfo {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
}

export class Creator {
  id: number;
  name: string;
}

export class Genre {
  id: number;
  name: string;
}
