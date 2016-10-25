import { Component, OnInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { PocketService, PocketEntries, PocketEntry } from '../pocket.service';
import { NewsletterService } from '../newsletter.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pocketlinks',
  templateUrl: './pocketlinks.component.html',
  styleUrls: ['./pocketlinks.component.css']
})
export class PocketlinksComponent implements OnInit {

  tagCategories : Array<string> = []; 
  entries: Array<PocketEntry> = [];
  rowsToDisplay = 3;
  loaded = false;


  @ViewChild('searchBox') 
  searchElement: ElementRef;

  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  results: EventEmitter<PocketEntry[]> = new EventEmitter<PocketEntry[]>();

  constructor(private pocketService: PocketService, private newsletterService: NewsletterService) {

  }

  ngOnInit() {

    this.pocketService.getRecentArticles(0, 50).then((newArticles) => {
      this.entries = newArticles.entries;
      this.tagCategories = newArticles.tags;
      this.loaded = true;
    });

    this.debounceSearch();

  }

  OnAddEntry(entry: PocketEntry) {
    this.newsletterService.addArticle(entry);
  }

  private debounceSearch() {
    Observable.fromEvent(this.searchElement.nativeElement, 'keyup')
      .map((e: any) => e.target.value) // extract the value of the input
      .filter((text: string) => text.length > 1) // filter out if empty
      .debounceTime(250) // only once every 250ms
      .do(() => this.loading.next(true)) // enable loading
      // search, discarding old events if new input comes in
      .map((query: string) => {
        let matches = this.tagCategories.filter( (nextTerm : string) => {
            return (nextTerm.indexOf(query) > -1);
        });

        return matches;
      }).switch();
      // act on the return of the search
      // .subscribe(
      // (results: string[]) => { // on sucesss
      //   this.loading.next(false);
      //   this.results.next(results);
      // },
      // (err: any) => { // on error
      //   console.log(err);
      //   this.loading.next(false);
      // },
      // () => { // on completion
      //   this.loading.next(false);
      // }
      // );
  }

}
