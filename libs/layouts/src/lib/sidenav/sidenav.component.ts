import { Component, OnInit } from '@angular/core';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'general-app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  clickEventSubscription: Subscription;

  lblModuleTitle: string = '';
  moduleId: string | null;

  public config: PerfectScrollbarConfigInterface = {};

  public menuList?: any = [];

  constructor(
    private router: Router,
    private globalService: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule
  ) {
    this.clickEventSubscription = this.globalService
      .getMenuItems()
      .subscribe((data: any) => {
        this.moduleId = data;
        this.getMenuData();
      });
  }

  ngOnInit() {
    this.moduleId = localStorage.getItem('moduleId');
    this.getMenuData();
  }

  getMenuData() {
    if (
      this.moduleId != null &&
      (typeof this.moduleId == 'string' || typeof this.moduleId == 'number')
    ) {
      this.dataService
        .getHttp(
          'user-api/ApplicationModule/getMenu?roleId=' +
            this.globalService.getRoleId() +
            '&moduleId=' +
            this.moduleId,
          ''
        )
        .subscribe((response: any) => {
          if (this.router.url != '/home')
            this.globalService.checkRouterUrl(response, this.router.url);

          /************** Old Code **************/
          // this.menuList = response;

          /************** New Code **************/
          var menuChild: any = [];
          var parentId = 0;
          var found = false;
          this.menuList = [];
          this.lblModuleTitle = response[0].applicationModuleTitle;

          for (let i = 0; i < response.length; i++) {
            const currentMenu = response[i];
            const parentMenuId = currentMenu.parentMenuId;
            const menuId = currentMenu.menuId;

            if (parentMenuId === 0) {
              // If parentMenuId is 0, it is a top-level menu
              const menuChild: any[] = [];

              for (let j = 0; j < response.length; j++) {
                if (menuChild.length === 0) {
                  if (response[j].parentMenuId === menuId) {
                    menuChild.push(response[j]);
                  }
                } else {
                  const item = menuChild.filter(
                    (m) => m.parentMenuId === response[j].parentMenuId
                  );

                  if (item.length > 0) {
                    menuChild.push(response[j]);
                  }
                }
              }

              const menuObj = {
                applicationModuleId: currentMenu.applicationModuleId,
                applicationModuleTitle: currentMenu.applicationModuleTitle,
                delete: currentMenu.delete,
                menuId: currentMenu.menuId,
                menuSeq: currentMenu.menuSeq,
                menuTitle: currentMenu.menuTitle,
                parentMenuId: currentMenu.parentMenuId,
                parentRoute: currentMenu.parentRoute,
                read: currentMenu.read,
                routeTitle: currentMenu.routeTitle,
                write: currentMenu.write,
                menuIcon: currentMenu.menuIcon,
                children: menuChild,
              };

              this.menuList.push(menuObj);
            } else {
              let found = false;
              let parentId = 0;
              let menuChild: any[] = [];

              if (menuChild.length === 0) {
                for (let j = 0; j < response.length; j++) {
                  if (found) {
                    break;
                  } else {
                    if (response[j].parentMenuId !== 0) {
                      const data = this.menuList.filter(
                        (x: any) => x.menuId === response[j].parentMenuId
                      );

                      if (menuChild.length === 0) {
                        if (data.length === 0) {
                          parentId = response[j].parentMenuId;

                          menuChild.push(response[j]);
                        }
                      } else {
                        const item = menuChild.filter(
                          (m) => m.parentMenuId === response[j].parentMenuId
                        );

                        if (item.length > 0) {
                          menuChild.push(response[j]);
                        }
                      }
                    }
                  }
                }
              }

              if (currentMenu.parentMenuId === 0) {
                if (parentId === currentMenu.menuId) {
                  const menuObj = {
                    applicationModuleId: currentMenu.applicationModuleId,
                    applicationModuleTitle: currentMenu.applicationModuleTitle,
                    delete: currentMenu.delete,
                    menuId: currentMenu.menuId,
                    menuSeq: currentMenu.menuSeq,
                    menuTitle: currentMenu.menuTitle,
                    parentMenuId: currentMenu.parentMenuId,
                    parentRoute: currentMenu.parentRoute,
                    read: currentMenu.read,
                    routeTitle: currentMenu.routeTitle,
                    write: currentMenu.write,
                    menuIcon: currentMenu.menuIcon,
                    children: menuChild,
                  };

                  this.menuList.push(menuObj);
                  menuChild = [];
                  parentId = 0;
                  found = false;
                } else {
                  const menuObj = {
                    applicationModuleId: currentMenu.applicationModuleId,
                    applicationModuleTitle: currentMenu.applicationModuleTitle,
                    delete: currentMenu.delete,
                    menuId: currentMenu.menuId,
                    menuSeq: currentMenu.menuSeq,
                    menuTitle: currentMenu.menuTitle,
                    parentMenuId: currentMenu.parentMenuId,
                    parentRoute: currentMenu.parentRoute,
                    read: currentMenu.read,
                    routeTitle: currentMenu.routeTitle,
                    write: currentMenu.write,
                    menuIcon: currentMenu.menuIcon,
                    children: menuChild as any[],
                  };

                  this.menuList.push(menuObj);
                  found = true;
                }
              }
            }
          }

          // The menuList will contain the menu structure

          // for (var i = 0; i < response.length; i++) {
          //   if (this.menuList.length == 0) {
          //     this.menuList.push({
          //       applicationModuleId: response[i].applicationModuleId,
          //       applicationModuleTitle: response[i].applicationModuleTitle,
          //       delete: response[i].delete,
          //       menuId: response[i].menuId,
          //       menuSeq: response[i].menuSeq,
          //       menuTitle: response[i].menuTitle,
          //       parentMenuId: response[i].parentMenuId,
          //       parentRoute: response[i].parentRoute,
          //       read: response[i].read,
          //       routeTitle: response[i].routeTitle,
          //       write: response[i].write,
          //       menuIcon: response[i].menuIcon,
          //       children: [],
          //     });
          //   } else {
          //     if (menuChild.length == 0) {
          //       for (var j = 0; j < response.length; j++) {
          //         if (found == true) {
          //           j = response.length + 1;
          //         } else {
          //           if (response[j].parentMenuId != 0) {
          //             var data = this.menuList.filter(
          //               (x: { menuId: any }) =>
          //                 x.menuId == response[j].parentMenuId
          //             );
          //             if (menuChild.length == 0) {
          //               if (data.length == 0) {
          //                 parentId = response[j].parentMenuId;

          //                 menuChild.push({
          //                   applicationModuleId:
          //                     response[j].applicationModuleId,
          //                   applicationModuleTitle:
          //                     response[j].applicationModuleTitle,
          //                   delete: response[j].delete,
          //                   menuId: response[j].menuId,
          //                   menuSeq: response[j].menuSeq,
          //                   menuTitle: response[j].menuTitle,
          //                   parentMenuId: response[j].parentMenuId,
          //                   parentRoute: response[j].parentRoute,
          //                   read: response[j].read,
          //                   routeTitle: response[j].routeTitle,
          //                   write: response[j].write,
          //                   menuIcon: response[j].menuIcon,
          //                 });
          //               }
          //             } else {
          //               var item = menuChild.filter(
          //                 (m: { parentMenuId: any }) =>
          //                   m.parentMenuId == response[j].parentMenuId
          //               );
          //               if (item.length > 0) {
          //                 menuChild.push({
          //                   applicationModuleId:
          //                     response[j].applicationModuleId,
          //                   applicationModuleTitle:
          //                     response[j].applicationModuleTitle,
          //                   delete: response[j].delete,
          //                   menuId: response[j].menuId,
          //                   menuSeq: response[j].menuSeq,
          //                   menuTitle: response[j].menuTitle,
          //                   parentMenuId: response[j].parentMenuId,
          //                   parentRoute: response[j].parentRoute,
          //                   read: response[j].read,
          //                   routeTitle: response[j].routeTitle,
          //                   write: response[j].write,
          //                   menuIcon: response[j].menuIcon,
          //                 });
          //               }
          //             }
          //           }
          //         }
          //       }
          //     }
          //     if (response[i].parentMenuId == 0) {
          //       if (parentId == response[i].menuId) {
          //         this.menuList.push({
          //           applicationModuleId: response[i].applicationModuleId,
          //           applicationModuleTitle: response[i].applicationModuleTitle,
          //           delete: response[i].delete,
          //           menuId: response[i].menuId,
          //           menuSeq: response[i].menuSeq,
          //           menuTitle: response[i].menuTitle,
          //           parentMenuId: response[i].parentMenuId,
          //           parentRoute: response[i].parentRoute,
          //           read: response[i].read,
          //           routeTitle: response[i].routeTitle,
          //           write: response[i].write,
          //           menuIcon: response[i].menuIcon,
          //           children: menuChild,
          //         });
          //         menuChild = [];
          //         parentId = 0;
          //         found = false;
          //       } else {
          //         this.menuList.push({
          //           applicationModuleId: response[i].applicationModuleId,
          //           applicationModuleTitle: response[i].applicationModuleTitle,
          //           delete: response[i].delete,
          //           menuId: response[i].menuId,
          //           menuSeq: response[i].menuSeq,
          //           menuTitle: response[i].menuTitle,
          //           parentMenuId: response[i].parentMenuId,
          //           parentRoute: response[i].parentRoute,
          //           read: response[i].read,
          //           routeTitle: response[i].routeTitle,
          //           write: response[i].write,
          //           menuIcon: response[i].menuIcon,
          //           children: [],
          //         });

          //         found = true;
          //       }
          //     }
          //   }
          // }
        });
    }
  }

  openLink(page_title: string) {
    if (page_title == 'Attendance-Dashboard') {
      localStorage.setItem('branchID', '0');
    }
    this.globalService.setHeaderTitle(page_title);
  }
}
