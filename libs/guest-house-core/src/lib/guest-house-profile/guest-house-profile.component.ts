import { Component, OnInit } from "@angular/core";

import { SharedHelpersFieldValidationsModule } from "@general-app/shared/helpers/field-validations";
import {
  MyFormField,
  GuestProfileInterface,
} from "@general-app/shared/interface";
import { SharedServicesDataModule } from "@general-app/shared/services/data";
import { SharedServicesGlobalDataModule } from "@general-app/shared/services/global-data";

@Component({
  selector: "general-app-guest-house-profile",
  templateUrl: "./guest-house-profile.component.html",
  styleUrls: ["./guest-house-profile.component.scss"],
})
export class GuestHouseProfileComponent implements OnInit {
  branchID: any = 0;

  pageFields: GuestProfileInterface = {
    roomServiceID: "0", //0
    spType: "", //1
    userID: "0", //2
    roomBookingDetailID: "0", //3
    serviceID: "0", //4
    serviceQuantity: "0", //5
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.roomServiceID,
      msg: "",
      type: "hidden",
      required: false,
    },
    {
      value: this.pageFields.spType,
      msg: "",
      type: "hidden",
      required: false,
    },
    {
      value: this.pageFields.userID,
      msg: "",
      type: "hidden",
      required: false,
    },
    {
      value: this.pageFields.roomBookingDetailID,
      msg: "",
      type: "hidden",
      required: false,
    },
    {
      value: this.pageFields.serviceID,
      msg: "",
      type: "hidden",
      required: false,
    },
    {
      value: this.pageFields.serviceQuantity,
      msg: "",
      type: "hidden",
      required: false,
    },
  ];

  //lists & variables
  guestList: any[] = [];
  servicesList: any[] = [];
  serviceTypeList: any[] = [];
  serviceTypeID: any = "";
  roomBookingId: any = "";
  // roomservicesList: any[] = [];

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}
  ngOnInit(): void {
    this.global.setHeaderTitle("Guest Profile");
    this.formFields[2].value = this.global.getUserId().toString();

    if (this.global.getBranchID() == 0) {
      this.branchID = 3;
    } else {
      this.branchID = this.global.getBranchID();
    }

    this.getRoomBooking();
    this.getServiceType();
    // this.getServices();
  }

  //functions
  getRoomBooking() {
    this.dataService
      .getHttp(
        "guestms-api/RoomBooking/getRoomBooking?branchID=" + this.branchID,
        ""
      )
      .subscribe(
        (response: any[]) => {
          // console.log(response)
          this.guestList = [];
          // var jsonList: any[] = [];
          for (var i = 0; i < response.length; i++) {
            var json = JSON.parse(response[i].services);
            this.guestList.push({
              firstName: response[i].partyFirstName,
              lastName: response[i].partyLastName,
              cnic: response[i].partyCNIC,
              mobileNumber: response[i].partyMobile,
              checkInDate: response[i].checkIn,
              checkOutDate: response[i].checkOut,
              checkInTime: response[i].checkInTime,
              checkOutTime: response[i].checkOutTime,
              roomNo: response[i].floorRoomNo,
              roomtitle: response[i].roomtTypeTitle,
              roomBookingID: response[i].roomBookingID,
              jsonList: json,
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  // {
  //   "partyID": 1,
  //   "roomBookingID": 2,
  //   "floorRoomID": 2,
  //   "partyFirstName": "Shakeel",
  //   "partyLastName": "Abbas",
  //   "partyCNIC": "393402-53533353-9",
  //   "partyMobile": "03000454535",
  //   "checkIn": "2023-12-01",
  //   "checkOut": "2023-12-05",
  //   "checkInTime": "09:15",
  //   "checkOutTime": "10:15",
  //   "reservationStatus": "booked",
  //   "floorRoomNo": "A02",
  //   "roomtTypeTitle": "Single Bed",
  //   "branch_id": 3,
  //   "services": "[{\"serviceID\":1,\"serviceTypeTitle\":\"Breakfast\"}]"
  // }

  getServiceType() {
    this.dataService
      .getHttp("guestms-api/Service/getServiceType", "")
      .subscribe(
        (response: any[]) => {
          // console.log(response)
          this.serviceTypeList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  // Service/getRoomServices(int roomBookingID)

  // {
  //   "roomServiceID": 10,
  //   "roomBookingID": 3,
  //   "serviceTypeID": 2,
  //   "serviceType": "Vehicle",
  //   "serviceID": 7,
  //   "serviceTitle": "Bike",
  //   "quantity": 3,
  //   "amount": 3000
  // }

  // {
  //   "roomServiceID": 10,
  //   "roomBookingID": 3,
  //   "serviceTypeID": 2,
  //   "serviceType": "Vehicle",
  //   "serviceID": 7,
  //   "serviceTitle": "Bike",
  //   "quantity": 3,
  //   "amount": 3000
  // }

  getServices(item: any) {
    this.dataService
      .getHttp(`guestms-api/Service/getRoomServices?roomBookingID=${item}`, "")
      .subscribe(
        (response: any) => {
          this.servicesList = response;
          console.log(response);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
}
