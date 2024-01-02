import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, RoomInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { map } from 'rxjs';
import { AddRoomModalComponent } from './add-room-modal/add-room-modal.component';
import { FloorRoomSubComponent } from './floor-room-sub/floor-room-sub.component';
import { RoomFeaturesComponent } from './room-features/room-features.component';


@Component({
  selector: 'general-app-floor-room-config',
  templateUrl: './floor-room-config.component.html',
  styleUrls: ['./floor-room-config.component.scss']
})


export class FloorRoomConfigComponent implements OnInit {
  @ViewChild(AddRoomModalComponent) addRoomModal: any;
  @ViewChild(FloorRoomSubComponent) floorRoomSub: any;
  @ViewChild(RoomFeaturesComponent) roomFeaturesChild: any;

  //variables and lists
  featureSaved = true;
  selectedBranch: number = 0;
  userInput: any = '';
  roomList: any = [];


  companyList: any = [];
  branchList: any = [];
  floorsList: any = [];

  selectedBranchId: number = 0;


  checksave: boolean = false;
  next: boolean = false;
  hideField: boolean = false;

  roomsNumList: any[] = []
  featuresScreen: boolean = false;
  error: any = '';

  selectedCompany: number = 0;



  pageFields: RoomInterface = {
    floorRoomID: '0', //0
    spType: '', //1
    userID: '0', //2
    branch_id: '', //3
    floorID: '', //4
    json: '', //5
    floorRoomFeatureID: '0'//6
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
      value: this.pageFields.json,
      msg: 'select room details',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.floorRoomFeatureID,
      msg: '',
      type: 'hidden',
      required: false,
    },
  ];



  ////
  constructor(

    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void {
    this.global.setHeaderTitle('Room Floor Configuration');
    this.formFields[2].value = this.global.getUserId().toString();
    this.getRoomType()
    this.getCompanyList()
    this.getFloors()
    // this.getFloorRoomFeatures()
  }

  //functions 
  nextFunc(): void {
    // if (this.checksave === false) {
    //   this.next = false;
    // } else {
    //   this.next = true;
    //   this.reset();
    // }
    this.next = true;
    this.reset();

  }
  generateRows() {
    if (this.formFields[3].value === '') {
      this.valid.apiInfoResponse('Select Branch');
    }
    if (this.formFields[4].value === '') {
      this.valid.apiInfoResponse('Select Floors');
    }
    if (this.userInput > this.floorRoomSub.roomList.length && this.formFields[3].value != '' && this.formFields[4].value != '') {
      let j = Math.abs(this.userInput - this.roomList.length)
      for (let i = 0; i < j; i++) {
        this.floorRoomSub.roomList.push({
          floorRoomNo: '',
          roomTypeID: '',
        });
      }
    }

  }

  getCompanyList() {
    this.dataService.getHttp('cmis-api/Company/getCompanyList', '').subscribe(
      (response: any[]) => {
        this.companyList = response
      },
      (error: any) => {
        console.log(error)
      }
    )
  }
  getBranch(item: any) {
    if (item > 0) {
      this.dataService.getHttp(`cmis-api/Branch/getBranchCompany?companyID=` + item, '').subscribe(
        (response: any[]) => {
          this.branchList = response
          // console.log(this.branchList)
        },
        (error: any) => {
          console.log(error)
        }
      )
    } else {
      this.valid.apiInfoResponse('Company Not Available');
    }

  }

  getRoomType() {
    this.dataService.getHttp(`guestms-api/FloorRoom/getRoomType`, '').subscribe(
      (response: any[]) => {
        this.floorRoomSub.roomType = response;
      },
      (error: any) => {
        console.log(error)
      }
    )
  }


  getFloors() {
    this.dataService.getHttp('guestms-api/FloorRoom/getAllFloor', '').subscribe(
      (response: any[]) => {
        this.floorsList = response
      },
      (error: any) => {
        console.log(error)
      }
    )
  }


  getDbFloors(item1: any, item2: any) {
    if (item1 > 0 && item2 > 0) {
      this.dataService.getHttp(`guestms-api/FloorRoom/getFloorRooms?branchID=${item1}&floorID=${item2}`, '').subscribe(
        (response: any[]) => {
          console.log(response)
          this.getRooms(item1, item2);
          var roomList = JSON.parse(response[0].rooms)
          if (response[0].num > 0) {
            this.hideField = true
            this.floorRoomSub.roomList = [];
            for (let i = 0; i < roomList.length; i++) {
              this.floorRoomSub.roomList.push({
                floorRoomNo: roomList[i].floorRoomNO,
                roomTypeID: roomList[i].roomTypeID,
                rentPerNight: roomList[i].rentPerNight
              });
            }
          }
        })
    }

  }
  getRooms(item1: any, item2: any) {
    this.dataService.getHttp(`guestms-api/FloorRoom/getFloorRoomsName?branchID=${item1}&floorID=${item2}`, '').subscribe(
      (response: any[]) => {
        this.roomsNumList = response

      })
  }
  getFloorRoomFeatures() {
    this.dataService.getHttp(`guestms-api/RoomFeatures/getFloorRoomFeatures`, '').subscribe(
      (response: any[]) => {
        this.roomFeaturesChild.roomFeaturesList = [];
        for (var i = 0; i < response.length; i++) {
          var jsonList = [];
          jsonList = JSON.parse(response[i].roomFeatureSubTitle)
          this.roomFeaturesChild.roomFeaturesList.push({
            roomFeatureID: response[i].roomFeatureID,
            roomFeatureTitle: response[i].roomFeatureTitle,
            status: 0,
            roomFeatureJson: jsonList
          })
        }
        // console.log(this.roomFeaturesChild.roomFeatures);

      }
    );
  }

  save() {
    // this.formFields[4].value = 2
    // this.formFields[5].value = 2
    for (var i = 0; i < this.floorRoomSub.roomList.length; i++) {
      if (this.floorRoomSub.roomList[i].floorRoomNo == '') {
        this.valid.apiInfoResponse('enter room name');
        return;
      } else if (this.floorRoomSub.roomList[i].roomTypeID == '') {
        this.valid.apiInfoResponse('select room type');
        return
      }
    }
    this.formFields[5].value = JSON.stringify(this.floorRoomSub.roomList)
    this.dataService.savetHttp(this.pageFields, this.formFields, 'guestms-api/FloorRoom/saveFloorRoom').subscribe(
      (response: any[]) => {
        if (response[0].includes('Success') == true) {
          if (this.formFields[0].value > 0) {
            this.valid.apiInfoResponse('Saved Successfully');
          } else {
            this.valid.apiInfoResponse('Room Created successfully');
            this.checksave = true;
          }
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


  saveFeatures() {
    this.formFields[5].value = JSON.stringify(this.roomFeaturesChild.roomFeaturesList);
    this.formFields[1].value = 'insert';
    this.dataService.savetHttp(this.pageFields, this.formFields, 'guestms-api/RoomFeatures/saveFloorRoomFeatures').subscribe(
      (response: any[]) => {
        if (response[0].includes('Success') == true) {
          if (this.formFields[0].value > 0) {
            this.valid.apiInfoResponse('Saved Successfully');
          } else {
            this.valid.apiInfoResponse('Room Created successfully');
            this.checksave = true;
          }
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
  }





  validateInput(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode);

    if (!/^\d+$/.test(inputChar) || event.key === 'e') {
      event.preventDefault();
    }
    //prevent minus input
    if (event.key === '-' || event.key === 'Minus') {
      event.preventDefault();
    }
  }

}


