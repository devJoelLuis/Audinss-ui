
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import localePt from '@angular/common/locales/pt';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { CoreModule } from './core/core.module';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import {MessageService} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';


import { Ng2ImgMaxService } from 'ng2-img-max';


import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
//import { JwtModule } from '@auth0/angular-jwt';
import { HttpInterceptService } from './core/seguranca/http-intercept.service';
import { registerLocaleData } from '@angular/common';



/*
export function tokenGetter() {
  return localStorage.getItem('token');
}

const jwtConf = {
  config: {
    tokenGetter: tokenGetter,
    whitelistedDomains: environment.whitelistedDomains,
    blacklistedRoutes: [ new RegExp('\/oauth\/token') ]
  }
};
*/

registerLocaleData(localePt);


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,

  ],
  imports: [
BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    CoreModule,
    HttpClientModule,

  ],
  providers: [
    MessageService,
    ConfirmationService,
    Ng2ImgMaxService,
    {provide: LOCALE_ID, useValue: 'pt' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptService,
      multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
