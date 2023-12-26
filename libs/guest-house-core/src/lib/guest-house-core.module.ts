import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@general-app/material';
import { SharedInterfaceModule } from '../../../shared/interface/src/lib/shared-interface.module';
import { TextMaskModule } from 'angular2-text-mask';

import { GuestBookingComponent } from './guest-booking/guest-booking.component';
import { PrimengModule } from '@general-app/primeng';
import { GuestHouseProfileComponent } from './guest-house-profile/guest-house-profile.component';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarComponent,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';
import { FloorRoomConfigComponent } from './floor-room-config/floor-room-config.component';
import { FloorRoomSubComponent } from './floor-room-config/floor-room-sub/floor-room-sub.component';
import { RoomFeaturesComponent } from './floor-room-config/room-features/room-features.component';
import { GuestBookingChildComponent } from './guest-booking/guest-booking-child/guest-booking-child.component';
import { GuestRecordsComponent } from './guest-records/guest-records.component';
import { GuestInfoComponent } from './guest-booking/guest-info/guest-info.component';
import { RoomServicesComponent } from './room-services/room-services.component';
import { AddRoomModalComponent } from './floor-room-config/add-room-modal/add-room-modal.component';
import { AddRoomFeaturesComponent } from './floor-room-config/add-room-features/add-room-features.component';
import { ImageUploadComponent } from 'libs/shared/shared-components/src/lib/image-upload/image-upload.component';
// import { ImageUploadsComponentComponent } from './image-uploads-component/image-uploads-component.component';

import { MenuItemsComponent } from './menu-items/menu-items.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

export const coreRoutes: Route[] = [
  { path: 'guest-booking', component: GuestBookingComponent },
  { path: 'guest-profile', component: GuestHouseProfileComponent },
  { path: 'floor-room-config', component: FloorRoomConfigComponent },
  { path: 'guest-records', component: GuestRecordsComponent },
  { path: 'room-services', component: RoomServicesComponent },
  { path: 'menu-item', component: MenuItemsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(coreRoutes),
    FormsModule,
    PrimengModule,
    MaterialModule,
    PerfectScrollbarModule,
    SharedInterfaceModule,
    TextMaskModule,
  ],

  declarations: [
    GuestBookingComponent,
    GuestHouseProfileComponent,
    FloorRoomConfigComponent,
    FloorRoomSubComponent,
    RoomFeaturesComponent,
    GuestBookingChildComponent,
    GuestRecordsComponent,
    GuestInfoComponent,
    RoomServicesComponent,
    AddRoomModalComponent,
    AddRoomFeaturesComponent,
    // ImageUploadsComponentComponent,

    MenuItemsComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class GuestHouseCoreModule {}
