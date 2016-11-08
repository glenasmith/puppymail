import { Component, OnInit } from '@angular/core';
import { PocketService, PocketEntries, PocketEntry } from '../pocket.service';
import { NewsletterService } from '../newsletter.service';
import { DatabaseService } from '../database.service';
import { Message, MenuItem, ConfirmationService } from 'primeng/primeng';
import { FirebaseAuthState, FirebaseListObservable } from 'angularfire2';

interface SelectItem {

  label: string
  value: string

}

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {

  newsEntries: Array<PocketEntry> = [];
  messages: Array<Message> = [];

  currentPocketEntry : PocketEntry;
  oldPocketEntry : PocketEntry;

  newsletters: Array<SelectItem> = [];
  newsletterToLoad = '';

  exportContent = '';
  displayRenderedDialog = false;
  displayExportDialog = false;
  displayEditDialog = false;

  displayImages = true;
  displayLinks = true;
  displayExcerpts = true;
  displayTags = true;

  isDirty = false;

  newsletterName = "sample";

  exportMenuItems: MenuItem[];

  constructor(private newsletterService: NewsletterService, private databaseService: DatabaseService, private confirmationService: ConfirmationService) {

  }

  private getMenuItems() : Array<MenuItem> {
    return [
    {label: 'Markdown', icon: 'fa-asterisk', command: () => {
      this.OnExportMarkdown();
    }},
    {label: 'HTML', icon: 'fa-code', command: () => {
      this.OnExportHtml();
    }},
      {label: 'Rendered HTML', icon: 'fa-html5', command: () => {
        this.OnExportRenderedHtml();
      }},
      ];
  }

  ngOnInit() {
    this.exportMenuItems = this.getMenuItems();
    this.newsletterService.newArticles.subscribe(this.OnNewArticle.bind(this));
    this.databaseService.login().then((fas: FirebaseAuthState) => {
      console.log("Login successful", fas.uid);
      this.messages.push({ severity: 'info', summary: 'Firebase Login', detail: `Welcome ${fas.uid}` });
      this.databaseService.listNewsletters().subscribe(
        (savedNewsletters: string[]) => {

          console.log("Fetched newsletters..", savedNewsletters);
          this.newsletters = [];
          if (savedNewsletters) {
              savedNewsletters.forEach(next => this.newsletters.push({ label: next, value: next }));
          }
        });
    }, (err) => {
      this.messages.push({ severity: 'warn', summary: 'Firebase Login Failed', detail: `Welcome ${err}` });
    });
  }

  private markNewsletterDirty() {
    this.isDirty = true;
  }

  private markNewsletterClean() {
    this.isDirty = false;
  }

  OnNewArticle(entry: PocketEntry) {
    var index = this.newsEntries.indexOf(entry);
    if (index == -1) {
      this.messages.push({ severity: 'info', summary: 'Added Item', detail: entry.resolved_title });
      console.log(this);
      this.newsEntries.push(entry);
      this.markNewsletterDirty();
    }
  }

  OnRemoveEntry(entry: PocketEntry) {
    var index = this.newsEntries.indexOf(entry);
    if (index > -1) {
      this.newsEntries.splice(index, 1);
      this.messages.push({ severity: 'info', summary: 'Removed Item Item', detail: entry.resolved_title });
      this.markNewsletterDirty();
    }
    this.newsletterService.removeArticle(entry);
  }

  OnEditEntry(entry: PocketEntry) {
    this.currentPocketEntry = entry;
    this.oldPocketEntry = JSON.parse(JSON.stringify(entry));
    this.displayEditDialog = true;
  }

  OnEditSave() {
    this.displayEditDialog=false
  }

  OnEditCancel() {
    this.currentPocketEntry.resolved_title = this.oldPocketEntry.resolved_title;
    this.currentPocketEntry.excerpt = this.oldPocketEntry.excerpt;
    this.displayEditDialog=false
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
    this.databaseService.saveNewsletter(this.newsletterName, this.newsEntries);
    this.messages.push({ severity: 'info', summary: 'Newsletter Saved', detail: `Saved ${this.newsEntries.length} item(s)` });
    this.markNewsletterClean();
  }

  OnDelete() {
    this.checkLogin();
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete newsletter ${this.newsletterName} with ${this.newsEntries.length} item(s)?`,
      accept: () => {
        console.log("Deleting newsletter");
        this.databaseService.deleteNewsletter(this.newsletterName);
        this.messages.push({ severity: 'info', summary: 'Newsletter Deleted', detail: `Deleted ${this.newsletterName} with ${this.newsEntries.length} item(s)` });
        this.newsEntries = [];
        this.newsletterName = "sample";
        this.markNewsletterClean();
      }
    });

  }




  LoadNewsletter(nameToLoad) {
    this.checkLogin();
    console.log(`Loading newsletter ${nameToLoad}`);
    this.databaseService.loadNewsletter(nameToLoad).subscribe((loadedEntries) => {
      console.log("Loaded entries: ", loadedEntries);
      if (loadedEntries && loadedEntries.length) {
        this.newsEntries = loadedEntries[0];
        this.messages.push({ severity: 'info', summary: `${nameToLoad} Loaded`, detail: `Loaded ${this.newsEntries.length} item(s)` });
        this.markNewsletterClean();
      } else {
        this.messages.push({ severity: 'warn', summary: `${nameToLoad} Loaded`, detail: `But no entries were found?` });
      }
    }, (error) => {
      console.log(`Failed to load ${nameToLoad} newsletter`, error);
      this.messages.push({ severity: 'info', summary: `${nameToLoad} Load Failed`, detail: `${error}` });
    });
  }

  OnChange(event) {
    this.LoadNewsletter(this.newsletterToLoad);
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

  OnImageToggle(status: boolean) {
    this.displayImages = status;
  }

  OnLinkToggle(status: boolean) {
    this.displayLinks = status;
  }

  OnExcerptToggle(status: boolean) {
    this.displayExcerpts = status;
  }

  OnTagsToggle(status: boolean) {
    this.displayTags = status;
  }

  OnAddEntry(entry: PocketEntry) {
    this.newsletterService.addArticle(entry);
  }



}
