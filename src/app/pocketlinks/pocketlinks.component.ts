import { Component, OnInit, AfterViewInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { PocketService, PocketEntries, PocketEntry } from '../pocket.service';
import { NewsletterService } from '../newsletter.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pocketlinks',
  templateUrl: './pocketlinks.component.html',
  styleUrls: ['./pocketlinks.component.css']
})
export class PocketlinksComponent implements OnInit, AfterViewInit {

  tagCategories: Array<string> = [];
  entries: Array<PocketEntry> = [];
  filteredEntries: Array<PocketEntry> = [];
  rowsToDisplay = 3;
  loaded = false;


  @ViewChild('searchBox') searchElement: any; //ElementRef;

  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  results: EventEmitter<PocketEntry[]> = new EventEmitter<PocketEntry[]>();

  constructor(private pocketService: PocketService, private newsletterService: NewsletterService) {

  }

  clone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  ngOnInit() {

    this.pocketService.getRecentArticles(0, 50).then((newArticles) => {
      this.entries = newArticles.entries;
      this.filteredEntries = this.clone(this.entries);
      this.tagCategories = newArticles.tags;
      this.loaded = true;
      this.debounceSearch().subscribe( (searchEntries) => {
          this.filteredEntries = searchEntries;
          console.log("Filtered!");
      }, (error) => {
        console.log("Eeeekk.. Search error");
        console.log(error);
      });
    });


  }

  ngAfterViewInit() {


    console.log("Search element is...");
    console.log(this.searchElement);
    console.log("That is all");


  }

  OnAddEntry(entry: PocketEntry) {
    this.newsletterService.addArticle(entry);
  }

  private debounceSearch(): Observable<PocketEntry[]> {

    return Observable.fromEvent(this.searchElement.nativeElement, 'keyup')
      .map((e: any) => e.target.value) // extract the value of the input
      .debounceTime(250) // only once every 250ms
      .do(() => this.loading.next(true)) // enable loading
      // search, discarding old events if new input comes in
      .map((query: string) => {

        query = query.trim();

        let filtered: Array<PocketEntry> = [];

        if (!query) {
          filtered = this.entries;
          console.log("Nothing to filter on..");
        } else {
          let lowQuery = query.toLowerCase();
          console.log(`Query is [${lowQuery}]`);
          filtered = this.entries.filter((nextEntry: PocketEntry) => {

            if (nextEntry.excerpt.toLowerCase().indexOf(lowQuery) > -1 ||
              nextEntry.resolved_title.toLowerCase().indexOf(lowQuery) > -1 ||
              nextEntry.resolved_url.toLowerCase().indexOf(lowQuery) > -1) {
                return true;
              }

              // crazy inefficient
              if (nextEntry.tags && JSON.stringify(nextEntry.tags).toLowerCase().indexOf(lowQuery) > -1) {
                return true;
              }
              return false;
              
          });

        }



        console.log("Matches here");
        console.log(filtered);
        console.log("Done matching");

        return filtered;
      });
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
