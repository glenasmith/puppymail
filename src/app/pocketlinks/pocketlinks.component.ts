import { Component, OnInit } from '@angular/core';
import { PocketService, PocketEntries, PocketEntry } from '../pocket.service';

@Component({
  selector: 'app-pocketlinks',
  templateUrl: './pocketlinks.component.html',
  styleUrls: ['./pocketlinks.component.css']
})
export class PocketlinksComponent implements OnInit {

  entries : Array<PocketEntry> = [];
  rowsToDisplay = 5;

  constructor(private pocketService : PocketService) { 
    
  }

  ngOnInit() {

      this.pocketService.getRecentArticles(0, 50).then( (newArticles) => {
        this.entries = newArticles.entries;
      });

  }

}
