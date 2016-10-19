import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Rx';  
import { Router } from '@angular/router';

@Injectable()
export class PocketService {

  // proxy will send to = https://getpocket.com/
  private REAL_POCKET_BASE = 'https://getpocket.com/'; 
  private PROXY = 'http://localhost:3000/proxy';
  private POCKET_AUTH_REQUEST_URI = '/v3/oauth/request';
  private POCKET_AUTH_REDIRECT_URI_BASE = '/auth/authorize';
  private POCKET_AUTH_AUTHORIZE_URI = '/v3/oauth/authorize';


  // ?request_token=YOUR_REQUEST_TOKEN&redirect_uri=YOUR_REDIRECT_URI

  userName : string = '';
  code : string = '';
  accessToken : string = '';

  private POCKET_RETURN_URL = 'http://localhost:4200/login/backFromPocket'

  // Check out https://getpocket.com/developer/docs/authentication
  constructor(private http: Http, private router : Router) { }

  public getRequestToken(): Promise<string> {

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    //headers.append('Content-Type', 'application/json');
    //headers.append('X-Accept', 'application/x-www-form-urlencoded');
    // append custom headers if required

    let dataJSON = {
      consumer_key: environment.pocketKey,
      redirect_uri: encodeURIComponent(this.POCKET_RETURN_URL),
      state: 'myCustomStateGoesHere'
    }



    let data = `consumer_key=${dataJSON.consumer_key}&redirect_uri=${dataJSON.redirect_uri}`;
    console.log(`Data to post is ${data}`);

    return this.http.post(this.PROXY + this.POCKET_AUTH_REQUEST_URI, data, {headers: headers}).map(
      (resp: Response) => {
        if (resp.ok) {
          console.log(resp);
          this.code = resp.text().split('=')[1];
          console.log(`Found code of ${this.code}`);
          return this.code;
        }
        throw resp.text;
      }).toPromise();

  }

  public redirectToLogin(requestToken: string) {

    let redirectUrl = `${this.REAL_POCKET_BASE}${this.POCKET_AUTH_REDIRECT_URI_BASE}?request_token=${requestToken}&redirect_uri=${this.POCKET_RETURN_URL}`;


    window.location.href = redirectUrl;

  }


  public getUserAccessToken(requestToken : string): Promise<string> {

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // append custom headers if required

    let dataJSON = {
      consumer_key: environment.pocketKey,
      code: requestToken
    }

    let data = `consumer_key=${dataJSON.consumer_key}&code=${dataJSON.code}`;


    return this.http.post(this.PROXY + this.POCKET_AUTH_AUTHORIZE_URI, data, {headers: headers}).map(
      (resp: Response) => {
        if (resp.ok) {
          console.log(resp.text());
          // access_token=5e3b013d-8f75-1f0f-077b-bba5db&username=glen%40bytecode.com.au
          var lines = resp.text().split("&");
          this.accessToken = lines[0].split('=')[1];
          this.userName = decodeURIComponent(lines[1].split('=')[1]);
          return this.accessToken;
        }
        throw resp.text;
      }).toPromise();

  }






}
