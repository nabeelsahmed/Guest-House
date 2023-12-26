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
    this.getPartyStatus()
    this.global.setHeaderTitle('Guest Records');

  }

  partyStatus: any[] = []
  txtSearch: any = '';




  ///
  // {
  //   "partyID": 1,
  //   "partyFirstName": "Shakeel",
  //   "partyLastName": "Abbas",
  //   "partyCNIC": "393402-53533353-9",
  //   "partyMobile": "03000454535",
  //   "status": "regular"
  // }
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

}
