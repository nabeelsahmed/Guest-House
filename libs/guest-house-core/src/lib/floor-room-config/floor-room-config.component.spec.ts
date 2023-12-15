import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorRoomConfigComponent } from './floor-room-config.component';

describe('FloorRoomConfigComponent', () => {
  let component: FloorRoomConfigComponent;
  let fixture: ComponentFixture<FloorRoomConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorRoomConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorRoomConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
