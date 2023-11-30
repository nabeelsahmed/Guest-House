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

  pageFields: UserBranchInterface = {
    newUserBranchID: '0',
    spType: '',
    userID: '',
    json: '',
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
      value: this.pageFields.json,
      msg: 'select branch',
      type: 'textbox',
      required: true,
    },
  ];

  tempBranchList: any = [];
  tableData: any = [];
  branchList: any = [];
  error: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.getClassBranchDepartment();
  }

  getClassBranchDepartment() {
    this.dataService
      .getHttp('cmis-api/Branch/getClassBranchDepartment', '')
      .subscribe(
        (response: any) => {
          // this.branchList = response;
          this.branchList = [];
          for (var i = 0; i < response.length; i++) {
            this.branchList.push({
              branch_id: response[i].branch_id,
              branch_department_section_id:
                response[i].branch_department_section_id,
              branch_name: response[i].branch_name,
              status: false,
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  branchChange(event: MatCheckboxChange, item: any, index: any) {
    if (event.checked == true) {
      this.tempBranchList.push({
        branchID: item.branch_id,
      });
    } else {
      this.tempBranchList.splice(index, 1);
    }
  }

  getUserBranch(item: any) {
    // this.reset();
    for (var j = 0; j < this.branchList.length; j++) {
      this.branchList[j].status = false;
    }

    this.dataService
      .getHttp('user-api/User/getUserBranches?userID=' + item, '')
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
              for (var j = 0; j < this.branchList.length; j++) {
                if (response[i].branchID == this.branchList[j].branch_id) {
                  this.branchList[j].status = true;
                }
              }
            }
          }
          setTimeout(() => $('#branchModal').modal('show'), 200);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  saveBranch() {
    // var tempBranchList = [];
    if (this.tempBranchList.length == 0) {
      for (var i = 0; i < this.branchList.length; i++) {
        if (this.branchList[i].status == true) {
          this.tempBranchList.push({
            branchID: this.branchList[i].branch_id,
          });
        }
      }
    }

    this.formFields[3].value = JSON.stringify(this.tempBranchList);

    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'user-api/User/saveUserBranch'
      )
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
            this.valid.apiInfoResponse('Record created successfully');
            this.reset();
            $('#branchModal').modal('hide');
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
    this.getClassBranchDepartment();
  }

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

  addBranch(item: any) {
    this.getUserBranch(item.userID);
    this.lblUserName = item.firstName + ' ' + item.lastName;

    this.formFields[2].value = item.userID;
  }
}
