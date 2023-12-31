import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import {
  CheckoutInterface,
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
  @Output() eventEmitterBooking = new EventEmitter();
  @Output() eventEmitterMenu = new EventEmitter();
  @Output() eventEmitterPrint = new EventEmitter();

  txtDiscount: any = 0;
  cmbServiceType: any = '';
  tblSearch: any = '';
  divVisible: any = false;
  servicesTbl: any = [];
  error: any;

  pageFields: GuestProfileInterface = {
    roomServiceID: '0', //0
    spType: '', //1
    userID: '', //2
    roomBookingDetailID: '', //3
    serviceID: '', //4
    serviceQuantity: '', //5
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
  ];

  pageFieldsCheckout: CheckoutInterface = {
    discount: '0', //0
    spType: '', //1
    userID: '', //2
    roomJson: '', //3
  };

  formFieldsCheckout: MyFormField[] = [
    {
      value: this.pageFieldsCheckout.discount,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFieldsCheckout.spType,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFieldsCheckout.userID,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFieldsCheckout.roomJson,
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
    this.formFieldsCheckout[2].value = this.global.getUserId().toString();
  }

  getGuestServiceType() {
    this.reset();
    this.serviceTitleList = [];
    this.dataService
      .getHttp(`guestms-api/Service/getGuestServiceType`, '')
      .subscribe(
        (response: any) => {
          this.servicesList = response;
          // console.log(this.servicesList);
          this.getRoomServices()

        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getServices(item: any) {
    this.dataService
      .getHttp(
        `guestms-api/Service/getServices?branchID=3&serviceTypeID=` +
        item,
        ''
      )
      .subscribe((response: any) => {
        this.serviceTitleList = response;
      });
  }

  // {
  //   "roomServiceID": 38,
  //   "roomBookingDetailID": 14,
  //   "serviceTypeID": 2,
  //   "serviceTypeTitle": "Vehicle",
  //   "serviceID": 7,
  //   "serviceTitle": "Bike",
  //   "quantity": 3,
  //   "amount": 3000
  // }
  getRoomServices() {
    var bookingID = this.formFields[3].value;
    this.dataService
      .getHttp(
        `guestms-api/Service/getRoomServices?roomBookingDetailID=` + bookingID,
        ''
      )
      .subscribe((response: any) => {
        console.log(response);
        this.servicesTbl = response
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
          this.getRoomServices()
          if (this.formFields[0].value > 0) {
            this.valid.apiInfoResponse('Saved Successfully');
          } else {
            this.valid.apiInfoResponse('Service Added Successfully');
          }
        }
      });
  }




  editServices(item: any): void {
    this.formFields[0].value = item.roomServiceID;
    // this.formFields[2].value = item.userID
    this.formFields[4].value = item.serviceID;
    this.formFields[5].value = item.quantity;
  }

  reset() {
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';
    // this.cmbServiceType = '';
  }

  edit(item: any) {
    this.eventEmitter.emit(item);
  }

  menuVisible(item: any) {
    this.eventEmitterMenu.emit(item);
  }

  printGuest(item: any) {
    if (item.status == true) {
      this.printBill.lblGuestName = item.firstName + ' ' + item.lastName;
      this.printBill.lblCNIC = item.cnic;
      this.printBill.lblMobile = item.mobileNumber;
      this.printBill.lblCheckIn = item.checkInDate;
      this.printBill.lblCheckOut = item.checkOutDate;
      this.printBill.lblRoomBookingID = item.roomBookingID;

      this.printBill.roomList.push({
        roomBookingDetailID: item.roomBookingDetailID,
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
    this.printBill.lblTax = 0;
    for (var i = 0; i < this.printBill.roomDetailList.length; i++) {
      var total = 0;
      total =
        this.printBill.roomDetailList[i].quantity *
        this.printBill.roomDetailList[i].amount;
      this.printBill.lblTotal += total;
    }

    this.printBill.lblTax = (this.printBill.lblTotal * 11) / 100;

    this.printBill.lblTotalCost =
      this.printBill.lblTotal +
      this.printBill.lblTax -
      this.printBill.lblDiscount;
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

  print(id: any) {
    this.formFieldsCheckout[0].value = this.txtDiscount;
    this.formFieldsCheckout[1].value = 'updateCheckOut';
    this.formFieldsCheckout[3].value = JSON.stringify(this.printBill.roomList);

    this.dataService
      .deleteHttp(
        this.pageFieldsCheckout,
        this.formFieldsCheckout,
        'guestms-api/RoomBooking/saveRoomBooking'
      )
      .subscribe((response: any[]) => {
        console.log(response);
        if (response[0].includes('Success') == true) {
          this.valid.apiInfoResponse('Record Checkout Successfully');
          this.eventEmitterBooking.emit();
          $('#checkoutModal').modal('hide');
          this.txtDiscount = '';

          this.global.printData(id, 'portrait');
        }
      });
  }
}
