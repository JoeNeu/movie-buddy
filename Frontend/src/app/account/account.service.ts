import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AccountModel, LoginDto, PasswordChangeDto, RegisterDto} from '../models/account.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CoreSelectorService} from "../core/core-selector.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  isLoggedIn = new BehaviorSubject<boolean>(false);
  currUser = new BehaviorSubject<AccountModel>(new AccountModel());

  accountURL = 'http://localhost:5000/accounts';

  commonHttpHeaders;

  constructor(
    private http: HttpClient,
  ) {
  this.commonHttpHeaders = new HttpHeaders()
      .set('Access-Control-Allow-Methods', ['POST', 'GET', 'DELETE', 'OPTIONS', 'PUT'])
      .set('Access-Control-Allow-Headers', ['token'])
      .set('Access-Control-Allow-Origin', '*');
  }

  register(registerDto: RegisterDto): Observable<AccountModel> {
    return this.http.post<AccountModel>(this.accountURL, registerDto, {
      headers: this.commonHttpHeaders
    });
  }

  login(loginDto: LoginDto): Observable<AccountModel> {
    return this.http.post<AccountModel>(this.accountURL + '/login', loginDto, {
      headers: this.commonHttpHeaders
    });
  }

  changePassword(passwordChangeDto: PasswordChangeDto, token: string): Observable<Object> {
    return this.http.put<string>(this.accountURL + '/change-password', passwordChangeDto, {
      headers: this.commonHttpHeaders.append('token', token)
    });
  }

  deleteAccount(id: string, token: string): Observable<Object> {
    return this.http.delete<string>(`${this.accountURL}/${id}`, {
      headers: this.commonHttpHeaders.append('token', token)
    });
  }

  getAllAccounts(token: string): Observable<AccountModel[]> {
    return this.http.get<AccountModel[]>(this.accountURL, {
      headers: this.commonHttpHeaders.append('token', token)
    });
  }

  getAllFriends(token: string): Observable<AccountModel[]> {
    return this.http.get<AccountModel[]>(this.accountURL + '/friends', {
      headers: this.commonHttpHeaders.append('token', token)
    });
  }

  addFriend(id: string, token: string) {
    return this.http.put(this.accountURL + '/friends/add', id ,{
      headers: this.commonHttpHeaders.append('token', token)
    });
  }

  removeFriend(id: string, token: string) {
    return this.http.put(this.accountURL + '/friends/remove', id ,{
      headers: this.commonHttpHeaders.append('token', token)
    });
  }
}
