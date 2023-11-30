import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';

@Component({
  selector: 'general-app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.scss'],
})
export class PincodeComponent implements OnInit {
  @Output() responseEvent = new EventEmitter();
  error = '';
  pincode = '';
  getResponse = false;

  hide: boolean = true;

  constructor(
    private dataService: SharedServicesDataModule,
    private global: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {}

  save() {
    var pageFields = {
      userID: '',
      spType: '',
      userPinCode: '',
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
        value: pageFields.userPinCode,
        msg: '',
        type: 'hidden',
        required: false,
      },
    ];
    formFields[0].value = this.global.getUserId().toString();
    formFields[1].value = 'insert';
    formFields[2].value = this.pincode;

    this.dataService
      .savetHttp(pageFields, formFields, 'user-api/User/verifyPin')
      .subscribe(
        (response: any[]) => {
          if (response[0] == 'success') {
            // this.valid.apiInfoResponse('Authenticated');
            this.getResponse = true;
            this.sendResponse();
          } else {
            this.valid.apiErrorResponse('Pincode Didnt Matched');
          }
        },
        (error: any) => {
          this.error = error;
          this.valid.apiErrorResponse(this.error);
        }
      );
  }

  sendResponse() {
    this.responseEvent.emit(this.getResponse);
  }

  modalReset() {
    this.pincode = '';
  }
}
