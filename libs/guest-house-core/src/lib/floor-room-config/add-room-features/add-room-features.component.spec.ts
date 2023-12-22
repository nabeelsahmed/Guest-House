import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoomFeaturesComponent } from './add-room-features.component';

describe('AddRoomFeaturesComponent', () => {
  let component: AddRoomFeaturesComponent;
  let fixture: ComponentFixture<AddRoomFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRoomFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoomFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
