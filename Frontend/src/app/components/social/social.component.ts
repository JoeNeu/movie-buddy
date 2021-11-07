import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AccountModel} from "../../models/account.model";
import {Store} from "@ngrx/store";
import {GetAllAccountsAction} from "../../account/+state/account.actions";
import {Subject} from "rxjs";
import {AccountSelectorService} from "../../account/account-selector.service";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit, AfterViewInit, OnDestroy {

  allAccounts: AccountModel[];
  private unsubscribe$ = new Subject();
  @ViewChild('tabGroup', {static: false}) tabGroup;
  private currentTab: number;
  searchText: string;

  constructor(
    private store: Store,
    private accountSelectorService: AccountSelectorService
  ) { }

  ngOnInit(): void {
    this.store.dispatch(GetAllAccountsAction());

    this.accountSelectorService.getAllAccountsFromStore().subscribe( accounts =>
      this.allAccounts = accounts
    )
  }

  ngAfterViewInit() {
    this.currentTab = this.tabGroup.selectedIndex;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.currentTab = tabChangeEvent.index;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
