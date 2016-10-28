import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pocketdisplayoptions',
  templateUrl: './pocketdisplayoptions.component.html',
  styleUrls: ['./pocketdisplayoptions.component.css']
})
export class PocketdisplayoptionsComponent implements OnInit {

  @Input() isImageOn = true;
  @Input() isLinkOn = true;
  @Input() isExcerptOn = true;
  @Input() isTagsOn = true;

  @Output() onLinkToggle = new EventEmitter<boolean>();
  @Output() onImageToggle = new EventEmitter<boolean>();
  @Output() onExcerptToggle = new EventEmitter<boolean>();
  @Output() onTagsToggle = new EventEmitter<boolean>();
 
  constructor() {
    
  }

  ngOnInit() {
  }


  OnShowImage() {
    this.isImageOn = !this.isImageOn;
    this.onImageToggle.next(this.isImageOn);
  }

  OnShowLink() {
    this.isLinkOn = !this.isLinkOn;
    this.onLinkToggle.next(this.isLinkOn);
  }

  OnShowExcerpt() {
    this.isExcerptOn = !this.isExcerptOn;
    this.onExcerptToggle.next(this.isExcerptOn);
  }

  OnShowTags() {
    this.isTagsOn = !this.isTagsOn;
    this.onTagsToggle.next(this.isTagsOn);
  }


}
