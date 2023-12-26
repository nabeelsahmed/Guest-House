import { Component, OnInit } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, GuestInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';

@Component({
  selector: 'general-app-guest-booking-child',
  templateUrl: './guest-booking-child.component.html',
  styleUrls: ['./guest-booking-child.component.scss'],
})
export class GuestBookingChildComponent implements OnInit {
  pageFields: GuestInterface = {
    roomBookingID: '0', //0
    spType: '', //1
    userID: '', //2
    partyID: '', //3
    roomJson: '', //4
    checkIn: '', //5
    checkinTime: '', //6
    transactionType: '', //7
    reservationStatus: '', //8
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
      value: this.pageFields.checkinTime,
      msg: 'enter check in time',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.transactionType,
      msg: 'enter check out time',
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

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  /////
  firstName: string = '';
  lastName: string = '';
  cnicNumber: Number = 99999999;
  mobileNumber: Number = 999999;
  email: string = '';
  selection: boolean = true;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;

  checkInTime: Date | undefined;
  checkOutTime: Date | undefined;

  cash: string | undefined;
  bankTransfer: string | undefined;
  cardPayment: string | undefined;

  roomList = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];

  itemList: any = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ];
  ngOnInit(): void {
    this.formFields[2].value = this.global.getUserId().toString();
  }

  save() {
    this.dataService
      .savetHttp(this.pageFields, this.formFields, 'user-api/User/createUser')
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
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
  }
}
