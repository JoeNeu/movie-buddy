import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Subject} from "rxjs";
import {select, Store} from "@ngrx/store";
import {takeUntil} from "rxjs/operators";
import {getCurrentUser} from "../../core/+state/core.reducer";
import {AccountModel} from "../../models/account.model";
import {FormControl, Validators} from "@angular/forms";
import {ChangePasswordAction, DeleteAccountAction} from "../../account/+state/account.actions";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, AfterViewInit, OnDestroy {

  passwordControl = new FormControl('', [Validators.required]);
  @ViewChild('tabGroup') tabGroup;
  currentTab: number;
  private unsubscribe$ = new Subject();

  public currentUser: AccountModel
  public deleteAccountChecked: boolean

  constructor(
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.store.pipe(
      takeUntil(this.unsubscribe$),
      select(getCurrentUser)
    ).subscribe((account: AccountModel) =>
      this.currentUser = account
    )
  }

  ngAfterViewInit() {
    this.currentTab = this.tabGroup.selectedIndex;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.currentTab = tabChangeEvent.index;
  }

  changePassword() {
    this.store.dispatch(ChangePasswordAction(
      {
        passwordChangeDto: {
          username: this.currentUser.username,
          newPassword: this.passwordControl.value
        }
      }
    ))
  }

  deleteAccount() {
    this.store.dispatch(DeleteAccountAction())
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
