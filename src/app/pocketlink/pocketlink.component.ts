import { Component, OnInit, Input } from '@angular/core';
import { PocketService, PocketEntries, PocketEntry } from '../pocket.service';
import { NewsletterService } from '../newsletter.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-pocketlink',
  templateUrl: './pocketlink.component.html',
  styleUrls: ['./pocketlink.component.css']
})
export class PocketlinkComponent implements OnInit {

  @Input("entry") entry : PocketEntry;

  @Input() isImageOn = true;
  @Input() isLinkOn = true;
  @Input() isExcerptOn = true;
  @Input() isTagsOn = true;

  constructor(private newsletterService : NewsletterService) { }

  ngOnInit() {
  }

  OnAddEntry(entry: PocketEntry) {
    this.newsletterService.addArticle(entry);
  }


}
