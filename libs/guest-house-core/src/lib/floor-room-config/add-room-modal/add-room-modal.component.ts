import { Component, OnInit, Input } from '@angular/core';

import {
  MyFormField,
  RoomConfigModalIterface,
} from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';

declare var $: any;
@Component({
  selector: 'general-app-add-room-modal',
  templateUrl: './add-room-modal.component.html',
  styleUrls: ['./add-room-modal.component.scss']
})
export class AddRoomModalComponent implements OnInit {

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  pageFields: RoomConfigModalIterface = {
    roomTypeID: '0', //0
    spType: '', //1
    userID: '0', //2
    roomTypeTitle: '', //3
    branch_id: '', //4
  }

  formFields: MyFormField[] = [
    {
      value: this.pageFields.roomTypeID,
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
      value: this.pageFields.roomTypeTitle,
      msg: 'enter room type title',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.branch_id,
      msg: '',
      type: 'hidden',
      required: false,
    },
  ]

  error: any = ''



  roomtypes: any[] = []

  ngOnInit(): void {
    this.getRoomType()
  }

  getRoomType() {
    this.dataService.getHttp(`guestms-api/FloorRoom/getRoomType`, '').subscribe(
      (response: any[]) => {
        this.roomtypes = response
        console.log(this.roomtypes)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  save() {
    this.dataService.savetHttp(this.pageFields, this.formFields, 'guestms-api/FloorRoom/saveRoomTypes').subscribe(
      (response: any[]) => {
        console.log(this.formFields[4].value)
        if (response[0].includes('Success') == true) {
          if (this.formFields[0].value > 0) {
            this.valid.apiInfoResponse('User updated successfully');
          } else {
            this.valid.apiInfoResponse('Room Created successfully');
          }
          this.getRoomType()
          this.reset();
        } else {
          this.valid.apiErrorResponse(response[0]);
        }
      },
      (error: any) => {
        this.error = error;
        this.valid.apiErrorResponse(this.error);
      }
    );
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0'
  }

  edit(item: any) {
    $('#addRoomType').modal('show');
    this.formFields[0].value = item.roomTypeID
    this.formFields[2].value = item.userID
    this.formFields[3].value = item.roomTypeTitle
    this.formFields[4].value = item.branch_id
  }

  deleteItem(item: any) {

    var pageFields = {
      roomTypeID: '0', //0
      spType: '', //1
      userID: '0', //2
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.roomTypeID,
        msg: '',
        type: 'hidden',
        required: false,
      },
      {
        value: pageFields.spType,
        msg: '',
        type: 'hidden',
        required: false,
      }, {
        value: pageFields.userID,
        msg: '',
        type: 'hidden',
        required: false,
      }
    ];

    formFields[0].value = item.roomTypeID;
    formFields[1].value = 'delete';
    formFields[2].value = this.global.getUserId().toString();

    this.dataService
      .deleteHttp(pageFields, formFields, 'guestms-api/FloorRoom/saveRoomTypes')
      .subscribe(
        (response: any) => {
          // console.log(response);
          if (response == 'Success') {
            this.valid.apiInfoResponse('Record deleted successfully');
            this.getRoomType()
          } else {
            this.valid.apiErrorResponse(response[0]);
          }
        },
        (error: any) => {
          this.error = error;
          this.valid.apiErrorResponse(this.error);
        }
      );
  }
}


