export class tmdbModel {
  page: number;
  results: [tmdbMovie | tmdbTvShow];
  total_results: number;
  total_pages: number;
}


class tmdbVideo {
  id: number;
  genre_ids: [number];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  path: string;
  backdrop_path?: string;
  poster_path?: string;
}


export class tmdbMovie extends tmdbVideo {
  adult: boolean;
  overview: string;
  release_date: string;
  original_title: string;
  title: string;
  video: boolean;
}

export class tmdbTvShow extends tmdbVideo {
  first_air_date: string;
  name: string;
  original_country: string;
  original_name: string;
  overview: string;
}
