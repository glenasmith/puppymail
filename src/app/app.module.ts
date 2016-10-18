import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { PuppyMailRoutingModule } from './app-routing.module';

import * as firebase from 'firebase';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { PocketService } from './pocket.service';
import { LoginService } from './login.service';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PocketlinksComponent } from './pocketlinks/pocketlinks.component';

 export const firebaseConfig = {
    apiKey: "AIzaSyCWw0pm52jeu48qR1GVTt41P8yKyXU-WHc",
    authDomain: "puppemail-eeeed.firebaseapp.com",
    databaseURL: "https://puppemail-eeeed.firebaseio.com",
    storageBucket: "puppemail-eeeed.appspot.com",
    messagingSenderId: "507813501312"
  };



export const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Popup
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    SignupComponent,
    PocketlinksComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    PuppyMailRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
  ],
  providers: [LoginService, PocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
