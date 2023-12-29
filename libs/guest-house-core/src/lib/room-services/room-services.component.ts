import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageUploadComponent } from 'libs/shared/shared-components/src/lib/image-upload/image-upload.component';

import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, RoomServicesInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { ServicesDetailsComponent } from './services-details/services-details.component';
import { environment } from 'apps/guest-house/src/environments/environment';





declare var $: any;



@Component({
  selector: 'general-app-room-services',
  templateUrl: './room-services.component.html',
  styleUrls: ['./room-services.component.scss']
})
export class RoomServicesComponent implements OnInit {
  @ViewChild(ServicesDetailsComponent) servicesDetails: any;
  @ViewChild(ImageUploadComponent) imageUpload: any;

  pageFields: RoomServicesInterface = {
    serviceID: '0', //0
    spType: '', //1
    userID: '', //2
    serviceParentID: '', //3
    serviceTypeID: '', //4
    serviceTitle: '', //5
    branch_id: '',//6
    serviceCharges: '', //7
    measurementUnitID: '', //8
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
      msg: 'enter service title',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.branch_id, //6
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceCharges, //7
      msg: 'enter amount',
      type: 'input',
      required: true,
    },
    {
      value: this.pageFields.measurementUnitID, //8
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceImagePath, //9
      msg: 'select image path',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.serviceImageExt, //10
      msg: 'select correct image type',
      type: 'hidden',
      required: true,
    },
  ]

  //variables
  companyId: number = 0;
  companyList: any[] = [];
  branchLists: any[] = [];
  services: any[] = [];
  measurements: any[] = [];
  parentServices: any[] = [];





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
    // this.getBranchServices()
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


  getBranch(item: any) {
    if (this.companyId > 0) {
      this.dataService.getHttp(`cmis-api/Branch/getBranchCompany?companyID=` + item, '').subscribe(
        (response: any[]) => {
          this.branchLists = response
          // console.log(response)
        },
        (error: any) => {
          console.log(error)
        }
      )
    } else {
      console.error('Company ID is not available');
    }

  }



  getMeasurementUnit() {
    this.dataService.getHttp('guestms-api/Service/getMeasurementUnit', '').subscribe(
      (response: any[]) => {
        // console.log(response)
        this.measurements = response
      })

  }

  getServiceType() {
    this.dataService.getHttp('guestms-api/Service/getServiceType', '').subscribe(
      (response: any[]) => {
        // console.log(response)
        this.services = response
      })

  }





  getParentType(item1: any, item2: any) {
    this.dataService.getHttp(`guestms-api/Service/getParentService?branchID=${item1}&serviceTypeID=${item2}`, '').subscribe(
      (response: any[]) => {
        // console.log(response)
        this.parentServices = response;
      })

  }







  getBranchServices(item: any) {
    this.dataService.getHttp(`guestms-api/Service/getServices?branchID=` + item, '').subscribe(
      (response: any[]) => {
        console.log('Branch Services', response)
        this.servicesDetails.tableList = response
      })

  }


  save() {
    this.formFields[9].value = this.imageUpload.image;
    this.formFields[10].value = this.imageUpload.imageExt;

    if (
      this.formFields[9].value != undefined &&
      this.formFields[10].value != ''
    ) {
      this.formFields[10].value = environment.imageUrl + 'companyPictures';
    }

    if (this.formFields[10].value != undefined)

      this.dataService
        .savetHttp(this.pageFields, this.formFields, 'guestms-api/Service/saveServices')
        .subscribe(
          (response: any[]) => {
            if (response[0].includes('Success') == true) {
              if (this.formFields[0].value > 0) {
                this.valid.apiInfoResponse('Services saved successfully');
              } else {
                this.valid.apiInfoResponse('Services Saved');
              }
              this.reset();
              this.getBranchServices(this.formFields[6].value)
            } else {
              this.valid.apiErrorResponse(response[0]);
            }
          });
  }

  edit(item: any) {
    this.getParentType(this.formFields[6].value, this.formFields[4].value)
    this.formFields[0].value = item.serviceID;
    this.formFields[3].value = item.serviceParentID;
    this.formFields[4].value = item.serviceTypeID;
    this.formFields[5].value = item.serviceTitle;
    this.formFields[6].value = item.branch_id;
    this.formFields[7].value = item.amount;
    this.formFields[8].value = item.measurementUnitID;

  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';
    this.formFields[7].value = '';
  }

}
