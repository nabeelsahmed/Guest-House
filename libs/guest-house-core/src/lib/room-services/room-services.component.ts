import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageUploadComponent } from 'libs/shared/shared-components/src/lib/image-upload/image-upload.component';

import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, RoomServicesInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';






@Component({
  selector: 'general-app-room-services',
  templateUrl: './room-services.component.html',
  styleUrls: ['./room-services.component.scss']
})
export class RoomServicesComponent implements OnInit {

  pageFields: RoomServicesInterface = {
    serviceID: '0', //0
    spType: '', //1
    userID: '0', //2
    serviceParentID: '', //3
    serviceTypeID: '', //4
    serviceTitle: '', //5
    branch_id: '0',//6
    serviceCharges: '0', //7
    measurementUnitID: '0', //8
    serviceImagePath: '', //9
    serviceImageExt: '', //10
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.serviceID, //0
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.spType, //1
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.userID, //2
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceParentID, //3
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceTypeID, //4
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceTitle, //5
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.branch_id, //6
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceCharges, //7
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.measurementUnitID, //8
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceImagePath, //9
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceImageExt, //10
      msg: '',
      type: 'hidden',
      required: false,
    },
  ]

  //variables
  companyId: number = 0;
  companyList: any[] = [];
  branchLists: any[] = [];



  //
  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void {
    this.global.setHeaderTitle('Room Services');
    this.formFields[2].value = this.global.getUserId().toString();

    //functions
    this.getMeasurementUnit()
    this.getServiceType()
    this.getCompanyLists()
  }


  //get-company-lists
  getCompanyLists() {
    this.dataService.getHttp('cmis-api/Company/getCompanyList', '').subscribe(
      (response: any[]) => {
        this.companyList = response
        // console.log(response);
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  //get-branch-id
  onCompanySelect() {
    this.getBranch()
  }


  getBranch() {
    if (this.companyId > 0) {
      this.dataService.getHttp(`cmis-api/Branch/getBranchCompany?companyID=${this.companyId}`, '').subscribe(
        (response: any[]) => {
          this.branchLists = response
          console.log(response)
        },
        (error: any) => {
          console.log(error)
        }
      )
    } else {
      console.error('Company ID is not available in formFields[3].value');
    }

  }



  getMeasurementUnit() {
    this.dataService.getHttp('guestms-api/Service/getMeasurementUnit', '').subscribe(
      (response: any[]) => {
        // console.log(response)
      })

  }

  getServiceType() {
    this.dataService.getHttp('guestms-api/Service/getServiceType', '').subscribe(
      (response: any[]) => {
        // console.log(response)
      })

  }


}
