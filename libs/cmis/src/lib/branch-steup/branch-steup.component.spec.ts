import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSteupComponent } from './branch-steup.component';

describe('BranchSteupComponent', () => {
  let component: BranchSteupComponent;
  let fixture: ComponentFixture<BranchSteupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchSteupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchSteupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
