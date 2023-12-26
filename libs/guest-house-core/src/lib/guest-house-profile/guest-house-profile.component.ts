import { Component, OnInit } from '@angular/core';

import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, AddServicesInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';


@Component({
  selector: 'general-app-guest-house-profile',
  templateUrl: './guest-house-profile.component.html',
  styleUrls: ['./guest-house-profile.component.scss']
})
export class GuestHouseProfileComponent implements OnInit {



  // products = [
  //   {
  //     id: '1000',
  //     code: 'f230fh0g3',
  //     name: 'Bamboo Watch',
  //     description: 'Product Description',
  //     image: 'bamboo-watch.jpg',
  //     price: 65,
  //     category: 'Accessories',
  //     quantity: 24,
  //     inventoryStatus: 'INSTOCK',
  //     rating: 5
  //   },
  // ]
  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  isVisible: boolean = false;

  visibilityFunction() {
    this.isVisible = !this.isVisible
  }






  value: string | undefined
  ngOnInit(): void {
    this.getRoomBooking()
  }


  // {
  //   "partyID": 1,
  //   "roomBookingID": 1,
  //   "floorRoomID": 1,
  //   "partyFirstName": "Shakeel",
  //   "partyLastName": "Abbas",
  //   "partyCNIC": "393402-53533353-9",
  //   "partyMobile": "03000454535",
  //   "checkIn": "2023-12-01",
  //   "checkOut": "2023-12-05",
  //   "checkInTime": "2023-12-01",
  //   "checkOutTime": "2023-12-05",
  //   "reservationStatus": "booked",
  //   "floorRoomNo": "A01",
  //   "roomtTypeTitle": "Single Bed",
  //   "branch_id": 3,
  //   "services": "[{\"serviceID\":1,\"serviceTypeTitle\":\"Breakfast\"},{\"serviceID\":2,\"serviceTypeTitle\":\"Lunch\"},{\"serviceID\":1,\"serviceTypeTitle\":\"Breakfast\"}]"
  // }
  // RoomBooking/getRoomBooking?branchID=3
  getRoomBooking() {
    this.dataService.getHttp('guestms-api/RoomBooking/getRoomBooking?branchID=3', '').subscribe(
      (response: any[]) => {
        // this.companyList = response
        console.log('--------', response);
      },
      (error: any) => {
        console.log(error)
      })
  }


}
