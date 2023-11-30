import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyListTableComponent } from './company-list-table.component';

describe('CompanyListTableComponent', () => {
  let component: CompanyListTableComponent;
  let fixture: ComponentFixture<CompanyListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyListTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
