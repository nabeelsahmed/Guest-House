import { Component, OnInit } from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { MyFormField, MenuItemsInterface } from '@general-app/shared/interface';

@Component({
  selector: 'general-app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
})
export class MenuItemsComponent implements OnInit {


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
      value: this.pageFields.roomServiceID, //0
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
      value: this.pageFields.roomBookingDetailID, //3
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.json, //4
      msg: '',
      type: '',
      required: false,
    },
  ];

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  ngOnInit(): void {
    this.getFoodProducts();
  }

  getFoodProducts() {
    this.dataService
      .getHttp('guestms-api/Service/getFoodProduct?branchID=3', '')
      .subscribe(
        (response: any) => {
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

    this.formFields[4].value = JSON.stringify(this.tableData);
    this.dataService.savetHttp(this.pageFields, this.formFields, 'guestms-api/Service/saveFoodRoomServices').subscribe(
      (response: any[]) => {
        if (response[0].includes('Success') == true) {
          if (this.formFields[0].value > 0) {
            this.valid.apiInfoResponse('Saved Successfully');
          } else {
            this.valid.apiInfoResponse('Success');
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
}
