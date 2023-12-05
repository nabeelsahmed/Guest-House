import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GuestBookingComponent } from './guest-booking/guest-booking.component';
import { PrimengModule } from '@general-app/primeng';

export const coreRoutes: Route[] = [
  { path: 'guest-booking', component: GuestBookingComponent },
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(coreRoutes),
  FormsModule,
  PrimengModule
  ],

  declarations: [
    GuestBookingComponent,
    
  ],
})
export class GuestHouseCoreModule {}
