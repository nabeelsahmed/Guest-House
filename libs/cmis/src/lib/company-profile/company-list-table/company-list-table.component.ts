import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';

@Component({
  selector: 'general-app-company-list-table',
  templateUrl: './company-list-table.component.html',
  styleUrls: ['./company-list-table.component.scss']
})
export class CompanyListTableComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();
  @Output() eventEmitterDelete = new EventEmitter();
  tableData: any = [];
  
  error: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {}

  edit(item: any){
    this.eventEmitter.emit(item);
  }
  
  delete(item: any){
    this.eventEmitterDelete.emit(item);

    var pageFields = {
      new_company_id: '0',
      spType: '',
      userID: '',
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.new_company_id,
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
        value: pageFields.userID,
        msg: '',
        type: 'hidden',
        required: false,
      },
    ];

    formFields[0].value = item.company_id;
    formFields[1].value = "delete";
    formFields[2].value = this.global.getUserId().toString();

    this.dataService
      .deleteHttp(
        pageFields,
        formFields,
        'cmis-api/Company/saveCompany'
      )
      .subscribe(
        (response: any) => {
          // console.log(response);
          if(response == "Success"){
            this.valid.apiInfoResponse('Record deleted successfully');
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
}
