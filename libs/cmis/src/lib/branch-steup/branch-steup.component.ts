import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import {
  BranchSetupInterface,
  DepartmentContactInterface,
  MyFormField,
} from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { ContactInfoComponent } from 'libs/shared/shared-components/src/lib/contact-info/contact-info.component';
import { BranchListTableComponent } from './branch-list-table/branch-list-table.component';
import { BranchSteupTableComponent } from './branch-steup-table/branch-steup-table.component';

declare var $: any;
@Component({
  selector: 'general-app-branch-steup',
  templateUrl: './branch-steup.component.html',
  styleUrls: ['./branch-steup.component.scss'],
})
export class BranchSteupComponent implements OnInit {
  @ViewChild(BranchSteupTableComponent) deptTable: any;
  @ViewChild(BranchListTableComponent) companyBranchTable: any;
  @ViewChild(ContactInfoComponent) contactInfo: any;

  cmbCompany: any = '';
  cmbBranch: any = '';
  dptHeading: any = '';

  pageFields: BranchSetupInterface = {
    new_company_branch_id: '0',
    spType: '',
    userID: '',
    company_id: '',
    branch_id: '',
    json: [],
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.new_company_branch_id,
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
      value: this.pageFields.company_id,
      msg: 'select company',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.branch_id,
      msg: 'select branch',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.json,
      msg: 'select departments',
      type: 'textbox',
      required: true,
    },
  ];

  pageFieldsDeptContact: DepartmentContactInterface = {
    company_id: '0',
    spType: '',
    branch_id: '0',
    department_section_id: '0',
    json: [],
  };

  formFieldsDeptContact: MyFormField[] = [
    {
      value: this.pageFieldsDeptContact.company_id,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFieldsDeptContact.spType,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFieldsDeptContact.branch_id,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFieldsDeptContact.department_section_id,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFieldsDeptContact.json,
      msg: 'enter contact info',
      type: 'textbox',
      required: true,
    },
  ];

  tempDepartmentList: any = [];
  selectedDepartmentList: any = [];
  branchList: any = [];
  departmentList: any = [];
  companyList: any = [];

  error: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.global.setHeaderTitle('Branch Setup');

    this.formFields[2].value = this.global.getUserId().toString();

    this.getCompany();
    this.getCompanyBranch();
    this.getDepartment();
  }

  getCompanyBranch() {
    this.dataService
      .getHttp('cmis-api/Branch/getCompanyBranchList', '')
      .subscribe(
        (response: any) => {
          this.companyBranchTable.tableData = response;
          // console.log(response);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getCompany() {
    this.dataService.getHttp('cmis-api/Company/getCompanyList', '').subscribe(
      (response: any) => {
        this.companyList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getBranch() {
    this.dataService.getHttp('cmis-api/Branch/getBranchList', '').subscribe(
      (response: any) => {
        this.branchList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getDepartment() {
    this.dataService.getHttp('cmis-api/Department/getDepartment', '').subscribe(
      (response: any) => {
        this.departmentList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getSelectedDepartment() {
    if (this.tempDepartmentList.length == 0) {
      this.deptTable.tableData = [];
      for (var i = 0; i < this.departmentList.length; i++) {
        this.deptTable.tableData.push({
          department_section_id: this.departmentList[i].department_section_id,
          dept_sec_name: this.departmentList[i].dept_sec_name,
          dept_sec_desc: this.departmentList[i].dept_sec_desc,
          parent_id: this.departmentList[i].parent_id,
          status: false,
          branch_department_section_id: 0,
        });
      }
    } else {
      if (
        this.tempDepartmentList.filter(
          (m: { branch_id: any }) => m.branch_id == this.formFields[4].value
        ).length == 0
      ) {
        this.deptTable.tableData = [];
        for (var i = 0; i < this.departmentList.length; i++) {
          this.deptTable.tableData.push({
            department_section_id: this.departmentList[i].department_section_id,
            dept_sec_name: this.departmentList[i].dept_sec_name,
            dept_sec_desc: this.departmentList[i].dept_sec_desc,
            parent_id: this.departmentList[i].parent_id,
            status: false,
            branch_department_section_id: 0,
          });
        }
      } else {
        this.deptTable.tableData = [];

        var index = this.tempDepartmentList.findIndex(
          (m: { branch_id: any }) => m.branch_id == this.formFields[4].value
        );
        var status = false;
        var branchDepSecID = 0;
        // console.log(this.tempDepartmentList);
        for (var i = 0; i < this.departmentList.length; i++) {
          status = false;
          branchDepSecID = 0;
          for (
            var j = 0;
            j < this.tempDepartmentList[index].tempDeptList.length;
            j++
          ) {
            if (
              this.departmentList[i].department_section_id ==
              this.tempDepartmentList[index].tempDeptList[j]
                .department_section_id
            ) {
              status = true;
              branchDepSecID =
                this.tempDepartmentList[index].tempDeptList[j]
                  .branch_department_section_id;
              j = this.tempDepartmentList[index].tempDeptList.length + 1;
            }
          }
          this.deptTable.tableData.push({
            department_section_id: this.departmentList[i].department_section_id,
            dept_sec_name: this.departmentList[i].dept_sec_name,
            dept_sec_desc: this.departmentList[i].dept_sec_desc,
            parent_id: this.departmentList[i].parent_id,
            status: status,
            branch_department_section_id: branchDepSecID,
          });
        }
      }
      console.log(this.deptTable.tableData);
    }
  }

  getDepartmentContact(companyID: any, branchID: any, deptID: any) {
    this.dataService
      .getHttp(
        'cmis-api/Department/getDepartmentContact?companyID=' +
          companyID +
          '&branchID=' +
          branchID +
          '&deptID=' +
          deptID,
        ''
      )
      .subscribe(
        (response: any) => {
          // this.contac = response;
          // console.log(response);
          this.contactInfo.contactDataList = [];
          for (var i = 0; i < response.length; i++) {
            this.contactInfo.contactDataList.push({
              contact_type_id: response[i].contact_type_id,
              contact_type_title: response[i].contact_type_title,
              contact_info_title: response[i].contact_info_title,
            });
          }
          $('#departmentContactModal').modal('show');
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  getBranchSetupJsonData(item: any) {
    var companyField = {
      company_id: '',
    };

    var companyData: MyFormField[] = [
      {
        value: companyField.company_id,
        msg: 'select company ID',
        type: 'label',
        required: false,
      },
    ];

    companyData[0].value = item;

    this.dataService
      .receivedtHttp(
        companyField,
        companyData,
        'cmis-api/Branch/getBranchSetupJson'
      )
      .subscribe(
        (response: any) => {
          this.tempDepartmentList = JSON.parse(response.message);
          console.log(response);
          this.getSelectedDepartment();
          $('#branchModal').modal('hide');
        },
        (error: any) => {
          this.error = error;
          this.valid.apiErrorResponse(this.error);
        }
      );
  }

  addDepartment(item: any) {
    var data = this.branchList.filter(
      (m: { branch_id: any }) => m.branch_id == this.formFields[4].value
    );

    for (var i = 0; i < this.deptTable.tableData.length; i++) {
      if (
        this.deptTable.tableData[i].department_section_id ==
        item.item.department_section_id
      ) {
        this.deptTable.tableData[i].status = item.status;
      }
    }

    if (
      this.tempDepartmentList.filter(
        (m: { branch_id: any }) => m.branch_id == this.formFields[4].value
      ).length == 0
    ) {
      this.selectedDepartmentList = [];

      this.selectedDepartmentList.push({
        department_section_id: item.item.department_section_id,
        dept_sec_name: item.item.dept_sec_name,
      });

      this.tempDepartmentList.push({
        branch_id: this.formFields[4].value,
        branch_name: data[0].branch_name,
        tempDeptList: this.selectedDepartmentList,
      });
    } else {
      var index = this.tempDepartmentList.findIndex(
        (m: { branch_id: any }) => m.branch_id == this.formFields[4].value
      );

      if (
        this.tempDepartmentList[index].tempDeptList.filter(
          (m: { department_section_id: any }) =>
            m.department_section_id == item.item.department_section_id
        ).length == 0
      ) {
        this.tempDepartmentList[index].tempDeptList.push({
          department_section_id: item.item.department_section_id,
          dept_sec_name: item.item.dept_sec_name,
        });
      } else {
        var deptIndex = this.tempDepartmentList[index].tempDeptList.findIndex(
          (m: { department_section_id: any }) =>
            m.department_section_id == item.item.department_section_id
        );

        if (this.tempDepartmentList[index].tempDeptList.length != 0) {
          this.tempDepartmentList[index].tempDeptList.splice(deptIndex, 1);
        }
        if (this.tempDepartmentList[index].tempDeptList.length == 0) {
          this.tempDepartmentList.splice(index, 1);
        }
      }
    }
  }

  removeBranch(index: any, item: any) {
    this.tempDepartmentList.splice(index, 1);
  }

  save() {
    if (this.tempDepartmentList.length > 0) {
      this.formFields[5].value = JSON.stringify(this.tempDepartmentList);
    }
    // console.log(this.formFields)

    // return;
    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'cmis-api/Branch/saveBranchSetup'
      )
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
            // console.log(response);
            if (this.formFields[0].value > 0) {
              this.valid.apiInfoResponse('Branch setup updated successfully');
            } else {
              this.valid.apiInfoResponse('Branch setup created successfully');
            }
            this.getCompanyBranch();
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
    this.tempDepartmentList = [];
    // this.departmentList = [];
    this.deptTable.tableData = [];
    this.branchList = [];
  }

  edit(item: any) {
    this.getBranch();
    this.formFields[0].value = item.company_branch_id;
    this.formFields[3].value = item.company_id;
    this.formFields[4].value = item.branch_id;

    this.getBranchSetupJsonData(item.company_id);
  }

  deptContact(item: any) {
    this.contactInfo.contactDataList = [];
    this.dptHeading = item.dept_sec_name;
    this.formFieldsDeptContact[0].value = this.formFields[3].value;
    this.formFieldsDeptContact[2].value = this.formFields[4].value;
    this.formFieldsDeptContact[3].value = item.department_section_id;
    this.getDepartmentContact(
      this.formFields[3].value,
      this.formFields[4].value,
      item.department_section_id
    );
  }

  saveDeptContact() {
    // console.log(this.tempDepartmentList)
    if (this.contactInfo.contactDataList.length > 0) {
      this.formFieldsDeptContact[4].value = JSON.stringify(
        this.contactInfo.contactDataList
      );
    }

    this.dataService
      .savetHttp(
        this.pageFieldsDeptContact,
        this.formFieldsDeptContact,
        'cmis-api/Department/saveDepartmentContact'
      )
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
            this.valid.apiInfoResponse(
              'Department contact created successfully'
            );
            // this.getCompanyBranch();
            // this.reset();
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

  delete() {
    this.getCompanyBranch();
    this.reset();
  }
}
