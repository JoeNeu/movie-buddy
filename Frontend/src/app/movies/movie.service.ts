import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tmdbModel, tmdbMovie, tmdbTvShow} from '../models/the-movie-db.model';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private readonly themoviedbApiKey;
  private readonly themoviedbUrl;

  constructor(
    private http: HttpClient,
  ) {

    //https://developers.themoviedb.org/3/getting-started/introduction
    this.themoviedbApiKey = environment.themoviedbApiKey;
    this.themoviedbUrl = environment.themoviedbUrl;
  }

  getPopularMovies(): Observable<tmdbModel> {
    return this.http.get<tmdbModel>(`${this.themoviedbUrl}/movie/popular?api_key=${this.themoviedbApiKey}&language=en-US&page=1`);
  }

  getTrendingMovies(): Observable<tmdbModel> {
    return this.http.get<tmdbModel>(`${this.themoviedbUrl}/trending/movie/week?api_key=${this.themoviedbApiKey}`);
  }

  getMovieSearchResult(searchValue): Observable<tmdbModel> {
    return this.http.get<tmdbModel>(`${this.themoviedbUrl}/search/movie?api_key=${this.themoviedbApiKey}&query=${searchValue}`);
  }

  getTvShowSearchResult(searchValue): Observable<tmdbModel> {
    return this.http.get<tmdbModel>(`${this.themoviedbUrl}/search/tv?api_key=${this.themoviedbApiKey}&query=${searchValue}`);
  }

  getMovieById(id): Observable<tmdbMovie> {
    return this.http.get<tmdbMovie>(`${this.themoviedbUrl}/movie/${id}?api_key=${this.themoviedbApiKey}`).pipe(
      map(movie => {
        return {...movie, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movie.poster_path}
      })
    );
  }

  getTvShowById(id): Observable<tmdbTvShow> {
    return this.http.get<tmdbTvShow>(`${this.themoviedbUrl}/tv/${id}?api_key=${this.themoviedbApiKey}`).pipe(
      map(movie => {
        return {...movie, path: 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2' + movie.poster_path}
      })
    );
  }

  getSimilarMoviesForId(id): Observable<tmdbModel> {
    return this.http.get<tmdbModel>(`${this.themoviedbUrl}/movie/${id}/similar?api_key=${this.themoviedbApiKey}`);
  }

  getSimilarTvShowsForId(id): Observable<tmdbModel> {
    return this.http.get<tmdbModel>(`${this.themoviedbUrl}/tv/${id}/similar?api_key=${this.themoviedbApiKey}`);
  }

  getSeasonForTvShowById(id, seasonNumber): Observable<tmdbTvShow> {
    return this.http.get<tmdbTvShow>(`${this.themoviedbUrl}/tv/${id}/season/${seasonNumber}?api_key=${this.themoviedbApiKey}`);
  }

  getEpisodeForTvShowById(id, seasonNumber, episodeNumber): Observable<tmdbTvShow> {
    return this.http.get<tmdbTvShow>(`${this.themoviedbUrl}/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${this.themoviedbApiKey}`);
  }

  getEpisodeImagesForTvShowById(id, seasonNumber, episodeNumber): Observable<any> {
    return this.http.get<any>(`${this.themoviedbUrl}/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/images?api_key=${this.themoviedbApiKey}`);
  }

  getMoviesForActor(actorId): Observable<tmdbMovie[]> {
    return this.http.get<tmdbMovie[]>(`${this.themoviedbUrl}/person/${actorId}/movie_credits?api_key=${this.themoviedbApiKey}`);
  }

  getTvShowsForActor(actorId): Observable<tmdbTvShow[]> {
    return this.http.get<tmdbTvShow[]>(`${this.themoviedbUrl}/person/${actorId}/tv_credits?api_key=${this.themoviedbApiKey}`);
  }
}
