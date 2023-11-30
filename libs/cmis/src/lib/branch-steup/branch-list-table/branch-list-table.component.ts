import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { BranchSteupComponent } from '../branch-steup.component';

@Component({
  selector: 'general-app-branch-list-table',
  templateUrl: './branch-list-table.component.html',
  styleUrls: ['./branch-list-table.component.scss']
})
export class BranchListTableComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();
  @Output() eventEmitterDelete = new EventEmitter();
  
  @ViewChild(BranchSteupComponent) branchSetup: any;
  
  tableData: any = [];
  error: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
  }

  edit(item: any){
    this.eventEmitter.emit(item);
  }
  
  delete(item: any){

    // console.log(item.isDeleted);return;
    var pageFields = {
      new_company_branch_id: '0',
      spType: '',
      userID: '',
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.new_company_branch_id,
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

    formFields[0].value = item.company_branch_id;
    formFields[1].value = "delete";
    formFields[2].value = this.global.getUserId().toString();

    this.dataService
      .deleteHttp(
        pageFields,
        formFields,
        'cmis-api/Branch/saveBranchSetup'
      )
      .subscribe(
        (response: any) => {
          if(response == "Success"){
            if(item.isDeleted == 0){
              this.valid.apiInfoResponse('Branch deactivated successfully');
            }else{
              this.valid.apiInfoResponse('Record activated successfully');
            }
            this.eventEmitterDelete.emit();
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
