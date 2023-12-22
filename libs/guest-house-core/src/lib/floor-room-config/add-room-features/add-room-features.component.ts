import { Component, OnInit } from '@angular/core';


import {
  MyFormField,
  AddFeatureInterface,
} from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';

declare var $: any;
@Component({
  selector: 'general-app-add-room-features',
  templateUrl: './add-room-features.component.html',
  styleUrls: ['./add-room-features.component.scss']
})
export class AddRoomFeaturesComponent implements OnInit {

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }



  pageFields: AddFeatureInterface = {
    roomFeatureID: '0', //0
    spType: '', //1
    userID: '0', //2
    roomFeatureTitle: '', //3
    roomFeatureParentID: '0', //4
  }


  formFields: MyFormField[] = [
    {
      value: this.pageFields.roomFeatureID,
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
      value: this.pageFields.roomFeatureTitle,
      msg: 'enter room type title',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.roomFeatureParentID,
      msg: '',
      type: 'hidden',
      required: false,
    },
  ]

  roomFeatures: any[] = []


  ngOnInit(): void {
    this.getRoomType()
  }



  getRoomType() {
    this.dataService.getHttp(`guestms-api/RoomFeatures/getRoomFeatures`, '').subscribe(
      (response: any[]) => {
        // console.log(response)
        this.roomFeatures = response
        // console.log(response)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }


  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';
  }

  error: any = '';
  save() {
    this.dataService.savetHttp(this.pageFields, this.formFields, 'guestms-api/RoomFeatures/saveRoomFeatures').subscribe(
      (response: any[]) => {
        // console.log(response)
        if (response[0].includes('Success') == true) {
          if (this.formFields[0].value > 0) {
            this.valid.apiInfoResponse('Saved Successfully');
          } else {
            this.valid.apiInfoResponse('Feature Added successfully');
          }
          this.reset();
          this.getRoomType()
        } else {
          this.valid.apiErrorResponse(response[0]);
        }
        (error: any) => {
          this.error = error;
          this.valid.apiErrorResponse(this.error);
        }
      })
  }


  edit(item: any) {
    $('#addRoomServices').modal('show');
    this.formFields[0].value = item.roomFeatureID
    this.formFields[2].value = item.userID
    this.formFields[3].value = item.roomFeatureTitle
    this.formFields[4].value = item.roomFeatureParentID
  }


  deleteItem(item: any) {
    var pageFields = {
      roomFeatureID: '0', //0
      spType: '', //1
      userID: '0', //2
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.roomFeatureID,
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

    formFields[0].value = item.roomFeatureID;
    formFields[1].value = 'delete';
    formFields[2].value = this.global.getUserId().toString();

    this.dataService
      .deleteHttp(pageFields, formFields, 'guestms-api/RoomFeatures/saveRoomFeatures')
      .subscribe(
        (response: any) => {
          // console.log(response);
          if (response == 'Success') {
            this.valid.apiInfoResponse('Record deleted successfully');
            this.getRoomType()
          } else {
            this.valid.apiErrorResponse(response[0]);
          }
          this.reset()
          this.getRoomType()

        },
        (error: any) => {
          this.error = error;
          this.valid.apiErrorResponse(this.error);
        }
      );
  }

}
