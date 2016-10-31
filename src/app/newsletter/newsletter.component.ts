import { Component, OnInit } from '@angular/core';
import { PocketService, PocketEntries, PocketEntry } from '../pocket.service';
import { NewsletterService } from '../newsletter.service';
import { DatabaseService } from '../database.service';
import { Message } from 'primeng/primeng';
import { FirebaseAuthState } from 'angularfire2';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {

  newsEntries: Array<PocketEntry> = [];
  messages: Array<Message> = [];
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


  private invokeSave() {
    console.log("Saving entries");
    this.databaseService.saveNewsletter("sample", this.newsEntries);

  }

  OnSave() {
    //if (!this.databaseService.IsLoggedIn) {
      this.databaseService.login().then( (fas : FirebaseAuthState) => {
          console.log("Login successful", fas.auth.displayName);
          this.invokeSave();
      });
    //} else {
    //  this.invokeSave();
    //}
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
