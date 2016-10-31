import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';
import { PocketService, PocketEntries, PocketEntry } from './pocket.service';


@Injectable()
export class DatabaseService {

  private loggedIn = false;

  constructor(private af : AngularFire, private pocketService : PocketService) { }

  IsLoggedIn() : boolean {
    return this.loggedIn;
  }

  login() : firebase.Promise<FirebaseAuthState> {
    let creds = this.pocketService.firebaseToken;
    console.log("Using creds", creds);
    return this.af.auth.login(creds, {
      method: AuthMethods.CustomToken
    });
    
  }


  private checkLogin() {
    if (!this.loggedIn) {
      throw "Not logged in";
    }
  }

  private getDbKeyForUser() : string {
    let uid = this.pocketService.userName;
    let uidSafe = uid.replace(/@/g, "-at-").replace(/\./g, "-dot-");
    return `/users/${uidSafe}/newsletters/`
  }

  saveNewsletter(name : string, data : Array<PocketEntry>) {
    //this.checkLogin();

    let path = this.getDbKeyForUser() + name;
    console.log("Attempting to save to: ", path);
    const itemObservable = this.af.database.object(path);
    itemObservable.set(data);

  }

  listNewsletters() {
    this.checkLogin();
    // TODO Retrieve list of keys
  }

  loadNewsletter(name : string) : Array<PocketEntry> {
    this.checkLogin();
    //TODO Retrieve existing newsletter
    return [];
  }



}
