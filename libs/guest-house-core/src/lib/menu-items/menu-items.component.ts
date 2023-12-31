import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { MyFormField, MenuItemsInterface } from '@general-app/shared/interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'general-app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
})
export class MenuItemsComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();

  branchID: any = 0;

  lblTotal: any = 0;
  itemList: any = [];
  tableData: any = [];
  error: any = '';

  pageFields: MenuItemsInterface = {
    roomServiceID: '0', //0
    spType: '', //1
    userID: '0', //2
    roomBookingDetailID: '', //3
    json: '', //4
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
      value: this.pageFields.json,
      msg: 'select menu items',
      type: 'json',
      required: true,
    },
  ];

  clickEventSubscription: Subscription;

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {
    this.clickEventSubscription = this.global
      .getRoomBookingDetail()
      .subscribe((data: any) => {
        console.log(data);
        this.formFields[3].value = data.roomBookingDetailID;
      });
  }

  ngOnInit(): void {
    this.getFoodProducts();

    if (this.global.getBranchID() == 0) {
      this.branchID = 3;
    } else {
      this.branchID = this.global.getBranchID();
    }

    this.formFields[2].value = this.global.getUserId().toString();
  }

  getFoodProducts() {
    this.dataService
      .getHttp(
        'guestms-api/Service/getFoodProduct?branchID=' + this.branchID,
        ''
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          this.itemList = [];
          for (var i = 0; i < response.length; i++) {
            var jsonList = [];
            jsonList = JSON.parse(response[i].subServices);
            this.itemList.push({
              serviceTypeID: response[i].serviceID,
              serviceTypeName: response[i].serviceTitle,
              itemJson: jsonList,
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  addProduct(mainItem: any, jsonItem: any, index: any) {
    mainItem.itemJson[index].quantity += 1;

    if (this.tableData.length == 0) {
      this.tableData.push({
        serviceID: jsonItem.serviceID,
        serviceTitle: jsonItem.serviceTitle,
        serviceCharges: jsonItem.serviceCharges,
        quantity: mainItem.itemJson[index].quantity,
      });
    } else {
      var found = false;
      var ind = 0;
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].serviceID == jsonItem.serviceID) {
          ind = i;
          found = true;
          i = this.tableData.length + 1;
        }
      }
      if (found == true) {
        this.tableData[ind].quantity = mainItem.itemJson[index].quantity;
      } else {
        this.tableData.push({
          serviceID: jsonItem.serviceID,
          serviceTitle: jsonItem.serviceTitle,
          serviceCharges: jsonItem.serviceCharges,
          quantity: mainItem.itemJson[index].quantity,
        });
      }
    }

    this.lblTotal = 0;
    for (var i = 0; i < this.tableData.length; i++) {
      this.lblTotal +=
        parseInt(this.tableData[i].serviceCharges) *
        parseInt(this.tableData[i].quantity);
    }
  }

  removeProduct(mainItem: any, jsonItem: any, index: any) {
    if (mainItem.itemJson[index].quantity > 0) {
      mainItem.itemJson[index].quantity -= 1;

      if (mainItem.itemJson[index].quantity >= 1) {
        var found = false;
        var ind = 0;
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].serviceID == jsonItem.serviceID) {
            ind = i;
            found = true;
            i = this.tableData.length + 1;
          }
        }
        if (found == true) {
          this.tableData[ind].quantity = mainItem.itemJson[index].quantity;
        }
      } else {
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].serviceID == jsonItem.serviceID) {
            this.tableData.splice(i, 1);
            i = this.tableData.length + 1;
          }
        }
      }
    }

    this.lblTotal = 0;
    for (var i = 0; i < this.tableData.length; i++) {
      this.lblTotal +=
        parseInt(this.tableData[i].serviceCharges) *
        parseInt(this.tableData[i].quantity);
    }
  }

  save() {
    if (this.tableData.length > 0) {
      this.formFields[4].value = JSON.stringify(this.tableData);
    }

    this.dataService
      .savetHttp(
        this.pageFields,
        this.formFields,
        'guestms-api/Service/saveFoodRoomServices'
      )
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
            this.valid.apiInfoResponse('Order Placed Successfully');

            this.eventEmitter.emit();
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

  back() {
    this.eventEmitter.emit();
  }
}
