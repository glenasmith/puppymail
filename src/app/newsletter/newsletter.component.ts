import {Component, OnInit, ElementRef, Renderer, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import { PocketService, PocketEntries, PocketEntry } from '../pocket.service';
import { NewsletterService } from '../newsletter.service';
import { DatabaseService } from '../database.service';
import { Message, MenuItem, ConfirmationService } from 'primeng/primeng';
import { FirebaseAuthState, FirebaseListObservable } from 'angularfire2';

import * as showdown from 'showdown'; // for markdown

declare var jQuery:any;

interface SelectItem {

  label: string
  value: string

}

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit, AfterViewInit {

  newsEntries: Array<PocketEntry> = [];
  messages: Array<Message> = [];

  currentPocketEntry : PocketEntry;
  oldPocketEntry : PocketEntry;

  newsletters: Array<SelectItem> = [];
  newsletterToLoad = '';

  exportContent = '';
  exportContentAlt = '';

  displayRenderedDialog = false;
  displayExportDialog = false;
  displayEditDialog = false;
  displaySaveAsDialog = false;

  displayImages = true;
  displayLinks = false;
  displayExcerpts = true;
  displayTags = false;

  isDirty = false;

  newsletterName = "sample";
  newsletterNameSaveAs = "";

  exportMenuItems: MenuItem[];
  saveMenuItems: MenuItem[];

  showHiddenTextArea = false;

  constructor(private newsletterService: NewsletterService, private databaseService: DatabaseService,
              private confirmationService: ConfirmationService, private renderer: Renderer,
              private changeDetectorRef : ChangeDetectorRef ) {

  }

  private getExportMenuItems(): Array<MenuItem> {
    return [
      {
        label: 'Markdown', icon: 'fa-asterisk', command: () => {
        this.OnExportMarkdown();
      }
      },
      {
        label: 'HTML', icon: 'fa-code', command: () => {
        this.OnExportHtml();
      }
      }

    ];
  }

  private getSaveMenuItems() : Array<MenuItem> {
    return [
      {label: 'Save', icon: 'fa-floppy-o', command: () => {
        this.OnSave();
      }},
      {label: 'Save As...', icon: 'fa-files-o', command: () => {
        this.OnSaveAs();
      }}
    ];
  }

  ngOnInit() {
    this.exportMenuItems = this.getExportMenuItems();
    this.saveMenuItems = this.getSaveMenuItems();
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

  ngAfterViewInit() {
    jQuery('.menu .item').tab();
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

  OnEditUpdate() {
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

  OnSaveAs() {
    this.checkLogin();
    console.log("Saving As newsletter");
    this.displaySaveAsDialog = true;
    this.newsletterNameSaveAs = this.newsletterName;
  }

  OnSaveAsContinue() {
    this.displaySaveAsDialog = false;
    this.databaseService.saveNewsletter(this.newsletterNameSaveAs, this.newsEntries);
    this.messages.push({ severity: 'info', summary: 'Newsletter Saved', detail: `Saved ${this.newsEntries.length} item(s)` });
    this.newsletterName = this.newsletterNameSaveAs;
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

  OnReorder($event) {
    this.markNewsletterDirty();
  }


  LoadNewsletter(nameToLoad) {
    this.checkLogin();
    console.log(`Loading newsletter ${nameToLoad}`);
    this.databaseService.loadNewsletter(nameToLoad).subscribe((loadedEntries) => {
      console.log("Loaded entries: ", loadedEntries);
      if (loadedEntries && loadedEntries.length) {
        console.log("Loaded entries", loadedEntries);
        // Turns that firebase obj into a vanilla array
        this.newsEntries = JSON.parse(JSON.stringify(loadedEntries[0]));
        console.log("Loaded newsletter", this.newsEntries);
        this.messages.push({ severity: 'info', summary: `${nameToLoad} Loaded`, detail: `Loaded ${this.newsEntries.length} item(s)` });
        this.markNewsletterClean();
      } else {
        //this.messages.push({ severity: 'warn', summary: `${nameToLoad} Loaded`, detail: `But no entries were found?` });
        console.log(`${nameToLoad} Loaded. Still waiting for entries to arrive`);
      }
    }, (error) => {
      console.log(`Failed to load ${nameToLoad} newsletter`, error);
      this.messages.push({ severity: 'info', summary: `${nameToLoad} Load Failed`, detail: `${error}` });
    });
  }

  OnNewsletterDropdownChange(event) {
    console.log("Change event is ", event);
    this.newsletterToLoad = event.value;
    this.LoadNewsletter(this.newsletterToLoad);
    this.newsletterName = this.newsletterToLoad
  }

  OnExportHtml() {
    this.OnExportMarkdown();
    this.exportContent = this.exportContentAlt;
    this.exportContentAlt = this.exportContentAlt;
    this.displayExportDialog = true;
  }


  OnExportMarkdown() {

    this.exportContent = '';
    this.newsEntries.forEach((newsEntry: PocketEntry) => {

      if (this.displayImages && newsEntry.has_image) {
        this.exportContent += `\n\n![](${newsEntry.image.src})\n\n`;
      }

      this.exportContent += `# [${newsEntry.resolved_title}](${newsEntry.resolved_url})\n\n`;
      if (this.displayExcerpts) {
        this.exportContent += `${newsEntry.excerpt}`;
      }
      this.exportContent += `\n\n`;


    });
    this.exportContentAlt = new showdown.Converter().makeHtml(this.exportContent);
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

  OnCopyToClipboard(elementToCopy : ElementRef) {
    //new Clipboard(textToCopy.nativeElement)
    console.log(elementToCopy);
    this.renderer.invokeElementMethod(elementToCopy, "select");
    //elementToCopy.nativeElement.select();
    try {
      // copy text
      document.execCommand('copy');
      //elementToCopy.nativeElement.blur();
      this.renderer.invokeElementMethod(elementToCopy, "blur");
      this.messages.push({severity: 'info', summary: 'Copied to clipboard'});
    }
    catch (err) {
      this.messages.push({severity: 'warn', summary: 'Please press Ctrl/Cmd+C to copy'});
    }
    finally {
      this.showHiddenTextArea = false;
    }
  }


}
