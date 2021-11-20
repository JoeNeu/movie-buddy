import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {IsLoggedInGuardService} from './guards/login-guard.service';
import {AccountComponent} from './components/account/account.component';
import {HomeComponent} from './components/home/home.component';
import {ScheduleComponent} from './components/schedule/schedule.component';
import {SocialComponent} from './components/social/social.component';
import {SearchComponent} from './components/search/search.component';
import {TrendingComponent} from './components/trending/trending.component';
import {InfoComponent} from './components/info/info.component';
import {MessagesComponent} from './components/messages/messages.component';
import {FavoritesComponent} from './components/favorites/favorites.component';
import {WatchlistComponent} from './components/watchlist/watchlist.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: []
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'trending',
    component: TrendingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [IsLoggedInGuardService]
  },
  {
    path: 'social',
    component: SocialComponent,
    canActivate: [IsLoggedInGuardService]
  },
  {
    path: 'info',
    component: InfoComponent,
    canActivate: [IsLoggedInGuardService]
  },
  {
    path: 'message',
    component: MessagesComponent,
    canActivate: [IsLoggedInGuardService]
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
    canActivate: []
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [IsLoggedInGuardService]
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
    canActivate: [IsLoggedInGuardService]
  },
  {
    path: 'detail',
    component: WatchlistComponent,
    canActivate: []
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {enableTracing: false, useHash: true, anchorScrolling: 'enabled', scrollOffset: [0, 50]})
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule {
}
