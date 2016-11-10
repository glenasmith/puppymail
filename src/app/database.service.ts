import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState, FirebaseListObservable } from 'angularfire2';
import { PocketService, PocketEntries, PocketEntry } from './pocket.service';


@Injectable()
export class DatabaseService {

  public userId = '';

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
    let uid = this.userId;
    //let uidSafe = uid.replace(/@/g, "-at-").replace(/\./g, "-dot-");
    return `/users/${uid}/newsletters/`
  }


  deleteNewsletter(name : string) {
    let path = this.getDbKeyForUser() + name;
    console.log("Attempting to save to: ", path);
    const itemObservable = this.af.database.list(path);
    itemObservable.remove();
  }

  saveNewsletter(name: string, data: Array<PocketEntry>) {
    //this.checkLogin();

    let path = this.getDbKeyForUser() + name;
    console.log("Attempting to save to: ", path, data);
    try {
      const itemObservable = this.af.database.list(path);
      itemObservable.remove();
      itemObservable.push(data).then( (stuff) => {
        console.log(stuff);
        console.log("Save complete");
      });
    } catch (err) {
      throw err;
    }
  }

  listNewsletters(): Observable<Array<string>> {
    //this.checkLogin();

    let path = this.getDbKeyForUser();

    try {
      return this.af.database.list(path, {
        query: {
          orderByKey: true,
        }
      }).map(listOfNews => {
        let names = [];
        if (listOfNews) {
          listOfNews.forEach((nextItem) => {
            if (nextItem.hasOwnProperty('$key')) {
              let name = nextItem['$key'];
              names.push(name);
            }
          });
        }
        return names;
      })
    } catch(unlucky) {
      console.log("Bad luck listing newsletters", unlucky);
      return Observable.from([]);
    };
  }

  loadNewsletter(name: string): FirebaseListObservable<Array<Array<PocketEntry>>> {
    let path = this.getDbKeyForUser() + name;
    console.log("Attempting to load from: ", path);
    return this.af.database.list(path);
  }



}
