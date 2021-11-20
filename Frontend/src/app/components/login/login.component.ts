import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from "@ngrx/store";
import {LoginAction, RegisterAction} from "../../account/+state/account.actions";
import {takeUntil} from "rxjs/operators";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);
  registerGroup: FormGroup;
  @ViewChild('tabGroup') tabGroup;
  currentTab: number;
  nextPage: string;
  private unsubscribe$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private store: Store
  ) {
    this.registerGroup = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(params => {
      this.nextPage = params['route'] || 'account';
    })
    // Debugging for instant login
    this.login()
  }

  ngAfterViewInit() {
    this.currentTab = this.tabGroup.selectedIndex;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.currentTab = tabChangeEvent.index;
  }

  isBlank(): boolean {
    return (this.usernameControl.invalid || this.passwordControl.invalid)
  }

  submit() {
    this.currentTab == 0 ? this.login() : this.register()
  }

  // login() {
  //   if(this.isBlank()) return
  //   this.store.dispatch(LoginAction({
  //     loginDto: {
  //       username: this.usernameControl.value,
  //       password: this.passwordControl.value
  //     },
  //     route: this.nextPage
  //   }));
  // }

  //Debugging for instant login
  login() {
    this.store.dispatch(LoginAction({
      loginDto: {
        username: "admin",
        password: "admin"
      },
      route: "account"
    }));
  }

  register() {
    if(!this.registerGroup.invalid)
    this.store.dispatch(RegisterAction({
      registerDto: {
        firstname: this.registerGroup.value.firstname,
        lastname: this.registerGroup.value.lastname,
        username: this.registerGroup.value.username,
        password: this.registerGroup.value.password
      },
      route: this.nextPage
    }));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
