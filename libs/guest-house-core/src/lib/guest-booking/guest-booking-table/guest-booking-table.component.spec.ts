import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestBookingTableComponent } from './guest-booking-table.component';

describe('GuestBookingTableComponent', () => {
  let component: GuestBookingTableComponent;
  let fixture: ComponentFixture<GuestBookingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestBookingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestBookingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
