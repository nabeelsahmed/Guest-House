import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, GuestInfoInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';

@Component({
  selector: 'general-app-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss'],
})
export class GuestInfoComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();

  lblPartyID: any = 0;
  lblPartyName: any = '';
  lblPartyEmail: any = '';
  lblPartyMobile: any = '';
  lblPartyCNIC: any = '';

  cmbCNIC: any = '';

  pageFields: GuestInfoInterface = {
    partyID: '0', //0
    spType: '', //1
    userID: '', //2
    partyFirstName: '', //3
    partyLastName: '', //4
    partyCNIC: '', //5
    partyMobile: '', //6
    partyEmail: '', //7
  };
  formFields: MyFormField[] = [
    {
      value: this.pageFields.partyID,
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
      value: this.pageFields.partyFirstName,
      msg: 'enter first name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.partyLastName,
      msg: 'enter last name',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.partyCNIC,
      msg: 'enter id card',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.partyMobile,
      msg: 'enter mobile number',
      type: 'mobile',
      required: true,
    },
    {
      value: this.pageFields.partyEmail,
      msg: 'enter email',
      type: 'email',
      required: true,
    },
  ];

  partyList: any = [];

  cnicMask = this.global.cnicMask();
  mobileMask = this.global.mobileMask();

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.formFields[2].value = this.global.getUserId().toString();
    this.getParty();
  }

  getParty() {
    this.dataService
      .getHttp('guestms-api/Party/getParty?partyID=0', '')
      .subscribe(
        (response: any) => {
          this.partyList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  onCNICChange(item: any) {
    var data = this.partyList.filter((X: any) => X.partyID == item);

    this.eventEmitter.emit(data);

    this.lblPartyID = data[0].partyID;
    this.lblPartyCNIC = data[0].partyCNIC;
    this.lblPartyName = data[0].partyFirstName + ' ' + data[0].partyLastName;
    this.lblPartyEmail = data[0].partyEmail;
    this.lblPartyMobile = data[0].partyMobile;
  }

  save() {
    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'guestms-api/Party/saveParty'
      )
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
            this.valid.apiInfoResponse('User Added Successfully');
            this.reset();
          } else {
            this.valid.apiErrorResponse(response[0]);
          }
        },
        (error: any) => {
          this.valid.apiErrorResponse(error);
        }
      );
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';
  }

  resetAll() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';

    this.lblPartyID = 0;
    this.lblPartyName = '';
    this.lblPartyEmail = '';
    this.lblPartyMobile = '';
    this.lblPartyCNIC = '';

    this.cmbCNIC = '';
  }
}
