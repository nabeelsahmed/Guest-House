import { Component, OnInit, Input } from '@angular/core';

import {
  MyFormField,
  RoomConfigModalIterface,
} from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';
import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';

@Component({
  selector: 'general-app-add-room-modal',
  templateUrl: './add-room-modal.component.html',
  styleUrls: ['./add-room-modal.component.scss']
})
export class AddRoomModalComponent implements OnInit {
  @Input() branchId: string = ''; // Add this Input property

  constructor(
    private global: SharedServicesGlobalDataModule,
    private dataService: SharedServicesDataModule,
    private valid: SharedHelpersFieldValidationsModule
  ) { }

  pageFields: RoomConfigModalIterface = {
    roomTypeID: '0', //0
    spType: '', //1
    userID: '0', //2
    roomTypeTitle: '', //3
    branch_id: '0', //4
  }

  formFields: MyFormField[] = [
    {
      value: this.pageFields.roomTypeID,
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
      value: this.pageFields.roomTypeTitle,
      msg: 'enter room type title',
      type: 'hidden',
      required: true,
    },
    {
      value: this.pageFields.branch_id,
      msg: '',
      type: 'hidden',
      required: false,
    },
  ]

  error: any = ''


  save() {
    this.dataService.savetHttp(this.pageFields, this.formFields, 'guestms-api/FloorRoom/saveRoomTypes').subscribe(
      (response: any[]) => {
        if (response[0].includes('Success') == true) {
          if (this.formFields[0].value > 0) {
            this.valid.apiInfoResponse('User updated successfully');
          } else {
            this.valid.apiInfoResponse('Room Created successfully');
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

  ngOnInit(): void {
  }




}
