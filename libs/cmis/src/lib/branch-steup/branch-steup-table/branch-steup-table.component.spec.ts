import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSteupTableComponent } from './branch-steup-table.component';

describe('BranchSteupTableComponent', () => {
  let component: BranchSteupTableComponent;
  let fixture: ComponentFixture<BranchSteupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchSteupTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchSteupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
