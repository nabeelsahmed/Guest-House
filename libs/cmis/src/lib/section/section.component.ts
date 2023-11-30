import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, SectionInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { SectionTableComponent } from './section-table/section-table.component';

@Component({
  selector: 'general-app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

  @ViewChild(SectionTableComponent) sectTable: any;
  
  pageFields: SectionInterface = {
    newSectionID: '0',
    spType: '',
    userID: '',
    section_name: '',
    section_description: '',
    department_id: '',
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.newSectionID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.spType,
      msg: '',
      type: 'hidden',
      required: false,
    },{
      value: this.pageFields.userID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.section_name,
      msg: 'enter section name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.section_description,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.department_id,
      msg: 'select department',
      type: 'selectbox',
      required: true,
    }
  ];

  departmentList: any = [];
  error: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.global.setHeaderTitle("Section Registration");
    
    this.getDepartment();
    this.formFields[2].value = this.global.getUserId().toString();
  }

  getDepartment(){
    this.dataService.getHttp('cmis-api/Department/getDepartment', '').subscribe(
      (response: any) => {
        this.departmentList = response;
        console.log(response)
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  save(){

    this.dataService
      .savetHttp(this.pageFields, this.formFields, 'cmis-api/Section/saveSection')
      .subscribe(
        (response: any[]) => {

          if(response[0].includes('Success') == true){
            if (this.formFields[0].value > 0) {
              this.valid.apiInfoResponse('Section updated successfully');
            } else {
              this.valid.apiInfoResponse('Section created successfully');
            }
            this.sectTable.getSection();
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
    this.formFields[4].value = '';
  }

  edit(item: any) {

    console.log(item)
    this.formFields[0].value = item.section_id;
    this.formFields[3].value = item.section_name;
    this.formFields[4].value = item.section_description;
    this.formFields[5].value = item.department_id;

  }

  delete(item: any){
    this.reset();
  }

}
