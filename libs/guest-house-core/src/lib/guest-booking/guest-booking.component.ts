import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, GuestInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';


@Component({
  selector: 'general-app-guest-booking',
  templateUrl: './guest-booking.component.html',
  styleUrls: ['./guest-booking.component.scss']
})
export class GuestBookingComponent implements OnInit {

  pageFields: GuestInterface = {
    newUserBranchID: '0', //0
    spType: '',//1
    userID: '',//2
    roomtype: '',//3
    checkIn: '',//4
    checkOut: '',//5
    checkinTime: '',//6
    checkoutTime: '',//7
  }

  formFields: MyFormField[] = [
    {
      value: this.pageFields.newUserBranchID,
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
      value: this.pageFields.roomtype,
      msg: 'enter room type',
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

  ]





  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ////




  /////





  ngOnInit(): void {
    this.global.setHeaderTitle('Room Booking')

    this.formFields[2].value = this.global.getUserId().toString();

  }

  save() {

    this.dataService
      .savetHttp(this.pageFields, this.formFields, 'user-api/User/createUser')
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
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
  }

}























