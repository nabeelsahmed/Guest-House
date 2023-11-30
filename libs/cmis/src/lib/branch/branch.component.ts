import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { BranchInterface, MyFormField } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { ContactInfoComponent } from 'libs/shared/shared-components/src/lib/contact-info/contact-info.component';
import { BranchTableComponent } from './branch-table/branch-table.component';

@Component({
  selector: 'general-app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {

  @ViewChild(BranchTableComponent) branchTable: any;
  @ViewChild(ContactInfoComponent) contactInfo: any;

  cmbCountry: any = '';

  pageFields: BranchInterface = {
    new_branch_id: '0',
    spType: '',
    userID: '0',
    branch_name: '',
    branch_type_id: '',
    branch_address: '',
    city_id: '',
    json: [],
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.new_branch_id,
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
      value: this.pageFields.branch_name,
      msg: 'enter branch name',
      type: 'textBox',
      required: true,
    },
    {
      value: this.pageFields.branch_type_id,
      msg: 'select branch type',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.branch_address,
      msg: 'enter branch address',
      type: 'textBox',
      required: true,
    },
    {
      value: this.pageFields.city_id,
      msg: 'select city',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.json,
      msg: 'enter contact info',
      type: 'textbox',
      required: true,
    },
  ];

  branchTypeList: any = [];
  countryList: any = [];
  cityList: any = [];
  branchDetailList: any = [];

  error: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.global.setHeaderTitle("Branch Registration");
    
    this.formFields[2].value = this.global.getUserId().toString();

    this.getBranchType();
    this.getCountry();
  }

  getBranchType(){
    this.dataService
      .getHttp('cmis-api/Branch/getBranchType', '')
      .subscribe(
        (response: any) => {
          this.branchTypeList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getBranchDetail(item: any){
    this.dataService
      .getHttp('cmis-api/Branch/getBranchDetail?branchID=' + item, '')
      .subscribe(
        (response: any) => {
          // this.branchDetailList = response;
          this.contactInfo.contactDataList = [];
          for(var i = 0; i < response.length; i++){
            this.contactInfo.contactDataList.push({
              contact_type_id: response[i].contact_type_id,
              contact_type_title: response[i].contact_type_title,
              contact_info_title: response[i].contact_info_title,
            });
          }
          
          // console.log(response)
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getCountry(){
    this.dataService
      .getHttp('cmis-api/Company/getCountry', '')
      .subscribe(
        (response: any) => {
          this.countryList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  
  getCity(item: any){
    this.dataService
      .getHttp('cmis-api/Company/getCity?countryID=' + item, '')
      .subscribe(
        (response: any) => {
          this.cityList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  
  save(){
    if(this.contactInfo.contactDataList.length > 0){
      // console.log(this.contactInfo.contactDataList);
      this.formFields[7].value = JSON.stringify(this.contactInfo.contactDataList);
    }
    this.dataService
      .savetHttp(this.pageFields, this.formFields, 'cmis-api/Branch/saveBranch')
      .subscribe(
        (response: any[]) => {

          if(response[0].includes('Success') == true){
            if (this.formFields[0].value > 0) {
              this.valid.apiInfoResponse('Branch updated successfully');
            } else {
              this.valid.apiInfoResponse('Branch created successfully');
            }
            this.branchTable.getBranch();
            this.reset();
          }else{
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
    this.cmbCountry = '';  
    this.contactInfo.contactDataList = [];  
  }

  edit(item: any){
    console.log(item);
    this.getBranchDetail(item.branch_id);
    this.cmbCountry = item.countory_id;
    this.getCity(item.countory_id);

    this.formFields[0].value = item.branch_id;
    this.formFields[3].value = item.branch_name;
    this.formFields[4].value = item.branch_type_id;
    this.formFields[5].value = item.address;
    this.formFields[6].value = item.city_id;
    
  }
  
  delete(item: any){
    this.reset();
  }
}
