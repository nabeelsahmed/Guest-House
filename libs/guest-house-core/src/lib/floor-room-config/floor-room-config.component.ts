import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, RoomInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { map } from 'rxjs';
import { AddRoomModalComponent } from './add-room-modal/add-room-modal.component';


@Component({
  selector: 'general-app-floor-room-config',
  templateUrl: './floor-room-config.component.html',
  styleUrls: ['./floor-room-config.component.scss']
})


export class FloorRoomConfigComponent implements OnInit {

  @ViewChild(AddRoomModalComponent) addRoomModal: AddRoomModalComponent | undefined;

  pageFields: RoomInterface = {
    floorRoomID: '0', //0
    spType: '', //1
    userID: '', //2
    companyId: '', //3
    branch_id: '', //4
    floorID: '', //5
    room: '', //6
    json: '', //7

  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.floorRoomID,
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
      value: this.pageFields.companyId,
      msg: 'select company',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.branch_id,
      msg: 'select guest house',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.floorID,
      msg: 'select floor',
      type: 'selectbox',
      required: true,
    },
    {
      value: this.pageFields.room,
      msg: 'enter total room',
      type: 'number',
      required: true,
    },
    {
      value: this.pageFields.room,
      msg: '',
      type: 'hidden',
      required: true,
    },
  ];

  selectedCity = 'Islamabad';

  featureSaved = true;
  selectedBranch: number = 0;

  next() {
    this.featureSaved = !this.featureSaved;
  }


  userInput: number = 0;

  roomList: any = [];


  companyList: any = [];
  branchList: any = [];
  floorsList: any = [];

  generateRows() {
    if (this.userInput === this.roomList.length) {
      alert('enter different number of rooms');
    }
    if (this.userInput > this.roomList.length) {
      let j = Math.abs(this.userInput - this.roomList.length)
      for (let i = 0; i < j; i++) {
        this.roomList.push({
          'Room Name': '',
          'Room Type': ''
        });
      }
    }
    else {
      alert('add more rooms than previously entered');
    }
    // console.log(this.roomList)
  }

  constructor(

    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void {
    this.global.setHeaderTitle('Room Floor Configuration');
    this.formFields[2].value = this.global.getUserId().toString();
    this.getCompanyList()
    this.getRoomType()
    this.getFloors()
    // this.getBranch()
  }

  save() {
    this.dataService
      .savetHttp(this.pageFields, this.formFields, 'user-api/User/createUser')
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
            this.valid.apiInfoResponse('Rooms created successfully');
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



  getCompanyList() {
    this.dataService.getHttp('cmis-api/Company/getCompanyList', '').subscribe(
      (response: any[]) => {
        this.companyList = response.map(company => ({
          name: company.company_name,
          code: company.company_id
        }))
        console.log(response)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  getBranch() {
    this.selectedBranch = this.formFields[3].value?.code;
    if (this.selectedBranch > 0) {
      this.dataService.getHttp(`cmis-api/Branch/getBranchCompany?companyID=${this.selectedBranch}`, '').subscribe(
        (response: any[]) => {
          this.branchList = response.map(branch => ({
            name: branch.branch_name,
            code: branch.branch_id
          }))

          this.formFields[4].value = response[0].branch_id
          if (this.addRoomModal) {
            this.addRoomModal.branchId = response[0].branch_id;
          }
          console.log(response[0].branch_id)
        },
        (error: any) => {
          console.log(error)
        }
      )
    } else {
      console.error('Company ID is not available in formFields[3].value');
    }

  }

  onCompanyChange() {
    // let id = this.formFields[3].value.code
    // console.log(typeof (id))
    this.getBranch()
  }

  getRoomType() {
    this.dataService.getHttp(`guestms-api/FloorRoom/getRoomType?branchID=${this.formFields[0].value}`, '').subscribe(
      (response: any[]) => {
        // console.log('room-types', response)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  onBranchChange() {

  }

  getFloors() {
    this.dataService.getHttp('guestms-api/FloorRoom/getAllFloor', '').subscribe(
      (response: any[]) => {
        this.floorsList = response.map(floors => ({
          name: floors.floorNo,
          code: floors.floorID
        }))
        // console.log(response)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  error: any = '';

  // saveRoom() {
  //   this.dataService.savetHttp(this.pageFields, this.formFields, 'guestms-api/FloorRoom/saveRoomTypes')
  //     .subscribe(
  //       (response: any[]) => {
  //         if (response[0].includes('Success') == true) {
  //           if (this.formFields[0].value > 0) {
  //             this.valid.apiInfoResponse('User updated successfully');
  //           } else {
  //             this.valid.apiInfoResponse('User created successfully');
  //           }

  //         } else {
  //           this.valid.apiErrorResponse(response[0]);
  //         }
  //       },
  //       (error: any) => {
  //         this.error = error;
  //         this.valid.apiErrorResponse(this.error);
  //       }
  //     );
  // }
}


