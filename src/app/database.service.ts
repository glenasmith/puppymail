import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState, FirebaseListObservable } from 'angularfire2';
import { PocketService, PocketEntries, PocketEntry } from './pocket.service';


@Injectable()
export class DatabaseService {

  private loggedIn = false;

  constructor(private af: AngularFire, private pocketService: PocketService) { }

  IsLoggedIn(): boolean {
    return this.loggedIn;
  }

  login(): firebase.Promise<FirebaseAuthState> {
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

  private getDbKeyForUser(): string {
    let uid = this.pocketService.userName;
    let uidSafe = uid.replace(/@/g, "-at-").replace(/\./g, "-dot-");
    return `/users/${uidSafe}/newsletters/`
  }

  saveNewsletter(name: string, data: Array<PocketEntry>) {
    //this.checkLogin();

    let path = this.getDbKeyForUser() + name;
    console.log("Attempting to save to: ", path);
    const itemObservable = this.af.database.list(path);
    itemObservable.remove();
    itemObservable.push(data);
  }

  listNewsletters(): Observable<Array<string>> {
    //this.checkLogin();

    let path = this.getDbKeyForUser();

    return this.af.database.list(path, {
      query: {
        orderByKey: true,
      }
    }).map(listOfNews => {
      let names = [];
      if (listOfNews) {
        listOfNews.forEach((nextItem) => {
          let name = nextItem['$key'];
          names.push(name);
        });
      }
      return names;
    });
  }

  loadNewsletter(name: string): FirebaseListObservable<Array<Array<PocketEntry>>> {
    let path = this.getDbKeyForUser() + name;
    console.log("Attempting to load from: ", path);
    return this.af.database.list(path);
  }



}
