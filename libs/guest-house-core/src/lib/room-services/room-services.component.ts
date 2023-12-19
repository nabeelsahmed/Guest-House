import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';



interface UploadEvent {
  originalEvent: Event;
  files: File[];
}




@Component({
  selector: 'general-app-room-services',
  templateUrl: './room-services.component.html',
  styleUrls: ['./room-services.component.scss']
})
export class RoomServicesComponent implements OnInit {



  formGroup: FormGroup | undefined;
  uploadedFiles: any[] = [];

  constructor() {

  }

  ngOnInit() {

  }

}
