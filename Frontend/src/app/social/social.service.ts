import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {VideoProductionModel} from "../models/VideoProduction.model";
import {MessageModel} from "../models/message.model";

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  socialURL = 'http://localhost:5000/social';
  commonHttpHeaders;

  constructor(
    private http: HttpClient
  ) {
    this.commonHttpHeaders = new HttpHeaders()
      .set('Access-Control-Allow-Methods', ['POST', 'GET', 'DELETE', 'OPTIONS', 'PUT'])
      .set('Access-Control-Allow-Headers', ['token'])
      .set('Access-Control-Allow-Origin', '*');
  }

  getAllFavoritesFromFriends(token: string, id: string): Observable<VideoProductionModel[]> {
    return this.http.get<VideoProductionModel[]>(this.socialURL + '/favorites?id=' + id, {
      headers: this.commonHttpHeaders.append('token', token)
    });
  }

  getAllWatchlistItemsFromFriends(token: string, id: string): Observable<VideoProductionModel[]> {
    return this.http.get<VideoProductionModel[]>(this.socialURL + '/watchlist?id=' + id, {
      headers: this.commonHttpHeaders.append('token', token)
    });
  }

  getAllMessages(token: string): Observable<MessageModel[]> {
    return this.http.get<MessageModel[]>(this.socialURL + '/messages', {
      headers: this.commonHttpHeaders.append('token', token)
    });
  }

  sendMessage(token: string, message: MessageModel) {
    return this.http.post(this.socialURL + '/messages', message, {
      headers: this.commonHttpHeaders.append('token', token)
    });
  }
}