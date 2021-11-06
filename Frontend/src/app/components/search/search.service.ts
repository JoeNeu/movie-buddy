import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MovieSearchResultModel} from '../../models/movie-search-result.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchURL = 'http://localhost:5000/movie-search';

  commonHttpHeaders;

  constructor(
    private http: HttpClient,
  ) {
    this.commonHttpHeaders = new HttpHeaders()
      .set('Access-Control-Allow-Methods', ['POST', 'GET', 'DELETE', 'OPTIONS', 'PUT'])
      .set('Access-Control-Allow-Headers', ['token'])
      .set('Access-Control-Allow-Origin', '*');
  }

  searchMovieTitle(searchInput: string): Observable<MovieSearchResultModel[]> {
    return this.http.get<MovieSearchResultModel[]>(this.searchURL + '?title=' + searchInput, {headers: this.commonHttpHeaders});
  }
}
