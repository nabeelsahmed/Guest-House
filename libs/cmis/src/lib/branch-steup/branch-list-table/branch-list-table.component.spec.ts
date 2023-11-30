import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchListTableComponent } from './branch-list-table.component';

describe('BranchListTableComponent', () => {
  let component: BranchListTableComponent;
  let fixture: ComponentFixture<BranchListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchListTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
