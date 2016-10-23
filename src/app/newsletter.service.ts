import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { PocketService, PocketEntries, PocketEntry } from './pocket.service';

@Injectable()
export class NewsletterService {

  newArticles: Subject<PocketEntry> = new Subject<PocketEntry>();

  constructor(private pocketService: PocketService) { }

  // an imperative function call to this action stream
  addArticle(article: PocketEntry): void {
    this.newArticles.next(article);
  }


}
