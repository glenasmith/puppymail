import { Component, OnInit } from '@angular/core';
import { PocketService, PocketEntries, PocketEntry } from '../pocket.service';
import { NewsletterService } from '../newsletter.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {

  newsEntries: Array<PocketEntry> = [];

  constructor(private newsletterService: NewsletterService) { 
    
  }

  ngOnInit() {
    this.newsletterService.newArticles.subscribe( this.OnNewArticle.bind(this) );
  }

  OnNewArticle(pocketEntry : PocketEntry) {
    console.log("Yey! New Entry", pocketEntry);
    console.log(this);
    this.newsEntries.push(pocketEntry);

  }

}
