import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import {
  GuestProfileInterface,
  MyFormField,
} from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';

declare var $: any;
@Component({
  selector: 'general-app-guest-booking-table',
  templateUrl: './guest-booking-table.component.html',
  styleUrls: ['./guest-booking-table.component.scss'],
})
export class GuestBookingTableComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();
  @Output() eventEmitterMenu = new EventEmitter();

  cmbServiceType: any = '';
  tblSearch: any = '';

  pageFields: GuestProfileInterface = {
    roomServiceID: '0', //0
    spType: '', //1
    userID: '', //2
    roomBookingDetailID: '', //3
    serviceID: '', //4
    serviceQuantity: '', //5
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
      value: this.pageFields.roomBookingDetailID,
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
      type: 'textbox',
      required: true,
    },
  ];

  tableData: any = [];
  servicesList: any = [];
  serviceTitleList: any = [];

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void {
    this.global.setHeaderTitle('Menu Items');
    this.formFields[2].value = this.global.getUserId().toString();
    // this.getServiceType()
  }

  getGuestServiceType() {
    this.dataService
      .getHttp(`guestms-api/Service/getGuestServiceType`, '')
      .subscribe(
        (response: any) => {
          this.servicesList = response;
          console.log(this.servicesList);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getServices(item: any) {
    this.dataService
      .getHttp(
        `guestms-api/Service/getServices?branchID=3&serviceTypeID=` + item,
        ''
      )
      .subscribe((response: any) => {
        console.log(response);
        this.serviceTitleList = response;
      });
  }

  save() {
    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'guestms-api/Service/saveRoomServices'
      )
      .subscribe((response: any[]) => {
        if (response[0].includes('Success') == true) {
          if (this.formFields[0].value > 0) {
            this.valid.apiInfoResponse('Saved Successfully');
          } else {
            this.valid.apiInfoResponse('Service Added Successfully');
          }
        }
      });
  }

  editTable(item: any): void {
    this.formFields[4].value = item.serviceID;
    this.formFields[5].value = item.serviceQuantity;
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';
  }

  edit(item: any) {
    this.eventEmitter.emit(item);
  }

  menuVisible(item: any) {
    this.eventEmitterMenu.emit(item);
  }
}
