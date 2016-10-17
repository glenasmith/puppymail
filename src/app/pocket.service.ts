import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../environments/environment';

@Injectable()
export class PocketService {

  private POCKET_AUTH_URI = 'https://getpocket.com/v3/oauth/request';

  // Check out https://getpocket.com/developer/docs/authentication
  constructor(private http : Http) { }

  public login() {

    let headers = new Headers();
    // append custom headers if required

    let data = {
      consumer_key: environment.pocketKey,
      redirect_uri: './login.html'

    }

    this.http.post(this.POCKET_AUTH_URI, data, headers).subscribe(
      (response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      }
    );



  }




}
