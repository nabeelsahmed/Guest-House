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
declare var $: any;

@Component({
  selector: 'general-app-guest-booking',
  templateUrl: './guest-booking.component.html',
  styleUrls: ['./guest-booking.component.scss'],
})
export class GuestBookingComponent implements OnInit {
  @ViewChild(GuestBookingTableComponent) guestTable: any;

  @ViewChild(GuestInfoComponent) guestInfo: any;

  branchID: any = 0;
  hideDiv: any = false;
  visible: any = false;
  chkCheck: any;
  tblReservedSearch: any = '';
  index: any = 0;

  cmbRoomType: any = '';
  rdbPayment: any = '';

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
    roomBookingDetailID: '', //11
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
    {
      value: this.pageFields.roomBookingDetailID,
      msg: '',
      type: 'hidden',
      required: false,
    },
  ];

  reservedRoomList: any = [];
  roomTypeList: any = [];
  tempFloorRoomList: any = [];
  floorRoomList: any = [];
  featureList: any = [];
  reservedList: any = [];

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.global.setHeaderTitle('Guest Booking');

    this.formFields[2].value = this.global.getUserId().toString();

    if (this.global.getBranchID() == 0) {
      this.branchID = 3;
    } else {
      this.branchID = this.global.getBranchID();
    }

    this.getRoomType();
    // this.getRoomRecords();
    this.getRoomFeatures();
    this.getRoomBooking();
    this.getRoomReservation();
  }

  // getRoomRecords() {
  //   this.dataService
  //     .getHttp('guestms-api/RoomBooking/getGuestBookedRecord??branchID='+this.branchID, '')
  //     .subscribe(
  //       (response: any) => {
  //         this.guestTable.tableData = response;
  //       },
  //       (error: any) => {
  //         console.log(error);
  //       }
  //     );
  // }

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

  getRoomFeatures() {
    this.dataService
      .getHttp('guestms-api/RoomFeatures/getRoomFeatures', '')
      .subscribe(
        (response: any) => {
          this.featureList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getRoomReservation() {
    this.dataService
      .getHttp('guestms-api/RoomBooking/getRoomReservation', '')
      .subscribe(
        (response: any) => {
          this.reservedRoomList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getRoomBooking() {
    this.dataService
      .getHttp(
        'guestms-api/RoomBooking/getRoomBooking?branchID=' + this.branchID,
        ''
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          this.guestTable.tableData = [];
          // this.guestList = [];

          for (var i = 0; i < response.length; i++) {
            var jsonServices = JSON.parse(response[i].services);
            var jsonFeature = JSON.parse(response[i].features);
            var billJson = JSON.parse(response[i].serviceJson);

            this.guestTable.tableData.push({
              firstName: response[i].partyFirstName,
              lastName: response[i].partyLastName,
              cnic: response[i].partyCNIC,
              mobileNumber: response[i].partyMobile,
              checkInDate: response[i].checkIn,
              checkOutDate: response[i].checkOut,
              checkInTime: response[i].checkInTime,
              checkOutTime: response[i].checkOutTime,
              roomNo: response[i].floorRoomNo,
              roomtitle: response[i].roomtTypeTitle,
              roomBookingID: response[i].roomBookingID,
              featuresJson: jsonFeature,
              jsonList: jsonServices,
              billJson: billJson,
              partyID: response[i].partyID,
              roomBookingDetailID: response[i].roomBookingDetailID,
              reservationStatus: response[i].reservationStatus,
              floorRoomID: response[i].floorRoomID,
              floorID: response[i].floorID,
              floorNo: response[i].floorNo,
              branch_id: response[i].branch_id,
              roomTypeID: response[i].roomTypeID,
              transactionType: response[i].transactionType,
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getRoomAvailability(roomTypeID: any, checkIn: any, checkOut: any) {
    // if (this.formFields[0].value == '0') {
    if (roomTypeID != '' && checkIn != '' && checkOut != '') {
      var jsonList: any = [];

      for (var i = 0; i < this.featureList.length; i++) {
        if (this.featureList[i].status == 1) {
          jsonList.push(this.featureList[i].roomFeatureID);
        }
      }

      this.dataService
        .getHttp(
          'guestms-api/FloorRoom/getRoomAvailability?branchID=' +
            this.branchID +
            '&roomTypeID=' +
            roomTypeID +
            '&checkIn=' +
            this.datePipe.transform(checkIn, 'yyyy-MM-dd') +
            '&checkOut=' +
            this.datePipe.transform(checkIn, 'yyyy-MM-dd') +
            '&jsonFeatures=' +
            JSON.stringify(jsonList),
          ''
        )
        .subscribe(
          (response: any) => {
            console.log(response);
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
    }
    // } else {
    //   this.dataService
    //     .getHttp(
    //       'guestms-api/RoomBooking/getGuestBookedRooms?partyID=' +
    //         this.formFields[3].value +
    //         '&checkIn=' +
    //         this.datePipe.transform(this.formFields[5].value, 'yyyy-MM-dd') +
    //         '&checkOut=' +
    //         this.datePipe.transform(this.formFields[6].value, 'yyyy-MM-dd') +
    //         '&branchID='+this.branchID+'&reservationStatus=' +
    //         this.formFields[10].value +
    //         '&roomTypeID=' +
    //         roomTypeID +
    //         '&roomBookingID=' +
    //         this.formFields[0].value,
    //       ''
    //     )
    //     .subscribe(
    //       (response: any) => {
    //         this.floorRoomList = [];
    //         for (var i = 0; i < response.length; i++) {
    //           var count = 0;
    //           var tempList: any = [];

    //           for (var j = 0; j < response.length; j++) {
    //             if (response[i].floorID == response[j].floorID) {
    //               var status = 0;
    //               if (response[j].status == 0) {
    //                 if (this.tempFloorRoomList.length > 0) {
    //                   for (var k = 0; k < this.tempFloorRoomList.length; k++) {
    //                     if (
    //                       response[j].floorRoomID ==
    //                       this.tempFloorRoomList[k].floorRoomID
    //                     ) {
    //                       status = 1;
    //                     }
    //                   }
    //                 }
    //               } else {
    //                 status = response[j].status;

    //                 if (this.tempFloorRoomList.length == 0) {
    //                   this.tempFloorRoomList.push({
    //                     floorRoomID: response[j].floorRoomID,
    //                     status: 1,
    //                   });
    //                 } else {
    //                   var found = false;

    //                   for (var m = 0; m < this.tempFloorRoomList.length; m++) {
    //                     if (
    //                       this.tempFloorRoomList[m].floorRoomID ==
    //                       response[j].floorRoomID
    //                     ) {
    //                       found = true;
    //                       m = this.tempFloorRoomList.length + 1;
    //                     }
    //                   }

    //                   if (found == false) {
    //                     this.tempFloorRoomList.push({
    //                       floorRoomID: response[j].floorRoomID,
    //                       status: 1,
    //                     });
    //                   }
    //                 }
    //               }

    //               tempList.push({
    //                 floorRoomID: response[j].floorRoomID,
    //                 floorRoomNo: response[j].floorRoomNo,
    //                 status: status,
    //                 availability: response[j].availability,
    //               });
    //               count++;
    //             }
    //           }
    //           if (this.floorRoomList.length == 0) {
    //             this.floorRoomList.push({
    //               floorID: response[i].floorID,
    //               floorNo: response[i].floorNo,
    //               jsonList: tempList,
    //               roomCount: count,
    //             });
    //           } else {
    //             var data = this.floorRoomList.filter(
    //               (x: any) => x.floorID == response[i].floorID
    //             );
    //             if (data.length == 0) {
    //               this.floorRoomList.push({
    //                 floorID: response[i].floorID,
    //                 floorNo: response[i].floorNo,
    //                 jsonList: tempList,
    //                 roomCount: count,
    //               });
    //             }
    //           }
    //         }
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
    // }
  }

  addRoom(obj: any) {
    if (obj.status == 0 && obj.availability == 'Available') {
      obj.status = 1;

      var data = this.featureList.filter((x: any) => x.status == 1);

      if (this.tempFloorRoomList.length == 0) {
        this.tempFloorRoomList.push({
          floorRoomID: obj.floorRoomID,
          floorRoomNo: obj.floorRoomNo,
          jsonFeatures: data,
          status: 1,
        });
      } else {
        if (this.formFields[0].value == '0') {
          this.tempFloorRoomList.push({
            floorRoomID: obj.floorRoomID,
            floorRoomNo: obj.floorRoomNo,
            jsonFeatures: data,
            status: 1,
          });
        } else {
          if (this.tempFloorRoomList.length == 0) {
            this.tempFloorRoomList.push({
              floorRoomID: obj.floorRoomID,
              floorRoomNo: obj.floorRoomNo,
              jsonFeatures: data,
              status: 1,
            });
          } else {
            this.valid.apiInfoResponse('Only 1 room add');
            obj.status = 0;
          }
        }
      }
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
      if (found == true) {
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
          if (response[0].includes('Success') == true) {
            if (this.formFields[0].value > 0) {
              this.valid.apiInfoResponse('Guest Updated Successfully');
            } else {
              this.valid.apiInfoResponse('Guest Added Successfully');
            }
            this.getRoomReservation();
            this.getRoomBooking();

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

    this.tempFloorRoomList = [];
    this.featureList.forEach((item: any) => {
      item.status = false;
    });

    this.guestInfo.resetAll();
  }

  changeTabHeader(tabNum: any) {
    this.index = tabNum;
  }

  editReserved(item: any) {
    this.reset();

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

    $('#reservedRoomModal').modal('hide');
  }

  edit(item: any) {
    this.reset();

    this.index = 0;

    if (item.featuresJson != null) {
      for (var i = 0; i < item.featuresJson.length; i++) {
        for (var j = 0; j < this.featureList.length; j++) {
          if (
            item.featuresJson[i].roomFeatureID ==
            this.featureList[j].roomFeatureID
          ) {
            this.featureList[j].status = 1;
          }
        }
      }
    }

    var data = this.featureList.filter((x: any) => x.status == 1);

    this.tempFloorRoomList.push({
      floorRoomID: item.floorRoomID,
      floorRoomNo: item.roomNo,
      jsonFeatures: data,
      status: 1,
    });

    this.formFields[0].value = item.roomBookingID;
    this.formFields[3].value = item.partyID;
    this.formFields[5].value = new Date(item.checkInDate);
    this.formFields[6].value = new Date(item.checkOutDate);
    this.formFields[7].value = item.checkInTime;
    this.formFields[8].value = item.checkOutTime;
    this.formFields[9].value = item.transactionType;
    this.formFields[10].value = item.reservationStatus;
    this.formFields[11].value = item.roomBookingDetailID;

    this.cmbRoomType = item.roomTypeID;

    this.guestInfo.cmbCNIC = item.partyID;
    this.guestInfo.onCNICChange(item.partyID);

    this.getRoomAvailability(
      item.roomTypeID,
      new Date(item.checkInDate),
      new Date(item.checkOutDate)
    );
  }

  saveReserved() {
    var pageFields = {
      userID: '0', //0
      spType: '', //1
      transactionType: '', //2
      reservationStatus: '', //3
      json: '', //4
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.userID,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.spType,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.transactionType,
        msg: 'select payment method',
        type: 'selectbox',
        required: true,
      },
      {
        value: pageFields.reservationStatus,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.json,
        msg: '',
        type: 'hidden',
        required: false,
      },
    ];

    formFields[0].value = this.global.getUserId().toString();
    formFields[2].value = this.rdbPayment;
    formFields[3].value = 'booked';
    formFields[4].value = JSON.stringify(this.reservedList);

    this.dataService
      .savetHttp(
        pageFields,
        formFields,
        'guestms-api/Service/updateRoomReservation'
      )
      .subscribe(
        (response: any[]) => {
          console.log(response);
          if (response[0].includes('success') == true) {
            this.valid.apiInfoResponse('Booking Confirmed Successfully');
            this.getRoomReservation();
            this.getRoomBooking();

            this.resetReserved();
          } else {
            this.valid.apiErrorResponse(response[0]);
          }
        },
        (error: any) => {
          this.valid.apiErrorResponse(error);
        }
      );
  }

  resetReserved() {
    this.rdbPayment = '';
    this.reservedList = [];
  }

  onReservedCheck(item: any) {
    if (item.status == true) {
      this.reservedList.push({
        roomBookingDetailID: item.roomBookingDetailID,
      });
    } else {
      var index = 0;
      var found = false;
      for (var i = 0; i < this.reservedList.length; i++) {
        if (
          this.reservedList[i].roomBookingDetailID == item.roomBookingDetailID
        ) {
          found = true;
          index = i;
          i = this.reservedList.length + 1;
        }
      }
      if (found == true) {
        this.reservedList.splice(index, 1);
      }
    }
  }

  menuVisible(item: any) {
    // console.log(item);
    this.visible = true;

    this.global.setRoomBookingDetail(item);
  }
  back() {
    this.getRoomBooking();
    this.visible = false;
  }
}
