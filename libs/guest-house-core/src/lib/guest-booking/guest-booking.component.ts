import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, GuestInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { GuestInfoComponent } from './guest-info/guest-info.component';
import { GuestBookingTableComponent } from './guest-booking-table/guest-booking-table.component';

@Component({
  selector: 'general-app-guest-booking',
  templateUrl: './guest-booking.component.html',
  styleUrls: ['./guest-booking.component.scss'],
})
export class GuestBookingComponent implements OnInit {
  @ViewChild(GuestBookingTableComponent) guestTable: any;

  @ViewChild(GuestInfoComponent) guestInfo: any;

  tblReservedSearch: any = '';
  index: any = 0;

  cmbRoomType: any = '';

  pageFields: GuestInterface = {
    roomBookingID: '0', //0
    spType: '', //1
    userID: '', //2
    partyID: '', //3
    roomJson: '', //4
    checkIn: '', //5
    checkOut: '', //6
    checkinTime: '', //7
    checkoutTime: '', //8
    transactionType: '', //9
    reservationStatus: '', //10
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.roomBookingID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.spType,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.userID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.partyID,
      msg: 'select cnic',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.roomJson,
      msg: 'select room',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.checkIn,
      msg: 'enter check in date',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.checkOut,
      msg: 'enter check out date',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.checkinTime,
      msg: 'enter check in time',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.checkoutTime,
      msg: 'enter check out time',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.transactionType,
      msg: 'enter transaction type',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.reservationStatus,
      msg: 'enter check out time',
      type: 'hidden',
      required: true,
    },
  ];

  reservedRoomList: any = [];
  roomTypeList: any = [];
  tempFloorRoomList: any = [];
  floorRoomList: any = [];

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.global.setHeaderTitle('Guest Booking');

    this.formFields[2].value = this.global.getUserId().toString();

    this.getRoomType();
    this.getRoomRecords();
    this.getRoomReservation();
  }

  getRoomRecords() {
    this.dataService
      .getHttp('guestms-api/RoomBooking/getGuestBookedRecord??branchID=3', '')
      .subscribe(
        (response: any) => {
          this.guestTable.tableData = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getRoomType() {
    this.dataService.getHttp('guestms-api/FloorRoom/getRoomType', '').subscribe(
      (response: any) => {
        this.roomTypeList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getRoomReservation() {
    this.dataService
      .getHttp(
        'guestms-api/RoomBooking/getRoomReservationCurrent?branchID=3',
        ''
      )
      .subscribe(
        (response: any) => {
          this.reservedRoomList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getRoomAvailability(item: any) {
    if (this.formFields[0].value == '0') {
      this.dataService
        .getHttp(
          'guestms-api/FloorRoom/getRoomAvailability?branchID=3&roomTypeID=' +
            item,
          ''
        )
        .subscribe(
          (response: any) => {
            this.floorRoomList = [];
            for (var i = 0; i < response.length; i++) {
              var count = 0;
              var tempList: any = [];
              for (var j = 0; j < response.length; j++) {
                if (response[i].floorID == response[j].floorID) {
                  var status = 0;
                  if (this.tempFloorRoomList.length > 0) {
                    for (var k = 0; k < this.tempFloorRoomList.length; k++) {
                      if (
                        response[j].floorRoomID ==
                        this.tempFloorRoomList[k].floorRoomID
                      ) {
                        status = 1;
                      }
                    }
                  }

                  tempList.push({
                    floorRoomID: response[j].floorRoomID,
                    floorRoomNo: response[j].floorRoomNo,
                    status: status,
                    availability: response[j].availability,
                  });
                  count++;
                }
              }
              if (this.floorRoomList.length == 0) {
                this.floorRoomList.push({
                  floorID: response[i].floorID,
                  floorNo: response[i].floorNo,
                  jsonList: tempList,
                  roomCount: count,
                });
              } else {
                var data = this.floorRoomList.filter(
                  (x: any) => x.floorID == response[i].floorID
                );
                if (data.length == 0) {
                  this.floorRoomList.push({
                    floorID: response[i].floorID,
                    floorNo: response[i].floorNo,
                    jsonList: tempList,
                    roomCount: count,
                  });
                }
              }
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    } else {
      this.dataService
        .getHttp(
          'guestms-api/RoomBooking/getGuestBookedRooms?partyID=' +
            this.formFields[3].value +
            '&checkIn=' +
            this.datePipe.transform(this.formFields[5].value, 'yyyy-MM-dd') +
            '&checkOut=' +
            this.datePipe.transform(this.formFields[6].value, 'yyyy-MM-dd') +
            '&branchID=3&reservationStatus=' +
            this.formFields[10].value +
            '&roomTypeID=' +
            item,
          ''
        )
        .subscribe(
          (response: any) => {
            this.floorRoomList = [];
            for (var i = 0; i < response.length; i++) {
              var count = 0;
              var tempList: any = [];

              for (var j = 0; j < response.length; j++) {
                if (response[i].floorID == response[j].floorID) {
                  var status = 0;
                  if (response[j].status == 0) {
                    if (this.tempFloorRoomList.length > 0) {
                      for (var k = 0; k < this.tempFloorRoomList.length; k++) {
                        if (
                          response[j].floorRoomID ==
                          this.tempFloorRoomList[k].floorRoomID
                        ) {
                          status = 1;
                        }
                      }
                    }
                  } else {
                    status = response[j].status;
                  }

                  tempList.push({
                    floorRoomID: response[j].floorRoomID,
                    floorRoomNo: response[j].floorRoomNo,
                    status: status,
                    availability: response[j].availability,
                  });
                  count++;
                }
              }
              if (this.floorRoomList.length == 0) {
                this.floorRoomList.push({
                  floorID: response[i].floorID,
                  floorNo: response[i].floorNo,
                  jsonList: tempList,
                  roomCount: count,
                });
              } else {
                var data = this.floorRoomList.filter(
                  (x: any) => x.floorID == response[i].floorID
                );
                if (data.length == 0) {
                  this.floorRoomList.push({
                    floorID: response[i].floorID,
                    floorNo: response[i].floorNo,
                    jsonList: tempList,
                    roomCount: count,
                  });
                }
              }
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }

  addRoom(obj: any) {
    if (obj.status == 0) {
      obj.status = 1;

      this.tempFloorRoomList.push({
        floorRoomID: obj.floorRoomID,
        status: 1,
      });
    } else {
      obj.status = 0;
      var found = false;
      var index;

      for (var i = 0; i < this.tempFloorRoomList.length; i++) {
        if (obj.floorRoomID == this.tempFloorRoomList[i].floorRoomID) {
          found = true;
          index = i;
        }
      }
      if ((found = true)) {
        this.tempFloorRoomList.splice(index, 1);
      }
    }
  }

  getParty(item: any) {
    this.formFields[3].value = item[0].partyID;
  }

  save() {
    this.formFields[5].value = this.datePipe.transform(
      this.formFields[5].value,
      'yyyy-MM-dd'
    );
    this.formFields[6].value = this.datePipe.transform(
      this.formFields[6].value,
      'yyyy-MM-dd'
    );

    this.formFields[1].value = 'insert';

    this.formFields[10].value = 'booked';

    if (this.tempFloorRoomList.length > 0) {
      this.formFields[4].value = JSON.stringify(this.tempFloorRoomList);
    }

    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'guestms-api/RoomBooking/saveRoomBooking'
      )
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('success') == true) {
            this.valid.apiInfoResponse('Guest Added Successfully');
            this.reset();
          } else {
            this.valid.apiErrorResponse(response[0]);
          }
        },
        (error: any) => {
          this.valid.apiErrorResponse(error);
        }
      );
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';
    this.floorRoomList = [];
    this.cmbRoomType = '';

    this.guestInfo.resetAll();
  }

  changeTabHeader(tabNum: any) {
    this.index = tabNum;
  }

  editReserved(item: any) {
    this.formFields[0].value = '1';
    this.formFields[3].value = item.partyID;
    this.formFields[5].value = new Date(item.checkIn);
    this.formFields[6].value = new Date(item.checkOut);
    this.formFields[7].value = item.checkInTime;
    this.formFields[8].value = item.checkOutTime;
    this.formFields[9].value = item.transactionType;
    this.formFields[10].value = 'reserved';

    this.guestInfo.cmbCNIC = item.partyID;
    this.guestInfo.onCNICChange(item.partyID);
  }

  edit(item: any) {
    this.index = 0;

    this.formFields[0].value = '1';
    this.formFields[3].value = item.partyID;
    this.formFields[5].value = new Date(item.checkIn);
    this.formFields[6].value = new Date(item.checkOut);
    this.formFields[7].value = item.checkInTime;
    this.formFields[8].value = item.checkOutTime;
    this.formFields[9].value = item.transactionType;
    this.formFields[10].value = item.reservationStatus;

    this.guestInfo.cmbCNIC = item.partyID;
    this.guestInfo.onCNICChange(item.partyID);
  }
}
