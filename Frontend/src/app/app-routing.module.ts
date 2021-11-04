import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {IsLoggedInGuardService} from './guards/login-guard.service';
import {AccountComponent} from "./components/account/account.component";
import {HomeComponent} from "./components/home/home.component";
import {ScheduleComponent} from "./components/schedule/schedule.component";
import {SocialComponent} from "./components/social/social.component";
import {SearchComponent} from "./components/search/search.component";
import {TrendingComponent} from "./components/trending/trending.component";

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
    path: 'schedule',
    component: ScheduleComponent,
    canActivate: []
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {enableTracing: false, useHash: true})
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule {
}
