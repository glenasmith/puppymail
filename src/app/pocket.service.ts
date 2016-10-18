import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Rx';  
import { Router } from '@angular/router';

@Injectable()
export class PocketService {

  private POCKET_AUTH_REQUEST_URI = 'https://getpocket.com/v3/oauth/request';
  private POCKET_AUTH_REDIRECT_URI_BASE = 'https://getpocket.com/auth/authorize';
  private POCKET_AUTH_AUTHORIZE_URI = 'https://getpocket.com/v3/oauth/authorize';


  // ?request_token=YOUR_REQUEST_TOKEN&redirect_uri=YOUR_REDIRECT_URI

  userName : string = '';
  code : string = '';
  accessToken : string = '';

  private POCKET_RETURN_URL = 'http://localhost:4200/login?backFromPocket'

  // Check out https://getpocket.com/developer/docs/authentication
  constructor(private http: Http, private router : Router) { }

  public getRequestToken(): Promise<string> {

    //let headers = new Headers();
    // append custom headers if required

    let data = {
      consumer_key: environment.pocketKey,
      redirect_uri: this.POCKET_RETURN_URL,
      state: 'myCustomStateGoesHere'
    }

    return this.http.post(this.POCKET_AUTH_REQUEST_URI, data).
      do((resp: Response) => { console.log(resp.json()) })

      .map(
      (resp: Response) => {
        if (resp.ok) {
          this.code = resp.json().code;
          return resp.json().code
        }
        throw resp.text;
      }).toPromise();

  }

  public redirectToLogin(requestToken: string) {

    let redirectUrl = `${this.POCKET_AUTH_REDIRECT_URI_BASE}?request_token=${requestToken}&redirect_uri=${this.POCKET_RETURN_URL}`;

    this.router.navigateByUrl(redirectUrl);

  }


  public getUserAccessToken(requestToken : string): Promise<string> {

    //let headers = new Headers();
    // append custom headers if required

    let data = {
      consumer_key: environment.pocketKey,
      code: requestToken
    }

    return this.http.post(this.POCKET_AUTH_AUTHORIZE_URI, data).
      do((resp: Response) => { console.log(resp.json()) })

      .map(
      (resp: Response) => {
        if (resp.ok) {
          this.userName = resp.json().username;
          this.accessToken = resp.json().access_token;
          return resp.json().access_token;
        }
        throw resp.text;
      }).toPromise();

  }






}
