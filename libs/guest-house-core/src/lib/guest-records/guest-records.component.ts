import { Component, OnInit } from '@angular/core';

import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';

@Component({
  selector: 'general-app-guest-records',
  templateUrl: './guest-records.component.html',
  styleUrls: ['./guest-records.component.scss']
})
export class GuestRecordsComponent implements OnInit {

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    // private valid: SharedHelpersFieldValidationsModule
  ) {
  }


  ngOnInit(): void {
    this.global.setHeaderTitle('Guest Records');
    this.getPartyStatus()
  }

  partyStatus: any = []
  txtSearch: any = '';
  guestList: any = [];

  getPartyStatus() {
    this.dataService.getHttp(`guestms-api/Party/getPartyStatus`, '').subscribe(
      (response: any[]) => {
        this.partyStatus = response
        console.log(response);
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  getRoomBooking(item: any) {
    this.dataService.getHttp(`guestms-api/RoomBooking/getRoomBooking?branchID=3&partyID=` + item, '').subscribe(
      (response: any[]) => {
        console.log(response)
        this.guestList = response;
      })
  }

}
