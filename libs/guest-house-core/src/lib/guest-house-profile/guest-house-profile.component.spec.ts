import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestHouseProfileComponent } from './guest-house-profile.component';

describe('GuestHouseProfileComponent', () => {
  let component: GuestHouseProfileComponent;
  let fixture: ComponentFixture<GuestHouseProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestHouseProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestHouseProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
