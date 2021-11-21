import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatSidenav} from "@angular/material/sidenav";
import {Subject} from "rxjs";
import {select, Store} from "@ngrx/store";
import {getCurrentUser} from "../../core/+state/core.reducer";
import {takeUntil} from "rxjs/operators";
import {AccountModel} from "../../models/account.model";
import {LogoutActionSuccess} from "../../account/+state/account.actions";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') sidenav: MatSidenav;
  private unsubscribe$ = new Subject();
  currentUser;

  constructor(
    private router: Router,
    private store: Store
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.sidenav.toggle()
    }, 1000)

    this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(getCurrentUser)
    ).subscribe((user: AccountModel) => this.currentUser = user)
  }

  infoButton() {
    this.router.navigate(['info']);
  }

  messageButton() {
    this.router.navigate(['messages']);
  }

  accountButton() {
    this.store.dispatch(LogoutActionSuccess())
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
