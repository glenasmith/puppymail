/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PocketlinkComponent } from './pocketlink.component';

describe('PocketlinkComponent', () => {
  let component: PocketlinkComponent;
  let fixture: ComponentFixture<PocketlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PocketlinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PocketlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
