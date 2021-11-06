import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './components/login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from "@angular/material/core";
import {EffectsModule} from "@ngrx/effects";
import {StoreModule} from "@ngrx/store";
import {reducers} from "./app.store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {AccountEffects} from "./account/+state/account.effects";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from '@angular/material/expansion';
import { AccountComponent } from './components/account/account.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { TrendingComponent } from './components/trending/trending.component';
import { SocialComponent } from './components/social/social.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { MessagesComponent } from './components/messages/messages.component';
import { InfoComponent } from './components/info/info.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {IvyCarouselModule} from "angular-responsive-carousel";
import {CarouselModule} from "primeng/carousel";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import { TextFilterPipe } from './pipes/textFilter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    AccountComponent,
    HomeComponent,
    SearchComponent,
    TrendingComponent,
    SocialComponent,
    ScheduleComponent,
    MessagesComponent,
    InfoComponent,
    TextFilterPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    EffectsModule.forRoot([AccountEffects]),
    [StoreModule.forRoot(reducers)],
    StoreDevtoolsModule.instrument({
      name: 'MovieBuddy',
      maxAge: 25,
    }),
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule,
    IvyCarouselModule,
    CarouselModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
