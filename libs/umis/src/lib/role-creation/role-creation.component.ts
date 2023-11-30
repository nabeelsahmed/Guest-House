import { Variable } from '@angular/compiler/src/render3/r3_ast';
import {
  ANALYZE_FOR_ENTRY_COMPONENTS,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, RoleInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { RoleCreationTableComponent } from './role-creation-table/role-creation-table.component';

declare var $: any;
@Component({
  selector: 'general-app-role-creation',
  templateUrl: './role-creation.component.html',
  styleUrls: ['./role-creation.component.scss'],
})
export class RoleCreationComponent implements OnInit {
  @ViewChild(RoleCreationTableComponent) roleTable: any;
  pageFields: RoleInterface = {
    new_role_id: '0',
    spType: '',
    userId: '',
    roleTitle: '',
    roleDescription: '',
    json: [],
  };
  formFields: MyFormField[] = [
    {
      value: this.pageFields.new_role_id,
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
      value: this.pageFields.userId,
      msg: '',
      type: 'hidden',
      required: false,
    },
    {
      value: this.pageFields.roleTitle,
      msg: 'enter role title',
      type: 'name',
      required: true,
    },
    {
      value: this.pageFields.roleDescription,
      msg: 'enter role description',
      type: 'textBox',
      required: true,
    },
    {
      value: this.pageFields.json,
      msg: 'select any student',
      type: 'textbox',
      required: true,
    },
  ];

  cmbModule: any = '';
  imgUrl: any = 'assets/ui/noImage.png';
  error: any;
  // read: boolean = true;
  // write: boolean = true;
  // delete: boolean = true;

  moduleList: any = [];
  menuList: any = [];
  tempMenuList: any = [];
  tempModuleList: any = [];
  selectedModuleList: any = [];
  menuOptList: any = [];

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) {}

  ngOnInit(): void {
    this.global.setHeaderTitle('Roles Creation');
    this.formFields[2].value = this.global.getUserId().toString();

    this.getModules();
    this.getMenu();
    this.getRoleOption();
    this.getTotalRole(1);
  }

  getModules() {
    this.dataService
      .getHttp('user-api/Role/getApplicationModule', '')
      .subscribe(
        (response: any) => {
          this.moduleList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getMenu() {
    this.dataService.getHttp('user-api/Role/getMenu', '').subscribe(
      (response: any) => {
        this.tempMenuList = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  setMenuData(item: any) {
    this.menuList = this.tempMenuList.filter(
      (m: { applicationModuleId: any }) => m.applicationModuleId == item
    );
  }

  addToSelectedModulesList(itemList: any, rwd: any, str: any) {
    var data = this.menuList.filter(
      (m: { menuId: any }) => m.menuId == itemList.menuId
    );

    var read, write, del;
    if (str == 'read' && rwd == true) {
      read = true;
      write = data[0].write;
      del = data[0].delete;
      data[0].read = true;
    } else if (str == 'read' && rwd == false) {
      read = false;
      write = data[0].write;
      del = data[0].delete;
      data[0].read = false;
    }
    if (str == 'write' && rwd == true) {
      write = true;
      read = data[0].read;
      del = data[0].delete;
      data[0].write = true;
    } else if (str == 'write' && rwd == false) {
      write = false;
      read = data[0].read;
      del = data[0].delete;
      data[0].write = false;
    }
    if (str == 'delete' && rwd == true) {
      del = true;
      read = data[0].read;
      write = data[0].write;
      data[0].delete = true;
    } else if (str == 'delete' && rwd == false) {
      del = false;
      read = data[0].read;
      write = data[0].write;
      data[0].delete = false;
    }

    if (
      this.tempModuleList.filter(
        (m: { applicationModuleId: any }) =>
          m.applicationModuleId == itemList.applicationModuleId
      ).length == 0
    ) {
      this.selectedModuleList = [];

      this.selectedModuleList.push({
        menuId: itemList.menuId,
        menuTitle: itemList.menuTitle,
        read: read,
        write: write,
        delete: del,
      });

      this.tempModuleList.push({
        applicationModuleId: itemList.applicationModuleId,
        applicationModuleTitle: itemList.applicationModuleTitle,
        tempMenuList: this.selectedModuleList,
      });
    } else {
      var index = this.tempModuleList.findIndex(
        (m: { applicationModuleId: any }) =>
          m.applicationModuleId == itemList.applicationModuleId
      );
      if (
        this.tempModuleList[index].tempMenuList.filter(
          (m: { menuId: any }) => m.menuId == itemList.menuId
        ).length == 0
      ) {
        this.tempModuleList[index].tempMenuList.push({
          applicationModuleId: itemList.applicationModuleId,
          applicationModuleTitle: itemList.applicationModuleTitle,
          menuId: itemList.menuId,
          menuTitle: itemList.menuTitle,
          read: read,
          write: write,
          delete: del,
        });
      } else {
        var childIndex = this.tempModuleList[index].tempMenuList.findIndex(
          (m: { menuId: any }) => m.menuId == itemList.menuId
        );

        this.tempModuleList[index].tempMenuList[childIndex].read = read;
        this.tempModuleList[index].tempMenuList[childIndex].write = write;
        this.tempModuleList[index].tempMenuList[childIndex].delete = del;

        if (
          this.tempModuleList[index].tempMenuList[childIndex].read == false &&
          this.tempModuleList[index].tempMenuList[childIndex].write == false &&
          this.tempModuleList[index].tempMenuList[childIndex].delete == false
        ) {
          this.tempModuleList[index].tempMenuList.splice(childIndex, 1);
        }
        if (this.tempModuleList[index].tempMenuList.length == 0) {
          this.tempModuleList.splice(index, 1);
        }
      }
    }
  }

  removeModule(index: any, item: any) {
    this.tempModuleList.splice(index, 1);

    var data = this.menuList.filter(
      (m: { applicationModuleId: any }) =>
        m.applicationModuleId == item.applicationModuleId
    );
    for (var i = 0; i < data.length; i++) {
      data[i].read = false;
      data[i].write = false;
      data[i].delete = false;
    }
  }

  getRoleOption() {
    this.dataService
      .getHttp('user-api/Role/getMenuRoleByModuleId', '')
      .subscribe(
        (response: any) => {
          this.menuOptList = response;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getTotalRole(item: any) {
    var roleField = {
      roleId: '',
    };

    var roleData: MyFormField[] = [
      {
        value: roleField.roleId,
        msg: 'select role ID',
        type: 'label',
        required: false,
      },
    ];

    roleData[0].value = item;

    this.dataService
      .receivedtHttp(roleField, roleData, 'user-api/Role/getMenuListAllRoles')
      .subscribe(
        (response: any) => {
          console.log(response.message);

          this.tempMenuList = JSON.parse(response.message);
          $('#roleModal').modal('hide');
          // alert(this.tempMenuList.menuTitle);
        },
        (error: any) => {
          this.error = error;
          this.valid.apiErrorResponse(this.error);
        }
      );
  }

  save() {
    this.formFields[5].value = JSON.stringify(this.tempModuleList);

    if (this.formFields[5].value == '[]') {
      this.valid.apiErrorResponse('select menu items');
      return;
    }
    this.dataService
      .savetHttp(this.pageFields, this.formFields, 'user-api/Role/createRole')
      .subscribe(
        (response: any[]) => {
          if (response[0].includes('Success') == true) {
            if (this.formFields[0].value > 0) {
              this.valid.apiInfoResponse('Role updated successfully');
            } else {
              this.valid.apiInfoResponse('Role created successfully');
            }
            this.roleTable.getRoles();
            this.getRoleOption();
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
    // this.getApplicationMenu();
    this.getMenu();
    this.cmbModule = '';
    this.tempModuleList = [];
    this.selectedModuleList = [];
    this.menuList = [];
    this.formFields = this.valid.resetFormFields(this.formFields);
    this.formFields[0].value = '0';
  }

  edit(item: any) {
    this.cmbModule = '';
    this.tempModuleList = [];
    this.selectedModuleList = [];
    this.menuList = [];

    this.getTotalRole(item.roleId);

    this.formFields = this.valid.resetFormFields(this.formFields);

    this.formFields[3].value = item.roleTitle;
    this.formFields[4].value = item.roleDescription;
    this.formFields[0].value = item.roleId;

    // this.moduleList = this.tempMenuList.filter(
    //   (b: { roleId: any }) => b.roleId == item.roleId
    // );

    var tempList = this.menuOptList.filter(
      (a: { roleId: any }) => a.roleId == item.roleId
    );

    var found = false;
    console.log(tempList);
    for (var i = 0; i < tempList.length; i++) {
      if (this.tempModuleList.length == 0) {
        for (var j = 0; j < tempList.length; j++) {
          if (
            tempList[i].applicationModuleId == tempList[j].applicationModuleId
          ) {
            this.selectedModuleList.push({
              menuId: tempList[j].menuId,
              menuTitle: tempList[j].menuTitle,
              read: tempList[j].read,
              write: tempList[j].write,
              delete: tempList[j].delete,
            });
          }
        }
        this.tempModuleList.push({
          applicationModuleId: tempList[i].applicationModuleId,
          applicationModuleTitle: tempList[i].applicationModuleTitle,
          tempMenuList: this.selectedModuleList,
        });
      } else {
        found = false;
        for (var j = 0; j < this.tempModuleList.length; j++) {
          if (
            tempList[i].applicationModuleId ==
            this.tempModuleList[j].applicationModuleId
          ) {
            found = true;
            j = this.tempModuleList.length + 1;
          }
        }
        if (found == false) {
          this.selectedModuleList = [];
          for (var j = 0; j < tempList.length; j++) {
            if (
              tempList[i].applicationModuleId == tempList[j].applicationModuleId
            ) {
              this.selectedModuleList.push({
                menuId: tempList[j].menuId,
                menuTitle: tempList[j].menuTitle,
                read: tempList[j].read,
                write: tempList[j].write,
                delete: tempList[j].delete,
              });
            }
          }
          this.tempModuleList.push({
            applicationModuleId: tempList[i].applicationModuleId,
            applicationModuleTitle: tempList[i].applicationModuleTitle,
            tempMenuList: this.selectedModuleList,
          });
        }
      }
    }
  }

  delete(item: any) {
    this.reset();
  }
}
