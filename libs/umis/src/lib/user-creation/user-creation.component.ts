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

  txtSearch: any = '';
  txtConfirmPw: any = '';
  lblUserCount: any = 0;
  hide = true;
  hidecp = true;

  pageFields: UserCreateInterface = {
    userID: '0',
    spType: '',
    userType: '',
    teacherID: '',
    firstName: '',
    lastName: '',
    email: '',
    roleID: '',
    password: '',
    userCNIC: '',
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
      value: this.pageFields.userType,
      msg: 'select user type',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.teacherID,
      msg: 'select teacher',
      type: 'selectbox',
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
  ];

  teacherList: any = [];
  tempTableList: any = [];
  roleList: any = [];

  error: any;

  cnicMask = this.global.cnicMask();

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void {
    this.global.setHeaderTitle('User Creation');
    this.getRoles();
    this.getUser();
    this.getTeacher();
  }

  getTeacher() {
    this.dataService.getHttp('school-api/Teacher/getTeacher', '').subscribe(
      (response: any) => {
        this.teacherList = response;
        // console.log(response);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getUser() {
    this.dataService.getHttp('user-api/User/getAllUser', '').subscribe(
      (response: any) => {
        console.log(response);
        this.tempTableList = response;
        this.userTable.tableData = response;
        this.lblUserCount = response.length;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onTeacherSelect(item: any) {
    var data = this.teacherList.filter(
      (m: { teacherID: any }) => m.teacherID == item
    );
    this.formFields[4].value = data[0].teacherFirstName;
    this.formFields[5].value = data[0].teacherLastName;
    this.formFields[6].value = data[0].teacherEmail;
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
    if (this.formFields[2].value == 'teacher') {
      if (this.formFields[3].value == '') {
        this.valid.apiInfoResponse('select teacher');
        return;
      }
    } else {
      this.formFields[3].value = '0';
    }

    if (this.formFields[8].value.length < 8) {
      this.valid.apiInfoResponse('password length is less than 8');
      return;
    }
    if (this.txtConfirmPw == '') {
      this.valid.apiInfoResponse('enter confirm password');
      return;
    }
    if (this.formFields[8].value != this.txtConfirmPw) {
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
    this.txtConfirmPw = '';
  }

  edit(item: any) {
    $('#userModal').modal('show');
    this.formFields[0].value = item.userID;
    this.formFields[2].value = item.userType;
    this.formFields[3].value = item.teacherID;
    this.formFields[4].value = item.firstName;
    this.formFields[5].value = item.lastName;
    this.formFields[6].value = item.email;
    this.formFields[7].value = item.roleId;
    this.formFields[9].value = item.userCNIC;
    // this.formFields[6].value = item.roleId;
  }

  delete(item: any) {
    this.reset();

    setTimeout(() => this.getUser(), 200);
  }
}
