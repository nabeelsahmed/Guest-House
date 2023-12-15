import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRecordsComponent } from './guest-records.component';

describe('GuestRecordsComponent', () => {
  let component: GuestRecordsComponent;
  let fixture: ComponentFixture<GuestRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
