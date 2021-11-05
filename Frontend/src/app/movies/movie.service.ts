import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tmdbModel} from "../models/the-movie-db.model";

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
    return this.http.get<tmdbModel>(`${this.themoviedbUrl}/movie/popular?apiKey=${this.themoviedbApiKey}&language=en-US&page=1`);
  }

  getTrendingMovies(): Observable<tmdbModel> {
    return this.http.get<tmdbModel>(`${this.themoviedbUrl}/trending/movie/week?api_key=${this.themoviedbApiKey}`);
  }
}
