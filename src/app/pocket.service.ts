import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable()
export class PocketService {

  // proxy will send to = https://getpocket.com/
  private REAL_POCKET_BASE = 'https://getpocket.com/';
  private PROXY = environment.pocketProxyBaseUrl;
  private POCKET_AUTH_REQUEST_URI = '/v3/oauth/request';
  private POCKET_AUTH_REDIRECT_URI_BASE = '/auth/authorize';
  private POCKET_AUTH_AUTHORIZE_URI = '/v3/oauth/authorize';
  private POCKET_RETRIEVE_URI = '/v3/get';


  // ?request_token=YOUR_REQUEST_TOKEN&redirect_uri=YOUR_REDIRECT_URI

  userName: string = '';
  code: string = '';
  accessToken: string = '';

  private POCKET_RETURN_URL = environment.baseAppUrl + '/login/backFromPocket';

  // Check out https://getpocket.com/developer/docs/authentication
  constructor(private http: Http, private router: Router) { }

  public mapToFormData(map: Object): string {

    let formData = '';

    for (var key in map) {
      if (formData)
        formData += '&';
      formData += `${key}=${map[key]}`;
    }

    return formData;

  }


  public postDataToMap(postData: string): any {

    let postMap = {};

    let replacer = function (match: string, key: string, joiner: string, value: string) {
      postMap[key] = value;
      return match;
    };

    postData.replace(
      new RegExp('([^?=&]+)(=([^&]*))?', 'g'), replacer);

    return postMap;

  }

  public getRequestToken(): Promise<string> {

    let dataJSON = {
      consumer_key: environment.pocketKey,
      redirect_uri: encodeURIComponent(this.POCKET_RETURN_URL),
      state: 'myCustomStateGoesHere'
    };

    let data = this.mapToFormData(dataJSON);
    console.log(`Data to post is ${data}`);

    return this.http.post(this.PROXY + this.POCKET_AUTH_REQUEST_URI, data, { headers: this.getFormHeaders() }).map(
      (resp: Response) => {
        if (resp.ok) {
          let returnData = this.postDataToMap(resp.text());
          console.log(returnData);
          this.code = returnData.code;
          console.log(`Found code of ${this.code}`);
          return this.code;
        }
        throw resp.text();
      }).toPromise();

  }

  public redirectToLogin(requestToken: string) {

    let redirectUrl = `${this.REAL_POCKET_BASE}${this.POCKET_AUTH_REDIRECT_URI_BASE}?request_token=${requestToken}&redirect_uri=${this.POCKET_RETURN_URL}`;


    window.location.href = redirectUrl;

  }


  public getFormHeaders(): Headers {

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // append custom headers if required
    return headers;

  }


  public getUserAccessToken(requestToken: string): Promise<string> {

    let dataJSON = {
      consumer_key: environment.pocketKey,
      code: requestToken
    };

    let data = this.mapToFormData(dataJSON);

    return this.http.post(this.PROXY + this.POCKET_AUTH_AUTHORIZE_URI, data, { headers: this.getFormHeaders() }).map(
      (resp: Response) => {
        if (resp.ok) {
          let returnData = this.postDataToMap(resp.text());
          console.log(returnData);
          this.accessToken = returnData.access_token
          this.userName = decodeURIComponent(returnData.username);
          return this.accessToken;
        }
        throw resp.text;
      }).toPromise();

  }


  public getRecentArticles(offset: number = 0, count: number = 10): Promise<PocketEntries> {


    let dataJSON = {
      consumer_key: environment.pocketKey,
      access_token: this.accessToken,
      state: 'all',
      sort: 'newest',
      detailType: 'complete',
      offset: offset,
      count: count
    };

    let data = this.mapToFormData(dataJSON);

    return this.http.post(this.PROXY + this.POCKET_RETRIEVE_URI, data, { headers: this.getFormHeaders() }).map(
      (resp: Response) => {
        if (resp.ok) {
          console.log(resp.json());
          console.log('-------');
          return resp.json();
        }
        throw resp.text;
      }).map((json) => {
        let pocketEntries = new PocketEntries();
        for (var entry in json.list) {
          let nextPocketEntry = json.list[entry]

          let tagNames = [];
          if (nextPocketEntry.tags) {
            for (var entry in nextPocketEntry.tags) {
              tagNames.push(entry);
            }
          }
          nextPocketEntry.tagNames = tagNames;

          pocketEntries.entries.push(nextPocketEntry as PocketEntry);
        }
        pocketEntries.entries.sort((a, b) => {
          return b.time_added - a.time_added; // sort numerical ascending
        });
        console.log(pocketEntries);
        return pocketEntries;
      })
      .toPromise();

  }

}


export class PocketEntries {
  public entries: Array<PocketEntry> = [];
  //public tags : {};
}

export class PocketEntry {

  public excerpt: string;
  public resolved_title: string;
  public resolved_url: string;
  public time_added: number;
  public item_id: number;
  public tags: Array<Object>;
  public word_count: number;
  

}