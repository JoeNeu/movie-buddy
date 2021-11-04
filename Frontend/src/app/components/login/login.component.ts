import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, EMPTY} from 'rxjs';
import {AccountService} from '../../account/account.service';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {AccountModel} from '../../models/account.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);
  registerGroup: FormGroup;
  loginError = new BehaviorSubject<boolean>(false);
  loginErrorMessage = new BehaviorSubject<string>('');

  constructor(
    // configService: ConfigService,
    private userService: AccountService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.registerGroup = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  isBlank(): boolean {
    return this.usernameControl.invalid || this.passwordControl.invalid;
  }

  // tslint:disable-next-line:typedef
  login() {
    this.loginError.next(false);
    this.loginErrorMessage.next('');

    this.userService.login({ username: this.usernameControl.value, password: this.passwordControl.value})
      .pipe(
        catchError((err: HttpErrorResponse) => {
        this.loginError.next(true);
        this.loginErrorMessage.next(err.message);
        this.userService.isLoggedIn.next(false);
        this.router.navigate(['/login']);
        return EMPTY;
      }))
      .subscribe((token: AccountModel) => {

        this.loginError.next(false);
        this.loginErrorMessage.next('');
        this.userService.isLoggedIn.next(true);
        this.userService.currUser.next(token);
        this.router.navigate(['/account']);
      });
  }

  register() {
    this.loginError.next(false);
    this.loginErrorMessage.next('');

    this.userService.register({
        firstname: this.registerGroup.value.firstname,
        lastname: this.registerGroup.value.lastname,
        username: this.registerGroup.value.username,
        password: this.registerGroup.value.password
      }
    ).pipe(
        catchError((err: HttpErrorResponse) => {
      this.loginError.next(true);
      this.loginErrorMessage.next(err.message);
      return EMPTY;
    }))
      .subscribe(() => {
        this.loginError.next(false);
        this.loginErrorMessage.next('');
        this.router.navigate(['']);
      });
  }


  ngOnInit(): void {
  }

}
