import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import {
  GuestProfileInterface,
  MyFormField,
} from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';

@Component({
  selector: 'general-app-guest-booking-table',
  templateUrl: './guest-booking-table.component.html',
  styleUrls: ['./guest-booking-table.component.scss'],
})
export class GuestBookingTableComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();

  cmbServiceType: any = '';

  tblSearch: any = '';

  pageFields: GuestProfileInterface = {
    roomServiceID: '0', //0
    spType: '', //1
    userID: '0', //2
    roomBookingID: '0', //3
    serviceID: '0', //4
    serviceQuantity: '0', //5
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.roomServiceID,
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
      value: this.pageFields.roomBookingID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceQuantity,
      msg: '',
      type: 'hidden',
      required: false,
    },
  ];

  tableData: any = [];
  servicesList: any = [];
  serviceTypeList: any = [];

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {}

  getServices(item: any) {
    this.dataService
      .getHttp(`guestms-api/Service/getRoomServices?roomBookingID=${item}`, '')
      .subscribe(
        (response: any) => {
          this.servicesList = response;
          console.log(response);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  edit(item: any) {
    this.eventEmitter.emit(item);
  }
}
