import { Component, OnInit } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, RoomInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';

@Component({
  selector: 'general-app-floor-room-config',
  templateUrl: './floor-room-config.component.html',
  styleUrls: ['./floor-room-config.component.scss']
})
export class FloorRoomConfigComponent implements OnInit {


  pageFields: RoomInterface = {
    newUserBranchID: '0', //0
    spType: '', //1
    userID: '', //2
    companyID: '', //3
    guestHouseID: '', //4
    floor: '', //5
    room: '', //6
  };

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
      value: this.pageFields.companyID,
      msg: 'select company',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.guestHouseID,
      msg: 'select guest house',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.floor,
      msg: 'select floor',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.room,
      msg: 'enter total room',
      type: 'number',
      required: true,
    },
  ];



  selectedCity = 'Islamabad';

  featureSaved = true;

  next() {
    this.featureSaved = !this.featureSaved;
  }


  userInput: number = 0;

  rows: number[] = [];


  generateRows() {
    this.rows = Array.from({ length: this.userInput }, (_, index) => index + 1);
  }


  constructor(

    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void {
    this.global.setHeaderTitle('Room Floor Configuration');

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
