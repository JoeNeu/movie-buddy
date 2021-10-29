import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {IsLoggedInGuardService} from './services/login-guard.service';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: []
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'account',
    component: LoginComponent,
    canActivate: [IsLoggedInGuardService]
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
