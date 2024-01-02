import { Component, OnInit, ViewChild } from '@angular/core';

import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { PrintBillComponent } from '../guest-booking/guest-booking-table/print-bill/print-bill.component';

@Component({
  selector: 'general-app-guest-records',
  templateUrl: './guest-records.component.html',
  styleUrls: ['./guest-records.component.scss'],
})
export class GuestRecordsComponent implements OnInit {
  @ViewChild(PrintBillComponent) printBill: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule // private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.global.setHeaderTitle('Guest Records');
    this.getPartyStatus();
  }

  partyList: any = [];
  txtSearch: any = '';
  guestList: any = [];

  getPartyStatus() {
    this.dataService.getHttp(`guestms-api/Party/getPartyStatus`, '').subscribe(
      (response: any[]) => {
        this.partyList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getRoomBooking(item: any) {
    this.dataService
      .getHttp(
        `guestms-api/RoomBooking/getRoomBooking?branchID=3&partyID=` + item,
        ''
      )
      .subscribe((response: any[]) => {
        this.guestList = response;
      });
  }

  onStatusChange(item: any) {
    var billJson: any = [];
    if (item.services != null) {
      billJson = JSON.parse(item.services);
    }

    if (item.status == true) {
      this.printBill.lblGuestName =
        item.partyFirstName + ' ' + item.partyLastName;
      this.printBill.lblCNIC = item.partyCNIC;
      this.printBill.lblMobile = item.partyMobile;
      this.printBill.lblCheckIn = item.checkIn;
      this.printBill.lblCheckOut = item.checkOut;
      this.printBill.lblRoomBookingID = item.roomBookingID;
      this.printBill.lblDiscount += item.discount;

      this.printBill.roomList.push({
        floorRoomID: item.floorRoomID,
        roomNo: item.floorRoomNo,
        roomtitle: item.roomtTypeTitle,
        floorNo: item.floorNo,
      });

      for (var i = 0; i < billJson.length; i++) {
        if (this.printBill.roomDetailList.length == 0) {
          this.printBill.roomDetailList.push({
            floorRoomID: item.floorRoomID,
            serviceID: billJson[i].serviceID,
            title: billJson[i].serviceTitle,
            amount: billJson[i].serviceAmount,
            quantity: billJson[i].serviceQuantity,
          });
        } else {
          var roomFound = false;
          var roomIndex = 0;

          for (var j = 0; j < this.printBill.roomDetailList.length; j++) {
            if (
              this.printBill.roomDetailList[j].serviceID ==
              billJson[i].serviceID
            ) {
              roomFound = true;
              j = this.printBill.roomDetailList.length + 1;
            }
          }

          if (roomFound == true) {
            this.printBill.roomDetailList[roomIndex].quantity +=
              billJson[i].serviceQuantity;
          } else {
            this.printBill.roomDetailList.push({
              floorRoomID: item.floorRoomID,
              serviceID: billJson[i].serviceID,
              title: billJson[i].serviceTitle,
              amount: billJson[i].serviceAmount,
              quantity: billJson[i].serviceQuantity,
            });
          }
        }
      }
    } else {
      var found = false;
      var index = 0;
      this.printBill.lblDiscount -= item.discount;
      for (var i = 0; i < this.printBill.roomList.length; i++) {
        if (this.printBill.roomList[i].floorRoomID == item.floorRoomID) {
          found = true;
          index = i;
          i = this.printBill.roomList.length + 1;
        }
      }

      for (var i = 0; i < billJson.length; i++) {
        for (var j = 0; j < this.printBill.roomDetailList.length; j++) {
          if (
            this.printBill.roomDetailList[j].serviceID == billJson[i].serviceID
          ) {
            this.printBill.roomDetailList[j].quantity -=
              billJson[i].serviceQuantity;
          }
          if (this.printBill.roomDetailList[j].quantity == 0) {
            this.printBill.roomDetailList.splice(j, 1);
          }
        }
      }

      if (found == true) {
        this.printBill.roomList.splice(index, 1);
      }
    }

    this.printBill.lblTotal = 0;
    this.printBill.lblTotalCost = 0;
    for (var i = 0; i < this.printBill.roomDetailList.length; i++) {
      var total = 0;
      total =
        this.printBill.roomDetailList[i].quantity *
        this.printBill.roomDetailList[i].amount;
      this.printBill.lblTotal += total;
    }

    this.printBill.lblTax = (this.printBill.lblTotal * 11) / 100;

    this.printBill.lblTotalCost =
      this.printBill.lblTotal +
      this.printBill.lblTax -
      this.printBill.lblDiscount;
  }

  print(id: any) {
    this.global.printData(id, 'portrait');
  }
}
