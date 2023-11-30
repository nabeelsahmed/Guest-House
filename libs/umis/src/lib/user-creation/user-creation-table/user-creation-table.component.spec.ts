import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreationTableComponent } from './user-creation-table.component';

describe('UserCreationTableComponent', () => {
  let component: UserCreationTableComponent;
  let fixture: ComponentFixture<UserCreationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCreationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
