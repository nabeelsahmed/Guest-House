import { Component, OnInit } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { MyFormField } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';

@Component({
  selector: 'general-app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {

  cmbContactType: any = '';
  txtContactType: any = '';

  contactList: any = [];
  contactDataList: any = [];

  error: any;

  mobileMask = this.global.mobileMask();
  
  constructor(
    private dataService: SharedServicesDataModule,
    private global: SharedServicesGlobalDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.getContactType();
    this.cmbContactType = 1;
  }

  getContactType(){
    this.dataService.getHttp('cmis-api/Contact/getContactType', '').subscribe(
      (response: any) => {
        this.contactList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  addContact(){
    // alert(this.cmbContactType);
    
    var title = '';
    
    var formFields: MyFormField[] = [];

    if(this.cmbContactType == 1){
      title = 'Email';
      formFields = [
        {
          value: this.txtContactType,
          msg: 'enter email',
          type: 'email',
          required: true,
        }
      ];
      this.valid.validateToastr(formFields);

    } else if(this.cmbContactType == 2){
      title = 'Mobile';
      formFields = [
        {
          value: this.txtContactType,
          msg: 'enter mobile',
          type: 'mobile',
          required: true,
        }
      ];
      this.valid.validateToastr(formFields)
    } else if(this.cmbContactType == 3){
      title = 'Landline';
      formFields = [
        {
          value: this.txtContactType,
          msg: 'enter landline',
          type: 'phone',
          required: true,
        }
      ];
      this.valid.validateToastr(formFields)
    }

    if(this.valid.validateToastr(formFields) == true){
      if(this.contactDataList.length == 0){
        this.contactDataList.push({
          contact_type_id: this.cmbContactType,
          contact_type_title: title,
          contact_info_title: this.txtContactType,
        });
      }else{
        var found = false;
        for(var i = 0; i < this.contactDataList.length; i++){
          if(this.contactDataList[i].contact_info_title == this.txtContactType){
            found = true;
            i = this.contactDataList.length + 1;
          }
        }

        if(found == false){
          this.contactDataList.push({
            contact_type_id: this.cmbContactType,
            contact_type_title: title,
            contact_info_title: this.txtContactType,
          });
        }else{
          if(this.cmbContactType == '1'){
            this.valid.apiErrorResponse('email already exist');return;
          }else if(this.cmbContactType == '2'){
            this.valid.apiErrorResponse('mobile already exist');return;
          }else if(this.cmbContactType == '3'){
            this.valid.apiErrorResponse('landline already exist');return;
          }
        }
      }
      
      this.txtContactType = '';
    }
  }

  remove(index: any){
    this.contactDataList.splice(index, 1);
  }

}
