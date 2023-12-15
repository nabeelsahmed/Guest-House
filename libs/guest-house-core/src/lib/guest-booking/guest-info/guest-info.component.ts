import { Component, OnInit } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, GuestInfoInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';

@Component({
  selector: 'general-app-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss']
})
export class GuestInfoComponent implements OnInit {

  pageFields: GuestInfoInterface = {
    newUserBranchID: '0', //0
    spType: '', //1
    userID: '', //2
    firstName: '', //3
    lastName: '', //4
    idCard: '', //5
    mobileNumber: '', //6
    email: '', //7
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
      value: this.pageFields.firstName,
      msg: 'enter first name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.lastName,
      msg: 'enter last name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.idCard,
      msg: 'enter id card',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.mobileNumber,
      msg: 'enter mobile number',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.email,
      msg: 'enter email',
      type: 'hidden',
      required: true,
    },
  ];

  idcardMask = this.global.cnicMask();


  constructor(

    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void {

    this.formFields[2].value = this.global.getUserId().toString();
  }

  save() {

    this.dataService
      .savetHttp(this.pageFields, this.formFields, 'user-api/User/createUser')
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
            this.valid.apiInfoResponse('User Added Successfully');
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
