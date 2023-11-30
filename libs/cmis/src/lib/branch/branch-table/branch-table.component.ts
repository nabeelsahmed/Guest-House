import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';

@Component({
  selector: 'general-app-branch-table',
  templateUrl: './branch-table.component.html',
  styleUrls: ['./branch-table.component.scss']
})
export class BranchTableComponent implements OnInit {
  
  @Output() eventEmitter = new EventEmitter();
  @Output() eventEmitterDelete = new EventEmitter();
  tableData: any = [];

  error: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.getBranch();
  }

  getBranch(){
    this.dataService
      .getHttp('cmis-api/Branch/getBranchList', '')
      .subscribe(
        (response: any) => {
          this.tableData = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  edit(item: any){
    this.eventEmitter.emit(item);
  }

  delete(item: any){
    this.eventEmitterDelete.emit(item);

    var pageFields = {
      new_branch_id: '0',
      userID: '',
      spType: '',
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.new_branch_id,
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
      {
        value: pageFields.spType,
        msg: '',
        type: 'hidden',
        required: false,
      },
    ];

    formFields[0].value = item.branch_id;
    formFields[1].value = this.global.getUserId().toString();
    formFields[2].value = "delete";

    this.dataService
      .deleteHttp(
        pageFields,
        formFields,
        'cmis-api/Branch/saveBranch'
      )
      .subscribe(
        (response: any) => {
          // console.log(response);
          if(response == "Success"){
            this.valid.apiInfoResponse('Record deleted successfully');
            this.getBranch();
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
