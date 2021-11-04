import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AccountModel, LoginDto, RegisterDto} from '../models/account.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  isLoggedIn = new BehaviorSubject<boolean>(false);
  currUser = new BehaviorSubject<AccountModel>(new AccountModel());
  accountURL: string;


  private readonly commonHttpHeaders;

  constructor(private http: HttpClient) {
    this.commonHttpHeaders = new HttpHeaders()
      .set('Access-Control-Allow-Methods', ['POST', 'GET', 'DELETE', 'OPTIONS', 'PUT'])
      .set('Access-Control-Allow-Headers', ['token'])
      .set('Access-Control-Allow-Origin', '*');

    this.accountURL = 'http://localhost:5000/accounts';
  }

  login(loginDto: LoginDto): Observable<AccountModel> {
    return this.http.post<AccountModel>(this.accountURL + '/login', loginDto, {
      headers: this.commonHttpHeaders
    });
  }

  register(registerDto: RegisterDto) {
    return this.http.post(this.accountURL, registerDto, {
      headers: this.commonHttpHeaders
    });
  }
}
