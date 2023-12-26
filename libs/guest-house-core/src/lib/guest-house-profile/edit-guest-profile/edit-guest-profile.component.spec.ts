import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGuestProfileComponent } from './edit-guest-profile.component';

describe('EditGuestProfileComponent', () => {
  let component: EditGuestProfileComponent;
  let fixture: ComponentFixture<EditGuestProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGuestProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGuestProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
