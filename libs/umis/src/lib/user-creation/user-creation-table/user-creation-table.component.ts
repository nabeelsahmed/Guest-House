import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import {
  MyFormField,
  UserBranchInterface,
} from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
declare var $: any;

@Component({
  selector: 'general-app-user-creation-table',
  templateUrl: './user-creation-table.component.html',
  styleUrls: ['./user-creation-table.component.scss'],
})
export class UserCreationTableComponent implements OnInit {
  @Input() tblSearch: any = '';
  @Output() eventEmitter = new EventEmitter();
  @Output() eventEmitterDelete = new EventEmitter();

  lblUserName: any = '';

  tempBranchList: any = [];
  tableData: any = [];
  branchList: any = [];
  error: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void { }

  edit(item: any) {
    this.eventEmitter.emit(item);
  }

  delete(item: any) {
    this.eventEmitterDelete.emit(item);

    var pageFields = {
      userID: '0',
      spType: '',
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
    ];

    formFields[0].value = item.userID;
    formFields[1].value = 'delete';

    this.dataService
      .deleteHttp(pageFields, formFields, 'user-api/User/createUser')
      .subscribe(
        (response: any) => {
          // console.log(response);
          if (response == 'Success') {
            this.valid.apiInfoResponse('Record deleted successfully');
            // this.getUser();
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
