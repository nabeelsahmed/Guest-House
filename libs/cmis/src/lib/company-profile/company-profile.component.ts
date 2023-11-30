import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { CompanyInterface, MyFormField } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { ContactInfoComponent } from 'libs/shared/shared-components/src/lib/contact-info/contact-info.component';
import { ImageUploadComponent } from 'libs/shared/shared-components/src/lib/image-upload/image-upload.component';
import { CompanyListTableComponent } from './company-list-table/company-list-table.component';
import { environment } from 'apps/guest-house/src/environments/environment';

declare var $: any;
@Component({
  selector: 'general-app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
})
export class CompanyProfileComponent implements OnInit {
  @ViewChild(CompanyListTableComponent) companyTable: any;
  @ViewChild(ContactInfoComponent) contactInfo: any;
  @ViewChild(ImageUploadComponent) imageUpload: any;

  pageFields: CompanyInterface = {
    new_company_id: '0',
    spType: '',
    userID: '0',
    company_name: '',
    company_short_name: '',
    company_registeration_no: '',
    company_registeration_date: '',
    company_ntn: '',
    company_strn: '',
    company_type_id: '',
    company_picture_path: '',
    company_picture: '',
    company_picture_extension: '',
    json: [],
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.new_company_id,
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
      value: this.pageFields.company_name,
      msg: 'enter company name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.company_short_name,
      msg: 'enter company short name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.company_registeration_no,
      msg: 'enter registration no',
      type: 'textBox',
      required: true,
    },
    {
      value: this.pageFields.company_registeration_date,
      msg: 'select registration date',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.company_ntn,
      msg: 'enter ntn',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.company_strn,
      msg: 'enter strn',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.company_type_id,
      msg: 'select company type',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.company_picture_path,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.company_picture,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.company_picture_extension,
      msg: '',
      type: '',
      required: false,
    },
    {
      value: this.pageFields.json,
      msg: 'enter contact info',
      type: 'textbox',
      required: true,
    },
  ];

  companyTypeList: any = [];

  productPic: any;

  error: any;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.global.setHeaderTitle('Company Profile');
    this.productPic = 'https://www.w3schools.com/images/picture.jpg';
    this.formFields[2].value = this.global.getUserId().toString();

    this.getCompany();
    this.getCompanyType();
  }

  getCompany() {
    this.dataService.getHttp('cmis-api/Company/getCompanyList', '').subscribe(
      (response: any) => {
        this.companyTable.tableData = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCompanyDetail(item: any) {
    this.dataService
      .getHttp('cmis-api/Company/getCompanyDetail?company_id=' + item, '')
      .subscribe(
        (response: any) => {
          // console.log(response);
          // this.contactInfo.contactDataList = response;

          this.contactInfo.contactDataList = [];
          for (var i = 0; i < response.length; i++) {
            this.contactInfo.contactDataList.push({
              contact_type_id: response[i].contact_type_id,
              contact_type_title: response[i].contact_type_title,
              contact_info_title: response[i].contact_info_title,
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getCompanyType() {
    this.dataService.getHttp('cmis-api/Company/getCompanyType', '').subscribe(
      (response: any) => {
        this.companyTypeList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  save() {
    this.formFields[11].value = this.imageUpload.image;
    this.formFields[12].value = this.imageUpload.imageExt;

    if (
      this.formFields[11].value != undefined &&
      this.formFields[11].value != ''
    ) {
      this.formFields[10].value = environment.imageUrl + 'companyPictures';
    }

    if (this.contactInfo.contactDataList.length > 0) {
      // console.log(this.contactInfo.contactDataList);
      this.formFields[13].value = JSON.stringify(
        this.contactInfo.contactDataList
      );
    }
    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'cmis-api/Company/saveCompany'
      )
      .subscribe(
        (response: any[]) => {
          console.log(response);
          if (response[0].includes('Success') == true) {
            if (this.formFields[0].value > 0) {
              this.valid.apiInfoResponse('Company updated successfully');
            } else {
              this.valid.apiInfoResponse('Company created successfully');
            }
            this.getCompany();
            this.reset();
          } else {
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
    // this.cmbCountry = '';
    this.formFields[11].value = '';
    this.formFields[12].value = '';
    this.formFields[10].value = '';

    this.contactInfo.contactDataList = [];
  }

  edit(item: any) {
    $('#companyModal').modal('hide');
    // console.log(item);
    this.getCompanyDetail(item.company_id);

    this.formFields[0].value = item.company_id;
    this.formFields[3].value = item.company_name;
    this.formFields[4].value = item.company_short_name;
    this.formFields[5].value = item.company_registeration_no;
    this.formFields[6].value = new Date(item.company_registeration_date);
    this.formFields[7].value = item.company_ntn;
    this.formFields[8].value = item.company_strn;
    this.formFields[9].value = item.company_type_id;
  }

  delete(item: any) {
    this.reset();
    setTimeout(() => this.getCompany(), 200);
  }
}
