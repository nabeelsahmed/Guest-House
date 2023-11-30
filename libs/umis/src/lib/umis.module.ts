import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { UserCreationComponent } from './user-creation/user-creation.component';
import { RoleCreationComponent } from './role-creation/role-creation.component';
import { MaterialModule } from '@general-app/material';
import { FormsModule } from '@angular/forms';
import { UserCreationTableComponent } from './user-creation/user-creation-table/user-creation-table.component';

import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RoleCreationTableComponent } from './role-creation/role-creation-table/role-creation-table.component';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedInterfaceModule } from '../../../shared/interface/src/lib/shared-interface.module';

// import { Ng2SearchPipeModule } from 'ng2-search-filter';
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { SearchPipe } from '@general-app/shared/interface';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

export const umisRoutes: Route[] = [
  { path: 'roles', component: RoleCreationComponent },
  { path: 'users', component: UserCreationComponent },
];

@NgModule({
  declarations: [
    UserCreationComponent,
    RoleCreationComponent,
    UserCreationTableComponent,
    RoleCreationTableComponent,
    // SearchPipe,
  ],
  exports: [
    RouterModule,
    UserCreationTableComponent,
    RoleCreationTableComponent,
    // SearchPipe,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(umisRoutes),
    PerfectScrollbarModule,
    MaterialModule,
    FormsModule,
    TextMaskModule,
    SharedInterfaceModule,
  ],
})
export class UmisModule {}
