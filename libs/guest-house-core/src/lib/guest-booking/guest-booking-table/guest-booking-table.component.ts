import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import {
  GuestProfileInterface,
  MyFormField,
} from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { PrintBillComponent } from './print-bill/print-bill.component';

declare var $: any;
@Component({
  selector: 'general-app-guest-booking-table',
  templateUrl: './guest-booking-table.component.html',
  styleUrls: ['./guest-booking-table.component.scss'],
})
export class GuestBookingTableComponent implements OnInit {
  @ViewChild(PrintBillComponent) printBill: any;

  @Output() eventEmitter = new EventEmitter();
  @Output() eventEmitterMenu = new EventEmitter();
  @Output() eventEmitterPrint = new EventEmitter();

  txtDiscount: any = 0;
  cmbServiceType: any = '';
  tblSearch: any = '';
  divVisible: any = false;

  // {
  //   "roomBookingID": 0,
  //   "partyID": 0,
  //   "checkIn": "string",
  //   "checkOut": "string",
  //   "checkInTime": "string",
  //   "checkOutTime": "string",
  //   "transactionType": "string",
  //   "reservationStatus": "checkOut",
  //   "discount": 30,
  //   "roomJson": "[{\"roomBookingDetailID\":1}]",
  //   "userID": 0,
  //   "spType": "updateCheckOut"
  // }

  pageFields: GuestProfileInterface = {
    roomServiceID: '0', //0
    spType: '', //1
    userID: '', //2
    roomBookingDetailID: '', //3
    serviceID: '', //4
    serviceQuantity: '', //5
    discount: '', //6
    roomJson: '', //7
  };

  formFields: MyFormField[] = [
    {
      value: this.pageFields.roomServiceID,
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
      value: this.pageFields.roomBookingDetailID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.serviceQuantity,
      msg: '',
      type: 'textbox',
      required: true,
    },
    {
      value: this.pageFields.discount,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.roomJson,
      msg: '',
      type: 'textbox',
      required: true,
    },
  ];

  tableData: any = [];
  servicesList: any = [];
  serviceTitleList: any = [];

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void {
    this.global.setHeaderTitle('Menu Items');
    this.formFields[2].value = this.global.getUserId().toString();
  }

  getGuestServiceType() {
    this.reset()
    this.serviceTitleList = [];
    this.dataService
      .getHttp(`guestms-api/Service/getGuestServiceType`, '')
      .subscribe(
        (response: any) => {
          this.servicesList = response;
          console.log(this.servicesList);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  getServices(item: any) {
    var bookingID = this.formFields[3].value
    this.dataService
      .getHttp(
        `guestms-api/Service/getRoomServices?&serviceTypeID=` + item + `&roomBookingDetailID=` + bookingID,
        ''
      )
      .subscribe((response: any) => {
        console.log(response);
        this.serviceTitleList = response;
      });
  }

  save() {
    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'guestms-api/Service/saveRoomServices'
      )
      .subscribe((response: any[]) => {
        if (response[0].includes('Success') == true) {
          this.reset();
          // this.getServices();
          if (this.formFields[0].value > 0) {
            this.valid.apiInfoResponse('Saved Successfully');
          } else {
            this.valid.apiInfoResponse('Service Added Successfully');
          }
        }
      });
  }


  editTable(item: any): void {
    this.formFields[0].value = item.roomServiceID
    // this.formFields[2].value = item.userID
    this.formFields[4].value = item.serviceID;
    this.formFields[5].value = item.quantity;
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';
    this.cmbServiceType = ''
  }

  edit(item: any) {
    this.eventEmitter.emit(item);
  }

  menuVisible(item: any) {
    this.eventEmitterMenu.emit(item);
  }

  printGuest(item: any) {
    console.log(item);
    if (item.status == true) {
      this.printBill.lblGuestName = item.firstName + ' ' + item.lastName;
      this.printBill.lblCNIC = item.cnic;
      this.printBill.lblMobile = item.mobileNumber;
      this.printBill.lblCheckIn = item.checkInDate;
      this.printBill.lblCheckOut = item.checkOutDate;
      this.printBill.lblRoomBookingID = item.roomBookingID;

      this.printBill.roomList.push({
        floorRoomID: item.floorRoomID,
        roomNo: item.roomNo,
        roomtitle: item.roomtitle,
        floorNo: item.floorNo,
      });

      for (var i = 0; i < item.billJson.length; i++) {
        if (this.printBill.roomDetailList.length == 0) {
          this.printBill.roomDetailList.push({
            floorRoomID: item.floorRoomID,
            serviceID: item.billJson[i].serviceID,
            title: item.billJson[i].serviceTitle,
            amount: item.billJson[i].serviceAmount,
            quantity: item.billJson[i].serviceQuantity,
          });
        } else {
          var roomFound = false;
          var roomIndex = 0;

          for (var j = 0; j < this.printBill.roomDetailList.length; j++) {
            if (
              this.printBill.roomDetailList[j].serviceID ==
              item.billJson[i].serviceID
            ) {
              roomFound = true;
              j = this.printBill.roomDetailList.length + 1;
            }
          }

          if (roomFound == true) {
            this.printBill.roomDetailList[roomIndex].quantity +=
              item.billJson[i].serviceQuantity;
          } else {
            this.printBill.roomDetailList.push({
              floorRoomID: item.floorRoomID,
              serviceID: item.billJson[i].serviceID,
              title: item.billJson[i].serviceTitle,
              amount: item.billJson[i].serviceAmount,
              quantity: item.billJson[i].serviceQuantity,
            });
          }
        }
      }
    } else {
      var found = false;
      var index = 0;

      for (var i = 0; i < this.printBill.roomList.length; i++) {
        if (this.printBill.roomList[i].floorRoomID == item.floorRoomID) {
          found = true;
          index = i;
          i = this.printBill.roomList.length + 1;
        }
      }

      for (var i = 0; i < item.billJson.length; i++) {
        for (var j = 0; j < this.printBill.roomDetailList.length; j++) {
          if (
            this.printBill.roomDetailList[j].serviceID ==
            item.billJson[i].serviceID
          ) {
            this.printBill.roomDetailList[j].quantity -=
              item.billJson[i].serviceQuantity;
          }
          if (this.printBill.roomDetailList[j].quantity == 0) {
            this.printBill.roomDetailList.splice(j, 1);
          }
        }
      }

      if (found == true) {
        this.printBill.roomList.splice(index, 1);
      }
    }

    this.printBill.lblTotal = 0;
    this.printBill.lblTotalCost = 0;
    for (var i = 0; i < this.printBill.roomDetailList.length; i++) {
      var total = 0;
      total =
        this.printBill.roomDetailList[i].quantity *
        this.printBill.roomDetailList[i].amount;
      this.printBill.lblTotal += total;
    }

    this.printBill.lblTotalCost =
      this.printBill.lblTotal - this.printBill.lblDiscount;
  }

  onDiscountChange() {
    this.printBill.lblDiscount = this.txtDiscount;

    this.printBill.lblTotalCost =
      parseInt(this.printBill.lblTotal) - parseInt(this.txtDiscount);
  }

  checkout() {
    if (this.printBill.roomList == 0) {
      this.valid.apiInfoResponse('select guest to checkout');
    } else {
      $('#checkoutModal').modal('show');
    }
  }


  saveCheckout() {
    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'guestms-api/RoomBooking/saveRoomBooking'
      )
      .subscribe((response: any[]) => {
        if (response[0].includes('Success') == true) {
          this.reset();
          if (this.formFields[0].value > 0) {
            this.valid.apiInfoResponse('Saved Successfully');
          } else {
            this.valid.apiInfoResponse('Service Added Successfully');
          }
        }
      })
  }

  print(id: any) {
    this.global.printData(id, 'portrait');
    // this.save()
  }
}
