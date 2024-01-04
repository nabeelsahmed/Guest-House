import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import {
  MyFormField,
  UserCreateInterface,
} from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { UserCreationTableComponent } from './user-creation-table/user-creation-table.component';

declare var $: any;

@Component({
  selector: 'general-app-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.scss'],
})
export class UserCreationComponent implements OnInit {
  @ViewChild(UserCreationTableComponent) userTable: any;

  lblUserCount: any = 0;
  txtSearch: any = '';
  txtConfirmPw: any = '';
  cmbCompany: any = '';

  hide = true;
  hidecp = true;

  pageFields: UserCreateInterface = {
    userID: '0', //0
    spType: '', //1
    firstName: '', //2
    lastName: '', //3
    email: '', //4
    roleID: '', //5
    password: '', //6
    userCNIC: '', //7
    branch_id: '', //8
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.userID,
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
      value: this.pageFields.email,
      msg: 'enter email',
      type: 'email',
      required: true,
    },
    {
      value: this.pageFields.roleID,
      msg: 'select role',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.password,
      msg: 'enter password',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.userCNIC,
      msg: 'enter cnic',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.branch_id,
      msg: 'select branch',
      type: 'selectbox',
      required: true,
    },
  ];

  teacherList: any = [];
  tempTableList: any = [];
  roleList: any = [];
  branchList: any = [];
  companyList: any = [];

  error: any;

  cnicMask = this.global.cnicMask();

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.global.setHeaderTitle('User Creation');
    this.getRoles();
    this.getUser();
    this.getCompany();
  }

  getCompany() {
    this.dataService.getHttp('cmis-api/Company/getCompanyList', '').subscribe(
      (response: any) => {
        this.companyList = response;
        this.cmbCompany = 1;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getBranch(item: any) {
    this.dataService
      .getHttp('cmis-api/Branch/getBranchCompany?companyID=' + item, '')
      .subscribe(
        (response: any) => {
          this.branchList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getUser() {
    this.dataService.getHttp('user-api/User/getAllUser', '').subscribe(
      (response: any) => {
        this.tempTableList = response;
        this.userTable.tableData = response;
        this.lblUserCount = response.length;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getRoles() {
    this.dataService.getHttp('user-api/Role/getAllRole', '').subscribe(
      (response: any) => {
        this.roleList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  save() {
    if (this.formFields[6].value.length < 8) {
      this.valid.apiInfoResponse('password length is less than 8');
      return;
    }
    if (this.txtConfirmPw == '') {
      this.valid.apiInfoResponse('enter confirm password');
      return;
    }
    if (this.formFields[6].value != this.txtConfirmPw) {
      this.valid.apiInfoResponse('password not matched');
      return;
    }

    this.dataService
      .savetHttp(this.pageFields, this.formFields, 'user-api/User/createUser')
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
            if (this.formFields[0].value > 0) {
              this.valid.apiInfoResponse('User updated successfully');
            } else {
              this.valid.apiInfoResponse('User created successfully');
            }
            this.getUser();
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
    this.formFields[0].value = '0';
    this.formFields[7].value = '';
    this.txtConfirmPw = '';
    this.cmbCompany = 1;

    this.branchList = [];
  }

  edit(item: any) {
    $('#userModal').modal('show');
    this.formFields[0].value = item.userID;
    this.formFields[2].value = item.firstName;
    this.formFields[3].value = item.lastName;
    this.formFields[4].value = item.email;
    this.formFields[5].value = item.roleId;
    this.formFields[7].value = item.userCNIC;

    this.getBranch(this.cmbCompany);

    this.formFields[8].value = item.branch_id;
  }

  delete(item: any) {
    this.reset();
    setTimeout(() => this.getUser(), 200);
  }
}
