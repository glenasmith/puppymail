import { Component, OnInit } from '@angular/core';
import { PocketService, PocketEntries, PocketEntry } from '../pocket.service';
import { NewsletterService } from '../newsletter.service';
import { DatabaseService } from '../database.service';
import { Message } from 'primeng/primeng';
import { FirebaseAuthState, FirebaseListObservable  } from 'angularfire2';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {

  newsEntries: Array<PocketEntry> = [];
  messages: Array<Message> = [];

  newsletters: Array<string> = [];
  newsletterToLoad = '';

  exportContent = '';
  displayRenderedDialog = false;
  displayExportDialog = false;

  displayImages = true;
  displayLinks = true;
  displayExcerpts = true;
  displayTags = true;

  constructor(private newsletterService: NewsletterService, private databaseService : DatabaseService) {

  }

  ngOnInit() {
    this.newsletterService.newArticles.subscribe(this.OnNewArticle.bind(this));
    this.databaseService.login().then( (fas : FirebaseAuthState) => {
          console.log("Login successful", fas.uid);
          this.messages.push({ severity: 'info', summary: 'Firebase Login', detail: `Welcome ${fas.uid}`});
          this.databaseService.listNewsletters().subscribe(
            (savedNewsletters : string[]) => this.newsletters = savedNewsletters
          );
      });
  }

  OnNewArticle(entry: PocketEntry) {
    var index = this.newsEntries.indexOf(entry);
    if (index == -1) {
      this.messages.push({ severity: 'info', summary: 'Added Item', detail: entry.resolved_title });
      console.log(this);
      this.newsEntries.push(entry);
    }
  }

  OnRemoveEntry(entry: PocketEntry) {
    var index = this.newsEntries.indexOf(entry);
    if (index > -1) {
      this.newsEntries.splice(index, 1);
      this.messages.push({ severity: 'info', summary: 'Removed Item Item', detail: entry.resolved_title });
    }
    this.newsletterService.removeArticle(entry);
  }


  private checkLogin() {
    if (!this.databaseService.IsLoggedIn) {
      this.messages.push({ severity: 'info', summary: 'Login Failed', detail: "Couldn't login to Firebase" });
      throw "Unable to login to Firebase Db";
    }
  }

  OnSave() {
    this.checkLogin();
    console.log("Saving newsletter");
    this.databaseService.saveNewsletter("sample", this.newsEntries);
    this.messages.push({ severity: 'info', summary: 'Newsletter Saved', detail: `Saved ${this.newsEntries.length} item(s)` });
  }




  LoadNewsletter(nameToLoad) {
    this.checkLogin();
    console.log(`Loading newsletter ${nameToLoad}`);
    this.databaseService.loadNewsletter(nameToLoad).subscribe ( (loadedEntries) => {
      console.log(loadedEntries);
      this.newsEntries = loadedEntries[0];
      this.messages.push({ severity: 'info', summary: `${nameToLoad} Loaded`, detail: `Loaded ${this.newsEntries.length} item(s)` });
    }, (error) => {
      console.log(error);
      this.messages.push({ severity: 'info', summary: `${nameToLoad} Load Failed`, detail: `${error}` });
    });
  }

  OnAutoComplete(event) {
    this.LoadNewsletter(event.query);
  }

  OnLoad() {
    this.LoadNewsletter('sample');
  }

  OnList() {
    this.checkLogin();
    console.log("Listing newsletters");
    this.databaseService.listNewsletters().subscribe( result => console.log(result));
  }


  private getHtmlVersion(): string {

    let html = '<ul>';
    this.newsEntries.forEach((newsEntry: PocketEntry) => {
      html += `<li><a href="${newsEntry.resolved_url}">${newsEntry.resolved_title}</a> - ${newsEntry.excerpt}</li>\n`;
    })
    html += '</ul>';
    return html;
  }

  OnExportHtml() {
    this.exportContent = this.getHtmlVersion();
    this.displayExportDialog = true;
  }

  OnExportRenderedHtml() {
    this.exportContent = this.getHtmlVersion();
    this.displayRenderedDialog = true;
  }

  OnExportMarkdown() {

    this.exportContent = '';
    this.newsEntries.forEach((newsEntry: PocketEntry) => {
      this.exportContent += `* [${newsEntry.resolved_title}](${newsEntry.resolved_url}) - ${newsEntry.excerpt}\n`;
    })
    this.displayExportDialog = true;
  }

  OnImageToggle(status : boolean) {
    this.displayImages = status;
  }

  OnLinkToggle(status : boolean) {
    this.displayLinks = status;
  }

  OnExcerptToggle(status : boolean) {
    this.displayExcerpts = status;
  }

  OnTagsToggle(status : boolean) {
    this.displayTags = status;
  }

  OnAddEntry(entry: PocketEntry) {
    this.newsletterService.addArticle(entry);
  }



}
