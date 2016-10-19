/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PocketService } from './pocket.service';

describe('Service: Pocket', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PocketService]
    });
  });

  it('should ...', inject([PocketService], (service: PocketService) => {
    expect(service).toBeTruthy();
  }));


  it('should split POST data into a nice map', function () {

    let postData = "one=1&two=2&three=3&four=4";
    let postMap = {};

    var replacer = function (match: string, key: string, joiner: string, value: string) {
      postMap[key] = value;
      return match;
    }

    postData.replace(
      new RegExp("([^?=&]+)(=([^&]*))?", "g"), replacer);

    expect(postMap['one']).toBe('1');
    expect(postMap['two']).toBe('2');  

  });

});
