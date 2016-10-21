/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { PocketService } from './pocket.service';

describe('Service: Pocket', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({  // {provide:Http, useValue: {} }
      providers: [PocketService,  
                    { provide:Http, useValue: {} },
                    { provide:Router, useValue: {} } 
        ]
    });
  });

  it('should ...', inject([PocketService], (service: PocketService) => {
    expect(service).toBeTruthy();
  }));


  it('should split POST data into a nice map', inject([PocketService], (service: PocketService) => {

    let postData = 'one=1&two=2&three=3&four=4';
    
    let postMap = service.postDataToMap(postData);

    expect(postMap['one']).toBe('1');
    expect(postMap['two']).toBe('2');  

    let formData = service.mapToFormData(postMap);
    expect(formData).toEqual(postData);

  }));

});
