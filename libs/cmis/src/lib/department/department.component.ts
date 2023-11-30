import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentTableComponent } from './department-table/department-table.component';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, DepartmentInterface } from '@general-app/shared/interface';

@Component({
  selector: 'general-app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  @ViewChild(DepartmentTableComponent) deptTable: any;
  
  pageFields: DepartmentInterface = {
    newDeptSecID: '0',
    spType: '',
    userID: '',
    dept_sec_name: '',
    dept_sec_desc: '',
    dept_sec_type: '',
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.newDeptSecID,
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
      value: this.pageFields.dept_sec_name,
      msg: 'enter department name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.dept_sec_desc,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.dept_sec_type,
      msg: '',
      type: '',
      required: false,
    }
  ];

  error: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.global.setHeaderTitle("Department Registration");

    this.formFields[2].value = this.global.getUserId().toString();
  }

  save(){

    this.formFields[5].value = 'D';

    this.dataService
      .savetHttp(this.pageFields, this.formFields, 'cmis-api/Department/saveDepartment')
      .subscribe(
        (response: any[]) => {

          if(response[0].includes('Success') == true){
            if (this.formFields[0].value > 0) {
              this.valid.apiInfoResponse('Department updated successfully');
            } else {
              this.valid.apiInfoResponse('Department created successfully');
            }
            this.deptTable.getDepartment();
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
    this.formFields[0].value = item.department_section_id;
    this.formFields[3].value = item.dept_sec_name;
    this.formFields[4].value = item.dept_sec_desc;

  }

  delete(item: any){
    this.reset();

    // setTimeout(() => this.getUser(), 200 ); 
  }

}
