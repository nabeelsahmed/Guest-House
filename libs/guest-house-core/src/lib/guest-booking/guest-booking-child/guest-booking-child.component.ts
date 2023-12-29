import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, GuestInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { GuestInfoComponent } from '../guest-info/guest-info.component';

@Component({
  selector: 'general-app-guest-booking-child',
  templateUrl: './guest-booking-child.component.html',
  styleUrls: ['./guest-booking-child.component.scss'],
})
export class GuestBookingChildComponent implements OnInit {
  @ViewChild(GuestInfoComponent) guestInfo: any;

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
    transactionType: '', //8
    reservationStatus: '', //9
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
      value: this.pageFields.transactionType,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.reservationStatus,
      msg: '',
      type: 'hidden',
      required: true,
    },
  ];

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule,
    private datePipe: DatePipe
  ) {}

  roomTypeList: any = [];
  tempFloorRoomList: any = [];
  floorRoomList: any = [];
  featureList: any = [];

  ngOnInit(): void {
    this.formFields[2].value = this.global.getUserId().toString();

    this.getRoomType();
    this.getRoomFeatures();
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
          'guestms-api/FloorRoom/getRoomAvailability?branchID=3&roomTypeID=' +
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
    //         '&branchID=3&reservationStatus=' +
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
    if (obj.status == 0) {
      obj.status = 1;

      var data = this.featureList.filter((x: any) => x.status == 1);

      this.tempFloorRoomList.push({
        floorRoomID: obj.floorRoomID,
        floorRoomNo: obj.floorRoomNo,
        jsonFeatures: data,
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

    this.formFields[9].value = 'reserved';

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
            this.valid.apiInfoResponse('Rooms created successfully');
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

    this.guestInfo.resetAll();
    this.tempFloorRoomList = [];
    this.cmbRoomType = '';
    this.floorRoomList = [];
    this.getRoomFeatures();
  }
}
