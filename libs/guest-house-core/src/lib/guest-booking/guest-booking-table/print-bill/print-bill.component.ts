import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'general-app-print-bill',
  templateUrl: './print-bill.component.html',
  styleUrls: ['./print-bill.component.scss'],
})
export class PrintBillComponent implements OnInit {
  lblRoomBookingID: any = '';
  lblGuestName: any = '';
  lblCNIC: any = '';
  lblMobile: any = '';
  lblEmail: any = '';
  lblCheckIn: any = '';
  lblCheckOut: any = '';

  lblTotal: any = 0;
  lblTax: any = 0;
  lblDiscount: any = 0;
  lblTotalCost: any = 0;

  roomList: any = [];
  roomDetailList: any = [];

  constructor() {}

  ngOnInit(): void {}

  printGuest(item: any) {
    console.log(item);

    if (item.status == true) {
      this.lblGuestName = item.firstName + ' ' + item.lastName;
      this.lblCNIC = item.cnic;
      this.lblMobile = item.mobileNumber;
      // this.lblEmail=item.
      this.lblCheckIn = item.checkInDate;
      this.lblCheckOut = item.checkOutDate;

      this.roomList.push({
        floorRoomID: item.floorRoomID,
        roomNo: item.roomNo,
        roomtitle: item.roomtitle,
        floorNo: item.floorNo,
      });
    } else {
      var found = false;
      var index = 0;

      for (var i = 0; i < this.roomList.length; i++) {
        if (this.roomList[i].floorRoomID == item.floorRoomID) {
          found = true;
          index = i;
          i = this.roomList.length + 1;
        }
      }

      if (found == true) {
        this.roomList.splice(index, 1);
      }
    }
  }
}
