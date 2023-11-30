import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';

@Component({
  selector: 'general-app-section-table',
  templateUrl: './section-table.component.html',
  styleUrls: ['./section-table.component.scss']
})
export class SectionTableComponent implements OnInit {

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
    this.getSection();
  }

  getSection(){
    this.dataService.getHttp('cmis-api/Section/getSections', '').subscribe(
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
      newSectionID: '0',
      spType: '',
    };

    var formFields: MyFormField[] = [
      {
        value: pageFields.newSectionID,
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

    formFields[0].value = item.section_id;
    formFields[1].value = "delete";

    this.dataService
      .deleteHttp(
        pageFields,
        formFields,
        'cmis-api/Section/saveSection'
      )
      .subscribe(
        (response: any) => {
          if(response == "Success"){
            this.valid.apiInfoResponse('Record deleted successfully');
            this.getSection();
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
