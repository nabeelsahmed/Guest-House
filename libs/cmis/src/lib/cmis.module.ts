import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';

import { MaterialModule } from '@general-app/material';
import { FormsModule } from '@angular/forms';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PrimengModule } from '@general-app/primeng';

// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SearchPipe } from '@general-app/shared/interface';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { BranchComponent } from './branch/branch.component';
import { DepartmentComponent } from './department/department.component';
import { SectionComponent } from './section/section.component';
import { SectionTableComponent } from './section/section-table/section-table.component';
import { DepartmentTableComponent } from './department/department-table/department-table.component';
import { BranchTableComponent } from './branch/branch-table/branch-table.component';

import { SharedSharedComponentsModule } from '@general-app/shared/shared-components';
import { BranchSteupComponent } from './branch-steup/branch-steup.component';
import { BranchSteupTableComponent } from './branch-steup/branch-steup-table/branch-steup-table.component';
import { BranchListTableComponent } from './branch-steup/branch-list-table/branch-list-table.component';
import { CompanyListTableComponent } from './company-profile/company-list-table/company-list-table.component';
import { TextMaskModule } from 'angular2-text-mask';

//PrimeNg Component
import { InputTextModule } from 'primeng/inputtext';
////

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

export const cmisRoutes: Route[] = [
  { path: 'company', component: CompanyProfileComponent },
  { path: 'branch', component: BranchComponent },
  { path: 'department', component: DepartmentComponent },
  { path: 'section', component: SectionComponent },
  { path: 'branch-setup', component: BranchSteupComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(cmisRoutes),
    PerfectScrollbarModule,
    MaterialModule,
    FormsModule,
    SharedSharedComponentsModule,
    Ng2SearchPipeModule,
    TextMaskModule,
    PrimengModule,
    InputTextModule,
  ],
  declarations: [
    CompanyProfileComponent,
    BranchComponent,
    DepartmentComponent,
    SectionComponent,
    SectionTableComponent,
    DepartmentTableComponent,
    BranchTableComponent,
    BranchSteupComponent,
    BranchSteupTableComponent,
    BranchListTableComponent,
    CompanyListTableComponent,
  ],
  exports: [
    CompanyListTableComponent,
    SectionTableComponent,
    DepartmentTableComponent,
    BranchTableComponent,
    BranchSteupTableComponent,
    BranchListTableComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class CmisModule {}
