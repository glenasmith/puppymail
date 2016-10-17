import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-pocketlinks',
  templateUrl: './pocketlinks.component.html',
  styleUrls: ['./pocketlinks.component.css']
})
export class PocketlinksComponent implements OnInit {

  myKey : string;

  constructor() { 
    this.myKey = environment.pocketKey;
  }

  ngOnInit() {
  }

}
