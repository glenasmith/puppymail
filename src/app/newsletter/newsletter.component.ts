import { Component, OnInit } from '@angular/core';
import { PocketService, PocketEntries, PocketEntry } from '../pocket.service';
import { NewsletterService } from '../newsletter.service';
import { Message } from 'primeng/primeng';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {

  newsEntries: Array<PocketEntry> = [];
  messages : Array<Message> = [];
  exportContent = '';
  displayExportDialog = false;

  constructor(private newsletterService: NewsletterService) { 
    
  }

  ngOnInit() {
    this.newsletterService.newArticles.subscribe( this.OnNewArticle.bind(this) );
  }

  OnNewArticle(pocketEntry : PocketEntry) {
    this.messages.push({severity: 'info', summary: 'Added Item', detail: pocketEntry.resolved_title});
    console.log(this);
    this.newsEntries.push(pocketEntry);

  }

  OnRemoveEntry(entry : PocketEntry) {
    var index = this.newsEntries.indexOf(entry);
    if (index > -1) { 
      this.newsEntries.splice(index, 1);
      this.messages.push({severity: 'info', summary: 'Removed Item Item', detail: entry.resolved_title});
    }
    this.newsletterService.removeArticle(entry);
  }


  OnExportHtml() {
      this.exportContent = '<ul>';
      this.newsEntries.forEach( (newsEntry : PocketEntry) => {
          this.exportContent += `<li><a href="${newsEntry.resolved_url}">${newsEntry.resolved_title}</a> - ${newsEntry.excerpt}</li>\n`;
      })
      this.exportContent += '</ul>';
      this.displayExportDialog = true;
  }

  OnExportMarkdown() {

      this.exportContent = '';
      this.newsEntries.forEach( (newsEntry : PocketEntry) => {
          this.exportContent += `* [${newsEntry.resolved_title}](${newsEntry.resolved_url}) - ${newsEntry.excerpt}\n`;
      })
      this.displayExportDialog = true;
  }

}
