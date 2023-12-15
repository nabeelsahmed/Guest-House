import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestBookingChildComponent } from './guest-booking-child.component';

describe('GuestBookingChildComponent', () => {
  let component: GuestBookingChildComponent;
  let fixture: ComponentFixture<GuestBookingChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestBookingChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestBookingChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
