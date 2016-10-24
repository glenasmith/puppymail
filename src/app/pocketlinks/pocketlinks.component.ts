import { Component, OnInit } from '@angular/core';
import { PocketService, PocketEntries, PocketEntry } from '../pocket.service';
import { NewsletterService } from '../newsletter.service';

@Component({
  selector: 'app-pocketlinks',
  templateUrl: './pocketlinks.component.html',
  styleUrls: ['./pocketlinks.component.css']
})
export class PocketlinksComponent implements OnInit {

  entries : Array<PocketEntry> = [];
  rowsToDisplay = 5;
  loaded = false;

  constructor(private pocketService : PocketService, private newsletterService : NewsletterService) { 
    
  }

  ngOnInit() {

      this.pocketService.getRecentArticles(0, 50).then( (newArticles) => {
        this.entries = newArticles.entries;
        this.loaded = true;
      });

  }

  OnAddEntry(entry : PocketEntry) {
    this.newsletterService.addArticle(entry);
  }

}
