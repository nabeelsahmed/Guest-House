import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorRoomSubComponent } from './floor-room-sub.component';

describe('FloorRoomSubComponent', () => {
  let component: FloorRoomSubComponent;
  let fixture: ComponentFixture<FloorRoomSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorRoomSubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorRoomSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
