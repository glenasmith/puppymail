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
});
